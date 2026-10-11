import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle, Check, CheckCheck, ChevronLeft, ChevronRight, Inbox, LoaderCircle,
  Mail, MailOpen, MessageCircle, RefreshCw, Search, Send, Trash2, UserRound, X
} from "lucide-react";
import { BASE_URL } from "../../services/BaseUrl";

const PAGE_SIZE = 8;

function tokenFromStorage() {
  const keys = ["portfolio_token", "adminToken", "accessToken", "authToken", "token", "jwt"];
  for (const key of keys) {
    const token = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (token) return token;
  }
  for (const key of ["authUser", "user", "auth", "admin"]) {
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (!raw) continue;
    try {
      const data = JSON.parse(raw);
      const token = data?.token || data?.accessToken || data?.access_token ||
        data?.user?.token || data?.user?.accessToken;
      if (token) return token;
    } catch {}
  }
  return "";
}

const idOf = (item) => item?._id || item?.id;
const readOf = (item) => Boolean(item?.isRead);
const dateOf = (item) => {
  const value = item?.createdAt || item?.created_at;
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" :
    new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
};
const initials = (name = "") => name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  .map((part) => part[0].toUpperCase()).join("") || "U";
const messageList = (data) => Array.isArray(data) ? data :
  data?.messages || data?.data?.messages || data?.data || [];

export default function MessageAdmin() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const api = useCallback(async (path, options = {}) => {
    const token = tokenFromStorage();
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const text = await response.text();
    let data = null;
    if (text) {
      try { data = JSON.parse(text); } catch { data = { message: text }; }
    }
    if (!response.ok) {
      throw new Error(data?.message || data?.detail || data?.error || `Request failed (${response.status})`);
    }
    return data;
  }, []);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/messages");
      const list = messageList(data);
      setMessages(list.sort((a, b) =>
        new Date(b?.createdAt || b?.created_at || 0) - new Date(a?.createdAt || a?.created_at || 0)
      ));
    } catch (err) {
      setError(err.message || "Unable to load messages. Check your API and admin token.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  const unread = useMemo(() => messages.filter((m) => !readOf(m)).length, [messages]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return messages.filter((m) => {
      const matchesRead = filter === "all" || (filter === "unread" && !readOf(m)) ||
        (filter === "read" && readOf(m));
      const text = [m.name, m.email, m.subject, m.message].filter(Boolean).join(" ").toLowerCase();
      return matchesRead && (!query || text.includes(query));
    });
  }, [messages, search, filter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const shown = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [search, filter]);

  const markRead = async (message) => {
    const id = idOf(message);
    if (!id || readOf(message)) return;
    setBusyId(id);
    setError("");
    try {
      const data = await api(`/api/messages/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isRead: true }),
      });
      const updated = data?.message || data?.data || data;
      setMessages((items) => items.map((item) => idOf(item) === id ?
        { ...item, ...(updated || {}), isRead: true } : item));
      setSelected((item) => item && idOf(item) === id ?
        { ...item, ...(updated || {}), isRead: true } : item);
      setNotice("Message marked as read.");
    } catch (err) {
      setError(`${err.message}. Check that PUT /api/messages/:id supports { isRead: true }.`);
    } finally { setBusyId(""); }
  };

  const deleteMessage = async (message) => {
    const id = idOf(message);
    if (!id || !window.confirm(`Delete the message from ${message.name || "this sender"}?`)) return;
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      await api(`/api/messages/${id}`, { method: "DELETE" });
      setMessages((items) => items.filter((item) => idOf(item) !== id));
      setSelected((item) => item && idOf(item) === id ? null : item);
      setNotice("Message deleted.");
    } catch (err) {
      setError(`${err.message}. Check that DELETE /api/messages/:id exists on your backend.`);
    } finally { setBusyId(""); }
  };

  const openMessage = async (message) => {
    setSelected(message);
    setNotice("");
    const id = idOf(message);
    if (!id) return;
    setDetailLoading(true);
    try {
      // Load the specific message if the backend provides GET /api/messages/:id.
      try {
        const data = await api(`/api/messages/${id}`);
        const item = data?.message || data?.data || data;
        if (item && idOf(item)) setSelected(item);
      } catch {
        // Keep the message returned from GET /api/messages if detail route is absent.
      }
      if (!readOf(message)) await markRead(message);
    } finally { setDetailLoading(false); }
  };

  return (
    <main className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      <div className="mx-auto max-w-375 px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold tracking-wider text-primary">
              <MessageCircle size={14} /> INBOX MANAGEMENT
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Messages<span className="text-primary">.</span></h1>
            <p className="mt-2 text-sm text-base-content/60 sm:text-base">Read and manage messages sent through your portfolio.</p>
          </div>
          <button onClick={loadMessages} disabled={loading} className="btn btn-outline btn-sm self-start rounded-xl border-base-300 sm:self-auto">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh inbox
          </button>
        </header>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Stat icon={<Inbox size={19} />} label="Total messages" value={messages.length} tone="primary" />
          <Stat icon={<Mail size={19} />} label="Unread" value={unread} tone="warning" />
          <Stat icon={<MailOpen size={19} />} label="Read" value={messages.length - unread} tone="success" />
        </div>

        {error && <div role="alert" className="alert alert-error mb-4 rounded-2xl">
          <AlertCircle size={18} /><span className="min-w-0 flex-1 wrap-break-word text-sm">{error}</span>
          <button onClick={() => setError("")} className="btn btn-ghost btn-xs btn-square" aria-label="Dismiss"><X size={16} /></button>
        </div>}
        {notice && <div role="status" className="alert alert-success mb-4 rounded-2xl">
          <CheckCheck size={18} /><span>{notice}</span>
          <button onClick={() => setNotice("")} className="btn btn-ghost btn-xs btn-square ml-auto" aria-label="Dismiss"><X size={16} /></button>
        </div>}

        <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-base-300 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                ["all", "All", messages.length],
                ["unread", "Unread", unread],
                ["read", "Read", messages.length - unread],
              ].map(([key, label, count]) => <button key={key} onClick={() => setFilter(key)}
                className={`btn btn-sm rounded-xl ${filter === key ? "btn-primary" : "btn-ghost border border-base-300"}`}>
                {label}<span className="badge badge-sm badge-ghost">{count}</span>
              </button>)}
            </div>
            <label className="input input-bordered flex w-full items-center gap-2 rounded-xl border-base-300 bg-base-100 lg:max-w-sm">
              <Search size={17} className="text-base-content/40" />
              <input className="grow text-sm" type="search" value={search}
                onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, subject…" />
              {search && <button className="btn btn-ghost btn-xs btn-square" onClick={() => setSearch("")} aria-label="Clear search"><X size={14} /></button>}
            </label>
          </div>

          {loading ? <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <span className="loading loading-spinner loading-lg text-primary" /><p className="text-sm text-base-content/60">Loading inbox…</p>
          </div> : shown.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-base-200 text-base-content/50"><Inbox size={28} /></div>
            <h2 className="text-lg font-bold">{search || filter !== "all" ? "No matching messages" : "Your inbox is empty"}</h2>
            <p className="mt-2 max-w-sm text-sm text-base-content/60">{search || filter !== "all" ? "Try a different search or filter." : "Contact form submissions will appear here."}</p>
            {(search || filter !== "all") && <button className="btn btn-ghost btn-sm mt-3" onClick={() => { setSearch(""); setFilter("all"); }}>Clear filters</button>}
          </div> : <>
            <div className="divide-y divide-base-300">
              {shown.map((message) => {
                const id = idOf(message);
                const isRead = readOf(message);
                const busy = busyId === id;
                return <article key={id || `${message.email}-${message.createdAt}`}
                  className={`group flex flex-col gap-4 p-4 transition-colors hover:bg-base-200/50 sm:flex-row sm:items-start sm:p-5 ${!isRead ? "bg-primary/[0.035]" : ""}`}>
                  <button onClick={() => openMessage(message)} className="flex min-w-0 flex-1 items-start gap-3 text-left sm:gap-4">
                    <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${isRead ? "bg-base-200 text-base-content/70" : "bg-primary/15 text-primary"}`}>{initials(message.name)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2"><h3 className={`truncate text-sm ${isRead ? "font-semibold" : "font-extrabold"}`}>{message.name || "Unknown sender"}</h3>
                        {!isRead && <span className="badge badge-primary badge-xs">New</span>}</div>
                      <p className="mt-1 truncate text-xs text-base-content/55 sm:text-sm">{message.email || "No email provided"}</p>
                      <p className={`mt-3 truncate text-sm ${isRead ? "font-medium text-base-content/75" : "font-bold"}`}>{message.subject || "No subject"}</p>
                      <p className="mt-1 line-clamp-2 wrap-break-word text-sm leading-6 text-base-content/60">{message.message || "No message content"}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-base-content/45">
                        <span>{dateOf(message)}</span>
                        <span className="inline-flex items-center gap-1" title={isRead ? "Read" : "Unread"} aria-label={isRead ? "Message read" : "Message unread"}>
                          {isRead ? <CheckCheck size={17} className="text-info" /> : <Check size={16} className="text-base-content/40" />}
                          <span className={isRead ? "font-semibold text-info" : "text-base-content/45"}>{isRead ? "Read" : "Sent"}</span>
                        </span>
                      </div>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <button title="Delete message" aria-label="Delete message" disabled={busy} onClick={() => deleteMessage(message)}
                      className="btn btn-ghost btn-sm btn-square rounded-xl text-base-content/60 hover:bg-error/10 hover:text-error disabled:opacity-35"><Trash2 size={17} /></button>
                  </div>
                </article>;
              })}
            </div>
            <footer className="flex flex-col gap-3 border-t border-base-300 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-base-content/55 sm:text-sm">Showing <b className="text-base-content">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</b> of <b className="text-base-content">{filtered.length}</b> messages</p>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button className="btn btn-outline btn-sm btn-square rounded-xl border-base-300" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} aria-label="Previous page"><ChevronLeft size={17} /></button>
                <span className="min-w-20 text-center text-xs font-semibold text-base-content/70">Page {currentPage} of {pages}</span>
                <button className="btn btn-outline btn-sm btn-square rounded-xl border-base-300" disabled={currentPage >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} aria-label="Next page"><ChevronRight size={17} /></button>
              </div>
            </footer>
          </>}
        </section>
      </div>

      {selected && <div className="modal modal-open z-50 bg-black/45 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="message-title"
        onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
        <div className="modal-box max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-base-300 bg-base-100 p-0 text-base-content shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-base-300 bg-base-100/95 px-5 py-4 backdrop-blur sm:px-7">
            <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><MailOpen size={19} /></div>
              <div><h2 id="message-title" className="font-bold">Message details</h2><p className="text-xs text-base-content/55">{detailLoading ? "Loading details…" : "Contact submission"}</p></div>
            </div>
            <button onClick={() => setSelected(null)} className="btn btn-ghost btn-sm btn-square rounded-xl" aria-label="Close"><X size={18} /></button>
          </div>
          <div className="space-y-6 p-5 sm:p-7">
            <div className="flex items-start gap-4"><div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 font-bold text-primary">{initials(selected.name)}</div>
              <div className="min-w-0 flex-1"><h3 className="wrap-break-word text-lg font-bold">{selected.name || "Unknown sender"}</h3><p className="mt-1 break-all text-sm text-base-content/60">{selected.email || "No email"}</p><p className="mt-2 text-xs text-base-content/45">{dateOf(selected)}</p></div>
              <span className={`badge ${readOf(selected) ? "badge-success badge-outline" : "badge-primary"}`}>{readOf(selected) ? "Read" : "Unread"}</span>
            </div>
            <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4 sm:p-5"><p className="text-xs font-bold uppercase tracking-widest text-base-content/45">Subject</p><p className="mt-2 wrap-break-word font-bold">{selected.subject || "No subject"}</p></div>
            <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-base-content/45">Message</p><p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-base-content/80">{selected.message || "No message content"}</p></div>
            <div className="flex flex-col-reverse gap-2 border-t border-base-300 pt-5 sm:flex-row sm:justify-between">
              <button onClick={() => deleteMessage(selected)} disabled={busyId === idOf(selected)} className="btn btn-outline btn-error rounded-xl"><Trash2 size={16} /> Delete message</button>
              <div className="flex flex-col gap-2 sm:flex-row">
                {selected.email && <a className="btn btn-outline rounded-xl border-base-300" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || "Your message"}`)}`}><Send size={16} /> Reply by email</a>}
                {!readOf(selected) && <button onClick={() => markRead(selected)} disabled={busyId === idOf(selected)} className="btn btn-primary rounded-xl">{busyId === idOf(selected) ? <LoaderCircle size={16} className="animate-spin" /> : <CheckCheck size={16} />} Mark as read</button>}
              </div>
            </div>
          </div>
        </div>
        <button className="modal-backdrop" onClick={() => setSelected(null)} aria-label="Close dialog">close</button>
      </div>}
    </main>
  );
}

function Stat({ icon, label, value, tone }) {
  const colors = {
    primary: "bg-primary/10 text-primary ring-primary/10",
    warning: "bg-warning/15 text-warning-content ring-warning/15",
    success: "bg-success/10 text-success ring-success/10",
  };
  return <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
    <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-medium text-base-content/55">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight">{value}</p></div>
      <div className={`flex size-11 items-center justify-center rounded-2xl ring-1 ${colors[tone]}`}>{icon}</div></div>
  </div>;
}

import React, { useCallback, useEffect, useState } from "react";

import { Link } from "react-router";

import {
    FolderKanban,
    Code2,
    Mail,
    MailOpen,
    Image,
    UserRound,
    ArrowUpRight,
    ExternalLink,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Clock3,
    Activity,
    Sparkles,
} from "lucide-react";

import { BASE_URL } from "../../services/BaseUrl";

const API_BASE = BASE_URL.replace(/\/+$/, "");

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [messages, setMessages] = useState([]);
    const [covers, setCovers] = useState([]);
    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [apiErrors, setApiErrors] = useState({});
    const [lastUpdated, setLastUpdated] = useState(null);

    // Normalize different API response formats
    const normalizeArray = (result, keys = []) => {
        if (Array.isArray(result)) {
            return result;
        }

        if (!result || typeof result !== "object") {
            return [];
        }

        for (const key of keys) {
            if (Array.isArray(result[key])) {
                return result[key];
            }
        }

        if (result.data && Array.isArray(result.data)) {
            return result.data;
        }

        if (
            result.data &&
            typeof result.data === "object"
        ) {
            for (const key of keys) {
                if (Array.isArray(result.data[key])) {
                    return result.data[key];
                }
            }
        }

        return [];
    };

    // Read the JWT created by your Portfolio Admin Login.
    // Prefer common token keys; also support an auth object saved as JSON.
    const getAuthToken = () => {
        const tokenKeys = [
            "portfolio_token",
            "adminToken",
            "accessToken",
            "authToken",
            "token",
            "jwt",
        ];

        for (const key of tokenKeys) {
            const value =
                localStorage.getItem(key) || sessionStorage.getItem(key);

            if (value) {
                return value.startsWith("Bearer ")
                    ? value.slice(7)
                    : value;
            }
        }

        const authKeys = ["authUser", "user", "auth", "admin"];

        for (const key of authKeys) {
            const raw =
                localStorage.getItem(key) || sessionStorage.getItem(key);

            if (!raw) continue;

            try {
                const parsed = JSON.parse(raw);
                const token =
                    parsed?.token ||
                    parsed?.accessToken ||
                    parsed?.access_token ||
                    parsed?.user?.token ||
                    parsed?.user?.accessToken;

                if (token) {
                    return token.startsWith("Bearer ")
                        ? token.slice(7)
                        : token;
                }
            } catch {
                // Ignore values that are not JSON.
            }
        }

        return null;
    };

    // Fetch one endpoint independently.
    // Protected admin endpoints receive the JWT in Authorization.
    const fetchEndpoint = async (endpoint) => {
        const token = getAuthToken();

        const headers = {
            Accept: "application/json",
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error(
                    `${response.status} ${response.statusText || "Unauthorized"}. ` +
                    "Admin login/token is missing, expired, or invalid. " +
                    "Check the token key used by AuthProvider."
                );
            }

            throw new Error(
                `${response.status} ${response.statusText || "Request failed"}`
            );
        }

        return response.json();
    };

    // Fetch all dashboard data
    const loadDashboard = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        const endpoints = [
            {
                key: "projects",
                path: "/api/projects",
            },
            {
                key: "skills",
                path: "/api/skills",
            },
            {
                key: "messages",
                path: "/api/messages",
            },
            {
                key: "covers",
                path: "/api/cover",
            },
            {
                key: "profile",
                path: "/api/profile",
            },
        ];

        const errors = {};

        try {
            const results = await Promise.allSettled(
                endpoints.map((endpoint) =>
                    fetchEndpoint(endpoint.path)
                )
            );

            results.forEach((result, index) => {
                const key = endpoints[index].key;

                if (result.status === "rejected") {
                    errors[key] =
                        result.reason?.message ||
                        "Unable to load data";

                    console.error(
                        `${key} API error:`,
                        result.reason
                    );

                    return;
                }

                const data = result.value;

                switch (key) {
                    case "projects": {
                        setProjects(
                            normalizeArray(data, [
                                "projects",
                                "data",
                                "results",
                            ])
                        );
                        break;
                    }

                    case "skills": {
                        setSkills(
                            normalizeArray(data, [
                                "skills",
                                "data",
                                "results",
                            ])
                        );
                        break;
                    }

                    case "messages": {
                        setMessages(
                            normalizeArray(data, [
                                "messages",
                                "data",
                                "results",
                            ])
                        );
                        break;
                    }

                    case "covers": {
                        const coverData =
                            data?.cover ||
                            data?.data?.cover ||
                            data?.data ||
                            data;

                        const coverArray = normalizeArray(
                            coverData,
                            ["covers", "results"]
                        );

                        if (coverArray.length > 0) {
                            setCovers(coverArray);
                        } else if (
                            coverData &&
                            typeof coverData === "object" &&
                            !Array.isArray(coverData) &&
                            (
                                coverData._id ||
                                coverData.image ||
                                coverData.coverImage ||
                                coverData.cover_image
                            )
                        ) {
                            setCovers([coverData]);
                        } else {
                            setCovers([]);
                        }

                        break;
                    }

                    case "profile": {
                        const profileData =
                            data?.profile ||
                            data?.data?.profile ||
                            data?.data ||
                            data;

                        setProfile(
                            profileData &&
                            typeof profileData === "object" &&
                            !Array.isArray(profileData)
                                ? profileData
                                : null
                        );

                        break;
                    }

                    default:
                        break;
                }
            });

            setApiErrors(errors);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();

    }, [loadDashboard]);

    // Unread messages
    const unreadMessages = messages.filter(
        (message) =>
            message.isRead === false ||
            message.isRead === undefined
    );

    // Current cover
    const currentCover = covers[0];

    const coverImage =
        currentCover?.coverImage ||
        currentCover?.cover_image ||
        currentCover?.image ||
        currentCover?.imageUrl ||
        "";

    // Profile information
    const adminName =
        profile?.name ||
        "Mohammad Akib";

    // Dashboard statistics
    const stats = [
        {
            title: "Total Projects",
            value: projects.length,
            description: "Projects in your portfolio",
            icon: FolderKanban,
            color: "text-primary",
            bg: "bg-primary/10",
            link: "/admin/projects",
        },
        {
            title: "Total Skills",
            value: skills.length,
            description: "Technologies and tools",
            icon: Code2,
            color: "text-secondary",
            bg: "bg-secondary/10",
            link: "/admin/skills",
        },
        {
            title: "Total Messages",
            value: messages.length,
            description: "Messages received",
            icon: Mail,
            color: "text-info",
            bg: "bg-info/10",
            link: "/admin/messages",
        },
        {
            title: "Unread Messages",
            value: unreadMessages.length,
            description: "Messages to review",
            icon: MailOpen,
            color: "text-warning",
            bg: "bg-warning/10",
            link: "/admin/messages",
        },
        {
            title: "Cover Images",
            value: covers.length,
            description: "Cover records available",
            icon: Image,
            color: "text-success",
            bg: "bg-success/10",
            link: "/admin/cover",
        },
    ];

    // Quick actions
    const quickActions = [
        {
            title: "Manage Projects",
            description: "Add, edit or remove projects",
            icon: FolderKanban,
            link: "/admin/projects",
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            title: "Manage Skills",
            description: "Update your technical skills",
            icon: Code2,
            link: "/admin/skills",
            color: "text-secondary",
            bg: "bg-secondary/10",
        },
        {
            title: "Profile Settings",
            description: "Update your personal information",
            icon: UserRound,
            link: "/admin/profile",
            color: "text-info",
            bg: "bg-info/10",
        },
        {
            title: "Cover Management",
            description: "Manage your cover image",
            icon: Image,
            link: "/admin/cover",
            color: "text-success",
            bg: "bg-success/10",
        },
        {
            title: "View Messages",
            description: "Check messages from visitors",
            icon: Mail,
            link: "/admin/messages",
            color: "text-warning",
            bg: "bg-warning/10",
        },
    ];

    // Date formatter
    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Loading screen
    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary" />

                <p className="text-sm text-base-content/60">
                    Loading dashboard data...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-8 bg-base-100 p-4 text-base-content transition-colors duration-300 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        <Sparkles size={14} />
                        Admin Workspace
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-base-content/60">
                        Welcome back, {adminName}. Here's your portfolio overview.
                    </p>

                    {lastUpdated && (
                        <p className="mt-2 text-xs text-base-content/45">
                            Last updated:{" "}
                            {lastUpdated.toLocaleTimeString()}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => loadDashboard(true)}
                        disabled={refreshing}
                        className="btn btn-outline btn-sm gap-2 sm:btn-md"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                refreshing ? "animate-spin" : ""
                            }
                        />

                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>

                    <Link
                        to="/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm gap-2 sm:btn-md"
                    >
                        View Website
                        <ExternalLink size={16} />
                    </Link>
                </div>
            </div>

            {/* API ERRORS */}
            {Object.keys(apiErrors).length > 0 && (
                <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-base-content">
                    <div className="flex items-start gap-3">
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0 text-warning"
                        />

                        <div className="min-w-0 flex-1">
                            <h2 className="font-semibold">
                                Some API requests failed
                            </h2>

                            <p className="mt-1 text-sm text-base-content/70">
                                Other dashboard sections may still work.
                                Check the errors below.
                            </p>

                            <div className="mt-3 space-y-2">
                                {Object.entries(apiErrors).map(
                                    ([key, error]) => (
                                        <div
                                            key={key}
                                            className="rounded-xl border border-base-300/70 bg-base-100 p-3 text-sm"
                                        >
                                            <p className="font-semibold">
                                                {key}
                                            </p>

                                            <p className="mt-1 wrap-break-word text-base-content/70">
                                                {error}
                                            </p>

                                            <code className="mt-1 block break-all text-xs text-base-content/50">
                                                {API_BASE}/api/
                                                {key === "covers"
                                                    ? "cover"
                                                    : key}
                                            </code>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STATUS */}
            <div className="flex items-center gap-2 text-xs text-base-content/60">
                <Activity size={15} />

                <span>
                    {Object.keys(apiErrors).length === 0
                        ? "All dashboard API requests succeeded."
                        : `${Object.keys(apiErrors).length} API request(s) need attention.`}
                </span>
            </div>

            {/* STATISTICS */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">
                        Overview
                    </h2>

                    <span className="text-xs text-base-content/50">
                        Portfolio statistics
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <Link
                                to={stat.link}
                                key={stat.title}
                                className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-base-200/40 hover:shadow-lg"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                                    >
                                        <Icon size={21} />
                                    </div>

                                    <ArrowUpRight
                                        size={17}
                                        className="text-base-content/50 transition group-hover:text-primary"
                                    />
                                </div>

                                <p className="mt-5 text-sm text-base-content/60">
                                    {stat.title}
                                </p>

                                <p className="mt-1 text-3xl font-bold tracking-tight">
                                    {stat.value}
                                </p>

                                <p className="mt-2 text-xs text-base-content/45">
                                    {stat.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* QUICK ACTIONS */}
            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-bold">
                        Quick Actions
                    </h2>

                    <p className="mt-1 text-sm text-base-content/50">
                        Quickly access your portfolio management tools.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.title}
                                to={action.link}
                                className="group flex items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-4 transition duration-300 hover:border-primary/60 hover:bg-base-200/40 hover:shadow-md"
                            >
                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${action.bg} ${action.color}`}
                                >
                                    <Icon size={22} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold">
                                        {action.title}
                                    </h3>

                                    <p className="mt-1 text-xs text-base-content/55">
                                        {action.description}
                                    </p>
                                </div>

                                <ArrowUpRight
                                    size={18}
                                    className="shrink-0 text-base-content/50 transition group-hover:text-primary"
                                />
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* RECENT DATA */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* RECENT PROJECTS */}
                <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-colors duration-300">
                    <div className="flex items-center justify-between border-b border-base-300 p-5">
                        <div>
                            <h2 className="font-bold">
                                Recent Projects
                            </h2>

                            <p className="mt-1 text-xs text-base-content/50">
                                Your latest portfolio projects
                            </p>
                        </div>

                        <Link
                            to="/admin/projects"
                            className="btn btn-ghost btn-sm gap-1"
                        >
                            View all
                            <ArrowUpRight size={15} />
                        </Link>
                    </div>

                    <div className="divide-y divide-base-300">
                        {projects.length > 0 ? (
                            [...projects]
                                .sort(
                                    (a, b) =>
                                        new Date(
                                            b.createdAt || b.updatedAt || 0
                                        ) -
                                        new Date(
                                            a.createdAt || a.updatedAt || 0
                                        )
                                )
                                .slice(0, 5)
                                .map((project, index) => (
                                    <div
                                        key={
                                            project._id ||
                                            project.id ||
                                            index
                                        }
                                        className="flex items-center gap-3 p-4 transition-colors duration-200 hover:bg-base-200"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-base-200">
                                            {project.image ||
                                            project.projectImage ? (
                                                <img
                                                    src={
                                                        project.image ||
                                                        project.projectImage
                                                    }
                                                    alt={project.title || "Project"}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <FolderKanban
                                                    size={20}
                                                    className="text-base-content/40"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-semibold">
                                                {project.title ||
                                                    project.name ||
                                                    "Untitled Project"}
                                            </h3>

                                            <p className="mt-1 text-xs text-base-content/50">
                                                {formatDate(
                                                    project.createdAt ||
                                                    project.updatedAt
                                                )}
                                            </p>
                                        </div>

                                        {project.featured && (
                                            <span className="badge badge-primary badge-sm">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                ))
                        ) : (
                            <div className="p-8 text-center">
                                <FolderKanban
                                    size={28}
                                    className="mx-auto text-base-content/30"
                                />

                                <p className="mt-3 text-sm text-base-content/60">
                                    {apiErrors.projects
                                        ? "Projects API could not be loaded."
                                        : "No projects available yet."}
                                </p>

                                <Link
                                    to="/admin/projects"
                                    className="btn btn-primary btn-sm mt-4"
                                >
                                    Manage Projects
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* RECENT MESSAGES */}
                <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-colors duration-300">
                    <div className="flex items-center justify-between border-b border-base-300 p-5">
                        <div>
                            <h2 className="font-bold">
                                Recent Messages
                            </h2>

                            <p className="mt-1 text-xs text-base-content/50">
                                Messages from your visitors
                            </p>
                        </div>

                        <Link
                            to="/admin/messages"
                            className="btn btn-ghost btn-sm gap-1"
                        >
                            View all
                            <ArrowUpRight size={15} />
                        </Link>
                    </div>

                    <div className="divide-y divide-base-300">
                        {messages.length > 0 ? (
                            [...messages]
                                .sort(
                                    (a, b) =>
                                        new Date(
                                            b.createdAt || b.date || 0
                                        ) -
                                        new Date(
                                            a.createdAt || a.date || 0
                                        )
                                )
                                .slice(0, 5)
                                .map((message, index) => {
                                    const isUnread =
                                        message.isRead === false ||
                                        message.isRead === undefined;

                                    return (
                                        <div
                                            key={
                                                message._id ||
                                                message.id ||
                                                index
                                            }
                                            className="flex items-center gap-3 p-4 transition-colors duration-200 hover:bg-base-200"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                                {(message.name || "V")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="truncate text-sm font-semibold">
                                                        {message.name ||
                                                            "Visitor"}
                                                    </h3>

                                                    {isUnread && (
                                                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                                                    )}
                                                </div>

                                                <p className="mt-1 truncate text-xs text-base-content/55">
                                                    {message.subject ||
                                                        message.message ||
                                                        message.email ||
                                                        "No message preview"}
                                                </p>

                                                <p className="mt-1 text-[11px] text-base-content/40">
                                                    {formatDate(
                                                        message.createdAt ||
                                                        message.date
                                                    )}
                                                </p>
                                            </div>

                                            {isUnread ? (
                                                <Mail
                                                    size={17}
                                                    className="shrink-0 text-primary"
                                                />
                                            ) : (
                                                <CheckCircle2
                                                    size={17}
                                                    className="shrink-0 text-success"
                                                />
                                            )}
                                        </div>
                                    );
                                })
                        ) : (
                            <div className="p-8 text-center">
                                <Mail
                                    size={28}
                                    className="mx-auto text-base-content/30"
                                />

                                <p className="mt-3 text-sm text-base-content/60">
                                    {apiErrors.messages
                                        ? "Messages API could not be loaded."
                                        : "No messages available yet."}
                                </p>

                                <Link
                                    to="/admin/messages"
                                    className="btn btn-outline btn-sm mt-4"
                                >
                                    View Messages
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* COVER PREVIEW */}
            <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between gap-3 border-b border-base-300 p-5">
                    <div>
                        <h2 className="font-bold">
                            Cover Image
                        </h2>

                        <p className="mt-1 text-xs text-base-content/50">
                            Cover information from your API
                        </p>
                    </div>

                    <Link
                        to="/admin/cover"
                        className="btn btn-outline btn-sm gap-2"
                    >
                        Manage Cover
                        <ArrowUpRight size={15} />
                    </Link>
                </div>

                {coverImage ? (
                    <div className="relative h-48 sm:h-64">
                        <img
                            src={coverImage}
                            alt="Portfolio cover"
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <p className="text-xs uppercase tracking-widest text-white/70">
                                Current Cover
                            </p>

                            <h3 className="mt-1 text-lg font-bold">
                                {currentCover?.title ||
                                    currentCover?.name ||
                                    "Portfolio Cover"}
                            </h3>
                        </div>
                    </div>
                ) : (
                    <div className="flex min-h-44 flex-col items-center justify-center bg-base-200/40 p-6 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 text-base-content/50">
                            <Image size={23} />
                        </div>

                        <p className="mt-3 text-sm font-semibold">
                            {apiErrors.covers
                                ? "Cover API request failed"
                                : "No cover image found"}
                        </p>

                        <p className="mt-1 max-w-md text-xs text-base-content/50">
                            {apiErrors.covers
                                ? apiErrors.covers
                                : "Add or update your cover image from the admin panel."}
                        </p>

                        <Link
                            to="/admin/cover"
                            className="btn btn-primary btn-sm mt-4"
                        >
                            Manage Cover
                        </Link>
                    </div>
                )}
            </section>

            {/* FOOTER */}
            <footer className="flex flex-col justify-between gap-3 border-t border-base-300 pt-5 text-xs text-base-content/60 sm:flex-row sm:items-center">
                <p>
                    Designed by{" "}
                    <span className="font-semibold text-base-content/70">
                        Mohammad Akib
                    </span>
                </p>

                <div className="flex items-center gap-2">
                    <Clock3 size={14} />

                    <span>
                        Dashboard updated{" "}
                        {lastUpdated
                            ? lastUpdated.toLocaleTimeString()
                            : "—"}
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
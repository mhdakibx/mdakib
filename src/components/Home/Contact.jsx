import React, { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
    ArrowUpRight,
    Mail,
    MapPin,
    Phone,
    Send,
    Sparkles,
    MoveUpRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../services/BaseUrl";

const Contact = () => {
    const [profile, setProfile] = useState(null);

    const [messageData, setMessageData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [sending, setSending] = useState(false);

    // =========================
    // FETCH PROFILE
    // =========================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/profile`);

                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await response.json();

                setProfile(data.profile);
            } catch (error) {
                console.error("Profile fetch error:", error);
            }
        };

        fetchProfile();
    }, []);

    // =========================
    // CONTACT ITEMS
    // =========================

    const contactItems = [
        {
            icon: Mail,
            label: "Email",
            value: profile?.email,
            href: profile?.email
                ? `mailto:${profile.email}`
                : null,
        },
        {
            icon: Phone,
            label: "Phone",
            value: profile?.phone,
            href: profile?.phone
                ? `tel:${profile.phone}`
                : null,
        },
        {
            icon: MapPin,
            label: "Location",
            value: profile?.location,
            href: null,
        },
    ];

    // =========================
    // SOCIAL LINKS
    // =========================

    const socialLinks = [
        {
            name: "GitHub",
            url: profile?.github,
            icon: FaGithub,
        },
        {
            name: "LinkedIn",
            url: profile?.linkedin,
            icon: FaLinkedin,
        },
    ];

    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        setMessageData({
            ...messageData,
            [e.target.name]: e.target.value,
        });
    };

    // =========================
    // SUBMIT MESSAGE
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (sending) {
            return;
        }

        setSending(true);

        try {
            const response = await fetch(`${BASE_URL}/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(messageData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to send message"
                );
            }

            setMessageData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

            toast.success("Message sent successfully!");
        } catch (error) {
            console.error("Message send error:", error);

            toast.error(
                error.message || "Something went wrong"
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <section
            id="contact"
            className="relative overflow-hidden bg-base-100 text-base-content"
        >
            {/* =========================
                BACKGROUND
            ========================== */}

            <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-base-content/[0.035] blur-3xl" />

            <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-base-content/[0.035] blur-3xl" />


            {/* =========================
                MAIN CONTAINER
            ========================== */}

            <div className="relative mx-auto w-full max-w-6xl px-4 py-9 sm:px-6 sm:py-11 lg:px-8 lg:py-12">


                {/* =================================================
                    TOP AREA
                ================================================== */}

                <div className="mb-6 grid items-center gap-5 lg:grid-cols-[1fr_auto]">

                    {/* =========================
                        HEADING
                    ========================== */}

                    <div>

                        {/* LABEL */}

                        <div className="mb-3 flex items-center gap-2">

                            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-base-content/15 bg-base-200 text-base-content">
                                <Sparkles size={12} />
                            </span>

                            <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-base-content/60">
                                Contact
                            </span>

                            <span className="ml-1 flex items-center gap-1.5 rounded-full border border-base-content/10 bg-base-200 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-base-content/60">

                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />

                                Available

                            </span>

                        </div>


                        {/* =========================
                            ASYMMETRIC HEADING
                        ========================== */}

                        <h1 className="max-w-4xl text-4xl font-bold leading-[0.86] tracking-[-0.06em] text-base-content sm:text-5xl md:text-6xl lg:text-[4.5rem]">

                            <span className="inline-block -rotate-2 transition-transform duration-500 hover:translate-x-2 hover:-rotate-1">
                                Let's build
                            </span>

                            <span className="ml-3 inline-block translate-y-2 rotate-1 text-base-content/55 transition-transform duration-500 hover:-translate-y-0.5 hover:rotate-0 sm:ml-7">
                                something
                            </span>

                            <br />

                            <span className="ml-1 inline-block -rotate-1 transition-transform duration-500 hover:translate-x-2 hover:rotate-0 sm:ml-6">
                                meaningful
                            </span>

                            <span className="ml-3 inline-block translate-y-2 rotate-2 text-base-content/55 transition-transform duration-500 hover:-translate-y-1 hover:rotate-1 sm:ml-8">
                                together.
                            </span>

                        </h1>

                    </div>


                    {/* =================================================
                        FLOATING UNIQUE BOX
                    ================================================== */}

                    <div className="group relative hidden w-52 lg:block">

                        {/* ROTATING OUTER RING */}

                        <div className="absolute -inset-2 rounded-3xl border border-dashed border-base-content/10 transition-transform duration-700 group-hover:rotate-3" />


                        {/* MAIN BOX */}

                        <div className="relative animate-[float_4s_ease-in-out_infinite] overflow-hidden rounded-[1.4rem] border border-base-content/15 bg-base-200 p-4 shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:border-base-content/25">

                            {/* decorative circle */}

                            <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full border border-base-content/10" />

                            <div className="pointer-events-none absolute -bottom-10 -left-10 h-20 w-20 rounded-full border border-base-content/10" />


                            <div className="relative">

                                <div className="flex items-center justify-between">

                                    <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-base-content/45">
                                        Let's create
                                    </span>

                                    <MoveUpRight
                                        size={13}
                                        className="text-base-content/45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />

                                </div>


                                <p className="mt-4 text-sm font-semibold leading-5 tracking-tight text-base-content">

                                    Ideas

                                    <span className="mx-1 text-base-content/30">
                                        →
                                    </span>

                                    Interfaces

                                    <span className="mx-1 text-base-content/30">
                                        →
                                    </span>

                                    Impact

                                </p>


                                <div className="mt-4 flex items-center gap-2">

                                    <span className="h-px flex-1 bg-base-content/15" />

                                    <span className="text-[8px] uppercase tracking-[0.12em] text-base-content/40">
                                        24 / 7
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    MOBILE FLOATING BOX
                ================================================== */}

                <div className="mb-6 lg:hidden">

                    <div className="group relative mx-auto max-w-sm">

                        <div className="absolute -inset-1 rounded-2xl border border-dashed border-base-content/10 transition-transform duration-500 group-hover:rotate-1" />

                        <div className="relative overflow-hidden rounded-2xl border border-base-content/15 bg-base-200 p-3.5">

                            <div className="flex items-center justify-between">

                                <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-base-content/45">
                                    Let's create
                                </span>

                                <MoveUpRight
                                    size={13}
                                    className="text-base-content/45"
                                />

                            </div>

                            <div className="mt-2 flex items-center justify-between">

                                <p className="text-xs font-semibold tracking-tight text-base-content">

                                    Ideas

                                    <span className="mx-1 text-base-content/30">
                                        →
                                    </span>

                                    Interfaces

                                    <span className="mx-1 text-base-content/30">
                                        →
                                    </span>

                                    Impact

                                </p>

                                <span className="text-[8px] uppercase tracking-[0.12em] text-base-content/40">
                                    24 / 7
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    MAIN CONTACT CARD
                ================================================== */}

                <div className="overflow-hidden rounded-3xl border border-base-content/10 bg-base-200/40">

                    <div className="grid lg:grid-cols-[0.72fr_1.28fr]">


                        {/* =================================================
                            LEFT - GET IN TOUCH
                        ================================================== */}

                        <div className="relative border-b border-base-content/10 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-7">

                            <div className="pointer-events-none absolute right-5 top-3 text-6xl font-bold leading-none text-base-content/[0.035]">
                                01
                            </div>


                            <div className="relative">

                                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-base-content/50">
                                    Direct contact
                                </p>

                                <h2 className="mt-2 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
                                    Get in touch
                                </h2>

                                <p className="mt-2 max-w-xs text-xs leading-5 text-base-content/60">
                                    Have an idea, opportunity, or project
                                    in mind? I'd love to hear from you.
                                </p>


                                {/* CONTACT LIST */}

                                <div className="mt-5 space-y-2.5">

                                    {contactItems.map((item) => {

                                        const Icon = item.icon;

                                        if (!item.value) {
                                            return null;
                                        }

                                        const content = (
                                            <div className="group flex items-center gap-3 rounded-xl border border-base-content/10 bg-base-100 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-base-content/25">

                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-content text-base-100">
                                                    <Icon size={15} />
                                                </div>


                                                <div className="min-w-0">

                                                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-base-content/50">
                                                        {item.label}
                                                    </p>

                                                    <p className="mt-0.5 truncate text-xs font-medium text-base-content sm:text-sm">
                                                        {item.value}
                                                    </p>

                                                </div>


                                                {item.href && (
                                                    <ArrowUpRight
                                                        size={15}
                                                        className="ml-auto shrink-0 text-base-content/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-base-content"
                                                    />
                                                )}

                                            </div>
                                        );


                                        if (!item.href) {
                                            return (
                                                <div key={item.label}>
                                                    {content}
                                                </div>
                                            );
                                        }


                                        return (
                                            <a
                                                key={item.label}
                                                href={item.href}
                                            >
                                                {content}
                                            </a>
                                        );

                                    })}

                                </div>


                                {/* SOCIAL */}

                                <div className="mt-5 flex items-center gap-2">

                                    <span className="mr-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-base-content/40">
                                        Find me
                                    </span>


                                    {socialLinks.map((social) => {

                                        const Icon = social.icon;

                                        if (!social.url) {
                                            return null;
                                        }

                                        return (
                                            <a
                                                key={social.name}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={social.name}
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-base-content/10 bg-base-100 text-base-content transition-all duration-300 hover:-translate-y-1 hover:bg-base-content hover:text-base-100"
                                            >
                                                <Icon size={14} />
                                            </a>
                                        );

                                    })}

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            RIGHT - MESSAGE
                        ================================================== */}

                        <div className="relative bg-base-100 p-5 sm:p-6 lg:p-7">

                            <div className="pointer-events-none absolute right-5 top-3 text-6xl font-bold leading-none text-base-content/[0.035]">
                                02
                            </div>


                            <div className="relative">

                                <div className="mb-4 flex items-center gap-2">

                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-base-content text-base-100">
                                        <Send size={12} />
                                    </span>

                                    <div>

                                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-base-content/50">
                                            Message
                                        </p>

                                        <h2 className="mt-0.5 text-lg font-bold tracking-tight text-base-content sm:text-xl">
                                            Let's start a conversation.
                                        </h2>

                                    </div>

                                </div>


                                {/* FORM */}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-2.5"
                                >

                                    {/* NAME + EMAIL */}

                                    <div className="grid gap-2.5 sm:grid-cols-2">

                                        <div>

                                            <label className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.12em] text-base-content/55">
                                                Name
                                            </label>

                                            <input
                                                type="text"
                                                name="name"
                                                value={messageData.name}
                                                onChange={handleChange}
                                                placeholder="Your name"
                                                required
                                                className="w-full rounded-lg border border-base-content/10 bg-base-200/50 px-3 py-2.5 text-xs text-base-content outline-none transition-all placeholder:text-base-content/35 focus:border-base-content/35 focus:bg-base-100"
                                            />

                                        </div>


                                        <div>

                                            <label className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.12em] text-base-content/55">
                                                Email
                                            </label>

                                            <input
                                                type="email"
                                                name="email"
                                                value={messageData.email}
                                                onChange={handleChange}
                                                placeholder="you@example.com"
                                                required
                                                className="w-full rounded-lg border border-base-content/10 bg-base-200/50 px-3 py-2.5 text-xs text-base-content outline-none transition-all placeholder:text-base-content/35 focus:border-base-content/35 focus:bg-base-100"
                                            />

                                        </div>

                                    </div>


                                    {/* SUBJECT */}

                                    <div>

                                        <label className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.12em] text-base-content/55">
                                            Subject
                                        </label>

                                        <input
                                            type="text"
                                            name="subject"
                                            value={messageData.subject}
                                            onChange={handleChange}
                                            placeholder="What's this about?"
                                            required
                                            className="w-full rounded-lg border border-base-content/10 bg-base-200/50 px-3 py-2.5 text-xs text-base-content outline-none transition-all placeholder:text-base-content/35 focus:border-base-content/35 focus:bg-base-100"
                                        />

                                    </div>


                                    {/* MESSAGE */}

                                    <div>

                                        <label className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.12em] text-base-content/55">
                                            Message
                                        </label>

                                        <textarea
                                            name="message"
                                            value={messageData.message}
                                            onChange={handleChange}
                                            placeholder="Write your message..."
                                            required
                                            rows="4"
                                            className="w-full resize-none rounded-lg border border-base-content/10 bg-base-200/50 px-3 py-2.5 text-xs leading-5 text-base-content outline-none transition-all placeholder:text-base-content/35 focus:border-base-content/35 focus:bg-base-100"
                                        />

                                    </div>


                                    {/* BUTTON */}

                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-base-content px-4 py-2.5 text-xs font-semibold text-base-100 transition-all duration-300 hover:gap-3 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {sending
                                            ? "Sending..."
                                            : "Send Message"
                                        }

                                        {!sending && (
                                            <ArrowUpRight
                                                size={14}
                                                className="transition-transform duration-300 group-hover:rotate-45"
                                            />
                                        )}

                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================== */}

                <div className="mt-4 flex flex-col items-center justify-between gap-2 text-[9px] uppercase tracking-[0.14em] text-base-content/40 sm:flex-row">

                    <span>
                        Open for opportunities & freelance work
                    </span>

                    <span>
                        © {new Date().getFullYear()}{" "}
                        {profile?.name || "Mohammad Akib"}
                    </span>

                </div>

            </div>


            {/* =========================
                FLOAT ANIMATION
            ========================== */}

            <style>
                {`
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px);
                        }

                        50% {
                            transform: translateY(-6px);
                        }
                    }
                `}
            </style>

        </section>
    );
};

export default Contact;
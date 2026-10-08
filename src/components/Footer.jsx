import React from "react";
import { Link } from "react-router";
import {
    ArrowUpRight,
    ArrowUp,
    Mail,
} from "lucide-react";
import {
    FaGithub,
    FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
    const navLinks = [
        {
            name: "Home",
            path: "/",
        },
        {
            name: "About",
            path: "/about",
        },
        {
            name: "Projects",
            path: "/projects",
        },
        {
            name: "Skills",
            path: "/skills",
        },
        {
            name: "Contact",
            path: "/contact",
        },
    ];

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="relative overflow-hidden border-t border-base-content/10 bg-base-100 text-base-content">

            {/* Background Decoration */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-base-content/5 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-base-content/5 blur-3xl" />

            <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 xl:px-12">

                {/* Top Section */}
                <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-20">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-content text-base-100">
                                <span className="text-sm font-bold">
                                    MA
                                </span>
                            </div>

                            <div>
                                <h2 className="text-lg font-bold tracking-tight">
                                    Mohammad Akib
                                </h2>

                                <p className="text-xs opacity-40">
                                    Junior Full Stack Developer
                                </p>
                            </div>

                        </div>

                        <p className="mt-6 max-w-md text-sm leading-7 opacity-50">
                            I build modern, responsive and user-friendly web
                            applications with clean and scalable code.
                        </p>

                        {/* Social Links */}
                        <div className="mt-7 flex items-center gap-3">

                            {/* GitHub */}
                            <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="group flex h-10 w-10 items-center justify-center rounded-full border border-base-content/10 transition-all duration-300 hover:-translate-y-1 hover:border-base-content hover:bg-base-content hover:text-base-100"
                            >
                                <FaGithub
                                    size={17}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                />
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="https://linkedin.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="group flex h-10 w-10 items-center justify-center rounded-full border border-base-content/10 transition-all duration-300 hover:-translate-y-1 hover:border-base-content hover:bg-base-content hover:text-base-100"
                            >
                                <FaLinkedin
                                    size={17}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                />
                            </a>

                            {/* Email */}
                            <a
                                href="mailto:your@email.com"
                                aria-label="Email"
                                className="group flex h-10 w-10 items-center justify-center rounded-full border border-base-content/10 transition-all duration-300 hover:-translate-y-1 hover:border-base-content hover:bg-base-content hover:text-base-100"
                            >
                                <Mail
                                    size={17}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                />
                            </a>

                        </div>
                    </div>

                    {/* Navigation */}
                    <div>

                        <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-40">
                            Navigation
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-2">

                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="group flex items-center gap-1 text-sm opacity-60 transition-all duration-300 hover:translate-x-1 hover:opacity-100"
                                >
                                    {link.name}

                                    <ArrowUpRight
                                        size={13}
                                        className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                                    />
                                </Link>
                            ))}

                        </div>
                    </div>

                </div>

                {/* CTA */}
                <div className="mt-14 overflow-hidden rounded-3xl border border-base-content/10 bg-base-200/50 p-6 sm:p-8">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-40">
                                Have a project?
                            </p>

                            <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                                Let's build something meaningful.
                            </h3>
                        </div>

                        <Link
                            to="/contact"
                            className="group inline-flex w-fit items-center gap-2 rounded-full bg-base-content px-5 py-2.5 text-sm font-medium text-base-100 transition-all duration-300 hover:gap-3"
                        >
                            Let's talk

                            <ArrowUpRight
                                size={16}
                                className="transition-transform duration-300 group-hover:rotate-45"
                            />
                        </Link>

                    </div>

                </div>

                {/* Bottom */}
                <div className="mt-10 flex flex-col gap-5 border-t border-base-content/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs opacity-40">
                        © {new Date().getFullYear()} Mohammad Akib. All rights
                        reserved.
                    </p>

                    <button
                        onClick={scrollToTop}
                        className="group flex w-fit items-center gap-2 text-xs opacity-50 transition-opacity duration-300 hover:opacity-100"
                    >
                        Back to top

                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-base-content/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-base-content">
                            <ArrowUp size={14} />
                        </span>
                    </button>

                </div>

            </div>
        </footer>
    );
};

export default Footer;
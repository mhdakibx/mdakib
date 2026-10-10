import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, ArrowUp, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { BASE_URL } from "../services/BaseUrl";

const Footer = () => {
    const [profile, setProfile] = useState({
        name: "Akib",
        profileImage: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/profile`);

                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await response.json();
                const profileData = Array.isArray(data)
                    ? data[0]
                    : data.profile || data;

                if (profileData) {
                    setProfile({
                        name: profileData.name || "Akib",
                        profileImage:
                            profileData.profileImage ||
                            profileData.profile_image ||
                            profileData.image ||
                            profileData.avatar ||
                            "",
                    });
                }
            } catch (error) {
                console.error("Profile fetch error:", error);
            }
        };

        fetchProfile();
    }, []);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Projects", path: "/projects" },
        { name: "Skills", path: "/skills" },
        { name: "Contact", path: "/contact" },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative overflow-hidden border-t border-base-content/10 bg-base-100 text-base-content">
            <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-base-content/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-base-content/5 blur-3xl" />

            <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10 xl:px-12">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto] lg:items-start">
                    {/* Profile */}
                    <div>
                        <Link
                            to="/"
                            onClick={scrollToTop}
                            className="group inline-flex items-center gap-3"
                        >
                            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-base-200">
                                {profile.profileImage ? (
                                    <img
                                        src={profile.profileImage}
                                        alt={profile.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-bold">
                                        {profile.name
                                            .split(" ")
                                            .map((word) => word[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </span>
                                )}
                            </span>

                            <span className="text-xl font-bold tracking-tight">
                                {profile.name}
                                <span className="ml-1 text-base-content/40">.</span>
                            </span>
                        </Link>

                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="https://github.com/mhdakibx"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="group flex h-10 w-10 items-center justify-center rounded-full border border-base-content/10 transition-all duration-300 hover:-translate-y-1 hover:border-base-content hover:bg-base-content hover:text-base-100"
                            >
                                <FaGithub size={17} className="transition-transform duration-300 group-hover:scale-110" />
                            </a>

                            <a
                                href="https://linkedin.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="group flex h-10 w-10 items-center justify-center rounded-full border border-base-content/10 transition-all duration-300 hover:-translate-y-1 hover:border-base-content hover:bg-base-content hover:text-base-100"
                            >
                                <FaLinkedin size={17} className="transition-transform duration-300 group-hover:scale-110" />
                            </a>

                            <a
                                href="mailto:mhdakib7769@gmail.com"
                                aria-label="Email"
                                className="group flex h-10 w-10 items-center justify-center rounded-full border border-base-content/10 transition-all duration-300 hover:-translate-y-1 hover:border-base-content hover:bg-base-content hover:text-base-100"
                            >
                                <Mail size={17} />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-40">
                            Explore
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="group flex items-center gap-1.5 text-sm opacity-60 transition-all duration-300 hover:translate-x-1 hover:opacity-100"
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

                {/* Contact CTA */}
                <div className="mt-12 overflow-hidden rounded-3xl border border-base-content/10 bg-base-200/50 p-6 sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-40">
                                Have a project?
                            </p>

                            <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                                Let's create something great.
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

                {/* Bottom Bar */}
                <div className="mt-8 flex flex-col gap-4 border-t border-base-content/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs opacity-40">
                        © {new Date().getFullYear()} {profile.name}. All rights reserved.
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
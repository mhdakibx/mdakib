import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X } from "lucide-react";

import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    const navLinks = [
        {
            name: "Home",
            path: "/",
            id: "home",
        },
        {
            name: "About",
            path: "/about",
            id: "about",
        },
        {
            name: "Projects",
            path: "/projects",
            id: "projects",
        },
        {
            name: "Skills",
            path: "/skills",
            id: "skills",
        },
        {
            name: "Contact",
            path: "/contact",
            id: "contact",
        },
    ];

    const handleNavClick = () => {
        setIsOpen(false);
    };

    // Auto change active nav while scrolling
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200;

            let currentSection = "home";

            navLinks.forEach((link) => {
                const section = document.getElementById(link.id);

                if (section && scrollPosition >= section.offsetTop) {
                    currentSection = link.id;
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav className="fixed left-1/2 top-5 z-50 w-[calc(100%-32px)] max-w-6xl -translate-x-1/2">

            {/* Main Navbar */}
            <div className="flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="font-bold tracking-tight"
                >
                    <span className="hidden sm:block">
                        Mohammad Akib
                    </span>

                    <span className="sm:hidden">
                        Akib
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-1 rounded-full border border-black bg-base-100 px-2 py-1.5 md:flex dark:border-white">

                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={() =>
                                `whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                                    activeSection === link.id
                                        ? "bg-black text-white dark:bg-white dark:text-black"
                                        : "text-base-content hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}

                </div>

                {/* Right Side */}
                <div className="flex items-center gap-1">

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Mobile Menu */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="btn btn-ghost btn-circle md:hidden"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X size={21} />
                        ) : (
                            <Menu size={21} />
                        )}
                    </button>

                </div>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="mt-3 rounded-2xl border border-black bg-base-100 p-2 shadow-sm dark:border-white md:hidden">

                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={handleNavClick}
                            className={() =>
                                `block rounded-xl px-4 py-3 text-sm transition ${
                                    activeSection === link.id
                                        ? "bg-black text-white dark:bg-white dark:text-black"
                                        : "text-base-content hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}

                </div>
            )}

        </nav>
    );
};

export default Navbar;
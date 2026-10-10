import React, { useEffect, useState } from "react";
import {
    Link,
    NavLink,
    useLocation,
    useNavigate,
} from "react-router";

import { Menu, X, UserRound } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { BASE_URL } from "../services/BaseUrl";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    const [profile, setProfile] = useState({
        name: "Mohammad Akib",
        profileImage: "",
    });

    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { name: "Home", path: "/", id: "home" },
        { name: "About", path: "/about", id: "about" },
        { name: "Projects", path: "/projects", id: "projects" },
        { name: "Skills", path: "/skills", id: "skills" },
        { name: "Contact", path: "/contact", id: "contact" },
    ];

    // Fetch profile data from API
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
                    const image =
                        profileData.profileImage ||
                        profileData.profile_image ||
                        profileData.image ||
                        profileData.avatar ||
                        "";

                    setProfile({
                        name: profileData.name || "Mohammad Akib",
                        profileImage: image,
                    });

                    setImageError(false);
                }
            } catch (error) {
                console.error("Profile fetch error:", error);
            } finally {
                setImageLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Build profile image URL
    const getImageUrl = (image) => {
        if (!image) return "";

        if (
            image.startsWith("https://") ||
            image.startsWith("http://") ||
            image.startsWith("data:") ||
            image.startsWith("blob:")
        ) {
            return image;
        }

        return `${BASE_URL.replace(/\/+$/, "")}/${image.replace(/^\/+/, "")}`;
    };

    // Scroll to top and navigate home when logo is clicked
    const handleLogoClick = (e) => {
        e.preventDefault();

        setIsOpen(false);
        setActiveSection("home");

        if (location.pathname !== "/") {
            navigate("/");
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    // Auto update active navigation while scrolling
    useEffect(() => {
        // Only track homepage sections on the homepage
        if (location.pathname !== "/") {
            setActiveSection("");
            return;
        }

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200;

            let currentSection = "home";

            navLinks.forEach((link) => {
                const section = document.getElementById(link.id);

                if (
                    section &&
                    scrollPosition >= section.offsetTop
                ) {
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
    }, [location.pathname]);

    // Scroll to top when navigating to homepage from another route
    useEffect(() => {
        if (location.pathname === "/") {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [location.pathname]);

    // Close mobile menu on desktop resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Handle navigation click
    const handleNavClick = (id) => {
        setIsOpen(false);
        setActiveSection(id);
    };

    // Navigation link styles
    const navLinkClass = (link) =>
        `whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
            activeSection === link.id
                ? "bg-base-content text-base-100 shadow-sm"
                : "text-base-content/70 hover:bg-base-content/5 hover:text-base-content"
        }`;

    return (
        <nav className="fixed left-1/2 top-4 z-50 w-[calc(100%-24px)] max-w-6xl -translate-x-1/2 sm:top-5 sm:w-[calc(100%-40px)]">
            {/* Main Navbar */}
            <div className="flex items-center justify-between gap-3">
                {/* Profile Logo + Name */}
                <Link
                    to="/"
                    aria-label="Go to homepage"
                    onClick={handleLogoClick}
                    className="group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
                >
                    {/* Profile Image */}
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-base-content/10 bg-base-200 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/15 sm:h-12 sm:w-12">
                        {!imageLoading &&
                        profile.profileImage &&
                        !imageError ? (
                            <img
                                src={getImageUrl(profile.profileImage)}
                                alt={profile.name}
                                className="h-full w-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <UserRound
                                size={22}
                                strokeWidth={1.8}
                                className="text-base-content/70 transition-colors duration-300 group-hover:text-primary"
                            />
                        )}
                    </span>

                    {/* Profile Name */}
                    <span className="max-w-28.75 truncate text-sm font-bold tracking-tight text-base-content transition-colors duration-300 group-hover:text-primary sm:max-w-none sm:text-base">
                        {profile.name}
                        <span className="ml-0.5 text-base-content/40">
                            .
                        </span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-1 rounded-full border border-base-content/10 bg-base-100/90 p-1.5 shadow-lg shadow-base-content/5 backdrop-blur-xl md:flex">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => handleNavClick(link.id)}
                            className={() => navLinkClass(link)}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                {/* Right Side */}
                <div className="flex shrink-0 items-center gap-1.5">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="btn btn-circle btn-ghost border border-base-content/10 bg-base-100/90 shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-base-200 md:hidden"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? (
                            <X size={21} strokeWidth={1.8} />
                        ) : (
                            <Menu size={21} strokeWidth={1.8} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`grid transition-all duration-300 ease-in-out md:hidden ${
                    isOpen
                        ? "mt-3 grid-rows-[1fr] opacity-100"
                        : "mt-0 grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="rounded-2xl border border-base-content/10 bg-base-100/95 p-2.5 shadow-xl shadow-base-content/5 backdrop-blur-xl">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => handleNavClick(link.id)}
                                className={() =>
                                    `mb-1 block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 last:mb-0 ${
                                        activeSection === link.id
                                            ? "bg-base-content text-base-100"
                                            : "text-base-content/70 hover:bg-base-content/5 hover:text-base-content"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
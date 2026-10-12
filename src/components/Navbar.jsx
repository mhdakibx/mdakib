import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

import { Menu, X, UserRound } from "lucide-react";

import ThemeToggle from "./ThemeToggle";
import { BASE_URL } from "../services/BaseUrl";

const NAV_LINKS = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Projects", id: "projects" },
    { name: "Skills", id: "skills" },
    { name: "Contact", id: "contact" },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    const [profile, setProfile] = useState({
        name: "Mohammad Akib",
        profileImage: "",
    });

    const [imageError, setImageError] = useState(false);

    const location = useLocation();

    // Fetch profile from API
    useEffect(() => {
        const controller = new AbortController();

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/profile`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await response.json();

                const profileData = Array.isArray(data)
                    ? data[0]
                    : data.profile || data;

                if (!profileData) return;

                setProfile({
                    name: profileData.name || "Mohammad Akib",
                    profileImage:
                        profileData.profileImage ||
                        profileData.profile_image ||
                        profileData.image ||
                        profileData.avatar ||
                        "",
                });

                setImageError(false);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Profile fetch error:", error);
                }
            }
        };

        fetchProfile();

        return () => controller.abort();
    }, []);

    // Get profile image URL
    const getImageUrl = (image) => {
        if (!image) return "";

        if (/^(https?:\/\/|data:|blob:)/i.test(image)) {
            return image;
        }

        return `${BASE_URL.replace(/\/+$/, "")}/${image.replace(/^\/+/, "")}`;
    };

    // Scroll to selected section
    const scrollToSection = (id) => {
        if (id === "home") {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            return;
        }

        const section = document.getElementById(id);

        if (!section) return;

        section.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // Handle navigation without changing the URL hash
    const handleNavClick = (event, id) => {
        event.preventDefault();

        setIsOpen(false);
        setActiveSection(id);

        if (location.pathname !== "/") {
            window.location.assign("/");
            return;
        }

        scrollToSection(id);
    };

    // Update active navigation while scrolling
    useEffect(() => {
        if (location.pathname !== "/") {
            setActiveSection("");
            return;
        }

        let ticking = false;

        const updateActiveSection = () => {
            if (ticking) return;

            ticking = true;

            window.requestAnimationFrame(() => {
                const scrollPosition = window.scrollY + 160;

                if (window.scrollY < 80) {
                    setActiveSection("home");
                    ticking = false;
                    return;
                }

                let currentSection = "home";

                NAV_LINKS.forEach(({ id }) => {
                    const section = document.getElementById(id);

                    if (section && scrollPosition >= section.offsetTop) {
                        currentSection = id;
                    }
                });

                setActiveSection(currentSection);
                ticking = false;
            });
        };

        window.addEventListener("scroll", updateActiveSection, {
            passive: true,
        });

        window.addEventListener("resize", updateActiveSection);

        updateActiveSection();

        return () => {
            window.removeEventListener("scroll", updateActiveSection);
            window.removeEventListener("resize", updateActiveSection);
        };
    }, [location.pathname]);

    // Close mobile menu when leaving the page
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Navigation styles
    const navLinkClass = (id) =>
        `whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium
        transition-all duration-300 ${
            activeSection === id
                ? "bg-base-content text-base-100 shadow-sm"
                : "text-base-content/70 hover:bg-base-content/5 hover:text-base-content"
        }`;

    return (
        <nav className="fixed left-1/2 top-4 z-50 w-[calc(100%-24px)] max-w-6xl -translate-x-1/2 sm:top-5 sm:w-[calc(100%-40px)]">
            <div className="flex items-center justify-between gap-3">
                {/* Logo and Profile */}
                <Link
                    to="/"
                    onClick={(event) => handleNavClick(event, "home")}
                    aria-label="Go to homepage"
                    className="group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
                >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-base-content/10 bg-base-200 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/15 sm:h-12 sm:w-12">
                        {profile.profileImage && !imageError ? (
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
                                className="text-base-content/70 transition-colors group-hover:text-primary"
                            />
                        )}
                    </span>

                    <span className="max-w-28.75 truncate text-sm font-bold tracking-tight text-base-content transition-colors group-hover:text-primary sm:max-w-none sm:text-base">
                        {profile.name}
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-1 rounded-full border border-base-content/10 bg-base-100/90 p-1.5 shadow-lg shadow-base-content/5 backdrop-blur-xl md:flex">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.id}
                            href="/"
                            onClick={(event) =>
                                handleNavClick(event, link.id)
                            }
                            className={navLinkClass(link.id)}
                            aria-current={
                                activeSection === link.id
                                    ? "location"
                                    : undefined
                            }
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Right Side */}
                <div className="flex shrink-0 items-center gap-1.5">
                    <ThemeToggle />

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen((previous) => !previous)}
                        className="btn btn-circle btn-ghost border border-base-content/10 bg-base-100/90 shadow-sm transition-all hover:border-primary/40 hover:bg-base-200 md:hidden"
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
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.id}
                                href="/"
                                onClick={(event) =>
                                    handleNavClick(event, link.id)
                                }
                                className={`mb-1 block rounded-xl px-4 py-3 text-sm font-medium transition-all last:mb-0 ${
                                    activeSection === link.id
                                        ? "bg-base-content text-base-100"
                                        : "text-base-content/70 hover:bg-base-content/5 hover:text-base-content"
                                }`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;


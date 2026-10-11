import React, { useEffect, useState } from "react";
import {
    Link,
    NavLink,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router";

import {
    LayoutDashboard,
    UserRound,
    Image,
    FolderKanban,
    Code2,
    Mail,
    Settings,
    ExternalLink,
    LogOut,
    Menu,
    X,
    ChevronRight,
    PanelLeftClose,
} from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../contexts/AuthProvider";
import { BASE_URL } from "../services/BaseUrl";

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [profile, setProfile] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    const { authUser, logout } = useAuth();

    // Sidebar menu
    const menuGroups = [
        {
            title: "OVERVIEW",
            items: [
                {
                    name: "Dashboard",
                    path: "/admin/dashboard",
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            title: "PORTFOLIO",
            items: [
                {
                    name: "Profile",
                    path: "/admin/profile",
                    icon: UserRound,
                },
                {
                    name: "Cover & Hero",
                    path: "/admin/cover",
                    icon: Image,
                },
                {
                    name: "Projects",
                    path: "/admin/projects",
                    icon: FolderKanban,
                },
                {
                    name: "Skills",
                    path: "/admin/skills",
                    icon: Code2,
                },
            ],
        },
        {
            title: "COMMUNICATION",
            items: [
                {
                    name: "Messages",
                    path: "/admin/messages",
                    icon: Mail,
                },
            ],
        },
        {
            title: "PREFERENCES",
            items: [
                {
                    name: "Settings",
                    path: "/admin/settings",
                    icon: Settings,
                },
            ],
        },
    ];

    // Current page title
    const currentPage = menuGroups
        .flatMap((group) => group.items)
        .find((item) => item.path === location.pathname);

    const pageTitle = currentPage?.name || "Dashboard";

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

                const result = await response.json();

                const profileData =
                    result?.profile ||
                    result?.data?.profile ||
                    result?.data ||
                    result;

                setProfile(profileData);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Profile fetch error:", error);
                }
            }
        };

        fetchProfile();

        return () => controller.abort();
    }, []);

    // Admin name
    const profileName =
        profile?.name ||
        authUser?.name ||
        authUser?.username ||
        "Mohammad Akib";

    // Profile image is used only in the header
    const profileImage =
        profile?.profileImage ||
        profile?.profile_image ||
        profile?.image ||
        profile?.avatar ||
        profile?.photo ||
        profile?.picture ||
        "";

    // Close mobile sidebar
    const closeMobileMenu = () => {
        setIsOpen(false);
    };

    // Logout and redirect to homepage
    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    // Sidebar content
    const renderSidebar = (mobile = false) => (
        <div className="flex h-full flex-col bg-base-100">
            {/* Sidebar Header: Name Only */}
            <div
                className={`flex h-19 shrink-0 items-center border-b border-base-300 ${
                    collapsed && !mobile
                        ? "justify-center px-3"
                        : "justify-between px-4"
                }`}
            >
                {(!collapsed || mobile) && (
                    <Link
                        to="/admin/profile"
                        onClick={closeMobileMenu}
                        className="min-w-0 flex-1"
                        title={profileName}
                    >
                        <p className="truncate text-sm font-bold text-base-content">
                            {profileName}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-base-content/50">
                            Admin Dashboard
                        </p>
                    </Link>
                )}

                {/* Sidebar controls */}
                {mobile ? (
                    <button
                        type="button"
                        onClick={closeMobileMenu}
                        className="btn btn-ghost btn-sm btn-square"
                        aria-label="Close sidebar"
                    >
                        <X size={19} />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base-content/50 transition hover:bg-base-200 hover:text-base-content lg:flex"
                        aria-label={
                            collapsed ? "Expand sidebar" : "Collapse sidebar"
                        }
                        title={
                            collapsed ? "Expand sidebar" : "Collapse sidebar"
                        }
                    >
                        <PanelLeftClose
                            size={18}
                            className={collapsed ? "rotate-180" : ""}
                        />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
                {menuGroups.map((group) => (
                    <div
                        key={group.title}
                        className="mb-6 last:mb-0"
                    >
                        {(!collapsed || mobile) && (
                            <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-base-content/40">
                                {group.title}
                            </p>
                        )}

                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={closeMobileMenu}
                                        title={
                                            collapsed && !mobile
                                                ? item.name
                                                : undefined
                                        }
                                        className={({ isActive }) =>
                                            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                                collapsed && !mobile
                                                    ? "justify-center"
                                                    : ""
                                            } ${
                                                isActive
                                                    ? "bg-primary text-primary-content shadow-md shadow-primary/15"
                                                    : "text-base-content/65 hover:bg-base-200 hover:text-base-content"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon
                                                    size={18}
                                                    strokeWidth={
                                                        isActive ? 2.2 : 1.8
                                                    }
                                                    className="shrink-0"
                                                />

                                                {(!collapsed || mobile) && (
                                                    <>
                                                        <span className="min-w-0 flex-1 truncate">
                                                            {item.name}
                                                        </span>

                                                        {isActive && (
                                                            <ChevronRight
                                                                size={15}
                                                                className="shrink-0 opacity-80"
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sidebar Bottom: Logout Only */}
            <div className="shrink-0 border-t border-base-300 p-3">
                <button
                    type="button"
                    onClick={handleLogout}
                    title={
                        collapsed && !mobile
                            ? "Logout"
                            : undefined
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-error transition hover:bg-error/10 ${
                        collapsed && !mobile
                            ? "justify-center"
                            : ""
                    }`}
                >
                    <LogOut
                        size={18}
                        className="shrink-0"
                    />

                    {(!collapsed || mobile) && (
                        <span>Logout</span>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200 text-base-content">
            {/* Mobile overlay */}
            {isOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={closeMobileMenu}
                    className="fixed inset-0 z-60 bg-black/40 backdrop-blur-[2px] lg:hidden"
                />
            )}

            {/* Desktop Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-70 hidden border-r border-base-300 bg-base-100 transition-[width] duration-300 lg:block ${
                    collapsed
                        ? "w-19"
                        : "w-62.5"
                }`}
            >
                {renderSidebar(false)}
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-70 w-67.5 border-r border-base-300 bg-base-100 transition-transform duration-300 ease-in-out lg:hidden ${
                    isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                {renderSidebar(true)}
            </aside>

            {/* Main Content */}
            <div
                className={`min-h-screen transition-[padding] duration-300 ${
                    collapsed
                        ? "lg:pl-19"
                        : "lg:pl-62.5"
                }`}
            >
                {/* Header */}
                <header className="sticky top-0 z-40 flex h-18 items-center justify-between border-b border-base-300 bg-base-100/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
                    {/* Left: Current Page */}
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="btn btn-ghost btn-square btn-sm lg:hidden"
                            aria-label="Open navigation menu"
                        >
                            <Menu size={21} />
                        </button>

                        <h2 className="truncate text-base font-bold sm:text-lg">
                            {pageTitle}
                        </h2>
                    </div>

                    {/* Right: View Site → Theme → Profile */}
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <Link
                            to="/"
                            className="inline-flex h-9 items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 text-xs font-medium transition hover:border-primary hover:bg-base-200 sm:h-10 sm:px-4 sm:text-sm"
                        >
                            <ExternalLink size={15} />
                            <span>View Site</span>
                        </Link>

                        <div className="flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
                            <ThemeToggle />
                        </div>

                        {/* Header Profile Image */}
                        <Link
                            to="/admin/dashboard"
                            aria-label="Admin Dashboard"
                            title={profileName}
                            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-base-300 bg-base-200 transition hover:border-primary hover:ring-2 hover:ring-primary/15"
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={profileName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <UserRound
                                    size={19}
                                    className="text-base-content/65"
                                />
                            )}
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto w-full max-w-[1600px]">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;


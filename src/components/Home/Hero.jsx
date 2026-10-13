import React, { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { ArrowUpRight } from "lucide-react";
import { BASE_URL } from "../../services/BaseUrl";

const Hero = () => {
    const [profile, setProfile] = useState(null);
    const [cover, setCover] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileResponse, coverResponse] = await Promise.all([
                    fetch(`${BASE_URL}/api/profile`),
                    fetch(`${BASE_URL}/api/cover`),
                ]);

                if (!profileResponse.ok || !coverResponse.ok) {
                    throw new Error("Failed to fetch hero data");
                }

                const profileData = await profileResponse.json();
                const coverData = await coverResponse.json();

                setProfile(profileData.profile);
                setCover(coverData.cover);
                setImageError(false);
            } catch (error) {
                console.error("Hero data fetch error:", error);
            }
        };

        fetchData();
    }, []);

    const handleMouseMove = (event) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        setTilt({
            x: (0.5 - y) * 10,
            y: (x - 0.5) * 10,
        });
    };

    const resetTilt = () => {
        setTilt({ x: 0, y: 0 });
    };

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

    return (
        <section
            id="home"
            className="relative min-h-screen overflow-hidden bg-base-100 text-base-content"
        >
            {/* Background Glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-base-content/5 blur-3xl sm:h-80 sm:w-80" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-28 sm:px-8 sm:py-32 lg:px-10 xl:px-12">
                <div className="grid w-full items-center gap-12 md:gap-14 lg:grid-cols-[80px_minmax(0,1fr)_320px] lg:gap-8 xl:grid-cols-[90px_minmax(0,1fr)_420px] xl:gap-10">

                    {/* Social Links */}
                    <div className="order-3 flex justify-center lg:order-1 lg:justify-start">
                        <div className="flex items-center gap-3 lg:flex-col lg:gap-4">
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
                                        title={social.name}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-base-content/20 text-lg transition-all duration-300 hover:-translate-y-1 hover:border-base-content hover:bg-base-content hover:text-base-100"
                                    >
                                        <Icon />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content — Unchanged */}
                    <div className="order-2 min-w-0 text-center lg:text-left">
                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] opacity-50 sm:text-sm">
                            Hello, I'm
                        </p>

                        <h1 className="whitespace-nowrap text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl xl:text-7xl">
                            {profile?.name || "Mohammad Akib"}
                        </h1>

                        <div className="mt-4 flex items-center justify-center gap-3 lg:justify-start">
                            <span className="h-px w-8 shrink-0 bg-base-content/40" />

                            <p className="text-sm font-medium opacity-70 sm:text-base">
                                {profile?.title || "Junior Full Stack Developer"}
                            </p>
                        </div>

                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 opacity-60 sm:text-base lg:mx-0">
                            {profile?.bio ||
                                "I build modern, responsive and user-friendly web applications with clean and scalable code."}
                        </p>

                        {/* Resume Button */}
                        <div className="mt-7 flex justify-center lg:justify-start">
                            <a
                                href={profile?.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 rounded-full bg-base-content px-5 py-2.5 text-sm font-medium text-base-100 transition-all duration-300 hover:gap-3"
                            >
                                Resume

                                <ArrowUpRight
                                    size={15}
                                    className="transition-transform duration-300 group-hover:rotate-45"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Animated Profile Card */}
                    <div className="order-1 flex justify-center lg:order-3 lg:justify-center">
                        <div
                            className="profile-float relative w-full max-w-52 sm:max-w-60 md:max-w-[256px] lg:max-w-[288px] xl:max-w-[320px]"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={resetTilt}
                            style={{
                                perspective: "1000px",
                            }}
                        >
                            {/* Animated Background Glow */}
                            <div className="profile-glow pointer-events-none absolute -inset-5 rounded-[2.5rem] bg-base-content/6 blur-2xl sm:-inset-7" />

                            {/* Top Right Corner */}
                            <div className="pointer-events-none absolute -right-3 -top-3 z-10 h-16 w-16 rounded-tr-[1.75rem] border-r-2 border-t-2 border-base-content/30 transition-all duration-500 sm:-right-4 sm:-top-4 sm:h-20 sm:w-20" />

                            {/* Bottom Left Corner */}
                            <div className="pointer-events-none absolute -bottom-3 -left-3 z-10 h-16 w-16 rounded-bl-[1.75rem] border-b-2 border-l-2 border-base-content/30 transition-all duration-500 sm:-bottom-4 sm:-left-4 sm:h-20 sm:w-20" />

                            {/* Main Image Card */}
                            <div
                                className="profile-card group relative aspect-square w-full overflow-hidden rounded-[1.75rem] border border-base-content/15 bg-base-200 p-1.5 shadow-xl shadow-base-content/8 sm:rounded-4xl sm:p-2"
                                style={{
                                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                                    transition:
                                        "transform 180ms ease-out, box-shadow 400ms ease, border-color 400ms ease",
                                    transformStyle: "preserve-3d",
                                }}
                            >
                                {/* Image Wrapper */}
                                <div className="relative h-full w-full overflow-hidden rounded-[1.4rem] bg-base-300 sm:rounded-[1.6rem]">
                                    {cover?.image && !imageError ? (
                                        <img
                                            src={cover.image}
                                            alt={
                                                cover.title ||
                                                profile?.name ||
                                                "Mohammad Akib"
                                            }
                                            className="profile-image h-full w-full object-cover"
                                            style={{
                                                objectPosition: "center 25%",
                                            }}
                                            loading="eager"
                                            fetchPriority="high"
                                            decoding="async"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-base-200 px-4 text-center">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-base-content/10 bg-base-100 text-base-content/40">
                                                <span className="text-2xl font-bold">
                                                    A
                                                </span>
                                            </div>

                                            <span className="text-xs text-base-content/50">
                                                {imageError
                                                    ? "Image could not be loaded"
                                                    : "Upload your image from Admin"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Animation Styles */}
            <style>{`
                .profile-float {
                    animation: profileFloat 5s ease-in-out infinite;
                    will-change: transform;
                }

                .profile-card {
                    will-change: transform;
                    backface-visibility: hidden;
                }

                .profile-image {
                    transition: transform 700ms cubic-bezier(0.2, 0.7, 0.3, 1);
                    backface-visibility: hidden;
                }

                .profile-card:hover {
                    border-color: oklch(var(--bc) / 0.3);
                    box-shadow: 0 25px 60px -20px oklch(var(--bc) / 0.2);
                }

                .profile-card:hover .profile-image {
                    transform: scale(1.06);
                }

                .profile-glow {
                    animation: glowPulse 4s ease-in-out infinite;
                }

                .profile-float:hover {
                    animation-play-state: paused;
                }

                @keyframes profileFloat {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-12px);
                    }
                }

                @keyframes glowPulse {
                    0%, 100% {
                        opacity: 0.5;
                        transform: scale(0.96);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.04);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .profile-float,
                    .profile-glow {
                        animation: none !important;
                    }

                    .profile-card,
                    .profile-image {
                        transition: none !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default Hero;
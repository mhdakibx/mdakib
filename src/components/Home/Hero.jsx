import React, { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { ArrowUpRight } from "lucide-react";
import { BASE_URL } from "../../services/BaseUrl";

const Hero = () => {
    const [profile, setProfile] = useState(null);
    const [cover, setCover] = useState(null);

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
            } catch (error) {
                console.error("Hero data fetch error:", error);
            }
        };

        fetchData();
    }, []);

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

                    {/* Main Content */}
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

                    {/* Cover */}
                    <div className="order-1 flex justify-center lg:order-3 lg:justify-center">

                        <div className="relative">

                            {/* Outer Shape */}
                            <div className="absolute -inset-3 rounded-[42%_58%_55%_45%/48%_42%_58%_52%] border border-base-content/15 sm:-inset-4" />

                            {/* Second Shape */}
                            <div className="absolute -inset-6 rounded-[58%_42%_45%_55%/42%_58%_48%_52%] border border-base-content/10 sm:-inset-8" />

                            {/* Image */}
                            <div className="relative h-52 w-52 overflow-hidden rounded-[42%_58%_55%_45%/48%_42%_58%_52%] border border-base-content/30 bg-base-200 sm:h-60 sm:w-60 md:h-64 md:w-64 lg:h-72 lg:w-72 xl:h-80 xl:w-80">

                                {cover?.image ? (
                                    <img
                                        src={cover.image}
                                        alt={
                                            cover.title ||
                                            profile?.name ||
                                            "Mohammad Akib"
                                        }
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-base-200">
                                        <span className="text-sm opacity-40">
                                            Cover Image
                                        </span>
                                    </div>
                                )}

                            </div>

                            {/* Decorative Dots */}
                            <span className="absolute -right-2 top-8 h-2.5 w-2.5 rounded-full bg-base-content sm:-right-3 sm:h-3 sm:w-3" />

                            <span className="absolute -bottom-2 left-8 h-2 w-2 rounded-full bg-base-content/50 sm:-bottom-3 sm:left-12 sm:h-2.5 sm:w-2.5" />

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
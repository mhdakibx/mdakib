
import React, { useState } from "react";
import {
    ArrowUpRight,
    Code2,
    Lightbulb,
    MousePointer2,
    Workflow,
} from "lucide-react";

const About = () => {
    const [active, setActive] = useState(0);

    const points = [
        {
            title: "Who I Am",
            icon: Code2,
            text: "I am a Computer Science & Engineering student and a Full Stack Developer who enjoys building practical web applications.",
            label: "IDENTITY",
        },
        {
            title: "How I Work",
            icon: Workflow,
            text: "I start by understanding the problem, then build, test, debug and improve the solution step by step.",
            label: "PROCESS",
        },
        {
            title: "What I Enjoy",
            icon: Lightbulb,
            text: "I enjoy creating new things, solving problems and bringing frontend and backend together to build useful digital experiences.",
            label: "PASSION",
        },
    ];

    const current = points[active];
    const CurrentIcon = current.icon;

    return (
        <section
            id="about"
            className="relative overflow-hidden bg-base-100 text-base-content"
        >
            <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-36">

                {/* ================= HEADER ================= */}
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-base-content" />

                        <span className="text-xs font-medium uppercase tracking-[0.3em] text-base-content/60">
                            About Me
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                        <MousePointer2 size={13} />
                        <span>Explore</span>
                    </div>

                </div>


                {/* ================= HERO ================= */}
                <div className="relative mt-16 min-h-97.5 sm:mt-20 sm:min-h-105">

                    {/* Decorative elements */}
                    <div className="absolute left-[5%] top-5 hidden h-12 w-12 rotate-12 rounded-2xl border border-base-content/15 sm:block lg:left-[8%] lg:h-14 lg:w-14" />

                    <div className="absolute right-[8%] top-10 hidden h-3 w-3 rounded-full bg-base-content/20 sm:block lg:right-[12%]" />

                    <div className="absolute bottom-6 left-[12%] hidden h-2 w-2 rounded-full bg-base-content/30 sm:block lg:left-[18%]" />

                    {/* Main heading */}
                    <div className="relative z-10 flex min-h-97.5 items-center justify-center text-center sm:min-h-105">

                        <div className="w-full">

                            <p className="mb-6 text-[9px] uppercase tracking-[0.3em] text-base-content/50 sm:mb-7 sm:text-xs sm:tracking-[0.35em]">
                                Turning ideas into reality
                            </p>

                            <h2 className="text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-7xl md:text-8xl lg:text-[8rem]">

                                <span className="inline-block transition-transform duration-700 hover:-translate-x-2 sm:hover:-translate-x-3">
                                    Turning
                                </span>

                                <br />

                                <span className="inline-block -rotate-2 text-base-content/40 transition-all duration-700 hover:rotate-2 hover:text-base-content/55">
                                    problems
                                </span>

                                <span className="mx-2 inline-block text-base-content/30 sm:mx-5">
                                    into
                                </span>

                                <br className="sm:hidden" />

                                <span className="inline-block rotate-1 transition-transform duration-700 hover:-rotate-2">
                                    solutions.
                                </span>

                            </h2>

                            <p className="mx-auto mt-8 max-w-xl px-3 text-sm leading-7 text-base-content/65 sm:mt-10 sm:px-0 sm:text-base">
                                I focus on understanding real problems and
                                building practical, reliable and user-friendly
                                solutions.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ================= INTERACTIVE SECTION ================= */}
                <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">

                    {/* LEFT NAVIGATION */}
                    <div className="space-y-1">

                        {points.map((point, index) => {
                            const Icon = point.icon;
                            const isActive = active === index;

                            return (
                                <button
                                    key={point.title}
                                    type="button"
                                    onMouseEnter={() => setActive(index)}
                                    onFocus={() => setActive(index)}
                                    onClick={() => setActive(index)}
                                    className={`group flex min-h-18 w-full items-center justify-between border-b border-base-content/10 px-3 py-5 text-left transition-all duration-500 sm:min-h-19 sm:px-4 sm:py-6 ${
                                        isActive
                                            ? "translate-x-1"
                                            : "text-base-content/55 hover:translate-x-1 hover:text-base-content"
                                    }`}
                                >

                                    <div className="flex min-w-0 items-center gap-4 sm:gap-5">

                                        <span
                                            className={`shrink-0 text-xs transition-all duration-500 ${
                                                isActive
                                                    ? "text-base-content/80"
                                                    : "text-base-content/35"
                                            }`}
                                        >
                                            0{index + 1}
                                        </span>

                                        <span
                                            className={`truncate text-base font-medium tracking-tight transition-colors duration-500 sm:text-xl ${
                                                isActive
                                                    ? "text-base-content"
                                                    : ""
                                            }`}
                                        >
                                            {point.title}
                                        </span>

                                    </div>

                                    <Icon
                                        size={18}
                                        className={`ml-4 shrink-0 transition-all duration-500 ${
                                            isActive
                                                ? "rotate-12 text-base-content opacity-100"
                                                : "text-base-content/40 opacity-70"
                                        }`}
                                    />

                                </button>
                            );
                        })}

                    </div>


                    {/* RIGHT CONTENT */}
                    <div className="relative min-h-82.5 overflow-hidden border border-base-content/10 bg-base-200/40">

                        {/* Background number */}
                        <span className="pointer-events-none absolute -right-4 -top-8 select-none text-[9rem] font-bold leading-none -tracking-widest text-base-content opacity-[0.04] transition-all duration-500 sm:-top-10 sm:text-[12rem]">
                            0{active + 1}
                        </span>

                        <div className="relative flex min-h-82.5 flex-col justify-between p-6 sm:p-10">

                            {/* Top */}
                            <div className="flex items-start justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-base-content text-base-100 transition-transform duration-500 hover:rotate-12 sm:h-12 sm:w-12">
                                    <CurrentIcon size={19} />
                                </div>

                                <span className="text-[9px] uppercase tracking-[0.22em] text-base-content/50 sm:text-[10px] sm:tracking-[0.25em]">
                                    {current.label}
                                </span>

                            </div>


                            {/* Content */}
                            <div
                                key={current.title}
                                className="animate-[fadeIn_0.4s_ease-out]"
                            >

                                <h3 className="text-2xl font-medium tracking-tight text-base-content sm:text-4xl">
                                    {current.title}
                                </h3>

                                <p className="mt-4 max-w-xl text-sm leading-7 text-base-content/65 sm:mt-5 sm:text-base">
                                    {current.text}
                                </p>

                            </div>


                            {/* Bottom */}
                            <div className="mt-10 flex items-center justify-between gap-4 sm:mt-12">

                                <span className="text-[10px] text-base-content/45 sm:text-xs">
                                    Hover the items to explore
                                </span>

                                <div className="group/arrow flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-base-content/15 transition-all duration-300 hover:border-base-content/40">
                                    <ArrowUpRight
                                        size={15}
                                        className="transition-transform duration-500 group-hover/arrow:rotate-45"
                                    />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= PHILOSOPHY ================= */}
                <div className="mt-15 flex flex-col items-start justify-between gap-7 border-t border-base-content/10 pt-8 sm:mt-24 sm:flex-row sm:items-end sm:pt-10">

                    <div>

                        <p className="text-[9px] uppercase tracking-[0.3em] text-base-content/50 sm:text-[10px]">
                            My mindset
                        </p>

                        <p className="mt-3 text-xl font-medium tracking-tight text-base-content sm:mt-4 sm:text-3xl">
                            Build something useful.
                            <span className="ml-2 text-base-content/40">
                                Keep learning.
                            </span>
                        </p>

                    </div>

                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-base-content" />
                        Open to opportunities
                    </div>

                </div>

            </div>


            {/* ================= ANIMATION ================= */}
            <style>
                {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(8px);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>

        </section>
    );
};

export default About;


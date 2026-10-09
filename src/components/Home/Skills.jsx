
import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowUpRight,
    Code2,
    Sparkles,
    Layers3,
    MoveUpRight,
    Orbit,
} from "lucide-react";

import { BASE_URL } from "../../services/BaseUrl";

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeSkill, setActiveSkill] = useState(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/skills`);

                if (!response.ok) {
                    throw new Error("Failed to fetch skills");
                }

                const data = await response.json();
                setSkills(data.skills || data || []);
            } catch (error) {
                console.error("Skills fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const categories = useMemo(() => {
        const uniqueCategories = [
            ...new Set(
                skills
                    .map((skill) => skill.category?.trim())
                    .filter(Boolean)
            ),
        ];

        return ["All", ...uniqueCategories];
    }, [skills]);

    const filteredSkills = useMemo(() => {
        if (activeCategory === "All") return skills;

        return skills.filter(
            (skill) => skill.category?.trim() === activeCategory
        );
    }, [skills, activeCategory]);

    const getSkillId = (skill, index) =>
        skill._id || skill.id || `${skill.name}-${index}`;

    const getLevelWidth = (level) => {
        const value = level?.toLowerCase() || "";

        if (value.includes("expert")) return "100%";
        if (value.includes("advanced")) return "85%";
        if (value.includes("intermediate")) return "65%";

        return "40%";
    };

    const changeCategory = (category) => {
        setActiveCategory(category);
        setActiveSkill(null);
    };

    return (
        <section
            id="skills"
            className="relative isolate overflow-hidden bg-base-100 text-base-content"
        >
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
                <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-secondary/10 blur-[110px]" />
                <div className="absolute bottom-20 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />

                <div className="absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--color-base-content)_9%,transparent)_0.7px,transparent_0.7px)] bg-size-[20px_20px] opacity-30" />
            </div>

            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
                {/* Top label */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-sm">
                            <Code2 size={17} />
                        </span>

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-base-content/70 sm:text-xs">
                                Technical Skills
                            </p>

                            <p className="mt-0.5 text-[10px] text-base-content/45">
                                My developer toolkit
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
                            <span className="relative h-2 w-2 rounded-full bg-success" />
                        </span>

                        <span className="text-[9px] font-semibold text-base-content/70 sm:text-[10px]">
                            Always learning
                        </span>
                    </div>
                </div>

                {/* Animated heading */}
                <div className="mt-10 grid gap-7 md:grid-cols-[1fr_280px] md:items-end">
                    <div>
                        <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.23em] text-primary sm:text-xs">
                            <Sparkles size={15} />
                            <span>Skills in motion</span>
                            <span className="h-px w-10 bg-primary/40" />
                        </div>

                        <h2 className="skills-heading max-w-4xl text-4xl font-bold leading-[1.12] tracking-[-0.065em] sm:text-5xl md:text-6xl lg:text-7xl">
                            <span className="skills-word-line skills-first-line block">
                                Curiosity builds.
                            </span>

                            <span className="skills-gradient-text skills-second-line relative mt-2 inline-block pb-3">
                                Code brings it to life.

                                <span className="skills-heading-underline absolute bottom-0 left-0 h-0.75 w-full origin-left rounded-full" />
                            </span>
                        </h2>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-base-content/65 sm:text-base">
                            A growing collection of technologies, tools, and
                            problem-solving skills I use to turn ideas into
                            meaningful digital experiences.
                        </p>
                    </div>

                    {/* Floating creative card */}
                    <div className="skills-float-card relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-100/90 p-5 shadow-lg shadow-base-content/5 backdrop-blur-xl md:mb-1">
                        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-base-content/50">
                                    The toolkit
                                </p>

                                <h3 className="mt-2 text-3xl font-bold tracking-tight">
                                    {skills.length.toString().padStart(2, "0")}
                                    <span className="ml-1 text-primary">+</span>
                                </h3>

                                <p className="mt-1 text-xs text-base-content/55">
                                    Technologies & tools
                                </p>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                                <Orbit
                                    size={28}
                                    className="animate-[spin_14s_linear_infinite]"
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex items-center gap-2 border-t border-base-content/10 pt-4">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                            <p className="text-[10px] font-medium text-base-content/55">
                                Learning today. Building tomorrow.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main skills panel */}
                <div className="skills-panel relative mt-10 overflow-hidden rounded-3xl border border-base-content/10 bg-base-100 shadow-xl shadow-base-content/4">
                    {/* Top accent */}
                    <div className="absolute left-[15%] right-[15%] top-0 h-0.5 bg-linear-to-r from-transparent via-primary to-secondary" />

                    {/* Panel header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-content/10 px-4 py-5 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                                <Layers3 size={20} />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold sm:text-base">
                                    Technology stack
                                </h3>

                                <p className="mt-1 text-xs text-base-content/55">
                                    Explore the tools behind my work
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-base-content/10 bg-base-200/70 px-3 py-2">
                            <span className="h-2 w-2 rounded-full bg-primary" />

                            <span className="text-xs font-semibold text-base-content/70">
                                {filteredSkills.length} skills shown
                            </span>
                        </div>
                    </div>

                    {/* Category tabs */}
                    <div className="border-b border-base-content/10 bg-base-200/30 px-3 py-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const selected = activeCategory === category;

                                const categoryCount =
                                    category === "All"
                                        ? skills.length
                                        : skills.filter(
                                              (skill) =>
                                                  skill.category?.trim() ===
                                                  category
                                          ).length;

                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() =>
                                            changeCategory(category)
                                        }
                                        className={`group inline-flex min-h-10 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-300 sm:px-4 ${
                                            selected
                                                ? "border-primary bg-primary text-primary-content shadow-md shadow-primary/20"
                                                : "border-base-content/10 bg-base-100 text-base-content/70 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                                        }`}
                                    >
                                        <span>{category}</span>

                                        <span
                                            className={`rounded-md px-1.5 py-0.5 text-[9px] ${
                                                selected
                                                    ? "bg-primary-content/15 text-primary-content"
                                                    : "bg-base-200 text-base-content/55 group-hover:bg-primary/10 group-hover:text-primary"
                                            }`}
                                        >
                                            {categoryCount}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Skills content */}
                    <div className="relative min-h-56 p-3 sm:p-6 lg:p-8">
                        {/* Loading */}
                        {loading && (
                            <div className="flex min-h-56 flex-col items-center justify-center gap-4">
                                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                                    <Code2 size={25} />

                                    <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-primary/70" />
                                </div>

                                <p className="text-sm font-medium text-base-content/60">
                                    Loading my toolkit...
                                </p>
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && filteredSkills.length === 0 && (
                            <div className="flex min-h-56 flex-col items-center justify-center text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                                    <Sparkles size={26} />
                                </div>

                                <h3 className="mt-4 text-base font-bold">
                                    Nothing here yet
                                </h3>

                                <p className="mt-2 max-w-xs text-sm leading-6 text-base-content/55">
                                    Skills in this category will appear here
                                    when they are added.
                                </p>

                                {activeCategory !== "All" && (
                                    <button
                                        type="button"
                                        onClick={() => changeCategory("All")}
                                        className="mt-4 rounded-xl border border-primary/25 bg-primary/5 px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
                                    >
                                        Explore all skills
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Responsive, center-aligned skills grid */}
                        {!loading && filteredSkills.length > 0 && (
                            <div
                                key={activeCategory}
                                className="skills-center-reveal mx-auto flex flex-wrap justify-center gap-3 sm:gap-4"
                            >
                                {filteredSkills.map((skill, index) => {
                                    const skillId = getSkillId(skill, index);
                                    const selected = activeSkill === skillId;

                                    return (
                                        <button
                                            key={skillId}
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() =>
                                                setActiveSkill(
                                                    selected ? null : skillId
                                                )
                                            }
                                            onMouseEnter={() =>
                                                setActiveSkill(skillId)
                                            }
                                            onMouseLeave={() =>
                                                setActiveSkill(null)
                                            }
                                            onFocus={() =>
                                                setActiveSkill(skillId)
                                            }
                                            onBlur={() =>
                                                setActiveSkill(null)
                                            }
                                            style={{
                                                "--card-index": index,
                                            }}
                                            className={`skill-modern-card group relative flex min-h-36 w-[calc(33.333%-8px)] flex-col items-center justify-center overflow-hidden rounded-2xl border px-1.5 py-4 text-center transition-all duration-300 sm:min-h-40 sm:w-[calc(25%-12px)] sm:px-3 sm:py-5 lg:w-[calc(20%-13px)] xl:w-[calc(16.666%-14px)] ${
                                                selected
                                                    ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                                                    : "border-base-content/10 bg-base-100 hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/[0.035] hover:shadow-lg hover:shadow-base-content/5"
                                            }`}
                                        >
                                            {/* Subtle card accent */}
                                            <span
                                                className={`pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 ${
                                                    selected
                                                        ? "opacity-100"
                                                        : "opacity-0 group-hover:opacity-100"
                                                }`}
                                            />

                                            {/* Top corner mark */}
                                            <span className="absolute left-3 top-3 h-1.5 w-1.5 rounded-full bg-primary/45 transition-all duration-300 group-hover:scale-150 group-hover:bg-primary" />

                                            {/* Icon container */}
                                            <div
                                                className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 sm:h-14 sm:w-14 ${
                                                    selected
                                                        ? "scale-105 border-primary/30 bg-primary/10 shadow-sm"
                                                        : "border-base-content/10 bg-base-200/70 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:bg-primary/5"
                                                }`}
                                            >
                                                {skill.icon ? (
                                                    <img
                                                        src={skill.icon}
                                                        alt={`${skill.name} icon`}
                                                        loading="lazy"
                                                        className="h-7 w-7 object-contain sm:h-8 sm:w-8"
                                                    />
                                                ) : (
                                                    <span className="text-xl font-bold text-primary">
                                                        {skill.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Skill name */}
                                            <h4
                                                className={`relative mt-3 w-full wrap-break-word text-[10px] font-bold leading-4 transition-colors duration-300 sm:text-xs ${
                                                    selected
                                                        ? "text-primary"
                                                        : "text-base-content/85 group-hover:text-primary"
                                                }`}
                                            >
                                                {skill.name}
                                            </h4>

                                            {/* Skill level */}
                                            <span className="relative mt-1.5 hidden text-[10px] font-medium text-base-content/55 sm:block">
                                                {skill.level || "Learning"}
                                            </span>

                                            {/* Skill level indicator */}
                                            <div className="relative mt-2 h-1 w-10 overflow-hidden rounded-full bg-base-content/10 sm:w-12">
                                                <div
                                                    className="h-full rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-700"
                                                    style={{
                                                        width: getLevelWidth(
                                                            skill.level
                                                        ),
                                                    }}
                                                />
                                            </div>

                                            {/* Hover arrow */}
                                            <span
                                                className={`absolute right-2 top-2 transition-all duration-300 ${
                                                    selected
                                                        ? "translate-x-0 translate-y-0 opacity-100"
                                                        : "translate-x-1 -translate-y-1 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                                                }`}
                                            >
                                                <ArrowUpRight
                                                    size={14}
                                                    className="text-primary"
                                                />
                                            </span>

                                            {/* Bottom accent */}
                                            <span
                                                className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-300 ${
                                                    selected
                                                        ? "w-1/2"
                                                        : "w-0 group-hover:w-1/3"
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Panel footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-content/10 bg-base-200/40 px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                                <Sparkles size={13} />
                            </span>

                            <span className="text-xs font-medium text-base-content/65">
                                {activeCategory === "All"
                                    ? "The complete toolkit"
                                    : `${activeCategory} toolkit`}
                            </span>
                        </div>

                        <span className="text-xs font-semibold text-base-content/55">
                            {filteredSkills.length}{" "}
                            {filteredSkills.length === 1
                                ? "technology"
                                : "technologies"}
                        </span>
                    </div>
                </div>

                {/* Signature footer */}
                <div className="mt-7 flex flex-col gap-4 border-t border-base-content/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.23em] text-base-content/45">
                            Crafted with curiosity
                        </p>

                        <h3 className="mt-1.5 text-base font-bold tracking-tight sm:text-lg">
                            Mohammad Akib
                            <span className="ml-2 text-primary">✳</span>
                        </h3>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-base-content/55">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                            <MoveUpRight size={16} />
                        </span>

                        <span>
                            <span className="block font-semibold text-base-content/80">
                                Always building.
                            </span>

                            <span className="mt-0.5 block">
                                Always becoming better.
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style>{`
                /* Heading entrance */
                .skills-heading {
                    animation: skillsHeadingEnter 900ms
                        cubic-bezier(0.16, 1, 0.3, 1) both;
                }

                /* First line: subtle movement */
                .skills-first-line {
                    transform-origin: left center;
                    animation: skillsFirstLineMotion 5s ease-in-out infinite;
                }

                /* Second line: animated gradient + tilt */
                .skills-gradient-text {
                    background: linear-gradient(
                        100deg,
                        var(--color-primary),
                        var(--color-secondary),
                        var(--color-primary)
                    );

                    background-size: 200% auto;
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;

                    transform-origin: left center;

                    animation:
                        skillsGradientFlow 7s ease-in-out infinite,
                        skillsSecondLineMotion 4.5s ease-in-out infinite;
                }

                /* Underline draws from left to right */
                .skills-heading-underline {
                    background: linear-gradient(
                        90deg,
                        var(--color-primary),
                        var(--color-secondary),
                        transparent
                    );

                    animation: skillsUnderline 1.2s
                        cubic-bezier(0.16, 1, 0.3, 1) both;
                }

                /* Floating toolkit card */
                .skills-float-card {
                    animation: skillsFloat 6s ease-in-out infinite;
                }

                /* Skill cards appear from the center */
                .skills-center-reveal > * {
                    animation: skillFromCenter 550ms
                        cubic-bezier(0.16, 1, 0.3, 1) both;

                    animation-delay: calc(
                        min(var(--card-index), 12) * 35ms
                    );
                }

                .skill-modern-card {
                    -webkit-tap-highlight-color: transparent;
                }

                /* First line moves gently */
                @keyframes skillsFirstLineMotion {
                    0%, 100% {
                        transform: translateX(0) rotate(0deg);
                    }

                    30% {
                        transform: translateX(5px) rotate(-0.6deg);
                    }

                    65% {
                        transform: translateX(-2px) rotate(0.4deg);
                    }
                }

                /* Second line bends and floats */
                @keyframes skillsSecondLineMotion {
                    0%, 100% {
                        transform: translateY(0) rotate(-1deg) skewX(-1deg);
                    }

                    25% {
                        transform: translateY(-5px) rotate(1deg) skewX(1deg);
                    }

                    50% {
                        transform: translateY(1px) rotate(-0.5deg) skewX(-1.5deg);
                    }

                    75% {
                        transform: translateY(-3px) rotate(0.8deg) skewX(0.5deg);
                    }
                }

                /* Gradient continuously flows */
                @keyframes skillsGradientFlow {
                    0%, 100% {
                        background-position: 0% center;
                    }

                    50% {
                        background-position: 100% center;
                    }
                }

                /* Heading entrance */
                @keyframes skillsHeadingEnter {
                    from {
                        opacity: 0;
                        transform: translateY(22px) rotate(-1.5deg);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0) rotate(0deg);
                    }
                }

                /* Underline reveal */
                @keyframes skillsUnderline {
                    from {
                        transform: scaleX(0);
                    }

                    to {
                        transform: scaleX(1);
                    }
                }

                /* Toolkit card floats gently */
                @keyframes skillsFloat {
                    0%, 100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-5px);
                    }
                }

                /* Cards appear with a subtle pop */
                @keyframes skillFromCenter {
                    0% {
                        opacity: 0;
                        transform: scale(0.88) translateY(12px);
                    }

                    65% {
                        opacity: 1;
                        transform: scale(1.025) translateY(-1px);
                    }

                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                /* Hover: make heading movement a little livelier */
                @media (hover: hover) and (pointer: fine) {
                    .skills-heading:hover .skills-first-line {
                        animation-duration: 2.5s;
                    }

                    .skills-heading:hover .skills-gradient-text {
                        animation-duration: 3s, 2.5s;
                    }
                }

                /* Respect reduced-motion preferences */
                @media (prefers-reduced-motion: reduce) {
                    .skills-gradient-text,
                    .skills-heading-underline,
                    .skills-heading,
                    .skills-first-line,
                    .skills-float-card {
                        animation: none !important;
                    }

                    .skills-center-reveal > * {
                        animation: none !important;
                    }

                    .skill-modern-card {
                        transition: none;
                    }
                }

                /* Small mobile cards */
                @media (max-width: 380px) {
                    .skill-modern-card {
                        width: calc(50% - 6px);
                    }
                }
            `}</style>
        </section>
    );
};

export default Skills;


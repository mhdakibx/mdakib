import React, { useEffect, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { BASE_URL } from "../../services/BaseUrl";

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const getSkillId = (skill, index) => {
        return skill._id || skill.id || `${skill.name}-${index}`;
    };

    return (
        <section
            id="skills"
            className="overflow-hidden bg-base-100 text-base-content"
        >
            <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">

                {/* TOP BAR */}
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-base-content" />

                        <span className="text-[9px] uppercase tracking-[0.3em] text-base-content/45">
                            Skills
                        </span>
                    </div>

                    <div className="hidden items-center gap-2 text-[10px] text-base-content/35 sm:flex">
                        <Sparkles size={12} />

                        <span>My toolkit</span>
                    </div>

                </div>

                {/* HEADING AREA */}
                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">

                    {/* RUNNING TITLE */}
                    <div className="min-w-0">

                        <p className="mb-3 text-[8px] uppercase tracking-[0.3em] text-base-content/30">
                            Technologies I work with
                        </p>

                        {/* TOOLKIT MARQUEE */}
                        <div className="w-full overflow-hidden py-1">

                            <div className="flex w-max animate-toolkit items-center whitespace-nowrap text-[3.5rem] font-semibold leading-[0.95] tracking-[-0.07em] sm:text-6xl lg:text-[7rem]">

                                {/* ITEM 1 */}
                                <span className="inline-block">
                                    My{" "}
                                    <span className="text-base-content/20">
                                        toolkit.
                                    </span>

                                    <span className="mx-7 text-base-content/10">
                                        ✦
                                    </span>
                                </span>

                                {/* ITEM 2 */}
                                <span className="inline-block">
                                    My{" "}
                                    <span className="text-base-content/20">
                                        toolkit.
                                    </span>

                                    <span className="mx-7 text-base-content/10">
                                        ✦
                                    </span>
                                </span>

                                {/* ITEM 3 */}
                                <span className="inline-block">
                                    My{" "}
                                    <span className="text-base-content/20">
                                        toolkit.
                                    </span>

                                    <span className="mx-7 text-base-content/10">
                                        ✦
                                    </span>
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* DESCRIPTION */}
                    <p className="max-w-sm text-xs leading-5 text-base-content/45 lg:pb-1">
                        A collection of technologies I use to build modern,
                        reliable and user-friendly digital experiences.
                    </p>

                </div>

                {/* SKILLS */}
                <div className="mt-10">

                    {/* LOADING */}
                    {loading && (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div
                                    key={item}
                                    className="h-40 animate-pulse rounded-xl border border-base-content/10 bg-base-content/2.5"
                                />
                            ))}
                        </div>
                    )}

                    {/* SKILLS GRID */}
                    {!loading && skills.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">

                            {skills.map((skill, index) => {
                                const skillId = getSkillId(skill, index);
                                const isActive =
                                    activeSkill === skillId;

                                return (
                                    <button
                                        key={skillId}
                                        type="button"
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
                                        onClick={() =>
                                            setActiveSkill(
                                                isActive
                                                    ? null
                                                    : skillId
                                            )
                                        }
                                        className={`group relative flex min-h-40 flex-col justify-between overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 sm:p-5 ${
                                            isActive
                                                ? "-translate-y-1 border-base-content/20 bg-base-content/5.5"
                                                : "border-base-content/10 bg-base-content/[0.012] hover:-translate-y-1 hover:border-base-content/20 hover:bg-base-content/[0.035]"
                                        }`}
                                    >

                                        {/* BIG NUMBER */}
                                        <span
                                            className={`pointer-events-none absolute -right-1 -top-2 select-none text-6xl font-bold leading-none -tracking-widest transition-opacity duration-500 ${
                                                isActive
                                                    ? "opacity-[0.045]"
                                                    : "opacity-0 group-hover:opacity-[0.025]"
                                            }`}
                                        >
                                            {String(index + 1).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>

                                        {/* TOP */}
                                        <div className="relative z-10 flex items-start justify-between">

                                            {/* ICON */}
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border transition-all duration-300 ${
                                                    isActive
                                                        ? "border-base-content/20 bg-base-content/10"
                                                        : "border-base-content/10 bg-base-content/2.5"
                                                }`}
                                            >
                                                {skill.icon ? (
                                                    <img
                                                        src={skill.icon}
                                                        alt={skill.name}
                                                        className="h-6 w-6 object-contain"
                                                    />
                                                ) : (
                                                    <span className="text-xs font-medium text-base-content/35">
                                                        {skill.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* NUMBER + ARROW */}
                                            <div className="flex items-center gap-2">

                                                <span className="text-[8px] tracking-widest text-base-content/25">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </span>

                                                <span
                                                    className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${
                                                        isActive
                                                            ? "rotate-45 border-base-content/25 bg-base-content text-base-100"
                                                            : "border-base-content/10 text-base-content/35"
                                                    }`}
                                                >
                                                    <ArrowUpRight size={12} />
                                                </span>

                                            </div>
                                        </div>

                                        {/* INFO */}
                                        <div className="relative z-10 mt-4">

                                            <h3
                                                className={`text-xl font-medium leading-none tracking-[-0.04em] transition-all duration-300 sm:text-2xl ${
                                                    isActive
                                                        ? "translate-x-1 text-base-content"
                                                        : "text-base-content/65 group-hover:text-base-content"
                                                }`}
                                            >
                                                {skill.name}
                                            </h3>

                                            <p className="mt-2 text-[7px] uppercase tracking-[0.28em] text-base-content/30">
                                                {skill.category ||
                                                    "Technology"}
                                            </p>

                                        </div>

                                        {/* LEVEL */}
                                        <div className="relative z-10 mt-4">

                                            <div className="flex items-center justify-between">

                                                <span className="text-[7px] uppercase tracking-[0.2em] text-base-content/25">
                                                    Level
                                                </span>

                                                <span
                                                    className={`text-[8px] uppercase tracking-wider ${
                                                        isActive
                                                            ? "text-base-content"
                                                            : "text-base-content/40"
                                                    }`}
                                                >
                                                    {skill.level ||
                                                        "Learning"}
                                                </span>

                                            </div>

                                            <div className="mt-1.5 h-0.75 overflow-hidden rounded-full bg-base-content/10">

                                                <div
                                                    className={`h-full rounded-full bg-base-content transition-all duration-700 ${
                                                        skill.level
                                                            ?.toLowerCase()
                                                            .includes(
                                                                "expert"
                                                            )
                                                            ? "w-full"
                                                            : skill.level
                                                                  ?.toLowerCase()
                                                                  .includes(
                                                                      "advanced"
                                                                  )
                                                            ? "w-[85%]"
                                                            : skill.level
                                                                  ?.toLowerCase()
                                                                  .includes(
                                                                      "intermediate"
                                                                  )
                                                            ? "w-[65%]"
                                                            : "w-[40%]"
                                                    }`}
                                                />

                                            </div>

                                        </div>

                                        {/* BOTTOM LINE */}
                                        <div
                                            className={`absolute bottom-0 left-0 h-px transition-all duration-500 ${
                                                isActive
                                                    ? "w-full bg-base-content/30"
                                                    : "w-0 bg-base-content/15 group-hover:w-full"
                                            }`}
                                        />

                                    </button>
                                );
                            })}

                        </div>
                    )}

                    {/* EMPTY */}
                    {!loading && skills.length === 0 && (
                        <div className="rounded-xl border border-base-content/10 py-12 text-center">

                            <h3 className="text-base font-medium">
                                Skills are coming soon.
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-xs text-base-content/40">
                                Your technical skills will appear here once
                                they are added from the admin panel.
                            </p>

                        </div>
                    )}

                </div>

                {/* FOOTER */}
                <div className="mt-8 flex flex-col gap-3 border-t border-base-content/10 pt-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <p className="text-[8px] uppercase tracking-[0.3em] text-base-content/25">
                            Always learning
                        </p>

                        <p className="mt-1 text-sm font-medium sm:text-base">
                            The toolkit keeps growing.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-[9px] text-base-content/35">

                        <span className="h-1.5 w-1.5 rounded-full bg-base-content" />

                        <span>
                            {skills.length} skills
                        </span>

                    </div>

                </div>

            </div>

            {/* MARQUEE ANIMATION */}
            <style>
                {`
                    @keyframes toolkitMove {
                        0% {
                            transform: translateX(0);
                        }

                        100% {
                            transform: translateX(-33.333%);
                        }
                    }

                    .animate-toolkit {
                        animation: toolkitMove 14s linear infinite;
                    }

                    .animate-toolkit:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>

        </section>
    );
};

export default Skills;
import React, { useEffect, useState } from "react";
import {
    ArrowUpRight,
    ExternalLink,
    LoaderCircle,
    Sparkles,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { BASE_URL } from "./../../services/BaseUrl";
import { Link } from "react-router";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/projects`);

                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }

                const data = await response.json();

                setProjects(data.projects || []);
            } catch (error) {
                console.error("Project fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <section
            id="projects"
            className="relative overflow-hidden bg-base-100 px-4 text-base-content sm:px-6 sm:pb-12 sm:pt-6 md:px-8 lg:px-10 xl:px-12"
        >
            {/* ================= BACKGROUND ================= */}

            <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-base-content/5 blur-3xl sm:h-96 sm:w-96" />

            <div className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-base-content/5 blur-3xl sm:h-96 sm:w-96" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 rounded-full border border-base-content/5" />

            <div className="mx-auto max-w-7xl">

                {/* ================= HEADER ================= */}

                <div className="mb-8 grid gap-6 sm:mb-10 sm:gap-8 md:grid-cols-[minmax(0,1fr)_220px] md:items-center lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_270px]">

                    {/* ================= LEFT ================= */}

                    <div className="min-w-0">

                        <div className="mb-4 flex items-center gap-3 sm:mb-5">

                            <span className="h-px w-7 bg-base-content/40 sm:w-10" />

                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/45 sm:text-[10px]">
                                02 — Selected Work
                            </span>

                        </div>

                        {/* MOVABLE HEADING */}

                        <h2 className="max-w-4xl text-[3rem] font-black leading-[0.8] tracking-[-0.08em] sm:text-6xl md:text-[4.5rem] lg:text-[5.5rem] xl:text-8xl">

                            <span className="inline-block transition-all duration-500 hover:-translate-x-2 hover:-translate-y-1">
                                Things
                            </span>

                            <br />

                            <span className="ml-4 inline-block -rotate-2 transition-all duration-500 hover:translate-x-2 hover:rotate-0 sm:ml-7">
                                I've
                            </span>

                            <span className="relative ml-2 inline-block rotate-2 border-b-[3px] border-base-content pb-2 transition-all duration-500 hover:-translate-y-1 hover:rotate-0">

                                built.

                                <span className="absolute -right-4 -top-3 h-2 w-2 rounded-full bg-base-content transition-transform duration-500 hover:scale-150" />

                            </span>

                        </h2>

                    </div>

                    {/* ================= FLOATING BOX ================= */}

                    <div className="relative w-full md:justify-self-end">

                        <div className="group relative w-full max-w-67.5 overflow-hidden rounded-3xl border border-base-content/10 bg-base-200 p-4 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:rotate-1 hover:border-base-content/20 hover:shadow-xl sm:p-5 md:max-w-55 lg:max-w-62.5 xl:max-w-67.5">

                            {/* TOP */}

                            <div className="mb-5 flex items-center justify-between sm:mb-6">

                                <div className="flex gap-1.5">

                                    <span className="h-1.5 w-1.5 rounded-full bg-base-content/30" />

                                    <span className="h-1.5 w-1.5 rounded-full bg-base-content/20" />

                                    <span className="h-1.5 w-1.5 rounded-full bg-base-content/10" />

                                </div>

                                <Sparkles
                                    size={14}
                                    className="text-base-content/35 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                                />

                            </div>

                            {/* CONTENT */}

                            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.3em] text-base-content/40">
                                Building in public
                            </p>

                            {/* IMPORTANT: nowrap */}

                            <div className="whitespace-nowrap text-[15px] font-black leading-tight tracking-[-0.045em] sm:text-base lg:text-[17px]">

                                Ideas

                                <span className="mx-1 text-base-content/30">
                                    →
                                </span>

                                Interfaces

                                <span className="mx-1 text-base-content/30">
                                    →
                                </span>

                                Impact

                            </div>

                            {/* BOTTOM */}

                            <div className="mt-5 flex items-end justify-between border-t border-base-content/10 pt-3 sm:mt-6 sm:pt-4">

                                <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-base-content/35">
                                    Selected
                                </span>

                                <span className="font-mono text-lg font-black tracking-[-0.08em] sm:text-xl">
                                    {String(projects.length).padStart(2, "0")}
                                </span>

                            </div>

                            {/* DECORATION */}

                            <div className="pointer-events-none absolute -bottom-8 -right-8 h-20 w-20 rounded-full border border-base-content/10 transition-transform duration-700 group-hover:scale-125" />

                        </div>

                    </div>

                </div>

                {/* ================= LOADING ================= */}

                {loading && (
                    <div className="flex min-h-52 items-center justify-center">

                        <LoaderCircle
                            size={30}
                            className="animate-spin text-base-content/35"
                        />

                    </div>
                )}

                {/* ================= EMPTY ================= */}

                {!loading && projects.length === 0 && (
                    <div className="rounded-[1.75rem] border border-base-content/10 bg-base-200 px-6 py-16 text-center sm:py-20">

                        <p className="text-sm text-base-content/50">
                            No projects available yet.
                        </p>

                    </div>
                )}

                {/* ================= PROJECT GRID ================= */}

                {!loading && projects.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {projects.map((project) => (
                            <article
                                key={project._id}
                                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-base-content/10 bg-base-200 p-2 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-base-content/20 hover:shadow-2xl"
                            >

                                {/* ================= IMAGE ================= */}

                                <div className="relative overflow-hidden rounded-[1.35rem] bg-base-300">

                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="h-44 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 sm:h-48 lg:h-44 xl:h-52"
                                        />
                                    ) : (
                                        <div className="h-44 sm:h-48 lg:h-44 xl:h-52" />
                                    )}

                                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-70" />

                                </div>

                                {/* ================= CONTENT ================= */}

                                <div className="flex flex-1 flex-col px-3 pb-3 pt-4 sm:px-4 sm:pb-4 sm:pt-5">

                                    {/* TITLE */}

                                    <div className="mb-4 flex items-start justify-between gap-3">

                                        <div className="min-w-0">

                                            <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.25em] text-base-content/35">
                                                Selected Work
                                            </p>

                                            <h3 className="truncate text-xl font-black tracking-[-0.055em] sm:text-2xl">
                                                {project.title}
                                            </h3>

                                        </div>

                                        {/* TITLE ARROW */}

                                        <Link
                                            to={`/projects/${project._id}`}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-base-content/10 bg-base-100 text-base-content/50 transition-all duration-300 hover:bg-base-content hover:text-base-100"
                                        >
                                            <ArrowUpRight size={15} />
                                        </Link>

                                    </div>

                                    {/* ================= DETAILS ================= */}

                                    <Link
                                        to={`/projects/${project._id}`}
                                        className="group/details mb-3 flex w-full items-center justify-between rounded-xl border border-base-content/10 bg-base-100 px-4 py-3 text-xs font-semibold transition-all duration-300 hover:border-base-content/20 hover:bg-base-content hover:text-base-100"
                                    >

                                        <span>
                                            See Full Details
                                        </span>

                                        <ArrowUpRight
                                            size={15}
                                            className="transition-transform duration-300 group-hover/details:-translate-y-0.5 group-hover/details:translate-x-0.5"
                                        />

                                    </Link>

                                    {/* ================= LINKS ================= */}

                                    <div className="grid grid-cols-2 gap-2.5">

                                        {/* GITHUB */}

                                        {project.githubUrl && (
                                            <Link
                                                to={project.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group/github flex items-center justify-center gap-2 rounded-xl border border-base-content/10 bg-base-100 px-3 py-2.5 text-xs font-semibold text-base-content/60 transition-all duration-300 hover:border-base-content/25 hover:text-base-content"
                                            >

                                                <FaGithub
                                                    size={15}
                                                    className="transition-transform duration-300 group-hover/github:scale-110"
                                                />

                                                GitHub

                                            </Link>
                                        )}

                                        {/* LIVE */}

                                        {project.liveUrl && (
                                            <Link
                                                to={project.liveUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group/live flex items-center justify-center gap-2 rounded-xl bg-base-content px-3 py-2.5 text-xs font-semibold text-base-100 transition-all duration-300 hover:opacity-90"
                                            >

                                                <ExternalLink
                                                    size={14}
                                                    className="transition-transform duration-300 group-hover/live:translate-x-1"
                                                />

                                                Live

                                            </Link>
                                        )}

                                    </div>

                                </div>

                                {/* ================= CARD DECORATION ================= */}

                                <div className="pointer-events-none absolute right-5 top-5 h-2 w-2 rounded-full border border-base-content/30 transition-all duration-500 group-hover:scale-[3]" />

                                <div className="absolute bottom-0 left-5 right-5 h-px origin-left scale-x-0 bg-base-content/50 transition-transform duration-500 group-hover:scale-x-100" />

                            </article>
                        ))}

                    </div>
                )}

                {/* ================= FOOTER ================= */}

                {!loading && projects.length > 0 && (
                    <div className="mt-7 flex flex-col gap-4 border-t border-base-content/10 pt-5 sm:mt-9 sm:flex-row sm:items-center sm:justify-between">

                        {/* COUNT */}

                        <div className="flex items-center gap-3">

                            <span className="relative flex h-2 w-2">

                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-base-content/30" />

                                <span className="relative inline-flex h-2 w-2 rounded-full bg-base-content/50" />

                            </span>

                            <p className="text-xs text-base-content/40">
                                {projects.length}{" "}
                                {projects.length === 1
                                    ? "project"
                                    : "projects"}{" "}
                                available
                            </p>

                        </div>

                        {/* GITHUB */}

                        <Link
                            to={"https://github.com/mhdakibx"}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex w-fit items-center gap-2 text-xs font-semibold"
                        >

                            Explore GitHub

                            <ArrowUpRight
                                size={15}
                                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                            />

                        </Link>

                    </div>
                )}

            </div>
        </section>
    );
};

export default Projects;
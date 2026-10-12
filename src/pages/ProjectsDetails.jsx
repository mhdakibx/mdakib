import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
    AlertCircle,
    ArrowLeft,
    ArrowUpRight,
    ExternalLink,
    LoaderCircle,
    RefreshCw,
    Sparkles,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { BASE_URL } from "./../services/BaseUrl";

const ProjectsDetails = () => {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= SCROLL TO TOP =================

    useLayoutEffect(() => {
        const scrollToTop = () => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        scrollToTop();

        const frame = requestAnimationFrame(scrollToTop);

        return () => cancelAnimationFrame(frame);
    }, [id]);

    // ================= FETCH PROJECT =================

    useEffect(() => {
        const controller = new AbortController();

        const fetchProject = async () => {
            setLoading(true);
            setError("");
            setProject(null);

            try {
                if (!id) {
                    throw new Error("Project ID is missing.");
                }

                const response = await fetch(
                    `${BASE_URL}/api/projects/${id}`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Project not found.");
                    }

                    throw new Error(
                        "Unable to load project. Please try again."
                    );
                }

                const data = await response.json();
                const projectData = data.project || data;

                if (!projectData || !projectData._id) {
                    throw new Error("Project data is unavailable.");
                }

                setProject(projectData);
            } catch (err) {
                if (err.name === "AbortError") return;

                console.error("Project details error:", err);

                setError(
                    err.message ||
                        "Something went wrong while loading the project."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchProject();

        return () => controller.abort();
    }, [id]);

    // ================= LOADING =================

    if (loading) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-base-100 px-4 text-base-content">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-base-content/10 bg-base-200">
                        <LoaderCircle
                            size={28}
                            className="animate-spin text-primary"
                        />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-base-content/40">
                        Loading project
                    </p>
                </div>
            </section>
        );
    }

    // ================= FETCH ERROR =================

    if (error) {
        return (
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-100 px-4 text-base-content sm:px-6">
                <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

                <div className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

                <div className="relative w-full max-w-md rounded-3xl border border-base-content/10 bg-base-200 p-7 text-center shadow-xl sm:p-9">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-base-content/10 bg-base-100">
                        <AlertCircle size={28} className="text-error" />
                    </div>

                    <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/40">
                        Something went wrong
                    </p>

                    <h1 className="text-3xl font-black tracking-tight">
                        Unable to load project
                    </h1>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-base-content/60">
                        {error}
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <RefreshCw
                                size={16}
                                className="transition-transform duration-500 group-hover:rotate-180"
                            />
                            Try Again
                        </button>

                        <Link
                            to="/projects"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-base-content/10 bg-base-100 px-5 py-3 text-sm font-semibold text-base-content/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:text-primary"
                        >
                            <ArrowLeft size={16} />
                            View Projects
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    // ================= PROJECT NOT FOUND =================

    if (!project) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-base-100 px-5 text-base-content">
                <div className="w-full max-w-md rounded-3xl border border-base-content/10 bg-base-200 p-8 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-base-100">
                        <Sparkles size={22} className="text-primary" />
                    </div>

                    <h1 className="text-3xl font-black tracking-tight">
                        Project not found
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-base-content/60">
                        The project you're looking for doesn't exist or may
                        have been removed.
                    </p>

                    <Link
                        to="/projects"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        <ArrowLeft size={16} />
                        View All Projects
                    </Link>
                </div>
            </section>
        );
    }

    // ================= PROJECT DETAILS =================

    return (
        <section className="relative min-h-screen overflow-hidden bg-base-100 px-4 py-8 text-base-content sm:px-6 sm:py-10 md:px-8 lg:px-10 xl:px-12">
            {/* BACKGROUND */}

            <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96" />

            <div className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl sm:h-96 sm:w-96" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-base-content/4" />

            <div className="relative mx-auto max-w-7xl">
                {/* HEADER */}

                <div className="mb-8 flex items-center justify-between gap-3 sm:mb-10">
                    <Link
                        to="/projects"
                        className="group inline-flex items-center gap-2 rounded-full border border-base-content/10 bg-base-200/70 px-4 py-2.5 text-xs font-semibold text-base-content/65 transition-all duration-300 hover:-translate-x-1 hover:border-primary/40 hover:text-primary"
                    >
                        <ArrowLeft
                            size={15}
                            className="transition-transform duration-300 group-hover:-translate-x-1"
                        />
                        All Projects
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-base-content/40 sm:text-[10px]">
                            Project Details
                        </span>
                    </div>
                </div>

                {/* HERO */}

                <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10">
                    <div className="min-w-0">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-8 bg-primary" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/45">
                                Selected Work
                            </span>
                        </div>

                        <h1 className="break-words text-5xl font-black leading-[0.95] tracking-[-0.065em] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-8xl">
                            {project.title}
                            <span className="ml-1 inline-block text-primary">
                                .
                            </span>
                        </h1>

                        <div className="mt-6 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                                Portfolio Project
                            </span>

                            {project.technologies?.length > 0 && (
                                <span className="rounded-full border border-base-content/10 bg-base-200 px-3 py-1.5 text-[10px] font-semibold text-base-content/55">
                                    {project.technologies.length} Technologies
                                </span>
                            )}
                        </div>
                    </div>

                    {/* PROJECT HIGHLIGHTS */}

                    <div className="group relative isolate min-w-0 overflow-hidden rounded-3xl border border-base-content/10 bg-base-200/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl sm:p-6 lg:p-7">
                        <div className="pointer-events-none absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl transition-transform duration-700 group-hover:scale-150" />

                        <div className="pointer-events-none absolute -bottom-16 -left-10 -z-10 h-36 w-36 rounded-full bg-secondary/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-base-content/10 bg-base-100 shadow-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
                                    <Sparkles size={19} className="text-primary" />
                                </div>

                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-base-content/45 sm:text-[10px]">
                                        Project Insights
                                    </p>
                                    <h2 className="mt-1 text-lg font-black tracking-tight sm:text-xl">
                                        Project Highlights
                                        <span className="text-primary">.</span>
                                    </h2>
                                </div>
                            </div>

                            <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-primary sm:text-[10px]">
                                Snapshot
                            </span>
                        </div>

                        <div className="my-5 h-px overflow-hidden bg-base-content/10">
                            <div className="h-full w-1/3 animate-[snapshotLine_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-primary to-transparent" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-base-content/10 bg-base-100/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md sm:p-5">
                                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Sparkles size={17} />
                                </div>

                                <p className="text-2xl font-black tracking-tight sm:text-3xl">
                                    {String(project.technologies?.length || 0).padStart(2, "0")}
                                </p>

                                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-base-content/45 sm:text-xs">
                                    Technologies
                                </p>
                            </div>

                            <div className="rounded-2xl border border-base-content/10 bg-base-100/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md sm:p-5">
                                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-base-200 text-base-content">
                                    <FaGithub size={19} />
                                </div>

                                <p className="text-lg font-black tracking-tight sm:text-xl">
                                    {project.githubUrl ? "Available" : "Unavailable"}
                                </p>

                                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-base-content/45 sm:text-xs">
                                    Source Code
                                </p>
                            </div>

                            <div className="rounded-2xl border border-base-content/10 bg-base-100/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md sm:p-5">
                                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <ExternalLink size={17} />
                                </div>

                                <p className="text-lg font-black tracking-tight sm:text-xl">
                                    {project.liveUrl ? "Available" : "Unavailable"}
                                </p>

                                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-base-content/45 sm:text-xs">
                                    Live Preview
                                </p>
                            </div>

                            <div className="rounded-2xl border border-base-content/10 bg-base-100/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md sm:p-5">
                                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                                    <ArrowUpRight size={18} />
                                </div>

                                <p className="text-lg font-black tracking-tight sm:text-xl">
                                    Project
                                </p>

                                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-base-content/45 sm:text-xs">
                                    Selected Work
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center gap-3 border-t border-base-content/10 pt-4">
                            <span className="relative flex h-2 w-2 shrink-0">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
                                <span className="relative h-2 w-2 rounded-full bg-primary" />
                            </span>

                            <p className="text-[10px] font-medium leading-5 text-base-content/50 sm:text-xs">
                                Explore the tools, source code, and live experience.
                            </p>
                        </div>
                    </div>
                </div>

                {/* PROJECT IMAGE */}

                <div className="group relative mt-8 overflow-hidden rounded-3xl border border-base-content/10 bg-base-200 p-2 shadow-sm sm:mt-10 sm:rounded-[2.5rem]">
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                loading="eager"
                                className="h-64 w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03] sm:h-80 md:h-[420px] lg:h-[500px]"
                            />
                        ) : (
                            <div className="flex h-64 items-center justify-center bg-base-300 sm:h-80 md:h-[420px] lg:h-[500px]">
                                <span className="text-5xl font-black tracking-[-0.08em] text-base-content/15 sm:text-7xl">
                                    PROJECT
                                </span>
                            </div>
                        )}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md sm:bottom-6 sm:left-6 sm:px-4">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                            Project Preview
                        </div>

                        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition-transform duration-500 group-hover:rotate-45 sm:right-6 sm:top-6 sm:h-12 sm:w-12">
                            <ArrowUpRight size={21} />
                        </div>
                    </div>
                </div>

                {/* ABOUT THE PROJECT */}

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-10">
                    <div className="min-w-0 rounded-3xl border border-base-content/10 bg-base-200/70 p-5 transition-all duration-500 hover:border-primary/20 sm:p-7">
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/45">
                                    About the Project
                                </p>

                                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                                    What I Built
                                    <span className="text-primary">.</span>
                                </h2>
                            </div>

                            <span className="hidden font-mono text-xs text-base-content/35 sm:block">
                                01
                            </span>
                        </div>

                        <p className="break-words text-sm leading-7 text-base-content/65 sm:text-base sm:leading-8">
                            {project.description ||
                                "Project description is currently unavailable."}
                        </p>

                        {/* TECHNOLOGIES */}

                        <div className="mt-8 border-t border-base-content/10 pt-6">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/45">
                                    Technologies
                                </p>

                                <span className="font-mono text-[10px] text-base-content/35">
                                    {String(project.technologies?.length || 0).padStart(2, "0")} TOOLS
                                </span>
                            </div>

                            {project.technologies?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((technology, index) => (
                                        <span
                                            key={`${technology}-${index}`}
                                            className="rounded-full border border-base-content/10 bg-base-100 px-4 py-2 text-xs font-semibold text-base-content/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                                        >
                                            {technology}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-base-content/45">
                                    No technologies added yet.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* PROJECT LINKS */}

                    <div className="h-fit min-w-0 rounded-3xl border border-base-content/10 bg-base-200/70 p-5 transition-all duration-500 hover:border-primary/20 sm:p-6">
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/45">
                                    Explore
                                </p>

                                <h2 className="mt-2 text-xl font-black tracking-tight sm:text-2xl">
                                    Project Links
                                </h2>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ArrowUpRight size={19} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/link flex items-center justify-between gap-3 rounded-xl border border-base-content/10 bg-base-100 px-4 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                                >
                                    <span className="flex items-center gap-3">
                                        <FaGithub
                                            size={18}
                                            className="transition-transform duration-300 group-hover/link:scale-110"
                                        />
                                        GitHub
                                    </span>

                                    <ArrowUpRight
                                        size={16}
                                        className="shrink-0 transition-transform duration-300 group-hover/link:-translate-y-1 group-hover/link:translate-x-1"
                                    />
                                </a>
                            )}

                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/link flex items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-content transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <span className="flex items-center gap-3">
                                        <ExternalLink
                                            size={17}
                                            className="transition-transform duration-300 group-hover/link:rotate-12"
                                        />
                                        Live Project
                                    </span>

                                    <ArrowUpRight
                                        size={16}
                                        className="shrink-0 transition-transform duration-300 group-hover/link:-translate-y-1 group-hover/link:translate-x-1"
                                    />
                                </a>
                            )}

                            {!project.githubUrl && !project.liveUrl && (
                                <p className="rounded-xl border border-base-content/10 bg-base-100 p-4 text-sm leading-6 text-base-content/50">
                                    No external project links are available at the moment.
                                </p>
                            )}
                        </div>

                        <div className="mt-6 border-t border-base-content/10 pt-5">
                            <p className="text-[11px] leading-6 text-base-content/50">
                                Explore the source code or visit the live project to see it in action.
                            </p>
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}

                <div className="mt-8 flex flex-col gap-4 border-t border-base-content/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        to="/projects"
                        className="group flex items-center gap-2 text-xs font-semibold text-base-content/55 transition-colors duration-300 hover:text-primary"
                    >
                        <ArrowLeft
                            size={15}
                            className="transition-transform duration-300 group-hover:-translate-x-1"
                        />
                        View All Projects
                    </Link>

                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-base-content/35">
                        Crafted with intention
                    </span>
                </div>
            </div>

            {/* ANIMATION CSS */}

            <style>{`
                @keyframes snapshotLine {
                    0% {
                        transform: translateX(-120%);
                    }

                    100% {
                        transform: translateX(400%);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-\\[snapshotLine_3s_ease-in-out_infinite\\] {
                        animation: none !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default ProjectsDetails;

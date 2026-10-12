import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
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

import { BASE_URL } from "../services/BaseUrl";

const ProjectsDetails = () => {
    const { id } = useParams();
    const location = useLocation();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useLayoutEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, [location.pathname, location.key, id]);

    const fetchProject = useCallback(
        async (signal) => {
            setLoading(true);
            setError("");
            setProject(null);

            try {
                const response = await fetch(
                    `${BASE_URL}/api/projects/${id}`,
                    { signal }
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
                const projectData = data?.project || data;

                if (!projectData?._id) {
                    throw new Error("Project data is unavailable.");
                }

                setProject(projectData);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Project details error:", err);

                    setError(
                        err.message ||
                            "Something went wrong while loading the project."
                    );
                }
            } finally {
                if (!signal?.aborted) {
                    setLoading(false);
                }
            }
        },
        [id]
    );

    useEffect(() => {
        const controller = new AbortController();

        fetchProject(controller.signal);

        return () => controller.abort();
    }, [fetchProject]);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-base-100 px-4 text-base-content">
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
            </main>
        );
    }

    if (error || !project) {
        return (
            <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-100 px-4 text-base-content sm:px-6">
                <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

                <div className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

                <div className="relative w-full max-w-md rounded-3xl border border-base-content/10 bg-base-200 p-7 text-center shadow-xl sm:p-9">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-base-content/10 bg-base-100">
                        <AlertCircle size={28} className="text-error" />
                    </div>

                    <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/40">
                        {error
                            ? "Something went wrong"
                            : "Project unavailable"}
                    </p>

                    <h1 className="text-3xl font-black tracking-tight">
                        {error === "Project not found." || !project
                            ? "Project not found"
                            : "Unable to load project"}
                    </h1>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-base-content/60">
                        {error ||
                            "The project you're looking for doesn't exist or may have been removed."}
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        {error && (
                            <button
                                type="button"
                                onClick={() => fetchProject()}
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <RefreshCw
                                    size={16}
                                    className="transition-transform duration-500 group-hover:rotate-180"
                                />
                                Try Again
                            </button>
                        )}

                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-base-content/10 bg-base-100 px-5 py-3 text-sm font-semibold text-base-content/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:text-primary"
                        >
                            <ArrowLeft size={16} />
                            View Projects
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const technologies = Array.isArray(project.technologies)
        ? project.technologies
        : [];

    return (
        <main className="relative min-h-screen overflow-hidden bg-base-100 px-4 pb-10 pt-24 text-base-content sm:px-6 sm:pb-14 sm:pt-28 md:px-8 lg:px-10 xl:px-12">
            {/* Background Decoration */}
            <div className="pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96" />

            <div className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl sm:h-96 sm:w-96" />

            <div className="relative mx-auto max-w-7xl">
                {/* Top Navigation */}
                <div className="mb-8 flex items-center justify-between gap-3 sm:mb-10">
                    <Link
                        to="/"
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

                {/* Project Title */}
                <section className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-10">
                    <div className="min-w-0 animate-[detailFadeUp_650ms_ease-out_both]">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-8 bg-primary" />

                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/45">
                                Selected Work
                            </span>
                        </div>

                        <h1 className="wrap-break-word text-5xl font-black leading-[0.95] tracking-[-0.065em] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-8xl">
                            {project.title}
                            <span className="ml-1 inline-block text-primary">
                                .
                            </span>
                        </h1>
                    </div>
                </section>

                {/* Project Image */}
                <section className="group relative mt-8 overflow-hidden rounded-3xl border border-base-content/10 bg-base-200 p-2 shadow-sm sm:mt-10 sm:rounded-[2.5rem]">
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-4xl">
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={`${project.title} preview`}
                                loading="eager"
                                fetchPriority="high"
                                className="h-64 w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03] sm:h-80 md:h-105 lg:h-125"
                            />
                        ) : (
                            <div className="flex h-64 items-center justify-center bg-base-300 sm:h-80 md:h-105 lg:h-125">
                                <span className="text-5xl font-black tracking-[-0.08em] text-base-content/15 sm:text-7xl">
                                    PROJECT
                                </span>
                            </div>
                        )}

                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md sm:bottom-6 sm:left-6 sm:px-4">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                            Project Preview
                        </div>
                    </div>
                </section>

                {/* About the Project */}
                <section className="about-project-card group relative isolate mt-8 overflow-hidden rounded-3xl border border-base-content/10 bg-base-200/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-xl sm:mt-10 sm:p-7 lg:p-9">
                    <div className="pointer-events-none absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl transition-transform duration-700 group-hover:scale-150" />

                    <div className="pointer-events-none absolute -bottom-16 -left-10 -z-10 h-36 w-36 rounded-full bg-secondary/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />

                    {/* Section Heading */}
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 sm:mb-8">
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                            <div className="about-project-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-base-content/10 bg-base-100 shadow-sm sm:h-14 sm:w-14">
                                <Sparkles
                                    size={22}
                                    className="text-primary"
                                />
                            </div>

                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/45 sm:text-[10px]">
                                    Project Overview
                                </p>

                                <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
                                    About the Project
                                    <span className="text-primary">.</span>
                                </h2>
                            </div>
                        </div>

                        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-primary sm:text-[10px]">
                            Project Story
                        </span>
                    </div>

                    {/* Animated Divider */}
                    <div className="about-project-line mb-6 h-px overflow-hidden bg-base-content/10 sm:mb-8">
                        <div className="h-full w-1/3 bg-linear-to-r from-transparent via-primary to-transparent" />
                    </div>

                    {/* Description and Technologies: Full Width */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="min-w-0">
                            <h3 className="mb-3 text-lg font-bold tracking-tight sm:text-xl">
                                What I Built
                            </h3>

                            <p className="whitespace-pre-line wrap-break-word text-sm leading-7 text-base-content/70 sm:text-base sm:leading-8">
                                {project.description ||
                                    "Project description is currently unavailable."}
                            </p>

                            {/* Compact Project Snapshot */}
                            <div className="mt-5 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2 rounded-xl border border-base-content/10 bg-base-100 px-3 py-2 text-xs font-semibold text-base-content/70 transition-colors hover:border-primary/40">
                                    <Sparkles
                                        size={14}
                                        className="shrink-0 text-primary"
                                    />

                                    <span>
                                        {String(technologies.length).padStart(
                                            2,
                                            "0"
                                        )}{" "}
                                        Technologies
                                    </span>
                                </span>

                                <span className="inline-flex items-center gap-2 rounded-xl border border-base-content/10 bg-base-100 px-3 py-2 text-xs font-semibold text-base-content/70 transition-colors hover:border-primary/40">
                                    <FaGithub
                                        size={15}
                                        className="shrink-0"
                                    />

                                    <span>
                                        {project.githubUrl
                                            ? "Source Code Available"
                                            : "Source Code Not Added"}
                                    </span>
                                </span>

                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-all duration-300 hover:border-primary/50 hover:bg-primary/20"
                                    >
                                        <ExternalLink
                                            size={14}
                                            className="shrink-0"
                                        />

                                        Live Project

                                        <ArrowUpRight size={13} />
                                    </a>
                                )}
                            </div>

                            {/* Technologies */}
                            <div className="mt-7 border-t border-base-content/10 pt-6">
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/45 sm:text-[10px]">
                                        Built With
                                    </p>

                                    <span className="font-mono text-[10px] text-base-content/35">
                                        {String(technologies.length).padStart(
                                            2,
                                            "0"
                                        )}{" "}
                                        TOOLS
                                    </span>
                                </div>

                                {technologies.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {technologies.map(
                                            (technology, index) => (
                                                <span
                                                    key={`${technology}-${index}`}
                                                    className="rounded-full border border-base-content/10 bg-base-100 px-4 py-2 text-xs font-semibold text-base-content/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                                                >
                                                    {technology}
                                                </span>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-base-content/45">
                                        No technologies added yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Project Links */}
                {(project.githubUrl || project.liveUrl) && (
                    <section className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between gap-3 rounded-2xl border border-base-content/10 bg-base-200/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:p-6"
                            >
                                <span className="flex min-w-0 items-center gap-3">
                                    <FaGithub
                                        size={21}
                                        className="shrink-0"
                                    />

                                    <span>
                                        <span className="block text-sm font-bold">
                                            Source Code
                                        </span>

                                        <span className="mt-1 block text-xs text-base-content/50">
                                            Explore the repository
                                        </span>
                                    </span>
                                </span>

                                <ArrowUpRight
                                    size={19}
                                    className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                                />
                            </a>
                        )}

                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between gap-3 rounded-2xl bg-primary p-5 text-primary-content transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
                            >
                                <span className="flex min-w-0 items-center gap-3">
                                    <ExternalLink
                                        size={21}
                                        className="shrink-0"
                                    />

                                    <span>
                                        <span className="block text-sm font-bold">
                                            Live Project
                                        </span>

                                        <span className="mt-1 block text-xs text-primary-content/70">
                                            Open the deployed website
                                        </span>
                                    </span>
                                </span>

                                <ArrowUpRight
                                    size={19}
                                    className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                                />
                            </a>
                        )}
                    </section>
                )}

                {/* Footer */}
                <div className="mt-8 flex flex-col gap-4 border-t border-base-content/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        to="/"
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

            {/* Animations */}
            <style>{`
                @keyframes detailFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes aboutLineSweep {
                    0% {
                        transform: translateX(-130%);
                    }

                    100% {
                        transform: translateX(400%);
                    }
                }

                .about-project-line > div {
                    animation: aboutLineSweep 3s ease-in-out infinite;
                }

                .about-project-icon {
                    animation: aboutIconFloat 4s ease-in-out infinite;
                }

                @keyframes aboutIconFloat {
                    0%,
                    100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-4px);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .about-project-line > div,
                    .about-project-icon {
                        animation: none !important;
                    }
                }
            `}</style>
        </main>
    );
};

export default ProjectsDetails;


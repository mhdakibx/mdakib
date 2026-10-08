import React, { useEffect, useState } from "react";
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

    const fetchProject = async () => {
        setLoading(true);
        setError("");
        setProject(null);

        try {
            const response = await fetch(
                `${BASE_URL}/api/projects/${id}`
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

            if (!projectData) {
                throw new Error("Project data is unavailable.");
            }

            setProject(projectData);
        } catch (error) {
            console.error("Project details error:", error);

            setError(
                error.message ||
                    "Something went wrong while loading the project."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    // ================= LOADING =================

    if (loading) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-base-100 px-4 text-base-content">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-base-content/10 bg-base-200">
                        <LoaderCircle
                            size={28}
                            className="animate-spin text-base-content/40"
                        />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-base-content/35">
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

                {/* BACKGROUND */}

                <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-base-content/5 blur-3xl" />

                <div className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-base-content/5 blur-3xl" />

                {/* ERROR CARD */}

                <div className="relative w-full max-w-md rounded-4xl border border-base-content/10 bg-base-200 p-7 text-center shadow-sm sm:p-9">

                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-base-content/10 bg-base-100">
                        <AlertCircle
                            size={28}
                            className="text-base-content/45"
                        />
                    </div>

                    <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/35">
                        Something went wrong
                    </p>

                    <h1 className="text-3xl font-black tracking-[-0.06em]">
                        Unable to load project
                    </h1>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-base-content/50">
                        {error}
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">

                        <button
                            type="button"
                            onClick={fetchProject}
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-base-content px-5 py-3 text-sm font-semibold text-base-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <RefreshCw
                                size={16}
                                className="transition-transform duration-500 group-hover:rotate-180"
                            />

                            Try Again
                        </button>

                        <Link
                            to="/projects"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-base-content/10 bg-base-100 px-5 py-3 text-sm font-semibold text-base-content/65 transition-all duration-300 hover:-translate-y-1 hover:border-base-content/20 hover:text-base-content"
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

                <div className="w-full max-w-md rounded-4xl border border-base-content/10 bg-base-200 p-8 text-center">

                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-base-100">
                        <Sparkles
                            size={22}
                            className="text-base-content/40"
                        />
                    </div>

                    <h1 className="text-3xl font-black tracking-[-0.06em]">
                        Project not found
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-base-content/50">
                        The project you're looking for doesn't exist or may
                        have been removed.
                    </p>

                    <Link
                        to="/projects"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-base-content px-5 py-3 text-sm font-semibold text-base-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        <ArrowLeft size={16} />

                        View all projects
                    </Link>

                </div>
            </section>
        );
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-base-100 px-4 py-8 text-base-content sm:px-6 sm:py-10 md:px-8 lg:px-10 xl:px-12">

            {/* ================= BACKGROUND ================= */}

            <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-base-content/5 blur-3xl sm:h-96 sm:w-96" />

            <div className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-base-content/5 blur-3xl sm:h-96 sm:w-96" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 rounded-full border border-base-content/5" />

            <div className="relative mx-auto max-w-7xl">

                {/* ================= HEADER ================= */}

                <div className="mb-8 flex items-center justify-end sm:mb-10">
                    <div className="flex items-center gap-2">

                        <span className="h-1.5 w-1.5 rounded-full bg-base-content/40" />

                        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/35 sm:text-[10px]">
                            Project Details
                        </span>

                    </div>
                </div>

                {/* ================= HERO ================= */}

                <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-10">

                    {/* TITLE */}

                    <div>

                        <div className="mb-5 flex items-center gap-3">

                            <span className="h-px w-8 bg-base-content/40" />

                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/40">
                                Selected Work
                            </span>

                        </div>

                        <h1 className="max-w-5xl text-[3.5rem] font-black leading-[0.82] tracking-[-0.08em] sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-8xl">

                            {project.title}

                            <span className="ml-2 inline-block -translate-y-1 text-base-content/25">
                                .
                            </span>

                        </h1>

                    </div>

                    {/* OVERVIEW */}

                    <div className="lg:pb-2">

                        <div className="rounded-3xl border border-base-content/10 bg-base-200 p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:p-6">

                            <div className="mb-5 flex items-center justify-between">

                                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-base-content/35">
                                    Overview
                                </span>

                                <Sparkles
                                    size={15}
                                    className="text-base-content/35"
                                />

                            </div>

                            <p className="text-sm leading-6 text-base-content/60 sm:text-[15px]">
                                {project.description}
                            </p>

                        </div>

                    </div>

                </div>

                {/* ================= IMAGE ================= */}

                <div className="group relative mt-8 overflow-hidden rounded-4xl border border-base-content/10 bg-base-200 p-2 shadow-sm sm:mt-10 sm:rounded-[2.5rem]">

                    <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl">

                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="h-62.5 w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03] sm:h-95 md:h-120 lg:h-140"
                            />
                        ) : (
                            <div className="flex h-62.5 items-center justify-center bg-base-300 sm:h-95 md:h-120 lg:h-140">
                                <span className="text-5xl font-black tracking-[-0.08em] text-base-content/10 sm:text-7xl">
                                    PROJECT
                                </span>
                            </div>
                        )}

                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60" />

                        <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">

                            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />

                            Featured Project

                        </div>

                    </div>

                </div>

                {/* ================= CONTENT ================= */}

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-10">

                    {/* LEFT */}

                    <div className="rounded-[1.75rem] border border-base-content/10 bg-base-200 p-5 sm:p-7">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/35">
                                    About the project
                                </p>

                                <h2 className="mt-2 text-2xl font-black tracking-tighter sm:text-3xl">
                                    What I built
                                </h2>

                            </div>

                            <span className="hidden font-mono text-xs text-base-content/25 sm:block">
                                01
                            </span>

                        </div>

                        <p className="max-w-3xl text-sm leading-7 text-base-content/55 sm:text-base">
                            {project.description}
                        </p>

                        {/* TECHNOLOGIES */}

                        <div className="mt-8 border-t border-base-content/10 pt-6">

                            <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/35">
                                Technologies
                            </p>

                            <div className="flex flex-wrap gap-2">

                                {project.technologies?.map(
                                    (technology, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full border border-base-content/10 bg-base-100 px-4 py-2 text-xs font-semibold text-base-content/65 transition-all duration-300 hover:-translate-y-1 hover:border-base-content/25 hover:text-base-content"
                                        >
                                            {technology}
                                        </span>
                                    )
                                )}

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="h-fit rounded-[1.75rem] border border-base-content/10 bg-base-200 p-5 sm:p-6">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-base-content/35">
                                    Explore
                                </p>

                                <h2 className="mt-2 text-xl font-black tracking-tighter">
                                    Project Links
                                </h2>

                            </div>

                            <ArrowUpRight
                                size={18}
                                className="text-base-content/25"
                            />

                        </div>

                        <div className="space-y-3">

                            {/* GITHUB */}

                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex items-center justify-between rounded-xl border border-base-content/10 bg-base-100 px-4 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-base-content/25 hover:shadow-md"
                                >
                                    <span className="flex items-center gap-3">
                                        <FaGithub size={17} />
                                        GitHub
                                    </span>

                                    <ArrowUpRight
                                        size={16}
                                        className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                                    />
                                </a>
                            )}

                            {/* LIVE */}

                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex items-center justify-between rounded-xl bg-base-content px-4 py-3.5 text-sm font-semibold text-base-100 transition-all duration-300 hover:-translate-y-1 hover:opacity-90 hover:shadow-xl"
                                >
                                    <span className="flex items-center gap-3">
                                        <ExternalLink size={17} />
                                        Live Project
                                    </span>

                                    <ArrowUpRight
                                        size={16}
                                        className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                                    />
                                </a>
                            )}

                        </div>

                        <div className="mt-6 border-t border-base-content/10 pt-5">

                            <p className="text-[11px] leading-5 text-base-content/35">
                                Explore the source code or visit the live
                                project to see it in action.
                            </p>

                        </div>

                    </div>

                </div>

                {/* ================= BOTTOM ================= */}

                <div className="mt-8 flex flex-col gap-4 border-t border-base-content/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <Link
                        to="/projects"
                        className="group flex items-center gap-2 text-xs font-semibold text-base-content/45 transition hover:text-base-content"
                    >
                        <ArrowLeft
                            size={15}
                            className="transition-transform duration-300 group-hover:-translate-x-1"
                        />

                        View all projects
                    </Link>

                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-base-content/25">
                        Crafted with intention
                    </span>

                </div>

            </div>
        </section>
    );
};

export default ProjectsDetails;

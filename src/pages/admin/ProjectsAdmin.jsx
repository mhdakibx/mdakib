import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  FolderKanban,
  Star,
  X,
  Image as ImageIcon,
  LoaderCircle,
  RefreshCw,
  Eye,
  Code2,
  Globe,
  AlertCircle,
  CheckCircle2,
  Upload,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

import { useNavigate } from "react-router";
import { FaGithub } from "react-icons/fa";

import { BASE_URL } from "./../../services/BaseUrl";

const EMPTY_FORM = {
  title: "",
  description: "",
  image: "",
  technologies: [],
  githubUrl: "",
  liveUrl: "",
  featured: false,
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const normalizeTechnologies = (value) => {
  if (Array.isArray(value)) {
    return value
      .flat(Infinity)
      .filter((item) => typeof item === "string" || typeof item === "number")
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  const text = value.trim();

  try {
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return normalizeTechnologies(parsed);
    }

    if (typeof parsed === "string" && parsed !== text) {
      return normalizeTechnologies(parsed);
    }
  } catch {
    // Handle comma-separated technologies below.
  }

  return text
    .split(",")
    .map((item) => item.trim())
    .map((item) => item.replace(/^["']|["']$/g, ""))
    .filter(Boolean);
};

const ProjectsAdmin = () => {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef("");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
    technologies: [],
  });

  const [technologyInput, setTechnologyInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  /* AUTHENTICATION */

  const getToken = () => localStorage.getItem("portfolio_token");

  const getUser = () => {
    try {
      const user = localStorage.getItem("portfolio_user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };

  const getHeaders = () => {
    const token = getToken();

    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleUnauthorized = () => {
    setUnauthorized(true);
    setError("Your session has expired. Please log in again.");
  };

  /* NOTIFICATIONS */

  const notify = (message, type = "success") => {
    if (type === "error") {
      setError(message);
      setSuccess("");
    } else {
      setSuccess(message);
      setError("");
    }
  };

  /* IMAGE PREVIEW */

  const clearImagePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
  };

  const resetImage = () => {
    clearImagePreview();
    setImageFile(null);
    setImagePreview("");
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  /* FETCH PROJECTS */

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/projects`);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || data.detail || "Failed to load projects.",
        );
      }

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.projects)
          ? data.projects
          : Array.isArray(data.data)
            ? data.data
            : [];

      setProjects(
        list.map((project) => ({
          ...project,
          technologies: normalizeTechnologies(project.technologies),
          featured: project.featured === true || project.featured === "true",
        })),
      );
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  /* CHECK AUTHENTICATION */

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      navigate("/admin/login", { replace: true });
      return;
    }

    if (user.role && String(user.role).toLowerCase() !== "admin") {
      setUnauthorized(true);
      setLoading(false);
      return;
    }

    fetchProjects();
  }, [fetchProjects, navigate]);

  /* ADD PROJECT */

  const handleAdd = () => {
    resetImage();
    setEditingProject(null);
    setForm({ ...EMPTY_FORM, technologies: [] });
    setTechnologyInput("");
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  /* EDIT PROJECT */

  const handleEdit = (project) => {
    resetImage();
    setEditingProject(project);

    setForm({
      title: project.title || "",
      description: project.description || "",
      image: project.image || "",
      technologies: normalizeTechnologies(project.technologies),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured === true || project.featured === "true",
    });

    setImagePreview(project.image || "");
    setTechnologyInput("");
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  /* CLOSE MODAL */

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingProject(null);
    setForm({ ...EMPTY_FORM, technologies: [] });
    setTechnologyInput("");
    resetImage();
  };

  /* FORM CHANGES */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* IMAGE UPLOAD */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only JPG, PNG and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    clearImagePreview();

    const previewUrl = URL.createObjectURL(file);

    previewUrlRef.current = previewUrl;

    setImageFile(file);
    setImagePreview(previewUrl);
  };

  /* ADD TECHNOLOGY */

  const addTechnology = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const technology = technologyInput.trim();

    if (!technology) return;

    const current = normalizeTechnologies(form.technologies);

    if (
      current.some((item) => item.toLowerCase() === technology.toLowerCase())
    ) {
      setTechnologyInput("");
      return;
    }

    setForm((previous) => ({
      ...previous,
      technologies: [
        ...normalizeTechnologies(previous.technologies),
        technology,
      ],
    }));

    setTechnologyInput("");
  };

  /* REMOVE TECHNOLOGY */

  const removeTechnology = (technologyToRemove) => {
    setForm((previous) => ({
      ...previous,
      technologies: normalizeTechnologies(previous.technologies).filter(
        (item) => item !== technologyToRemove,
      ),
    }));
  };

  /* CREATE / UPDATE */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    if (!getToken()) {
      handleUnauthorized();
      return;
    }

    if (!form.title.trim()) {
      notify("Project title is required.", "error");
      return;
    }

    if (!form.description.trim()) {
      notify("Project description is required.", "error");
      return;
    }

    if (imageError) {
      notify(imageError, "error");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const isEditing = Boolean(editingProject);

      const endpoint = isEditing
        ? `${BASE_URL}/api/projects/${editingProject._id}`
        : `${BASE_URL}/api/projects`;

      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());

      formData.append(
        "technologies",
        JSON.stringify(normalizeTechnologies(form.technologies)),
      );

      formData.append("githubUrl", form.githubUrl.trim());
      formData.append("liveUrl", form.liveUrl.trim());
      formData.append("featured", String(form.featured));

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (!isEditing && form.image.trim()) {
        formData.append("image", form.image.trim());
      }

      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: getHeaders(),
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();

        throw new Error(
          response.status === 401
            ? "Authentication failed. Please log in again."
            : "You do not have permission to manage projects.",
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || data.detail || "Unable to save project.",
        );
      }

      setModalOpen(false);
      setEditingProject(null);
      setForm({ ...EMPTY_FORM, technologies: [] });
      setTechnologyInput("");
      resetImage();

      await fetchProjects();

      notify(
        isEditing
          ? "Project updated successfully!"
          : "Project created successfully!",
      );
    } catch (err) {
      notify(err.message || "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* DELETE PROJECT */

  const handleDelete = async () => {
    if (!deleteTarget || saving) return;

    if (!getToken()) {
      handleUnauthorized();
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}/api/projects/${deleteTarget._id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();

        throw new Error(
          response.status === 401
            ? "Authentication failed. Please log in again."
            : "You do not have permission to delete projects.",
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || data.detail || "Unable to delete project.",
        );
      }

      setProjects((previous) =>
        previous.filter((project) => project._id !== deleteTarget._id),
      );

      setDeleteTarget(null);
      notify("Project deleted successfully!");
    } catch (err) {
      notify(err.message || "Delete failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* SEARCH AND FILTER */

  const filteredProjects = projects.filter((project) => {
    const query = search.toLowerCase().trim();

    const technologies = normalizeTechnologies(project.technologies);

    const title = String(project.title || "");
    const description = String(project.description || "");

    const matchesSearch =
      title.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query) ||
      technologies.some((item) => item.toLowerCase().includes(query));

    const featured = project.featured === true || project.featured === "true";

    const matchesFilter =
      filter === "all" ||
      (filter === "featured" && featured) ||
      (filter === "regular" && !featured);

    return matchesSearch && matchesFilter;
  });

  const featuredCount = projects.filter(
    (project) => project.featured === true || project.featured === "true",
  ).length;

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      description: "All portfolio projects",
      icon: FolderKanban,
    },
    {
      title: "Featured Projects",
      value: featuredCount,
      description: "Highlighted projects",
      icon: Star,
    },
    {
      title: "Regular Projects",
      value: projects.length - featuredCount,
      description: "Other projects",
      icon: Code2,
    },
  ];

  /* UNAUTHORIZED SCREEN */

  if (unauthorized) {
    return (
      <main className="flex min-h-screen items-center justify-center overflow-x-hidden bg-base-200 px-4 text-base-content">
        <div className="w-full max-w-md rounded-3xl border border-base-300 bg-base-100 p-5 text-center shadow-xl sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-error">
            <ShieldAlert size={32} />
          </div>

          <h1 className="mt-5 text-xl font-black sm:text-2xl">
            Authentication Required
          </h1>

          <p className="mt-3 text-sm leading-6 text-base-content/60">
            Your session may have expired, or you do not have permission to
            manage projects.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/login", { replace: true })}
            className="btn btn-primary mt-6 w-full rounded-xl"
          >
            Go to Admin Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-clip bg-base-200/50 px-3 py-4 text-base-content transition-colors duration-300 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-7">
        {/* HEADER */}

        <section className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-primary sm:text-sm">
              <Sparkles size={16} />
              <span>PORTFOLIO CONTROL CENTER</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              Projects <span className="text-primary">Studio.</span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
              Create, organize and manage your portfolio projects from one
              place.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:shrink-0 sm:flex sm:gap-3">
            <button
              type="button"
              onClick={fetchProjects}
              disabled={loading}
              className="btn btn-outline btn-sm min-w-0 gap-2 rounded-xl border-base-300 sm:btn-md"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary btn-sm min-w-0 gap-1.5 rounded-xl shadow-lg shadow-primary/20 sm:btn-md sm:gap-2"
            >
              <Plus size={18} />
              <span>Add Project</span>
            </button>
          </div>
        </section>

        {/* NOTIFICATIONS */}

        {success && (
          <div
            role="status"
            className="alert grid-cols-[auto_minmax(0,1fr)_auto] gap-2 border border-success/20 bg-success/10 px-3 text-success sm:px-4"
          >
            <CheckCircle2 size={20} />
            <span className="min-w-0 wrap-break-word text-sm">{success}</span>
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => setSuccess("")}
              aria-label="Dismiss notification"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="alert grid-cols-[auto_minmax(0,1fr)_auto] gap-2 border border-error/20 bg-error/10 px-3 text-error sm:px-4"
          >
            <AlertCircle size={20} />
            <span className="min-w-0 wrap-break-word text-sm">{error}</span>
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* STATISTICS */}

        <section className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group min-w-0 rounded-2xl border border-base-300/70 bg-base-100 p-4 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:p-5 lg:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="wrap-break-word text-xs font-medium text-base-content/60 sm:text-sm">
                      {stat.title}
                    </p>

                    <h2 className="mt-2 text-2xl font-black sm:mt-3 sm:text-3xl">
                      {loading ? "—" : stat.value}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-base-content/50 sm:mt-2">
                      {stat.description}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary transition-transform group-hover:scale-110 sm:rounded-2xl sm:p-3">
                    <Icon size={21} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* PROJECT LIST */}

        <section className="min-w-0 overflow-hidden rounded-2xl border border-base-300/70 bg-base-100 shadow-sm">
          {/* SEARCH AND FILTER */}

          <div className="border-b border-base-300/70 p-3 sm:p-5 lg:p-6">
            <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <h2 className="text-xl font-bold sm:text-2xl">All Projects</h2>

                <p className="mt-1 text-sm leading-5 text-base-content/55">
                  Manage project details and visibility.
                </p>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-[minmax(0,1fr)_minmax(125px,0.7fr)] xl:w-auto xl:min-w-102.5">
                <label className="input input-bordered flex min-w-0 w-full items-center gap-2 rounded-xl bg-base-200/50">
                  <Search size={17} className="shrink-0 text-base-content/40" />

                  <input
                    type="search"
                    className="min-w-0 grow"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </label>

                <select
                  className="select select-bordered min-w-0 w-full rounded-xl bg-base-100"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  aria-label="Filter projects"
                >
                  <option value="all">All Projects</option>
                  <option value="featured">Featured Only</option>
                  <option value="regular">Regular Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-6 sm:min-h-72">
              <LoaderCircle size={34} className="animate-spin text-primary" />
              <p className="text-sm text-base-content/60">
                Loading your projects...
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-4 py-10 text-center sm:min-h-72 sm:px-5">
              <div className="mb-4 rounded-2xl bg-base-200 p-4 text-base-content/40 sm:p-5">
                <FolderKanban size={32} />
              </div>

              <h3 className="text-lg font-bold">
                {projects.length === 0
                  ? "No projects yet"
                  : "No matching projects"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/55">
                {projects.length === 0
                  ? "Add your first project to showcase your work."
                  : "Try another search term or change the filter."}
              </p>

              {projects.length === 0 && (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="btn btn-primary mt-5 rounded-xl"
                >
                  <Plus size={18} />
                  Create First Project
                </button>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto lg:block">
                <table className="table w-full">
                  <thead>
                    <tr className="border-b border-base-300/70 bg-base-200/40 text-xs uppercase tracking-wider text-base-content/50">
                      <th className="py-5 pl-6">Project</th>
                      <th>Technologies</th>
                      <th>Status</th>
                      <th>Links</th>
                      <th className="pr-6 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProjects.map((project) => {
                      const technologies = normalizeTechnologies(
                        project.technologies,
                      );

                      const featured =
                        project.featured === true ||
                        project.featured === "true";

                      return (
                        <tr
                          key={project._id}
                          className="border-b border-base-300/40 transition-colors hover:bg-base-200/40"
                        >
                          <td className="max-w-sm py-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-base-300 bg-base-200 xl:h-16 xl:w-24">
                                {project.image ? (
                                  <img
                                    src={project.image}
                                    alt={project.title || "Project"}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-base-content/30">
                                    <ImageIcon size={23} />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <h3 className="truncate font-bold">
                                  {project.title}
                                </h3>
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-base-content/55">
                                  {project.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="flex max-w-56 flex-wrap gap-1.5">
                              {technologies
                                .slice(0, 3)
                                .map((technology, index) => (
                                  <span
                                    key={`${technology}-${index}`}
                                    className="badge badge-outline max-w-full border-base-300 text-xs"
                                  >
                                    {technology}
                                  </span>
                                ))}

                              {technologies.length > 3 && (
                                <span className="badge badge-ghost text-xs">
                                  +{technologies.length - 3}
                                </span>
                              )}

                              {technologies.length === 0 && (
                                <span className="text-xs text-base-content/40">
                                  No technologies
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            {featured ? (
                              <span className="badge gap-1 border-amber-500/20 bg-amber-500/10 text-amber-600">
                                <Star size={12} />
                                Featured
                              </span>
                            ) : (
                              <span className="badge badge-ghost">Regular</span>
                            )}
                          </td>

                          <td>
                            <div className="flex items-center gap-1">
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`GitHub for ${project.title}`}
                                  className="btn btn-ghost btn-sm btn-square rounded-lg"
                                >
                                  <FaGithub size={17} />
                                </a>
                              )}

                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Live demo for ${project.title}`}
                                  className="btn btn-ghost btn-sm btn-square rounded-lg"
                                >
                                  <ExternalLink size={17} />
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="pr-6">
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleEdit(project)}
                                aria-label={`Edit ${project.title}`}
                                className="btn btn-ghost btn-sm btn-square rounded-lg text-primary hover:bg-primary/10"
                              >
                                <Pencil size={17} />
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeleteTarget(project)}
                                aria-label={`Delete ${project.title}`}
                                className="btn btn-ghost btn-sm btn-square rounded-lg text-error hover:bg-error/10"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE + TABLET CARDS */}

              <div className="grid min-w-0 grid-cols-1 gap-3 p-3 min-[600px]:grid-cols-2 min-[600px]:gap-4 min-[600px]:p-4 lg:hidden">
                {filteredProjects.map((project) => {
                  const technologies = normalizeTechnologies(
                    project.technologies,
                  );

                  const featured =
                    project.featured === true || project.featured === "true";

                  return (
                    <article
                      key={project._id}
                      className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-base-300/70 bg-base-100 transition-colors hover:border-primary/30"
                    >
                      {/* IMAGE */}

                      <div className="relative aspect-video w-full overflow-hidden bg-base-200">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title || "Project"}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-base-content/30">
                            <ImageIcon size={34} />
                          </div>
                        )}

                        <span
                          className={`absolute right-2 top-2 max-w-[calc(100%-1rem)] badge border-0 text-xs ${
                            featured
                              ? "bg-amber-400 text-amber-950"
                              : "bg-base-100/95 text-base-content"
                          }`}
                        >
                          {featured ? "★ Featured" : "Regular"}
                        </span>
                      </div>

                      {/* CONTENT */}

                      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4">
                        <div className="min-w-0">
                          <h3 className="wrap-break-word text-base font-bold sm:text-lg">
                            {project.title}
                          </h3>

                          <p
                            className="mt-2 line-clamp-2 text-sm leading-6 text-base-content/60"
                            title={project.description}
                          >
                            {project.description}
                          </p>
                        </div>

                        {/* TECHNOLOGIES */}

                        <div className="flex min-w-0 flex-wrap gap-1.5">
                          {technologies.map((technology, index) => (
                            <span
                              key={`${technology}-${index}`}
                              className="badge badge-outline h-auto max-w-full whitespace-normal border-base-300 px-2 py-2 text-xs"
                            >
                              {technology}
                            </span>
                          ))}

                          {technologies.length === 0 && (
                            <span className="text-xs text-base-content/40">
                              No technologies added
                            </span>
                          )}
                        </div>

                        {/* ACTIONS */}

                        <div className="mt-auto flex min-w-0 flex-wrap items-center justify-between gap-2 border-t border-base-300/70 pt-3">
                          <div className="flex shrink-0 gap-1">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ghost btn-sm btn-square rounded-lg"
                                aria-label={`GitHub for ${project.title}`}
                              >
                                <FaGithub size={17} />
                              </a>
                            )}

                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ghost btn-sm btn-square rounded-lg"
                                aria-label={`Live demo for ${project.title}`}
                              >
                                <Globe size={17} />
                              </a>
                            )}
                          </div>

                          <div className="flex min-w-0 flex-wrap gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleEdit(project)}
                              className="btn btn-outline btn-xs gap-1 rounded-lg min-[380px]:btn-sm"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(project)}
                              className="btn btn-error btn-outline btn-xs rounded-lg min-[380px]:btn-sm"
                              aria-label={`Delete ${project.title}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {/* FOOTER */}

          {!loading && filteredProjects.length > 0 && (
            <div className="border-t border-base-300/70 bg-base-200/30 px-3 py-3 sm:px-5 sm:py-4">
              <p className="text-xs leading-5 text-base-content/55 sm:text-sm">
                Showing{" "}
                <span className="font-bold text-base-content">
                  {filteredProjects.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-base-content">
                  {projects.length}
                </span>{" "}
                projects
              </p>
            </div>
          )}
        </section>
      </div>

      {/* CREATE / EDIT MODAL */}

      {modalOpen && (
        <div
          className="modal modal-open z-50 items-start overflow-y-auto bg-black/50 p-2 sm:items-center sm:p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="relative my-auto flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 text-base-content shadow-2xl sm:max-h-[92dvh] sm:rounded-3xl">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 border-b border-base-300 bg-base-100/95 px-4 py-3 backdrop-blur sm:px-6 sm:py-5">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary sm:text-xs">
                  PROJECT MANAGEMENT
                </p>

                <h2 className="mt-1 wrap-break-word text-lg font-black sm:text-2xl">
                  {editingProject ? "Edit Project" : "Create Project"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="btn btn-ghost btn-sm btn-circle shrink-0 sm:btn-md"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* SCROLLABLE FORM */}

            <form
              onSubmit={handleSubmit}
              className="min-h-0 space-y-5 overflow-y-auto overscroll-contain p-4 sm:space-y-6 sm:p-6"
            >
              {/* IMAGE UPLOAD */}

              <div className="min-w-0">
                <label className="label px-0">
                  <span className="label-text font-semibold">
                    Project Image
                  </span>
                  <span className="label-text-alt text-base-content/50">
                    Max 5 MB
                  </span>
                </label>

                <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-200/40">
                  <div className="relative flex min-h-36 items-center justify-center sm:min-h-52">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Project preview"
                        className="h-40 w-full object-contain sm:h-56"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 px-3 py-8 text-center text-base-content/50">
                        <div className="rounded-2xl bg-primary/10 p-3 text-primary sm:p-4">
                          <ImageIcon size={28} />
                        </div>

                        <p className="text-sm font-medium">
                          No project image selected
                        </p>

                        <p className="text-xs">
                          Choose an image from your device.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-col gap-3 border-t border-base-300 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                    <div className="min-w-0">
                      <p className="wrap-break-word text-sm font-semibold">
                        {imageFile
                          ? imageFile.name
                          : editingProject && imagePreview
                            ? "Current project image"
                            : "No image selected"}
                      </p>

                      <p className="mt-1 text-xs text-base-content/50">
                        {imageFile
                          ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB`
                          : "JPG, PNG or WebP"}
                      </p>
                    </div>

                    <label className="btn btn-primary btn-sm w-full cursor-pointer rounded-xl sm:btn-md sm:w-auto">
                      <Upload size={16} />

                      {imageFile
                        ? "Change Image"
                        : imagePreview
                          ? "Replace Image"
                          : "Add Image"}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={saving}
                      />
                    </label>
                  </div>
                </div>

                {imageError && (
                  <p className="mt-2 flex items-start gap-2 wrap-break-word text-sm text-error">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {imageError}
                  </p>
                )}

                <p className="mt-2 text-xs leading-5 text-base-content/50">
                  {editingProject
                    ? "Select a new image to replace the existing one. Leave it unchanged to keep the current image."
                    : "The selected image will be uploaded to ImageKit when you save the project."}
                </p>
              </div>

              {/* TITLE */}

              <div className="min-w-0">
                <label className="label px-0">
                  <span className="label-text font-semibold">
                    Project Title *
                  </span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. CityConnect"
                  className="input input-bordered w-full min-w-0 rounded-xl"
                  required
                  maxLength={120}
                  disabled={saving}
                />
              </div>

              {/* DESCRIPTION */}

              <div className="min-w-0">
                <label className="label px-0">
                  <span className="label-text font-semibold">
                    Description *
                  </span>
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your project..."
                  className="textarea textarea-bordered min-h-28 w-full min-w-0 rounded-xl leading-6"
                  required
                  maxLength={3000}
                  disabled={saving}
                />
              </div>

              {/* TECHNOLOGIES */}

              <div className="min-w-0">
                <label className="label px-0">
                  <span className="label-text font-semibold">Technologies</span>

                  <span className="label-text-alt text-base-content/50">
                    {normalizeTechnologies(form.technologies).length} added
                  </span>
                </label>

                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                  <input
                    type="text"
                    value={technologyInput}
                    onChange={(event) => setTechnologyInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addTechnology(event);
                      }
                    }}
                    placeholder="e.g. React"
                    className="input input-bordered min-w-0 w-full rounded-xl"
                    disabled={saving}
                  />

                  <button
                    type="button"
                    onClick={addTechnology}
                    disabled={saving || !technologyInput.trim()}
                    className="btn btn-primary rounded-xl px-3 sm:px-4"
                  >
                    <Plus size={17} />
                    Add
                  </button>
                </div>

                <div className="mt-3 flex min-h-8 min-w-0 flex-wrap gap-2">
                  {normalizeTechnologies(form.technologies).map(
                    (technology, index) => (
                      <span
                        key={`${technology}-${index}`}
                        className="badge badge-lg h-auto max-w-full gap-1.5 whitespace-normal border border-primary/20 bg-primary/10 py-2 text-primary"
                      >
                        <span className="break-all">{technology}</span>

                        <button
                          type="button"
                          onClick={() => removeTechnology(technology)}
                          disabled={saving}
                          className="shrink-0 rounded-full hover:text-error"
                          aria-label={`Remove ${technology}`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ),
                  )}

                  {normalizeTechnologies(form.technologies).length === 0 && (
                    <p className="text-xs leading-5 text-base-content/45">
                      Type a technology above and click Add.
                    </p>
                  )}
                </div>
              </div>

              {/* URLS */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div className="min-w-0">
                  <label className="label px-0">
                    <span className="label-text font-semibold">GitHub URL</span>
                  </label>

                  <div className="relative">
                    <FaGithub
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                    />

                    <input
                      type="url"
                      name="githubUrl"
                      value={form.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                      className="input input-bordered w-full min-w-0 rounded-xl pl-10 text-sm"
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <label className="label px-0">
                    <span className="label-text font-semibold">
                      Live Demo URL
                    </span>
                  </label>

                  <div className="relative">
                    <Eye
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                    />

                    <input
                      type="url"
                      name="liveUrl"
                      value={form.liveUrl}
                      onChange={handleChange}
                      placeholder="https://your-project.vercel.app"
                      className="input input-bordered w-full min-w-0 rounded-xl pl-10 text-sm"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

              {/* FEATURED */}

              <label className="flex min-w-0 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-3 transition-colors hover:border-primary/30 sm:gap-4 sm:p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="shrink-0 rounded-xl bg-amber-500/10 p-2.5 text-amber-500 sm:p-3">
                    <Star size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold sm:text-base">
                      Featured Project
                    </p>

                    <p className="mt-1 text-xs leading-5 text-base-content/55">
                      Highlight this project on your portfolio.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="toggle toggle-primary toggle-sm shrink-0 sm:toggle-md"
                  disabled={saving}
                />
              </label>

              {/* FORM ACTIONS */}

              <div className="flex flex-col-reverse gap-2 border-t border-base-300 pt-4 sm:flex-row sm:justify-end sm:gap-3 sm:pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-outline w-full rounded-xl sm:w-auto"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || Boolean(imageError)}
                  className="btn btn-primary w-full rounded-xl sm:w-auto sm:px-7"
                >
                  {saving ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      {editingProject ? "Save Changes" : "Create Project"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}

      {deleteTarget && (
        <div
          className="modal modal-open z-60 bg-black/50 p-3"
          onClick={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setDeleteTarget(null);
            }
          }}
        >
          <div className="modal-box w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-5 text-base-content shadow-2xl sm:rounded-3xl sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-error sm:h-16 sm:w-16">
              <Trash2 size={27} />
            </div>

            <h2 className="mt-4 text-center text-xl font-black sm:mt-5 sm:text-2xl">
              Delete Project?
            </h2>

            <p className="mt-3 wrap-break-word text-center text-sm leading-6 text-base-content/60">
              Are you sure you want to delete{" "}
              <span className="font-bold text-base-content">
                {deleteTarget.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:mt-7 sm:gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={saving}
                className="btn btn-outline w-full rounded-xl"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="btn btn-error w-full rounded-xl"
              >
                {saving ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProjectsAdmin;

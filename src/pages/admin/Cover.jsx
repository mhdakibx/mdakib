
import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";

import {
    ImagePlus,
    Upload,
    Trash2,
    Edit3,
    X,
    Check,
    ZoomIn,
    ZoomOut,
    Image as ImageIcon,
    LoaderCircle,
    AlertCircle,
    CheckCircle2,
    Eye,
    Star,
    RefreshCw,
} from "lucide-react";

import { BASE_URL } from "../../services/BaseUrl";

const API_URL = `${BASE_URL}/api/cover`;

const getToken = () => {
    return localStorage.getItem("portfolio_token") || "";
};

const createImageURL = (file) => URL.createObjectURL(file);

// Create optimized square image before uploading.
const createCroppedImage = async (imageSrc, pixelCrop) => {
    const image = new Image();

    image.src = imageSrc;

    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("Failed to load image."));
    });

    const canvas = document.createElement("canvas");

    // Standard profile image resolution.
    canvas.width = 1000;
    canvas.height = 1000;

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Your browser could not process this image.");
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    context.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        1000,
        1000
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Failed to crop the image."));
                    return;
                }

                resolve(blob);
            },
            "image/jpeg",
            0.85
        );
    });
};

const Cover = () => {
    const [covers, setCovers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [actionLoading, setActionLoading] = useState("");

    const [showEditor, setShowEditor] = useState(false);
    const [editingCover, setEditingCover] = useState(null);
    const [previewCover, setPreviewCover] = useState(null);

    const [title, setTitle] = useState("Mohammad Akib");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const [notice, setNotice] = useState({
        type: "",
        message: "",
    });

    const showNotice = useCallback((type, message) => {
        setNotice({ type, message });
    }, []);

    // Load covers.
    const fetchCovers = useCallback(async () => {
        setLoading(true);

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load profile images.");
            }

            const data = await response.json();

            const list = Array.isArray(data)
                ? data
                : Array.isArray(data.covers)
                    ? data.covers
                    : data.cover
                        ? [data.cover]
                        : [];

            setCovers(list);
        } catch (error) {
            showNotice(
                "error",
                error.message || "Could not load profile images."
            );
        } finally {
            setLoading(false);
        }
    }, [showNotice]);

    useEffect(() => {
        fetchCovers();
    }, [fetchCovers]);

    // Reset editor state.
    const resetEditor = useCallback(() => {
        setImagePreview((previous) => {
            if (previous) {
                URL.revokeObjectURL(previous);
            }

            return "";
        });

        setImageFile(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
    }, []);

    // Add new profile image.
    const handleAddCover = () => {
        resetEditor();

        setEditingCover(null);
        setTitle("Mohammad Akib");
        setDescription("");
        setIsActive(true);
        setShowEditor(true);
    };

    // Edit existing profile image.
    const handleEditCover = (cover) => {
        resetEditor();

        setEditingCover(cover);
        setTitle(cover.title || "");
        setDescription(cover.description || "");
        setIsActive(Boolean(cover.isActive));
        setShowEditor(true);
    };

    // Close editor.
    const closeEditor = () => {
        if (saving) return;

        resetEditor();

        setShowEditor(false);
        setEditingCover(null);
    };

    // Select image.
    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        event.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showNotice("error", "Please select a valid image.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showNotice("error", "Image size must be less than 10 MB.");
            return;
        }

        resetEditor();

        const previewURL = createImageURL(file);

        setImageFile(file);
        setImagePreview(previewURL);
    };

    // Save crop coordinates.
    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    // Add or update image.
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title.trim()) {
            showNotice("error", "Please enter your profile title.");
            return;
        }

        if (!editingCover && !imageFile) {
            showNotice("error", "Please select a profile image.");
            return;
        }

        if (imageFile && !croppedAreaPixels) {
            showNotice("error", "Please wait for the image crop to finish.");
            return;
        }

        setSaving(true);

        try {
            const formData = new FormData();

            formData.append("title", title.trim());
            formData.append("description", description.trim());
            formData.append("isActive", String(isActive));

            if (imageFile) {
                const croppedBlob = await createCroppedImage(
                    imagePreview,
                    croppedAreaPixels
                );

                const croppedFile = new File(
                    [croppedBlob],
                    "portfolio-profile.jpg",
                    { type: "image/jpeg" }
                );

                formData.append("image", croppedFile);
            }

            const token = getToken();

            if (!token) {
                throw new Error("Please log in to your admin account.");
            }

            const url = editingCover
                ? `${API_URL}/${editingCover._id}`
                : API_URL;

            const response = await fetch(url, {
                method: editingCover ? "PUT" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.error ||
                    "Failed to save profile image."
                );
            }

            showNotice(
                "success",
                editingCover
                    ? "Profile image updated successfully!"
                    : "Profile image added successfully!"
            );

            resetEditor();
            setShowEditor(false);
            setEditingCover(null);

            await fetchCovers();
        } catch (error) {
            showNotice(
                "error",
                error.message || "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete image.
    const handleDeleteCover = async (cover) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${cover.title}"?`
        );

        if (!confirmed) return;

        setActionLoading(cover._id);

        try {
            const token = getToken();

            if (!token) {
                throw new Error("Please log in to your admin account.");
            }

            const response = await fetch(`${API_URL}/${cover._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to delete profile image."
                );
            }

            showNotice("success", "Profile image deleted successfully!");

            await fetchCovers();
        } catch (error) {
            showNotice(
                "error",
                error.message || "Could not delete profile image."
            );
        } finally {
            setActionLoading("");
        }
    };

    // Set active image.
    const handleSetActive = async (cover) => {
        setActionLoading(cover._id);

        try {
            const token = getToken();

            if (!token) {
                throw new Error("Please log in to your admin account.");
            }

            const formData = new FormData();

            formData.append("title", cover.title || "");
            formData.append("description", cover.description || "");
            formData.append("isActive", "true");

            const response = await fetch(`${API_URL}/${cover._id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    result.message || "Could not activate profile image."
                );
            }

            showNotice("success", "Active profile image updated!");

            await fetchCovers();
        } catch (error) {
            showNotice(
                "error",
                error.message || "Failed to activate image."
            );
        } finally {
            setActionLoading("");
        }
    };

    const activeCover = covers.find((cover) => cover.isActive);

    return (
        <div className="min-h-screen bg-base-200/50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-7">

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                            <ImageIcon size={17} />
                            Portfolio Management
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Profile Image
                        </h1>

                        <p className="mt-2 max-w-xl text-sm text-base-content/60 sm:text-base">
                            Manage your hero section profile image. Upload,
                            crop, update, and select the image displayed
                            on your portfolio.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={fetchCovers}
                            disabled={loading}
                            className="btn btn-square btn-outline"
                            aria-label="Refresh images"
                        >
                            <RefreshCw
                                size={18}
                                className={loading ? "animate-spin" : ""}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={handleAddCover}
                            className="btn btn-primary gap-2"
                        >
                            <ImagePlus size={19} />
                            Add Image
                        </button>
                    </div>
                </div>

                {/* Notification */}
                {notice.message && (
                    <div
                        role="status"
                        className={`alert ${
                            notice.type === "error"
                                ? "alert-error"
                                : "alert-success"
                        }`}
                    >
                        {notice.type === "error" ? (
                            <AlertCircle size={20} />
                        ) : (
                            <CheckCircle2 size={20} />
                        )}

                        <span>{notice.message}</span>

                        <button
                            type="button"
                            onClick={() =>
                                setNotice({ type: "", message: "" })
                            }
                            className="btn btn-ghost btn-sm btn-square"
                            aria-label="Dismiss notification"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Current active image */}
                <section className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-base-300 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold">
                                Current Profile Image
                            </h2>

                            <p className="mt-1 text-sm text-base-content/60">
                                This image is selected for your portfolio hero.
                            </p>
                        </div>

                        {activeCover && (
                            <span className="badge badge-success gap-1">
                                <Check size={13} />
                                Active
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-6 p-5 sm:p-8 md:flex-row md:items-center">
                        {activeCover ? (
                            <>
                                <div className="w-full max-w-xs shrink-0">
                                    <div className="overflow-hidden rounded-3xl border border-base-300 bg-base-200 shadow-md">
                                        <img
                                            src={activeCover.image}
                                            alt={activeCover.title || "Profile image"}
                                            className="aspect-square w-full object-cover"
                                            style={{
                                                objectPosition: "center 25%",
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="w-full min-w-0">
                                    <span className="badge badge-success mb-3">
                                        Active Profile
                                    </span>

                                    <h3 className="wrap-break-word text-2xl font-bold">
                                        {activeCover.title || "Mohammad Akib"}
                                    </h3>

                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-base-content/60">
                                        {activeCover.description ||
                                            "Your active hero profile image."}
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditCover(activeCover)
                                            }
                                            className="btn btn-primary btn-sm gap-2"
                                        >
                                            <Edit3 size={15} />
                                            Edit Image
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPreviewCover(activeCover)
                                            }
                                            className="btn btn-outline btn-sm gap-2"
                                        >
                                            <Eye size={15} />
                                            Preview
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-base-300 p-8 text-center">
                                <ImageIcon
                                    size={38}
                                    className="mb-3 text-base-content/30"
                                />

                                <h3 className="font-semibold">
                                    No active profile image
                                </h3>

                                <p className="mt-1 text-sm text-base-content/60">
                                    Upload an image and activate it to display
                                    it on your portfolio.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleAddCover}
                                    className="btn btn-primary btn-sm mt-4 gap-2"
                                >
                                    <Upload size={16} />
                                    Upload Image
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* All images */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">
                            All Profile Images
                        </h2>

                        <p className="mt-1 text-sm text-base-content/60">
                            {covers.length} image
                            {covers.length !== 1 ? "s" : ""} available
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex min-h-60 items-center justify-center">
                            <LoaderCircle
                                size={35}
                                className="animate-spin text-primary"
                            />
                        </div>
                    ) : covers.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-base-300 bg-base-100 p-10 text-center">
                            <ImagePlus
                                size={40}
                                className="mx-auto mb-3 text-base-content/30"
                            />

                            <h3 className="text-lg font-bold">
                                No profile images found
                            </h3>

                            <p className="mt-2 text-sm text-base-content/60">
                                Upload your first profile image.
                            </p>

                            <button
                                type="button"
                                onClick={handleAddCover}
                                className="btn btn-primary mt-5 gap-2"
                            >
                                <Upload size={18} />
                                Upload Image
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {covers.map((cover) => (
                                <article
                                    key={cover._id}
                                    className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="relative mx-auto w-full max-w-sm overflow-hidden bg-base-200">
                                        <img
                                            src={cover.image}
                                            alt={cover.title || "Profile image"}
                                            loading="lazy"
                                            className="aspect-square w-full object-cover"
                                            style={{
                                                objectPosition: "center 25%",
                                            }}
                                        />

                                        {cover.isActive && (
                                            <div className="absolute left-3 top-3">
                                                <span className="badge badge-success gap-1 shadow-sm">
                                                    <Check size={12} />
                                                    Active
                                                </span>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPreviewCover(cover)
                                            }
                                            className="btn btn-circle btn-sm absolute right-3 top-3 border-none bg-black/60 text-white hover:bg-black/80"
                                            aria-label="Preview image"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>

                                    <div className="card-body gap-3 p-4">
                                        <div>
                                            <h3 className="truncate text-lg font-bold">
                                                {cover.title || "Untitled image"}
                                            </h3>

                                            <p className="mt-1 line-clamp-2 min-h-10 text-sm text-base-content/60">
                                                {cover.description ||
                                                    "No description provided."}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {!cover.isActive && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSetActive(cover)
                                                    }
                                                    disabled={Boolean(actionLoading)}
                                                    className="btn btn-sm btn-outline btn-success flex-1 gap-1"
                                                >
                                                    {actionLoading === cover._id ? (
                                                        <LoaderCircle
                                                            size={15}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Star size={15} />
                                                    )}
                                                    Activate
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEditCover(cover)
                                                }
                                                disabled={Boolean(actionLoading)}
                                                className="btn btn-sm btn-outline flex-1 gap-1"
                                            >
                                                <Edit3 size={15} />
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteCover(cover)
                                                }
                                                disabled={Boolean(actionLoading)}
                                                className="btn btn-sm btn-outline btn-error btn-square"
                                                aria-label="Delete image"
                                            >
                                                {actionLoading === cover._id ? (
                                                    <LoaderCircle
                                                        size={16}
                                                        className="animate-spin"
                                                    />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Add/Edit modal */}
            {showEditor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6">
                    <div className="my-auto max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-base-300 bg-base-100 shadow-2xl">

                        {/* Modal header */}
                        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-base-300 bg-base-100 p-4 sm:p-5">
                            <div>
                                <h2 className="text-xl font-bold">
                                    {editingCover
                                        ? "Edit Profile Image"
                                        : "Add Profile Image"}
                                </h2>

                                <p className="mt-1 text-sm text-base-content/60">
                                    Crop your image into a perfect square.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditor}
                                disabled={saving}
                                className="btn btn-ghost btn-square"
                                aria-label="Close editor"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-2">

                                {/* Image editor */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-semibold">
                                            Profile Image
                                        </h3>

                                        <span className="badge badge-primary badge-outline">
                                            1:1 Square
                                        </span>
                                    </div>

                                    {imagePreview ? (
                                        <>
                                            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-neutral">
                                                <Cropper
                                                    image={imagePreview}
                                                    crop={crop}
                                                    zoom={zoom}
                                                    aspect={1}
                                                    onCropChange={setCrop}
                                                    onZoomChange={setZoom}
                                                    onCropComplete={onCropComplete}
                                                    restrictPosition
                                                />
                                            </div>

                                            <div className="rounded-xl border border-base-300 bg-base-200/50 p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <label className="text-sm font-medium">
                                                        Adjust zoom
                                                    </label>

                                                    <span className="text-sm font-semibold">
                                                        {zoom.toFixed(1)}x
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <ZoomOut
                                                        size={18}
                                                        className="shrink-0 text-base-content/60"
                                                    />

                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="3"
                                                        step="0.1"
                                                        value={zoom}
                                                        onChange={(event) =>
                                                            setZoom(
                                                                Number(
                                                                    event.target.value
                                                                )
                                                            )
                                                        }
                                                        className="range range-primary range-sm"
                                                    />

                                                    <ZoomIn
                                                        size={18}
                                                        className="shrink-0 text-base-content/60"
                                                    />
                                                </div>

                                                <p className="mt-3 text-xs leading-5 text-base-content/60">
                                                    Drag to reposition the image.
                                                    Zoom in or out until your
                                                    head and shoulders are visible.
                                                </p>
                                            </div>

                                            <label className="btn btn-outline w-full gap-2">
                                                <Upload size={17} />
                                                Choose Another Image

                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </>
                                    ) : (
                                        <div>
                                            <label className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-base-300 bg-base-200/40 p-6 text-center transition hover:border-primary hover:bg-primary/5">
                                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                    <ImagePlus size={30} />
                                                </div>

                                                <h3 className="font-bold">
                                                    Upload a profile image
                                                </h3>

                                                <p className="mt-2 text-sm text-base-content/60">
                                                    JPG, PNG or WebP
                                                </p>

                                                <p className="mt-1 text-xs text-base-content/50">
                                                    Maximum file size: 10 MB
                                                </p>

                                                <span className="btn btn-primary btn-sm mt-5 gap-2">
                                                    <Upload size={15} />
                                                    Browse Images
                                                </span>

                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>

                                            {editingCover && (
                                                <div className="mt-4">
                                                    <p className="mb-2 text-sm text-base-content/60">
                                                        Current image
                                                    </p>

                                                    <div className="mx-auto max-w-xs overflow-hidden rounded-2xl border border-base-300">
                                                        <img
                                                            src={editingCover.image}
                                                            alt={editingCover.title || "Current profile"}
                                                            className="aspect-square w-full object-cover"
                                                            style={{
                                                                objectPosition: "center 25%",
                                                            }}
                                                        />
                                                    </div>

                                                    <p className="mt-2 text-xs text-base-content/50">
                                                        Upload a new image only
                                                        if you want to replace it.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="rounded-xl border border-base-300 bg-base-200/50 p-4">
                                        <div className="flex gap-3">
                                            <ImageIcon
                                                size={20}
                                                className="mt-0.5 shrink-0 text-primary"
                                            />

                                            <div>
                                                <p className="text-sm font-semibold">
                                                    Image settings
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-base-content/60">
                                                    Cropped images are resized
                                                    to 1000 × 1000 pixels and
                                                    converted to JPEG at 85%
                                                    quality before upload.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form fields */}
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <h3 className="font-semibold">
                                            Profile Details
                                        </h3>

                                        <p className="mt-1 text-sm text-base-content/60">
                                            Set the title and description.
                                        </p>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">
                                                Title *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(event) =>
                                                setTitle(event.target.value)
                                            }
                                            placeholder="Mohammad Akib"
                                            className="input input-bordered w-full"
                                            required
                                            maxLength={120}
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">
                                                Description
                                            </span>
                                        </label>

                                        <textarea
                                            value={description}
                                            onChange={(event) =>
                                                setDescription(event.target.value)
                                            }
                                            placeholder="Write a short description..."
                                            className="textarea textarea-bordered min-h-28 w-full"
                                            maxLength={1000}
                                        />
                                    </div>

                                    <div className="rounded-xl border border-base-300 p-4">
                                        <label className="flex cursor-pointer items-center justify-between gap-4">
                                            <div>
                                                <h4 className="font-semibold">
                                                    Set as active image
                                                </h4>

                                                <p className="mt-1 text-xs leading-5 text-base-content/60">
                                                    Display this image on your
                                                    portfolio hero section.
                                                </p>
                                            </div>

                                            <input
                                                type="checkbox"
                                                checked={isActive}
                                                onChange={(event) =>
                                                    setIsActive(
                                                        event.target.checked
                                                    )
                                                }
                                                className="toggle toggle-primary"
                                            />
                                        </label>
                                    </div>

                                    <div className="mt-auto rounded-xl bg-base-200/70 p-4">
                                        <h4 className="text-sm font-semibold">
                                            Recommended image
                                        </h4>

                                        <ul className="mt-2 space-y-2 text-xs leading-5 text-base-content/60">
                                            <li>• Resolution: 1000 × 1000 px</li>
                                            <li>• Ratio: 1:1 square</li>
                                            <li>• Format: JPG, PNG or WebP</li>
                                            <li>• Frame: Head and shoulders visible</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Modal footer */}
                            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-base-300 bg-base-100 p-4 sm:flex-row sm:justify-end sm:p-5">
                                <button
                                    type="button"
                                    onClick={closeEditor}
                                    disabled={saving}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn btn-primary gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <LoaderCircle
                                                size={18}
                                                className="animate-spin"
                                            />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={18} />
                                            {editingCover
                                                ? "Update Image"
                                                : "Save Image"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Image preview modal */}
            {previewCover && (
                <div
                    className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setPreviewCover(null)}
                >
                    <div
                        className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-3 p-4">
                            <div className="min-w-0">
                                <h2 className="truncate font-bold">
                                    {previewCover.title || "Profile image"}
                                </h2>

                                <p className="text-sm text-base-content/60">
                                    Square profile image preview
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setPreviewCover(null)}
                                className="btn btn-ghost btn-square"
                                aria-label="Close preview"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="max-h-[75vh] overflow-y-auto bg-base-200 p-4 sm:p-6">
                            <img
                                src={previewCover.image}
                                alt={previewCover.title || "Profile image"}
                                className="mx-auto aspect-square w-full max-w-lg rounded-2xl object-contain"
                            />
                        </div>

                        {previewCover.description && (
                            <p className="p-4 text-sm leading-6 text-base-content/70">
                                {previewCover.description}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cover;


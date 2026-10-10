import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
} from "lucide-react";
import { useAuth } from "../contexts/AuthProvider";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const success = await login(email, password);

            if (success) {
                navigate("/admin/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-base-200 text-base-content">

            {/* Background decoration */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />

            <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-secondary/10 blur-3xl sm:h-80 sm:w-80" />

            {/* Main */}
            <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

                <div className="w-full max-w-md">

                    {/* Heading */}
                    <div className="mb-7 text-center sm:mb-8">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary sm:text-xs">
                            Admin Access
                        </p>

                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                            Enter the Control Room
                        </h1>

                        <p className="mx-auto mt-3 max-w-sm px-2 text-xs leading-5 text-base-content/60 sm:text-sm sm:leading-6">
                            Sign in to manage your portfolio, projects,
                            skills and messages.
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-3xl border border-base-300 bg-base-100/80 p-5 shadow-xl shadow-base-content/5 backdrop-blur-xl sm:rounded-4xl sm:p-7 md:p-8">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-base-content/70"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="username"
                                        placeholder="admin@example.com"
                                        value={email}
                                        disabled={loading}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setErrors((prev) => ({
                                                ...prev,
                                                email: "",
                                            }));
                                        }}
                                        className={`input input-bordered h-12 w-full rounded-xl pl-11 pr-4 text-sm outline-none focus:outline-none focus:ring-0 focus:shadow-none ${
                                            errors.email
                                                ? "input-error"
                                                : "focus:border-primary"
                                        }`}
                                    />
                                </div>

                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-error">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium"
                                    >
                                        Password
                                    </label>

                                    <span className="text-[10px] text-base-content/40 sm:text-xs">
                                        Admin only
                                    </span>
                                </div>

                                <div className="relative">
                                    <LockKeyhole
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-base-content/70"
                                    />

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={password}
                                        disabled={loading}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setErrors((prev) => ({
                                                ...prev,
                                                password: "",
                                            }));
                                        }}
                                        className={`input input-bordered h-12 w-full rounded-xl pl-11 pr-12 text-sm outline-none focus:outline-none focus:ring-0 focus:shadow-none ${
                                            errors.password
                                                ? "input-error"
                                                : "focus:border-primary"
                                        }`}
                                    />

                                    {/* Show / Hide Password */}
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-base-content/70 transition hover:bg-base-200 hover:text-base-content disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-error">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group btn btn-primary h-12 min-h-12 w-full rounded-xl border-0 px-4 text-sm font-semibold shadow-lg shadow-primary/20 disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            Continue to Dashboard
                                        </span>

                                        <ArrowRight
                                            size={18}
                                            className="transition-transform duration-200 group-hover:translate-x-1"
                                        />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Bottom */}
                    <div className="mt-5 px-4 text-center sm:mt-6">
                        <Link
                            to="/"
                            className="text-xs text-base-content/50 transition-colors hover:text-primary"
                        >
                            ← Back to portfolio
                        </Link>

                        <p className="mt-3 text-[10px] text-base-content/40 sm:text-xs">
                            Personal portfolio administration
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;


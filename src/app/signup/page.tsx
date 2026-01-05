"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [openRouterKey, setOpenRouterKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!openRouterKey.trim()) {
            setError("OpenRouter API key is required");
            return;
        }

        // Validation removed to accept different key formats


        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    name,
                    openRouterKey,
                }),
            });

            const text = await response.text();

            try {
                const data = JSON.parse(text);
                if (!response.ok) {
                    throw new Error(data.error || "Failed to sign up");
                }
                router.push("/");
            } catch (e) {
                console.error("Signup parsing error:", e);
                console.error("Raw response:", text);

                // If it looks like HTML (often 404 or 500 or redirect), show generic error
                if (text.trim().startsWith("<")) {
                    throw new Error(`Server returned HTML instead of JSON (Status ${response.status}). Check console.`);
                }

                throw new Error("Invalid server response");
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center overflow-hidden antialiased selection:bg-primary selection:text-white relative p-6">
            {/* Background decorative gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-mesh pointer-events-none w-full h-full opacity-60"></div>

            <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col gap-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                        Get Started
                    </h1>
                    <p className="text-foreground/40 text-sm">
                        Turn chaos into clarity.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Name */}
                    <div className="group relative">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-12 bg-transparent rounded-lg pl-6! pr-4 text-white placeholder:text-white/20 border border-white/10 focus:border-primary focus:bg-white/2 outline-none ring-0 transition-all duration-300 font-medium"
                            placeholder="Name (optional)"
                        />
                    </div>

                    {/* Email */}
                    <div className="group relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-12 bg-transparent rounded-lg pl-6! pr-4 text-white placeholder:text-white/20 border border-white/10 focus:border-primary focus:bg-white/2 outline-none ring-0 transition-all duration-300 font-medium"
                            placeholder="Email"
                        />
                    </div>

                    {/* Password */}
                    <div className="group relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full h-12 bg-transparent rounded-lg pl-6! pr-4 text-white placeholder:text-white/20 border border-white/10 focus:border-primary focus:bg-white/2 outline-none ring-0 transition-all duration-300 font-medium"
                            placeholder="Password"
                        />
                    </div>

                    {/* OpenRouter API Key */}
                    <div className="group relative">
                        <input
                            type="password"
                            value={openRouterKey}
                            onChange={(e) => setOpenRouterKey(e.target.value)}
                            required
                            className="w-full h-12 bg-transparent rounded-lg pl-6! pr-4 text-white placeholder:text-white/20 border border-white/10 focus:border-primary focus:bg-white/2 outline-none ring-0 transition-all duration-300 font-medium"
                            placeholder="OpenRouter API Key (sk-or-...)"
                        />
                        <p className="text-right mt-2 text-xs">
                            <a
                                href="https://openrouter.ai/keys"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground/30 hover:text-primary transition-colors hover:underline"
                            >
                                Get a key →
                            </a>
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-error text-xs text-center font-medium bg-error/10 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group mt-2 w-full h-14 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 hover:shadow-primary/40 text-white font-bold text-lg"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                Begin Journey
                                <span className="material-icons-round text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </span>
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-center text-foreground/30 text-sm mb-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

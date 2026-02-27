"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "TENANT",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
            } else {
                router.push("/login?registered=true");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-6 pt-20 pb-12 gradient-bg overflow-y-auto">
            <div className="w-full max-w-md relative z-40">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2 text-white">Join <span className="gradient-text">SmartRental</span></h1>
                        <p className="text-slate-400">Create an account to start your journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-2xl text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="full-name" className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                            <Input
                                id="full-name"
                                type="text"
                                required
                                autoFocus
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl focus:ring-emerald-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@example.com"
                                className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl focus:ring-emerald-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-300 ml-1">Password</label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Min. 8 characters"
                                className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl focus:ring-emerald-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium text-slate-300 ml-1">I am a...</label>
                            <div className="relative">
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl h-12 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-white appearance-none cursor-pointer"
                                >
                                    <option value="TENANT">Tenant Looking to Rent</option>
                                    <option value="LANDLORD">Landlord Property Owner</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ArrowRight className="w-4 h-4 rotate-90" />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? "Creating Account..." : (
                                <>
                                    Get Started <ArrowRight className="h-5 w-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center mt-8 text-slate-400 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-bold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

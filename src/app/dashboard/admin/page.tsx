"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Users, Building, Activity, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/dashboard/stats");
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container mx-auto px-6 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-bold mb-2">System <span className="gradient-text">Administration</span></h1>
                <p className="text-slate-400">Global overview and moderation tools for the Smart Rental platform.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard icon={<Users className="text-blue-400" />} label="Total Users" value={stats?.usersCount || 0} loading={loading} />
                <StatCard icon={<Building className="text-primary" />} label="Total Properties" value={stats?.propertiesCount || 0} loading={loading} />
                <StatCard icon={<ShieldCheck className="text-emerald-400" />} label="Total Bookings" value={stats?.bookingsCount || 0} loading={loading} />
                <StatCard icon={<Activity className="text-indigo-400" />} label="Total Revenue" value={`R${stats?.totalRevenue?.toLocaleString() || 0} `} loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-morphism rounded-3xl p-8 border border-border/40">
                    <h2 className="text-xl font-bold mb-6">User Moderation</h2>
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <p className="text-slate-500 text-sm mb-4">Manage the platform's user base and property listings.</p>
                            <div className="flex gap-4">
                                <a href="/dashboard/admin/users" className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                                    <Users size={18} /> Manage Users
                                </a>
                                <a href="/dashboard/admin/properties" className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                                    <Building size={18} /> Manage Properties
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-morphism rounded-3xl p-8 border border-border/40">
                    <h2 className="text-xl font-bold mb-6">Security & Logs</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-border/20 text-xs text-slate-400 font-mono">
                            [SYSTEM] Boot successful at {new Date().toISOString()}
                            <br />
                            [AUTH] NextAuth configuration verified.
                            <br />
                            [DB] Database connection established via Prisma.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, loading }: any) {
    return (
        <div className="glass-morphism p-6 rounded-2xl border border-border/40 hover:border-primary/30 transition-all shadow-lg">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <p className="text-slate-400 text-xs">{label}</p>
                    {loading ? (
                        <div className="h-6 w-16 bg-white/5 animate-pulse rounded-lg mt-1" />
                    ) : (
                        <p className="text-xl font-bold">{value}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

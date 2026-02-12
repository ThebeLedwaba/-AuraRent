"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Home, MessageSquare, CreditCard, Star } from "lucide-react";
import Link from "next/link";

export default function TenantDashboard() {
    const { data: session } = useSession();
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
                <h1 className="text-4xl font-bold mb-2">Welcome back, <span className="gradient-text">{session?.user?.name}</span></h1>
                <p className="text-slate-400">Manage your rentals, messages, and saved properties.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <StatCard icon={<Home className="text-primary" />} label="Active Rentals" value={stats?.bookingsCount || 0} loading={loading} />
                <StatCard icon={<CreditCard className="text-emerald-400" />} label="Total Investment" value={`$${stats?.totalSpent?.toLocaleString() || 0}`} loading={loading} />
                <StatCard icon={<MessageSquare className="text-blue-400" />} label="New Messages" value={stats?.recentMessages?.length || 0} loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-morphism rounded-3xl p-8 border border-border/40">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Recent Activity</h2>
                        <Link href="/rentals" className="text-primary text-sm font-bold hover:underline">View All</Link>
                    </div>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(n => <div key={n} className="h-16 bg-white/5 rounded-2xl animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            No recent activity recorded.
                        </div>
                    )}
                </div>

                <div className="glass-morphism rounded-3xl p-8 border border-border/40">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Recommended for You</h2>
                        <Link href="/listings" className="text-primary text-sm font-bold hover:underline">Explore</Link>
                    </div>
                    <div className="text-center py-12 text-slate-500">
                        Based on your search patterns, we'll suggest properties here.
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, loading }: any) {
    return (
        <div className="glass-morphism p-8 rounded-3xl border border-border/40 hover:border-primary/30 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                {icon}
            </div>
            <p className="text-slate-400 text-sm mb-1">{label}</p>
            {loading ? (
                <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg" />
            ) : (
                <p className="text-3xl font-bold">{value}</p>
            )}
        </div>
    );
}

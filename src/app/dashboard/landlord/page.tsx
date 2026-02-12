"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Building, Users, DollarSign, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function LandlordDashboard() {
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
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Landlord <span className="gradient-text">Hub</span></h1>
                    <p className="text-slate-400">Overview of your property portfolio and rental income.</p>
                </div>
                <Link
                    href="/dashboard/landlord/properties/new"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    List New Property
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <StatCard icon={<Building className="text-primary" />} label="Total Properties" value={stats?.propertiesCount || 0} loading={loading} />
                <StatCard icon={<Users className="text-blue-400" />} label="Active Tenants" value={stats?.activeBookings || 0} loading={loading} />
                <StatCard icon={<DollarSign className="text-emerald-400" />} label="Monthly Revenue" value={`$${stats?.totalRevenue?.toLocaleString() || 0}`} loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-morphism rounded-3xl p-8 border border-border/40">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold">Property Performance</h2>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-center py-24 text-slate-500 border-2 border-dashed border-border/20 rounded-2xl">
                        Charts and detailed property analysis will appear here.
                    </div>
                </div>

                <div className="glass-morphism rounded-3xl p-8 border border-border/40">
                    <h2 className="text-xl font-bold mb-6">Recent Enquiries</h2>
                    <div className="space-y-4">
                        {loading ? (
                            [1, 2, 3].map(n => <div key={n} className="h-16 bg-white/5 rounded-2xl animate-pulse" />)
                        ) : (
                            <div className="text-center py-12 text-slate-500 italic text-sm">
                                No new enquiries at the moment.
                            </div>
                        )}
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

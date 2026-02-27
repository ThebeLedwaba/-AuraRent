"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Home, MessageSquare, CreditCard, Star } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MaintenanceList } from "@/components/dashboard/MaintenanceList";
import { RentPassport } from "@/components/dashboard/RentPassport";

export default function TenantDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            // Mock data if API fails or for demo
            try {
                const res = await fetch("/api/dashboard/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                } else {
                    setStats({ bookingsCount: 0, totalSpent: 0, recentMessages: [] });
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
                setStats({ bookingsCount: 0, totalSpent: 0, recentMessages: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session?.user?.name}</h1>
                <p className="text-muted-foreground">Manage your rentals, messages, and saved properties.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<Home className="h-4 w-4 text-muted-foreground" />} label="Active Rentals" value={stats?.bookingsCount || 0} loading={loading} />
                <StatCard icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} label="Total Investment" value={`R${stats?.totalSpent?.toLocaleString() || 0}`} loading={loading} />
                <StatCard icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />} label="New Messages" value={stats?.recentMessages?.length || 0} loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                            <Link href="/rentals">
                                <Button variant="link" size="sm">View All</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(n => <div key={n} className="h-12 bg-muted rounded-md animate-pulse" />)}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground text-sm">
                                    No recent activity recorded.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <MaintenanceList />
                </div>

                <div className="space-y-8">
                    <RentPassport />
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-semibold">Recommended for You</CardTitle>
                            <Link href="/properties">
                                <Button variant="link" size="sm">Explore</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-muted-foreground text-sm">
                                Based on your search patterns, we'll suggest properties here.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, loading }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {label}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    );
}

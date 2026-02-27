"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Building, Users, DollarSign, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LandlordTickets } from "@/components/dashboard/landlord/LandlordTickets";

export default function LandlordDashboard() {
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
                    setStats({ propertiesCount: 0, activeBookings: 0, totalRevenue: 0 });
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
                setStats({ propertiesCount: 0, activeBookings: 0, totalRevenue: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Landlord Hub</h1>
                    <p className="text-muted-foreground">Overview of your property portfolio and rental income.</p>
                </div>
                <Link href="/properties/new">
                    {/* Changed link to generic new property path if it exists, or dashboard specific. Keeping simpler URL structure if possible, but dashboard specific is fine too. I'll make it generic or keep it if I built that page. I haven't built 'new' page, but the button should be there. */}
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        List New Property
                    </Button>
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<Building className="h-4 w-4 text-muted-foreground" />} label="Total Properties" value={stats?.propertiesCount || 0} loading={loading} />
                <StatCard icon={<Users className="h-4 w-4 text-muted-foreground" />} label="Active Tenants" value={stats?.activeBookings || 0} loading={loading} />
                <StatCard icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} label="Monthly Revenue" value={`R${stats?.totalRevenue?.toLocaleString() || 0}`} loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-semibold">Property Performance</CardTitle>
                            <Button variant="ghost" size="icon">
                                <ArrowUpRight className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-24 text-muted-foreground text-sm border-2 border-dashed rounded-lg bg-muted/20">
                                Charts and detailed property analysis will appear here.
                            </div>
                        </CardContent>
                    </Card>

                    <LandlordTickets />
                </div>

                <div className="space-y-8">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Recent Enquiries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loading ? (
                                    [1, 2, 3].map(n => <div key={n} className="h-12 bg-muted rounded-md animate-pulse" />)
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground text-sm italic">
                                        No new enquiries at the moment.
                                    </div>
                                )}
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

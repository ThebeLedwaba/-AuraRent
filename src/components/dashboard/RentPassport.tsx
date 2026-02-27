"use client";

import { useState, useEffect } from "react";
import { UserCheck, Briefcase, Star, Download, Share2, Verified } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RentPassport() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPassport() {
            try {
                const res = await fetch("/api/tenant/passport");
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch passport data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPassport();
    }, []);

    if (loading) return <div className="h-96 bg-muted animate-pulse rounded-2xl" />;
    if (!data) return null;

    const passportData = {
        score: data.score,
        status: `${data.tier} Tier`,
        items: [
            {
                label: "Identity Verified",
                status: data.verifications.identity ? "Verified" : "Pending",
                icon: <UserCheck className="h-4 w-4" />,
                color: data.verifications.identity ? "text-emerald-500" : "text-amber-500"
            },
            {
                label: "Employment Verified",
                status: data.verifications.employment ? "Verified" : "Pending",
                icon: <Briefcase className="h-4 w-4" />,
                color: data.verifications.employment ? "text-emerald-500" : "text-amber-500"
            },
            {
                label: "Rent Payments",
                status: data.verifications.payments,
                icon: <Star className="h-4 w-4" />,
                color: "text-amber-500"
            },
        ]
    };

    return (
        <Card className="overflow-hidden border-2 border-emerald-500/20 shadow-xl bg-gradient-to-br from-white to-emerald-50/30 dark:from-zinc-950 dark:to-emerald-950/10">
            <CardHeader className="bg-emerald-600 text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Verified className="h-5 w-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Official Rent Passport</span>
                        </div>
                        <CardTitle className="text-2xl">Verified Identity</CardTitle>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black">{data.score >= 800 ? 'A+' : data.score >= 700 ? 'A' : 'B'}</p>
                        <p className="text-[10px] opacity-70 font-bold uppercase tracking-tighter">Tenant Rating</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">AuraScore</p>
                        <p className="text-4xl font-black text-emerald-600">{passportData.score}</p>
                    </div>
                    <div className="text-right">
                        <Badge className="bg-emerald-600 mb-2">{passportData.status}</Badge>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Based on history</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Verification Status</p>
                    {passportData.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border/50">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 bg-muted rounded-lg ${item.color}`}>
                                    {item.icon}
                                </div>
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
                                {item.status}
                            </Badge>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button variant="outline" className="gap-2 text-xs h-9">
                        <Download className="h-3 w-3" /> Export PDF
                    </Button>
                    <Button className="bg-zinc-900 hover:bg-black text-white gap-2 text-xs h-9">
                        <Share2 className="h-3 w-3" /> Share Profile
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

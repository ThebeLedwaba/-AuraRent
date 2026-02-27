"use client";

import { useState, useEffect } from "react";
import { Wrench, AlertCircle, Clock, CheckCircle2, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Ticket {
    id: string;
    title: string;
    category: string;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    createdAt: string;
}

export function MaintenanceList() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTickets() {
            try {
                // Shared maintenance API or tenant specific
                const res = await fetch("/api/landlord/maintenance"); // We'll assume a similar endpoint for tenants or reuse
                if (res.ok) {
                    setTickets(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTickets();
    }, []);

    if (loading) return <div className="h-48 bg-muted animate-pulse rounded-2xl" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Maintenance Requests</h2>
                    <p className="text-sm text-muted-foreground">Track and manage property repairs.</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <Plus className="h-4 w-4" /> New Request
                </Button>
            </div>

            <div className="grid gap-4">
                {tickets.length === 0 ? (
                    <div className="p-12 text-center bg-muted/20 border-2 border-dashed rounded-2xl text-muted-foreground text-sm">
                        No active maintenance requests.
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <div key={ticket.id} className="p-5 bg-white dark:bg-black/20 border border-border rounded-2xl hover:border-emerald-500/50 transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={`p-3 rounded-xl ${getStatusBg(ticket.status)}`}>
                                        <Wrench className={`h-5 w-5 ${getStatusColor(ticket.status)}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold group-hover:text-emerald-600 transition-colors">{ticket.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-muted-foreground">{ticket.category}</span>
                                            <span className="text-xs text-muted-foreground">•</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {ticket.createdAt}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className={`${getPriorityColor(ticket.priority)} border-current bg-current/5 uppercase text-[10px]`}>
                                        {ticket.priority}
                                    </Badge>
                                    <Badge className={`${getStatusBadgeColor(ticket.status)} uppercase text-[10px]`}>
                                        {ticket.status.replace("_", " ")}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function getStatusBg(status: string) {
    switch (status) {
        case "RESOLVED": return "bg-emerald-100 dark:bg-emerald-900/30";
        case "IN_PROGRESS": return "bg-blue-100 dark:bg-blue-900/30";
        default: return "bg-amber-100 dark:bg-amber-900/30";
    }
}

function getStatusColor(status: string) {
    switch (status) {
        case "RESOLVED": return "text-emerald-600";
        case "IN_PROGRESS": return "text-blue-600";
        default: return "text-amber-600";
    }
}

function getStatusBadgeColor(status: string) {
    switch (status) {
        case "RESOLVED": return "bg-emerald-500 hover:bg-emerald-600";
        case "IN_PROGRESS": return "bg-blue-500 hover:bg-blue-600";
        default: return "bg-amber-500 hover:bg-amber-600";
    }
}

function getPriorityColor(priority: string) {
    switch (priority) {
        case "URGENT": return "text-rose-600";
        case "HIGH": return "text-orange-600";
        case "MEDIUM": return "text-amber-600";
        default: return "text-emerald-600";
    }
}

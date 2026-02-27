"use client";

import { useState, useEffect } from "react";
import { Wrench, CheckCircle2, Clock, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { updateTicketStatus } from "@/app/actions/maintenance";

interface Ticket {
    id: string;
    title: string;
    propertyTitle: string;
    tenantName: string;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    createdAt: string;
}

export function LandlordTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/landlord/maintenance");
            if (res.ok) {
                setTickets(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: any) => {
        try {
            const res = await updateTicketStatus(id, newStatus);
            if (res.success) {
                // Optimistic update or refetch
                setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    if (loading) return <div className="h-64 bg-muted animate-pulse rounded-2xl" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Property Maintenance</h2>
                    <p className="text-sm text-muted-foreground">Manage service requests across your portfolio.</p>
                </div>
            </div>

            <div className="overflow-hidden bg-white dark:bg-black/20 rounded-2xl border border-border shadow-sm">
                {tickets.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-sm italic">
                        No tickets found for your properties.
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Issue / Property</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tenant</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Priority</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="p-4">
                                        <div>
                                            <p className="font-bold group-hover:text-emerald-600 transition-colors">{ticket.title}</p>
                                            <p className="text-xs text-muted-foreground">{ticket.propertyTitle}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-muted-foreground">{ticket.tenantName}</span>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="outline" className={`${getPriorityColor(ticket.priority)} border-current bg-transparent uppercase text-[9px]`}>
                                            {ticket.priority}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <Badge className={`${getStatusBadgeColor(ticket.status)} text-white uppercase text-[9px]`}>
                                            {ticket.status.replace("_", " ")}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(ticket.id, "IN_PROGRESS")}>
                                                    <Clock className="mr-2 h-4 w-4 text-blue-500" /> Start Repair
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(ticket.id, "RESOLVED")}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Mark Resolved
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(ticket.id, "OPEN")}>
                                                    <AlertCircle className="mr-2 h-4 w-4 text-amber-500" /> Reopen Ticket
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

// Reuse helper functions...
function getPriorityColor(priority: string) {
    switch (priority) {
        case "URGENT": return "text-rose-600";
        case "HIGH": return "text-orange-600";
        case "MEDIUM": return "text-amber-600";
        default: return "text-emerald-600";
    }
}

function getStatusBadgeColor(status: string) {
    switch (status) {
        case "RESOLVED": return "bg-emerald-500";
        case "IN_PROGRESS": return "bg-blue-500";
        default: return "bg-amber-500";
    }
}

import { AlertCircle } from "lucide-react";

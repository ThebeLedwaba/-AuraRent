"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    type: string;
    message: string;
    isRead: boolean;
    link?: string;
    createdAt: string;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 10 seconds
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string, link?: string) => {
        try {
            await fetch(`/api/notifications/${id}`, { method: "PATCH" });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(error);
        }

        if (link) {
            setOpen(false);
        }
    };

    const markAllRead = async () => {
        try {
            await fetch("/api/notifications", { method: "PATCH" });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-white/10">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-[#09090b]" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 mr-4" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                            Mark all read
                        </button>
                    )}
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                                    !notification.isRead && "bg-muted/30"
                                )}
                                onClick={() => {
                                    markAsRead(notification.id);
                                    if (notification.link) window.location.href = notification.link;
                                }}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <p className={cn("text-sm", !notification.isRead ? "font-medium text-foreground" : "text-muted-foreground")}>
                                        {notification.message}
                                    </p>
                                    {!notification.isRead && (
                                        <span className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0" />
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground mt-1 block">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

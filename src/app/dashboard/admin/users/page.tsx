"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Shield, User as UserIcon } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: "TENANT" | "LANDLORD" | "ADMIN";
    createdAt: string;
    _count: {
        properties: number;
        bookings: number;
    };
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== userId));
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: newRole })
            });

            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8">User Management</h1>

            <div className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border/50 uppercase text-xs text-muted-foreground font-semibold">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Stats</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <UserIcon size={16} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground">{user.name || "Unknown"}</div>
                                            <div className="text-muted-foreground text-xs">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                        className="bg-transparent border border-border/60 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="TENANT">Tenant</option>
                                        <option value="LANDLORD">Landlord</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {user.role === "LANDLORD" ? (
                                        <span>{user._count.properties} properties</span>
                                    ) : (
                                        <span>{user._count.bookings} bookings</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:text-red-500 hover:bg-red-500/10"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

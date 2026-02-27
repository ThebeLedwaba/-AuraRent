"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Building, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Property {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
    createdAt: string;
    owner: {
        name: string;
        email: string;
    };
    _count: {
        bookings: number;
        reviews: number;
    };
}

export default function PropertyManagementPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProperties = async () => {
        try {
            const res = await fetch("/api/admin/properties");
            if (res.ok) {
                const data = await res.json();
                setProperties(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleDelete = async (propertyId: string) => {
        if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/properties?id=${propertyId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setProperties(properties.filter(p => p.id !== propertyId));
            } else {
                alert("Failed to delete property");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8">Property Management</h1>

            <div className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border/50 uppercase text-xs text-muted-foreground font-semibold">
                        <tr>
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Owner</th>
                            <th className="px-6 py-4">Price/Night</th>
                            <th className="px-6 py-4">Stats</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {properties.map((property) => (
                            <tr key={property.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-16 rounded overflow-hidden bg-muted relative">
                                            {property.images[0] ? (
                                                <img src={property.images[0]} alt={property.title} className="object-cover h-full w-full" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-slate-100 text-slate-300">
                                                    <Building size={16} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground">{property.title}</div>
                                            <Link href={`/properties/${property.id}`} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                View Listing <ExternalLink size={10} />
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-foreground">{property.owner.name}</div>
                                    <div className="text-muted-foreground text-xs">{property.owner.email}</div>
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    ${property.price}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {property._count.bookings} bookings · {property._count.reviews} reviews
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:text-red-500 hover:bg-red-500/10"
                                        onClick={() => handleDelete(property.id)}
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

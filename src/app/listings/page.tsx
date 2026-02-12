"use client";

import { useEffect, useState } from "react";
import PropertyCard from "@/components/property/PropertyCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ListingPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState("");
    const [type, setType] = useState("");

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (city) params.append("city", city);
            if (type) params.append("type", type);

            const res = await fetch(`/api/properties?${params.toString()}`);
            const data = await res.json();
            setProperties(data);
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    return (
        <section className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-4">Explore <span className="gradient-text">Properties</span></h1>
                    <p className="text-slate-400 max-w-lg">Find the perfect home from our curated selection of premium rental properties.</p>
                </div>

                <div className="glass-morphism p-2 rounded-2xl flex items-center shadow-xl border-border/40">
                    <div className="flex items-center px-4 border-r border-border/40">
                        <Search className="w-5 h-5 text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="City, state, or ZIP"
                            className="bg-transparent border-none outline-none text-sm w-48"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-transparent px-4 py-2 border-none outline-none text-sm text-slate-400 cursor-pointer"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="HOUSE">House</option>
                        <option value="STUDIO">Studio</option>
                        <option value="VILLA">Villa</option>
                    </select>
                    <button
                        onClick={fetchProperties}
                        className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all ml-2 shadow-lg shadow-primary/20"
                    >
                        Search
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-96 rounded-2xl bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property: any) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 glass-morphism rounded-3xl">
                    <h2 className="text-2xl font-bold mb-2">No properties found</h2>
                    <p className="text-slate-400">Try adjusting your search filters to find more listings.</p>
                </div>
            )}
        </section>
    );
}

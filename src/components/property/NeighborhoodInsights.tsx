"use client";

import { useState, useEffect } from "react";
import { MapPin, Footprints, Train, School, ShoppingBag, Coffee, Car } from "lucide-react";

interface NeighborhoodInsightsProps {
    address: string;
    city: string;
}

export function NeighborhoodInsights({ address, city }: NeighborhoodInsightsProps) {
    const [insights, setInsights] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInsights() {
            try {
                const res = await fetch(`/api/neighborhood?address=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}`);
                if (res.ok) {
                    setInsights(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch neighborhood insights:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchInsights();
    }, [address, city]);

    if (loading) return (
        <div className="space-y-6">
            <div className="h-6 w-48 bg-muted animate-pulse rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />)}
            </div>
        </div>
    );

    if (!insights) return null;

    const nearbyPlacesWithIcons = insights.nearbyPlaces?.map((place: any) => {
        const icon = place.type.toLowerCase().includes("transit") ? <Train className="h-4 w-4" /> :
            place.type.toLowerCase().includes("shop") ? <ShoppingBag className="h-4 w-4" /> :
                place.type.toLowerCase().includes("edu") || place.type.toLowerCase().includes("school") ? <School className="h-4 w-4" /> :
                    <Coffee className="h-4 w-4" />;
        return { ...place, icon };
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <h3 className="text-xl font-bold">Neighborhood Intelligence</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ScoreCard label="Walk Score" score={insights.walkScore} icon={<Footprints className="h-5 w-5" />} description={insights.walkScore > 70 ? "Very Walkable" : "Somewhat Walkable"} color="text-emerald-600" />
                <ScoreCard label="Transit Score" score={insights.transitScore} icon={<Train className="h-5 w-5" />} description={insights.transitScore > 70 ? "Excellent Transit" : "Good Transit"} color="text-blue-600" />
                <ScoreCard label="Bike Score" score={insights.bikeScore} icon={<Car className="h-5 w-5" />} description={insights.bikeScore > 70 ? "Biker's Paradise" : "Bikeable"} color="text-indigo-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Nearby Places */}
                <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
                    <h4 className="font-semibold mb-6 flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" /> Nearby Amenities
                    </h4>
                    <div className="space-y-4">
                        {nearbyPlacesWithIcons?.map((place: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-border/40 hover:border-emerald-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                                        {place.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{place.name}</p>
                                        <p className="text-xs text-muted-foreground">{place.type}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-muted-foreground">{place.distance}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Commute Times (Still using reasonable static benchmarks for now) */}
                <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
                    <h4 className="font-semibold mb-6 flex items-center gap-2">
                        <Car className="h-4 w-4" /> Commute Times
                    </h4>
                    <div className="space-y-6">
                        {[
                            { to: "Business District", car: "12 min", transit: "25 min" },
                            { to: "International Airport", car: "35 min", transit: "55 min" },
                        ].map((commute, idx) => (
                            <div key={idx} className="space-y-3">
                                <p className="text-sm font-medium text-muted-foreground">To {commute.to}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-border/40">
                                        <Car className="h-4 w-4 text-blue-500" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Car</p>
                                            <p className="text-sm font-bold">{commute.car}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-border/40">
                                        <Train className="h-4 w-4 text-indigo-500" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Transit</p>
                                            <p className="text-sm font-bold">{commute.transit}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ScoreCard({ label, score, icon, description, color }: { label: string, score: number, icon: React.ReactNode, description: string, color: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-black/20 border border-border shadow-sm group hover:border-emerald-500/50 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 bg-muted rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors`}>
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold">{score}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">/ 100</p>
                </div>
            </div>
            <p className="text-sm font-semibold mb-1">{label}</p>
            <p className={`text-xs font-medium ${color}`}>{description}</p>
        </div>
    );
}

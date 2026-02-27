import prisma from "./prisma";

export interface NeighborhoodStats {
    walkScore: number;
    transitScore: number;
    bikeScore: number;
    nearbyPlaces: { name: string; type: string; distance: string }[];
}

/**
 * Service to fetch neighborhood intelligence.
 * In a real production app, this would call external APIs like Walk Score, 
 * Google Places, or Mapbox.
 */
export const NeighborhoodService = {
    async getInsights(address: string, city: string): Promise<NeighborhoodStats> {
        // Logic for actual API integration would go here.
        // For now, we simulate data based on the location.

        // Example: If city is Chicago, we return high urban scores.
        const isUrban = city.toLowerCase().includes("chicago") ||
            city.toLowerCase().includes("york") ||
            city.toLowerCase().includes("london");

        return {
            walkScore: isUrban ? 88 : 45,
            transitScore: isUrban ? 82 : 30,
            bikeScore: isUrban ? 75 : 55,
            nearbyPlaces: [
                { name: `${city} Central Station`, type: "Transit", distance: "0.4 km" },
                { name: "Local Green Grocer", type: "Shopping", distance: "0.6 km" },
                { name: "Community Library", type: "Education", distance: "1.2 km" },
                { name: "Aura Coffee Co.", type: "Cafe", distance: "0.2 km" },
            ]
        };
    }
};

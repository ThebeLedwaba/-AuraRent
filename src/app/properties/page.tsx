import prisma from "@/lib/prisma";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertySearch } from "@/components/properties/PropertySearch";
import { Suspense } from "react";

// Force dynamic rendering since we use search params
export const dynamic = 'force-dynamic';

async function getProperties(query: string) {
    const where: any = {};

    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } },
        ];
    }

    try {
        const properties = await prisma.property.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                owner: {
                    select: { name: true, image: true }
                }
            }
        });
        return properties;
    } catch (error) {
        console.error("Failed to fetch properties:", error);
        return [];
    }
}

export default async function PropertiesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const sp = await searchParams;
    const query = sp?.q || "";
    const properties = await getProperties(query);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Browse Properties</h1>
                    <p className="text-muted-foreground mt-1">
                        {properties.length} {properties.length === 1 ? 'result' : 'results'} found
                    </p>
                </div>
                <Suspense>
                    <PropertySearch />
                </Suspense>
            </div>

            {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-muted/30 rounded-lg border border-dashed">
                    <h2 className="text-xl font-semibold mb-2">No properties found</h2>
                    <p className="text-muted-foreground">Try adjusting your search terms.</p>
                </div>
            )}
        </div>
    );
}

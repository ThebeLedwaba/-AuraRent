import prisma from "@/lib/prisma";

export const PropertyService = {
    async createProperty(data: any, ownerId: string) {
        return prisma.property.create({
            data: {
                ...data,
                ownerId,
            },
        });
    },

    async getProperties(filters: any = {}) {
        const { city, type, minPrice, maxPrice } = filters;

        return prisma.property.findMany({
            where: {
                city: city ? { contains: city, mode: 'insensitive' } : undefined,
                type: type || undefined,
                price: {
                    gte: minPrice ? parseFloat(minPrice) : undefined,
                    lte: maxPrice ? parseFloat(maxPrice) : undefined,
                },
                status: "AVAILABLE",
            },
            include: {
                owner: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    async getPropertyById(id: string) {
        return prisma.property.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });
    },

    async updateProperty(id: string, userId: string, data: any) {
        // Ensure the user owns the property
        const property = await prisma.property.findUnique({
            where: { id },
        });

        if (!property || property.ownerId !== userId) {
            throw new Error("Unauthorized or property not found");
        }

        return prisma.property.update({
            where: { id },
            data,
        });
    },

    async deleteProperty(id: string, userId: string) {
        const property = await prisma.property.findUnique({
            where: { id },
        });

        if (!property || property.ownerId !== userId) {
            throw new Error("Unauthorized or property not found");
        }

        return prisma.property.delete({
            where: { id },
        });
    },
};

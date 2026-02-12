import prisma from "@/lib/prisma";

export const ReviewService = {
    async createReview(data: {
        rating: number;
        comment: string;
        reviewerId: string;
        propertyId?: string;
        landlordId?: string;
    }) {
        return prisma.review.create({
            data,
            include: {
                reviewer: {
                    select: { name: true, image: true }
                }
            }
        });
    },

    async getReviewsByProperty(propertyId: string) {
        return prisma.review.findMany({
            where: { propertyId },
            include: {
                reviewer: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    },

    async getReviewsByLandlord(landlordId: string) {
        return prisma.review.findMany({
            where: { landlordId },
            include: {
                reviewer: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    },

    async getAverageRating(propertyId?: string, landlordId?: string) {
        const aggregate = await prisma.review.aggregate({
            where: {
                OR: [
                    { propertyId },
                    { landlordId }
                ]
            },
            _avg: {
                rating: true
            },
            _count: {
                id: true
            }
        });

        return {
            average: aggregate._avg.rating || 0,
            count: aggregate._count.id
        };
    }
};

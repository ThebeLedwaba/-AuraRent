import prisma from "@/lib/prisma";
import { BookingStatus, PropertyStatus } from "@prisma/client";

export const DashboardService = {
    async getTenantStats(userId: string) {
        const [bookingsCount, totalSpent, recentMessages] = await Promise.all([
            prisma.booking.count({ where: { userId } }),
            prisma.booking.aggregate({
                where: { userId, status: BookingStatus.PAID },
                _sum: { totalPrice: true }
            }),
            prisma.message.findMany({
                where: { senderId: { not: userId }, conversation: { participants: { some: { id: userId } } } },
                take: 5,
                orderBy: { createdAt: "desc" },
                include: { sender: { select: { name: true } } }
            })
        ]);

        return {
            bookingsCount,
            totalSpent: totalSpent._sum.totalPrice || 0,
            recentMessages
        };
    },

    async getLandlordStats(userId: string) {
        const [propertiesCount, activeBookings, totalRevenue] = await Promise.all([
            prisma.property.count({ where: { ownerId: userId } }),
            prisma.booking.count({
                where: {
                    property: { ownerId: userId },
                    status: { in: [BookingStatus.CONFIRMED, BookingStatus.PAID] }
                }
            }),
            prisma.booking.aggregate({
                where: {
                    property: { ownerId: userId },
                    status: BookingStatus.PAID
                },
                _sum: { totalPrice: true }
            })
        ]);

        return {
            propertiesCount,
            activeBookings,
            totalRevenue: totalRevenue._sum.totalPrice || 0
        };
    },

    async getAdminStats() {
        const [usersCount, propertiesCount, bookingsCount, totalRevenue] = await Promise.all([
            prisma.user.count(),
            prisma.property.count(),
            prisma.booking.count(),
            prisma.booking.aggregate({
                where: { status: BookingStatus.PAID },
                _sum: { totalPrice: true }
            })
        ]);

        return {
            usersCount,
            propertiesCount,
            bookingsCount,
            totalRevenue: totalRevenue._sum.totalPrice || 0
        };
    }
};

import prisma from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export const BookingService = {
    async createBooking(data: {
        userId: string;
        propertyId: string;
        startDate: Date;
        endDate: Date;
    }) {
        const property = await prisma.property.findUnique({
            where: { id: data.propertyId },
        });

        if (!property) throw new Error("Property not found");

        // Simple availability check: Check if there are any overlapping confirmed/paid bookings
        const existingBookings = await prisma.booking.findMany({
            where: {
                propertyId: data.propertyId,
                status: { in: [BookingStatus.CONFIRMED, BookingStatus.PAID] },
                OR: [
                    {
                        startDate: { lte: data.endDate },
                        endDate: { gte: data.startDate },
                    },
                ],
            },
        });

        if (existingBookings.length > 0) {
            throw new Error("Property is already booked for these dates");
        }

        // Calculate total price
        const diffTime = Math.abs(data.endDate.getTime() - data.startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        const totalPrice = diffDays * property.price;

        return prisma.booking.create({
            data: {
                ...data,
                totalPrice,
                status: BookingStatus.PENDING,
            },
        });
    },

    async getBookingById(id: string) {
        return prisma.booking.findUnique({
            where: { id },
            include: {
                property: true,
                user: { select: { name: true, email: true } },
            },
        });
    },

    async getUserBookings(userId: string) {
        return prisma.booking.findMany({
            where: { userId },
            include: { property: true },
            orderBy: { createdAt: "desc" },
        });
    },

    async updateBookingStatus(id: string, status: BookingStatus, paymentIntentId?: string) {
        return prisma.booking.update({
            where: { id },
            data: {
                status,
                ...(paymentIntentId && { paymentIntentId }),
            },
        });
    },
};

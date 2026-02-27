import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                propertyId: params.id,
                status: {
                    in: ["CONFIRMED", "PAID", "PENDING"], // Include PENDING to avoid race conditions roughly
                },
            },
            select: {
                startDate: true,
                endDate: true,
            },
        });

        // Transform to simple date ranges
        const bookedDates = bookings.map((booking) => ({
            from: booking.startDate,
            to: booking.endDate,
        }));

        return NextResponse.json(bookedDates);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

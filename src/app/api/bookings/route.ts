import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { BookingService } from "@/services/booking.service";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { propertyId, startDate, endDate } = await request.json();

        const booking = await BookingService.createBooking({
            userId: (session.user as any).id,
            propertyId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bookings = await BookingService.getUserBookings((session.user as any).id);
        return NextResponse.json(bookings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

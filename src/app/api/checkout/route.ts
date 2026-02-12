import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { BookingService } from "@/services/booking.service";
import { getStripeSession } from "@/lib/stripe";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { bookingId } = await request.json();
        const booking = await BookingService.getBookingById(bookingId);

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        if (booking.userId !== (session.user as any).id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const stripeSession = await getStripeSession(
            booking.id,
            booking.totalPrice,
            booking.property.title
        );

        return NextResponse.json({ url: stripeSession.url });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

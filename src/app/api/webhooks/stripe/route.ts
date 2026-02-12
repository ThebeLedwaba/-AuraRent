import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { BookingService } from "@/services/booking.service";
import { BookingStatus } from "@prisma/client";
import { headers } from "next/headers";

export async function POST(request: Request) {
    const body = await request.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === "checkout.session.completed") {
        const bookingId = session.metadata.bookingId;
        const paymentIntentId = session.payment_intent as string;

        await BookingService.updateBookingStatus(
            bookingId,
            BookingStatus.PAID,
            paymentIntentId
        );
    }

    return NextResponse.json({ received: true });
}

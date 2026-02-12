import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(stripeKey, {
    apiVersion: "2025-01-27.acacia" as any, // Pinned for stability
    appInfo: {
        name: "Smart Rental System",
        version: "0.1.0",
    },
});

export const getStripeSession = async (bookingId: string, amount: number, propertyTitle: string) => {
    return await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `Rental: ${propertyTitle}`,
                    },
                    unit_amount: Math.round(amount * 100), // Stripe uses cents
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${process.env.NEXTAUTH_URL}/bookings/${bookingId}?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/bookings/${bookingId}?cancelled=true`,
        metadata: {
            bookingId,
        },
    });
};

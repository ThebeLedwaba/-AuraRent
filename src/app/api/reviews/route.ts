import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ReviewService } from "@/services/review.service";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        const review = await ReviewService.createReview({
            ...data,
            reviewerId: (session.user as any).id
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const propertyId = searchParams.get("propertyId");
        const landlordId = searchParams.get("landlordId");

        let reviews;
        if (propertyId) {
            reviews = await ReviewService.getReviewsByProperty(propertyId);
        } else if (landlordId) {
            reviews = await ReviewService.getReviewsByLandlord(landlordId);
        } else {
            return NextResponse.json({ error: "PropertyId or LandlordId required" }, { status: 400 });
        }

        return NextResponse.json(reviews);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

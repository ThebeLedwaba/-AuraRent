import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PropertyService } from "@/services/property.service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const filters = {
            city: searchParams.get("city"),
            type: searchParams.get("type"),
            minPrice: searchParams.get("minPrice"),
            maxPrice: searchParams.get("maxPrice"),
        };

        const properties = await PropertyService.getProperties(filters);
        return NextResponse.json(properties);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        const property = await PropertyService.createProperty(data, (session.user as any).id);

        return NextResponse.json(property, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { NeighborhoodService } from "@/lib/neighborhood-service";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    const city = searchParams.get("city");

    if (!address || !city) {
        return NextResponse.json({ error: "Address and city are required" }, { status: 400 });
    }

    try {
        const insights = await NeighborhoodService.getInsights(address, city);
        return NextResponse.json(insights);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
    }
}

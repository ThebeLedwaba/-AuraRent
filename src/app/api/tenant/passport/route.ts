import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PassportService } from "@/lib/passport-service";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const passport = await PassportService.getUserPassport((session.user as any).id);
        return NextResponse.json(passport);
    } catch (error) {
        console.error("Passport API Error:", error);
        return NextResponse.json({ error: "Failed to fetch passport" }, { status: 500 });
    }
}

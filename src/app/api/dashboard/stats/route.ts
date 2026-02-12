import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DashboardService } from "@/services/dashboard.service";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { role, id: userId } = session.user as any;
        let stats;

        if (role === "TENANT") {
            stats = await DashboardService.getTenantStats(userId);
        } else if (role === "LANDLORD") {
            stats = await DashboardService.getLandlordStats(userId);
        } else if (role === "ADMIN") {
            stats = await DashboardService.getAdminStats();
        } else {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        return NextResponse.json(stats);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

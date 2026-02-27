import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Middleware check helper
async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
        return false;
    }
    return true;
}

export async function GET(request: Request) {
    if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    try {
        const properties = await prisma.property.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                owner: {
                    select: { name: true, email: true }
                },
                _count: {
                    select: { bookings: true, reviews: true }
                }
            }
        });
        return NextResponse.json(properties);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    try {
        const { searchParams } = new URL(request.url);
        const propertyId = searchParams.get("id");

        if (!propertyId) {
            return NextResponse.json({ error: "Property ID required" }, { status: 400 });
        }

        await prisma.property.delete({
            where: { id: propertyId }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

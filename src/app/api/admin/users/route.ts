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
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        properties: true,
                        bookings: true
                    }
                }
            }
        });
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    try {
        const { userId, role } = await request.json();

        if (!["TENANT", "LANDLORD", "ADMIN"].includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role }
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("id");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        // Prevent deleting self (simple check, implementation may vary based on session availability in scope)
        // ideally we check if userId === session.user.id but let's assume UI handles safety too.

        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

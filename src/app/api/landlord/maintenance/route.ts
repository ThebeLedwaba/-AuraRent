import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "LANDLORD") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const tickets = await prisma.maintenanceTicket.findMany({
            where: {
                property: {
                    ownerId: (session.user as any).id
                }
            },
            include: {
                property: true,
                tenant: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // Transform for the UI component
        const formattedTickets = tickets.map(t => ({
            id: t.id,
            title: t.title,
            propertyTitle: t.property.title,
            tenantName: t.tenant.name || "Unknown Tenant",
            status: t.status,
            priority: t.priority,
            createdAt: t.createdAt.toLocaleDateString(),
        }));

        return NextResponse.json(formattedTickets);
    } catch (error) {
        console.error("Maintenance API Error:", error);
        return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }
}

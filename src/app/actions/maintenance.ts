"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateTicketStatus(ticketId: string, status: any) {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "LANDLORD") {
        throw new Error("Unauthorized");
    }

    try {
        const ticket = await prisma.maintenanceTicket.update({
            where: { id: ticketId },
            data: { status },
            include: { property: true }
        });

        // Security check: Ensure landlord owns the property
        if (ticket.property.ownerId !== (session.user as any).id) {
            throw new Error("Unauthorized");
        }

        revalidatePath("/dashboard/landlord");
        revalidatePath("/dashboard/tenant");

        return { success: true };
    } catch (error) {
        console.error("Failed to update ticket:", error);
        return { success: false, error: "Failed to update ticket" };
    }
}

export async function createMaintenanceTicket(data: {
    title: string;
    description: string;
    priority: any;
    category: string;
    propertyId: string;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    try {
        const ticket = await prisma.maintenanceTicket.create({
            data: {
                ...data,
                tenantId: (session.user as any).id,
            }
        });

        revalidatePath("/dashboard/tenant");
        return { success: true, ticketId: ticket.id };
    } catch (error) {
        console.error("Failed to create ticket:", error);
        return { success: false, error: "Failed to create ticket" };
    }
}

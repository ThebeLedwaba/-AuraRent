import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MessageService } from "@/services/message.service";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const conversations = await MessageService.getConversations(userId);
        return NextResponse.json(conversations);
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

        const { participantIds, propertyId } = await request.json();
        // Include the current user in participants
        const allParticipantIds = Array.from(new Set([...participantIds, (session.user as any).id]));

        const conversation = await MessageService.createConversation(allParticipantIds, propertyId);
        return NextResponse.json(conversation, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

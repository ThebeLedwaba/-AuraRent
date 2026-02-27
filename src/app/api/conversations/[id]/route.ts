import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MessageService } from "@/services/message.service";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify access first
        const conversation = await MessageService.getConversation(params.id, (session.user as any).id);
        if (!conversation) {
            return NextResponse.json({ error: "Access denied or not found" }, { status: 404 });
        }

        const messages = await MessageService.getConversationMessages(params.id);
        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { text } = await request.json();

        // Verify access first
        const conversation = await MessageService.getConversation(params.id, (session.user as any).id);
        if (!conversation) {
            return NextResponse.json({ error: "Access denied or not found" }, { status: 404 });
        }

        const message = await MessageService.sendMessage(params.id, (session.user as any).id, text);

        // Notify the other participant
        const participants = conversation.participants;
        const receiver = participants.find(p => p.id !== (session.user as any).id);

        if (receiver) {
            const { NotificationService } = require("@/services/notification.service");
            await NotificationService.createNotification({
                userId: receiver.id,
                type: "NEW_MESSAGE",
                message: `New message from ${session.user.name || "User"}`,
                link: `/dashboard/messages?conversationId=${params.id}`
            });
        }

        return NextResponse.json(message);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

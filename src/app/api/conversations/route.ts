import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MessageService } from "@/services/message.service";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { receiverId, propertyId } = await request.json();

        if (!receiverId) {
            return NextResponse.json({ error: "Receiver ID required" }, { status: 400 });
        }

        const conversation = await MessageService.startConversation(
            (session.user as any).id,
            receiverId,
            propertyId
        );

        return NextResponse.json(conversation);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const conversations = await MessageService.getUserConversations((session.user as any).id);
        return NextResponse.json(conversations);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

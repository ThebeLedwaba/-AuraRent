import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export const MessageService = {
    async createConversation(participantIds: string[], propertyId?: string) {
        return prisma.conversation.create({
            data: {
                participants: {
                    connect: participantIds.map(id => ({ id })),
                },
                propertyId,
            },
            include: {
                participants: true,
            },
        });
    },

    async getConversations(userId: string) {
        return prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: userId },
                },
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    },

    async sendMessage(conversationId: string, senderId: string, text: string) {
        const message = await prisma.message.create({
            data: {
                text,
                conversationId,
                senderId,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        // Trigger Pusher event for real-time delivery
        await pusherServer.trigger(conversationId, "new-message", message);

        return message;
    },

    async getMessages(conversationId: string) {
        return prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });
    },
};

import prisma from "@/lib/prisma";

export const MessageService = {
    async startConversation(senderId: string, receiverId: string, propertyId?: string) {
        // Check if conversation already exists between these two users for this property
        const existing = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: senderId } } },
                    { participants: { some: { id: receiverId } } },
                    { propertyId: propertyId || undefined }
                ]
            },
            include: {
                participants: {
                    select: { id: true, name: true, image: true }
                }
            }
        });

        if (existing) return existing;

        return prisma.conversation.create({
            data: {
                participants: {
                    connect: [{ id: senderId }, { id: receiverId }]
                },
                propertyId
            },
            include: {
                participants: {
                    select: { id: true, name: true, image: true }
                }
            }
        });
    },

    async sendMessage(conversationId: string, senderId: string, text: string) {
        return prisma.message.create({
            data: {
                conversationId,
                senderId,
                text
            },
            include: {
                sender: {
                    select: { id: true, name: true, image: true }
                }
            }
        });
    },

    async getUserConversations(userId: string) {
        return prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: userId }
                }
            },
            include: {
                participants: {
                    select: { id: true, name: true, image: true }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
    },

    async getConversationMessages(conversationId: string) {
        return prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: {
                    select: { id: true, name: true, image: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });
    },

    async getConversation(conversationId: string, userId: string) {
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: {
                    select: { id: true, name: true, image: true }
                }
            }
        });

        // Verify participation
        if (!conversation || !conversation.participants.some(p => p.id === userId)) {
            return null;
        }

        return conversation;
    }
};

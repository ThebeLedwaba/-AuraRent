import prisma from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

export const NotificationService = {
    async createNotification(data: {
        userId: string;
        type: NotificationType;
        message: string;
        link?: string;
    }) {
        // 1. Create In-App Notification
        const notification = await prisma.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                message: data.message,
                link: data.link,
            },
        });

        // 2. "Send" Email (Mock)
        // In a real app, we would use Resend or SendGrid here.
        // await sendEmail(user.email, subject, body);
        console.log(`[EMAIL MOCK] To User ${data.userId}: ${data.message}`);

        return notification;
    },

    async getUserNotifications(userId: string) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    },

    async markAsRead(notificationId: string) {
        return prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    },

    async markAllAsRead(userId: string) {
        return prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    },

    // Mock Email Sender
    async sendEmail(to: string, subject: string, html: string) {
        console.log("---------------------------------------------------");
        console.log(`📨 SENDING EMAIL TO: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log("---------------------------------------------------");
    }
};

import prisma from "@/lib/prisma";

export const VerificationService = {
    async verifyUser(userId: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { isVerified: true, verificationToken: null }
        });
    },

    async requestVerification(userId: string) {
        const token = Math.random().toString(36).substring(7);
        return prisma.user.update({
            where: { id: userId },
            data: { verificationToken: token }
        });
    }
};

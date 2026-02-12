import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const UserService = {
    async registerUser(data: any) {
        const { email, password, name, role } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || "TENANT",
            },
        });

        return user;
    },

    async getUserProfile(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
            },
        });
    },

    async updateUserProfile(userId: string, data: any) {
        return prisma.user.update({
            where: { id: userId },
            data,
        });
    },
};

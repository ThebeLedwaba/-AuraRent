import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("[AUTH DEBUG] Attempting login for email:", credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.log("[AUTH DEBUG] Missing email or password");
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findFirst({
                    where: {
                        email: {
                            equals: credentials.email,
                            mode: 'insensitive'
                        }
                    },
                });

                if (!user) {
                    console.log("[AUTH DEBUG] User not found in DB (tried case-insensitive)");
                    throw new Error("User not found");
                }

                if (!user.password) {
                    console.log("[AUTH DEBUG] User has no password set");
                    throw new Error("User not found");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                console.log("[AUTH DEBUG] Password validation result:", isValid);

                if (!isValid) {
                    console.log("[AUTH DEBUG] Invalid password attempt");
                    throw new Error("Invalid password");
                }

                console.log("[AUTH DEBUG] Login successful for user:", user.email);

                // Return a clean object for JWT serialization
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                } as any;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
    },
};

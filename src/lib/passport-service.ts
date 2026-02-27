import prisma from "./prisma";

export interface PassportMetrics {
    score: number;
    tier: string;
    verifications: {
        identity: boolean;
        employment: boolean;
        payments: string;
    };
}

/**
 * Service to calculate and manage the Digital Rent Passport.
 * Score is derived from verification status and rental history (bookings).
 */
export const PassportService = {
    async getUserPassport(userId: string): Promise<PassportMetrics> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                bookings: {
                    where: { status: "COMPLETED" }
                }
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Base score from verifications
        let score = 500;
        if (user.isVerified) score += 100;
        if (user.identityVerified) score += 100;
        if (user.employmentVerified) score += 100;

        // Bonus for completed bookings (history)
        const completedBookings = user.bookings.length;
        score += (completedBookings * 20); // 20 points per completed rental

        // Cap score at 850
        score = Math.min(score, 850);

        let tier = "Bronze";
        if (score >= 700) tier = "Silver";
        if (score >= 800) tier = "Gold";

        return {
            score,
            tier,
            verifications: {
                identity: user.identityVerified,
                employment: user.employmentVerified,
                payments: completedBookings > 0 ? "100% On-time" : "No history yet"
            }
        };
    }
};

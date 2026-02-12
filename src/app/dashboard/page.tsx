"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DashboardSwitcher() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            const role = (session?.user as any)?.role;
            if (role === "ADMIN") {
                router.push("/dashboard/admin");
            } else if (role === "LANDLORD") {
                router.push("/dashboard/landlord");
            } else {
                router.push("/dashboard/tenant");
            }
        }
    }, [status, session, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react"; // MessageSquare icon
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function ContactHostButton({ hostId, propertyId }: { hostId: string, propertyId: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleContact = async () => {
        if (!session) {
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: hostId,
                    propertyId: propertyId
                })
            });

            if (res.ok) {
                // Redirect to inbox
                router.push("/dashboard/messages");
            } else {
                const data = await res.json();
                alert(`Failed to start chat: ${data.error}`);
            }
        } catch (error) {
            console.error("Error starting chat", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="outline" className="w-full gap-2" onClick={handleContact} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
            Contact Host
        </Button>
    );
}

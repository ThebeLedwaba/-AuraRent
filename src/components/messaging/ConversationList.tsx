"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface Conversation {
    id: string;
    updatedAt: string;
    participants: {
        id: string;
        name: string | null;
        image: string | null;
    }[];
    messages: {
        text: string;
        createdAt: string;
    }[];
}

export function ConversationList({ onSelect, selectedId }: { onSelect: (id: string) => void, selectedId?: string }) {
    const { data: session } = useSession();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch("/api/conversations");
                if (res.ok) {
                    const data = await res.json();
                    setConversations(data);
                }
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
        // Optional: Polling every 10s
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="p-4 text-center text-muted-foreground">Loading chats...</div>;
    }

    if (conversations.length === 0) {
        return <div className="p-4 text-center text-muted-foreground">No messages yet.</div>;
    }

    return (
        <div className="space-y-1 overflow-y-auto h-full">
            {conversations.map((conv) => {
                // Find the *other* participant
                const other = conv.participants.find(p => p.id !== (session?.user as any)?.id) || conv.participants[0];
                const lastMessage = conv.messages[0];

                return (
                    <div
                        key={conv.id}
                        onClick={() => onSelect(conv.id)}
                        className={cn(
                            "p-4 cursor-pointer hover:bg-muted/50 transition-colors flex items-center gap-4 border-b last:border-0",
                            selectedId === conv.id ? "bg-muted" : ""
                        )}
                    >
                        <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                            {other.image ? (
                                <img src={other.image} alt={other.name || "User"} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                                    <User size={20} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-semibold text-sm truncate">{other.name || "User"}</h4>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(conv.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                                {lastMessage ? lastMessage.text : "Started a conversation"}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

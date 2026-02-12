"use client";

import { useEffect, useState } from "react";
import { MessageSquare, User as UserIcon } from "lucide-react";

interface Conversation {
    id: string;
    participants: {
        id: string;
        name: string;
        image: string;
    }[];
    messages: {
        text: string;
        createdAt: string;
    }[];
}

interface ConversationListProps {
    onSelect: (id: string) => void;
    currentUserId: string;
    selectedId?: string;
}

export default function ConversationList({ onSelect, currentUserId, selectedId }: ConversationListProps) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch("/api/conversations");
                const data = await res.json();
                setConversations(data);
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    return (
        <div className="glass-morphism rounded-3xl overflow-hidden h-[600px] border border-border/40 flex flex-col shadow-xl">
            <div className="p-6 border-b border-border/40 bg-white/5 items-center flex justify-between">
                <h2 className="text-xl font-bold flex items-center">
                    <MessageSquare className="w-5 h-5 mr-3 text-primary" />
                    Messages
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-8 text-center text-slate-500 animate-pulse">Loading chats...</div>
                ) : conversations.length > 0 ? (
                    conversations.map((chat) => {
                        const otherUser = chat.participants.find((p) => p.id !== currentUserId);
                        const lastMessage = chat.messages[0];

                        return (
                            <button
                                key={chat.id}
                                onClick={() => onSelect(chat.id)}
                                className={`w-full p-4 flex items-center border-b border-border/20 transition-all hover:bg-white/5 ${selectedId === chat.id ? "bg-white/10 border-l-4 border-l-primary" : ""
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center mr-4 border border-border/40">
                                    {otherUser?.image ? (
                                        <img src={otherUser.image} alt={otherUser.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="text-slate-500 w-6 h-6" />
                                    )}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold truncate text-sm">{otherUser?.name || "Anonymous User"}</span>
                                        {lastMessage && (
                                            <span className="text-[10px] text-slate-500 shrink-0">
                                                {new Date(lastMessage.createdAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 truncate">
                                        {lastMessage?.text || "No messages yet"}
                                    </p>
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <div className="p-8 text-center text-slate-500 mt-12">
                        No conversations yet.
                    </div>
                )}
            </div>
        </div>
    );
}

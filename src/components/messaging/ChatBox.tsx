"use client";

import { useEffect, useState, useRef } from "react";
import { pusherClient } from "@/lib/pusher";
import { Send, User as UserIcon } from "lucide-react";

interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: string;
    sender: {
        name: string;
        image: string;
    };
}

interface ChatBoxProps {
    conversationId: string;
    currentUserId: string;
}

export default function ChatBox({ conversationId, currentUserId }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch initial messages
        const fetchMessages = async () => {
            const res = await fetch(`/api/conversations/${conversationId}/messages`);
            const data = await res.json();
            setMessages(data);
        };

        fetchMessages();

        // Subscribe to Pusher channel
        const channel = pusherClient.subscribe(conversationId);
        channel.bind("new-message", (newMessage: Message) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            pusherClient.unsubscribe(conversationId);
        };
    }, [conversationId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const res = await fetch(`/api/conversations/${conversationId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: inputText }),
        });

        if (res.ok) {
            setInputText("");
        }
    };

    return (
        <div className="flex flex-col h-[600px] glass-morphism rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-border/40 bg-white/5 flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <UserIcon className="text-primary w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Conversation</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[70%] p-4 rounded-2xl ${msg.senderId === currentUserId
                                    ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20"
                                    : "glass-morphism rounded-tl-none border border-border/40"
                                }`}
                        >
                            <p className="text-sm">{msg.text}</p>
                            <span className="text-[10px] opacity-60 mt-2 block">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            <div className="p-4 border-t border-border/40 bg-white/5 flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-800/50 border border-border/40 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors text-sm"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                    onClick={handleSendMessage}
                    className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

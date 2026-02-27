"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    text: string;
    createdAt: string;
    senderId: string;
    sender: {
        name: string | null;
        image: string | null;
    };
}

export function ChatWindow({ conversationId }: { conversationId: string | null }) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (!conversationId) return;

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/conversations/${conversationId}`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                    setTimeout(scrollToBottom, 100);
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        // Polling for new messages
        const interval = setInterval(() => {
            fetch(`/api/conversations/${conversationId}`)
                .then(res => res.json())
                .then(data => {
                    // Simple check if new messages exist (length comparison)
                    setMessages(prev => {
                        if (data.length !== prev.length) {
                            setTimeout(scrollToBottom, 100);
                            return data;
                        }
                        return prev;
                    });
                })
                .catch(err => console.error(err));
        }, 3000); // 3 seconds polling

        return () => clearInterval(interval);
    }, [conversationId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !conversationId) return;

        const tempId = Date.now().toString();
        const optimisticMessage: Message = {
            id: tempId,
            text: input,
            createdAt: new Date().toISOString(),
            senderId: (session?.user as any).id,
            sender: {
                name: session?.user?.name || "Me",
                image: session?.user?.image || null
            }
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setInput("");
        setTimeout(scrollToBottom, 50);

        try {
            const res = await fetch(`/api/conversations/${conversationId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: optimisticMessage.text })
            });

            if (!res.ok) {
                console.error("Failed to send");
                // Remove optimistic message or show error? For now, we rely on polling to sync correct state eventually or just let it be.
            }
        } catch (error) {
            console.error("Failed to send", error);
        }
    };

    if (!conversationId) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a conversation to start chatting
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === (session?.user as any)?.id;
                    return (
                        <div key={msg.id} className={cn("flex w-full mb-4", isMe ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
                            )}>
                                <p>{msg.text}</p>
                                <span className={cn("text-[10px] mt-1 block opacity-70", isMe ? "text-primary-foreground" : "text-muted-foreground")}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { ConversationList } from "@/components/messaging/ConversationList";
import { ChatWindow } from "@/components/messaging/ChatWindow";
import { Card } from "@/components/ui/card";

export default function InboxPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)]">
            <h1 className="text-3xl font-bold mb-6">Messages</h1>

            <Card className="grid grid-cols-1 md:grid-cols-3 h-[600px] overflow-hidden shadow-xl border-border/60">
                {/* Sidebar List */}
                <div className="border-r border-border md:col-span-1 flex flex-col h-full bg-muted/10">
                    <div className="p-4 border-b font-semibold bg-background/50 backdrop-blur">
                        Inbox
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ConversationList
                            onSelect={setSelectedConversationId}
                            selectedId={selectedConversationId || undefined}
                        />
                    </div>
                </div>

                {/* Chat Window */}
                <div className="md:col-span-2 h-full flex flex-col bg-background">
                    <ChatWindow conversationId={selectedConversationId} />
                </div>
            </Card>
        </div>
    );
}

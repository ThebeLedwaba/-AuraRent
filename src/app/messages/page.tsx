"use client";

import { useState } from "react";
import ConversationList from "@/components/messaging/ConversationList";
import ChatBox from "@/components/messaging/ChatBox";

// This is a placeholder for the logged-in user ID
// In a real app, you'd get this from the session/auth provider
const MOCK_USER_ID = "cm... (actual id from session)";

export default function MessagesPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <ConversationList
                        currentUserId={MOCK_USER_ID}
                        onSelect={(id) => setSelectedConversationId(id)}
                        selectedId={selectedConversationId || undefined}
                    />
                </div>

                <div className="lg:col-span-8">
                    {selectedConversationId ? (
                        <ChatBox
                            conversationId={selectedConversationId}
                            currentUserId={MOCK_USER_ID}
                        />
                    ) : (
                        <div className="h-[600px] glass-morphism rounded-3xl flex flex-col items-center justify-center text-center p-12 border border-border/40">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Your Conversations</h2>
                            <p className="text-slate-400 max-w-sm">Select a chat from the list on the left to start messaging landlords or tenants.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

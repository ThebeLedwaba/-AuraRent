"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard, MessageSquare } from "lucide-react";

export default function Header() {
    const { data: session, status } = useSession();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-border/40">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold gradient-text">
                    AuraRent
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/listings" className="text-sm font-medium hover:text-primary transition-colors">
                        Browse Properties
                    </Link>

                    {status === "authenticated" ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                                <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
                            </Link>
                            <Link href="/messages" className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                                <MessageSquare className="w-4 h-4 mr-1.5" /> Messages
                            </Link>
                            <div className="h-4 w-px bg-border/40 my-auto" />
                            <button
                                onClick={() => signOut()}
                                className="text-sm font-medium text-slate-400 hover:text-rose-400 transition-colors flex items-center"
                            >
                                <LogOut className="w-4 h-4 mr-1.5" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="px-5 py-2 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all">
                                Login
                            </Link>
                            <Link href="/register" className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

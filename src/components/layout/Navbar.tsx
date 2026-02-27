"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/layout/NotificationBell";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                AuraRent
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4">
                            <Link href="/properties" className="text-sm font-medium hover:text-primary transition-colors">
                                Browse
                            </Link>
                            {status === "authenticated" && (
                                <Link href="/dashboard/messages" className="text-sm font-medium hover:text-primary transition-colors">
                                    Messages
                                </Link>
                            )}
                            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                                About
                            </Link>
                            <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
                                Services
                            </Link>

                            {status === "authenticated" && <NotificationBell />}

                            {status === "authenticated" ? (
                                <>
                                    <Link href="/dashboard">
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => signOut()}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm">
                                            Sign up
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <Link
                            href="/properties"
                            className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setIsOpen(false)}
                        >
                            Browse Properties
                        </Link>
                        <Link
                            href="/services"
                            className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setIsOpen(false)}
                        >
                            Services
                        </Link>
                        {status === "authenticated" ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <div
                                    className="block rounded-md px-3 py-2 text-base font-medium text-destructive hover:bg-destructive/10 cursor-pointer"
                                    onClick={() => signOut()}
                                >
                                    Sign out
                                </div>
                            </>
                        ) : (
                            <div className="mt-4 flex flex-col gap-2 px-3">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full justify-center">Log in</Button>
                                </Link>
                                <Link href="/register" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full justify-center">Sign up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

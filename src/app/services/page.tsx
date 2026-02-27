import { Truck, Home, Sparkles, ShieldCheck, ArrowRight, Zap, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeliveryForm } from "@/components/services/DeliveryForm";
import Link from "next/link";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Services | AuraRent Concierge",
    description: "Beyond housing - Premium delivery, moving, and concierge services for your next home.",
};

export default function ServicesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-emerald-50/50 dark:bg-emerald-950/10 -z-10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
                </div>

                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-8">
                        <Sparkles className="h-4 w-4" />
                        <span>Introducing AuraRent Concierge</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Stress-Free <span className="text-emerald-600">Transitions</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        We don't just find you a home; we help you settle in. From professional moving to furniture delivery, our concierge services are here to help.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        {/* Services Grid */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Our Premium Services</h2>
                                <p className="text-muted-foreground">Tailored solutions for every stage of your rental journey.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ServiceCard
                                    icon={<Truck className="h-6 w-6" />}
                                    title="Professional Moving"
                                    description="Pre-vetted moving teams to handle your belongings with care."
                                    color="bg-emerald-500"
                                />
                                <ServiceCard
                                    icon={<Home className="h-6 w-6" />}
                                    title="Furniture Assembly"
                                    description="Expert setup for your new furniture so you can relax."
                                    color="bg-blue-500"
                                />
                                <ServiceCard
                                    icon={<Sparkles className="h-6 w-6" />}
                                    title="Deep Cleaning"
                                    description="Move-in ready cleaning for a fresh start in your new space."
                                    color="bg-purple-500"
                                />
                                <ServiceCard
                                    icon={<ShieldCheck className="h-6 w-6" />}
                                    title="Utility Setup"
                                    description="We coordinate Wi-Fi, electricity, and water connections for you."
                                    color="bg-amber-500"
                                />
                            </div>

                            <div className="bg-muted/50 p-8 rounded-2xl border border-dashed text-center">
                                <h3 className="font-semibold mb-2">Need something else?</h3>
                                <p className="text-sm text-muted-foreground mb-4">We offer custom concierge packages for premium listings.</p>
                                <Button variant="link" className="gap-2">
                                    Contact Support <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Delivery Form */}
                        <div className="sticky top-24">
                            <DeliveryForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 border-y bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-4">
                            <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto text-emerald-600">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold">Vetted Partners</h3>
                            <p className="text-sm text-muted-foreground">Every service provider undergoes a rigorous background check and quality review.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto text-indigo-600">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold">Fixed Pricing</h3>
                            <p className="text-sm text-muted-foreground">No hidden fees or surprise costs. Get accurate quotes before you book.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center mx-auto text-rose-600">
                                <Heart className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold">Guaranteed Care</h3>
                            <p className="text-sm text-muted-foreground">Your belongings are insured and handled by professionals who care.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function ServiceCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
    return (
        <div className="group p-6 rounded-2xl bg-white dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-sm transition-all hover:shadow-xl hover:border-emerald-500/50">
            <div className={`h-12 w-12 ${color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
}

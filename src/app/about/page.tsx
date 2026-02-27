"use client";

import { Shield, Target, Users, Heart, Zap, Award } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden gradient-bg">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
                        The Future of <span className="gradient-text">Renting</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        AuraRent is more than just a platform; it's a sanctuary for tenants and a powerhouse for landlords. We're redefining the rental experience with transparency, speed, and intelligence.
                    </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Target className="text-primary w-8 h-8" /> Our Mission
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            To create a seamless, trustworthy, and efficient rental ecosystem where finding a home is as joyful as living in one. We believe technology should remove barriers, not create them.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4 p-6 glass-morphism rounded-2xl border border-border/40">
                                <div className="bg-primary/10 p-3 rounded-xl h-fit">
                                    <Shield className="text-primary w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Trust First</h3>
                                    <p className="text-sm text-muted-foreground">Every listing is verified by our AI and community experts to ensure what you see is what you get.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-6 glass-morphism rounded-2xl border border-border/40">
                                <div className="bg-emerald-500/10 p-3 rounded-xl h-fit">
                                    <Award className="text-emerald-500 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Premium Quality</h3>
                                    <p className="text-sm text-muted-foreground">We curate only the best properties that meet our strict standards for comfort and design.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 scale-95 border-8 border-white/5">
                            <img
                                src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=1000"
                                alt="Modern Living"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-8 -left-8 glass-morphism p-8 rounded-3xl border border-white/20 shadow-2xl max-w-xs -rotate-3">
                            <h4 className="text-2xl font-bold gradient-text">98%</h4>
                            <p className="text-sm font-medium">Customer satisfaction rate across our active tenant base.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Values that <span className="text-emerald-400">Drive Us</span></h2>
                        <p className="text-slate-400">The pillars of the AuraRent experience.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ValueCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Velocity"
                            description="Wait less, live more. Our instant booking and automated verification system gets you into your home faster."
                        />
                        <ValueCard
                            icon={<Users className="w-6 h-6" />}
                            title="Empathy"
                            description="We focus on the human side of renting, ensuring both landlords and tenants feel supported at every step."
                        />
                        <ValueCard
                            icon={<Heart className="w-6 h-6" />}
                            title="Integrity"
                            description="No hidden fees, no fine print. Transparent pricing in Rands and clear communication from day one."
                        />
                    </div>
                </div>
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
            </section>

            {/* Team/CTA */}
            <section className="py-24 container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-8">Ready to find your sanctuary?</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/properties" className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-primary/20 transition-all">
                        Browse Listings
                    </a>
                    <a href="/register" className="glass-morphism border border-border/40 px-10 py-4 rounded-2xl font-bold hover:bg-accent transition-all">
                        Join Platform
                    </a>
                </div>
            </section>
        </div>
    );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
}

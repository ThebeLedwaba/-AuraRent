"use client";

import { useState } from "react";
import { Truck, Package, Calendar, Clock, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function DeliveryForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center animate-in fade-in zoom-in duration-500">
                <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 mx-auto text-emerald-600">
                    <Send className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-emerald-900 dark:text-emerald-100">Request Received!</h3>
                <p className="text-emerald-700 dark:text-emerald-300 mb-6">
                    Our delivery concierge team will contact you shortly to finalize the details and provide a quote.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="border-emerald-200">
                    Submit Another Request
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <Truck className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Request Delivery Help</h3>
                    <p className="text-sm text-muted-foreground">Moving in or need furniture delivered?</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Package className="h-4 w-4" /> Item Type
                        </label>
                        <Input placeholder="e.g. Sofa, Bed, Full Move" required className="bg-white/50 dark:bg-black/50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Preferred Date
                        </label>
                        <Input type="date" required className="bg-white/50 dark:bg-black/50" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Pickup Address
                        </label>
                        <Input placeholder="From where?" required className="bg-white/50 dark:bg-black/50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Delivery Address
                        </label>
                        <Input placeholder="To where?" required className="bg-white/50 dark:bg-black/50" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Special Instructions</label>
                    <Textarea
                        placeholder="Tell us more about the items or any access restrictions..."
                        className="min-h-[100px] bg-white/50 dark:bg-black/50"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isSubmitting ? "Sending Request..." : "Request Concierge Quote"}
                </Button>
            </form>
        </div>
    );
}

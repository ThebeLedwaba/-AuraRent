"use client";

import { useEffect, useState } from "react";
import { CreditCard, Calendar, Home, CheckCircle, Clock } from "lucide-react";

interface Booking {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    property: {
        title: string;
        city: string;
        images: string[];
    };
}

export default function RentalsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch("/api/bookings");
                const data = await res.json();
                setBookings(data);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handlePayment = async (bookingId: string) => {
        setProcessingId(bookingId);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
            });
            const { url } = await res.json();
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error("Payment failed:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PAID": return "text-emerald-400 bg-emerald-400/10";
            case "PENDING": return "text-amber-400 bg-amber-400/10";
            case "CANCELLED": return "text-rose-400 bg-rose-400/10";
            default: return "text-slate-400 bg-slate-400/10";
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-8">My <span className="gradient-text">Rentals</span></h1>

            {loading ? (
                <div className="space-y-6">
                    {[1, 2].map(n => <div key={n} className="h-48 glass-morphism rounded-3xl animate-pulse" />)}
                </div>
            ) : bookings.length > 0 ? (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="glass-morphism rounded-3xl p-6 flex flex-col md:flex-row gap-8 items-center border border-border/40 hover:border-primary/30 transition-all shadow-xl">
                            <div className="w-full md:w-64 h-40 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                                <img
                                    src={booking.property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1073"}
                                    className="w-full h-full object-cover"
                                    alt={booking.property.title}
                                />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{booking.property.title}</h3>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400 mb-4">
                                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary" /> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</div>
                                    <div className="flex items-center"><Home className="w-4 h-4 mr-2 text-primary" /> {booking.property.city}</div>
                                </div>

                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border border-current/20 ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                    <span className="text-2xl font-bold text-white">${booking.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="shrink-0">
                                {booking.status === "PENDING" ? (
                                    <button
                                        onClick={() => handlePayment(booking.id)}
                                        disabled={processingId === booking.id}
                                        className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        <CreditCard className="w-5 h-5 mr-3" />
                                        {processingId === booking.id ? "Processing..." : "Pay Now"}
                                    </button>
                                ) : booking.status === "PAID" ? (
                                    <div className="text-emerald-400 flex items-center font-bold px-6 py-3 glass-morphism rounded-2xl border border-emerald-400/20">
                                        <CheckCircle className="w-5 h-5 mr-3" />
                                        Reservation Secured
                                    </div>
                                ) : (
                                    <div className="text-slate-500 flex items-center px-6 py-3 glass-morphism rounded-2xl opacity-50">
                                        <Clock className="w-5 h-5 mr-3" />
                                        Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 glass-morphism rounded-3xl border border-border/40">
                    <h2 className="text-2xl font-bold mb-4">No rentals yet</h2>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">You haven't booked any properties yet. Start exploring our premium listings!</p>
                    <a href="/listings" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all">Explore Properties</a>
                </div>
            )}
        </div>
    );
}

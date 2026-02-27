"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInDays, eachDayOfInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export function BookingWidget({ price, propertyId }: { price: number, propertyId: string }) {
    const { data: session } = useSession();
    const router = useRouter();

    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [guests, setGuests] = useState(1);
    const [loading, setLoading] = useState(false);
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const res = await fetch(`/api/properties/${propertyId}/booked-dates`);
                if (res.ok) {
                    const ranges: { from: string, to: string }[] = await res.json();
                    const dates: Date[] = [];
                    ranges.forEach(range => {
                        const interval = eachDayOfInterval({
                            start: new Date(range.from),
                            end: new Date(range.to)
                        });
                        dates.push(...interval);
                    });
                    setDisabledDates(dates);
                }
            } catch (error) {
                console.error("Failed to fetch booked dates", error);
            }
        };
        fetchBookedDates();
    }, [propertyId]);

    const calculateTotal = () => {
        if (!dateRange?.from || !dateRange?.to) return 0;
        const diffDays = differenceInDays(dateRange.to, dateRange.from);
        return diffDays * price;
    };

    const total = calculateTotal();
    const nights = total / price || 0;

    const handleBooking = async () => {
        if (!session) {
            router.push("/login");
            return;
        }

        if (!dateRange?.from || !dateRange?.to) {
            alert("Please select check-in and check-out dates");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    propertyId,
                    startDate: dateRange.from.toISOString(),
                    endDate: dateRange.to.toISOString(),
                    totalPrice: total,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Payment Error:", data.error);
                if (data.error.includes("STRIPE_SECRET_KEY")) {
                    alert("Stripe keys missing. Simulating success...");
                    router.push("/dashboard/tenant");
                    return;
                }
                alert(`Payment failed: ${data.error}`);
                return;
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                router.push("/dashboard/tenant");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during booking.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="sticky top-24 shadow-lg border-border/60">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span className="text-2xl font-bold">R{price} <span className="text-base font-normal text-muted-foreground">/ night</span></span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Dates</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} -{" "}
                                            {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Check-in - Check-out</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                disabled={[
                                    { before: new Date() },
                                    ...disabledDates
                                ]}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Guests</label>
                    <Input
                        type="number"
                        min={1}
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>

                {nights > 0 && (
                    <div className="pt-4 border-t space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="underline">R{price} x {nights} nights</span>
                            <span>R{total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="underline">Service fee</span>
                            <span>R0</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                            <span>Total</span>
                            <span>R{total}</span>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90" onClick={handleBooking} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (session ? "Reserve" : "Login to Book")}
                </Button>
            </CardFooter>
        </Card>
    );
}

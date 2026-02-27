"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Creating a simple Textarea wrapper here since I don't have it yet
function SimpleTextarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    )
}

export function ReviewForm({ propertyId, onReviewSubmitted }: { propertyId: string, onReviewSubmitted?: () => void }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (status === "unauthenticated") {
        return (
            <Card className="bg-muted/50">
                <CardContent className="py-6 text-center">
                    <p className="text-muted-foreground mb-4">Please log in to leave a review.</p>
                    <Button variant="outline" onClick={() => router.push("/login")}>Log In</Button>
                </CardContent>
            </Card>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (rating === 0) {
            setError("Please select a rating.");
            return;
        }
        if (comment.trim().length < 10) {
            setError("Review must be at least 10 characters long.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    propertyId,
                    rating,
                    comment,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit review");
            }

            setRating(0);
            setComment("");
            router.refresh();
            if (onReviewSubmitted) onReviewSubmitted();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rating</label>
                        <StarRating rating={rating} onRatingChange={setRating} size={24} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Your Review</label>
                        <SimpleTextarea
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

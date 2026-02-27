"use client";

import { useState } from "react";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function ReviewsSection({ propertyId, initialRating, initialReviewCount }: { propertyId: string, initialRating: number, initialReviewCount: number }) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleReviewSubmitted = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <div id="reviews" className="py-8 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                {initialRating.toFixed(2)} · {initialReviewCount} reviews
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <ReviewList propertyId={propertyId} refreshTrigger={refreshTrigger} />
                </div>
                <div>
                    <div className="sticky top-24">
                        <ReviewForm propertyId={propertyId} onReviewSubmitted={handleReviewSubmitted} />
                    </div>
                </div>
            </div>
        </div>
    );
}

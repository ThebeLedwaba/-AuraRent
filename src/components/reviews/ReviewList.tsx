import { useEffect, useState } from "react";
import { StarRating } from "@/components/ui/star-rating";
import { User } from "lucide-react";

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: {
        name: string | null;
        image: string | null;
    };
}

export function ReviewList({ propertyId, refreshTrigger }: { propertyId: string, refreshTrigger: number }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/reviews?propertyId=${propertyId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [propertyId, refreshTrigger]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-muted" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-1/4 bg-muted rounded" />
                            <div className="h-4 w-full bg-muted rounded" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (reviews.length === 0) {
        return <p className="text-muted-foreground italic">No reviews yet. Be the first to review!</p>;
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                            {review.reviewer.image ? (
                                <img src={review.reviewer.image} alt={review.reviewer.name || "Reviewer"} className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-6 w-6 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{review.reviewer.name || "Anonymous"}</p>
                            <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <StarRating rating={review.rating} size={14} readonly />
                    <p className="mt-2 text-sm text-foreground leading-relaxed">{review.comment}</p>
                </div>
            ))}
        </div>
    );
}

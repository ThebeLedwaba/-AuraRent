"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
    rating: number; // Current rating (0-5)
    maxRating?: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: number;
    className?: string;
}

export function StarRating({
    rating,
    maxRating = 5,
    onRatingChange,
    readonly = false,
    size = 20,
    className,
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const displayRating = hoverRating !== null ? hoverRating : rating;

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {Array.from({ length: maxRating }).map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= Math.round(displayRating);

                return (
                    <button
                        key={index}
                        type="button"
                        disabled={readonly}
                        onClick={() => !readonly && onRatingChange?.(starValue)}
                        onMouseEnter={() => !readonly && setHoverRating(starValue)}
                        onMouseLeave={() => !readonly && setHoverRating(null)}
                        className={cn(
                            "transition-all duration-200 focus:outline-none",
                            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
                        )}
                    >
                        <Star
                            size={size}
                            className={cn(
                                "transition-colors",
                                isFilled
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-muted text-muted-foreground"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}

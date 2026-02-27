import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/properties/BookingWidget";
import { MapPin, Bed, Bath, Hash, User, Shield, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { ContactHostButton } from "@/components/property/ContactHostButton";
import { NeighborhoodInsights } from "@/components/property/NeighborhoodInsights";
import { PriceAnalysis } from "@/components/property/PriceAnalysis";

// Use 'img' for now if images are external to avoid Next.js config error, or configure domains. 
// I'll use 'img' for this iteration to be safe.

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const property = await prisma.property.findUnique({
        where: { id: id },
        include: {
            owner: {
                select: { id: true, name: true, image: true, email: true }
            }
        }
    });

    if (!property) {
        notFound();
    }

    // Calculate generic rating for MVP
    const rating = 4.85;
    const reviewCount = 24;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Title Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-muted-foreground gap-4 text-sm">
                    <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {property.address}, {property.city}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {rating.toFixed(2)} ({reviewCount} reviews)
                    </span>
                    <span>•</span>
                    <span>{property.type}</span>
                </div>
            </div>

            {/* Image Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] mb-8 rounded-xl overflow-hidden">
                <div className="col-span-2 h-full">
                    {property.images[0] ? (
                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">No Image</div>
                    )}
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-2 h-full">
                    {/* Placeholders or additional images */}
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="relative h-full overflow-hidden">
                            {property.images[i] ? (
                                <img src={property.images[i]} alt={`View ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">View {i}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Host Info */}
                    <div className="flex justify-between items-center border-b pb-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Hosted by {property.owner?.name || "Verified Host"}</h2>
                            <p className="text-muted-foreground mb-3">Joined December 2025</p>
                            <ContactHostButton hostId={property.owner?.id || ""} propertyId={property.id} />
                        </div>
                        <div className="h-14 w-14 rounded-full overflow-hidden bg-muted">
                            {property.owner?.image ? (
                                <img src={property.owner.image} alt={property.owner.name || "Host"} className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-8 w-8 m-3 text-muted-foreground" />
                            )}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                        <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
                            <Bed className="h-5 w-5 text-indigo-500" />
                            <div>
                                <p className="font-semibold text-sm">{property.bedrooms} Bedrooms</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
                            <Bath className="h-5 w-5 text-indigo-500" />
                            <div>
                                <p className="font-semibold text-sm">{property.bathrooms} Bathrooms</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
                            <Hash className="h-5 w-5 text-indigo-500" />
                            <div>
                                <p className="font-semibold text-sm">{property.area || 0} m²</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-b pb-6">
                        <h3 className="text-xl font-semibold mb-4">About this place</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {property.description}
                        </p>
                    </div>

                    {/* Amenities */}
                    <div className="border-b pb-6">
                        <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {property.amenities.map((amenity, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                                    <Shield className="h-4 w-4 text-emerald-500" />
                                    <span>{amenity}</span>
                                </div>
                            ))}
                            {property.amenities.length === 0 && <p className="text-muted-foreground italic">No specific amenities listed.</p>}
                        </div>
                    </div>

                    {/* Neighborhood Insights */}
                    <div className="pt-8 border-t">
                        <NeighborhoodInsights address={property.address} city={property.city} />
                    </div>

                    {/* Reviews Section */}
                    <ReviewsSection propertyId={property.id} initialRating={rating} initialReviewCount={reviewCount} />
                </div>

                {/* Sidebar Booking */}
                <div className="space-y-6">
                    <BookingWidget price={property.price} propertyId={property.id} />
                    <PriceAnalysis currentPrice={property.price} city={property.city} />
                </div>
            </div>
        </div>
    );
}

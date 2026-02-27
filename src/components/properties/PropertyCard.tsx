import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, User, MapPin, Star, Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define a type for the property prop, loosely based on Prisma model but adapted for UI
interface PropertyCardProps {
    property: {
        id: string;
        title: string;
        price: number;
        address: string;
        city: string;
        images: string[];
        bedrooms: number;
        bathrooms: number;
        area?: number | null;
        type: string;
        rating?: number; // Optional, maybe calculated or from relations
        owner?: {
            name: string | null;
            image: string | null;
        }
    };
    className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
    return (
        <Card className={cn("overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow duration-300", className)}>
            <div className="relative aspect-[4/3] overflow-hidden">
                {property.images && property.images.length > 0 ? (
                    <img // Using img for now as Image requires hostname config
                        src={property.images[0]}
                        alt={property.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full opacity-80 hover:opacity-100">
                        <Heart className="h-4 w-4" />
                    </Button>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider">
                    {property.type}
                </div>
            </div>

            <CardContent className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-2xl font-bold text-primary">
                        R{property.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </div>
                    {property.rating && (
                        <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span>{property.rating}</span>
                        </div>
                    )}
                </div>

                <Link href={`/properties/${property.id}`} className="hover:underline">
                    <h3 className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">{property.title}</h3>
                </Link>

                <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="line-clamp-1">{property.address}, {property.city}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms} Baths</span>
                    </div>
                    {property.area && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {/* Should be Square or Scaling? Using MapPin as placeholder for Area icon or just text */}
                            <span>{property.area} m²</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 border-t bg-muted/20 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 pt-4">
                    {property.owner?.image ? (
                        <img src={property.owner.image} alt={property.owner.name || "Owner"} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    <span className="text-sm font-medium text-muted-foreground">{property.owner?.name || "Verified Host"}</span>
                </div>
                <div className="pt-4">
                    <Link href={`/properties/${property.id}`}>
                        <Button variant="outline" size="sm">Details</Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}

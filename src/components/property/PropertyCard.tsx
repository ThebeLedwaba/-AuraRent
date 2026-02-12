import Link from "next/link";
import { MapPin, Bed, Bath, Triangle } from "lucide-react";

interface PropertyCardProps {
    property: {
        id: string;
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        type: string;
        bedrooms: number;
        bathrooms: number;
        area?: number;
        images: string[];
    };
}

export default function PropertyCard({ property }: PropertyCardProps) {
    return (
        <Link href={`/properties/${property.id}`} className="block group">
            <div className="glass-morphism rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1073"}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {property.type}
                    </div>
                    <div className="absolute bottom-4 left-4 text-white font-bold text-xl drop-shadow-md">
                        ${property.price.toLocaleString()}<span className="text-sm font-normal">/mo</span>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors">
                        {property.title}
                    </h3>
                    <div className="flex items-center text-slate-400 text-sm mt-2 mb-4">
                        <MapPin className="w-4 h-4 mr-1 text-primary" />
                        {property.city}, {property.address}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/40 text-slate-400 text-sm">
                        <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-2 text-primary" />
                            <span>{property.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-2 text-primary" />
                            <span>{property.bathrooms} Baths</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

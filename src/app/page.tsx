import Link from "next/link";
import { Search, MapPin, Calendar, ArrowRight, Shield, Zap, Heart, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { HomeSearch } from "@/components/home/HomeSearch";
import prisma from "@/lib/prisma";

async function getFeaturedProperties() {
  try {
    const properties = await prisma.property.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: { name: true, image: true }
        }
      }
    });
    return properties;
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return [];
  }
}

export default async function Home() {
  const featuredProperties = await getFeaturedProperties();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-black text-white">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-e32870110294?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-60"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Find Your Perfect <span className="text-emerald-400">Sanctuary</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Discover a curated collection of premium rental properties. From modern city lofts to serene countryside villas.
          </p>

          {/* Search Bar */}
          <HomeSearch />
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Listings</h2>
              <p className="text-muted-foreground">Hand-picked properties for your lifestyle.</p>
            </div>
            <Link href="/properties">
              <Button variant="ghost" className="gap-2 text-emerald-600 hover:text-emerald-700">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg border border-dashed">
              <h3 className="text-xl font-medium text-muted-foreground">No properties found</h3>
              <p className="text-sm text-muted-foreground mt-2">Check back later for new listings.</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits / How it Works */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose AuraRent?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 text-emerald-600">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Verified</h3>
              <p className="text-muted-foreground">Every property and landlord is verified for your peace of mind.</p>
            </div>

            <div className="flex flex-col items-center p-6">
              <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Booking</h3>
              <p className="text-muted-foreground">Book your stay instantly without waiting for approval on select listings.</p>
            </div>

            <div className="flex flex-col items-center p-6">
              <div className="h-16 w-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6 text-rose-600">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Best Rates Guaranteed</h3>
              <p className="text-muted-foreground">We match prices so you always get the best deal on the market.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beyond Housing Section */}
      <section className="py-24 bg-muted/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 -skew-x-12 translate-x-1/2" />

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
                <Truck className="h-4 w-4" />
                <span>AuraRent Concierge</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                More Than Just a <span className="text-emerald-600">Rental Market</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Moving should be the start of an adventure, not a logistical nightmare. Our premium concierge services help you with moving, delivery, and setting up your new sanctuary.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  </div>
                  <span>Professional moving & packing help</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  </div>
                  <span>Furniture delivery & expert assembly</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  </div>
                  <span>Utilities & Wi-Fi setup assistance</span>
                </li>
              </ul>

              <Link href="/services">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-12 px-8">
                  Explore Concierge Services <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-3 transition-transform hover:rotate-0 duration-700">
                <img
                  src="https://images.unsplash.com/photo-1600518464441-9154a4dba246?auto=format&fit=crop&q=80&w=1200"
                  alt="Modern Interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl border border-border flex items-center gap-4 animate-bounce-subtle">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">Delivery Quote</p>
                  <p className="text-xs text-muted-foreground">Ready in 5 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-emerald-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
                <div className="flex gap-1 justify-center mb-4 text-amber-400">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mb-6 italic text-gray-200">"AuraRent made finding my new apartment completely stress-free. The virtual tours are a game changer!"</p>
                <div className="font-semibold">- Sarah Jenkins, Tenant</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

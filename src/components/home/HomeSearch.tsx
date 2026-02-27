"use client";

import { MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HomeSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/properties?location=${encodeURIComponent(query)}`);
        } else {
            router.push("/properties");
        }
    };

    return (
        <div className="bg-white p-2 rounded-lg shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                    placeholder="Where do you want to go?"
                    className="pl-10 h-12 border-none focus-visible:ring-0 text-black placeholder:text-gray-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
            </div>
            <div className="hidden md:block w-px bg-gray-200 my-2" />
            <div className="relative flex-grow md:max-w-[200px]">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                    placeholder="Move-in Date"
                    className="pl-10 h-12 border-none focus-visible:ring-0 text-black placeholder:text-gray-500"
                    type="text"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                />
            </div>
            <Button
                onClick={handleSearch}
                className="h-12 px-8 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
                Search
            </Button>
        </div>
    );
}

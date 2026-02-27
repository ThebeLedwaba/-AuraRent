"use client";

import { TrendingUp, TrendingDown, Info, BarChart3, Target } from "lucide-react";

interface PriceAnalysisProps {
    currentPrice: number;
    city: string;
}

export function PriceAnalysis({ currentPrice, city }: PriceAnalysisProps) {
    // Mock logic - in a real app, this would calculate based on other listings in the same city/neighborhood
    const cityAverage = 1850; // Mock average for the city
    const difference = ((currentPrice - cityAverage) / cityAverage) * 100;
    const isAboveAverage = difference > 0;

    return (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-6 rounded-2xl shadow-xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-bold">Market Analysis</h3>
                </div>
                <div className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-400/30">
                    AI Powered
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-sm text-zinc-400">Monthly Rent</p>
                        <p className="text-2xl font-bold">R {currentPrice.toLocaleString()}</p>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${isAboveAverage ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(Math.max((currentPrice / (cityAverage * 1.5)) * 100, 20), 100)}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className={`p-3 rounded-lg ${isAboveAverage ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {isAboveAverage ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    </div>
                    <div>
                        <p className="text-sm font-semibold">
                            {Math.abs(difference).toFixed(1)}% {isAboveAverage ? 'above' : 'below'} average
                        </p>
                        <p className="text-xs text-zinc-400">Average in {city}: R {cityAverage.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex gap-2 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <Target className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-100/80 leading-relaxed">
                        This property is priced competitively for its size and location in {city}.
                    </p>
                </div>
            </div>
        </div>
    );
}

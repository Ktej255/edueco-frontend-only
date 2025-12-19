"use client";

import React, { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { upanishads } from "@/components/batch2/upanishads-data";
import { ISHA_UPANISHAD, ISHA_METADATA } from "@/components/batch2/upanishads/data/isha-shlokas";
import ShlokaCard from "@/components/batch2/upanishads/ShlokaCard";
import KenaLayout from "@/components/batch2/upanishads/KenaLayout";
import IshaLayout from "@/components/batch2/upanishads/IshaLayout";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Home, List, Layers } from "lucide-react";

export default function UpanishadDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.slug as string;
    const [currentShlokaIndex, setCurrentShlokaIndex] = useState(0);
    const [viewMode, setViewMode] = useState<"stream" | "single">("single");

    // Route to dedicated layouts for specific Upanishads
    if (id === "kena") {
        return <KenaLayout />;
    }
    if (id === "isa") {
        return <IshaLayout />;
    }

    const upanishad = upanishads.find((u) => u.id === id);

    // Get content based on ID
    const content = id === "isa" ? ISHA_UPANISHAD : [];
    const metadata = id === "isa" ? ISHA_METADATA : null;

    const handleNext = useCallback(() => {
        if (currentShlokaIndex < content.length - 1) {
            setCurrentShlokaIndex(prev => prev + 1);
        }
    }, [currentShlokaIndex, content.length]);

    const handlePrev = useCallback(() => {
        if (currentShlokaIndex > 0) {
            setCurrentShlokaIndex(prev => prev - 1);
        }
    }, [currentShlokaIndex]);

    if (!upanishad) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#E0C097]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Upanishad Not Found</h1>
                    <button onClick={() => router.back()} className="text-[#C4A35A] hover:underline">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-[#E0C097] font-sans selection:bg-[#E0C097] selection:text-black pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-[#333]">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/student/batch2/upanishads")}
                                className="p-2 rounded-full bg-amber-900/30 hover:bg-amber-900/50 transition-all"
                            >
                                <Home className="w-4 h-4 text-amber-200" />
                            </button>
                            <div>
                                <span className="text-[#C4A35A] text-xs font-bold tracking-widest uppercase">
                                    {upanishad.veda}
                                </span>
                                <h1 className="text-xl font-bold text-white">
                                    {metadata?.nameSanskrit || upanishad.name} Upaniṣad
                                </h1>
                            </div>
                        </div>

                        {/* View Mode Toggle & Simplified Link */}
                        <div className="flex items-center gap-3">
                            {/* Simplified View Link (only for Isha) */}
                            {id === "isa" && (
                                <a
                                    href="/student/batch2/upanishads/isa/simplified"
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-600/30 to-orange-600/30 hover:from-amber-600/50 hover:to-orange-600/50 rounded-full text-amber-200 text-sm font-medium transition-all border border-amber-500/30"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Simplified
                                </a>
                            )}

                            <button
                                onClick={() => setViewMode("single")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "single" ? "bg-amber-600/50 text-white" : "bg-amber-900/20 text-amber-400"}`}
                            >
                                <Layers className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("stream")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "stream" ? "bg-amber-600/50 text-white" : "bg-amber-900/20 text-amber-400"}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                {content.length > 0 ? (
                    viewMode === "single" ? (
                        /* Single Shloka View */
                        <ShlokaCard
                            shloka={content[currentShlokaIndex]}
                            totalShlokas={content.length}
                            onNext={handleNext}
                            onPrev={handlePrev}
                            themeColor={metadata?.visualTheme?.primary}
                        />
                    ) : (
                        /* Stream View - All Shlokas */
                        <div className="space-y-12">
                            {content.map((shloka) => (
                                <div key={shloka.number} className="border-b border-amber-900/30 pb-12">
                                    <ShlokaCard
                                        shloka={shloka}
                                        totalShlokas={content.length}
                                        onNext={() => { }}
                                        onPrev={() => { }}
                                        themeColor={metadata?.visualTheme?.primary}
                                    />
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    /* Coming Soon */
                    <div className="flex flex-col items-center justify-center py-20 bg-[#0D0D0D] rounded-xl border border-[#222]">
                        <div className="w-16 h-16 rounded-full bg-[#1a140a] flex items-center justify-center mb-6">
                            <BookOpen className="w-8 h-8 text-[#C4A35A]" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Content Coming Soon</h2>
                        <p className="text-[#888] max-w-md text-center">
                            The verses for {upanishad.name} Upanishad are currently being digitized with word-by-word meanings.
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Navigation (Single View) */}
            {content.length > 0 && viewMode === "single" && (
                <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-[#333] py-4">
                    <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                        <button
                            onClick={handlePrev}
                            disabled={currentShlokaIndex === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-900/30 rounded-full disabled:opacity-30 hover:bg-amber-900/50 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </button>

                        {/* Progress Dots */}
                        <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                            {content.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentShlokaIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${i === currentShlokaIndex ? "bg-amber-400 w-6" : "bg-amber-900/50 hover:bg-amber-700/50"}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={currentShlokaIndex === content.length - 1}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-900/30 rounded-full disabled:opacity-30 hover:bg-amber-900/50 transition-all"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

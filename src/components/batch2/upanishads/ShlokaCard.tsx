"use client";

import React, { useState } from "react";
import { Shloka, WordMeaning } from "./data/isha-shlokas";
import { getShlokaImage } from "./data/isha-images";
import { ChevronLeft, ChevronRight, BookOpen, Languages, Image as ImageIcon, Sparkles, ZoomIn } from "lucide-react";
import Image from "next/image";

interface ShlokaCardProps {
    shloka: Shloka;
    totalShlokas: number;
    onNext: () => void;
    onPrev: () => void;
    themeColor?: string;
}

export default function ShlokaCard({ shloka, totalShlokas, onNext, onPrev, themeColor = "#C4A35A" }: ShlokaCardProps) {
    const [showWordMeanings, setShowWordMeanings] = useState(true);
    const [imageExpanded, setImageExpanded] = useState(false);

    // Get pre-generated image for this shloka
    const shlokaImage = getShlokaImage(shloka.number);

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* Shloka Number & Theme */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                        style={{ background: themeColor }}
                    >
                        {shloka.number}
                    </span>
                    <div>
                        <h3 className="text-lg font-semibold text-amber-100">Mantra {shloka.number} of {totalShlokas}</h3>
                        <p className="text-sm text-amber-400/70">{shloka.theme}</p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                    <button
                        onClick={onPrev}
                        disabled={shloka.number === 1}
                        className="p-2 rounded-full bg-amber-900/30 hover:bg-amber-900/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-amber-200" />
                    </button>
                    <button
                        onClick={onNext}
                        disabled={shloka.number === totalShlokas}
                        className="p-2 rounded-full bg-amber-900/30 hover:bg-amber-900/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-amber-200" />
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Text Content */}
                <div className="space-y-6">
                    {/* Sanskrit Devanagari */}
                    <div className="bg-gradient-to-br from-amber-950/80 to-amber-900/40 rounded-2xl p-6 border border-amber-700/30">
                        <div className="flex items-center gap-2 text-amber-400 text-sm mb-4">
                            <BookOpen className="w-4 h-4" />
                            <span>Sanskrit (Devanagari)</span>
                        </div>
                        <p className="text-2xl leading-relaxed text-amber-100 font-serif whitespace-pre-line" style={{ fontFamily: "'Noto Sans Devanagari', serif" }}>
                            {shloka.devanagari}
                        </p>
                    </div>

                    {/* Transliteration */}
                    <div className="bg-amber-950/40 rounded-xl p-4 border border-amber-800/20">
                        <p className="text-amber-200/80 italic leading-relaxed whitespace-pre-line">
                            {shloka.transliteration}
                        </p>
                    </div>

                    {/* Word Meanings Toggle */}
                    <button
                        onClick={() => setShowWordMeanings(!showWordMeanings)}
                        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm transition-colors"
                    >
                        <Languages className="w-4 h-4" />
                        {showWordMeanings ? "Hide" : "Show"} Word-by-Word Meaning
                    </button>

                    {/* Word Meanings Grid */}
                    {showWordMeanings && (
                        <div className="bg-amber-950/30 rounded-xl p-4 border border-amber-800/20">
                            <div className="grid grid-cols-1 gap-2">
                                {shloka.wordMeanings.map((word, i) => (
                                    <div key={i} className="flex items-center gap-4 py-2 border-b border-amber-900/30 last:border-0">
                                        <span className="text-lg text-amber-200 font-medium min-w-[80px]" style={{ fontFamily: "'Noto Sans Devanagari', serif" }}>
                                            {word.devanagari}
                                        </span>
                                        <span className="text-amber-400/60 text-sm min-w-[80px]">
                                            {word.sanskrit}
                                        </span>
                                        <span className="text-amber-100 text-sm flex-1">
                                            {word.hindi}
                                        </span>
                                        <span className="text-amber-300/70 text-sm flex-1">
                                            {word.english}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Meaning & Visual */}
                <div className="space-y-6">
                    {/* Hindi Meaning */}
                    <div className="bg-gradient-to-br from-orange-950/60 to-amber-900/30 rounded-2xl p-6 border border-orange-700/30">
                        <div className="flex items-center gap-2 text-orange-400 text-sm mb-3">
                            <span className="font-semibold">हिन्दी अर्थ</span>
                        </div>
                        <p className="text-lg text-orange-100 leading-relaxed" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                            {shloka.meaningHindi}
                        </p>
                    </div>

                    {/* English Meaning */}
                    <div className="bg-gradient-to-br from-blue-950/40 to-indigo-900/20 rounded-2xl p-6 border border-blue-700/30">
                        <div className="flex items-center gap-2 text-blue-400 text-sm mb-3">
                            <span className="font-semibold">English Meaning</span>
                        </div>
                        <p className="text-lg text-blue-100 leading-relaxed">
                            {shloka.meaningEnglish}
                        </p>
                    </div>

                    {/* Visual - AI Generated Image or Placeholder */}
                    <div className="relative aspect-square min-h-[450px] rounded-2xl overflow-hidden border border-amber-600/40 group bg-slate-950">
                        {shlokaImage ? (
                            <>
                                <img
                                    src={shlokaImage}
                                    alt={`Visual representation of ${shloka.theme}`}
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 p-2"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                    <span className="text-xs text-amber-200/80 bg-black/40 px-2 py-1 rounded">
                                        AI Generated • {shloka.theme}
                                    </span>
                                    <button
                                        onClick={() => setImageExpanded(true)}
                                        className="p-1.5 bg-black/40 rounded-full text-amber-200 hover:bg-black/60 transition-all"
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-950/60 to-amber-800/20 flex items-center justify-center">
                                <div className="text-center p-6">
                                    <ImageIcon className="w-10 h-10 mx-auto text-amber-500/50 mb-3" />
                                    <p className="text-amber-400/60 text-sm mb-2">Visual Coming Soon</p>
                                    <p className="text-amber-500/40 text-xs max-w-xs mx-auto">
                                        {shloka.nanoPrompt.substring(0, 80)}...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Expanded Modal */}
            {imageExpanded && shlokaImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setImageExpanded(false)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <img
                            src={shlokaImage}
                            alt={`Visual representation of ${shloka.theme}`}
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <div className="absolute bottom-4 left-4 right-4 text-center">
                            <p className="text-amber-200 text-lg font-medium">{shloka.theme}</p>
                            <p className="text-amber-400/70 text-sm mt-1">Mantra {shloka.number}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

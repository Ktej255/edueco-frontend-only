"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Drama, Volume2, VolumeX, ChevronRight, ChevronLeft } from "lucide-react";
import { KENA_METADATA, kenaData } from "@/components/batch2/upanishads/data/kena-shlokas";
import { getKenaShlokaImage } from "@/components/batch2/upanishads/data/kena-images";

// Split data
const philosophyData = kenaData.filter(d => d.section === "Philosophy");
const storyData = kenaData.filter(d => d.section === "Story");

// ==========================================
// PHILOSOPHY STREAM COMPONENT (1-13)
// ==========================================
function PhilosophyStream({ lang }: { lang: "en" | "hi" }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const shloka = philosophyData[currentIndex];
    const image = getKenaShlokaImage(shloka.id);

    return (
        <div className="space-y-8">
            {/* Shloka Card */}
            <motion.div
                key={shloka.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-cyan-900/40 rounded-2xl border border-teal-500/30 overflow-hidden shadow-2xl backdrop-blur-sm"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Text Column */}
                    <div className="p-6 md:p-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="px-5 py-2 bg-teal-500/20 text-teal-300 rounded-full text-sm font-bold tracking-wide uppercase">
                                Mantra {shloka.id}
                            </span>
                            <span className="text-cyan-400 font-medium tracking-tight">Kena Upanishad</span>
                        </div>

                        {/* Sanskrit */}
                        <div className="bg-cyan-950/60 rounded-xl p-6 border border-teal-500/30 shadow-inner">
                            <p className="text-2xl md:text-3xl text-teal-50 text-center leading-relaxed font-serif" style={{ fontFamily: "'Noto Sans Devanagari', serif" }}>
                                {shloka.sanskrit}
                            </p>
                            <p className="mt-4 text-teal-400/80 text-sm text-center italic tracking-wide">
                                {shloka.transliteration}
                            </p>
                        </div>

                        {/* Meanings */}
                        <div className="space-y-5">
                            <div className="bg-teal-900/20 rounded-xl p-5 border border-teal-500/20">
                                <h4 className="text-teal-400 font-bold mb-3 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    {lang === "en" ? "Translation" : "अनुवाद"}
                                </h4>
                                <p className="text-cyan-50 text-lg leading-relaxed">
                                    {lang === "en" ? shloka.english : shloka.hindi}
                                </p>
                            </div>

                            {/* Sarit's Insight */}
                            <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-teal-400/40 shadow-lg">
                                <h4 className="text-teal-200 font-bold mb-3 flex items-center gap-2">
                                    <span className="text-xl">💡</span>
                                    {lang === "en" ? "Sarit's Insight" : "सरल बोध"}
                                </h4>
                                <p className="text-cyan-50 text-lg leading-relaxed italic font-medium">
                                    {lang === "en" ? shloka.simpleExplanation : shloka.simpleExplanationHindi}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image Column */}
                    <div className="relative bg-cyan-950/80 flex items-center justify-center min-h-[450px] overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent z-0" />
                        {image ? (
                            <motion.img
                                src={image}
                                alt={`Mantra ${shloka.id}`}
                                className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-105"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                            />
                        ) : (
                            <div className="text-center space-y-4 relative z-10">
                                <div className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-teal-500/20">
                                    <span className="text-5xl opacity-40">🧠</span>
                                </div>
                                <p className="text-teal-500/50 font-medium">Visualizing Mantra {shloka.id}...</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Enhanced Pagination */}
            <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                        className="w-12 h-12 flex items-center justify-center bg-cyan-800/50 text-teal-300 rounded-full border border-teal-500/30 hover:bg-teal-500 hover:text-white transition-all disabled:opacity-20"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex flex-wrap justify-center gap-2 max-w-md">
                        {philosophyData.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-8 h-8 rounded-full text-xs font-bold transition-all border ${i === currentIndex
                                        ? "bg-teal-500 border-teal-400 text-white scale-110 shadow-lg shadow-teal-500/40"
                                        : "bg-cyan-900/40 border-teal-500/20 text-teal-600 hover:border-teal-500"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentIndex(prev => Math.min(philosophyData.length - 1, prev + 1))}
                        disabled={currentIndex === philosophyData.length - 1}
                        className="w-12 h-12 flex items-center justify-center bg-cyan-800/50 text-teal-300 rounded-full border border-teal-500/30 hover:bg-teal-500 hover:text-white transition-all disabled:opacity-20"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-teal-500/50 text-sm font-medium">
                    Showing {currentIndex + 1} of {philosophyData.length} Mantras in Inquiry & Paradox
                </p>
            </div>
        </div>
    );
}

// ==========================================
// YAKSHA STORY MODE COMPONENT (14-34)
// ==========================================
function YakshaStoryMode({ lang }: { lang: "en" | "hi" }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const step = storyData[currentIndex];

    // Scroll timeline on change
    useEffect(() => {
        if (scrollRef.current) {
            const activeElem = scrollRef.current.children[currentIndex] as HTMLElement;
            if (activeElem) {
                const containerWidth = scrollRef.current.offsetWidth;
                const scrollPos = activeElem.offsetLeft - (containerWidth / 2) + (activeElem.offsetWidth / 2);
                scrollRef.current.scrollTo({ left: scrollPos, behavior: "smooth" });
            }
        }
    }, [currentIndex]);

    return (
        <div className="space-y-10">
            {/* Scrollable Timeline */}
            <div className="relative group">
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-teal-500/10 -translate-y-1/2" />
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide px-8 cursor-grab active:cursor-grabbing no-scrollbar"
                >
                    {storyData.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => setCurrentIndex(i)}
                            className="flex-shrink-0 flex flex-col items-center gap-3 w-16 group"
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 border-2 ${i === currentIndex
                                        ? "bg-teal-500 border-white text-white scale-125 shadow-xl shadow-teal-500/30"
                                        : "bg-cyan-900 border-teal-500/30 text-teal-700 hover:border-teal-500"
                                    }`}
                            >
                                {s.id}
                            </div>
                            <div className={`h-1 w-1 rounded-full transition-all ${i === currentIndex ? "bg-teal-400 scale-150" : "bg-transparent"}`} />
                        </button>
                    ))}
                </div>
                {/* Fade overlays for scroll */}
                <div className="absolute left-0 top-0 bottom-6 w-20 bg-gradient-to-r from-cyan-950 to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-6 w-20 bg-gradient-to-l from-cyan-950 to-transparent pointer-events-none" />
            </div>

            {/* Content Display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-cyan-900/40 rounded-3xl border border-teal-500/30 overflow-hidden shadow-2xl backdrop-blur-md"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Story Content */}
                        <div className="p-8 md:p-12 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">
                                    {step.id}
                                </div>
                                <div className="h-full border-l-2 border-teal-500/20 pl-4">
                                    <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">
                                        {lang === "en" ? (step.theme || "The Revelation") : (step.theme || "रहस्योद्घाटन")}
                                    </h3>
                                    <p className="text-teal-400 font-medium text-sm">Chapter 3 & 4: The Yaksha Allegory</p>
                                </div>
                            </div>

                            {/* Main Story Text */}
                            <div className="bg-cyan-950/40 rounded-2xl p-6 border border-teal-500/20">
                                <p className="text-xl text-cyan-50 leading-relaxed font-medium">
                                    {lang === "en" ? step.english : step.hindi}
                                </p>
                            </div>

                            {/* Simplified Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-teal-400">
                                    <span className="text-2xl">💡</span>
                                    <span className="uppercase text-xs font-black tracking-widest tracking-widest">Master Key</span>
                                </div>
                                <p className="text-xl text-teal-100/90 leading-relaxed italic pl-9 border-l-2 border-teal-500/30">
                                    {lang === "en" ? step.simpleExplanation : step.simpleExplanationHindi}
                                </p>
                            </div>
                        </div>

                        {/* Interactive Visual */}
                        <div className="relative bg-black/20 flex flex-col items-center justify-center min-h-[500px] border-l border-teal-500/10">
                            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/40 to-transparent" />

                            {/* Placeholder for Dynamic Art */}
                            <div className="relative z-10 text-center p-8">
                                <motion.div
                                    className="text-9xl mb-8 filter drop-shadow-[0_0_50px_rgba(45,212,191,0.5)]"
                                    animate={{
                                        y: [0, -10, 0],
                                        filter: ["drop-shadow(0 0 20px rgba(45,212,191,0.2))", "drop-shadow(0 0 60px rgba(45,212,191,0.6))", "drop-shadow(0 0 20px rgba(45,212,191,0.2))"]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {step.id >= 14 && step.id <= 15 && "✨"}
                                    {step.id >= 16 && step.id <= 20 && "🔥"}
                                    {step.id >= 21 && step.id <= 25 && "💨"}
                                    {step.id >= 26 && step.id <= 27 && "🔱"}
                                    {step.id >= 28 && step.id <= 32 && "⚡"}
                                    {step.id >= 33 && step.id <= 34 && "🕉️"}
                                </motion.div>
                                <p className="text-teal-400 text-sm font-bold tracking-widest uppercase mb-2">Scene Description</p>
                                <p className="text-cyan-100/70 max-w-xs mx-auto italic leading-relaxed">
                                    {step.nanoBananaPrompt}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Quick Controls */}
            <div className="flex justify-between items-center bg-cyan-900/40 p-4 rounded-2xl border border-teal-500/20">
                <button
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-3 px-6 py-3 bg-cyan-950 text-teal-400 rounded-xl hover:bg-teal-500 hover:text-white transition-all disabled:opacity-10 border border-teal-500/20"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-bold">Previous Phase</span>
                </button>

                <div className="hidden md:flex items-center gap-3">
                    <span className="text-teal-500/50 font-bold text-xs uppercase tracking-tighter">Progress</span>
                    <div className="h-1.5 w-64 bg-cyan-950 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-teal-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / storyData.length) * 100}%` }}
                        />
                    </div>
                    <span className="text-teal-400 font-black text-sm">{currentIndex + 1}/{storyData.length}</span>
                </div>

                <button
                    onClick={() => setCurrentIndex(prev => Math.min(storyData.length - 1, prev + 1))}
                    disabled={currentIndex === storyData.length - 1}
                    className="flex items-center gap-3 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-all disabled:opacity-10 shadow-lg shadow-teal-500/20"
                >
                    <span className="font-bold">Next Event</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

// ==========================================
// MAIN KENA LAYOUT COMPONENT
// ==========================================
export default function KenaLayout() {
    const router = useRouter();
    const [lang, setLang] = useState<"en" | "hi">("en");
    const [activeTab, setActiveTab] = useState<"philosophy" | "story">("philosophy");
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="min-h-screen bg-cyan-950 text-cyan-50 font-sans selection:bg-teal-500/30 selection:text-teal-200">
            {/* Hero Section */}
            <section
                className="relative h-[60vh] md:h-[50vh] overflow-hidden"
                style={{
                    backgroundImage: `url(/assets/upanishads/kena/kena_header_bg_1766057445730.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/80 via-cyan-950/40 to-cyan-950" />

                {/* Float elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px]"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 10, repeat: Infinity }}
                    />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="inline-block px-4 py-1.5 bg-teal-500/20 text-teal-400 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-teal-500/30 backdrop-blur-md"
                        >
                            Sama Veda • {lang === "en" ? "Music & Flow" : "सामवेद"}
                        </motion.span>
                        <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] tracking-tight">
                            {lang === "en" ? "Kena Upanishad" : "केनोपनिषद्"}
                        </h1>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xl md:text-3xl text-teal-300 drop-shadow-lg">
                            <span className="font-light italic">"{lang === "en" ? "By Whom?" : "किसके द्वारा?"}"</span>
                            <span className="hidden md:block w-2 h-2 bg-teal-500 rounded-full" />
                            <span className="font-bold tracking-tight">{lang === "en" ? "Science of Perception" : "ज्ञानेन्द्रियों का विज्ञान"}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Sticky Navigation */}
            <div className="sticky top-0 z-50 bg-cyan-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.push("/student/batch2/upanishads")}
                        className="flex items-center gap-3 text-teal-500 hover:text-teal-400 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center border border-teal-500/20 group-hover:bg-teal-500 group-hover:text-white transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm tracking-tight hidden sm:block">Back to Portal</span>
                    </button>

                    <div className="flex bg-black/40 rounded-2xl p-1 shadow-inner border border-white/5">
                        <button
                            onClick={() => setActiveTab("philosophy")}
                            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "philosophy"
                                    ? "bg-teal-600 text-white shadow-lg"
                                    : "text-teal-500 hover:text-teal-300"
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            <span className="hidden md:inline">{lang === "en" ? "The Philosophy" : "दर्शन"}</span>
                            <span className="md:hidden">{lang === "en" ? "Part 1" : "भाग १"}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("story")}
                            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "story"
                                    ? "bg-teal-600 text-white shadow-lg"
                                    : "text-teal-500 hover:text-teal-300"
                                }`}
                        >
                            <Drama className="w-4 h-4" />
                            <span className="hidden md:inline">{lang === "en" ? "The Yaksha Story" : "यक्ष कथा"}</span>
                            <span className="md:hidden">{lang === "en" ? "Part 2" : "भाग २"}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-cyan-900/50 rounded-xl p-1 border border-white/5">
                            <button
                                onClick={() => setLang("en")}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${lang === "en" ? "bg-teal-500 text-white shadow-md" : "text-teal-600 hover:text-teal-400"
                                    }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLang("hi")}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${lang === "hi" ? "bg-teal-500 text-white shadow-md" : "text-teal-600 hover:text-teal-400"
                                    }`}
                            >
                                हि
                            </button>
                        </div>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isPlaying ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" : "bg-cyan-900/50 text-teal-600 hover:text-teal-400"
                                }`}
                        >
                            {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="h-1 w-full bg-cyan-950 overflow-hidden">
                <motion.div
                    className="h-full bg-teal-500"
                    initial={{ scaleX: 0 }}
                    style={{ originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                />
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {activeTab === "philosophy" ? (
                            <PhilosophyStream lang={lang} />
                        ) : (
                            <YakshaStoryMode lang={lang} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Premium Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

            {/* Final Footer Reveal */}
            <footer className="bg-cyan-950 py-20 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        <div className="w-12 h-1 w-full bg-teal-500/20 mx-auto rounded-full" />
                        <p className="text-2xl md:text-3xl font-serif text-teal-50 tracking-wider">
                            तपः दमो कर्मेति प्रतिष्ठा वेदाः सर्वाङ्गानि सत्यमायतनम् ॥
                        </p>
                        <p className="text-teal-300 font-medium italic opacity-70">
                            {lang === "en"
                                ? "Austerity, restraint, and work are its foundational feet."
                                : "तपस्या, संयम और कर्म इसके आधार हैं।"}
                        </p>
                    </motion.div>

                    <div className="pt-10">
                        <p className="text-teal-500/30 text-[10px] tracking-[0.5em] uppercase font-black">
                            Sarit Classes Digital Upanishad Module • © 2025
                        </p>
                    </div>
                </div>

                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
            </footer>
        </div>
    );
}

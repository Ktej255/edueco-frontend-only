"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX, ChevronDown } from "lucide-react";
import StoryCard from "@/components/batch2/upanishads/StoryCard";
import { ISHA_SIMPLIFIED_CONTENT, ISHA_SIMPLIFIED_META } from "@/components/batch2/upanishads/data/isha-simplified-content";

export default function IshaSimplifiedPage() {
    const [lang, setLang] = useState<"en" | "hi">("en");
    const [activeSection, setActiveSection] = useState(0);
    const [goldenLidRevealed, setGoldenLidRevealed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Scroll observer for active section
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = sectionRefs.current.findIndex(ref => ref === entry.target);
                        if (index !== -1) setActiveSection(index);
                    }
                });
            },
            { threshold: 0.5, rootMargin: "-100px 0px" }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const meta = ISHA_SIMPLIFIED_META;

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Hero Section with Journey Map */}
            <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
                {/* Journey Map Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${meta.journeyMapImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-900" />
                </div>

                {/* Hotspots on Journey Map */}
                {ISHA_SIMPLIFIED_CONTENT.map((section, idx) => (
                    <motion.button
                        key={section.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.2 }}
                        className="absolute group"
                        style={{
                            left: `${section.hotspotPosition.x}%`,
                            top: `${section.hotspotPosition.y}%`,
                            transform: "translate(-50%, -50%)"
                        }}
                        onClick={() => {
                            sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        {/* Pulsing Circle */}
                        <span className="absolute inset-0 rounded-full bg-amber-400/50 animate-ping" />
                        <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-amber-500 text-slate-900 font-bold shadow-lg shadow-amber-500/50 cursor-pointer hover:scale-110 transition-transform">
                            {idx + 1}
                        </span>

                        {/* Tooltip */}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-slate-800 text-amber-200 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                            {lang === "en" ? section.titleEn : section.titleHi}
                        </span>
                    </motion.button>
                ))}

                {/* Header Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 drop-shadow-2xl">
                            {lang === "en" ? meta.titleEn : meta.titleHi}
                        </h1>
                        <p className="text-lg md:text-xl text-amber-300/90 font-medium">
                            {lang === "en" ? meta.subtitleEn : meta.subtitleHi}
                        </p>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <ChevronDown className="w-8 h-8 text-amber-400/70" />
                </motion.div>
            </section>

            {/* Navigation & Language Toggle */}
            <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Back Link */}
                    <Link
                        href="/student/batch2/upanishads/isa"
                        className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Detailed View</span>
                    </Link>

                    {/* Language Toggle */}
                    <div className="flex items-center gap-2 bg-slate-800 rounded-full p-1">
                        <button
                            onClick={() => setLang("en")}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${lang === "en"
                                    ? "bg-amber-500 text-slate-900"
                                    : "text-slate-400 hover:text-white"
                                }`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLang("hi")}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${lang === "hi"
                                    ? "bg-amber-500 text-slate-900"
                                    : "text-slate-400 hover:text-white"
                                }`}
                        >
                            हिन्दी
                        </button>
                    </div>

                    {/* Audio Toggle */}
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                    >
                        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Story Cards Section */}
            <section className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <div className="relative pl-8 space-y-12">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-amber-400/50 to-transparent" />

                    {ISHA_SIMPLIFIED_CONTENT.map((section, idx) => (
                        <div
                            key={section.id}
                            ref={(el) => { sectionRefs.current[idx] = el; }}
                        >
                            <StoryCard
                                icon={section.icon}
                                title={lang === "en" ? section.titleEn : section.titleHi}
                                subtitle={lang === "en" ? section.subtitleEn : section.subtitleHi}
                                content={lang === "en" ? section.contentEn : section.contentHi}
                                rule={lang === "en" ? section.ruleEn : section.ruleHi}
                                isActive={activeSection === idx}
                                index={idx}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* The Golden Lid Footer */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-serif text-amber-200 mb-8">
                        {lang === "en" ? "The Golden Lid" : "स्वर्ण आवरण"}
                    </h2>

                    {/* Golden Circle */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                        <AnimatePresence>
                            {!goldenLidRevealed && (
                                <motion.div
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 1.5 }}
                                    transition={{ duration: 1.5 }}
                                    className="absolute inset-0 rounded-full cursor-pointer"
                                    style={{
                                        background: "radial-gradient(circle at 30% 30%, #FFD700, #B8860B, #8B6914)",
                                        boxShadow: "0 0 60px rgba(255, 215, 0, 0.5), inset 0 0 40px rgba(255, 255, 255, 0.3)"
                                    }}
                                    onClick={() => setGoldenLidRevealed(true)}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-slate-900 font-bold text-lg">
                                            {lang === "en" ? "Unveil Truth" : "सत्य प्रकट करें"}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Revealed Text */}
                        <AnimatePresence>
                            {goldenLidRevealed && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="text-center">
                                        <p className="text-4xl md:text-5xl font-serif text-amber-400 mb-4">
                                            {lang === "en" ? meta.revealTextEn : meta.revealTextHi}
                                        </p>
                                        <p className="text-slate-400 text-sm">
                                            {lang === "en"
                                                ? "The Truth was always within you."
                                                : "सत्य सदैव आपके भीतर था।"
                                            }
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {goldenLidRevealed && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="mt-12"
                        >
                            <button
                                onClick={() => setGoldenLidRevealed(false)}
                                className="text-amber-500/60 hover:text-amber-400 text-sm transition-colors"
                            >
                                {lang === "en" ? "← Cover again" : "← पुनः आवरण"}
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Background Glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: goldenLidRevealed
                            ? "radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)"
                            : "transparent"
                    }}
                />
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-slate-800 py-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm">
                        ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते ।
                    </p>
                    <p className="text-slate-600 text-xs mt-2">
                        {lang === "en"
                            ? "That is complete, This is complete. From the Complete, the Complete arises."
                            : "वह पूर्ण है, यह पूर्ण है। पूर्ण से पूर्ण प्रकट होता है।"
                        }
                    </p>
                </div>
            </footer>
        </div>
    );
}

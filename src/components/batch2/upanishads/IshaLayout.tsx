"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Sun, Sparkles, Languages, ChevronRight, ChevronLeft, Volume2, VolumeX, Eye } from "lucide-react";
import { ISHA_METADATA, ISHA_UPANISHAD } from "@/components/batch2/upanishads/data/isha-shlokas";
import { getShlokaImage } from "@/components/batch2/upanishads/data/isha-images";

// Split data by sections defined in data file
const foundationData = ISHA_UPANISHAD.filter(d => d.section === "Foundation");
const philosophyData = ISHA_UPANISHAD.filter(d => d.section === "Philosophy");
const knowledgeData = ISHA_UPANISHAD.filter(d => d.section === "Knowledge");
const prayerData = ISHA_UPANISHAD.filter(d => d.section === "Prayer");

// ==========================================
// WISDOM STREAM COMPONENT (Standard view)
// ==========================================
function WisdomStream({ data, lang, title, subtitle }: { data: any[], lang: "en" | "hi", title: string, subtitle: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const shloka = data[currentIndex];
    const image = getShlokaImage(shloka.number);

    return (
        <div className="space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-100 mb-2">{title}</h2>
                <p className="text-amber-500/60 font-medium tracking-widest uppercase text-xs">{subtitle}</p>
            </div>

            <motion.div
                key={shloka.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-amber-950/40 rounded-3xl border border-amber-600/30 overflow-hidden shadow-2xl backdrop-blur-md"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Text Section */}
                    <div className="p-8 md:p-12 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-xl font-black text-white shadow-lg">
                                    {shloka.number}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{shloka.theme}</h3>
                                    <p className="text-amber-500/60 text-xs font-bold uppercase tracking-widest">Isha Upanishad</p>
                                </div>
                            </div>
                        </div>

                        {/* Sanskrit Block */}
                        <div className="bg-amber-950/60 rounded-2xl p-6 border border-amber-600/20 shadow-inner">
                            <p className="text-2xl md:text-3xl text-amber-50 text-center leading-relaxed font-serif" style={{ fontFamily: "'Noto Sans Devanagari', serif" }}>
                                {shloka.devanagari}
                            </p>
                            <p className="mt-4 text-amber-400/80 text-sm text-center italic leading-relaxed">
                                {shloka.transliteration}
                            </p>
                        </div>

                        {/* Translation Block */}
                        <div className="space-y-6">
                            <div className="bg-amber-900/10 rounded-xl p-5 border border-amber-600/10">
                                <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Languages className="w-4 h-4" />
                                    {lang === "en" ? "Translation" : "अनुवाद"}
                                </h4>
                                <p className="text-amber-50 text-lg leading-relaxed">
                                    {lang === "en" ? shloka.meaningEnglish : shloka.meaningHindi}
                                </p>
                            </div>

                            {/* Sarit's Insight */}
                            <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-2xl p-8 border border-amber-500/40 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Sparkles className="w-12 h-12 text-amber-400" />
                                </div>
                                <h4 className="text-amber-200 font-black mb-4 flex items-center gap-3">
                                    <span className="bg-amber-500 text-amber-950 w-8 h-8 rounded-lg flex items-center justify-center text-lg">💡</span>
                                    {lang === "en" ? "THE ESSENCE" : "मुख्य बोध"}
                                </h4>
                                <p className="text-amber-50 text-xl leading-relaxed italic font-medium relative z-10">
                                    {lang === "en" ? shloka.simpleExplanation : shloka.simpleExplanationHindi}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Visual Section */}
                    <div className="relative bg-black/40 min-h-[500px] flex items-center justify-center overflow-hidden border-l border-amber-600/10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-600/10 to-transparent pointer-events-none" />

                        {image ? (
                            <motion.img
                                src={image}
                                alt={shloka.theme}
                                className="w-full h-full object-contain p-8 relative z-10"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                            />
                        ) : (
                            <div className="text-center p-12 relative z-10">
                                <div className="text-8xl mb-6 opacity-30 animate-pulse">✨</div>
                                <p className="text-amber-500/50 font-medium italic">{shloka.nanoPrompt}</p>
                            </div>
                        )}

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                            <span className="px-4 py-1.5 bg-black/60 rounded-full text-[10px] text-amber-400 font-black tracking-[0.2em] uppercase border border-amber-500/30 backdrop-blur-md">
                                Visualizing {shloka.theme}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Pagination */}
            <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                        className="w-14 h-14 flex items-center justify-center bg-amber-950/60 text-amber-400 rounded-full border border-amber-600/30 hover:bg-amber-600 hover:text-amber-950 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                    >
                        <ChevronLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="flex flex-wrap justify-center gap-2 max-w-md">
                        {data.map((s, i) => (
                            <button
                                key={s.number}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-10 h-10 rounded-xl text-sm font-black transition-all border ${i === currentIndex
                                    ? "bg-amber-500 border-amber-300 text-amber-950 scale-110 shadow-lg shadow-amber-500/40"
                                    : "bg-amber-950/40 border-amber-600/20 text-amber-700 hover:border-amber-500"
                                    }`}
                            >
                                {s.number}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentIndex(prev => Math.min(data.length - 1, prev + 1))}
                        disabled={currentIndex === data.length - 1}
                        className="w-14 h-14 flex items-center justify-center bg-amber-950/60 text-amber-400 rounded-full border border-amber-600/30 hover:bg-amber-600 hover:text-amber-950 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                    >
                        <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-1 w-48 bg-amber-950 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-amber-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
                        />
                    </div>
                    <p className="text-amber-500/50 text-xs font-black uppercase tracking-widest">
                        {currentIndex + 1} / {data.length} Mantras
                    </p>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// REVELATION MODE (15-18)
// ==========================================
function RevelationMode({ lang }: { lang: "en" | "hi" }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const shloka = prayerData[currentIndex];
    const image = getShlokaImage(shloka.number);

    useEffect(() => {
        setIsRevealed(false);
    }, [currentIndex]);

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-100 mb-4">The Golden Revelation</h2>
                <p className="text-amber-500/60 font-medium tracking-[0.3em] uppercase text-xs">Mantra 15 - 18: Beyond the Veil</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Visual Reveal Mechaninc (Lid) */}
                <div className="lg:col-span-5 relative aspect-square rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-black">
                    <AnimatePresence>
                        {!isRevealed ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 1.5, rotate: 10 }}
                                className="absolute inset-0 z-20 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 flex flex-col items-center justify-center p-12 text-center cursor-pointer group"
                                onClick={() => setIsRevealed(true)}
                            >
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/gold-dust.png')] pointer-events-none" />
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 6, repeat: Infinity }}
                                    className="w-32 h-32 bg-amber-200/20 rounded-full border-4 border-amber-100/40 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(251,191,36,0.4)]"
                                >
                                    <Sun className="w-16 h-16 text-amber-100" />
                                </motion.div>
                                <h3 className="text-2xl font-serif font-bold text-amber-50 mb-4 tracking-wide">The Hiranmaya Patra</h3>
                                <p className="text-amber-100/70 text-sm leading-relaxed mb-8 italic">
                                    "The face of Truth is covered by a golden disc..."
                                </p>
                                <button className="px-8 py-3 bg-white text-amber-900 rounded-full font-black text-sm uppercase tracking-widest shadow-xl group-hover:scale-105 transition-transform flex items-center gap-3">
                                    <Eye className="w-4 h-4" />
                                    Lift the Lid
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 z-10 bg-black flex items-center justify-center"
                            >
                                {image ? (
                                    <img src={image} className="w-full h-full object-cover opacity-80" alt="Truth Revealed" />
                                ) : (
                                    <div className="text-center space-y-4">
                                        <div className="text-6xl animate-pulse">☀️</div>
                                        <p className="text-amber-500 font-bold uppercase tracking-widest text-[10px]">Pure Consciousness Revealed</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                <button
                                    onClick={() => setIsRevealed(false)}
                                    className="absolute top-6 right-6 p-2 bg-black/40 text-amber-500 rounded-full border border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )
                        }
                    </AnimatePresence>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-7 space-y-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={shloka.number}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-amber-600 flex items-center justify-center text-3xl font-black text-white shadow-xl rotate-3">
                                    {shloka.number}
                                </div>
                                <div>
                                    <h3 className="text-4xl font-serif font-bold text-white tracking-tight">{shloka.theme}</h3>
                                    <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-[10px]">Final Transcendence</p>
                                </div>
                            </div>

                            <div className="bg-amber-950/40 rounded-3xl p-8 border border-amber-500/20 backdrop-blur-sm space-y-6">
                                <p className="text-3xl text-amber-50 leading-relaxed font-serif text-center italic" style={{ fontFamily: "'Noto Sans Devanagari', serif" }}>
                                    {shloka.devanagari}
                                </p>
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                                <p className="text-xl text-amber-100 leading-relaxed">
                                    {lang === "en" ? shloka.meaningEnglish : shloka.meaningHindi}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-amber-600/30 to-orange-600/10 rounded-3xl p-10 border border-amber-400/50 shadow-2xl relative overflow-hidden group">
                                <h4 className="text-amber-400 text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                    <Sparkles className="w-4 h-4" />
                                    Master Insight
                                </h4>
                                <p className="text-2xl text-white font-medium italic leading-relaxed relative z-10 transition-all group-hover:scale-[1.02]">
                                    {lang === "en" ? shloka.simpleExplanation : shloka.simpleExplanationHindi}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between pt-8 border-t border-amber-500/10">
                        <button
                            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-3 px-8 py-4 bg-amber-950/60 text-amber-500 rounded-2xl border border-amber-500/20 hover:bg-amber-500 hover:text-amber-950 transition-all disabled:opacity-10"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="font-black text-sm uppercase tracking-widest">Back</span>
                        </button>

                        <div className="flex gap-3">
                            {prayerData.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 rounded-full transition-all duration-500 ${i === currentIndex ? "w-12 bg-amber-500" : "w-2 bg-amber-800"}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentIndex(prev => Math.min(prayerData.length - 1, prev + 1))}
                            disabled={currentIndex === prayerData.length - 1}
                            className="flex items-center gap-3 px-8 py-4 bg-amber-600 text-amber-950 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-600/20 hover:bg-amber-500 transition-all disabled:opacity-10"
                        >
                            <span className="font-black">Next</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function IshaLayout() {
    const router = useRouter();
    const [lang, setLang] = useState<"en" | "hi">("en");
    const [activeTab, setActiveTab] = useState<"foundation" | "philosophy" | "knowledge" | "prayer">("foundation");
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-amber-50 font-sans selection:bg-amber-500/30 selection:text-amber-200">
            {/* Header Hero */}
            <header className="relative h-[55vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 opacity-40 scale-110"
                    style={{
                        backgroundImage: `url(${getShlokaImage(15)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "blur(4px)"
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />

                {/* Floating Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px]"
                    />
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-block px-5 py-2 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-black tracking-[0.4em] uppercase mb-8 border border-amber-500/20 backdrop-blur-md">
                            Shukla Yajur Veda • Isha Upanishad
                        </span>
                        <h1 className="text-6xl md:text-9xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600 mb-8 tracking-tighter">
                            {lang === "en" ? "Isha Upanishad" : "ईशावास्योपनिषद्"}
                        </h1>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-2xl md:text-3xl text-amber-200/80 font-serif italic">
                            <span>"{lang === "en" ? "That is Full" : "पूर्णमदः पूर्णमिदम्"}"</span>
                            <span className="hidden md:block w-2 h-2 bg-amber-500 rounded-full" />
                            <span>{lang === "en" ? "The Science of Oneness" : "अद्वैत का परम विज्ञान"}</span>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 px-4 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.push("/student/batch2/upanishads")}
                        className="flex items-center gap-3 text-amber-500 hover:text-amber-400 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-amber-950/50 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-amber-950 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest hidden sm:block">Portal</span>
                    </button>

                    <div className="flex bg-black/60 rounded-2xl p-1.5 border border-white/5 shadow-2xl overflow-x-auto no-scrollbar max-w-[60%] md:max-w-none">
                        {[
                            { id: "foundation", label: "Foundation", icon: BookOpen },
                            { id: "philosophy", label: "Philosophy", icon: Sparkles },
                            { id: "knowledge", label: "Knowledge", icon: Sun },
                            { id: "prayer", label: "Final Prayer", icon: Eye }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? "bg-amber-600 text-amber-950 shadow-lg"
                                        : "text-amber-600 hover:text-amber-400"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="uppercase tracking-widest">{lang === "en" ? tab.label : (tab.id === "foundation" ? "आधार" : tab.id === "philosophy" ? "दर्शन" : tab.id === "knowledge" ? "ज्ञान" : "प्रार्थना")}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-amber-950/50 rounded-xl p-1 border border-white/5">
                            {(["en", "hi"] as const).map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLang(l)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${lang === l ? "bg-amber-500 text-amber-950 shadow-md" : "text-amber-600 hover:text-amber-400"
                                        }`}
                                >
                                    {l.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isPlaying ? "bg-amber-500 text-amber-950 shadow-lg shadow-amber-500/20" : "bg-amber-950/50 text-amber-600 hover:text-amber-400"
                                }`}
                        >
                            {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Scroll Progress */}
            <div className="h-1 bg-amber-950">
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5 }}
                    style={{ originX: 0 }}
                    className="h-full bg-amber-500"
                />
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4 }}
                    >
                        {activeTab === "foundation" && (
                            <WisdomStream
                                data={foundationData}
                                lang={lang}
                                title={lang === "en" ? "The Foundation" : "बुनियाद"}
                                subtitle="Mantra 1 - 3: Life, Action & Renunciation"
                            />
                        )}
                        {activeTab === "philosophy" && (
                            <WisdomStream
                                data={philosophyData}
                                lang={lang}
                                title={lang === "en" ? "The Divine Paradox" : "परम विरोधाभास"}
                                subtitle="Mantra 4 - 8: The Nature of Brahman & The Self"
                            />
                        )}
                        {activeTab === "knowledge" && (
                            <WisdomStream
                                data={knowledgeData}
                                lang={lang}
                                title={lang === "en" ? "The Science of Knowledge" : "ज्ञान का विज्ञान"}
                                subtitle="Mantra 9 - 14: Balancing Vidya & Avidya"
                            />
                        )}
                        {activeTab === "prayer" && (
                            <RevelationMode lang={lang} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 py-32 relative overflow-hidden text-center border-t border-amber-900/10">
                <div className="max-w-4xl mx-auto px-6 space-y-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="w-20 h-px bg-amber-500/30 mx-auto" />
                        <p className="text-3xl md:text-5xl font-serif text-amber-50 leading-tight">
                            ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते ।<br />
                            पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥
                        </p>
                        <p className="text-amber-500/60 font-medium italic text-lg max-w-2xl mx-auto">
                            {lang === "en"
                                ? "That is whole, this is whole. From the whole, the whole emerges. Taking the whole from the whole, the whole remains."
                                : "वह पूर्ण है, यह पूर्ण है। पूर्ण से पूर्ण निकलता है। पूर्ण में से पूर्ण निकाल लेने पर भी पूर्ण ही बचता है।"}
                        </p>
                        <div className="w-20 h-px bg-amber-500/30 mx-auto" />
                    </motion.div>

                    <div className="pt-20">
                        <p className="text-[10px] text-amber-500/20 font-black tracking-[1em] uppercase">
                            Digital Upanishad Experience • Eduecosystem
                        </p>
                    </div>
                </div>

                {/* Glow Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.05)_0%,transparent_70%)] pointer-events-none" />
            </footer>
        </div>
    );
}

"use client";

import React from "react";
import { Play, Clock, Wind, Zap, Brain, Activity, Heart, Eye } from "lucide-react";

export default function MeditationPage() {
    // 12 Authentic Vedic/Yogic Meditation Processes (Placeholders for accurate slide content)
    const meditations = [
        {
            id: 1,
            title: "Om Japa Dhyāna",
            description: "Rhythmic chanting of the primordial sound 'Om' to synchronize body, mind, and breath.",
            duration: "15 min",
            level: "Beginner",
            icon: Zap
        },
        {
            id: 2,
            title: "Trāṭaka (Gazing)",
            description: "Fixed gazing at a single point or candle flame to develop intense concentration and cleanse the eyes.",
            duration: "10 min",
            level: "Beginner",
            icon: Eye
        },
        {
            id: 3,
            title: "Prāṇāyāma Dhyāna",
            description: "Focusing on breath control (Anulom Vilom/Kapalbhati) to calm the nervous system.",
            duration: "20 min",
            level: "Intermediate",
            icon: Wind
        },
        {
            id: 4,
            title: "Yoga Nidrā",
            description: "Psychic sleep; a state of conscious relaxation to release deep-seated stress.",
            duration: "30 min",
            level: "Beginner",
            icon: Activity
        },
        {
            id: 5,
            title: "Antar Mauna",
            description: "Inner Silence. Observing internal thoughts and noises without reaction to achieve mental peace.",
            duration: "25 min",
            level: "Advanced",
            icon: Brain
        },
        {
            id: 6,
            title: "Ajapa Japa",
            description: "Spontaneous repetition of the mantra 'So-Ham' with the natural breath.",
            duration: "20 min",
            level: "Intermediate",
            icon: Wind
        },
        {
            id: 7,
            title: "Chidakasha Dharana",
            description: "Focusing on the dark space in front of the closed eyes to unlock inner visualization.",
            duration: "15 min",
            level: "Advanced",
            icon: Eye
        },
        {
            id: 8,
            title: "Hridayakasha Dharana",
            description: "Concentrating on the heart space to awaken emotional balance and compassion.",
            duration: "20 min",
            level: "Intermediate",
            icon: Heart
        },
        {
            id: 9,
            title: "Vipassanā",
            description: "Insight meditation; observing sensations throughout the body with equanimity.",
            duration: "45 min",
            level: "Advanced",
            icon: Activity
        },
        {
            id: 10,
            title: "Chakra Shuddhi",
            description: "Purification of the psychic energy centers (Chakras) through visualization and mantra.",
            duration: "30 min",
            level: "Advanced",
            icon: Zap
        },
        {
            id: 11,
            title: "Sakshi Bhava",
            description: "Witness consciousness; watching the flow of thoughts like a river without getting involved.",
            duration: "20 min",
            level: "Intermediate",
            icon: Brain
        },
        {
            id: 12,
            title: "Brahma Muhurta Dhyāna",
            description: "Early morning meditation (before sunrise) to absorb high cosmic energy.",
            duration: "40 min",
            level: "Advanced",
            icon: Clock
        },
    ];

    return (
        <div className="min-h-screen bg-[#08080A] text-[#E0E0E0] font-sans">
            {/* Hero */}
            <div className="relative h-80 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a237e] via-[#08080A] to-[#08080A] opacity-50" />
                <div className="relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold font-serif mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#A5B4FC] to-[#6366F1]">
                        Dhyāna Modules
                    </h1>
                    <p className="text-xl text-[#818CF8] max-w-2xl mx-auto font-light">
                        12 profound pathways to inner silence and self-realization.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {meditations.map((m) => (
                        <div key={m.id} className="group relative bg-[#111] rounded-2xl p-8 border border-[#222] hover:border-[#6366F1]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-50 text-[#333] font-black text-6xl -translate-y-2 translate-x-2 group-hover:text-[#6366F1]/10 transition-colors">
                                {m.id.toString().padStart(2, '0')}
                            </div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-[#1E1B4B] flex items-center justify-center text-[#818CF8] mb-6 group-hover:scale-110 transition-transform">
                                    <m.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{m.title}</h3>
                                <p className="text-sm text-[#888] mb-6 line-clamp-2">
                                    {m.description}
                                </p>

                                <div className="flex items-center justify-between border-t border-[#222] pt-4">
                                    <div className="flex items-center gap-4 text-xs text-[#666]">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {m.duration}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-[#222] text-[#AAA] border border-[#333]">
                                            {m.level}
                                        </span>
                                    </div>

                                    <button className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white hover:bg-[#818CF8] transition-colors shadow-lg shadow-indigo-500/30">
                                        <Play className="w-3.5 h-3.5 ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

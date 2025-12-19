"use client";

import React from "react";
import { motion } from "framer-motion";

interface StoryCardProps {
    icon: string;
    title: string;
    subtitle: string;
    content: string;
    rule: string;
    isActive: boolean;
    index: number;
}

export default function StoryCard({
    icon,
    title,
    subtitle,
    content,
    rule,
    isActive,
    index
}: StoryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative p-6 md:p-8 rounded-2xl border-l-4 transition-all duration-500 ${isActive
                    ? "bg-slate-800/80 border-amber-500 opacity-100 scale-[1.02] shadow-2xl shadow-amber-900/30"
                    : "bg-slate-900/60 border-slate-700 opacity-60 scale-100"
                }`}
        >
            {/* Step Number Badge */}
            <div className="absolute -left-5 top-6 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-lg shadow-lg">
                {index + 1}
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                {/* Icon */}
                <div className="text-5xl shrink-0">{icon}</div>

                {/* Content */}
                <div className="flex-1">
                    {/* Title & Subtitle */}
                    <div className="mb-4">
                        <h3 className="text-xl md:text-2xl font-serif text-amber-200 mb-1">
                            {title}
                        </h3>
                        <p className="text-amber-500/70 text-sm font-medium">
                            {subtitle}
                        </p>
                    </div>

                    {/* Main Content */}
                    <p className="text-slate-300 leading-relaxed mb-4" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                        {content}
                    </p>

                    {/* Rule/Secret Box */}
                    <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                        <p className="text-amber-100/90 leading-relaxed italic" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                            {rule}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

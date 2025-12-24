"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, Star, Sparkles, ArrowRight, ArrowLeft, ArrowDown } from "lucide-react";
import { ALL_108_UPANISHADS, VEDA_COLORS } from "./upanishads/upanishads-108-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface UpanishadProgressSequenceProps {
    currentUpanishadId?: string;
}

export default function UpanishadProgressSequence({
    currentUpanishadId = "isa"
}: UpanishadProgressSequenceProps) {
    const { user } = useAuth();
    const isMasterId = user?.email === "ktej255@gmail.com";

    const currentIndex = ALL_108_UPANISHADS.findIndex(u => u.id === currentUpanishadId);

    const getUpanishadStatus = (index: number): "completed" | "in-progress" | "next-up" | "locked" => {
        if (isMasterId) {
            if (index < currentIndex) return "completed";
            if (index === currentIndex) return "in-progress";
            return "next-up";
        }
        if (index < currentIndex) return "completed";
        if (index === currentIndex) return "in-progress";
        if (index <= currentIndex + 2) return "next-up";
        return "locked";
    };

    // Show first 15 levels, can expand later
    const visibleLevels = ALL_108_UPANISHADS.slice(0, 15);

    return (
        <div className="relative w-full min-h-[700px] bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 rounded-3xl border-2 border-amber-200 overflow-hidden p-6">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-amber-300/40 rounded-full"
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%",
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{
                            y: [null, "-20%", null],
                            opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
                <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-40" />
                <div className="absolute top-1/3 right-10 w-48 h-48 bg-orange-200 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-amber-300 rounded-full blur-3xl opacity-25" />
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-center mb-10"
            >
                <h2 className="text-3xl font-bold text-amber-900 mb-2">Journey of 108 Upanishads</h2>
                <p className="text-amber-700/70">Complete each Upanishad to unlock the next</p>
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-amber-200 shadow-lg"
                >
                    <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <span className="text-amber-900 font-bold">{currentIndex} / 108</span>
                    <span className="text-amber-600/60 text-sm">Mastered</span>
                </motion.div>
            </motion.div>

            {/* Level Map - Winding Path */}
            <div className="relative z-10 max-w-3xl mx-auto">
                {/* SVG for Animated Dashed Path */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minHeight: '500px' }}>
                    <defs>
                        {/* Animated dash pattern */}
                        <pattern id="animatedDash" patternUnits="userSpaceOnUse" width="20" height="1">
                            <motion.line
                                x1="0" y1="0" x2="10" y2="0"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </pattern>
                    </defs>
                </svg>

                {/* Level Nodes in Zigzag Pattern */}
                <div className="relative flex flex-col gap-6">
                    {/* Row-based rendering for zigzag */}
                    {[0, 1, 2, 3, 4].map((rowIndex) => {
                        const startIdx = rowIndex * 3;
                        const rowItems = visibleLevels.slice(startIdx, startIdx + 3);
                        const isReversed = rowIndex % 2 === 1;

                        return (
                            <div key={rowIndex} className="relative">
                                {/* Horizontal Connector Line for this row */}
                                <div className={cn(
                                    "absolute top-10 h-1 z-0 flex items-center",
                                    isReversed ? "left-[16%] right-[16%]" : "left-[16%] right-[16%]"
                                )}>
                                    {/* Dashed line - shorter to leave room for arrow */}
                                    <motion.div
                                        className={cn(
                                            "h-full relative",
                                            isReversed ? "w-[calc(100%-24px)] ml-auto" : "w-[calc(100%-24px)]"
                                        )}
                                        style={{
                                            background: `repeating-linear-gradient(${isReversed ? '270deg' : '90deg'}, #f59e0b 0px, #f59e0b 8px, transparent 8px, transparent 16px)`
                                        }}
                                        animate={{
                                            backgroundPositionX: isReversed ? [0, -100] : [0, 100]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    />
                                    {/* Solid Arrow at the END of the line */}
                                    <motion.div
                                        className={cn(
                                            "absolute top-1/2 -translate-y-1/2 bg-amber-500 rounded-full p-1 shadow-lg",
                                            isReversed ? "left-0" : "right-0"
                                        )}
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        {isReversed ? (
                                            <ArrowLeft className="w-5 h-5 text-white" />
                                        ) : (
                                            <ArrowRight className="w-5 h-5 text-white" />
                                        )}
                                    </motion.div>
                                </div>

                                {/* Vertical Connector to Next Row */}
                                {rowIndex < 4 && (
                                    <div className={cn(
                                        "absolute w-1 z-0 flex flex-col items-center",
                                        isReversed ? "left-[16%] top-[80px]" : "right-[16%] top-[80px]"
                                    )}
                                        style={{ height: '40px' }}
                                    >
                                        {/* Dashed line - shorter to leave room for arrow */}
                                        <motion.div
                                            className="w-full flex-1"
                                            style={{
                                                background: `repeating-linear-gradient(180deg, #f59e0b 0px, #f59e0b 6px, transparent 6px, transparent 12px)`
                                            }}
                                            animate={{
                                                backgroundPositionY: [0, 50]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                        />
                                        {/* Solid Down Arrow at the END */}
                                        <motion.div
                                            className="bg-amber-500 rounded-full p-1 shadow-lg -mb-2"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <ArrowDown className="w-4 h-4 text-white" />
                                        </motion.div>
                                    </div>
                                )}

                                {/* Level Nodes */}
                                <div className={cn(
                                    "flex justify-around items-start relative z-10",
                                    isReversed && "flex-row-reverse"
                                )}>
                                    {rowItems.map((upanishad, colIndex) => {
                                        const globalIndex = startIdx + colIndex;
                                        const sequenceNumber = globalIndex + 1; // 1-indexed
                                        const status = getUpanishadStatus(globalIndex);
                                        const vedaColor = VEDA_COLORS[upanishad.veda];
                                        const isLocked = status === "locked" && !isMasterId;

                                        return (
                                            <motion.div
                                                key={upanishad.id}
                                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                transition={{ delay: globalIndex * 0.08, type: "spring", stiffness: 200 }}
                                                className="flex flex-col items-center w-28"
                                            >
                                                {/* Level Node Circle */}
                                                <motion.div
                                                    whileHover={!isLocked ? { scale: 1.15, rotate: 5 } : {}}
                                                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                                                    className={cn(
                                                        "relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border-4",
                                                        status === "completed" && "bg-gradient-to-br from-green-400 to-emerald-500 border-green-300 shadow-lg shadow-green-500/40",
                                                        status === "in-progress" && "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 shadow-xl shadow-amber-500/50",
                                                        status === "next-up" && "bg-gradient-to-br from-slate-200 to-slate-300 border-slate-200 shadow-md",
                                                        status === "locked" && "bg-slate-100 border-slate-100 opacity-40 blur-[1px] grayscale"
                                                    )}
                                                >
                                                    {/* Pulsating ring for in-progress */}
                                                    {status === "in-progress" && (
                                                        <motion.div
                                                            className="absolute inset-0 rounded-full border-4 border-amber-400"
                                                            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                        />
                                                    )}

                                                    {/* Inner Icon */}
                                                    {status === "completed" && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", delay: globalIndex * 0.08 + 0.2 }}
                                                        >
                                                            <CheckCircle2 className="w-10 h-10 text-white drop-shadow-md" />
                                                        </motion.div>
                                                    )}
                                                    {status === "in-progress" && (
                                                        <motion.div
                                                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                        >
                                                            <Sparkles className="w-10 h-10 text-white drop-shadow-md" />
                                                        </motion.div>
                                                    )}
                                                    {(status === "next-up" || status === "locked") && (
                                                        <Lock className={cn(
                                                            "drop-shadow",
                                                            status === "next-up" ? "w-8 h-8 text-slate-500" : "w-6 h-6 text-slate-400"
                                                        )} />
                                                    )}

                                                    {/* Sequence Number Badge */}
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", delay: globalIndex * 0.08 + 0.3 }}
                                                        className={cn(
                                                            "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-3 border-white shadow-lg",
                                                            status === "completed" ? "bg-green-600 text-white" :
                                                                status === "in-progress" ? "bg-orange-600 text-white" :
                                                                    "bg-slate-400 text-white"
                                                        )}
                                                    >
                                                        {sequenceNumber}
                                                    </motion.div>
                                                </motion.div>

                                                {/* Level Name */}
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: globalIndex * 0.08 + 0.4 }}
                                                    className={cn(
                                                        "mt-3 text-center",
                                                        isLocked && "opacity-30 blur-[1px]"
                                                    )}
                                                >
                                                    <p className={cn(
                                                        "font-bold text-sm leading-tight",
                                                        status === "completed" ? "text-green-700" :
                                                            status === "in-progress" ? "text-amber-800" :
                                                                "text-slate-600"
                                                    )}>
                                                        {upanishad.name}
                                                    </p>
                                                    <span
                                                        className="text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-1"
                                                        style={{ backgroundColor: `${vedaColor.bg}60`, color: vedaColor.text }}
                                                    >
                                                        {upanishad.veda}
                                                    </span>
                                                </motion.div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* "More Levels" Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex flex-col items-center gap-2 px-6 py-4 bg-white/60 backdrop-blur rounded-2xl border border-amber-200 shadow-xl">
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-3 h-3 rounded-full bg-amber-400"
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                />
                            ))}
                        </div>
                        <p className="text-amber-800 font-bold">+93 more Upanishads await</p>
                        <p className="text-amber-600/60 text-sm">Complete current levels to reveal more</p>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Fog Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-100 to-transparent pointer-events-none z-20" />
        </div>
    );
}

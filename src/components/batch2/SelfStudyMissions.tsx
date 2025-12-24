"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Headphones,
    Video,
    FileText,
    Mic,
    PenTool,
    Play,
    Sparkles,
    Brain,
    Flame,
    TrendingUp,
    Clock,
    ChevronRight,
    Star,
    Zap,
    BookOpen,
    Lightbulb,
    Send,
    Trophy,
    Target,
    Rocket,
    GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

// Research content categories with colors
const CATEGORIES = {
    technology: { label: "Technology", color: "from-blue-500 to-cyan-500", bg: "bg-blue-500", icon: Zap },
    health: { label: "Health & Wellness", color: "from-green-500 to-emerald-500", bg: "bg-green-500", icon: Sparkles },
    philosophy: { label: "Philosophy", color: "from-purple-500 to-violet-500", bg: "bg-purple-500", icon: BookOpen },
    science: { label: "Science", color: "from-orange-500 to-amber-500", bg: "bg-orange-500", icon: Lightbulb },
    spirituality: { label: "Spirituality", color: "from-amber-500 to-yellow-500", bg: "bg-amber-500", icon: Star },
};

// Sample research content
const researchContent = [
    {
        id: "r1",
        title: "The Future of AI in Education",
        description: "Explore how artificial intelligence is transforming the way we learn and teach",
        category: "technology",
        type: "podcast",
        duration: "28 min",
        thumbnail: "🤖",
        isNew: true,
        isFeatured: true,
        aiScore: null,
    },
    {
        id: "r2",
        title: "Mindfulness & Mental Clarity",
        description: "Ancient techniques for modern stress relief and enhanced focus",
        category: "health",
        type: "video",
        duration: "15 min",
        thumbnail: "🧘",
        isNew: true,
        isFeatured: false,
        aiScore: 85,
    },
    {
        id: "r3",
        title: "Quantum Physics & Consciousness",
        description: "Where science meets spirituality in the quantum realm",
        category: "science",
        type: "reading",
        duration: "12 pages",
        thumbnail: "⚛️",
        isNew: false,
        isFeatured: false,
        aiScore: 72,
    },
    {
        id: "r4",
        title: "The Art of Strategic Thinking",
        description: "Lessons from ancient wisdom applied to modern decision making",
        category: "philosophy",
        type: "podcast",
        duration: "35 min",
        thumbnail: "🎯",
        isNew: false,
        isFeatured: true,
        aiScore: 90,
    },
    {
        id: "r5",
        title: "Pranayama: Science of Breath",
        description: "Transform your energy through controlled breathing techniques",
        category: "spirituality",
        type: "video",
        duration: "22 min",
        thumbnail: "🌬️",
        isNew: false,
        isFeatured: false,
        aiScore: null,
    },
];

interface ContentItem {
    id: string;
    title: string;
    description: string;
    category: keyof typeof CATEGORIES;
    type: "podcast" | "video" | "reading";
    duration: string;
    thumbnail: string;
    isNew: boolean;
    isFeatured: boolean;
    aiScore: number | null;
}

export default function SelfStudyMissions() {
    const { user } = useAuth();
    const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMode, setSubmissionMode] = useState<"voice" | "written" | null>(null);

    const featuredContent = researchContent.find(c => c.isFeatured && c.isNew) || researchContent[0];
    const filteredContent = activeCategory === "all"
        ? researchContent
        : researchContent.filter(c => c.category === activeCategory);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "podcast": return <Headphones className="w-4 h-4" />;
            case "video": return <Video className="w-4 h-4" />;
            case "reading": return <FileText className="w-4 h-4" />;
            default: return <BookOpen className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-8 -mx-4 md:-mx-6">
            {/* Hero Featured Section */}
            <div className="relative h-[400px] overflow-hidden rounded-none md:rounded-3xl">
                {/* Animated Background */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br",
                    CATEGORIES[featuredContent.category as keyof typeof CATEGORIES].color
                )}>
                    {/* Floating particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-white/20 rounded-full"
                            initial={{
                                x: Math.random() * 100 + "%",
                                y: Math.random() * 100 + "%",
                            }}
                            animate={{
                                y: [null, "-100%"],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 3
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex items-center p-8 md:p-12">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white text-sm font-medium flex items-center gap-1">
                                <Flame className="w-4 h-4 text-yellow-300" />
                                Featured Research
                            </span>
                            {featuredContent.isNew && (
                                <span className="px-3 py-1 bg-red-500 rounded-full text-white text-xs font-bold animate-pulse">
                                    NEW
                                </span>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-7xl mb-4"
                        >
                            {featuredContent.thumbnail}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-4xl font-bold text-white mb-3"
                        >
                            {featuredContent.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/80 text-lg mb-6"
                        >
                            {featuredContent.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-4"
                        >
                            <Button
                                size="lg"
                                className="bg-white text-gray-900 hover:bg-white/90 shadow-xl"
                                onClick={() => setSelectedContent(featuredContent as ContentItem)}
                            >
                                <Play className="w-5 h-5 mr-2 fill-current" />
                                Start Learning
                            </Button>
                            <div className="flex items-center gap-2 text-white/70">
                                {getTypeIcon(featuredContent.type)}
                                <span className="capitalize">{featuredContent.type}</span>
                                <span>•</span>
                                <Clock className="w-4 h-4" />
                                <span>{featuredContent.duration}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
            </div>

            {/* Stats Bar */}
            <div className="px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Rocket, value: "5", label: "Available Content", color: "text-blue-500" },
                        { icon: Trophy, value: "2", label: "Completed", color: "text-green-500" },
                        { icon: TrendingUp, value: "82%", label: "Avg. Understanding", color: "text-purple-500" },
                        { icon: Flame, value: "3", label: "Day Streak", color: "text-orange-500" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                        >
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className={cn("p-2 rounded-xl bg-gray-100 dark:bg-gray-800", stat.color)}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Category Filter */}
            <div className="px-4 md:px-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Button
                        variant={activeCategory === "all" ? "default" : "outline"}
                        className="rounded-full shrink-0"
                        onClick={() => setActiveCategory("all")}
                    >
                        All Topics
                    </Button>
                    {Object.entries(CATEGORIES).map(([key, cat]) => {
                        const Icon = cat.icon;
                        return (
                            <Button
                                key={key}
                                variant={activeCategory === key ? "default" : "outline"}
                                className={cn(
                                    "rounded-full shrink-0",
                                    activeCategory === key && cat.bg
                                )}
                                onClick={() => setActiveCategory(key)}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {cat.label}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Content Grid */}
            <div className="px-4 md:px-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {activeCategory === "all" ? "All Research Content" : CATEGORIES[activeCategory as keyof typeof CATEGORIES]?.label}
                    </h2>
                    <span className="text-sm text-gray-500">{filteredContent.length} items</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredContent.map((content, index) => {
                            const category = CATEGORIES[content.category as keyof typeof CATEGORIES];
                            return (
                                <motion.div
                                    key={content.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="cursor-pointer"
                                    onClick={() => setSelectedContent(content as ContentItem)}
                                >
                                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800">
                                        {/* Thumbnail Area */}
                                        <div className={cn(
                                            "h-32 bg-gradient-to-br flex items-center justify-center relative",
                                            category.color
                                        )}>
                                            <span className="text-5xl">{content.thumbnail}</span>

                                            {/* Type Badge */}
                                            <div className="absolute top-3 left-3 px-2 py-1 bg-black/30 backdrop-blur rounded-full text-white text-xs flex items-center gap-1">
                                                {getTypeIcon(content.type)}
                                                <span className="capitalize">{content.type}</span>
                                            </div>

                                            {/* New Badge */}
                                            {content.isNew && (
                                                <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 rounded-full text-white text-xs font-bold">
                                                    NEW
                                                </div>
                                            )}

                                            {/* AI Score Badge */}
                                            {content.aiScore !== null && (
                                                <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <Brain className="w-3 h-3 text-purple-600" />
                                                    <span className={cn(
                                                        content.aiScore >= 80 ? "text-green-600" :
                                                            content.aiScore >= 60 ? "text-amber-600" : "text-red-600"
                                                    )}>{content.aiScore}%</span>
                                                </div>
                                            )}
                                        </div>

                                        <CardContent className="p-4">
                                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
                                                {content.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                                {content.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{content.duration}</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Content Detail Modal */}
            <AnimatePresence>
                {selectedContent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedContent(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className={cn(
                                "h-48 bg-gradient-to-br flex items-center justify-center relative",
                                CATEGORIES[selectedContent.category].color
                            )}>
                                <span className="text-8xl">{selectedContent.thumbnail}</span>
                                <button
                                    onClick={() => setSelectedContent(null)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/50"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Title & Meta */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-xs font-medium text-white",
                                            CATEGORIES[selectedContent.category].bg
                                        )}>
                                            {CATEGORIES[selectedContent.category].label}
                                        </span>
                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                            {getTypeIcon(selectedContent.type)}
                                            {selectedContent.duration}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {selectedContent.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        {selectedContent.description}
                                    </p>
                                </div>

                                {/* Action Button */}
                                <Button className={cn(
                                    "w-full h-14 text-lg bg-gradient-to-r text-white shadow-xl",
                                    CATEGORIES[selectedContent.category].color
                                )}>
                                    <Play className="w-6 h-6 mr-2 fill-white" />
                                    {selectedContent.type === "podcast" ? "Listen Now" :
                                        selectedContent.type === "video" ? "Watch Now" : "Start Reading"}
                                </Button>

                                {/* Divider */}
                                <div className="border-t border-gray-200 dark:border-gray-700" />

                                {/* Response Section */}
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-purple-500" />
                                        Reflect & Respond
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        After consuming this content, share your understanding. AI will analyze your response.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSubmissionMode("voice")}
                                            className={cn(
                                                "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                                                submissionMode === "voice"
                                                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-14 h-14 rounded-full flex items-center justify-center",
                                                submissionMode === "voice" ? "bg-purple-500" : "bg-gray-100 dark:bg-gray-800"
                                            )}>
                                                <Mic className={cn(
                                                    "w-7 h-7",
                                                    submissionMode === "voice" ? "text-white" : "text-gray-500"
                                                )} />
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">Voice Response</span>
                                            <span className="text-xs text-gray-500">Record your thoughts</span>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSubmissionMode("written")}
                                            className={cn(
                                                "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                                                submissionMode === "written"
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-14 h-14 rounded-full flex items-center justify-center",
                                                submissionMode === "written" ? "bg-blue-500" : "bg-gray-100 dark:bg-gray-800"
                                            )}>
                                                <PenTool className={cn(
                                                    "w-7 h-7",
                                                    submissionMode === "written" ? "text-white" : "text-gray-500"
                                                )} />
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">Written Response</span>
                                            <span className="text-xs text-gray-500">Type your reflection</span>
                                        </motion.button>
                                    </div>

                                    {submissionMode && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                        >
                                            {submissionMode === "voice" ? (
                                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.1, 1] }}
                                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                                    >
                                                        <Button
                                                            size="lg"
                                                            className="rounded-full w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 shadow-xl"
                                                        >
                                                            <Mic className="w-8 h-8" />
                                                        </Button>
                                                    </motion.div>
                                                    <p className="mt-4 text-gray-500">Tap to start recording</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <textarea
                                                        className="w-full h-32 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                                                        placeholder="Share your thoughts, key learnings, and reflections..."
                                                    />
                                                </div>
                                            )}

                                            <Button className="w-full mt-4 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                                                <Send className="w-5 h-5 mr-2" />
                                                Submit for AI Analysis
                                            </Button>
                                        </motion.div>
                                    )}
                                </div>

                                {/* AI Analysis Preview */}
                                {selectedContent.aiScore !== null && (
                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                                <Brain className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-purple-900 dark:text-purple-100">AI Analysis Report</p>
                                                <p className="text-sm text-purple-600 dark:text-purple-400">Based on your previous response</p>
                                            </div>
                                            <div className="ml-auto text-3xl font-bold text-purple-600">
                                                {selectedContent.aiScore}%
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Great understanding! You demonstrated clear comprehension of the core concepts.
                                            Consider exploring deeper connections between this topic and practical applications.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

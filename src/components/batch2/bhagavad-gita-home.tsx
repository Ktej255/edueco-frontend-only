"use client";

import React from "react";
import { BookOpen, Scroll, Flame, Heart, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Chapter {
    number: number;
    sanskrit: string;
    title: string;
    verses: number;
    description: string;
}

const chapters: Chapter[] = [
    { number: 1, sanskrit: "अर्जुन विषाद योग", title: "Arjuna's Distress", verses: 47, description: "The battlefield dilemma where Arjuna faces his kin" },
    { number: 2, sanskrit: "सांख्य योग", title: "Samkhya Yoga", verses: 72, description: "The yoga of knowledge - eternal nature of the soul" },
    { number: 3, sanskrit: "कर्म योग", title: "Karma Yoga", verses: 43, description: "The yoga of selfless action" },
    { number: 4, sanskrit: "ज्ञान कर्म संन्यास योग", title: "Jnana Karma Yoga", verses: 42, description: "Transcendental knowledge" },
    { number: 5, sanskrit: "कर्म संन्यास योग", title: "Karma Sannyasa Yoga", verses: 29, description: "Action and renunciation" },
    { number: 6, sanskrit: "आत्मसंयम योग", title: "Dhyana Yoga", verses: 47, description: "The yoga of meditation" },
    { number: 7, sanskrit: "ज्ञान विज्ञान योग", title: "Jnana Vijnana Yoga", verses: 30, description: "Knowledge and wisdom" },
    { number: 8, sanskrit: "अक्षर ब्रह्म योग", title: "Akshara Brahma Yoga", verses: 28, description: "The imperishable Brahman" },
    { number: 9, sanskrit: "राज विद्या राज गुह्य योग", title: "Raja Vidya Yoga", verses: 34, description: "Royal knowledge, royal secret" },
    { number: 10, sanskrit: "विभूति योग", title: "Vibhuti Yoga", verses: 42, description: "Divine glories" },
    { number: 11, sanskrit: "विश्वरूप दर्शन योग", title: "Vishvarupa Darshana", verses: 55, description: "The cosmic form" },
    { number: 12, sanskrit: "भक्ति योग", title: "Bhakti Yoga", verses: 20, description: "The yoga of devotion" },
    { number: 13, sanskrit: "क्षेत्र क्षेत्रज्ञ विभाग योग", title: "Kshetra Kshetrajna", verses: 35, description: "Nature and the enjoyer" },
    { number: 14, sanskrit: "गुणत्रय विभाग योग", title: "Gunatraya Vibhaga", verses: 27, description: "The three qualities" },
    { number: 15, sanskrit: "पुरुषोत्तम योग", title: "Purushottama Yoga", verses: 20, description: "The supreme person" },
    { number: 16, sanskrit: "दैवासुर सम्पद्विभाग योग", title: "Daivasura Sampad", verses: 24, description: "Divine and demonic natures" },
    { number: 17, sanskrit: "श्रद्धात्रय विभाग योग", title: "Shraddhatraya", verses: 28, description: "The threefold faith" },
    { number: 18, sanskrit: "मोक्ष संन्यास योग", title: "Moksha Sannyasa", verses: 78, description: "Liberation through renunciation" },
];

const scriptureCards = [
    {
        icon: BookOpen,
        title: "Bhagavad Gita",
        description: "700 verses of divine wisdom covering karma, jnana, and bhakti yoga.",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
    },
    {
        icon: Scroll,
        title: "Upanishads",
        description: "Philosophical texts exploring Brahman, Atman, and ultimate reality.",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
    },
    {
        icon: Flame,
        title: "Kundalini & Yoga",
        description: "The serpent power within - chakras, nadis, and awakening.",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
    },
];

export default function BhagavadGitaHome() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-900/40 via-orange-900/30 to-red-900/20 p-8 border border-amber-500/20">
                <div className="absolute top-4 right-8 text-8xl text-amber-500/20 font-serif">ॐ</div>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl font-bold text-amber-100 mb-2">Gateway to Eternal Wisdom</h1>
                    <p className="text-lg text-amber-200/80 italic mb-4">
                        Explore the Sacred Teachings of the Bhagavad Gita
                    </p>
                    <p className="text-amber-100/60 mb-6">
                        Discover the timeless dialogue between Lord Krishna and Arjuna on the battlefield of Kurukshetra.
                        A comprehensive guide to dharma, karma, and the path to spiritual liberation.
                    </p>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
                            Explore Chapters →
                        </button>
                        <button className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 rounded-lg font-medium transition-colors border border-amber-500/30">
                            Introduction
                        </button>
                    </div>
                </div>
            </div>

            {/* Sacred Scriptures */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">Sacred Scriptures</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {scriptureCards.map((card, i) => (
                        <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20">
                            <CardHeader className="pb-2">
                                <div className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                </div>
                                <CardTitle className="text-lg">{card.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{card.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* The Divine Trinity */}
            <Card className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/20">
                <CardHeader>
                    <CardTitle className="text-lg">The Divine Trinity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        <strong className="text-foreground">Brahma, Vishnu, and Siva</strong> make the Triad in Hinduism.
                        Their power is vested in their Sakthis. Without their Sakthis, the Gods are powerless.
                        <strong className="text-foreground"> Brahma and Sarasvati, Vishnu and Sri, & Siva and Sakthi</strong> are the power couples.
                    </p>
                </CardContent>
            </Card>

            {/* 18 Chapters Grid */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    18 Chapters of Bhagavad Gita
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {chapters.map(chapter => (
                        <Card
                            key={chapter.number}
                            className="hover:shadow-md transition-all cursor-pointer group hover:border-amber-500/30"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {chapter.number}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-amber-600 font-medium truncate">{chapter.sanskrit}</p>
                                        <h3 className="font-semibold text-foreground group-hover:text-amber-600 transition-colors truncate">
                                            {chapter.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">{chapter.verses} verses</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

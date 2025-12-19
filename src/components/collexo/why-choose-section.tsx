'use client';

import React from 'react';
import {
    Star,
    Play,
    CheckCircle2,
    Sparkles,
    Target
} from 'lucide-react';

const benefits = [
    'Designed for the specific needs of education sector',
    'Advanced solutions for timely fee collection',
    'Smooth financial operations guaranteed',
    'Real-time visibility into finances',
    'Automated workflows save time',
    'Enterprise-grade security',
];

export default function WhyChooseSection() {
    return (
        <section className="collexo-section bg-slate-50 dark:bg-slate-900">
            <div className="collexo-container">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="collexo-chip mb-4">
                        <Star className="w-4 h-4" />
                        Benefits
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Why Choose{' '}
                        <span className="collexo-gradient-text">SaritClasses CRM?</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Designed to meet the unique needs of educational institutions, here's why we're the game-changers
                        for financial stability and growth
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Benefits List */}
                    <div>
                        <div className="space-y-4 mb-8">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow animate-fade-in-up stagger-${index + 1}`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {benefit}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Platform Highlight */}
                        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl text-white">
                            <div className="flex items-center gap-3 mb-3">
                                <Sparkles className="w-6 h-6" />
                                <h3 className="text-xl font-bold">SaritClasses Central</h3>
                            </div>
                            <p className="text-white/90 mb-4">
                                A powerful SaaS platform for fee management—centralizing all aspects of digital fee payment
                                management from application to enrollment and beyond.
                            </p>
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                <Target className="w-4 h-4" />
                                Purpose-built for education industry
                            </div>
                        </div>
                    </div>

                    {/* Right - Video Section */}
                    <div>
                        <div className="collexo-video-wrapper">
                            <div className="aspect-video bg-gradient-to-br from-slate-900 to-indigo-900 rounded-xl flex items-center justify-center relative group cursor-pointer">
                                {/* Video Placeholder with Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Play className="w-7 h-7 text-indigo-600 fill-current ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Dashboard Preview Elements */}
                                <div className="absolute inset-4 opacity-30">
                                    <div className="grid grid-cols-3 gap-2 h-full">
                                        <div className="col-span-2 bg-white/10 rounded-lg"></div>
                                        <div className="bg-white/10 rounded-lg"></div>
                                        <div className="bg-white/10 rounded-lg"></div>
                                        <div className="col-span-2 bg-white/10 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video CTA */}
                        <div className="text-center mt-6">
                            <button className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-3 transition-all">
                                <Play className="w-5 h-5" />
                                Watch Video: See SaritClasses Central in Action
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

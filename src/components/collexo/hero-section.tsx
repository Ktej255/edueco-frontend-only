'use client';

import React from 'react';
import { Calendar, ArrowRight, Play, CheckCircle } from 'lucide-react';

const highlights = [
    'Lead Management',
    'Student Enrollment',
    'Fee Collection',
    'Parent Communication',
];

export default function HeroSection() {
    return (
        <section className="collexo-hero-bg min-h-screen flex items-center pt-20">
            {/* Animated Orbs */}
            <div className="collexo-orb collexo-orb-1" />
            <div className="collexo-orb collexo-orb-2" />
            <div className="collexo-orb collexo-orb-3" />

            <div className="collexo-container relative z-10 px-6 py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-white/90 text-sm font-medium">Trusted by 500+ Educational Institutions</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Complete{' '}
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                CRM & Management
                            </span>{' '}
                            Platform for Education
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
                            From lead capture to enrollment, fee collection to parent engagement—SaritClasses CRM is your all-in-one solution for managing coaching institutes and educational organizations.
                        </p>

                        {/* Highlight Pills */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                            {highlights.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2"
                                >
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span className="text-white/80 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button className="collexo-btn-primary text-lg px-8 py-4">
                                <Calendar className="w-5 h-5" />
                                Schedule a Demo
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                    <Play className="w-5 h-5 fill-current" />
                                </div>
                                <span className="font-medium">Watch Demo</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Dashboard Preview */}
                    <div className="relative hidden lg:block">
                        <div className="relative">
                            {/* Main Dashboard Card */}
                            <div className="collexo-glass rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-white font-semibold">Fee Dashboard</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <div className="text-2xl font-bold text-white">₹2.4Cr</div>
                                        <div className="text-sm text-white/60">Total Collected</div>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <div className="text-2xl font-bold text-emerald-400">98%</div>
                                        <div className="text-sm text-white/60">Collection Rate</div>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <div className="text-2xl font-bold text-white">1,247</div>
                                        <div className="text-sm text-white/60">Active Students</div>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <div className="text-2xl font-bold text-cyan-400">24</div>
                                        <div className="text-sm text-white/60">Pending Dues</div>
                                    </div>
                                </div>

                                {/* Chart Placeholder */}
                                <div className="h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl flex items-end p-4 gap-2">
                                    {[60, 80, 45, 90, 70, 85, 95].map((height, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t opacity-80"
                                            style={{ height: `${height}%` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Floating Card 1 */}
                            <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xl animate-fade-in-up stagger-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-white">Payment Received</div>
                                        <div className="text-sm text-slate-500">₹45,000 • Just now</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card 2 */}
                            <div className="absolute -bottom-4 -left-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xl animate-fade-in-up stagger-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-white">Auto-Debit</div>
                                        <div className="text-sm text-slate-500">23 scheduled today</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

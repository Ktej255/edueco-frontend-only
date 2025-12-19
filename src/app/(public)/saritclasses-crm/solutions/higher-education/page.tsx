'use client';

import React from 'react';
import Link from 'next/link';
import '../../saritclasses.css';
import {
    GraduationCap,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Users,
    Building2,
    Globe,
    BookOpen,
    TrendingUp,
    Shield
} from 'lucide-react';

const challenges = [
    {
        title: 'Complex Fee Structures',
        description: 'Managing various fee components like tuition, hostel, transport, and exam fees manually.',
    },
    {
        title: 'Legacy Systems',
        description: 'Outdated systems that don\'t talk to each other, creating data silos and inefficiencies.',
    },
    {
        title: 'Student Experience',
        description: 'Frustrating payment experiences for students and parents leading to delays.',
    },
];

const solutions = [
    {
        icon: Building2,
        title: 'Unified Campus Management',
        description: 'Connect all departments - Admissions, Finance, Academics, and Alumni - on a single platform.',
    },
    {
        icon: Globe,
        title: 'Global Payments',
        description: 'Accept international payments from students across the globe with ease.',
    },
    {
        icon: Shield,
        title: 'Regulatory Compliance',
        description: 'Stay compliant with UGC, AICTE, and NAAC requirements with automated reporting.',
    },
    {
        icon: TrendingUp,
        title: 'Alumni Engagement',
        description: 'Monetize alumni networks with donation portals and event ticketing.',
    },
];

const benefits = [
    '360° Student View',
    'Automated Reconciliation',
    'Real-time Analytics',
    'Paperless Operations',
    'Mobile-first Experience',
    'Seamless Integration',
];

export default function HigherEducationPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <nav className="collexo-container flex items-center justify-between px-6 py-4">
                    <Link href="/saritclasses-crm" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl collexo-gradient flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-2xl font-bold collexo-gradient-text">SaritClasses</span>
                    </Link>
                    <Link
                        href="/saritclasses-crm"
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="collexo-hero-bg pt-32 pb-20">
                <div className="collexo-orb collexo-orb-1" />
                <div className="collexo-orb collexo-orb-2" />

                <div className="collexo-container relative z-10 px-6">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                            <GraduationCap className="w-4 h-4 text-indigo-400" />
                            <span className="text-white/90 text-sm font-medium">Higher Education</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Digital Transformation for{' '}
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                Universities & Colleges
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Modernize your campus with a unified platform for admissions, fee collection,
                            and student lifecycle management.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="collexo-btn-primary text-lg px-8 py-4">
                                Schedule a Demo
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <Link
                                href="/saritclasses-crm#products"
                                className="text-white/80 hover:text-white transition-colors font-medium"
                            >
                                View Products →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Challenges Section */}
            <section className="py-20 bg-white dark:bg-slate-950">
                <div className="collexo-container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Challenges We <span className="collexo-gradient-text">Solve</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {challenges.map((challenge, index) => (
                            <div key={index} className="collexo-card p-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{challenge.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {challenge.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solutions Section */}
            <section className="collexo-section bg-slate-50 dark:bg-slate-900">
                <div className="collexo-container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Tailored for <span className="collexo-gradient-text">Higher Ed</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {solutions.map((solution, index) => (
                            <div key={index} className="flex gap-6 p-6 rounded-2xl bg-white dark:bg-slate-950 shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                                    <solution.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{solution.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{solution.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-slate-900 dark:bg-slate-950">
                <div className="collexo-container">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Join 100+ Leading Universities
                            </h2>
                            <p className="text-xl text-indigo-100 mb-8">
                                Transform your institution with SaritClasses CRM today.
                            </p>
                            <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-4 px-8 rounded-xl transition-colors inline-flex items-center gap-2">
                                Schedule a Personalized Demo
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

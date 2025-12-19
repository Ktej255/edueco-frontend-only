'use client';

import React from 'react';
import Link from 'next/link';
import '../../saritclasses.css';
import {
    School,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Users,
    Bus,
    CreditCard,
    BookOpen,
    MessageCircle,
    Calendar
} from 'lucide-react';

const challenges = [
    {
        title: 'Fee Collection',
        description: 'Tracking monthly fees, transport fees, and other miscellaneous payments manually.',
    },
    {
        title: 'Parent Communication',
        description: 'Keeping parents informed about fee dues, attendance, and school events effectively.',
    },
    {
        title: 'Safety & Security',
        description: 'Managing student safety during transport and campus access control.',
    },
];

const solutions = [
    {
        icon: CreditCard,
        title: 'Automated Fee Reminders',
        description: 'Send automated SMS/WhatsApp reminders to parents for monthly fees.',
    },
    {
        icon: Bus,
        title: 'Transport Management',
        description: 'Track school buses and manage transport fees seamlessly.',
    },
    {
        icon: MessageCircle,
        title: 'Parent Engagement App',
        description: 'A dedicated app for parents to pay fees, view report cards, and track attendance.',
    },
    {
        icon: Users,
        title: 'Admission Management',
        description: 'Streamline the entire admission process from enquiry to enrollment.',
    },
];

export default function K12SchoolsPage() {
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
                            <School className="w-4 h-4 text-emerald-400" />
                            <span className="text-white/90 text-sm font-medium">K-12 Schools</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Smart School Management for{' '}
                            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                                Modern Education
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Empower your school with a comprehensive platform for fee management,
                            parent communication, and administrative excellence.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="collexo-btn-primary text-lg px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500">
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
                            Simplify School <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Administration</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {challenges.map((challenge, index) => (
                            <div key={index} className="collexo-card p-8 border-emerald-100 dark:border-emerald-900/20">
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
                            Features for <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">K-12 Success</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {solutions.map((solution, index) => (
                            <div key={index} className="flex gap-6 p-6 rounded-2xl bg-white dark:bg-slate-950 shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                                    <solution.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
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
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Trusted by 500+ Schools
                            </h2>
                            <p className="text-xl text-emerald-100 mb-8">
                                Make your school future-ready with SaritClasses.
                            </p>
                            <button className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold py-4 px-8 rounded-xl transition-colors inline-flex items-center gap-2">
                                Schedule a Demo
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

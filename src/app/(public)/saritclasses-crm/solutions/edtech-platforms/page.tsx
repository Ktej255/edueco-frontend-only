'use client';

import React from 'react';
import Link from 'next/link';
import '../../saritclasses.css';
import {
    Laptop,
    ArrowRight,
    ArrowLeft,
    Zap,
    Globe,
    CreditCard,
    Code,
    BarChart3,
    Webhook
} from 'lucide-react';

const challenges = [
    {
        title: 'Scalability',
        description: 'Handling payments and enrollments at scale without system crashes.',
    },
    {
        title: 'Integration',
        description: 'Connecting payment gateways with LMS and CRM systems seamlessly.',
    },
    {
        title: 'Subscription Management',
        description: 'Managing recurring billing and subscription churn effectively.',
    },
];

const solutions = [
    {
        icon: Webhook,
        title: 'Robust APIs',
        description: 'Developer-friendly APIs to integrate payments and CRM features into your platform.',
    },
    {
        icon: Zap,
        title: 'Subscription Engine',
        description: 'Powerful engine to handle recurring billing, free trials, and upgrades.',
    },
    {
        icon: Globe,
        title: 'Global Reach',
        description: 'Scale your EdTech globally with support for international currencies and payments.',
    },
    {
        icon: BarChart3,
        title: 'Revenue Analytics',
        description: 'Deep insights into MRR, ARR, churn, and customer lifetime value.',
    },
];

export default function EdTechPage() {
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
                            <Laptop className="w-4 h-4 text-purple-400" />
                            <span className="text-white/90 text-sm font-medium">EdTech Platforms</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Scale Your{' '}
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                                EdTech Business
                            </span>{' '}
                            Faster
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            The infrastructure layer for modern EdTech. Automate payments, subscriptions,
                            and enrollments with our powerful API-first platform.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="collexo-btn-primary text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500">
                                Talk to Sales
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
                            Built for <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Scale</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {challenges.map((challenge, index) => (
                            <div key={index} className="collexo-card p-8 border-purple-100 dark:border-purple-900/20">
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
                            API-First <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Solutions</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {solutions.map((solution, index) => (
                            <div key={index} className="flex gap-6 p-6 rounded-2xl bg-white dark:bg-slate-950 shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                                    <solution.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Powering Top EdTechs
                            </h2>
                            <p className="text-xl text-purple-100 mb-8">
                                Integrate SaritClasses APIs in minutes, not months.
                            </p>
                            <button className="bg-white text-purple-600 hover:bg-purple-50 font-bold py-4 px-8 rounded-xl transition-colors inline-flex items-center gap-2">
                                Read API Docs
                                <Code className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

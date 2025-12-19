'use client';

import React from 'react';
import Link from 'next/link';
import '../saritclasses.css';
import {
    RefreshCw,
    Bell,
    Calendar,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Clock,
    Shield,
    Zap,
    Settings,
    CreditCard,
    BellRing,
    Ban,
    TrendingUp
} from 'lucide-react';

const features = [
    {
        icon: RefreshCw,
        title: 'Auto-Debit on Due Dates',
        description: 'Automatically debit fees from parent accounts on scheduled due dates. No manual intervention needed.',
    },
    {
        icon: BellRing,
        title: 'Smart Reminders',
        description: 'Send automated reminders before debit date via SMS, Email, and WhatsApp.',
    },
    {
        icon: Ban,
        title: 'Eliminate Follow-ups',
        description: 'No more chasing parents for payments. The system handles everything automatically.',
    },
    {
        icon: Settings,
        title: 'Flexible Configuration',
        description: 'Set custom schedules—weekly, monthly, quarterly, or any custom frequency.',
    },
];

const howItWorks = [
    { step: '1', title: 'Parent Registers', description: 'One-time mandate registration with bank account or card' },
    { step: '2', title: 'Set Schedule', description: 'Configure payment frequency and amount' },
    { step: '3', title: 'Auto Reminder', description: 'System sends reminder before due date' },
    { step: '4', title: 'Auto Debit', description: 'Fee is automatically debited on due date' },
];

const benefits = [
    'Zero manual follow-ups',
    'Predictable cash flow',
    'Higher collection rates',
    'RBI compliant mandates',
    'Multi-bank support',
    'Real-time notifications',
    'Easy cancellation process',
    'Detailed reporting',
];

const stats = [
    { value: '95%', label: 'Collection Rate' },
    { value: '0', label: 'Manual Follow-ups' },
    { value: '₹200Cr+', label: 'Auto-debited' },
    { value: '50K+', label: 'Active Mandates' },
];

export default function AutoDebitPage() {
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
                            <RefreshCw className="w-4 h-4 text-purple-400" />
                            <span className="text-white/90 text-sm font-medium">Recurring Payments</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Automate Recurring{' '}
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                                Fee Collection
                            </span>{' '}
                            with AutoDebit
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Set it and forget it. Auto-debit fees on due dates from parent accounts.
                            Eliminate follow-ups and achieve 95%+ collection rates.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="collexo-btn-primary text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500">
                                Get Started
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <Link
                                href="/saritclasses-crm#products"
                                className="text-white/80 hover:text-white transition-colors font-medium"
                            >
                                View All Products →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="collexo-container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="collexo-section bg-slate-50 dark:bg-slate-900">
                <div className="collexo-container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            How <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">AutoDebit</span> Works
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {howItWorks.map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">{item.step}</span>
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="collexo-section bg-white dark:bg-slate-950">
                <div className="collexo-container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Powerful <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Features</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="collexo-section bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-950">
                <div className="collexo-container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                Complete{' '}
                                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">AutoDebit Solution</span>
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
                                <RefreshCw className="w-32 h-32 text-white/80" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="collexo-section bg-slate-900 dark:bg-slate-950">
                <div className="collexo-container text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Automate Your Collections?
                    </h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                        Eliminate manual follow-ups and achieve predictable cash flow
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="collexo-btn-primary text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500">
                            Schedule a Demo
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <Link
                            href="/saritclasses-crm"
                            className="text-white/80 hover:text-white transition-colors font-medium"
                        >
                            ← Back to SaritClasses CRM
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

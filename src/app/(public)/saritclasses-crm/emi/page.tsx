'use client';

import React from 'react';
import Link from 'next/link';
import '../saritclasses.css';
import {
    Banknote,
    Clock,
    TrendingUp,
    Users,
    ArrowRight,
    CheckCircle2,
    ArrowLeft,
    Calculator,
    Calendar,
    Shield,
    Percent,
    FileText,
    Building2
} from 'lucide-react';

const emiOptions = [
    {
        icon: Clock,
        name: 'Short-Term EMI',
        description: '3-6 months payment plans',
        highlight: 'No-cost EMI available'
    },
    {
        icon: Calendar,
        name: 'Long-Term Loans',
        description: '12-36 months financing',
        highlight: 'Low interest rates'
    },
    {
        icon: Percent,
        name: 'Zero-Cost EMI',
        description: 'No additional charges',
        highlight: 'Institution sponsored'
    },
    {
        icon: Building2,
        name: 'Partner Banks',
        description: '15+ partner banks',
        highlight: 'Instant approval'
    },
];

const features = [
    {
        icon: TrendingUp,
        title: 'Boost Enrollments',
        description: 'Make education affordable with flexible payment options. See 40% increase in enrollment rates.',
    },
    {
        icon: Banknote,
        title: 'Upfront Collection',
        description: 'Get full fee amount on Day 1 while parents pay in easy installments over time.',
    },
    {
        icon: Calculator,
        title: 'Flexible Plans',
        description: 'Create custom EMI plans—short term, long term, or zero-cost options for different courses.',
    },
    {
        icon: Shield,
        title: 'Risk-Free',
        description: 'Zero default risk for institutions. Banks handle all collections and follow-ups.',
    },
];

const benefits = [
    'Instant loan approval',
    'Minimal documentation',
    'No collateral required',
    '15+ partner banks',
    'Custom EMI tenures',
    'Zero-cost EMI options',
    'Digital KYC process',
    'Real-time tracking',
];

const stats = [
    { value: '40%', label: 'Enrollment Increase' },
    { value: '₹500Cr+', label: 'Loans Disbursed' },
    { value: '2 mins', label: 'Avg. Approval Time' },
    { value: '99%', label: 'Approval Rate' },
];

export default function EMIPage() {
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
                            <Banknote className="w-4 h-4 text-emerald-400" />
                            <span className="text-white/90 text-sm font-medium">Education Financing</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Flexible{' '}
                            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                EMI Solutions
                            </span>{' '}
                            for Education
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Make education affordable with flexible payment plans. Get full fees upfront while
                            parents pay in easy monthly installments. Boost enrollments by 40%.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="collexo-btn-primary text-lg px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500">
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
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EMI Options Section */}
            <section className="collexo-section bg-slate-50 dark:bg-slate-900">
                <div className="collexo-container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Multiple <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">EMI Options</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Choose the plan that works best for your institution and students
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {emiOptions.map((option, index) => (
                            <div
                                key={index}
                                className="collexo-card p-6 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-4">
                                    <option.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{option.name}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{option.description}</p>
                                <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                                    {option.highlight}
                                </span>
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
                            Why Choose <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">SaritClasses EMI</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
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
            <section className="collexo-section bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-950">
                <div className="collexo-container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                Complete{' '}
                                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">EMI Solution</span>
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center">
                                <Banknote className="w-32 h-32 text-white/80" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="collexo-section bg-slate-900 dark:bg-slate-950">
                <div className="collexo-container text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Boost Your Enrollments?
                    </h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                        Partner with us to offer flexible EMI options to your students
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="collexo-btn-primary text-lg px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500">
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

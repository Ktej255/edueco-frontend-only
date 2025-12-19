'use client';

import React from 'react';
import Link from 'next/link';
import {
    CreditCard,
    Banknote,
    RefreshCw,
    Wallet,
    Globe,
    Clock,
    TrendingUp,
    Bell,
    ArrowRight,
    Sparkles
} from 'lucide-react';

const products = [
    {
        id: 'collect',
        name: 'Collect',
        tagline: 'Automate fee collection through multiple payment modes in one place.',
        icon: CreditCard,
        color: 'from-indigo-500 to-blue-500',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        href: '/saritclasses-crm/collect',
        features: [
            { icon: CreditCard, text: 'Multiple payment modes' },
            { icon: Globe, text: 'Unifying payments across platforms' },
            { icon: Globe, text: 'Handle international payments' },
        ],
    },
    {
        id: 'emi',
        name: 'EMI',
        tagline: 'Ensure upfront fee collection on Day 1 with a flexible fee payment solution for parents.',
        icon: Banknote,
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        href: '/saritclasses-crm/emi',
        features: [
            { icon: Clock, text: 'Short-Term EMI' },
            { icon: TrendingUp, text: 'Long-Term Loans' },
            { icon: TrendingUp, text: 'Enrollment growth acceleration' },
        ],
    },
    {
        id: 'autodebit',
        name: 'AutoDebit',
        tagline: 'Auto-debit fees on due dates from the parent\'s account and streamline recurring payments.',
        icon: RefreshCw,
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        iconColor: 'text-purple-600 dark:text-purple-400',
        href: '/saritclasses-crm/autodebit',
        features: [
            { icon: RefreshCw, text: 'Auto-Debit subscription payment' },
            { icon: Bell, text: 'Seamless Fee Reminders' },
            { icon: Bell, text: 'Eliminate Follow-ups' },
        ],
    },
    {
        id: 'pixi',
        name: 'Pixi',
        tagline: 'Enable convenience for students with one card for ID, payments, and campus access.',
        icon: Wallet,
        color: 'from-orange-500 to-amber-500',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        iconColor: 'text-orange-600 dark:text-orange-400',
        href: '/saritclasses-crm/pixi',
        features: [
            { icon: Wallet, text: 'All-in-one companion' },
            { icon: Sparkles, text: 'Tap-and-Go payments' },
            { icon: Sparkles, text: 'Rewards on every spend' },
        ],
    },
];

export default function ProductsSection() {
    return (
        <section id="products" className="collexo-section bg-slate-50 dark:bg-slate-900">
            <div className="collexo-container">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="collexo-chip mb-4">
                        <Sparkles className="w-4 h-4" />
                        Unified Platform
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        A full-stack fee payment solution,
                        <br />
                        <span className="collexo-gradient-text">purpose-built for the education industry</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        From higher education and K-12 schools to EdTech platforms, online degree programmes and coaching institutes—
                        if your organization aims to automate fee processes while improving cash flow, SaritClasses CRM's product line is your ideal solution.
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            id={product.id}
                            className={`collexo-card collexo-product-card p-6 animate-fade-in-up stagger-${index + 1}`}
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl ${product.bgColor} flex items-center justify-center mb-4`}>
                                <product.icon className={`w-7 h-7 ${product.iconColor}`} />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {product.name}
                            </h3>

                            {/* Tagline */}
                            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
                                {product.tagline}
                            </p>

                            {/* Features */}
                            <ul className="space-y-3 mb-6">
                                {product.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <div className={`w-6 h-6 rounded-lg ${product.bgColor} flex items-center justify-center flex-shrink-0`}>
                                            <feature.icon className={`w-3.5 h-3.5 ${product.iconColor}`} />
                                        </div>
                                        {feature.text}
                                    </li>
                                ))}
                            </ul>

                            {/* Know More Link */}
                            <Link
                                href={product.href}
                                className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:gap-3 transition-all"
                            >
                                Know More
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

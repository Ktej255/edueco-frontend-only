'use client';

import React from 'react';
import Link from 'next/link';
import '../saritclasses.css';
import {
    CreditCard,
    Globe,
    Smartphone,
    Building2,
    QrCode,
    Wallet,
    ArrowRight,
    CheckCircle2,
    ArrowLeft,
    Zap,
    Shield,
    Clock,
    TrendingUp
} from 'lucide-react';

const paymentModes = [
    { icon: CreditCard, name: 'Credit/Debit Cards', description: 'All major cards accepted' },
    { icon: Building2, name: 'Net Banking', description: '100+ banks supported' },
    { icon: Wallet, name: 'UPI', description: 'Google Pay, PhonePe, Paytm' },
    { icon: QrCode, name: 'QR Payments', description: 'Scan and pay instantly' },
    { icon: Globe, name: 'International Payments', description: 'PayPal, Stripe, Wire transfers' },
    { icon: Smartphone, name: 'Mobile Wallets', description: 'All popular e-wallets' },
];

const features = [
    {
        icon: Zap,
        title: 'Instant Collection',
        description: 'Collect fees in real-time with instant payment confirmations and automated receipts.',
    },
    {
        icon: Shield,
        title: 'Secure Transactions',
        description: 'PCI-DSS compliant with 256-bit SSL encryption for maximum security.',
    },
    {
        icon: Clock,
        title: 'Automated Reminders',
        description: 'Schedule fee reminders via SMS, Email, and WhatsApp automatically.',
    },
    {
        icon: TrendingUp,
        title: 'Real-time Dashboard',
        description: 'Track collections, pending dues, and financial health at a glance.',
    },
];

const benefits = [
    'Multiple payment modes in one place',
    'Unified payment dashboard',
    'Automated fee receipts',
    'Parent payment portal',
    'Bulk fee collection',
    'Custom fee structures',
    'Multi-branch support',
    'Real-time reconciliation',
];

export default function CollectPage() {
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
                            <CreditCard className="w-4 h-4 text-indigo-400" />
                            <span className="text-white/90 text-sm font-medium">Fee Collection</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Collect Fees Through{' '}
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                Multiple Payment Modes
                            </span>{' '}
                            in One Place
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Automate your fee collection with support for all payment methods—cards, UPI, net banking,
                            international payments, and more. Give parents the flexibility they need.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="collexo-btn-primary text-lg px-8 py-4">
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

            {/* Payment Modes Section */}
            <section className="collexo-section bg-slate-50 dark:bg-slate-900">
                <div className="collexo-container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Accept Payments from <span className="collexo-gradient-text">Every Channel</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Give parents the flexibility to pay through their preferred payment method
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paymentModes.map((mode, index) => (
                            <div
                                key={index}
                                className="collexo-card p-6 flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                                    <mode.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{mode.name}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{mode.description}</p>
                                </div>
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
                            Powerful Features for <span className="collexo-gradient-text">Seamless Collection</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900"
                            >
                                <div className="w-14 h-14 rounded-2xl collexo-gradient flex items-center justify-center flex-shrink-0">
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
            <section className="collexo-section bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950">
                <div className="collexo-container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                Everything You Need for{' '}
                                <span className="collexo-gradient-text">Fee Collection</span>
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
                            <div className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center">
                                <CreditCard className="w-32 h-32 text-white/80" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="collexo-section bg-slate-900 dark:bg-slate-950">
                <div className="collexo-container text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Streamline Your Fee Collection?
                    </h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                        Join 500+ educational institutions already using SaritClasses Collect
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="collexo-btn-primary text-lg px-8 py-4">
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

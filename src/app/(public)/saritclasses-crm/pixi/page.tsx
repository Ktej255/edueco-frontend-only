'use client';

import React from 'react';
import Link from 'next/link';
import '../saritclasses.css';
import {
    Wallet,
    CreditCard,
    QrCode,
    Shield,
    Gift,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Smartphone,
    Users,
    Building,
    Coffee,
    BookOpen,
    Bus,
    Utensils,
    ShoppingBag
} from 'lucide-react';

const cardFeatures = [
    { icon: CreditCard, name: 'Student ID Card', description: 'Digital & physical ID in one' },
    { icon: Wallet, name: 'Prepaid Wallet', description: 'Load and spend on campus' },
    { icon: QrCode, name: 'QR Payments', description: 'Tap or scan to pay' },
    { icon: Shield, name: 'Access Control', description: 'Campus entry & library access' },
    { icon: Gift, name: 'Rewards', description: 'Earn points on every spend' },
    { icon: Smartphone, name: 'Mobile App', description: 'Manage everything on phone' },
];

const useCases = [
    { icon: Utensils, name: 'Canteen', description: 'Quick payments at cafeteria' },
    { icon: BookOpen, name: 'Library', description: 'Fine payments & access' },
    { icon: Bus, name: 'Transport', description: 'Bus pass & metro card' },
    { icon: ShoppingBag, name: 'Stationery', description: 'Campus store purchases' },
    { icon: Coffee, name: 'Cafe', description: 'Snacks & beverages' },
    { icon: Building, name: 'Hostel', description: 'Room access & payments' },
];

const benefits = [
    'All-in-one student companion',
    'Cashless campus experience',
    'Real-time balance tracking',
    'Parent-controlled spending limits',
    'Instant transaction alerts',
    'Secure contactless payments',
    'Rewards on every transaction',
    'Works offline too',
];

const stats = [
    { value: '1M+', label: 'Cards Issued' },
    { value: '500+', label: 'Institutions' },
    { value: '₹100Cr+', label: 'Transacted' },
    { value: '5 sec', label: 'Avg. Transaction Time' },
];

export default function PixiPage() {
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
                            <Wallet className="w-4 h-4 text-orange-400" />
                            <span className="text-white/90 text-sm font-medium">Student Card</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            One Card for{' '}
                            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                                ID, Payments & Access
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            The all-in-one student companion. Pixi combines student ID, prepaid wallet,
                            campus access, and rewards—all in one smart card.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="collexo-btn-primary text-lg px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500">
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
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Card Features */}
            <section className="collexo-section bg-slate-50 dark:bg-slate-900">
                <div className="collexo-container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Everything in <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">One Card</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Replace multiple cards with one smart solution
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cardFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className="collexo-card p-6 flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center flex-shrink-0">
                                    <feature.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{feature.name}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="collexo-section bg-white dark:bg-slate-950">
                <div className="collexo-container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Use <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Everywhere</span> on Campus
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {useCases.map((useCase, index) => (
                            <div
                                key={index}
                                className="text-center p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mx-auto mb-3">
                                    <useCase.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{useCase.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="collexo-section bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-orange-950">
                <div className="collexo-container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                The Ultimate{' '}
                                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Student Card</span>
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center">
                                <Wallet className="w-32 h-32 text-white/80" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="collexo-section bg-slate-900 dark:bg-slate-950">
                <div className="collexo-container text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Go Cashless?
                    </h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                        Transform your campus with smart student cards
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="collexo-btn-primary text-lg px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500">
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

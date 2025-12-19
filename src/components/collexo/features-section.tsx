'use client';

import React from 'react';
import {
    LayoutDashboard,
    Settings,
    Search,
    LineChart,
    Calculator,
    Route,
    Link2,
    BarChart3,
    Bell,
    CheckCircle2,
    Layers
} from 'lucide-react';

const features = [
    {
        id: 'unified-dashboard',
        title: 'Unified Dashboard',
        subtitle: 'Readily integrated with all SaritClasses products',
        description: 'With SaritClasses Central, you get a unified view of all your financial transactions as it comes readily integrated with SaritClasses Collect, EMI, and AutoDebit, bringing out the best in each. This means you can manage fees from any source or method without switching between systems. Enjoy a clear, hassle-free overview of all transactions, making fee management easy and efficient for you.',
        icon: LayoutDashboard,
        highlights: ['Collect integrated', 'EMI integrated', 'AutoDebit integrated'],
    },
    {
        id: 'dynamic-customization',
        title: 'Dynamic Customization',
        subtitle: 'Effortlessly manage advanced fee structures',
        description: 'Easily set up and adjust any type of fee structure with just a few clicks. Whether it\'s configuring conditional discounts for early payments, setting up flexible payment plans, launching new programs, or managing late fees, SaritClasses Central makes it all easy. It adapts to your institution\'s unique requirements, making complex fee management simple.',
        icon: Settings,
        highlights: ['Conditional discounts', 'Flexible payment plans', 'Late fee management'],
    },
    {
        id: 'transparent-tracking',
        title: 'Transparent Tracking',
        subtitle: 'Simplify reconciliation and settlements',
        description: 'With SaritClasses Central, you can quickly see where every payment stands. Our settlement reports provide complete visibility into each student\'s transactions, making it easy to track payments and ensure all accounts are accurate. Whether you\'re handling daily reconciliations or preparing for an audit, SaritClasses Central keeps you organized and confident.',
        icon: Search,
        highlights: ['Complete visibility', 'Settlement reports', 'Audit-ready'],
    },
    {
        id: 'effective-forecasting',
        title: 'Effective Forecasting',
        subtitle: 'Gain real-time financial predictability',
        description: 'The real-time dashboards provide you with 360° Visibility of your finances and help you predict your institution\'s financial health at a glance. It automatically tracks every fee payment and matches it directly to students, eliminating suspense entries. This seamless process allows you to forecast cash flow accurately and manage budgets effectively.',
        icon: LineChart,
        highlights: ['360° visibility', 'Cash flow forecasting', 'Budget management'],
    },
    {
        id: 'effortless-taxation',
        title: 'Effortless Taxation',
        subtitle: 'Automated GST & surcharge compliance',
        description: 'Forget the hassle of manually calculating taxes. With SaritClasses Central\'s built-in GST calculators, you can automatically handle tax calculations, splitting SGST, IGST, and CGST based on your and the student\'s location. Configure surcharges and convenience fees as needed. This automation saves valuable time and reduces the risk of manual errors.',
        icon: Calculator,
        highlights: ['Auto GST splitting', 'Surcharge configuration', 'Error-free compliance'],
    },
    {
        id: 'efficient-transfers',
        title: 'Efficient Transfers',
        subtitle: 'Automated payment routing',
        description: 'SaritClasses Central automates payment routing to the appropriate bank accounts as per your collection requirements and handles reconciliation, saving time and reducing errors. This automation provides smooth and efficient payment operations, giving you greater control over your financial processes.',
        icon: Route,
        highlights: ['Auto bank routing', 'Smart reconciliation', 'Error reduction'],
    },
    {
        id: 'instant-collection',
        title: 'Instant Collection',
        subtitle: 'Personalized payment links',
        description: 'SaritClasses CRM enables educational organizations to create personalized payment links tailored to different scenarios—whether it\'s collecting immediate payments during a call, sending links for miscellaneous amounts without additional steps, collecting dues promptly, or securing a seat with partial payments. This feature streamlines the fee collection process.',
        icon: Link2,
        highlights: ['Custom payment links', 'Instant collection', 'Partial payments'],
    },
    {
        id: 'actionable-insights',
        title: 'Actionable Insights',
        subtitle: 'Get financial clarity with customizable reports',
        description: 'SaritClasses CRM\'s customizable reports provide a clear view of your financial data. Track what\'s collected and what\'s due—from an institute-wide level down to individual students or specific fee categories. Analyze trends over time, view settlement amounts by account and transaction count, and eliminate manual reconciliation.',
        icon: BarChart3,
        highlights: ['Custom reports', 'Trend analysis', 'Student-level tracking'],
    },
    {
        id: 'smart-reminders',
        title: 'Smart Reminders',
        subtitle: 'Simplify fee reminders with automated communication',
        description: 'SaritClasses CRM\'s communication suite streamlines fee reminders, keeping students and parents informed effortlessly. It allows you to set automated notifications via email, SMS, or WhatsApp with just a few clicks. Choose your trigger dates—start, due, or last submission date—and our system handles the rest, ensuring timely reminders.',
        icon: Bell,
        highlights: ['Email reminders', 'SMS notifications', 'WhatsApp alerts'],
    },
];

export default function FeaturesSection() {
    return (
        <section className="collexo-section bg-white dark:bg-slate-950">
            <div className="collexo-container">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="collexo-chip mb-4">
                        <Layers className="w-4 h-4" />
                        Centralized Platform
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Predict collections, streamline reconciliation,{' '}
                        <span className="collexo-gradient-text">and eliminate uncertainties</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Managing fee payments across various sources and channels can be a daunting task for educational organizations.
                        SaritClasses Central addresses these challenges by centralizing all financial information.
                    </p>
                </div>

                {/* Features List */}
                <div className="space-y-16">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className={`collexo-feature-section grid lg:grid-cols-2 gap-12 items-center pb-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Content */}
                            <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                <div className="collexo-chip mb-4">
                                    <feature.icon className="w-4 h-4" />
                                    {feature.title}
                                </div>

                                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                                    {feature.subtitle}
                                </h3>

                                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Highlights */}
                                <div className="flex flex-wrap gap-3">
                                    {feature.highlights.map((highlight, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {highlight}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Visual */}
                            <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                                <div className="relative">
                                    <div className="aspect-[4/3] bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6 flex items-center justify-center">
                                        {/* Feature Icon Large */}
                                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-xl">
                                            <feature.icon className="w-16 h-16 text-white" />
                                        </div>

                                        {/* Decorative Elements */}
                                        <div className="absolute top-4 right-4 w-16 h-16 bg-indigo-200 dark:bg-indigo-800/50 rounded-xl opacity-50" />
                                        <div className="absolute bottom-4 left-4 w-12 h-12 bg-purple-200 dark:bg-purple-800/50 rounded-lg opacity-50" />
                                        <div className="absolute top-1/2 left-4 w-8 h-8 bg-cyan-200 dark:bg-cyan-800/50 rounded-full opacity-50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

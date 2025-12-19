'use client';

import React from 'react';
import {
    Building2,
    GraduationCap,
    Handshake,
    TrendingUp,
    Eye,
    Zap,
    CreditCard,
    Bell,
    Settings,
    DollarSign,
    BarChart3,
    Clock,
    Users
} from 'lucide-react';

const stakeholders = [
    {
        id: 'organizations',
        title: 'For Educational Organizations',
        subtitle: 'Transform Fee Management',
        icon: Building2,
        description: 'SaritClasses CRM transforms fee management, enhancing cash flow, and providing real-time visibility into financial operations. Automate and streamline your entire fee collection process, from reconciliation to invoicing, with our robust, purpose-built platform.',
        benefits: [
            { icon: TrendingUp, text: 'Improved Cash Flow' },
            { icon: Eye, text: 'Real-Time Financial Insights' },
            { icon: Zap, text: 'Increased Efficiency' },
        ],
        colorClass: 'organizations',
        accentColor: 'indigo',
    },
    {
        id: 'students',
        title: 'For Students & Parents',
        subtitle: 'End-to-end seamless journey',
        icon: GraduationCap,
        description: 'From enrollment to graduation, SaritClasses CRM makes it easier than ever for students to manage their finances, offering a single platform to handle fee payments, loans, insurance, and more.',
        benefits: [
            { icon: CreditCard, text: 'Unified Payment Platform & Timely Reminders' },
            { icon: Settings, text: 'Centralized Dashboard throughout Education' },
            { icon: Bell, text: 'Flexible Payment Options' },
        ],
        colorClass: 'students',
        accentColor: 'emerald',
    },
    {
        id: 'partners',
        title: 'For Partners',
        subtitle: 'Grow your business with SaritClasses',
        icon: Handshake,
        description: 'By reducing customer acquisition costs and improving the sales cycle, our platform boosts demand and provides partners with streamlined operations to support educational organizations efficiently.',
        benefits: [
            { icon: DollarSign, text: 'Lower Acquisition Costs' },
            { icon: BarChart3, text: 'Boosted Demand Volume' },
            { icon: Clock, text: 'Accelerated Sales Cycles' },
        ],
        colorClass: 'partners',
        accentColor: 'amber',
    },
];

const accentColors: Record<string, { bg: string; text: string; hover: string }> = {
    indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        text: 'text-indigo-600 dark:text-indigo-400',
        hover: 'group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50',
    },
    emerald: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-600 dark:text-emerald-400',
        hover: 'group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50',
    },
    amber: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-600 dark:text-amber-400',
        hover: 'group-hover:bg-amber-200 dark:group-hover:bg-amber-800/50',
    },
};

export default function StakeholdersSection() {
    return (
        <section id="stakeholders" className="collexo-section bg-white dark:bg-slate-950">
            <div className="collexo-container">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="collexo-chip mb-4">
                        <Users className="w-4 h-4" />
                        Shared Success
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Empowering every stakeholder{' '}
                        <span className="collexo-gradient-text">in Education</span>
                    </h2>
                </div>

                {/* Stakeholder Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {stakeholders.map((stakeholder, index) => {
                        const colors = accentColors[stakeholder.accentColor];
                        return (
                            <div
                                key={stakeholder.id}
                                className={`collexo-stakeholder-card ${stakeholder.colorClass} animate-fade-in-up stagger-${index + 1}`}
                            >
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-4`}>
                                    <stakeholder.icon className={`w-7 h-7 ${colors.text}`} />
                                </div>

                                {/* Title */}
                                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                    {stakeholder.title}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                    {stakeholder.subtitle}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                    {stakeholder.description}
                                </p>

                                {/* Benefits */}
                                <ul className="space-y-3">
                                    {stakeholder.benefits.map((benefit, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center gap-3 text-slate-700 dark:text-slate-300 group"
                                        >
                                            <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.hover} flex items-center justify-center flex-shrink-0 transition-colors`}>
                                                <benefit.icon className={`w-4 h-4 ${colors.text}`} />
                                            </div>
                                            <span className="text-sm font-medium">{benefit.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

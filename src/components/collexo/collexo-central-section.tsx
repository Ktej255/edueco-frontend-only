'use client';

import React from 'react';
import {
    LayoutDashboard,
    RefreshCw,
    Settings,
    Receipt,
    Route,
    Link2,
    BarChart3,
    MessageSquare,
    Layers,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

const features = [
    { icon: LayoutDashboard, text: 'Comprehensive Financial Dashboard' },
    { icon: RefreshCw, text: 'Seamless Reconciliation & Settlement' },
    { icon: Settings, text: 'Manage advanced fee structures' },
    { icon: Receipt, text: 'GST, invoicing, and surcharge compliance' },
    { icon: Route, text: 'Automated payment routing' },
    { icon: Link2, text: 'Personalized payment links' },
    { icon: BarChart3, text: 'Advanced reporting' },
    { icon: MessageSquare, text: 'Parent communication' },
    { icon: Layers, text: 'Readily integrated with all SaritClasses products' },
];

export default function CollexoCentralSection() {
    return (
        <section id="central" className="collexo-section bg-white dark:bg-slate-950">
            <div className="collexo-container">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <div className="collexo-chip mb-4">
                            <Layers className="w-4 h-4" />
                            Centralized Platform
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            All built on top of{' '}
                            <span className="collexo-gradient-text">SaritClasses Central</span>
                        </h2>

                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                            A powerful SaaS, centralizing all aspects of fee management into one integrated platform
                        </p>

                        {/* Features Grid */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                                        <feature.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {feature.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button className="collexo-btn-primary">
                            Know More
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Right Content - Platform Preview */}
                    <div className="relative">
                        <div className="relative rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-8">
                            {/* Dashboard Mockup */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl collexo-gradient flex items-center justify-center">
                                            <span className="text-white font-bold">S</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">SaritClasses Central</div>
                                            <div className="text-xs text-slate-500">Enterprise Dashboard</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹5.2Cr</div>
                                        <div className="text-xs text-slate-500 mt-1">Total Revenue</div>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">99.2%</div>
                                        <div className="text-xs text-slate-500 mt-1">Success Rate</div>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3,847</div>
                                        <div className="text-xs text-slate-500 mt-1">Transactions</div>
                                    </div>
                                </div>

                                {/* Integration Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {['Collect', 'EMI', 'AutoDebit', 'Pixi'].map((product) => (
                                        <div
                                            key={product}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                                                {product} Integrated
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

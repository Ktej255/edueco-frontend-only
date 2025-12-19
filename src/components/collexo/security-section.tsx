'use client';

import React from 'react';
import { Shield, Award, Lock, FileCheck, CheckCircle } from 'lucide-react';

const certifications = [
    {
        name: 'AICPA',
        fullName: 'AICPA Certification',
        icon: Award,
        description: 'SOC 2 Type II Compliant',
    },
    {
        name: 'ISO 27001',
        fullName: 'ISO 27001 Certification',
        icon: Shield,
        description: 'Information Security Management',
    },
    {
        name: 'GDPR',
        fullName: 'GDPR Compliance',
        icon: Lock,
        description: 'EU Data Protection Compliant',
    },
    {
        name: 'ISO',
        fullName: 'ISO Certification',
        icon: FileCheck,
        description: 'Quality Management System',
    },
    {
        name: 'DPDP',
        fullName: 'DPDP Certification',
        icon: CheckCircle,
        description: 'Digital Personal Data Protection',
    },
];

export default function SecuritySection() {
    return (
        <section id="security" className="collexo-section bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950">
            <div className="collexo-container">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="collexo-chip mb-4">
                        <Shield className="w-4 h-4" />
                        Protected Excellence
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Commitment to{' '}
                        <span className="collexo-gradient-text">Security</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        At SaritClasses, we are dedicated to upholding the highest standards of quality and security in our services.
                        Our pursuit of globally recognized certifications and adherence to industry standards reflects our commitment
                        to excellence and the trust you can place in our solutions.
                    </p>
                </div>

                {/* Certifications Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {certifications.map((cert, index) => (
                        <div
                            key={cert.name}
                            className={`collexo-security-badge flex-col gap-4 animate-fade-in-up stagger-${index + 1}`}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center">
                                <cert.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-slate-900 dark:text-white text-lg">{cert.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cert.description}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 flex flex-wrap justify-center gap-8">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900 dark:text-white">256-bit SSL Encryption</div>
                            <div className="text-sm">Bank-grade security</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900 dark:text-white">PCI DSS Compliant</div>
                            <div className="text-sm">Payment security standard</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900 dark:text-white">99.9% Uptime</div>
                            <div className="text-sm">Enterprise reliability</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

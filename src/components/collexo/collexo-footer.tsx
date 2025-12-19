'use client';

import React from 'react';
import Link from 'next/link';
import {
    CreditCard,
    Banknote,
    RefreshCw,
    Wallet,
    Linkedin,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ArrowUpRight
} from 'lucide-react';

const products = [
    { name: 'Collect', href: '/saritclasses-crm/collect', icon: CreditCard },
    { name: 'EMI', href: '/saritclasses-crm/emi', icon: Banknote },
    { name: 'AutoDebit', href: '/saritclasses-crm/autodebit', icon: RefreshCw },
    { name: 'Pixi', href: '/saritclasses-crm/pixi', icon: Wallet },
    { name: 'SaritClasses Central', href: '/saritclasses-crm#central', icon: null },
];

const solutions = [
    { name: 'Higher Education', href: '/saritclasses-crm/solutions/higher-education' },
    { name: 'K-12 Schools', href: '/saritclasses-crm/solutions/k12-schools' },
    { name: 'EdTech Platforms', href: '/saritclasses-crm/solutions/edtech-platforms' },
    { name: 'Coaching Institutes', href: '/saritclasses-crm/solutions/coaching-institutes' },
    { name: 'Online Degrees', href: '/saritclasses-crm/solutions/online-degrees' },
];

const resources = [
    { name: 'Blog', href: '/saritclasses-crm/resources/blog' },
    { name: 'Case Studies', href: '/saritclasses-crm/resources/case-studies' },
    { name: 'Help Center', href: '/saritclasses-crm/resources/help-center' },
    { name: 'API Documentation', href: '/saritclasses-crm/resources/api-documentation' },
    { name: 'Webinars', href: '/saritclasses-crm/resources/webinars' },
];

const company = [
    { name: 'About Us', href: '/saritclasses-crm/company/about' },
    { name: 'Careers', href: '/saritclasses-crm/company/careers', badge: 'Hiring' },
    { name: 'Partners', href: '/saritclasses-crm/company/partners' },
    { name: 'Press', href: '/saritclasses-crm/company/press' },
    { name: 'Contact', href: '/saritclasses-crm/company/contact' },
];

const socials = [
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
];

export default function CollexoFooter() {
    return (
        <footer className="bg-slate-900 dark:bg-slate-950 text-white">
            {/* CTA Section */}
            <div className="collexo-container px-6 py-16">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12">
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">
                                Ready to transform your fee management?
                            </h2>
                            <p className="text-white/80 text-lg">
                                Schedule a personalized demo and see SaritClasses CRM in action
                            </p>
                        </div>
                        <button className="flex-shrink-0 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors flex items-center gap-2">
                            Schedule a Demo
                            <ArrowUpRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="collexo-container px-6 py-12 border-t border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-2">
                        <Link href="/saritclasses-crm" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl collexo-gradient flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <span className="text-2xl font-bold">SaritClasses</span>
                        </Link>
                        <p className="text-slate-400 mb-6 max-w-sm">
                            A complete CRM and management platform for education.
                            Powering 500+ coaching institutes and educational organizations.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Mail className="w-5 h-5" />
                                <span>hello@saritclasses.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Phone className="w-5 h-5" />
                                <span>+91 1800-XXX-XXXX</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <MapPin className="w-5 h-5" />
                                <span>Bangalore, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="font-semibold mb-4">Products</h3>
                        <ul className="space-y-3">
                            {products.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        {item.icon && <item.icon className="w-4 h-4" />}
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h3 className="font-semibold mb-4">Solutions</h3>
                        <ul className="space-y-3">
                            {solutions.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {resources.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {company.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        {item.name}
                                        {item.badge && (
                                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="collexo-container px-6 py-6 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-slate-400 text-sm">
                        © {new Date().getFullYear()} SaritClasses. All rights reserved.
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                            Cookie Policy
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {socials.map((social) => (
                            <Link
                                key={social.name}
                                href={social.href}
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <social.icon className="w-5 h-5" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

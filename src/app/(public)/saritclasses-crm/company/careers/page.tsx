'use client';
import React from 'react';
import Link from 'next/link';
import '../../saritclasses.css';
import { Construction, ArrowLeft } from 'lucide-react';

export default function PlaceholderPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
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
            <Construction className="w-16 h-16 text-indigo-500 mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Coming Soon</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-center max-w-md">
                We are working hard to bring you this page. Please check back later.
            </p>
            <Link href="/saritclasses-crm" className="collexo-btn-primary">
                Return Home
            </Link>
        </div>
    );
}

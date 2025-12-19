import React from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--primary-indigo)] font-display">
                    Welcome back, Admin
                </h1>
                <p className="text-[var(--neutral-slate-grey)] mt-2">
                    Here's what's happening in your UPSC ecosystem today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--neutral-cool-grey)] hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-[var(--neutral-slate-grey)]">Total Students</p>
                            <h3 className="text-3xl font-bold text-[var(--neutral-dark-grey)] mt-1">1,248</h3>
                        </div>
                        <div className="p-2 bg-[var(--primary-blue)]/10 rounded-lg text-[var(--primary-blue)]">
                            👥
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-[var(--accent-green)]">
                        <span>↑ 12% from last month</span>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--neutral-cool-grey)] hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-[var(--neutral-slate-grey)]">Active Batches</p>
                            <h3 className="text-3xl font-bold text-[var(--neutral-dark-grey)] mt-1">8</h3>
                        </div>
                        <div className="p-2 bg-[var(--accent-yellow)]/10 rounded-lg text-[var(--accent-yellow)]">
                            📚
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-[var(--neutral-slate-grey)]">
                        <span>2 batches ending soon</span>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--neutral-cool-grey)] hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-[var(--neutral-slate-grey)]">Pending Reviews</p>
                            <h3 className="text-3xl font-bold text-[var(--neutral-dark-grey)] mt-1">42</h3>
                        </div>
                        <div className="p-2 bg-[var(--accent-coral)]/10 rounded-lg text-[var(--accent-coral)]">
                            📝
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-[var(--accent-coral)]">
                        <span>Requires immediate attention</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--neutral-cool-grey)]">
                    <h3 className="text-lg font-bold text-[var(--primary-indigo)] mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/upsc/batches" className="p-4 rounded-xl border border-[var(--neutral-cool-grey)] hover:border-[var(--primary-blue)] hover:bg-[var(--primary-blue)]/5 transition-all text-center group">
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🚀</div>
                            <span className="font-medium text-[var(--primary-indigo)]">Create Batch</span>
                        </Link>
                        <Link href="/admin/upsc/plans" className="p-4 rounded-xl border border-[var(--neutral-cool-grey)] hover:border-[var(--primary-blue)] hover:bg-[var(--primary-blue)]/5 transition-all text-center group">
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🤖</div>
                            <span className="font-medium text-[var(--primary-indigo)]">Generate Plan</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-[var(--primary-indigo)] p-6 rounded-2xl shadow-sm text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2">System Status</h3>
                        <p className="text-white/80 mb-6">All AI services are running optimally.</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Grok AI (Planner)</span>
                                <span className="px-2 py-1 bg-[var(--accent-green)]/20 text-[var(--accent-green)] rounded text-xs font-bold">ONLINE</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Whisper (Voice)</span>
                                <span className="px-2 py-1 bg-[var(--accent-green)]/20 text-[var(--accent-green)] rounded text-xs font-bold">ONLINE</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">OCR Engine</span>
                                <span className="px-2 py-1 bg-[var(--accent-yellow)]/20 text-[var(--accent-yellow)] rounded text-xs font-bold">IDLE</span>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>
    );
}

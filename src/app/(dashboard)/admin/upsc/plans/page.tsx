'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { upscService } from '@/services/upscService';

export default function PlansPage() {
    const [plans, setPlans] = useState<any[]>([]); // This would ideally fetch from API
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showGenerateModal, setShowGenerateModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [batchesData, plansData] = await Promise.all([
                upscService.getBatches(),
                upscService.getPlans()
            ]);
            setBatches(batchesData);
            setPlans(plansData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--primary-indigo)] font-display">Study Plans</h1>
                    <p className="text-[var(--neutral-slate-grey)]">AI-generated curriculum and schedules.</p>
                </div>
                <button
                    onClick={() => setShowGenerateModal(true)}
                    className="px-6 py-3 bg-[var(--primary-blue)] text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                    <span>✨</span> Generate AI Plan
                </button>
            </div>

            {/* Plans Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading plans...</div>
            ) : plans.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No plans found. Generate one to get started.</p>
                    <button onClick={() => setShowGenerateModal(true)} className="text-[var(--primary-blue)] font-medium hover:underline">Generate New Plan</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <Link key={plan.id} href={`/admin/upsc/plans/${plan.id}`} className="group bg-white p-6 rounded-2xl shadow-sm border border-[var(--neutral-cool-grey)] hover:border-[var(--primary-blue)] transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div className="px-3 py-1 bg-[var(--primary-blue)]/10 text-[var(--primary-blue)] rounded-full text-xs font-bold uppercase">
                                    {plan.plan_type}
                                </div>
                                <div className="text-[var(--neutral-slate-grey)] text-sm">
                                    {new Date(plan.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--neutral-dark-grey)] mb-2 group-hover:text-[var(--primary-blue)] transition-colors">
                                {plan.title}
                            </h3>
                            <p className="text-sm text-[var(--neutral-slate-grey)] mb-4">
                                Batch: {batches.find(b => b.id === plan.batch_id)?.name || 'Unknown Batch'}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-[var(--neutral-slate-grey)] border-t border-[var(--neutral-cool-grey)] pt-4">
                                <div className="flex items-center gap-1">
                                    <span>📅</span> {Math.ceil((new Date(plan.end_date).getTime() - new Date(plan.start_date).getTime()) / (1000 * 60 * 60 * 24))} Days
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>🤖</span> {plan.ai_generated ? 'AI Generated' : 'Manual'}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Generate Modal */}
            {showGenerateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[var(--primary-indigo)]">Generate AI Plan</h2>
                            <button onClick={() => setShowGenerateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const topics = (formData.get('topics') as string).split(',').map(t => t.trim());

                            upscService.generatePlan({
                                batch_id: formData.get('batch_id'),
                                subject: formData.get('subject'),
                                start_date: formData.get('start_date'),
                                total_days: parseInt(formData.get('total_days') as string),
                                topics: topics
                            }).then(() => {
                            }).then(() => {
                                setShowGenerateModal(false);
                                loadData();
                            });
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--neutral-slate-grey)] mb-1">Select Batch</label>
                                    <select name="batch_id" required className="w-full px-4 py-2 rounded-lg border border-[var(--neutral-cool-grey)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20 outline-none transition-all bg-white">
                                        {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--neutral-slate-grey)] mb-1">Subject</label>
                                    <input name="subject" required className="w-full px-4 py-2 rounded-lg border border-[var(--neutral-cool-grey)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20 outline-none transition-all" placeholder="e.g. Modern History" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--neutral-slate-grey)] mb-1">Start Date</label>
                                        <input name="start_date" type="date" required className="w-full px-4 py-2 rounded-lg border border-[var(--neutral-cool-grey)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--neutral-slate-grey)] mb-1">Duration (Days)</label>
                                        <input name="total_days" type="number" defaultValue={30} className="w-full px-4 py-2 rounded-lg border border-[var(--neutral-cool-grey)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20 outline-none transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--neutral-slate-grey)] mb-1">Focus Topics (comma separated)</label>
                                    <textarea name="topics" required className="w-full px-4 py-2 rounded-lg border border-[var(--neutral-cool-grey)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20 outline-none transition-all" placeholder="e.g. Gandhian Era, 1857 Revolt, Quit India Movement" rows={3} />
                                </div>
                            </div>

                            <div className="mt-8">
                                <button type="submit" className="w-full py-3 bg-[var(--primary-blue)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
                                    <span>✨</span> Generate Plan with Grok AI
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-3">This may take up to 30 seconds.</p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

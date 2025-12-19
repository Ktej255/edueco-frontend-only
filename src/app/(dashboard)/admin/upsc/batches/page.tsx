'use client';

import React, { useEffect, useState } from 'react';
import { upscService } from '@/services/upscService';

export default function BatchesPage() {
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        loadBatches();
    }, []);

    const loadBatches = async () => {
        try {
            const data = await upscService.getBatches();
            setBatches(data);
        } catch (error) {
            console.error("Failed to load batches", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--primary-indigo)] font-display">Batches</h1>
                    <p className="text-[var(--neutral-slate-grey)]">Manage your student cohorts and timelines.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-[var(--primary-blue)] text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all"
                >
                    + Create Batch
                </button>
            </div>

            {/* Batches Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--neutral-cool-grey)] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[var(--neutral-light-grey)] border-b border-[var(--neutral-cool-grey)]">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-[var(--neutral-slate-grey)]">Batch Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-[var(--neutral-slate-grey)]">Start Date</th>
                            <th className="px-6 py-4 text-sm font-semibold text-[var(--neutral-slate-grey)]">End Date</th>
                            <th className="px-6 py-4 text-sm font-semibold text-[var(--neutral-slate-grey)]">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-[var(--neutral-slate-grey)]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--neutral-cool-grey)]">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading batches...</td></tr>
                        ) : batches.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No batches found. Create one to get started.</td></tr>
                        ) : (
                            batches.map((batch) => (
                                <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[var(--neutral-dark-grey)]">{batch.name}</td>
                                    <td className="px-6 py-4 text-[var(--neutral-slate-grey)]">{new Date(batch.start_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-[var(--neutral-slate-grey)]">{batch.end_date ? new Date(batch.end_date).toLocaleDateString() : '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${batch.is_active ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]' : 'bg-gray-100 text-gray-500'}`}>
                                            {batch.is_active ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-[var(--primary-blue)] hover:underline text-sm font-medium">Edit</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal (Simplified) */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-[var(--primary-indigo)] mb-6">Create New Batch</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            // Handle submit logic here (mock for UI demo)
                            const formData = new FormData(e.currentTarget);
                            upscService.createBatch({
                                name: formData.get('name'),
                                description: formData.get('description'),
                                start_date: formData.get('start_date'),
                                end_date: formData.get('end_date')
                            }).then(() => {
                                setShowCreateModal(false);
                                loadBatches();
                            });
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--neutral-slate-grey)] mb-1">Batch Name</label>
                                    <input name="name" required className="w-full px-4 py-2 rounded-lg border border-[var(--neutral-cool-grey)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20 outline-none transition-all" placeholder="e.g. UPSC 2026 Alpha" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--neutral-slate-grey)] mb-1">Description</label>
                                    <textarea name="description" className="w-full px-4 py-2 rounded-lg border border-[var(--neutral-cool-grey)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20 outline-none transition-all" placeholder="Optional description..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--neutral-slate-grey)] mb-1">Start Date</label>
                                        <input name="start_date" type="date" required className="w-full px-4 py-2 rounded-lg border border-[var(--neutral-cool-grey)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--neutral-slate-grey)] mb-1">End Date</label>
                                        <input name="end_date" type="date" className="w-full px-4 py-2 rounded-lg border border-[var(--neutral-cool-grey)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20 outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-[var(--neutral-slate-grey)] hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[var(--primary-blue)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">Create Batch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

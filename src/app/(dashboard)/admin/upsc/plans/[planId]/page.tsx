'use client';

import React, { useState } from 'react';
import { upscService } from '@/services/upscService';
import { useParams } from 'next/navigation';

export default function PlanDetailsPage() {
    const params = useParams();
    const planId = params.planId as string;
    const [approving, setApproving] = useState(false);

    const handleApprove = async () => {
        setApproving(true);
        try {
            await upscService.approvePlan(planId);
            alert("Plan Approved & Synced to Students!");
        } catch (error) {
            console.error("Approval failed", error);
        } finally {
            setApproving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">DRAFT</span>
                        <span className="text-sm text-[var(--neutral-slate-grey)]">ID: {planId}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--neutral-dark-grey)] font-display">Polity & Governance - Monthly Plan</h1>
                    <p className="text-[var(--neutral-slate-grey)]">Batch: UPSC 2024 Alpha • 30 Days</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-[var(--neutral-slate-grey)] hover:bg-gray-100 rounded-lg font-medium">
                        Edit Settings
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={approving}
                        className="px-6 py-2 bg-[var(--accent-green)] text-white rounded-lg font-medium shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        {approving ? 'Approving...' : '✓ Approve & Publish'}
                    </button>
                </div>
            </div>

            {/* Editor Layout */}
            <div className="flex gap-6 h-[calc(100vh-250px)]">
                {/* Sidebar: Question Bank / AI Suggestions */}
                <div className="w-80 bg-white rounded-2xl shadow-sm border border-[var(--neutral-cool-grey)] flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-[var(--neutral-cool-grey)] bg-[var(--neutral-light-grey)]">
                        <h3 className="font-bold text-[var(--primary-indigo)]">AI Suggestions</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-3 bg-white border border-[var(--neutral-cool-grey)] rounded-lg hover:border-[var(--primary-blue)] cursor-grab active:cursor-grabbing shadow-sm">
                                <div className="text-xs font-bold text-[var(--primary-blue)] mb-1">Polity • 10 Marks</div>
                                <p className="text-sm text-[var(--neutral-dark-grey)] line-clamp-2">
                                    Discuss the significance of the Preamble in interpreting the Constitution.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Calendar / Planner View */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[var(--neutral-cool-grey)] flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-[var(--neutral-cool-grey)] flex justify-between items-center">
                        <h3 className="font-bold text-[var(--neutral-dark-grey)]">Week 1</h3>
                        <div className="flex gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded">◀</button>
                            <button className="p-1 hover:bg-gray-100 rounded">▶</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                                <div key={day} className="border border-[var(--neutral-cool-grey)] rounded-xl overflow-hidden">
                                    <div className="bg-[var(--neutral-light-grey)] px-4 py-2 border-b border-[var(--neutral-cool-grey)] flex justify-between items-center">
                                        <span className="font-bold text-[var(--primary-indigo)]">Day {day}</span>
                                        <span className="text-xs text-[var(--neutral-slate-grey)]">3 Questions</span>
                                    </div>
                                    <div className="p-4 space-y-2 min-h-[100px]">
                                        {[1, 2, 3].map((q) => (
                                            <div key={q} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 group border border-transparent hover:border-gray-200 transition-all">
                                                <div className="w-6 h-6 rounded-full bg-[var(--primary-blue)]/10 text-[var(--primary-blue)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                    Q{q}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-[var(--neutral-dark-grey)]">
                                                        Analyze the basic structure doctrine as evolved by the Supreme Court.
                                                    </p>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="text-xs text-[var(--neutral-slate-grey)] bg-gray-100 px-2 py-0.5 rounded">15 Marks</span>
                                                        <span className="text-xs text-[var(--neutral-slate-grey)] bg-gray-100 px-2 py-0.5 rounded">Judiciary</span>
                                                    </div>
                                                </div>
                                                <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500">🗑</button>
                                            </div>
                                        ))}
                                        <button className="w-full py-2 border-2 border-dashed border-[var(--neutral-cool-grey)] rounded-lg text-[var(--neutral-slate-grey)] text-sm font-medium hover:border-[var(--primary-blue)] hover:text-[var(--primary-blue)] transition-colors">
                                            + Drag question here
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

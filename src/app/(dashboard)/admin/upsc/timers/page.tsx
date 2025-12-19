'use client';

import React, { useEffect, useState } from 'react';
import { upscService } from '@/services/upscService';

export default function TimerSettingsPage() {
    const [batches, setBatches] = useState<any[]>([]);
    const [selectedBatchId, setSelectedBatchId] = useState<string>('');
    const [timers, setTimers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [readingTime, setReadingTime] = useState(5);
    const [writingTime, setWritingTime] = useState(15);

    useEffect(() => {
        loadBatches();
    }, []);

    useEffect(() => {
        if (selectedBatchId) {
            loadTimers(selectedBatchId);
        } else {
            setTimers([]);
        }
    }, [selectedBatchId]);

    const loadBatches = async () => {
        try {
            const data = await upscService.getBatches();
            setBatches(data);
            if (data.length > 0) {
                setSelectedBatchId(data[0].id);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to load batches", error);
            setLoading(false);
        }
    };

    const loadTimers = async (batchId: string) => {
        try {
            const data = await upscService.getTimerConfigs(batchId);
            setTimers(data);

            // Set defaults if exists
            const reading = data.find((t: any) => t.phase === 'reading');
            const writing = data.find((t: any) => t.phase === 'writing');

            if (reading) setReadingTime(reading.duration_minutes);
            if (writing) setWritingTime(writing.duration_minutes);
        } catch (error) {
            console.error("Failed to load timers", error);
        }
    };

    const handleSave = async () => {
        if (!selectedBatchId) return;
        setSaving(true);
        try {
            // Save Reading Time
            await upscService.createTimerConfig({
                batch_id: selectedBatchId,
                phase: 'reading',
                duration_minutes: readingTime,
                is_active: true
            });

            // Save Writing Time
            await upscService.createTimerConfig({
                batch_id: selectedBatchId,
                phase: 'writing',
                duration_minutes: writingTime,
                is_active: true
            });

            alert("Timer settings saved successfully!");
            loadTimers(selectedBatchId);
        } catch (error) {
            console.error("Failed to save timers", error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--primary-indigo)] font-display">Timer Configuration</h1>
                <p className="text-[var(--neutral-slate-grey)]">Set default durations for drill phases.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Batch Selection Sidebar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--neutral-cool-grey)]">
                    <h3 className="font-bold text-[var(--neutral-dark-grey)] mb-4">Select Batch</h3>
                    <div className="space-y-2">
                        {loading ? (
                            <p className="text-sm text-gray-400">Loading batches...</p>
                        ) : batches.map(batch => (
                            <button
                                key={batch.id}
                                onClick={() => setSelectedBatchId(batch.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedBatchId === batch.id
                                        ? 'bg-[var(--primary-blue)] text-white shadow-md shadow-blue-500/20'
                                        : 'hover:bg-gray-50 text-[var(--neutral-slate-grey)]'
                                    }`}
                            >
                                {batch.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Configuration Panel */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-[var(--neutral-cool-grey)]">
                    {selectedBatchId ? (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 pb-6 border-b border-[var(--neutral-cool-grey)]">
                                <div className="w-10 h-10 rounded-full bg-[var(--primary-indigo)]/10 flex items-center justify-center text-[var(--primary-indigo)]">
                                    ⏱️
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[var(--neutral-dark-grey)]">
                                        {batches.find(b => b.id === selectedBatchId)?.name} Settings
                                    </h2>
                                    <p className="text-sm text-[var(--neutral-slate-grey)]">Configure phase durations</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Reading Phase */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-[var(--neutral-dark-grey)]">
                                        Reading Phase Duration
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={readingTime}
                                            onChange={(e) => setReadingTime(parseInt(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl border border-[var(--neutral-cool-grey)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20 outline-none text-lg font-mono font-medium"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--neutral-slate-grey)] text-sm font-medium">
                                            Minutes
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--neutral-slate-grey)]">
                                        Time allocated for reading the question and planning the answer.
                                    </p>
                                </div>

                                {/* Writing Phase */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-[var(--neutral-dark-grey)]">
                                        Writing Phase Duration
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={writingTime}
                                            onChange={(e) => setWritingTime(parseInt(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl border border-[var(--neutral-cool-grey)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20 outline-none text-lg font-mono font-medium"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--neutral-slate-grey)] text-sm font-medium">
                                            Minutes
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--neutral-slate-grey)]">
                                        Time allocated for writing the actual answer.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-[var(--neutral-cool-grey)] flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-8 py-3 bg-[var(--primary-blue)] text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {saving ? 'Saving...' : 'Save Configuration'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-[var(--neutral-slate-grey)] opacity-50">
                            <span className="text-4xl mb-4">👈</span>
                            <p>Select a batch to configure timers</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

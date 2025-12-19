'use client';

import React, { useEffect, useState } from 'react';
import { upscService } from '@/services/upscService';

export default function StudentsPage() {
    const [batches, setBatches] = useState<any[]>([]);
    const [selectedBatchId, setSelectedBatchId] = useState<string>('');
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [progress, setProgress] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBatches();
    }, []);

    useEffect(() => {
        if (selectedBatchId) {
            loadStudents(selectedBatchId);
        } else {
            setStudents([]);
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

    const loadStudents = async (batchId: string) => {
        try {
            const data = await upscService.getBatchStudents(batchId);
            setStudents(data);
        } catch (error) {
            console.error("Failed to load students", error);
        }
    };

    const loadStudentProgress = async (student: any) => {
        setSelectedStudent(student);
        try {
            const data = await upscService.getStudentProgress(student.id);
            setProgress(data);
        } catch (error) {
            console.error("Failed to load progress", error);
        }
    };

    const handleOverride = async (planId: string, currentLockStatus: boolean) => {
        if (!selectedStudent) return;

        const newStatus = !currentLockStatus;
        const action = newStatus ? "lock" : "unlock";

        if (confirm(`Are you sure you want to ${action} this plan for ${selectedStudent.full_name}?`)) {
            try {
                await upscService.overrideProgress(selectedStudent.id, planId, newStatus);
                loadStudentProgress(selectedStudent);
                alert(`Successfully ${action}ed the plan.`);
            } catch (error) {
                console.error("Override failed", error);
                alert("Failed to update lock status.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--primary-indigo)] font-display">Student Management</h1>
                <p className="text-[var(--neutral-slate-grey)]">View and manage student progress.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Batch Selection */}
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
                                        ? 'bg-[var(--primary-blue)] text-white shadow-md'
                                        : 'hover:bg-gray-50 text-[var(--neutral-slate-grey)]'
                                    }`}
                            >
                                {batch.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Students List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--neutral-cool-grey)]">
                    <h3 className="font-bold text-[var(--neutral-dark-grey)] mb-4">Students ({students.length})</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {students.map(student => (
                            <button
                                key={student.id}
                                onClick={() => loadStudentProgress(student)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${selectedStudent?.id === student.id
                                        ? 'bg-[var(--accent-green)]/10 border border-[var(--accent-green)]'
                                        : 'hover:bg-gray-50 border border-transparent'
                                    }`}
                            >
                                <p className="font-medium text-[var(--neutral-dark-grey)]">{student.full_name}</p>
                                <p className="text-xs text-[var(--neutral-slate-grey)]">{student.email}</p>
                                <p className="text-xs text-[var(--neutral-slate-grey)] mt-1">{student.progress_records} progress records</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Progress Detail */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--neutral-cool-grey)]">
                    {selectedStudent ? (
                        <div>
                            <h3 className="font-bold text-[var(--neutral-dark-grey)] mb-4">
                                {selectedStudent.full_name}'s Progress
                            </h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {progress.map((prog) => (
                                    <div
                                        key={prog.plan_id}
                                        className="p-4 bg-gray-50 rounded-xl border border-[var(--neutral-cool-grey)]"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-[var(--neutral-dark-grey)]">{prog.plan_title}</p>
                                                <p className="text-xs text-[var(--neutral-slate-grey)] uppercase">{prog.plan_type}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${prog.is_locked
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {prog.is_locked ? '🔒 Locked' : '🔓 Unlocked'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-xs text-[var(--neutral-slate-grey)]">
                                                {prog.completion_percentage}% Complete
                                            </p>
                                            <button
                                                onClick={() => handleOverride(prog.plan_id, prog.is_locked)}
                                                className="px-3 py-1 bg-[var(--primary-blue)] text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
                                            >
                                                {prog.is_locked ? 'Unlock' : 'Lock'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-[var(--neutral-slate-grey)] opacity-50">
                            <span className="text-4xl mb-4">👈</span>
                            <p>Select a student to view progress</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';

interface ProgressRingProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
}

export function ProgressRing({
    percentage,
    size = 120,
    strokeWidth = 8,
    color = 'var(--primary-blue)',
    label
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[var(--neutral-dark-grey)]">
                    {Math.round(percentage)}%
                </span>
                {label && (
                    <span className="text-xs text-[var(--neutral-slate-grey)]">{label}</span>
                )}
            </div>
        </div>
    );
}

interface ProgressBarProps {
    percentage: number;
    height?: string;
    color?: string;
    showLabel?: boolean;
}

export function ProgressBar({
    percentage,
    height = '8px',
    color = 'var(--primary-blue)',
    showLabel = false
}: ProgressBarProps) {
    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between text-xs text-[var(--neutral-slate-grey)] mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{Math.round(percentage)}%</span>
                </div>
            )}
            <div
                className="w-full bg-gray-200 rounded-full overflow-hidden"
                style={{ height }}
            >
                <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${color}, ${color})`
                    }}
                />
            </div>
        </div>
    );
}

interface StreakCalendarProps {
    completedDays: string[]; // Array of ISO date strings
    totalDays?: number;
}

export function StreakCalendar({ completedDays, totalDays = 30 }: StreakCalendarProps) {
    const today = new Date();
    const days = Array.from({ length: totalDays }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (totalDays - 1 - i));
        return date;
    });

    return (
        <div className="grid grid-cols-10 gap-1">
            {days.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const isCompleted = completedDays.includes(dateStr);
                const isToday = dateStr === today.toISOString().split('T')[0];

                return (
                    <div
                        key={index}
                        className={`aspect-square rounded-md transition-all ${isCompleted
                                ? 'bg-[var(--accent-green)] opacity-100'
                                : 'bg-gray-200 opacity-40'
                            } ${isToday ? 'ring-2 ring-[var(--primary-blue)]' : ''}`}
                        title={`${dateStr}${isCompleted ? ' - Completed' : ''}`}
                    />
                );
            })}
        </div>
    );
}

interface MiniBarChartProps {
    data: { label: string; value: number }[];
    maxValue?: number;
    color?: string;
}

export function MiniBarChart({ data, maxValue, color = 'var(--primary-blue)' }: MiniBarChartProps) {
    const max = maxValue || Math.max(...data.map(d => d.value));

    return (
        <div className="flex items-end gap-1 h-16">
            {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div
                        className="w-full rounded-t transition-all duration-300"
                        style={{
                            height: `${(item.value / max) * 100}%`,
                            backgroundColor: color,
                            minHeight: item.value > 0 ? '4px' : '0'
                        }}
                    />
                    <span className="text-xs text-[var(--neutral-slate-grey)]">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

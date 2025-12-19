"use client";

import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface LiveDateTimeProps {
    showIcon?: boolean;
    className?: string;
    format?: 'full' | 'compact';
}

export default function LiveDateTime({
    showIcon = true,
    className = '',
    format = 'full'
}: LiveDateTimeProps) {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        // Update every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format date in Indian style
    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: format === 'full' ? 'long' : 'short',
            day: 'numeric',
            month: format === 'full' ? 'long' : 'short',
            year: 'numeric',
        };
        return date.toLocaleDateString('en-IN', options);
    };

    // Format time in 12-hour format with IST
    const formatTime = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata',
        };
        return date.toLocaleTimeString('en-IN', options) + ' IST';
    };

    if (format === 'compact') {
        return (
            <div className={`flex items-center gap-2 text-sm ${className}`}>
                {showIcon && <Clock className="h-4 w-4" />}
                <span className="font-medium">
                    {formatTime(currentTime)}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-3 text-sm ${className}`}>
            <div className="flex items-center gap-1.5">
                {showIcon && <Calendar className="h-4 w-4 text-blue-500" />}
                <span className="font-medium">{formatDate(currentTime)}</span>
            </div>
            <span className="opacity-60">|</span>
            <div className="flex items-center gap-1.5">
                {showIcon && <Clock className="h-4 w-4 text-green-500" />}
                <span className="font-mono font-medium tabular-nums">
                    {formatTime(currentTime)}
                </span>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    PrelimsSession,
    savePrelimsSession,
    getPrelimsSession,
    markSegmentComplete,
    isSegmentComplete,
    saveAnalysisReport,
    getAnalysisReport,
    AnalysisReport,
} from '@/services/progressStorage';

interface UseSessionProgressOptions {
    cycleId: number;
    dayId: number;
    partId: number;
    autoSaveInterval?: number; // ms, default 5000
}

interface SessionProgressState {
    segmentIndex: number;
    videoTimestamp: number;
    phase: 'video' | 'response' | 'analysis' | 'complete';
    isLoaded: boolean;
}

export function useSessionProgress({
    cycleId,
    dayId,
    partId,
    autoSaveInterval = 5000,
}: UseSessionProgressOptions) {
    const [state, setState] = useState<SessionProgressState>({
        segmentIndex: 0,
        videoTimestamp: 0,
        phase: 'video',
        isLoaded: false,
    });

    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedRef = useRef<number>(0);

    // Load saved progress on mount
    useEffect(() => {
        const saved = getPrelimsSession();
        if (
            saved &&
            saved.cycleId === cycleId &&
            saved.dayId === dayId &&
            saved.partId === partId
        ) {
            setState({
                segmentIndex: saved.segmentIndex,
                videoTimestamp: saved.videoTimestamp,
                phase: saved.phase,
                isLoaded: true,
            });
        } else {
            setState(prev => ({ ...prev, isLoaded: true }));
        }
    }, [cycleId, dayId, partId]);

    // Save progress function
    const saveProgress = useCallback((
        segmentIndex: number,
        videoTimestamp: number,
        phase: 'video' | 'response' | 'analysis' | 'complete'
    ) => {
        const session: PrelimsSession = {
            cycleId,
            dayId,
            partId,
            segmentIndex,
            videoTimestamp,
            phase,
            lastUpdated: new Date().toISOString(),
        };
        savePrelimsSession(session);
        lastSavedRef.current = Date.now();

        setState({
            segmentIndex,
            videoTimestamp,
            phase,
            isLoaded: true,
        });
    }, [cycleId, dayId, partId]);

    // Update video timestamp (debounced)
    const updateVideoTimestamp = useCallback((timestamp: number) => {
        setState(prev => ({ ...prev, videoTimestamp: timestamp }));

        // Debounce save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Only save if enough time has passed
        const now = Date.now();
        if (now - lastSavedRef.current >= autoSaveInterval) {
            saveProgress(state.segmentIndex, timestamp, state.phase);
        } else {
            saveTimeoutRef.current = setTimeout(() => {
                saveProgress(state.segmentIndex, timestamp, state.phase);
            }, autoSaveInterval);
        }
    }, [autoSaveInterval, saveProgress, state.segmentIndex, state.phase]);

    // Update segment
    const setSegment = useCallback((index: number) => {
        saveProgress(index, 0, 'video');
    }, [saveProgress]);

    // Update phase
    const setPhase = useCallback((phase: 'video' | 'response' | 'analysis' | 'complete') => {
        saveProgress(state.segmentIndex, state.videoTimestamp, phase);
    }, [saveProgress, state.segmentIndex, state.videoTimestamp]);

    // Mark current segment as complete
    const completeSegment = useCallback((segmentId: number) => {
        markSegmentComplete(cycleId, dayId, partId, segmentId);
    }, [cycleId, dayId, partId]);

    // Check if segment is complete
    const checkSegmentComplete = useCallback((segmentId: number): boolean => {
        return isSegmentComplete(cycleId, dayId, partId, segmentId);
    }, [cycleId, dayId, partId]);

    // Save analysis report
    const saveReport = useCallback((segmentIndex: number, report: Omit<AnalysisReport, 'segmentKey' | 'timestamp'>) => {
        const segmentKey = `${cycleId}-${dayId}-${partId}-${segmentIndex + 1}`;
        saveAnalysisReport({
            ...report,
            segmentKey,
            timestamp: new Date().toISOString(),
        });
    }, [cycleId, dayId, partId]);

    // Get saved analysis report
    const getReport = useCallback((segmentIndex: number): AnalysisReport | null => {
        const segmentKey = `${cycleId}-${dayId}-${partId}-${segmentIndex + 1}`;
        return getAnalysisReport(segmentKey);
    }, [cycleId, dayId, partId]);

    // Save on page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (state.phase !== 'complete') {
                saveProgress(state.segmentIndex, state.videoTimestamp, state.phase);
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && state.phase !== 'complete') {
                saveProgress(state.segmentIndex, state.videoTimestamp, state.phase);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [state, saveProgress]);

    return {
        // Current state
        segmentIndex: state.segmentIndex,
        videoTimestamp: state.videoTimestamp,
        phase: state.phase,
        isLoaded: state.isLoaded,

        // Actions
        updateVideoTimestamp,
        setSegment,
        setPhase,
        completeSegment,
        checkSegmentComplete,
        saveReport,
        getReport,
        saveProgress,
    };
}

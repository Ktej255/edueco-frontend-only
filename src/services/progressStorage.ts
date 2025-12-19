/**
 * Progress Storage Service
 * 
 * Centralized service for saving and loading all student progress data.
 * Uses localStorage for persistence across sessions and page refreshes.
 */

// Storage keys
const STORAGE_KEYS = {
    LEARNING_PROGRESS: 'edueco_learning_progress',
    ANALYSIS_REPORTS: 'edueco_analysis_reports',
    STATS: 'edueco_student_stats',
};

// Types
export interface PrelimsSession {
    cycleId: number;
    dayId: number;
    partId: number;
    segmentIndex: number;
    videoTimestamp: number;
    phase: 'video' | 'response' | 'analysis' | 'complete';
    lastUpdated: string;
}

export interface MeditationProgress {
    currentLevel: number;
    currentDay: number;
    processIndex: number;
    streakDays: number;
    lastCompleted: string | null;
}

export interface GraphotherapyProgress {
    currentLevel: number;
    currentDay: number;
    streakDays: number;
    lastCompleted: string | null;
}

export interface AnalysisReport {
    segmentKey: string; // "cycle-day-part-segment"
    recallScore: number;
    understandingLevel: string;
    coveragePercentage: number;
    feedback: string;
    detailedAnalysis: string;
    strengths: string[];
    areasToImprove: string[];
    conceptsCovered: string[];
    conceptsMissed: string[];
    aiSource: string;
    aiModel?: string;
    timestamp: string;
}

export interface LearningProgress {
    prelims: PrelimsSession | null;
    meditation: MeditationProgress;
    graphotherapy: GraphotherapyProgress;
    completedSegments: string[]; // ["1-1-1-1", "1-1-1-2"]
    completedMeditation: string[]; // ["1-1", "1-2"]
    completedGraphotherapy: string[]; // ["1-1", "1-2"]
    lastActivity: string;
}

export interface StudentStats {
    prelims: {
        avgRecall: number;
        totalSegmentsCompleted: number;
        currentCycle: number;
        currentDay: number;
        lastSessionRecalls: number[];
    };
    meditation: {
        currentLevel: number;
        currentDay: number;
        streakDays: number;
        minutesToday: number;
    };
    graphotherapy: {
        currentLevel: number;
        currentDay: number;
        streakDays: number;
    };
    overallStreak: number;
}

// Default values
const DEFAULT_PROGRESS: LearningProgress = {
    prelims: null,
    meditation: {
        currentLevel: 1,
        currentDay: 1,
        processIndex: 0,
        streakDays: 0,
        lastCompleted: null,
    },
    graphotherapy: {
        currentLevel: 1,
        currentDay: 1,
        streakDays: 0,
        lastCompleted: null,
    },
    completedSegments: [],
    completedMeditation: [],
    completedGraphotherapy: [],
    lastActivity: new Date().toISOString(),
};

const DEFAULT_STATS: StudentStats = {
    prelims: {
        avgRecall: 0,
        totalSegmentsCompleted: 0,
        currentCycle: 1,
        currentDay: 1,
        lastSessionRecalls: [],
    },
    meditation: {
        currentLevel: 1,
        currentDay: 1,
        streakDays: 0,
        minutesToday: 0,
    },
    graphotherapy: {
        currentLevel: 1,
        currentDay: 1,
        streakDays: 0,
    },
    overallStreak: 0,
};

// Helper to safely access localStorage
const safeStorage = {
    getItem: (key: string): string | null => {
        if (typeof window === 'undefined') return null;
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    setItem: (key: string, value: string): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    },
};

// ============================================
// LEARNING PROGRESS
// ============================================

export function getLearningProgress(): LearningProgress {
    const stored = safeStorage.getItem(STORAGE_KEYS.LEARNING_PROGRESS);
    if (stored) {
        try {
            return { ...DEFAULT_PROGRESS, ...JSON.parse(stored) };
        } catch {
            return DEFAULT_PROGRESS;
        }
    }
    return DEFAULT_PROGRESS;
}

export function saveLearningProgress(progress: Partial<LearningProgress>): void {
    const current = getLearningProgress();
    const updated = {
        ...current,
        ...progress,
        lastActivity: new Date().toISOString(),
    };
    safeStorage.setItem(STORAGE_KEYS.LEARNING_PROGRESS, JSON.stringify(updated));

    // Dispatch storage event for cross-tab sync
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', {
            key: STORAGE_KEYS.LEARNING_PROGRESS,
            newValue: JSON.stringify(updated),
        }));
    }
}

// ============================================
// PRELIMS SESSION
// ============================================

export function savePrelimsSession(session: PrelimsSession): void {
    saveLearningProgress({ prelims: session });
}

export function getPrelimsSession(): PrelimsSession | null {
    return getLearningProgress().prelims;
}

export function clearPrelimsSession(): void {
    saveLearningProgress({ prelims: null });
}

export function markSegmentComplete(cycleId: number, dayId: number, partId: number, segmentId: number): void {
    const progress = getLearningProgress();
    const key = `${cycleId}-${dayId}-${partId}-${segmentId}`;
    if (!progress.completedSegments.includes(key)) {
        saveLearningProgress({
            completedSegments: [...progress.completedSegments, key],
        });
    }
}

export function isSegmentComplete(cycleId: number, dayId: number, partId: number, segmentId: number): boolean {
    const progress = getLearningProgress();
    const key = `${cycleId}-${dayId}-${partId}-${segmentId}`;
    return progress.completedSegments.includes(key);
}

// ============================================
// MEDITATION PROGRESS
// ============================================

export function getMeditationProgress(): MeditationProgress {
    return getLearningProgress().meditation;
}

export function saveMeditationProgress(meditation: Partial<MeditationProgress>): void {
    const current = getLearningProgress();
    saveLearningProgress({
        meditation: { ...current.meditation, ...meditation },
    });
}

export function markMeditationDayComplete(level: number, day: number): void {
    const progress = getLearningProgress();
    const key = `${level}-${day}`;
    if (!progress.completedMeditation.includes(key)) {
        // Calculate next day/level
        let nextDay = day + 1;
        let nextLevel = level;
        if (nextDay > 60) {
            nextDay = 1;
            nextLevel = level + 1;
        }

        // Update streak
        const today = new Date().toDateString();
        const lastCompleted = progress.meditation.lastCompleted;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        let newStreak = progress.meditation.streakDays;

        if (lastCompleted === yesterday) {
            newStreak += 1;
        } else if (lastCompleted !== today) {
            newStreak = 1;
        }

        saveLearningProgress({
            completedMeditation: [...progress.completedMeditation, key],
            meditation: {
                ...progress.meditation,
                currentLevel: nextLevel,
                currentDay: nextDay,
                processIndex: 0,
                streakDays: newStreak,
                lastCompleted: today,
            },
        });
    }
}

// ============================================
// GRAPHOTHERAPY PROGRESS
// ============================================

export function getGraphotherapyProgress(): GraphotherapyProgress {
    return getLearningProgress().graphotherapy;
}

export function saveGraphotherapyProgress(graphotherapy: Partial<GraphotherapyProgress>): void {
    const current = getLearningProgress();
    saveLearningProgress({
        graphotherapy: { ...current.graphotherapy, ...graphotherapy },
    });
}

export function markGraphotherapyDayComplete(level: number, day: number): void {
    const progress = getLearningProgress();
    const key = `${level}-${day}`;
    if (!progress.completedGraphotherapy.includes(key)) {
        let nextDay = day + 1;
        let nextLevel = level;
        if (nextDay > 60) {
            nextDay = 1;
            nextLevel = level + 1;
        }

        const today = new Date().toDateString();
        const lastCompleted = progress.graphotherapy.lastCompleted;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        let newStreak = progress.graphotherapy.streakDays;

        if (lastCompleted === yesterday) {
            newStreak += 1;
        } else if (lastCompleted !== today) {
            newStreak = 1;
        }

        saveLearningProgress({
            completedGraphotherapy: [...progress.completedGraphotherapy, key],
            graphotherapy: {
                ...progress.graphotherapy,
                currentLevel: nextLevel,
                currentDay: nextDay,
                streakDays: newStreak,
                lastCompleted: today,
            },
        });
    }
}

// ============================================
// ANALYSIS REPORTS
// ============================================

export function getAnalysisReports(): Record<string, AnalysisReport> {
    const stored = safeStorage.getItem(STORAGE_KEYS.ANALYSIS_REPORTS);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return {};
        }
    }
    return {};
}

export function saveAnalysisReport(report: AnalysisReport): void {
    const reports = getAnalysisReports();
    reports[report.segmentKey] = report;
    safeStorage.setItem(STORAGE_KEYS.ANALYSIS_REPORTS, JSON.stringify(reports));

    // Update stats
    updatePrelimsStats(report);
}

export function getAnalysisReport(segmentKey: string): AnalysisReport | null {
    const reports = getAnalysisReports();
    return reports[segmentKey] || null;
}

// ============================================
// STUDENT STATS
// ============================================

export function getStudentStats(): StudentStats {
    const stored = safeStorage.getItem(STORAGE_KEYS.STATS);
    if (stored) {
        try {
            return { ...DEFAULT_STATS, ...JSON.parse(stored) };
        } catch {
            return DEFAULT_STATS;
        }
    }

    // Calculate from progress if no stored stats
    return calculateStatsFromProgress();
}

export function saveStudentStats(stats: Partial<StudentStats>): void {
    const current = getStudentStats();
    const updated = { ...current, ...stats };
    safeStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));

    // Dispatch for cross-tab sync
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', {
            key: STORAGE_KEYS.STATS,
            newValue: JSON.stringify(updated),
        }));
    }
}

function updatePrelimsStats(report: AnalysisReport): void {
    const stats = getStudentStats();
    const reports = getAnalysisReports();

    // Calculate average recall
    const scores = Object.values(reports).map(r => r.recallScore);
    const avgRecall = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    // Get last 3 session recalls
    const sortedReports = Object.values(reports)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 3);

    saveStudentStats({
        prelims: {
            ...stats.prelims,
            avgRecall,
            totalSegmentsCompleted: Object.keys(reports).length,
            lastSessionRecalls: sortedReports.map(r => r.recallScore),
        },
    });
}

function calculateStatsFromProgress(): StudentStats {
    const progress = getLearningProgress();
    const reports = getAnalysisReports();

    // Calculate prelims stats
    const scores = Object.values(reports).map(r => r.recallScore);
    const avgRecall = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    return {
        prelims: {
            avgRecall,
            totalSegmentsCompleted: progress.completedSegments.length,
            currentCycle: progress.prelims?.cycleId || 1,
            currentDay: progress.prelims?.dayId || 1,
            lastSessionRecalls: scores.slice(-3),
        },
        meditation: {
            currentLevel: progress.meditation.currentLevel,
            currentDay: progress.meditation.currentDay,
            streakDays: progress.meditation.streakDays,
            minutesToday: 0,
        },
        graphotherapy: {
            currentLevel: progress.graphotherapy.currentLevel,
            currentDay: progress.graphotherapy.currentDay,
            streakDays: progress.graphotherapy.streakDays,
        },
        overallStreak: Math.max(
            progress.meditation.streakDays,
            progress.graphotherapy.streakDays
        ),
    };
}

// ============================================
// RESUME POINT
// ============================================

export interface ResumePoint {
    type: 'prelims' | 'meditation' | 'graphotherapy' | null;
    label: string;
    href: string;
    details: string;
}

export function getResumePoint(): ResumePoint {
    const progress = getLearningProgress();

    // Check prelims first (most likely to be in-progress)
    if (progress.prelims && progress.prelims.phase !== 'complete') {
        const { cycleId, dayId, partId, segmentIndex, phase, videoTimestamp } = progress.prelims;
        return {
            type: 'prelims',
            label: `Cycle ${cycleId}, Day ${dayId}, Part ${partId}`,
            href: `/student/batch1/cycle/${cycleId}/day/${dayId}/part/${partId}`,
            details: `Segment ${segmentIndex + 1} • ${phase === 'video' ? `Video at ${Math.floor(videoTimestamp / 60)}:${String(Math.floor(videoTimestamp % 60)).padStart(2, '0')}` : phase}`,
        };
    }

    // Check meditation
    if (progress.meditation.processIndex > 0) {
        const { currentLevel, currentDay, processIndex } = progress.meditation;
        return {
            type: 'meditation',
            label: `Level ${currentLevel}, Day ${currentDay}`,
            href: '/student/meditation',
            details: `Process ${processIndex + 1} in progress`,
        };
    }

    // Default - suggest next activity
    return {
        type: null,
        label: 'Start Learning',
        href: '/student/batch1',
        details: 'Continue your UPSC preparation',
    };
}

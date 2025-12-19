"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Activity,
    RefreshCw,
    ChevronDown,
    ChevronRight,
    Clock,
    Cpu,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Search,
    Filter
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface AIStep {
    step_number: number;
    step_name: string;
    step_description: string;
    input_summary: string | null;
    output_summary: string | null;
    model_used: string;
    provider: string;
    tokens_used: number;
    duration_ms: number;
    success: boolean;
    is_fallback: boolean;
    error_message: string | null;
    created_at: string;
}

interface AISession {
    session_id: string;
    student_id: number | null;
    operation_type: string;
    operation_status: string;
    total_steps: number;
    total_tokens: number;
    total_duration_ms: number;
    total_cost: number;
    had_errors: boolean;
    had_fallbacks: boolean;
    final_result_summary: string | null;
    created_at: string;
    completed_at: string | null;
}

interface AIStats {
    period_days: number;
    total_sessions: number;
    total_tokens: number;
    total_cost: number;
    avg_duration_ms: number;
    error_count: number;
    fallback_count: number;
    by_operation_type: Array<{ type: string; count: number }>;
}

export default function AIDebugPage() {
    const { token } = useAuth();
    const [sessions, setSessions] = useState<AISession[]>([]);
    const [stats, setStats] = useState<AIStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedSession, setExpandedSession] = useState<string | null>(null);
    const [sessionSteps, setSessionSteps] = useState<Record<string, AIStep[]>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    useEffect(() => {
        // Only fetch when we have a token
        if (token) {
            fetchData();
        } else {
            // If no token after a short delay, show the page anyway
            const timer = setTimeout(() => {
                setLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [token]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch sessions
            const sessionsRes = await fetch(`${API_BASE}/ai-debug/sessions?limit=50`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (sessionsRes.ok) {
                const data = await sessionsRes.json();
                setSessions(data.sessions || []);
            } else if (sessionsRes.status === 500) {
                // Database tables might not exist yet
                console.log("AI Debug tables may not exist yet");
                setSessions([]);
            } else if (sessionsRes.status === 403) {
                setError("You don't have permission to view AI debug logs. Admin or teacher role required.");
            }

            // Fetch stats
            const statsRes = await fetch(`${API_BASE}/ai-debug/stats?days=7`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            } else {
                // Set default stats if API fails
                setStats({
                    period_days: 7,
                    total_sessions: 0,
                    total_tokens: 0,
                    total_cost: 0,
                    avg_duration_ms: 0,
                    error_count: 0,
                    fallback_count: 0,
                    by_operation_type: []
                });
            }
        } catch (err) {
            console.error("Error fetching AI debug data:", err);
            setError("Failed to connect to API. Make sure the backend is running.");
            // Set empty defaults
            setSessions([]);
            setStats({
                period_days: 7,
                total_sessions: 0,
                total_tokens: 0,
                total_cost: 0,
                avg_duration_ms: 0,
                error_count: 0,
                fallback_count: 0,
                by_operation_type: []
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchSessionSteps = async (sessionId: string) => {
        if (sessionSteps[sessionId]) return; // Already loaded

        try {
            const res = await fetch(`${API_BASE}/ai-debug/sessions/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSessionSteps(prev => ({
                    ...prev,
                    [sessionId]: data.steps || []
                }));
            }
        } catch (error) {
            console.error("Error fetching session steps:", error);
        }
    };

    const toggleSession = (sessionId: string) => {
        if (expandedSession === sessionId) {
            setExpandedSession(null);
        } else {
            setExpandedSession(sessionId);
            fetchSessionSteps(sessionId);
        }
    };

    const formatDuration = (ms: number) => {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    const getStatusIcon = (session: AISession) => {
        if (session.had_errors) return <XCircle className="h-4 w-4 text-red-500" />;
        if (session.had_fallbacks) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        if (session.operation_status === "completed") return <CheckCircle className="h-4 w-4 text-green-500" />;
        return <Clock className="h-4 w-4 text-blue-500" />;
    };

    const filteredSessions = sessions.filter(session => {
        const matchesSearch = session.session_id.includes(searchTerm) ||
            session.operation_type.includes(searchTerm);
        const matchesFilter = filterType === "all" || session.operation_type === filterType;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">AI Transparency Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Monitor and debug AI operations step-by-step
                    </p>
                </div>
                <Button onClick={fetchData} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <p className="text-yellow-800 dark:text-yellow-200">{error}</p>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Sessions (7d)</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total_sessions}</p>
                                </div>
                                <Activity className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Tokens</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total_tokens.toLocaleString()}</p>
                                </div>
                                <Cpu className="h-8 w-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg Duration</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatDuration(stats.avg_duration_ms)}</p>
                                </div>
                                <Clock className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Error Rate</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {stats.total_sessions > 0
                                            ? ((stats.error_count / stats.total_sessions) * 100).toFixed(1)
                                            : 0}%
                                    </p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Search and Filter */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search sessions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                >
                    <option value="all">All Types</option>
                    <option value="drill_evaluation">Drill Evaluation</option>
                    <option value="topic_check">Topic Check</option>
                </select>
            </div>

            {/* Sessions List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        AI Sessions
                    </CardTitle>
                    <CardDescription>
                        Click on a session to view step-by-step AI operations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredSessions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No AI sessions found. Sessions will appear here when students use AI features.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredSessions.map((session) => (
                                <div key={session.session_id} className="border rounded-lg">
                                    {/* Session Header */}
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"
                                        onClick={() => toggleSession(session.session_id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {expandedSession === session.session_id
                                                ? <ChevronDown className="h-4 w-4" />
                                                : <ChevronRight className="h-4 w-4" />
                                            }
                                            {getStatusIcon(session)}
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {session.operation_type.replace(/_/g, " ").toUpperCase()}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {session.session_id} • {formatDate(session.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={session.had_errors ? "destructive" : "secondary"}>
                                                {session.total_steps} steps
                                            </Badge>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {session.total_tokens} tokens
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDuration(session.total_duration_ms)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expanded Steps */}
                                    {expandedSession === session.session_id && (
                                        <div className="border-t bg-gray-50 dark:bg-neutral-900 p-4">
                                            {sessionSteps[session.session_id] ? (
                                                <div className="space-y-3">
                                                    {sessionSteps[session.session_id].map((step) => (
                                                        <div
                                                            key={step.step_number}
                                                            className="bg-white dark:bg-neutral-800 rounded-lg p-4 border"
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="outline">Step {step.step_number}</Badge>
                                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {step.step_name.replace(/_/g, " ")}
                                                                    </span>
                                                                    {step.is_fallback && (
                                                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                                            Fallback
                                                                        </Badge>
                                                                    )}
                                                                    {!step.success && (
                                                                        <Badge variant="destructive">Failed</Badge>
                                                                    )}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {step.model_used} • {step.tokens_used} tokens • {formatDuration(step.duration_ms)}
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                                {step.step_description}
                                                            </p>

                                                            {/* Input/Output Preview */}
                                                            <div className="grid grid-cols-2 gap-4 mt-3">
                                                                <div>
                                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">INPUT</p>
                                                                    <pre className="text-xs bg-gray-100 dark:bg-neutral-700 p-2 rounded overflow-auto max-h-32">
                                                                        {step.input_summary || "No input"}
                                                                    </pre>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">OUTPUT</p>
                                                                    <pre className="text-xs bg-gray-100 dark:bg-neutral-700 p-2 rounded overflow-auto max-h-32">
                                                                        {step.output_summary || "No output"}
                                                                    </pre>
                                                                </div>
                                                            </div>

                                                            {step.error_message && (
                                                                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-600 dark:text-red-400">
                                                                    Error: {step.error_message}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {/* Final Result */}
                                                    {session.final_result_summary && (
                                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Final Result</p>
                                                            <pre className="text-xs text-blue-700 dark:text-blue-300 overflow-auto">
                                                                {session.final_result_summary}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center py-4">
                                                    <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Calendar, Target, BookOpen, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api";

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

interface HabitLog {
    date: string;
    completed: boolean;
}

interface Habit {
    id: string;
    name: string;
    logs: HabitLog[];
}

interface DailyData {
    date: string;
    tasks: Task[];
    habits: Habit[];
    reflection: { content: string } | null;
    tasks_completed: number;
    total_tasks: number;
    streak_days: number;
    completion_rate: number;
}

export default function DailyActionPage() {
    const [data, setData] = useState<DailyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState("");
    const [reflection, setReflection] = useState("");
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const response = await api.get("/daily-actions/today");
            setData(response.data);
            if (response.data.reflection) {
                setReflection(response.data.reflection.content);
            }
        } catch (error) {
            console.error("Failed to fetch daily actions:", error);
            toast({
                title: "Error",
                description: "Failed to load daily actions",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            await api.post("/daily-actions/tasks", {
                title: newTask,
                date: new Date().toISOString().split('T')[0],
                completed: false
            });
            setNewTask("");
            fetchData();
            toast({ title: "Task added" });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add task",
                variant: "destructive",
            });
        }
    };

    const handleToggleTask = async (taskId: string, completed: boolean) => {
        try {
            // Optimistic update
            setData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    tasks: prev.tasks.map(t =>
                        t.id === taskId ? { ...t, completed } : t
                    )
                };
            });

            await api.patch(`/daily-actions/tasks/${taskId}`, { completed });
            fetchData(); // Refresh stats
        } catch (error) {
            fetchData(); // Revert on error
            toast({
                title: "Error",
                description: "Failed to update task",
                variant: "destructive",
            });
        }
    };

    const handleToggleHabit = async (habitId: string, date: string) => {
        try {
            await api.post(`/daily-actions/habits/${habitId}/toggle`, null, {
                params: { date_in: date }
            });
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update habit",
                variant: "destructive",
            });
        }
    };

    const handleSaveReflection = async () => {
        try {
            await api.post("/daily-actions/reflection", {
                content: reflection,
                date: new Date().toISOString().split('T')[0]
            });
            toast({ title: "Reflection saved" });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save reflection",
                variant: "destructive",
            });
        }
    };

    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push({
                date: d.toISOString().split('T')[0],
                label: d.toLocaleDateString('en-US', { weekday: 'short' })
            });
        }
        return days;
    };

    const last7Days = getLast7Days();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Daily Action
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            {/* Today's Tasks */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Today's Tasks</span>
                        <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                            {data?.tasks_completed} of {data?.total_tasks} completed
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {data?.tasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800"
                            >
                                <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={(checked) => handleToggleTask(task.id, checked as boolean)}
                                    className="h-5 w-5"
                                />
                                <span
                                    className={`flex-1 ${task.completed
                                        ? "text-slate-500 line-through dark:text-slate-500"
                                        : "text-slate-900 dark:text-white"
                                        }`}
                                >
                                    {task.title}
                                </span>
                            </div>
                        ))}

                        <form onSubmit={handleAddTask} className="flex gap-2 mt-4">
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Add a new task..."
                                className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary px-2 py-1"
                            />
                            <Button type="submit" size="sm" variant="ghost">Add</Button>
                        </form>
                    </div>
                </CardContent>
            </Card>

            {/* Habit Tracker */}
            <Card>
                <CardHeader>
                    <CardTitle>7-Day Habit Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Days Header */}
                        <div className="grid grid-cols-8 gap-2 mb-2">
                            <div className="text-xs font-medium text-slate-600 dark:text-slate-400"></div>
                            {last7Days.map((day) => (
                                <div
                                    key={day.date}
                                    className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center"
                                >
                                    {day.label}
                                </div>
                            ))}
                        </div>

                        {/* Habits */}
                        {data?.habits.map((habit) => (
                            <div key={habit.id} className="grid grid-cols-8 gap-2">
                                <div className="text-sm font-medium text-slate-900 dark:text-white flex items-center">
                                    {habit.name}
                                </div>
                                {last7Days.map((day) => {
                                    const isCompleted = habit.logs.some(log => log.date === day.date && log.completed);
                                    return (
                                        <div
                                            key={day.date}
                                            onClick={() => handleToggleHabit(habit.id, day.date)}
                                            className={`aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-colors ${isCompleted
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-slate-200 dark:bg-neutral-700 hover:bg-slate-300 dark:hover:bg-neutral-600"
                                                }`}
                                        >
                                            {isCompleted && (
                                                <CheckSquare className="h-4 w-4 text-white" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Journal */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Daily Reflection
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder="What did you learn today? What are you grateful for?"
                        rows={4}
                        className="mb-4 bg-slate-900 text-white border-slate-800 placeholder:text-slate-400 focus-visible:ring-slate-700"
                    />
                    <Button onClick={handleSaveReflection}>Save Entry</Button>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Current Streak
                        </CardTitle>
                        <Target className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">🔥 {data?.streak_days || 0} days</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Keep going!</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Completion Rate
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.completion_rate || 0}%</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Today's tasks</p>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}

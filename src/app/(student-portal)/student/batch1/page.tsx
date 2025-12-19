"use client";

import { useState } from "react";
import { Book, Calendar, Clock, ChevronRight, Lock, Unlock, Play, Target, Brain, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

// 90-Day UPSC Course Structure
const UPSC_CYCLES = [
    { id: 1, name: "Indian Polity", theme: "The Rules of the Game", dates: "Jan 1 – Jan 10", color: "blue" },
    { id: 2, name: "Modern History", theme: "Chronology & Consequence", dates: "Jan 11 – Jan 20", color: "amber" },
    { id: 3, name: "Geography", theme: "Concept & Map Work", dates: "Jan 21 – Jan 30", color: "green" },
    { id: 4, name: "Indian Economy", theme: "Concepts + Budget", dates: "Jan 31 – Feb 9", color: "purple" },
    { id: 5, name: "Environment & Ecology", theme: "Species, Acts & Climate", dates: "Feb 10 – Feb 19", color: "emerald" },
    { id: 6, name: "Science & Technology", theme: "Application & New Tech", dates: "Feb 20 – Mar 1", color: "cyan" },
    { id: 7, name: "Ancient, Medieval & Culture", theme: "Terminology & Chronology", dates: "Mar 2 – Mar 11", color: "orange" },
    { id: 8, name: "International Relations", theme: "Mapping & Groupings", dates: "Mar 12 – Mar 21", color: "rose" },
    { id: 9, name: "Revision & Mocks", theme: "Closing the Gaps", dates: "Mar 22 – Mar 31", color: "indigo" }
];

export default function Batch1Page() {
    const [selectedCycle, setSelectedCycle] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; text: string; border: string }> = {
            blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500" },
            amber: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500" },
            green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400", border: "border-green-500" },
            purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500" },
            emerald: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500" },
            cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500" },
            orange: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500" },
            rose: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500" },
            indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500" }
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">UPSC Prelims 2026</h1>
                <p className="text-gray-600 dark:text-gray-400">90-Day Crash Course • Batch 1</p>
            </div>

            {/* Progress Overview */}
            <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                            <h2 className="text-xl font-bold">Your Learning Journey</h2>
                            <p className="text-indigo-100">6 hours daily: 3 Parts × 2 Hours</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">0%</div>
                            <div className="text-sm text-indigo-200">Completed</div>
                        </div>
                    </div>
                    <Progress value={0} className="h-3 bg-white/20" />
                </CardContent>
            </Card>

            {/* Learning Flow Info */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-2">
                        <Brain className="h-5 w-5" />
                        How Learning Works
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold">1</span>
                            Watch 25 min video
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold">2</span>
                            Record audio or write
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold">3</span>
                            AI analyzes recall
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold">4</span>
                            Next segment
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Cycles Grid */}
            {!selectedCycle ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {UPSC_CYCLES.map((cycle) => {
                        const colors = getColorClasses(cycle.color);
                        return (
                            <Card
                                key={cycle.id}
                                className={`cursor-pointer hover:shadow-lg transition-all border-l-4 ${colors.border}`}
                                onClick={() => setSelectedCycle(cycle.id)}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                                            <span className={`text-xl font-bold ${colors.text}`}>{cycle.id}</span>
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg text-gray-800 dark:text-gray-200">{cycle.name}</CardTitle>
                                            <CardDescription className="text-xs">{cycle.theme}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {cycle.dates}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            10 days
                                        </span>
                                    </div>
                                    <Button variant="outline" className="w-full mt-3">
                                        Start Learning <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : !selectedDay ? (
                /* Day Selection */
                <div className="space-y-4">
                    <Button variant="ghost" onClick={() => setSelectedCycle(null)} className="text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">
                        ← Back to All Cycles
                    </Button>

                    <Card className={`${getColorClasses(UPSC_CYCLES[selectedCycle - 1].color).bg} border-0`}>
                        <CardContent className="p-6">
                            <h2 className={`text-2xl font-bold ${getColorClasses(UPSC_CYCLES[selectedCycle - 1].color).text}`}>
                                Cycle {selectedCycle}: {UPSC_CYCLES[selectedCycle - 1].name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">{UPSC_CYCLES[selectedCycle - 1].theme}</p>
                        </CardContent>
                    </Card>

                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Select Day</h3>
                    <div className="grid grid-cols-5 gap-3">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => (
                            <Card
                                key={day}
                                className="cursor-pointer hover:shadow-md hover:border-primary transition-all text-center"
                                onClick={() => setSelectedDay(day)}
                            >
                                <CardContent className="p-4">
                                    <div className={`text-2xl font-bold ${getColorClasses(UPSC_CYCLES[selectedCycle - 1].color).text}`}>
                                        {day}
                                    </div>
                                    <div className="text-xs text-gray-500">Day {day}</div>
                                    <div className="text-xs text-gray-400 mt-1">3 parts • 6 hrs</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                /* Part Selection */
                <div className="space-y-4">
                    <Button variant="ghost" onClick={() => setSelectedDay(null)} className="text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">
                        ← Back to Days
                    </Button>

                    <Card className={`${getColorClasses(UPSC_CYCLES[selectedCycle - 1].color).bg} border-0`}>
                        <CardContent className="p-6">
                            <h2 className={`text-2xl font-bold ${getColorClasses(UPSC_CYCLES[selectedCycle - 1].color).text}`}>
                                Cycle {selectedCycle}, Day {selectedDay}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">Select a part to start learning (2 hours each)</p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((part) => (
                            <Link
                                key={part}
                                href={`/student/batch1/cycle/${selectedCycle}/day/${selectedDay}/part/${part}`}
                            >
                                <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary">
                                    <CardContent className="p-6 text-center">
                                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${getColorClasses(UPSC_CYCLES[selectedCycle - 1].color).bg} flex items-center justify-center`}>
                                            <Play className={`h-8 w-8 ${getColorClasses(UPSC_CYCLES[selectedCycle - 1].color).text}`} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Part {part}</h3>
                                        <p className="text-gray-500 text-sm mt-1">2 hours • 4 segments</p>
                                        <Button className="mt-4 w-full">
                                            Start Part {part}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* CSAT Track - Unlocked */}
            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            CSAT Parallel Track (3 Hours Daily)
                        </h3>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full flex items-center gap-1">
                            <Unlock className="h-3 w-3" /> All Unlocked
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <Link href="/student/batch1/csat/january" className="block p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md hover:border-amber-500 border-2 border-transparent transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold text-gray-800 dark:text-gray-200">January</div>
                                <Unlock className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="text-gray-500">Quantitative Aptitude</div>
                            <Progress value={0} className="h-1 mt-2" />
                            <div className="text-xs text-gray-400 mt-1">0% completed</div>
                        </Link>
                        <Link href="/student/batch1/csat/february" className="block p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md hover:border-amber-500 border-2 border-transparent transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold text-gray-800 dark:text-gray-200">February</div>
                                <Unlock className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="text-gray-500">Logical Reasoning</div>
                            <Progress value={0} className="h-1 mt-2" />
                            <div className="text-xs text-gray-400 mt-1">0% completed</div>
                        </Link>
                        <Link href="/student/batch1/csat/march" className="block p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md hover:border-amber-500 border-2 border-transparent transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold text-gray-800 dark:text-gray-200">March</div>
                                <Unlock className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="text-gray-500">Reading Comprehension + Mocks</div>
                            <Progress value={0} className="h-1 mt-2" />
                            <div className="text-xs text-gray-400 mt-1">0% completed</div>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

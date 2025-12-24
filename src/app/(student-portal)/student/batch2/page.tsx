"use client";

import { Calendar, CheckCircle2, Clock, Target, BookOpen, TreePine, Layers, PlayCircle, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

// Dynamically import heavy components to avoid SSR issues
const VedicKnowledgeGraph = dynamic(() => import("@/components/batch2/VedicKnowledgeGraph"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[900px] bg-[#F8F4EB] rounded-xl flex items-center justify-center border border-amber-200">
            <div className="text-amber-800/60 flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-amber-400/30 border-t-amber-600 rounded-full"></div>
                Loading Vedic Knowledge Graph...
            </div>
        </div>
    )
});

const UpanishadProgressSequence = dynamic(() => import("@/components/batch2/UpanishadProgressSequence"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] bg-[#FDFBF7] rounded-xl flex items-center justify-center border border-amber-100">
            <div className="text-amber-800/60 flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-amber-400/30 border-t-amber-600 rounded-full"></div>
                Loading Journey Path...
            </div>
        </div>
    )
});

const BhagavadGitaHome = dynamic(() => import("@/components/batch2/bhagavad-gita-home"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-gradient-to-br from-amber-900/20 to-orange-900/10 rounded-xl flex items-center justify-center">
            <div className="text-amber-200/60 flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-amber-300/30 border-t-amber-300 rounded-full"></div>
                Loading Bhagavad Gita...
            </div>
        </div>
    )
});

const SelfStudyMissions = dynamic(() => import("@/components/batch2/SelfStudyMissions"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200">
            <div className="text-amber-800/60 flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-amber-400/30 border-t-amber-600 rounded-full"></div>
                Loading Missions...
            </div>
        </div>
    )
});

// Deployment timestamp: 2024-12-24T18:10:00+05:30
interface MonthData {
    month: string;
    status: "completed" | "in-progress" | "planned";
    activities: string[];
    achievements?: string[];
    plans?: string[];
}

export default function Batch2Page() {
    const monthsData: MonthData[] = [
        {
            month: "August 2024",
            status: "completed",
            activities: [
                "Introduction to Batch 2 curriculum",
                "Foundation modules completion",
                "Initial assessments conducted"
            ],
            achievements: [
                "Successfully onboarded 50+ students",
                "Completed 4 foundation modules",
                "Average assessment score: 85%"
            ]
        },
        {
            month: "September 2024",
            status: "completed",
            activities: [
                "Advanced topic exploration",
                "Group study sessions initiated",
                "Mid-term assessments"
            ],
            achievements: [
                "90% module completion rate",
                "Formed 10 study groups",
                "Improved average score to 88%"
            ]
        },
        {
            month: "October 2024",
            status: "completed",
            activities: [
                "Specialized track selection",
                "Mock tests series 1",
                "Expert guest lectures"
            ],
            achievements: [
                "100% track enrollment",
                "Conducted 5 mock tests",
                "3 industry expert sessions completed"
            ]
        },
        {
            month: "November 2024",
            status: "completed",
            activities: [
                "Intensive revision sessions",
                "Mock tests series 2",
                "Peer review exercises"
            ],
            achievements: [
                "Average mock test score: 90%",
                "Completed 200+ peer reviews",
                "98% attendance in revision sessions"
            ]
        },
        {
            month: "December 2024",
            status: "in-progress",
            activities: [
                "Final preparations ongoing",
                "Mock tests series 3 scheduled",
                "Interview preparation sessions"
            ],
            plans: [
                "Complete final mock test series",
                "Conduct personality development workshops",
                "Final assessment and feedback sessions",
                "Batch completion ceremony planned"
            ]
        }
    ];

    const getStatusIcon = (status: MonthData["status"]) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="h-5 w-5 text-green-600" />;
            case "in-progress":
                return <Clock className="h-5 w-5 text-blue-600" />;
            case "planned":
                return <Target className="h-5 w-5 text-orange-600" />;
        }
    };

    const getStatusText = (status: MonthData["status"]) => {
        switch (status) {
            case "completed":
                return "Completed";
            case "in-progress":
                return "In Progress";
            case "planned":
                return "Planned";
        }
    };

    const getStatusColor = (status: MonthData["status"]) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "in-progress":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "planned":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Layers className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Batch 2 - Sanatana Dharma</h1>
                        <p className="text-muted-foreground">Explore the complete hierarchy of Indian philosophical texts</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="knowledge-tree" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="knowledge-tree" className="flex items-center gap-2">
                        <TreePine className="h-4 w-4" />
                        Knowledge Tree
                    </TabsTrigger>
                    <TabsTrigger value="bhagavad-gita" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Bhagavad Gita
                    </TabsTrigger>
                    <TabsTrigger value="missions" className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Missions
                    </TabsTrigger>
                    <TabsTrigger value="progress" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Progress
                    </TabsTrigger>
                </TabsList>

                {/* Knowledge Tree Tab */}
                <TabsContent value="knowledge-tree" className="mt-0">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">The Tree of Eternal Wisdom</h2>
                                <p className="text-sm text-muted-foreground">Complete Hierarchy of Indian Philosophical Texts</p>
                            </div>
                        </div>
                        {/* We use VedicKnowledgeGraph - React Flow based implementation */}
                        <VedicKnowledgeGraph />
                    </div>
                </TabsContent>

                {/* Bhagavad Gita Tab */}
                <TabsContent value="bhagavad-gita" className="mt-0">
                    <BhagavadGitaHome />
                </TabsContent>

                {/* Missions Tab - Self Study */}
                <TabsContent value="missions" className="mt-0">
                    <SelfStudyMissions />
                </TabsContent>

                {/* Progress Tab */}
                <TabsContent value="progress" className="mt-0">
                    <Tabs defaultValue="present" className="w-full">
                        <div className="flex items-center justify-between mb-4 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                            <TabsList className="grid grid-cols-3 w-full max-w-[600px]">
                                <TabsTrigger value="present" className="flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    Upanishad Journey
                                </TabsTrigger>
                                <TabsTrigger value="selfstudy" className="flex items-center gap-2">
                                    <Rocket className="h-4 w-4" />
                                    Self-Study
                                </TabsTrigger>
                                <TabsTrigger value="past" className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Past Timeline
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="present" className="mt-0">
                            <div className="space-y-6">
                                <UpanishadProgressSequence currentUpanishadId="isa" />

                                {/* Current Focus Summary */}
                                <Card className="border-amber-200 bg-amber-50/30">
                                    <CardHeader>
                                        <CardTitle className="text-amber-900 flex items-center gap-2">
                                            <PlayCircle className="h-5 w-5 text-amber-600" />
                                            Active Focus: Isha Upanishad
                                        </CardTitle>
                                        <CardDescription className="text-amber-800/60">
                                            You are currently exploring the foundation of divine pervasion and renunciation.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wider">Upcoming Milestones</h4>
                                                <ul className="space-y-1">
                                                    <li className="text-sm text-amber-800/80 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                        Completion of Mantra 18 Analysis
                                                    </li>
                                                    <li className="text-sm text-amber-800/80 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                        Unlock Kena Upanishad
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="bg-white/50 p-4 rounded-lg border border-amber-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold text-amber-900">Overall Progress</span>
                                                    <span className="text-xs font-bold text-amber-600">1 / 108</span>
                                                </div>
                                                <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                                                    <div className="w-[1%] h-full bg-amber-500" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Self-Study Progress Tab */}
                        <TabsContent value="selfstudy" className="mt-0">
                            <div className="space-y-6">
                                {/* Summary Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                                        <CardContent className="p-4 text-center">
                                            <div className="text-3xl font-bold text-amber-600">5</div>
                                            <div className="text-xs text-amber-800">Total Missions</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                                        <CardContent className="p-4 text-center">
                                            <div className="text-3xl font-bold text-green-600">2</div>
                                            <div className="text-xs text-green-800">Completed</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                                        <CardContent className="p-4 text-center">
                                            <div className="text-3xl font-bold text-purple-600">82%</div>
                                            <div className="text-xs text-purple-800">Avg. AI Score</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                                        <CardContent className="p-4 text-center">
                                            <div className="text-3xl font-bold text-blue-600">3</div>
                                            <div className="text-xs text-blue-800">Day Streak</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Day-wise Progress */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Rocket className="h-5 w-5 text-amber-600" />
                                            Day-wise Progress Report
                                        </CardTitle>
                                        <CardDescription>
                                            Detailed breakdown of your self-study journey
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                { day: 1, title: "The Future of AI in Education", status: "completed", score: 85, category: "Technology" },
                                                { day: 2, title: "Mindfulness & Mental Clarity", status: "completed", score: 78, category: "Health" },
                                                { day: 3, title: "Quantum Physics & Consciousness", status: "in-progress", score: null, category: "Science" },
                                                { day: 4, title: "The Art of Strategic Thinking", status: "locked", score: null, category: "Philosophy" },
                                                { day: 5, title: "Pranayama: Science of Breath", status: "locked", score: null, category: "Spirituality" },
                                            ].map((item) => (
                                                <div
                                                    key={item.day}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${item.status === "completed"
                                                        ? "bg-green-50 border-green-200"
                                                        : item.status === "in-progress"
                                                            ? "bg-amber-50 border-amber-200"
                                                            : "bg-gray-50 border-gray-200 opacity-60"
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${item.status === "completed"
                                                        ? "bg-green-500 text-white"
                                                        : item.status === "in-progress"
                                                            ? "bg-amber-500 text-white"
                                                            : "bg-gray-300 text-gray-500"
                                                        }`}>
                                                        {item.status === "completed" ? "✓" : item.day}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-gray-900">Day {item.day}</span>
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                                {item.category}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">{item.title}</p>
                                                    </div>
                                                    {item.score !== null && (
                                                        <div className="text-right">
                                                            <div className={`text-xl font-bold ${item.score >= 80 ? "text-green-600" :
                                                                item.score >= 60 ? "text-amber-600" : "text-red-600"
                                                                }`}>
                                                                {item.score}%
                                                            </div>
                                                            <div className="text-xs text-gray-500">AI Score</div>
                                                        </div>
                                                    )}
                                                    {item.status === "in-progress" && (
                                                        <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full animate-pulse">
                                                            ACTIVE
                                                        </span>
                                                    )}
                                                    {item.status === "locked" && (
                                                        <span className="px-3 py-1 bg-gray-400 text-white text-xs font-medium rounded-full">
                                                            LOCKED
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="past" className="mt-0">
                            <div className="space-y-6">
                                {/* Timeline */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>August 2024 - November 2024</CardTitle>
                                        <CardDescription>
                                            Review your completed journey through foundation modules
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Accordion type="single" collapsible className="w-full">
                                            {monthsData.filter(m => m.status === "completed").map((monthData, index) => (
                                                <AccordionItem key={index} value={`month-${index}`}>
                                                    <AccordionTrigger className="hover:no-underline">
                                                        <div className="flex items-center justify-between w-full pr-4">
                                                            <div className="flex items-center gap-3">
                                                                {getStatusIcon(monthData.status)}
                                                                <span className="font-semibold text-lg">{monthData.month}</span>
                                                            </div>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(monthData.status)}`}>
                                                                {getStatusText(monthData.status)}
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="space-y-4 pt-4 pl-8">
                                                            {/* Activities */}
                                                            <div>
                                                                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                                                                    Activities
                                                                </h4>
                                                                <ul className="space-y-2">
                                                                    {monthData.activities.map((activity, actIndex) => (
                                                                        <li key={actIndex} className="flex items-start gap-2">
                                                                            <span className="text-purple-600 mt-1">•</span>
                                                                            <span className="text-foreground">{activity}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            {/* Achievements */}
                                                            {monthData.achievements && monthData.achievements.length > 0 && (
                                                                <div>
                                                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                                                                        Achievements
                                                                    </h4>
                                                                    <ul className="space-y-2">
                                                                        {monthData.achievements.map((achievement, achIndex) => (
                                                                            <li key={achIndex} className="flex items-start gap-2">
                                                                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                                                <span className="text-foreground">{achievement}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    );
}

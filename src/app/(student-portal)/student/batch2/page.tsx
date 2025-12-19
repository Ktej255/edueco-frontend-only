"use client";

import { Calendar, CheckCircle2, Clock, Target, BookOpen, TreePine, Layers } from "lucide-react";
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
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="knowledge-tree" className="flex items-center gap-2">
                        <TreePine className="h-4 w-4" />
                        Knowledge Tree
                    </TabsTrigger>
                    <TabsTrigger value="bhagavad-gita" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Bhagavad Gita
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

                {/* Progress Tab */}
                <TabsContent value="progress" className="mt-0">
                    <div className="space-y-6">
                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>August 2024 - December 2024</CardTitle>
                                <CardDescription>
                                    Track our journey through advanced modules and specialized tracks
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {monthsData.map((monthData, index) => (
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

                                                    {/* Plans */}
                                                    {monthData.plans && monthData.plans.length > 0 && (
                                                        <div>
                                                            <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                                                                Upcoming Plans
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                {monthData.plans.map((plan, planIndex) => (
                                                                    <li key={planIndex} className="flex items-start gap-2">
                                                                        <Target className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                                                        <span className="text-foreground">{plan}</span>
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

                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Completed Months
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">4 / 5</div>
                                    <p className="text-xs text-muted-foreground mt-1">80% Complete</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Current Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">December</div>
                                    <p className="text-xs text-muted-foreground mt-1">Final preparations ongoing</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Total Duration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-purple-600">5 Months</div>
                                    <p className="text-xs text-muted-foreground mt-1">Aug 2024 - Dec 2024</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

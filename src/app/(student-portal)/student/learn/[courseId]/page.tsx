"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    PlayCircle,
    CheckCircle,
    Lock,
    ChevronDown,
    ChevronRight,
    ArrowLeft,
    Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import api from "@/lib/api";

export default function CourseFunnelPage() {
    const params = useParams();
    const router = useRouter();
    const [courseData, setCourseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const res = await api.get(`/student-portal/courses/${params.courseId}/funnel`);
                setCourseData(res.data);
            } catch (error) {
                console.error("Failed to fetch course data", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.courseId) {
            fetchCourseData();
        }
    }, [params.courseId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!courseData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-xl font-bold mb-4">Course not found</h2>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="font-bold text-lg text-gray-900">{courseData.course.title}</h1>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <Progress value={courseData.progress} className="w-32 h-2" />
                                <span>{courseData.progress}% Complete</span>
                            </div>
                        </div>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        Continue Learning
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Course Info & Current Lesson */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Card */}
                    <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <CardContent className="p-8 relative z-10">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                    <Trophy className="h-8 w-8 text-yellow-300" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Keep going! You're doing great.</h2>
                                    <p className="text-blue-100">
                                        You've completed 2 lessons today. Finish "Your First Program" to unlock the next module.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-blue-100">Up Next</span>
                                    <span className="text-xs bg-blue-500/50 px-2 py-1 rounded text-white">15 min</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4">Your First Program</h3>
                                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                                    <PlayCircle className="h-5 w-5 mr-2" />
                                    Start Lesson
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Course Description */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-4">About this Course</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {courseData.course.description}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Curriculum */}
                <div className="lg:col-span-1">
                    <Card className="h-full max-h-[calc(100vh-10rem)] flex flex-col">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold">Course Content</h3>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-4">
                                {courseData.modules.map((module: any, index: number) => (
                                    <ModuleItem key={module.id} module={module} defaultOpen={index === 0} />
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>
                </div>

            </main>
        </div>
    );
}

function ModuleItem({ module, defaultOpen }: { module: any, defaultOpen: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                        {module.id}
                    </div>
                    <span className="font-medium text-gray-900 text-left">{module.title}</span>
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
            </CollapsibleTrigger>

            <CollapsibleContent>
                <div className="border-t border-gray-100 divide-y divide-gray-100">
                    {module.lessons.map((lesson: any) => (
                        <div
                            key={lesson.id}
                            className={`p-3 pl-12 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors ${lesson.is_locked ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {lesson.is_completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : lesson.is_locked ? (
                                    <Lock className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <PlayCircle className="h-4 w-4 text-blue-500" />
                                )}
                                <span className={`text-sm ${lesson.is_completed ? "text-gray-500" : "text-gray-900"}`}>
                                    {lesson.title}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400">{lesson.duration}</span>
                        </div>
                    ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Menu,
    CheckCircle,
    PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function LessonPlayerPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
            {/* Top Bar */}
            <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900 z-20">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="h-6 w-[1px] bg-gray-700 mx-2"></div>
                    <div>
                        <h1 className="font-medium text-sm md:text-base">Introduction to Python</h1>
                        <p className="text-xs text-gray-400">Lesson 3: Your First Program</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 mr-4">
                        <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[35%]"></div>
                        </div>
                        <span>35% Complete</span>
                    </div>

                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hidden md:flex">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Next Lesson <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content (Video Player) */}
                <main className="flex-1 flex flex-col relative bg-black">
                    <div className="flex-1 flex items-center justify-center bg-black">
                        {/* Video Placeholder */}
                        <div className="w-full max-w-5xl aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800 shadow-2xl">
                            <div className="text-center">
                                <PlayCircle className="h-20 w-20 text-blue-600 mx-auto mb-4 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
                                <p className="text-gray-500">Video Player Placeholder</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Sidebar Trigger */}
                    <div className="md:hidden absolute top-4 right-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button size="icon" variant="secondary">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-gray-900 border-gray-800 text-white p-0 w-80">
                                <LessonSidebarContent />
                            </SheetContent>
                        </Sheet>
                    </div>
                </main>

                {/* Sidebar (Desktop) */}
                <aside className={`w-80 bg-gray-900 border-l border-gray-800 flex flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full w-0 border-none'}`}>
                    <LessonSidebarContent />
                </aside>
            </div>
        </div>
    );
}

function LessonSidebarContent() {
    const modules = [
        {
            title: "Introduction",
            lessons: [
                { title: "Welcome", duration: "5:00", completed: true, active: false },
                { title: "Setup", duration: "10:00", completed: true, active: false },
                { title: "First Program", duration: "15:00", completed: false, active: true },
            ]
        },
        {
            title: "Variables",
            lessons: [
                { title: "Variables Explained", duration: "12:00", completed: false, active: false },
                { title: "Numbers & Strings", duration: "18:00", completed: false, active: false },
            ]
        }
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-800">
                <h3 className="font-semibold text-white">Course Content</h3>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {modules.map((module, i) => (
                        <div key={i}>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Module {i + 1}: {module.title}
                            </h4>
                            <div className="space-y-1">
                                {module.lessons.map((lesson, j) => (
                                    <button
                                        key={j}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${lesson.active
                                                ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                            }`}
                                    >
                                        {lesson.completed ? (
                                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                                        ) : lesson.active ? (
                                            <PlayCircle className="h-4 w-4 text-blue-500 shrink-0" />
                                        ) : (
                                            <div className="h-4 w-4 rounded-full border border-gray-600 shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{lesson.title}</p>
                                            <p className="text-xs opacity-60">{lesson.duration}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

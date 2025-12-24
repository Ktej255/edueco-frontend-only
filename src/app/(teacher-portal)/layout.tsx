"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TeacherSidebar from "@/components/teacher-portal/TeacherSidebar";
import TeacherMobileSidebar from "@/components/teacher-portal/TeacherMobileSidebar";
import "@/styles/teacher-theme.css";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        setIsAuthenticated(true);
        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Mobile Header - Only visible on mobile */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-gradient-to-r from-emerald-800 to-emerald-900 flex items-center justify-between px-4 z-50 border-b border-emerald-700/50">
                <div className="flex items-center gap-3">
                    <TeacherMobileSidebar onLogout={handleLogout} />
                    <div className="flex items-center gap-2">
                        <span className="text-xl">👨‍🏫</span>
                        <span className="text-white font-bold">Teacher Portal</span>
                    </div>
                </div>
            </header>

            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden md:block">
                <TeacherSidebar
                    isCollapsed={isCollapsed}
                    onToggle={() => setIsCollapsed(!isCollapsed)}
                    onLogout={handleLogout}
                />
            </div>

            {/* Main Content - Full width on mobile, flex on desktop */}
            <main className={`flex-1 overflow-auto teacher-theme transition-all duration-300
                pt-14 md:pt-0
                ${isCollapsed ? "" : ""}
            `}>
                <div className="p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}




"use client";

import { useState } from "react";
import StudentSidebar from "@/components/student-portal/StudentSidebar";
import StudentHeader from "@/components/student-portal/StudentHeader";
import ProtectedRoute from "@/components/protected-route";

export default function StudentPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <StudentHeader />
                <div className="flex">
                    <StudentSidebar
                        isCollapsed={isCollapsed}
                        onToggle={() => setIsCollapsed(!isCollapsed)}
                    />
                    <main className={`flex-1 p-6 pt-20 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"
                        }`}>
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}

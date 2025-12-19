import type { Metadata } from "next";
import StudentSidebar from "@/components/student-portal/StudentSidebar";
import StudentHeader from "@/components/student-portal/StudentHeader";

export const metadata: Metadata = {
    title: "Student Portal - Eduecosystem",
    description: "Your personalized learning journey",
};

export default function StudentPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <StudentHeader />
            <div className="flex">
                <StudentSidebar />
                <main className="flex-1 p-6 ml-64 pt-20">
                    {children}
                </main>
            </div>
        </div>
    );
}

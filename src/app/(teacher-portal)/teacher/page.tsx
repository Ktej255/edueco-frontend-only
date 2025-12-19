"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TeacherPortalPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to teacher dashboard
        router.replace("/teacher/dashboard");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
    );
}

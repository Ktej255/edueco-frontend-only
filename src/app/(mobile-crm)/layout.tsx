"use client";

import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/protected-route";
import MobileBottomNav from "@/components/mobile-crm/MobileBottomNav";
import MobileHeader from "@/components/mobile-crm/MobileHeader";

export default function MobileCRMLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Determine current page title based on path
    const getPageTitle = () => {
        if (pathname?.includes("/leads/")) return "Lead Details";
        if (pathname?.includes("/leads")) return "Leads";
        if (pathname?.includes("/check-in")) return "Check In";
        if (pathname?.includes("/route-history")) return "Route History";
        if (pathname?.includes("/activities")) return "Activities";
        if (pathname?.includes("/profile")) return "Profile";
        return "Mobile CRM";
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-950 text-white flex flex-col">
                {/* Mobile Header */}
                <MobileHeader title={getPageTitle()} />

                {/* Main Content - with padding for header and bottom nav */}
                <main className="flex-1 overflow-auto pb-20 pt-16">
                    {children}
                </main>

                {/* Bottom Navigation */}
                <MobileBottomNav />
            </div>
        </ProtectedRoute>
    );
}

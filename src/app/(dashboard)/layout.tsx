"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import ProtectedRoute from "@/components/protected-route";
import { logActivity } from "@/lib/activity-tracker";
import MobileSidebar from "@/components/mobile-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if we're in admin area - admin has its own layout with sidebar
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    try {
      logActivity("view_page", pathname || "");
    } catch (error) {
      // Silently ignore if analytics endpoint doesn't exist
    }
  }, [pathname]);

  // For admin routes, just render children (admin has its own layout)
  if (isAdminRoute) {
    return (
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    );
  }

  // For non-admin routes, show the standard dashboard layout with sidebar
  return (
    <ProtectedRoute>
      <div className="h-full relative">
        <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
          <Sidebar />
        </div>
        <main className="md:pl-72 bg-background min-h-screen transition-all duration-300 ease-in-out">
          <Navbar />
          <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

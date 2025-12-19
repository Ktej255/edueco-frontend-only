"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Home,
    Users,
    MapPin,
    ClipboardList,
    User,
} from "lucide-react";

const navItems = [
    {
        label: "Home",
        icon: Home,
        href: "/m",
    },
    {
        label: "Leads",
        icon: Users,
        href: "/m/leads",
    },
    {
        label: "Check In",
        icon: MapPin,
        href: "/m/check-in",
    },
    {
        label: "Activities",
        icon: ClipboardList,
        href: "/m/activities",
    },
    {
        label: "Profile",
        icon: User,
        href: "/m/profile",
    },
];

export default function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 safe-area-pb">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/m" && pathname?.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200",
                                isActive
                                    ? "text-emerald-400"
                                    : "text-gray-400 hover:text-gray-200"
                            )}
                        >
                            <div
                                className={cn(
                                    "p-1.5 rounded-xl transition-all duration-200",
                                    isActive && "bg-emerald-500/20"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "h-5 w-5 transition-all",
                                        isActive && "scale-110"
                                    )}
                                />
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

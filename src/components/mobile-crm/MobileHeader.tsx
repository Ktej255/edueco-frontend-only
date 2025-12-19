"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
    title: string;
    showBack?: boolean;
    showSearch?: boolean;
    onSearch?: () => void;
}

export default function MobileHeader({
    title,
    showBack = false,
    showSearch = false,
    onSearch,
}: MobileHeaderProps) {
    const router = useRouter();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 safe-area-pt">
            <div className="flex items-center justify-between h-14 px-4">
                {/* Left Section */}
                <div className="flex items-center gap-3 min-w-[60px]">
                    {showBack ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-300 hover:text-white hover:bg-gray-800"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    ) : (
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">E</span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-lg font-semibold text-white truncate">
                    {title}
                </h1>

                {/* Right Section */}
                <div className="flex items-center gap-2 min-w-[60px] justify-end">
                    {showSearch && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-300 hover:text-white hover:bg-gray-800"
                            onClick={onSearch}
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-300 hover:text-white hover:bg-gray-800 relative"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
                    </Button>
                </div>
            </div>
        </header>
    );
}

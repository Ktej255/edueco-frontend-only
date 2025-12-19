"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";
import { useRouter } from "next/navigation";

interface GenericPageProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export default function GenericPage({ title, description, children }: GenericPageProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="mb-4 text-gray-400 hover:text-white pl-0 hover:bg-transparent"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                        <p className="text-gray-400">
                            {description || "Manage your settings and preferences here."}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                    {children ? (
                        children
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                <Construction className="h-10 w-10 text-cyan-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Under Construction</h2>
                            <p className="text-gray-400 max-w-md mb-8">
                                This page is currently being developed. Check back soon for updates!
                            </p>
                            <Button
                                variant="outline"
                                className="border-gray-700 text-white hover:bg-gray-800"
                                onClick={() => router.push("/dashboard")}
                            >
                                Return to Dashboard
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

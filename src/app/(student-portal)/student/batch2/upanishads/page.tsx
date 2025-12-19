"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { upanishads, Upanishad } from "@/components/batch2/upanishads-data";
import { Search, BookOpen, Feather, Info, Map, List, GraduationCap } from "lucide-react";

const UpanishadMasterPortal = dynamic(() => import("@/components/batch2/upanishads/UpanishadMasterPortal"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[600px] flex items-center justify-center bg-amber-50/50 rounded-xl">
            <div className="text-amber-700 animate-pulse">Loading Knowledge Graph...</div>
        </div>
    ),
});

export default function UpanishadsPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<"graph" | "list">("graph");
    const [filter, setFilter] = useState<string>("All");
    const [vedaFilter, setVedaFilter] = useState<string>("All");
    const [search, setSearch] = useState("");

    const categories = ["All", "Mukhya", "Samanya", "Sannyasa", "Shakta", "Vaishnava", "Shaiva", "Yoga"];
    const vedas = ["All", "Rigveda", "Yajurveda", "Samaveda", "Atharvaveda"];

    const filteredUpanishads = upanishads.filter((u) => {
        const matchesCategory = filter === "All" || u.category === filter;
        const matchesVeda = vedaFilter === "All" || u.veda === vedaFilter;
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesVeda && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#050505] text-[#E0C097] font-sans selection:bg-[#E0C097] selection:text-black">
            {/* Hero Section */}
            <div className="relative pt-24 pb-12 px-6 border-b border-[#333]">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a140a] via-[#050505] to-[#050505] opacity-60 pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold font-serif mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#C4A35A] via-[#E8B98D] to-[#C4A35A] drop-shadow-[0_2px_10px_rgba(196,163,90,0.3)]">
                        The 108 Upaniṣads
                    </h1>
                    <p className="text-lg md:text-xl text-[#A0A0A0] max-w-3xl mx-auto font-light leading-relaxed mb-6">
                        Explore the supreme wisdom of the Vedas. The journey from darkness to light.
                    </p>

                    {/* View Mode Toggle */}
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => setViewMode("graph")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${viewMode === "graph"
                                    ? "bg-[#C4A35A] text-black"
                                    : "bg-[#1a1a1a] text-[#888] hover:text-white border border-[#333]"
                                }`}
                        >
                            <Map className="w-4 h-4" /> Knowledge Graph
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${viewMode === "list"
                                    ? "bg-[#C4A35A] text-black"
                                    : "bg-[#1a1a1a] text-[#888] hover:text-white border border-[#333]"
                                }`}
                        >
                            <List className="w-4 h-4" /> List View
                        </button>
                    </div>
                </div>
            </div>

            {/* Graph View */}
            {viewMode === "graph" && (
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <UpanishadMasterPortal />
                </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
                <>
                    {/* Controls */}
                    <div className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md border-b border-[#222]">
                        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                                <input
                                    type="text"
                                    placeholder="Search Upanishads..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] rounded-full pl-10 pr-4 py-2 text-sm text-[#E0C097] focus:outline-none focus:border-[#C4A35A] transition-colors placeholder:text-[#444]"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-[#111] border border-[#333] rounded-md px-3 py-2 text-sm text-[#E0C097]">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select value={vedaFilter} onChange={(e) => setVedaFilter(e.target.value)} className="bg-[#111] border border-[#333] rounded-md px-3 py-2 text-sm text-[#E0C097]">
                                    {vedas.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="max-w-7xl mx-auto px-6 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredUpanishads.map((u) => (
                                <div
                                    key={u.id}
                                    onClick={() => router.push(`/student/batch2/upanishads/${u.id}`)}
                                    className="group relative bg-[#0D0D0D] border border-[#222] rounded-xl p-6 hover:border-[#C4A35A]/50 transition-all cursor-pointer overflow-hidden hover:shadow-[0_0_20px_rgba(196,163,90,0.1)]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#C4A35A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-4xl font-serif text-[#222] group-hover:text-[#C4A35A]/20 font-bold">
                                                {u.number.toString().padStart(3, '0')}
                                            </span>
                                            <span className="px-2 py-0.5 text-[10px] uppercase bg-[#1a140a] text-[#8B6914] border border-[#8B6914]/30 rounded">
                                                {u.category}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#E0C097] mb-2 group-hover:text-white">{u.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-[#666] mb-4">
                                            <BookOpen className="w-3 h-3" />
                                            <span>{u.veda}</span>
                                        </div>
                                        {u.description && <p className="text-sm text-[#888] line-clamp-3 mb-4">{u.description}</p>}
                                        <div className="mt-auto pt-4 border-t border-[#222] flex items-center justify-between text-xs text-[#555] group-hover:text-[#C4A35A]">
                                            <span>Read Shlokas</span>
                                            <Feather className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredUpanishads.length === 0 && (
                            <div className="flex flex-col items-center py-20 text-[#444]">
                                <Info className="w-12 h-12 mb-4 opacity-50" />
                                <p>No Upanishads found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

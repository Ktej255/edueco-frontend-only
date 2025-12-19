"use client";

import React from "react";
import { PenTool, Brain, Activity, ArrowRight } from "lucide-react";

export default function GraphotherapyPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans flex flex-col items-center justify-center p-6">
            <div className="max-w-2xl text-center space-y-8">

                <div className="w-20 h-20 bg-[#1a140a] rounded-full flex items-center justify-center mx-auto border border-[#333]">
                    <PenTool className="w-10 h-10 text-[#C4A35A]" />
                </div>

                <div>
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#C4A35A] to-[#E8B98D]">
                        Graphotherapy
                    </h1>
                    <p className="text-lg text-[#888] font-light">
                        Rewire your subconscious mind through the science of handwriting modification.
                    </p>
                </div>

                <div className="p-6 bg-[#111] rounded-xl border border-[#222] text-left space-y-4">
                    <h3 className="text-[#C4A35A] font-bold uppercase tracking-widest text-xs">Coming Soon</h3>
                    <p className="text-[#CCC]">
                        We are currently actively developing the Graphotherapy modules.
                        This section will include guided handwriting exercises tailored to specific personality traits and goals.
                    </p>
                </div>

                <button className="px-6 py-3 bg-[#C4A35A] text-black font-bold rounded-lg hover:bg-[#D4B36A] transition-colors flex items-center gap-2 mx-auto">
                    Notify Me When Ready <ArrowRight className="w-4 h-4" />
                </button>

            </div>
        </div>
    );
}

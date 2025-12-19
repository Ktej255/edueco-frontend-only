"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Smile, Hand, Zap } from "lucide-react";

interface LiveClassReactionBarProps {
  onReaction: (reaction: string) => void;
  incomingReaction?: { reaction: string; id: string } | null;
}

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

const REACTIONS = [
  { id: "like", emoji: "👍", icon: ThumbsUp, label: "Like" },
  { id: "love", emoji: "❤️", icon: Heart, label: "Love" },
  { id: "clap", emoji: "👏", icon: Hand, label: "Clap" }, // Hand as proxy for clap
  { id: "laugh", emoji: "😂", icon: Smile, label: "Laugh" },
  { id: "wow", emoji: "😮", icon: Zap, label: "Wow" }, // Zap as proxy for wow/shock
];

export function LiveClassReactionBar({
  onReaction,
  incomingReaction,
}: LiveClassReactionBarProps) {
  const [floatingReactions, setFloatingReactions] = useState<
    FloatingReaction[]
  >([]);

  const addFloatingReaction = useCallback((emoji: string) => {
    const id = Math.random().toString(36).substring(7);
    // Randomize start position slightly
    const startX = 50 + (Math.random() * 40 - 20); // 30% to 70%

    setFloatingReactions((prev) => [
      ...prev,
      {
        id,
        emoji,
        x: startX,
        y: 100, // Start from bottom
      },
    ]);

    // Remove after animation
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  }, []);

  // Handle incoming reactions from other users
  useEffect(() => {
    if (incomingReaction) {
      addFloatingReaction(incomingReaction.reaction);
    }
  }, [incomingReaction, addFloatingReaction]);

  const handleReactionClick = (reaction: string) => {
    onReaction(reaction);
    addFloatingReaction(reaction);
  };

  return (
    <div className="relative w-full h-full pointer-events-none">
      {/* Floating Reactions Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
        {floatingReactions.map((r) => (
          <div
            key={r.id}
            className="absolute text-2xl animate-float-up opacity-0"
            style={{
              left: `${r.x}%`,
              bottom: "80px", // Start above the bar
              animation: "floatUp 2s ease-out forwards",
            }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Reaction Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm p-2 rounded-full border border-gray-700 pointer-events-auto shadow-lg z-40">
        {REACTIONS.map((r) => (
          <Button
            key={r.id}
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-gray-700 hover:scale-110 transition-all text-gray-300 hover:text-cyan-400"
            onClick={() => handleReactionClick(r.emoji)}
            title={r.label}
          >
            <r.icon className="h-5 w-5" />
          </Button>
        ))}
      </div>

      <style jsx global>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          10% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) scale(1);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: floatUp 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Play, Pause, Music } from "lucide-react";
import api from "@/lib/api";

export default function MeditationPage() {
  const [isLocked, setIsLocked] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      // Lock logic: Only available after 6 PM (18:00)
      // For demo purposes, we can invert this or make it always open if needed.
      // Let's keep it strict: Locked if hour < 18
      if (hour >= 18) {
        setIsLocked(false);
      } else {
        setIsLocked(true);
        // Calculate time until 6 PM
        const target = new Date();
        target.setHours(18, 0, 0, 0);
        const diff = target.getTime() - now.getTime();
        setTimeLeft(Math.floor(diff / 1000));
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = async () => {
    setIsPlaying(false);
    try {
      await api.post("/meditation/log", { minutes_listened: 15 });
      alert("Session Complete! 15 minutes logged.");
    } catch (error) {
      console.error("Failed to log session", error);
    }
  };

  const logMood = async (mood: string) => {
    try {
      await api.post(`/meditation/mood?mood=${mood}`);
      alert(`Mood logged: ${mood}`);
    } catch (error) {
      console.error("Failed to log mood", error);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="relative mx-auto w-64 h-64 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-900 to-black border-4 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          {isLocked ? (
            <div className="text-center space-y-4 animate-pulse">
              <Lock className="h-16 w-16 text-gray-500 mx-auto" />
              <div>
                <h2 className="text-xl font-bold text-gray-400">Locked</h2>
                <p className="text-sm text-gray-600">
                  Opens in {formatTime(timeLeft)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <Music
                className={`h-16 w-16 text-emerald-500 mx-auto ${isPlaying ? "animate-bounce" : ""}`}
              />
              <h2 className="text-2xl font-bold text-white">Evening Zen</h2>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            {isLocked ? "Patience, Seeker." : "Ready to Meditate?"}
          </h1>
          <p className="text-gray-400">
            {isLocked
              ? "The mind needs discipline. Wait for the appointed hour (6 PM)."
              : "15 Minutes • Guided Visualization • Stress Relief"}
          </p>
        </div>

        {!isLocked && !isPlaying && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              How are you feeling right now?
            </p>
            <div className="flex justify-center space-x-4">
              {["😊 Happy", "😐 Neutral", "😫 Stressed", "😔 Sad"].map((m) => (
                <button
                  key={m}
                  onClick={() => logMood(m.split(" ")[1])}
                  className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition border border-gray-700 hover:border-emerald-500"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isLocked && (
          <Button
            size="lg"
            className="w-full h-14 text-lg rounded-full bg-emerald-600 hover:bg-emerald-500"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-5 w-5" /> Pause Session
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" /> Begin Session
              </>
            )}
          </Button>
        )}

        <audio
          ref={audioRef}
          src="https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music.ogg"
          onEnded={handleEnded}
        />
      </div>
    </div>
  );
}

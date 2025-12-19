"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Lock } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  title: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isLocked, setIsLocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsLocked(true);
            setIsPlaying(false);
            if (videoRef.current) videoRef.current.pause();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const togglePlay = () => {
    if (isLocked) return;
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
        {!isLocked ? (
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover"
            onClick={togglePlay}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 space-y-4">
            <Lock className="h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold text-white">Session Locked</h2>
            <p className="text-gray-400 text-center max-w-md">
              30-minute learning block complete. It's time for the "Write-Back"
              session. Upload your notes to unlock the next segment.
            </p>
            <Button className="bg-cyan-600 hover:bg-cyan-500">
              Upload Notes
            </Button>
          </div>
        )}

        {/* Controls Overlay */}
        {!isLocked && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-cyan-400 transition"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </button>
              <h3 className="text-white font-medium">{title}</h3>
            </div>
            <div className="flex items-center space-x-2 bg-black/50 px-3 py-1 rounded-full border border-gray-700">
              <div
                className={`h-2 w-2 rounded-full ${timeLeft < 300 ? "bg-red-500 animate-pulse" : "bg-green-500"}`}
              />
              <span className="text-white font-mono text-sm">
                {formatTime(timeLeft)} remaining
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

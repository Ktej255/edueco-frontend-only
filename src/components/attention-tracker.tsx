"use client";

import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Activity } from "lucide-react";
import api from "@/lib/api";

export default function AttentionTracker({
  onFocusUpdate,
}: {
  onFocusUpdate?: (score: number) => void;
}) {
  const webcamRef = useRef<Webcam>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [focusScore, setFocusScore] = useState(100);
  const [status, setStatus] = useState("Inactive");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking) {
      setStatus("Initializing AI Vision...");

      // Simulate AI model loading time
      setTimeout(() => {
        setStatus("Tracking Active");
      }, 1500);

      interval = setInterval(async () => {
        if (webcamRef.current) {
          // In a real production app, we would use MediaPipe FaceMesh here.
          // For this MVP, we'll simulate focus fluctuation based on "random" factors
          // to demonstrate the data flow and UI integration.

          // Simulate focus score (mostly high, occasionally drops)
          const randomDrop = Math.random() > 0.8 ? Math.random() * 20 : 0;
          const newScore = Math.min(100, Math.max(0, 100 - randomDrop));

          setFocusScore((prev) => {
            // Smooth transition
            const smoothed = prev * 0.7 + newScore * 0.3;
            return Math.round(smoothed);
          });

          // Send to backend occasionally
          if (Math.random() > 0.7) {
            try {
              await api.post("/monitoring/attention", null, {
                params: { focus_score: newScore },
              });
            } catch (e) {
              console.error("Failed to log attention", e);
            }
          }

          if (onFocusUpdate) {
            onFocusUpdate(newScore);
          }
        }
      }, 1000);
    } else {
      setStatus("Inactive");
    }

    return () => clearInterval(interval);
  }, [isTracking, onFocusUpdate]);

  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity
            className={`h-5 w-5 ${isTracking ? "text-green-500 animate-pulse" : "text-gray-500"}`}
          />
          <h3 className="font-bold text-white">Stealth Attention Tracker</h3>
        </div>
        <Button
          size="sm"
          variant={isTracking ? "destructive" : "default"}
          onClick={() => setIsTracking(!isTracking)}
          className={isTracking ? "" : "bg-cyan-600 hover:bg-cyan-500"}
        >
          {isTracking ? "Stop Tracking" : "Start Tracking"}
        </Button>
      </div>

      <div className="relative rounded-lg overflow-hidden bg-black aspect-video mb-4">
        {isTracking ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-cyan-400 font-mono text-sm">{status}</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {Math.round(focusScore)}%
                </p>
                <p className="text-gray-400 text-xs mt-1">FOCUS SCORE</p>
              </div>
            </div>
            {/* Face mesh overlay simulation */}
            <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-lg pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 border border-cyan-500/50 rounded-full pointer-events-none opacity-50" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <EyeOff className="h-12 w-12 mb-2" />
            <p>Camera Inactive</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Attention Span</span>
          <span>{isTracking ? "High" : "-"}</span>
        </div>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              focusScore > 80
                ? "bg-green-500"
                : focusScore > 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${isTracking ? focusScore : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}

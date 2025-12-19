"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Maximize,
  Activity,
} from "lucide-react";
import api from "@/lib/api";

import AttentionTracker from "@/components/attention-tracker";

export default function MonitoringPage() {
  const [examStarted, setExamStarted] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [violations, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [currentFocus, setCurrentFocus] = useState(100);

  // Fullscreen enforcement
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (examStarted && !document.fullscreenElement && !examFinished) {
        handleViolation("fullscreen_exit");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [examStarted, examFinished]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && examStarted && !examFinished) {
        handleViolation("tab_switch");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [examStarted, examFinished]);

  const handleStartExam = async () => {
    try {
      // Request fullscreen first
      await document.documentElement.requestFullscreen();

      const res = await api.post(
        "/monitoring/exam/start?exam_name=Midterm Physics",
      );
      setSessionId(res.data.session_id);
      setExamStarted(true);
      setViolations(0);
      setExamFinished(false);
    } catch (error) {
      console.error("Failed to start exam", error);
      alert("Could not start exam. Please ensure you allow fullscreen.");
    }
  };

  const handleViolation = async (type: string) => {
    if (!sessionId) return;
    try {
      const res = await api.post(
        `/monitoring/exam/violation?session_id=${sessionId}&violation_type=${type}`,
      );
      setViolations(res.data.total_violations);
      alert(
        `⚠️ VIOLATION DETECTED: ${type === "tab_switch" ? "Tab Switching" : "Exiting Fullscreen"}. This has been logged.`,
      );
    } catch (error) {
      console.error("Failed to log violation", error);
    }
  };

  const handleEndExam = async () => {
    if (!sessionId) return;
    try {
      await api.post(`/monitoring/exam/end?session_id=${sessionId}`);
      setExamFinished(true);
      setExamStarted(false);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } catch (error) {
      console.error("Failed to end exam", error);
    }
  };

  return (
    <div className="p-8 space-y-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Shield className="mr-3 h-8 w-8 text-cyan-500" />
              Exam Monitoring System
            </h1>
            <p className="text-gray-400 mt-2">
              Secure environment for high-stakes assessments.
            </p>
          </div>
        </div>

        {!examStarted && !examFinished ? (
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center max-w-2xl mx-auto">
            <Shield className="h-24 w-24 text-cyan-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready for Midterm Physics?
            </h2>
            <p className="text-gray-400 mb-8">
              This exam is monitored. Switching tabs or exiting fullscreen will
              be logged as a violation. Ensure you have a stable internet
              connection.
            </p>
            <Button
              onClick={handleStartExam}
              className="bg-cyan-600 hover:bg-cyan-500 text-lg px-8 py-6 h-auto"
            >
              <Maximize className="mr-2 h-5 w-5" />
              Enter Secure Mode & Start
            </Button>
          </div>
        ) : examStarted ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-xl flex items-center">
                <AlertTriangle className="h-10 w-10 text-red-500 mr-4" />
                <div>
                  <p className="text-red-400 text-sm font-bold uppercase">
                    Violations
                  </p>
                  <p className="text-3xl font-bold text-white">{violations}</p>
                </div>
              </div>
              <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl flex items-center">
                <CheckCircle className="h-10 w-10 text-green-500 mr-4" />
                <div>
                  <p className="text-green-400 text-sm font-bold uppercase">
                    Status
                  </p>
                  <p className="text-xl font-bold text-white">
                    Monitoring Active
                  </p>
                </div>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-xl flex items-center">
                <Activity className="h-10 w-10 text-blue-500 mr-4" />
                <div>
                  <p className="text-blue-400 text-sm font-bold uppercase">
                    Current Focus
                  </p>
                  <p className="text-xl font-bold text-white">
                    {currentFocus}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white text-black p-12 rounded-xl min-h-[400px] shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Question 1 of 20</h2>
              <p className="text-lg mb-8">
                Calculate the escape velocity of a projectile from the surface
                of the Earth. Assume g = 9.8 m/s² and R = 6400 km.
              </p>
              <textarea
                className="w-full h-40 p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="Type your answer here..."
              />
              <div className="flex justify-end mt-6">
                <Button onClick={handleEndExam} variant="destructive">
                  Submit Exam
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center max-w-2xl mx-auto">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Exam Submitted!
            </h2>
            <p className="text-gray-400 mb-6">
              Your responses have been recorded.
            </p>
            <div className="bg-gray-800 p-4 rounded-lg inline-block mb-6">
              <p className="text-gray-300">
                Total Violations Recorded:{" "}
                <span className="text-white font-bold">{violations}</span>
              </p>
            </div>
            <br />
            <Button onClick={() => setExamFinished(false)} variant="outline">
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>

      {/* Sidebar with Attention Tracker */}
      <div className="w-full lg:w-80 space-y-6">
        <AttentionTracker onFocusUpdate={setCurrentFocus} />

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="font-bold text-white mb-4">Proctoring Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Fullscreen</span>
              <span
                className={isFullscreen ? "text-green-500" : "text-red-500"}
              >
                {isFullscreen ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Tab Focus</span>
              <span className="text-green-500">Active</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Webcam</span>
              <span className="text-green-500">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

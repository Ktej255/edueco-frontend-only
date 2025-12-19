"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Square, Target, Clock, TrendingUp } from "lucide-react";
import api from "@/lib/api";

export default function ShadowModePage() {
  const [progress, setProgress] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startingSession, setStartingSession] = useState(false);
  const [goalsInput, setGoalsInput] = useState("3");
  const [focusScore, setFocusScore] = useState(5);
  const [completedGoals, setCompletedGoals] = useState(0);

  useEffect(() => {
    fetchProgress();
    const interval = setInterval(fetchProgress, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await api.get("/shadow-mode/progress");
      setProgress(response.data);
      setActiveSession(response.data.active_session);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
    setStartingSession(true);
    try {
      const nextDay = (progress?.current_day || 0) + 1;
      await api.post("/shadow-mode/start", null, {
        params: {
          day_number: nextDay,
          total_goals: parseInt(goalsInput),
        },
      });
      await fetchProgress();
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setStartingSession(false);
    }
  };

  const endSession = async () => {
    try {
      await api.post("/shadow-mode/end", null, {
        params: {
          goals_completed: completedGoals,
          focus_score: focusScore / 10,
          notes: "Completed shadow mode session",
        },
      });
      await fetchProgress();
      setCompletedGoals(0);
      setFocusScore(5);
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          7-Day Shadow Mode
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Deep focus sessions to build unbreakable concentration. Complete 7
          days to unlock massive rewards.
        </p>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-900/30 rounded-xl">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Days Completed</p>
              <p className="text-3xl font-bold text-white">
                {progress?.completed_days || 0}/7
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-800 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-900/30 rounded-xl">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Time</p>
              <p className="text-3xl font-bold text-white">
                {progress?.total_minutes || 0}m
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-800 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-900/30 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Focus Score</p>
              <p className="text-3xl font-bold text-white">
                {progress?.avg_focus_score || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Day Tracker */}
      <Card className="bg-gray-900 border-gray-800 p-8">
        <h3 className="text-xl font-bold text-white mb-6">7-Day Progress</h3>
        <div className="grid grid-cols-7 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const session = progress?.sessions?.find(
              (s: any) => s.day_number === day,
            );
            const isCompleted = session && !session.is_active;
            const isActive = activeSession && activeSession.day_number === day;

            return (
              <div
                key={day}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-4 transition ${
                  isActive
                    ? "border-purple-500 bg-purple-900/30"
                    : isCompleted
                      ? "border-green-500 bg-green-900/20"
                      : "border-gray-700 bg-gray-800/50"
                }`}
              >
                <div className="text-2xl font-bold text-white">Day {day}</div>
                {isCompleted && (
                  <div className="mt-2 text-sm text-green-400">
                    ✓ {session.duration_minutes}m
                  </div>
                )}
                {isActive && (
                  <div className="mt-2 text-sm text-purple-400 animate-pulse">
                    Active...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Session Control */}
      {activeSession ? (
        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/50 p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Day {activeSession.day_number} in Progress
              </h3>
              <p className="text-gray-400">
                Stay focused and complete your goals!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Goals Completed</label>
                <Input
                  type="number"
                  value={completedGoals}
                  onChange={(e) =>
                    setCompletedGoals(parseInt(e.target.value) || 0)
                  }
                  max={activeSession.total_goals}
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Out of {activeSession.total_goals} goals
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-400">
                  Focus Score (1-10)
                </label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={focusScore}
                  onChange={(e) => setFocusScore(parseInt(e.target.value))}
                  className="mt-2"
                />
                <p className="text-center text-2xl font-bold text-white mt-2">
                  {focusScore}/10
                </p>
              </div>
            </div>

            <Button
              onClick={endSession}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white h-14 text-lg"
            >
              <Square className="mr-2 h-5 w-5" />
              End Session
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="bg-gray-900 border-gray-800 p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Start Your Focus Session
              </h3>
              <p className="text-gray-400">
                Set your goals and enter shadow mode
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <label className="text-sm text-gray-400">Number of Goals</label>
              <Input
                type="number"
                value={goalsInput}
                onChange={(e) => setGoalsInput(e.target.value)}
                min="1"
                max="10"
                className="bg-gray-800 border-gray-700 text-white mt-2"
              />
            </div>

            <Button
              onClick={startSession}
              disabled={startingSession}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white h-14 text-lg"
            >
              <Play className="mr-2 h-5 w-5" />
              {startingSession ? "Starting..." : "Start Shadow Mode"}
            </Button>
          </div>
        </Card>
      )}

      {/* Recent Sessions */}
      {progress?.sessions && progress.sessions.length > 0 && (
        <Card className="bg-gray-900 border-gray-800 p-8">
          <h3 className="text-xl font-bold text-white mb-4">Recent Sessions</h3>
          <div className="space-y-3">
            {progress.sessions.slice(0, 5).map((session: any) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">
                    Day {session.day_number}
                  </p>
                  <p className="text-sm text-gray-400">
                    {session.goals_completed}/{session.total_goals} goals
                    completed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">
                    {session.duration_minutes}m
                  </p>
                  <p className="text-sm text-green-400">
                    Focus:{" "}
                    {session.focus_score
                      ? (session.focus_score * 10).toFixed(0)
                      : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

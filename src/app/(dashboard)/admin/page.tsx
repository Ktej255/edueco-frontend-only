"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, TrendingUp, Shield, BookOpen, BarChart3, Brain, GraduationCap, ExternalLink, Zap } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Platform overview and key metrics</p>
      </div>

      {/* Portal Access Buttons - Opens in New Tab */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Quick Portal Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Teacher Portal */}
          <a
            href="/teacher/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-700/30 border-emerald-500/50 p-6 hover:border-emerald-400 hover:scale-[1.02] transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-300 text-sm">Content Management</p>
                  <p className="text-2xl font-bold text-white mt-1">👨‍🏫 Teacher Portal</p>
                  <p className="text-emerald-200/70 text-sm mt-2">Upload videos, manage courses</p>
                </div>
                <ExternalLink className="h-8 w-8 text-emerald-400" />
              </div>
            </Card>
          </a>

          {/* Student Portal */}
          <a
            href="/student/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="bg-gradient-to-br from-blue-900/40 to-blue-700/30 border-blue-500/50 p-6 hover:border-blue-400 hover:scale-[1.02] transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm">Learning Experience</p>
                  <p className="text-2xl font-bold text-white mt-1">🎓 Student Portal</p>
                  <p className="text-blue-200/70 text-sm mt-2">View as a student would see</p>
                </div>
                <ExternalLink className="h-8 w-8 text-blue-400" />
              </div>
            </Card>
          </a>

          {/* UPSC Batch 1 Content (Direct Access) */}
          <a
            href="/teacher/batch1"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="bg-gradient-to-br from-indigo-900/40 to-indigo-700/30 border-indigo-500/50 p-6 hover:border-indigo-400 hover:scale-[1.02] transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-300 text-sm">Quick Upload</p>
                  <p className="text-2xl font-bold text-white mt-1">📚 UPSC Batch 1</p>
                  <p className="text-indigo-200/70 text-sm mt-2">Upload Prelims videos</p>
                </div>
                <ExternalLink className="h-8 w-8 text-indigo-400" />
              </div>
            </Card>
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-700/20 border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white">
                {stats?.users?.total || 0}
              </p>
            </div>
            <Users className="h-12 w-12 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/30 to-green-700/20 border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-3xl font-bold text-white">
                {stats?.users?.active || 0}
              </p>
            </div>
            <Shield className="h-12 w-12 text-green-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/30 to-purple-700/20 border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Submissions</p>
              <p className="text-3xl font-bold text-white">
                {stats?.content?.submissions || 0}
              </p>
            </div>
            <FileText className="h-12 w-12 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/30 to-orange-700/20 border-orange-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Coins</p>
              <p className="text-3xl font-bold text-white">
                {stats?.engagement?.avg_coins || 0}
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Drill System Quick Access */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Drill Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/drill/questions">
            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-700/20 border-blue-500/30 p-6 hover:border-blue-400/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Drill Questions</p>
                  <p className="text-xl font-bold text-white mt-1">Manage Content</p>
                </div>
                <BookOpen className="h-10 w-10 text-blue-400" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/drill/analytics">
            <Card className="bg-gradient-to-br from-green-900/30 to-green-700/20 border-green-500/30 p-6 hover:border-green-400/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Drill Analytics</p>
                  <p className="text-xl font-bold text-white mt-1">View Performance</p>
                </div>
                <BarChart3 className="h-10 w-10 text-green-400" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/drill/insights">
            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-700/20 border-purple-500/30 p-6 hover:border-purple-400/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">AI Insights</p>
                  <p className="text-xl font-bold text-white mt-1">Grok Analysis</p>
                </div>
                <Brain className="h-10 w-10 text-purple-400" />
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* CRM & User Management */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">CRM & User Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/admin/leads">
            <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-700/20 border-cyan-500/30 p-6 hover:border-cyan-400/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Lead Management</p>
                  <p className="text-xl font-bold text-white mt-1">Manage Leads</p>
                </div>
                <Users className="h-10 w-10 text-cyan-400" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/marketing-automation">
            <Card className="bg-gradient-to-br from-orange-900/30 to-orange-700/20 border-orange-500/30 p-6 hover:border-orange-400/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Marketing Automation</p>
                  <p className="text-xl font-bold text-white mt-1">Drip Campaigns</p>
                </div>
                <Zap className="h-10 w-10 text-orange-400" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/user-management">
            <Card className="bg-gradient-to-br from-amber-900/30 to-amber-700/20 border-amber-500/30 p-6 hover:border-amber-400/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">User Management</p>
                  <p className="text-xl font-bold text-white mt-1">Permissions & Logs</p>
                </div>
                <Shield className="h-10 w-10 text-amber-400" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="bg-gradient-to-br from-rose-900/30 to-rose-700/20 border-rose-500/30 p-6 hover:border-rose-400/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Analytics</p>
                  <p className="text-xl font-bold text-white mt-1">View Reports</p>
                </div>
                <BarChart3 className="h-10 w-10 text-rose-400" />
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-xl font-bold text-white mb-4">User Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Banned Users</span>
              <span className="text-white font-bold">
                {stats?.users?.banned || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">New This Week</span>
              <span className="text-white font-bold">
                {stats?.users?.new_this_week || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Average Streak</span>
              <span className="text-white font-bold">
                {stats?.engagement?.avg_streak || 0} days
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Content Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Shadow Sessions</span>
              <span className="text-white font-bold">
                {stats?.content?.shadow_sessions || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Groups</span>
              <span className="text-white font-bold">
                {stats?.content?.groups || 0}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

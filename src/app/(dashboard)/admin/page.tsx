"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, TrendingUp, Shield, BookOpen, BarChart3, Brain, GraduationCap, ExternalLink, Zap, Activity, ArrowRight } from "lucide-react";
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
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400 rounded-full blur-3xl opacity-20 -ml-10 -mb-10"></div>

        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm border border-white/10">
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-display leading-tight text-white">
                Welcome to Admin Panel 👋
              </h1>
              <p className="text-indigo-100 text-lg">
                Platform overview and key metrics at a glance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Users</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.users?.total || 0}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active Users</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.users?.active || 0}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Submissions</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.content?.submissions || 0}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Coins</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.engagement?.avg_coins || 0}</h4>
          </div>
        </div>
      </div>

      {/* Portal Access Cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-indigo-600" />
          Quick Portal Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/teacher/dashboard" target="_blank" rel="noopener noreferrer" className="block">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500 hover:border-emerald-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Content Management</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">👨‍🏫 Teacher Portal</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Upload videos, manage courses</p>
                  </div>
                  <ExternalLink className="h-6 w-6 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </a>

          <a href="/student/dashboard" target="_blank" rel="noopener noreferrer" className="block">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-blue-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Learning Experience</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">🎓 Student Portal</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">View as a student would see</p>
                  </div>
                  <ExternalLink className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </a>

          <a href="/teacher/batch1" target="_blank" rel="noopener noreferrer" className="block">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500 hover:border-indigo-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">Quick Upload</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">📚 UPSC Batch 1</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Upload Prelims videos</p>
                  </div>
                  <ExternalLink className="h-6 w-6 text-indigo-500" />
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>

      {/* Drill Management Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Drill Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/drill/questions">
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Drill Questions</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Manage Content</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/drill/analytics">
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Drill Analytics</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">View Performance</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/drill/insights">
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                      <Brain className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">AI Insights</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Grok Analysis</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* CRM & User Management Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">CRM & User Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/admin/leads">
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-3">
                  <Users className="h-5 w-5 text-cyan-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Lead Management</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Manage Leads</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/marketing-automation">
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Marketing Automation</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Drip Campaigns</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/user-management">
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">User Management</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Permissions & Logs</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-3">
                  <BarChart3 className="h-5 w-5 text-rose-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Analytics</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">View Reports</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Banned Users</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{stats?.users?.banned || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">New This Week</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{stats?.users?.new_this_week || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Average Streak</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{stats?.engagement?.avg_streak || 0} days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Shadow Sessions</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{stats?.content?.shadow_sessions || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Total Groups</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{stats?.content?.groups || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


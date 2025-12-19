"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, Lock, Unlock, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/Toast";
import api from "@/lib/api";

interface LearningGroup {
  id: number;
  name: string;
  description: string;
  group_type: string;
  privacy: string;
  member_count: number;
  created_at: string;
}

export default function LearningGroupsPage() {
  const [groups, setGroups] = useState<LearningGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get("/learning-groups/groups");
      setGroups(response.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      showToast("Failed to load groups", "error");
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: number) => {
    try {
      await api.post(`/learning-groups/groups/${groupId}/join`);
      showToast("Joined group successfully!", "success");
      fetchGroups();
    } catch (error: any) {
      showToast(
        error.response?.data?.detail || "Failed to join group",
        "error",
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSkeleton variant="card" count={4} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <Users className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Learning Groups
            </h1>
            <p className="text-gray-400 mt-1">Connect and learn together</p>
          </div>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Group Types Filter */}
      <div className="flex gap-3 mb-6">
        {["All", "Study", "Project", "Discussion", "Peer Support"].map(
          (type) => (
            <button
              key={type}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              {type}
            </button>
          ),
        )}
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800 p-12 text-center">
          <Users className="h-16 w-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No groups yet</h3>
          <p className="text-gray-400 mb-4">
            Be the first to create a learning group!
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Your First Group
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-purple-500/50 transition-colors p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {group.privacy === "public" ? (
                    <Unlock className="h-5 w-5 text-green-400" />
                  ) : (
                    <Lock className="h-5 w-5 text-yellow-400" />
                  )}
                  <span className="text-xs text-gray-400 uppercase">
                    {group.group_type}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{group.member_count}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {group.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {group.description}
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={() => joinGroup(group.id)}
                  className="flex-1 bg-purple-600 hover:bg-purple-500"
                >
                  Join Group
                </Button>
                <Button variant="outline" className="border-gray-700">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

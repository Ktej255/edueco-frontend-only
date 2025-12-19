"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Trophy,
  Zap,
  TrendingUp,
  MessageCircle,
  Crown,
  Star,
} from "lucide-react";
import api from "@/lib/api";

export default function CommunityPage() {
  const [myGroup, setMyGroup] = useState<any>(null);
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupData();
  }, []);

  const fetchGroupData = async () => {
    try {
      const [groupResponse, allGroupsResponse] = await Promise.all([
        api.get("/social/groups/my").catch(() => ({ data: [] })),
        api.get("/social/groups/leaderboard").catch(() => ({ data: [] })),
      ]);
      // Take the first group if available, as the UI expects a single group
      setMyGroup(
        Array.isArray(groupResponse.data) && groupResponse.data.length > 0
          ? groupResponse.data[0]
          : null,
      );
      setAllGroups(allGroupsResponse.data);
    } catch (error) {
      console.error("Failed to fetch group data:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async () => {
    try {
      const response = await api.post("/groups/join");
      setMyGroup(response.data);
    } catch (error) {
      console.error("Failed to join group:", error);
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
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-600">
          🐺 Wolf Pack Community
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Join forces with learners at your level. Compete, collaborate, and
          conquer together!
        </p>
      </div>

      {/* My Group */}
      {myGroup ? (
        <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/20 border-orange-500/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-orange-500/20 rounded-xl">
                <Users className="h-10 w-10 text-orange-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {myGroup.name}
                </h2>
                <p className="text-gray-400">
                  {myGroup.description || "A pack of determined learners"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Group Rank</p>
              <p className="text-4xl font-bold text-orange-400">
                #{myGroup.rank || 1}
              </p>
            </div>
          </div>

          {/* Group Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-black/20 p-4 rounded-lg border border-orange-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-orange-400" />
                <span className="text-gray-400 text-sm">Members</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {myGroup.member_count || 0}/5
              </p>
            </div>
            <div className="bg-black/20 p-4 rounded-lg border border-orange-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">Avg Streak</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {myGroup.avg_streak || 0} days
              </p>
            </div>
            <div className="bg-black/20 p-4 rounded-lg border border-orange-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="h-4 w-4 text-purple-400" />
                <span className="text-gray-400 text-sm">Total Coins</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {myGroup.total_coins || 0}
              </p>
            </div>
          </div>

          {/* Members */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Pack Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Mock members - in reality, fetch from API */}
              {[
                {
                  name: "Alpha Leader",
                  streak: 15,
                  coins: 2500,
                  isLeader: true,
                },
                {
                  name: "Beta Learner",
                  streak: 12,
                  coins: 1800,
                  isLeader: false,
                },
                {
                  name: "Gamma Student",
                  streak: 10,
                  coins: 1500,
                  isLeader: false,
                },
                { name: "You", streak: 8, coins: 1200, isLeader: false },
              ].map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
                      {member.isLeader && (
                        <Crown className="h-5 w-5 text-yellow-300" />
                      )}
                      {!member.isLeader && (
                        <span className="text-white font-bold">
                          {member.name[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span className="flex items-center">
                          <Zap className="h-3 w-3 mr-1 text-yellow-400" />
                          {member.streak}d
                        </span>
                        <span className="flex items-center">
                          <Trophy className="h-3 w-3 mr-1 text-purple-400" />
                          {member.coins}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-gray-900 border-gray-800 p-12 text-center">
          <Users className="h-20 w-20 text-gray-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            You're Not in a Pack Yet!
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Join a Wolf Pack to collaborate with learners at your level, share
            progress, and climb the leaderboard together.
          </p>
          <Button
            onClick={joinGroup}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-8 py-6 text-lg"
          >
            <Users className="mr-2 h-5 w-5" />
            Join a Wolf Pack
          </Button>
        </Card>
      )}

      {/* Global Leaderboard */}
      <Card className="bg-gray-900 border-gray-800 p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Trophy className="mr-3 h-6 w-6 text-yellow-400" />
          Wolf Pack Leaderboard
        </h3>
        <div className="space-y-3">
          {/* Mock leaderboard data */}
          {[
            {
              name: "Iron Wolves",
              members: 5,
              avgStreak: 20,
              totalCoins: 12000,
              rank: 1,
            },
            {
              name: "Cyber Titans",
              members: 5,
              avgStreak: 18,
              totalCoins: 10500,
              rank: 2,
            },
            {
              name: "Quantum Seekers",
              members: 4,
              avgStreak: 15,
              totalCoins: 9200,
              rank: 3,
            },
            {
              name: "Shadow Nomads",
              members: 5,
              avgStreak: 14,
              totalCoins: 8800,
              rank: 4,
            },
            {
              name: "Solar Pilots",
              members: 3,
              avgStreak: 12,
              totalCoins: 7500,
              rank: 5,
            },
          ].map((group, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                i < 3
                  ? "bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30"
                  : "bg-gray-800/50 border-gray-700"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    i === 0
                      ? "bg-yellow-500 text-black"
                      : i === 1
                        ? "bg-gray-400 text-black"
                        : i === 2
                          ? "bg-orange-600 text-white"
                          : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {i < 3 ? <Star className="h-5 w-5" /> : group.rank}
                </div>
                <div>
                  <p className="text-white font-bold">{group.name}</p>
                  <p className="text-gray-400 text-sm">
                    {group.members} members
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-right">
                  <p className="text-gray-400">Avg Streak</p>
                  <p className="text-white font-bold">{group.avgStreak} days</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">Total Coins</p>
                  <p className="text-white font-bold">
                    {group.totalCoins.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pack Activity Feed */}
      <Card className="bg-gray-900 border-gray-800 p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="mr-3 h-6 w-6 text-green-400" />
          Recent Pack Activity
        </h3>
        <div className="space-y-4">
          {[
            {
              user: "Alpha Leader",
              action: "completed Shadow Mode Day 5",
              time: "2 hours ago",
              icon: "🎯",
            },
            {
              user: "Beta Learner",
              action: "earned First Upload badge",
              time: "5 hours ago",
              icon: "🏆",
            },
            {
              user: "Gamma Student",
              action: "reached 10-day streak",
              time: "1 day ago",
              icon: "🔥",
            },
            {
              user: "Delta Member",
              action: "joined the pack",
              time: "2 days ago",
              icon: "👋",
            },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-start space-x-4 p-3 bg-gray-800/30 rounded-lg"
            >
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-white">
                  <span className="font-bold">{activity.user}</span>{" "}
                  {activity.action}
                </p>
                <p className="text-gray-400 text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

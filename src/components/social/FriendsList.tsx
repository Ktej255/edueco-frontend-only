"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { UserPlus, UserCheck, UserX, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

interface User {
  id: number;
  full_name: string;
  email: string;
}

interface FriendsListProps {
  onSelectFriend: (friend: User) => void;
}

export default function FriendsList({ onSelectFriend }: FriendsListProps) {
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [addFriendId, setAddFriendId] = useState("");

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await api.get("/social/friends");
      setFriends(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error('Failed to load friends list')
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!addFriendId) return;
    try {
      await api.post(`/social/friends/request/${addFriendId}`);
      setAddFriendId("");
      toast.success('Friend request sent!');
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error('Failed to send friend request');
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-4">Friends</h3>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="User ID to add..."
          value={addFriendId}
          onChange={(e) => setAddFriendId(e.target.value)}
          className="bg-gray-800 border-gray-700"
        />
        <Button
          onClick={handleAddFriend}
          size="icon"
          className="bg-blue-600 hover:bg-blue-500"
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <LoadingSkeleton variant="list" count={5} />
        ) : friends.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No friends yet</p>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition cursor-pointer"
              onClick={() => onSelectFriend(friend)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {friend.full_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">
                    {friend.full_name}
                  </p>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

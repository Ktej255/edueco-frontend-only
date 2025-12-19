"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Users, Plus, Lock, Globe, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VideoRoom from "@/components/video/VideoRoom";
import { useAuth } from "@/contexts/auth-context";
import { toast } from 'sonner'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

interface Group {
  id: number;
  name: string;
  description: string;
  privacy: string;
  created_by: number;
}

export default function StudyGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeVideoRoom, setActiveVideoRoom] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get("/learning-groups/groups/my");
      setGroups(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error('Failed to load study groups')
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const response = await api.post("/learning-groups/groups", {
        name: newGroupName,
        description: newGroupDesc,
        privacy: isPrivate ? "private" : "public",
        group_type: "study",
      });
      setGroups([...groups, response.data]);
      setOpen(false);
      setNewGroupName("");
      setNewGroupDesc("");
      toast.success('Study group created!')
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error('Failed to create group')
    }
  };

  if (activeVideoRoom && user) {
    return (
      <div className="h-full">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Video Room</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveVideoRoom(null)}
          >
            Back to Groups
          </Button>
        </div>
        <VideoRoom
          roomUrl={`https://demo.daily.co/${activeVideoRoom}`}
          userName={user?.full_name || 'Guest'}
          onLeave={() => setActiveVideoRoom(null)}
        /> </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Study Groups</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-green-600 hover:bg-green-500">
              <Plus className="h-4 w-4 mr-1" /> New
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Create Study Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
              <Input
                placeholder="Description"
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded bg-gray-800 border-gray-700"
                />
                <label htmlFor="private" className="text-sm text-gray-300">
                  Private Group
                </label>
              </div>
              <Button
                onClick={handleCreateGroup}
                className="w-full bg-blue-600 hover:bg-blue-500"
              >
                Create Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {loading ? (
          <LoadingSkeleton variant="card" count={3} />
        ) : groups.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No groups joined</p>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="p-4 bg-gray-800/50 rounded-lg border border-gray-800 hover:border-gray-700 transition group"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-white group-hover:text-blue-400 transition">
                  {group.name}
                </h4>
                {group.privacy === "private" ? (
                  <Lock className="h-3 w-3 text-yellow-500" />
                ) : (
                  <Globe className="h-3 w-3 text-green-500" />
                )}
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                {group.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>Members</span>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 text-xs bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 border border-blue-900"
                  onClick={() => setActiveVideoRoom(`group_${group.id}`)}
                >
                  <Video className="h-3 w-3 mr-1" /> Join Room
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

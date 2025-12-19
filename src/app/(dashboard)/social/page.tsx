"use client";

import { useState } from "react";
import FriendsList from "@/components/social/FriendsList";
import MessageThread from "@/components/social/MessageThread";
import StudyGroups from "@/components/social/StudyGroups";
import { useAuth } from "@/contexts/auth-context";

export default function SocialPage() {
  const { user } = useAuth();
  const [selectedFriend, setSelectedFriend] = useState<any>(null);

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-6rem)] p-6 grid grid-cols-12 gap-6">
      {/* Left Sidebar: Friends & Groups */}
      <div className="col-span-12 md:col-span-3 flex flex-col gap-6 h-full">
        <div className="flex-1 min-h-0">
          <FriendsList onSelectFriend={setSelectedFriend} />
        </div>
        <div className="flex-1 min-h-0">
          <StudyGroups />
        </div>
      </div>

      {/* Main Content: Messaging */}
      <div className="col-span-12 md:col-span-9 h-full">
        {selectedFriend ? (
          <MessageThread currentUser={user} selectedFriend={selectedFriend} />
        ) : (
          <div className="h-full bg-gray-900 rounded-lg border border-gray-800 flex flex-col items-center justify-center text-gray-400">
            <div className="p-4 bg-gray-800 rounded-full mb-4">
              <span className="text-4xl">👋</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Welcome to Social Hub
            </h2>
            <p>Select a friend to start chatting or join a study group.</p>
          </div>
        )}
      </div>
    </div>
  );
}

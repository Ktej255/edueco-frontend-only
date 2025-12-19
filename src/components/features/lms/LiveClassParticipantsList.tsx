"use client";

import React, { useState } from "react";
import { Users, Search, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { OnlineUser } from "@/hooks/useLiveClassWebSocket";

interface LiveClassParticipantsListProps {
  participants: OnlineUser[];
  instructorId: number;
}

export function LiveClassParticipantsList({
  participants,
  instructorId,
}: LiveClassParticipantsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParticipants = participants.filter((p) =>
    p.user_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="h-full bg-gray-900 border-gray-800 flex flex-col">
      <CardHeader className="pb-2 border-b border-gray-800">
        <CardTitle className="text-sm font-medium text-gray-200 flex items-center gap-2">
          <Users className="h-4 w-4 text-cyan-500" />
          Participants
          <Badge
            variant="secondary"
            className="ml-auto bg-gray-800 text-gray-400"
          >
            {participants.length}
          </Badge>
        </CardTitle>
        <div className="pt-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-500" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 bg-gray-800 border-gray-700 text-xs"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {filteredParticipants.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              No participants found
            </div>
          ) : (
            filteredParticipants.map((p) => {
              const isInstructor = p.user_id === instructorId;
              return (
                <div
                  key={p.user_id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8 border border-gray-700">
                      <AvatarFallback
                        className={`text-xs ${isInstructor ? "bg-cyan-900 text-cyan-200" : "bg-gray-800 text-gray-300"}`}
                      >
                        {p.user_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-gray-900" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium truncate ${isInstructor ? "text-cyan-400" : "text-gray-200"}`}
                      >
                        {p.user_name}
                      </span>
                      {isInstructor && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-4 px-1 border-cyan-500/30 text-cyan-400"
                        >
                          Host
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useEffect, useState, useCallback } from "react";
import DailyIframe from "@daily-co/daily-js";
import {
  DailyProvider,
  useCallObject,
  useParticipantIds,
  useVideoTrack,
  useAudioTrack,
  useScreenShare,
  DailyVideo,
  DailyAudio,
} from "@daily-co/daily-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface VideoRoomProps {
  roomUrl: string;
  onLeave: () => void;
  userName: string;
}

export default function VideoRoom({
  roomUrl,
  onLeave,
  userName,
}: VideoRoomProps) {
  const [callObject, setCallObject] = useState<any>(null);

  useEffect(() => {
    const newCallObject = DailyIframe.createCallObject({});
    setCallObject(newCallObject);

    return () => {
      newCallObject.destroy();
    };
  }, []);

  if (!callObject) return null;

  return (
    <DailyProvider callObject={callObject}>
      <RoomContent roomUrl={roomUrl} onLeave={onLeave} userName={userName} />
    </DailyProvider>
  );
}

function RoomContent({ roomUrl, onLeave, userName }: VideoRoomProps) {
  const callObject = useCallObject({});
  const participantIds = useParticipantIds();
  const [isJoined, setIsJoined] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const { isSharingScreen, startScreenShare, stopScreenShare } =
    useScreenShare();

  useEffect(() => {
    if (!callObject) return;

    const joinRoom = async () => {
      try {
        await callObject.join({ url: roomUrl, userName });
        setIsJoined(true);
      } catch (error) {
        console.error("Failed to join room:", error);
        toast.error("Failed to join video room");
      }
    };

    joinRoom();

    return () => {
      callObject.leave();
    };
  }, [callObject, roomUrl, userName]);

  const toggleMic = useCallback(() => {
    callObject?.setLocalAudio(!isMicOn);
    setIsMicOn(!isMicOn);
  }, [callObject, isMicOn]);

  const toggleCamera = useCallback(() => {
    callObject?.setLocalVideo(!isCameraOn);
    setIsCameraOn(!isCameraOn);
  }, [callObject, isCameraOn]);

  const toggleScreenShare = useCallback(() => {
    if (isSharingScreen) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  }, [isSharingScreen, startScreenShare, stopScreenShare]);

  if (!isJoined) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-muted rounded-lg">
        <p className="text-lg text-muted-foreground">Joining room...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[80vh] gap-4">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-black/90 rounded-lg overflow-y-auto">
        {participantIds.map((id) => (
          <ParticipantTile key={id} id={id} />
        ))}
      </div>

      <Card className="p-4 flex justify-center gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button
          variant={isMicOn ? "outline" : "destructive"}
          size="icon"
          onClick={toggleMic}
          className="rounded-full h-12 w-12"
        >
          {isMicOn ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant={isCameraOn ? "outline" : "destructive"}
          size="icon"
          onClick={toggleCamera}
          className="rounded-full h-12 w-12"
        >
          {isCameraOn ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant={isSharingScreen ? "secondary" : "outline"}
          size="icon"
          onClick={toggleScreenShare}
          className="rounded-full h-12 w-12"
        >
          <Monitor className="h-5 w-5" />
        </Button>

        <Button
          variant="destructive"
          size="icon"
          onClick={onLeave}
          className="rounded-full h-12 w-12 ml-4"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>

        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{participantIds.length} participants</span>
        </div>
      </Card>
    </div>
  );
}

function ParticipantTile({ id }: { id: string }) {
  const videoTrack = useVideoTrack(id);
  const audioTrack = useAudioTrack(id);

  return (
    <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <DailyVideo
        sessionId={id}
        type="video"
        className="w-full h-full object-cover"
        fit="cover"
      />
      <DailyAudio />

      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
        {id === "local" ? "You" : "Participant"}
      </div>

      {videoTrack.isOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-2xl text-gray-400">
              {id === "local" ? "You" : "User"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

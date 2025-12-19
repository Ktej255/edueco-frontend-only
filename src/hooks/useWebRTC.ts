import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";

interface PeerConnection {
  [sid: string]: RTCPeerConnection;
}

interface WebRTCProps {
  roomId: string;
  userId: number;
  socket: Socket | null;
}

export const useWebRTC = ({ roomId, userId, socket }: WebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{
    [sid: string]: MediaStream;
  }>({});
  const peersRef = useRef<PeerConnection>({});
  const localStreamRef = useRef<MediaStream | null>(null);

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  const createPeerConnection = useCallback(
    (targetSid: string) => {
      const pc = new RTCPeerConnection(iceServers);

      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("ice_candidate", {
            target_sid: targetSid,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        setRemoteStreams((prev) => ({
          ...prev,
          [targetSid]: event.streams[0],
        }));
      };

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      peersRef.current[targetSid] = pc;
      return pc;
    },
    [socket],
  );

  const joinRoom = useCallback(async () => {
    if (!socket) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      localStreamRef.current = stream;

      socket.emit("join_video_room", { room_id: roomId, user_id: userId });

      socket.on("user_joined", async ({ sid }: { sid: string }) => {
        const pc = createPeerConnection(sid);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", {
          target_sid: sid,
          sdp: offer,
          sender_id: userId,
        });
      });

      socket.on(
        "offer",
        async ({
          sdp,
          sender_sid,
        }: {
          sdp: RTCSessionDescriptionInit;
          sender_sid: string;
        }) => {
          const pc = createPeerConnection(sender_sid);
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", {
            target_sid: sender_sid,
            sdp: answer,
          });
        },
      );

      socket.on(
        "answer",
        async ({
          sdp,
          sender_sid,
        }: {
          sdp: RTCSessionDescriptionInit;
          sender_sid: string;
        }) => {
          const pc = peersRef.current[sender_sid];
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          }
        },
      );

      socket.on(
        "ice_candidate",
        async ({
          candidate,
          sender_sid,
        }: {
          candidate: RTCIceCandidateInit;
          sender_sid: string;
        }) => {
          const pc = peersRef.current[sender_sid];
          if (pc) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        },
      );

      socket.on("user_left", ({ sid }: { sid: string }) => {
        if (peersRef.current[sid]) {
          peersRef.current[sid].close();
          delete peersRef.current[sid];
          setRemoteStreams((prev) => {
            const newStreams = { ...prev };
            delete newStreams[sid];
            return newStreams;
          });
        }
      });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, [socket, roomId, userId, createPeerConnection]);

  const leaveRoom = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    Object.values(peersRef.current).forEach((pc) => pc.close());
    peersRef.current = {};
    setLocalStream(null);
    setRemoteStreams({});

    if (socket) {
      socket.emit("leave_video_room", { room_id: roomId });
      socket.off("user_joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice_candidate");
      socket.off("user_left");
    }
  }, [socket, roomId]);

  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, []); // Cleanup on unmount

  return {
    localStream,
    remoteStreams,
    joinRoom,
    leaveRoom,
  };
};

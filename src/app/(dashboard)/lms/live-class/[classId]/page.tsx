"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LiveClassViewer } from "@/components/features/lms/LiveClassViewer";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LiveClassSessionPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params?.classId as string;

  const [liveClass, setLiveClass] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Live Class Details
        const classResponse = await api.get(`/live-classes/${classId}`);
        setLiveClass(classResponse.data);

        // 2. Fetch Current User (or get from store/context)
        const userResponse = await api.get("/users/me");
        const user = userResponse.data;

        // Determine role based on class instructor
        const role =
          user.id === classResponse.data.instructor_id
            ? "instructor"
            : "student";

        setCurrentUser({
          id: user.id,
          name: user.full_name,
          role: role,
        });

        // 3. Get WebSocket Token (if separate auth needed, otherwise use main token)
        // For now assuming we use the main auth token which we might need to retrieve
        // In a real app, this might come from a cookie or local storage
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        } else {
          throw new Error("Authentication token not found");
        }
      } catch (err: any) {
        console.error("Failed to load live class session:", err);
        setError(
          err.response?.data?.detail || "Failed to load live class session",
        );
        toast.error("Failed to join live class");
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchData();
    }
  }, [classId]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-500 mb-4" />
        <p className="text-gray-400">Joining live class...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="text-center max-w-md p-6 bg-gray-900 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-red-500 mb-2">
            Unable to Join
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!liveClass || !currentUser) return null;

  return (
    <LiveClassViewer
      liveClass={liveClass}
      currentUser={currentUser}
      token={token}
    />
  );
}

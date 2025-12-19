"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("Auth check timed out after 5 seconds");
        setTimedOut(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
    if (timedOut && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router, timedOut]);

  if (loading && !timedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-white text-xl mb-2">Loading...</div>
          <div className="text-gray-400 text-sm">Please wait while we verify your session</div>
        </div>
      </div>
    );
  }

  if (timedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-white text-xl mb-2">Session Check Failed</div>
          <div className="text-gray-400 text-sm mb-4">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}


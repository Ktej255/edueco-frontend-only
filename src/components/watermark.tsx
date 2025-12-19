"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Watermark() {
  const [userInfo, setUserInfo] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me");
        setUserInfo(response.data.email);
      } catch (error) {
        // Silently fail or retry
      }
    };
    fetchUser();
  }, []);

  if (!userInfo) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden opacity-[0.03]">
      <div className="rotate-[-45deg] whitespace-nowrap text-5xl font-bold text-white select-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="mb-32">
            {Array.from({ length: 10 }).map((_, j) => (
              <span key={j} className="mr-32">
                {userInfo} • {userInfo}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

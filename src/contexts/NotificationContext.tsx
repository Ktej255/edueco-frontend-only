"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import {
  useNotificationStore,
  type Notification,
} from "@/stores/notificationStore";

interface NotificationContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType>({
  socket: null,
  isConnected: false,
});

export const useNotifications = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
  apiUrl: string;
  token: string | null;
}

export function NotificationProvider({
  children,
  apiUrl,
  token,
}: NotificationProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    // Only connect if user is authenticated
    if (!token) {
      return;
    }

    // Create Socket.IO connection
    const socketInstance = io(apiUrl, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
    });
    return () => {
      socketInstance.disconnect();
    };
  }, [token, apiUrl, addNotification]);

  return (
    <NotificationContext.Provider value={{ socket, isConnected }}>
      {children}
    </NotificationContext.Provider>
  );
}

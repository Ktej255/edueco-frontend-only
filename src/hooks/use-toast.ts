/**
 * Toast Hook
 * Simple toast notification hook
 */

import { useState, useCallback } from "react";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "default" }: ToastProps) => {
      // You can integrate with a toast library like react-hot-toast or sonner here
      // For now, we'll just console log
      console.log(`[Toast - ${variant}] ${title}: ${description}`);

      // Add to state for UI rendering if needed
      setToasts((prev) => [...prev, { title, description, variant }]);

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 3000);
    },
    [],
  );

  return { toast, toasts };
}

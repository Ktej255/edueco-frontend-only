"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  full_name: string | null;
  bio?: string;
  coins: number;
  streak_days: number;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    access_token: string;
    token_type: string;
    require_2fa?: boolean;
  } | void>;
  register: (
    email: string,
    password: string,
    fullName: string,
    role?: string,
  ) => Promise<{ pending_approval: boolean; message?: string } | void>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // Fetch current user
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // FastAPI OAuth2 expects form data
    const formData = new URLSearchParams();
    formData.append("username", email); // FastAPI uses 'username' field
    formData.append("password", password);

    const response = await api.post("/login/access-token", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, require_2fa } = response.data;

    // If 2FA is required, return the response data for handling
    if (require_2fa) {
      return response.data;
    }

    // Standard login flow
    localStorage.setItem("token", access_token);
    setToken(access_token);

    // Fetch user data
    await fetchCurrentUser();
    router.push("/student/dashboard");
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    role: string = "student",
  ) => {
    const response = await api.post("/login/register", {
      email,
      password,
      full_name: fullName,
      role,
    });

    const data = response.data;

    // If pending approval (teacher/admin), return the response without auto-login
    if (data.pending_approval) {
      return {
        pending_approval: true,
        message: data.message,
      };
    }

    // Auto-login after registration for students
    await login(email, password);
    return { pending_approval: false };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading, error };
}

export function useGameStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/gamification/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading };
}

export function useWolfPack() {
  const [pack, setPack] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPack = async () => {
      try {
        const response = await api.get("/groups/my-pack");
        setPack(response.data);
      } catch (err: any) {
        // Silently fail if endpoint doesn't exist
        if (err.response?.status !== 404) {
          console.error("Failed to fetch wolf pack:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPack();
  }, []);

  const joinPack = async () => {
    try {
      const response = await api.post("/groups/join");
      setPack(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to join pack:", err);
      throw err;
    }
  };

  return { pack, loading, joinPack };
}

export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks/");
        setTasks(response.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return { tasks, loading };
}
export function useMyCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses/my-courses");
        setCourses(response.data);
      } catch (err) {
        console.error("Failed to fetch my courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return { courses, loading };
}

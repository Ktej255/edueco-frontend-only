"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Circle, Plus, X } from "lucide-react";
import api from "@/lib/api";

interface Task {
  id: number;
  title: string;
  description: string;
  task_type: string;
  duration_minutes: number;
  is_completed: boolean;
  scheduled_date: string;
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    task_type: "study",
    duration_minutes: 30,
    scheduled_date: new Date().toISOString(),
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks/");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: number, currentStatus: boolean) => {
    try {
      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, is_completed: !currentStatus } : t,
        ),
      );
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await api.post("/tasks/", newTask);
      setTasks([...tasks, response.data]);
      setDialogOpen(false);
      setNewTask({
        title: "",
        description: "",
        task_type: "study",
        duration_minutes: 30,
        scheduled_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to create task", error);
      alert("Failed to create task. Please try again.");
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Daily Planner</h1>
          <p className="text-gray-400 mt-2">
            Your AI-optimized schedule for today
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            onClick={async () => {
              try {
                const res = await api.post("/tasks/reschedule");
                alert(res.data.msg);
                fetchTasks();
              } catch (e) {
                console.error(e);
              }
            }}
          >
            ✨ AI Auto-Schedule
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-600 hover:bg-cyan-500">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Create New Task
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Task Title
                  </label>
                  <Input
                    placeholder="e.g., Study Python"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Description
                  </label>
                  <Textarea
                    placeholder="Task details..."
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Task Type
                    </label>
                    <Select
                      value={newTask.task_type}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, task_type: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="meditation">Meditation</SelectItem>
                        <SelectItem value="exercise">Exercise</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Duration (mins)
                    </label>
                    <Input
                      type="number"
                      value={newTask.duration_minutes}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          duration_minutes: parseInt(e.target.value) || 30,
                        })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddTask}
                    disabled={!newTask.title}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500"
                  >
                    Create Task
                  </Button>
                  <Button
                    onClick={() => setDialogOpen(false)}
                    variant="outline"
                    className="border-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Schedule */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-white">Loading schedule...</div>
          ) : tasks.length === 0 ? (
            <div className="p-8 border border-dashed border-gray-800 rounded-xl text-center text-gray-500">
              No tasks scheduled for today.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                  task.is_completed
                    ? "bg-gray-900/50 border-gray-800 opacity-50"
                    : "bg-gray-900 border-gray-700 hover:border-cyan-500/50"
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id, task.is_completed)}
                  className={`flex-shrink-0 transition-colors ${
                    task.is_completed
                      ? "text-green-500"
                      : "text-gray-500 hover:text-cyan-400"
                  }`}
                >
                  {task.is_completed ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>

                <div className="flex-1">
                  <h3
                    className={`font-medium ${task.is_completed ? "text-gray-500 line-through" : "text-white"}`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {task.duration_minutes} mins • {task.task_type}
                  </p>
                </div>

                <div className="text-right text-sm text-gray-500">
                  {new Date(task.scheduled_date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Side Widgets */}
        <div className="space-y-6">
          {/* Calendar Widget Placeholder */}
          <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="font-bold text-white mb-4">Calendar</h3>
            <div className="aspect-square bg-black/50 rounded-lg flex items-center justify-center text-gray-500">
              [Calendar Component]
            </div>
          </div>

          {/* Progress Widget */}
          <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="font-bold text-white mb-2">Daily Progress</h3>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[45%]" />
            </div>
            <p className="text-right text-sm text-gray-400 mt-2">
              45% Completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

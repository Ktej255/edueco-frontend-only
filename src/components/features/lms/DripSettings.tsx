import { useState, useEffect } from "react";
import { Calendar, Clock, Lock, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/lib/api";

interface DripSettingsProps {
  lessonId: number;
  courseId: number;
  onSave?: () => void;
}

export function DripSettings({
  lessonId,
  courseId,
  onSave,
}: DripSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    unlock_type: "none",
    unlock_date: "",
    unlock_after_days: 0,
    prerequisite_lesson_id: null,
  });
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [lessonId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch existing settings
      try {
        const response = await api.get(`/lessons/${lessonId}/drip`);
        if (response.data) {
          setSettings({
            ...response.data,
            unlock_type: response.data.unlock_type || "none",
            unlock_date: response.data.unlock_date
              ? new Date(response.data.unlock_date).toISOString().slice(0, 16)
              : "",
          });
        }
      } catch (e) {
        // No settings exist yet, use defaults
      }

      // Fetch course lessons for prerequisite selection
      const courseRes = await api.get(`/courses/${courseId}`);
      const allLessons = courseRes.data.modules.flatMap((m: any) => m.lessons);
      setLessons(allLessons.filter((l: any) => l.id !== lessonId)); // Exclude current lesson
    } catch (error) {
      console.error("Failed to fetch drip data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare payload
      const payload: any = {
        unlock_type: settings.unlock_type,
        is_active: true,
      };

      if (settings.unlock_type === "date") {
        payload.unlock_date = new Date(settings.unlock_date).toISOString();
      } else if (settings.unlock_type === "after_days") {
        payload.unlock_after_days = parseInt(settings.unlock_after_days);
      } else if (settings.unlock_type === "sequence") {
        payload.prerequisite_lesson_id = parseInt(
          settings.prerequisite_lesson_id,
        );
      }

      await api.post(`/lessons/${lessonId}/drip`, payload);

      if (onSave) onSave();
      alert("Drip settings saved successfully");
    } catch (error) {
      console.error("Failed to save drip settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading settings...</div>;

  return (
    <div className="space-y-6 bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">
          Content Drip Schedule
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-300 mb-2 block">
            When should this lesson unlock?
          </Label>
          <Select
            value={settings.unlock_type}
            onValueChange={(val) =>
              setSettings({ ...settings, unlock_type: val })
            }
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select unlock condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Available Immediately</SelectItem>
              <SelectItem value="date">On a Specific Date</SelectItem>
              <SelectItem value="after_days">Days After Enrollment</SelectItem>
              <SelectItem value="sequence">
                After Completing Another Lesson
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {settings.unlock_type === "date" && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <Label className="text-gray-300">Unlock Date & Time</Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="datetime-local"
                value={settings.unlock_date}
                onChange={(e) =>
                  setSettings({ ...settings, unlock_date: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <p className="text-xs text-gray-500">
              Students will see a countdown until this date.
            </p>
          </div>
        )}

        {settings.unlock_type === "after_days" && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <Label className="text-gray-300">Days After Enrollment</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <Input
                type="number"
                min="0"
                value={settings.unlock_after_days}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    unlock_after_days: e.target.value,
                  })
                }
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="e.g. 7"
              />
            </div>
            <p className="text-xs text-gray-500">
              Lesson unlocks X days after the student enrolls in the course.
            </p>
          </div>
        )}

        {settings.unlock_type === "sequence" && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <Label className="text-gray-300">Prerequisite Lesson</Label>
            <Select
              value={settings.prerequisite_lesson_id?.toString()}
              onValueChange={(val) =>
                setSettings({ ...settings, prerequisite_lesson_id: val })
              }
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select a lesson" />
              </SelectTrigger>
              <SelectContent>
                {lessons.map((lesson) => (
                  <SelectItem key={lesson.id} value={lesson.id.toString()}>
                    {lesson.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              This lesson will stay locked until the selected lesson is
              completed.
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-800">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            {saving ? "Saving..." : "Save Schedule"}
          </Button>
        </div>
      </div>
    </div>
  );
}

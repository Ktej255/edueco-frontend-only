"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  CheckSquare,
  ArrowLeft,
} from "lucide-react";

type Lesson = {
  id: number;
  title: string;
  content_type: "video" | "text" | "quiz" | "assignment";
  video_url?: string;
  duration_minutes?: number;
  order_index: number;
  is_preview: boolean;
};

type Module = {
  id: number;
  title: string;
  description?: string;
  order_index: number;
  lessons: Lesson[];
  isExpanded: boolean;
};

type Course = {
  id: number;
  title: string;
  modules: Module[];
};

function SortableModule({
  module,
  onEdit,
  onDelete,
  onToggle,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}: {
  module: Module;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  onAddLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: module.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "text":
        return <FileText className="w-4 h-4" />;
      case "quiz":
        return <CheckSquare className="w-4 h-4" />;
      case "assignment":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-5 h-5 text-gray-500" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-0 h-auto"
            >
              {module.isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </Button>
            <CardTitle className="flex-1 text-lg">{module.title}</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onAddLesson}>
                <Plus className="w-4 h-4 mr-1" />
                Lesson
              </Button>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
          {module.description && (
            <p className="text-sm text-gray-400 mt-2 ml-11">
              {module.description}
            </p>
          )}
        </CardHeader>

        {module.isExpanded && (
          <CardContent>
            {module.lessons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No lessons yet. Click "Add Lesson" to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    {getLessonIcon(lesson.content_type)}
                    <div className="flex-1">
                      <div className="font-medium">{lesson.title}</div>
                      <div className="text-sm text-gray-400">
                        {lesson.content_type}
                        {lesson.duration_minutes &&
                          ` • ${lesson.duration_minutes} min`}
                        {lesson.is_preview && " • Preview"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditLesson(lesson)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteLesson(lesson.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default function CourseContentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  // Form states
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content_type: "video" as "video" | "text" | "quiz" | "assignment",
    video_url: "",
    duration_minutes: 0,
    is_preview: false,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    fetchCourseContent();
  }, [courseId]);

  const fetchCourseContent = async () => {
    try {
      const response = await axios.get(`/api/v1/courses/${courseId}`);
      setCourse(response.data);
      const modulesData = response.data.modules || [];
      setModules(
        modulesData.map((m: any) => ({
          ...m,
          isExpanded: true,
          lessons: m.lessons || [],
        })),
      );
    } catch (error) {
      toast.error("Failed to load course content");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setModules((items) => {
        const oldIndex = items.findIndex((i) => i.id.toString() === active.id);
        const newIndex = items.findIndex((i) => i.id.toString() === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Update order on server
        updateModuleOrder(newOrder);

        return newOrder;
      });
    }
  };

  const updateModuleOrder = async (orderedModules: Module[]) => {
    try {
      await axios.patch(`/api/v1/courses/${courseId}/modules/reorder`, {
        module_ids: orderedModules.map((m) => m.id),
      });
    } catch (error) {
      toast.error("Failed to update module order");
    }
  };

  const handleAddModule = () => {
    setEditingModule(null);
    setModuleForm({ title: "", description: "" });
    setIsModuleDialogOpen(true);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title,
      description: module.description || "",
    });
    setIsModuleDialogOpen(true);
  };

  const handleSaveModule = async () => {
    try {
      if (editingModule) {
        await axios.patch(`/api/v1/modules/${editingModule.id}`, moduleForm);
        toast.success("Module updated");
      } else {
        await axios.post(`/api/v1/courses/${courseId}/modules`, {
          ...moduleForm,
          order_index: modules.length,
        });
        toast.success("Module created");
      }
      setIsModuleDialogOpen(false);
      fetchCourseContent();
    } catch (error) {
      toast.error("Failed to save module");
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm("Delete this module and all its lessons?")) return;

    try {
      await axios.delete(`/api/v1/modules/${moduleId}`);
      toast.success("Module deleted");
      fetchCourseContent();
    } catch (error) {
      toast.error("Failed to delete module");
    }
  };

  const handleAddLesson = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(null);
    setLessonForm({
      title: "",
      content_type: "video",
      video_url: "",
      duration_minutes: 0,
      is_preview: false,
    });
    setIsLessonDialogOpen(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      content_type: lesson.content_type,
      video_url: lesson.video_url || "",
      duration_minutes: lesson.duration_minutes || 0,
      is_preview: lesson.is_preview,
    });
    setIsLessonDialogOpen(true);
  };

  const handleSaveLesson = async () => {
    try {
      if (editingLesson) {
        await axios.patch(`/api/v1/lessons/${editingLesson.id}`, lessonForm);
        toast.success("Lesson updated");
      } else {
        const module = modules.find((m) => m.id === selectedModuleId);
        await axios.post(`/api/v1/modules/${selectedModuleId}/lessons`, {
          ...lessonForm,
          order_index: module?.lessons.length || 0,
        });
        toast.success("Lesson created");
      }
      setIsLessonDialogOpen(false);
      fetchCourseContent();
    } catch (error) {
      toast.error("Failed to save lesson");
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm("Delete this lesson?")) return;

    try {
      await axios.delete(`/api/v1/lessons/${lessonId}`);
      toast.success("Lesson deleted");
      fetchCourseContent();
    } catch (error) {
      toast.error("Failed to delete lesson");
    }
  };

  const toggleModule = (moduleId: number) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m,
      ),
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-400">Loading course content...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/instructor/courses")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course?.title}</h1>
            <p className="text-gray-400">Manage course content and structure</p>
          </div>
          <Button onClick={handleAddModule}>
            <Plus className="w-4 h-4 mr-2" />
            Add Module
          </Button>
        </div>
      </div>

      {/* Modules */}
      {modules.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              No modules yet. Create your first module to get started!
            </p>
            <Button onClick={handleAddModule}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Module
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={modules.map((m) => m.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {modules.map((module) => (
              <SortableModule
                key={module.id}
                module={module}
                onEdit={() => handleEditModule(module)}
                onDelete={() => handleDeleteModule(module.id)}
                onToggle={() => toggleModule(module.id)}
                onAddLesson={() => handleAddLesson(module.id)}
                onEditLesson={handleEditLesson}
                onDeleteLesson={handleDeleteLesson}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* Module Dialog */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>
              {editingModule ? "Edit Module" : "Create Module"}
            </DialogTitle>
            <DialogDescription>
              Modules help organize your course content into sections
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="module-title">Title *</Label>
              <Input
                id="module-title"
                value={moduleForm.title}
                onChange={(e) =>
                  setModuleForm({ ...moduleForm, title: e.target.value })
                }
                placeholder="e.g., Introduction to Python"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="module-description">Description</Label>
              <Textarea
                id="module-description"
                value={moduleForm.description}
                onChange={(e) =>
                  setModuleForm({ ...moduleForm, description: e.target.value })
                }
                placeholder="Brief description of this module"
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModuleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveModule}>
              {editingModule ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "Edit Lesson" : "Create Lesson"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lesson-title">Title *</Label>
              <Input
                id="lesson-title"
                value={lessonForm.title}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, title: e.target.value })
                }
                placeholder="e.g., Variables and Data Types"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="lesson-type">Content Type *</Label>
              <Select
                value={lessonForm.content_type}
                onValueChange={(value: any) =>
                  setLessonForm({ ...lessonForm, content_type: value })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="text">Text/Article</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {lessonForm.content_type === "video" && (
              <div>
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  value={lessonForm.video_url}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, video_url: e.target.value })
                  }
                  placeholder="https://..."
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            )}
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={lessonForm.duration_minutes}
                onChange={(e) =>
                  setLessonForm({
                    ...lessonForm,
                    duration_minutes: parseInt(e.target.value),
                  })
                }
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-preview"
                checked={lessonForm.is_preview}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, is_preview: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="is-preview">Allow free preview</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLessonDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveLesson}>
              {editingLesson ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

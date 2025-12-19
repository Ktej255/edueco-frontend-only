"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  BookOpen,
  PlayCircle,
  FileText,
  Award,
  CheckCircle,
  Save,
  Eye,
  ArrowLeft,
  Sparkles,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DripSettings } from "@/components/features/lms/DripSettings";
import api from "@/lib/api";

interface Lesson {
  id: number;
  title: string;
  description: string;
  type: string;
  duration_minutes: number;
  order_index: number;
  is_preview: boolean;
}

interface Module {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  order_index: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  is_published: boolean;
  modules: Module[];
}

const LessonTypeIcon = ({ type }: { type: string }) => {
  const icons = {
    video: <PlayCircle className="h-4 w-4" />,
    text: <FileText className="h-4 w-4" />,
    quiz: <Award className="h-4 w-4" />,
    assignment: <CheckCircle className="h-4 w-4" />,
  };
  return icons[type as keyof typeof icons] || <BookOpen className="h-4 w-4" />;
};

// Draggable Module Component
function SortableModule({
  module,
  moduleIndex,
  onEdit,
  onDelete,
  onAddLesson,
  children,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `module-${module.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-gray-800 rounded-lg overflow-hidden"
    >
      {/* Module Header */}
      <div className="bg-gray-800/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5 text-gray-500 hover:text-cyan-400 transition" />
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-bold">
              {moduleIndex + 1}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{module.title}</h3>
              <p className="text-sm text-gray-400">
                {module.lessons.length} lessons
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(module)}
              className="text-gray-400 hover:text-white"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(module.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => onAddLesson(module.id)}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              <Plus className="mr-1 h-3 w-3" />
              Lesson
            </Button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

// Draggable Lesson Component
function SortableLesson({ lesson, onEdit, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `lesson-${lesson.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 hover:bg-gray-800/30 transition"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-gray-600 hover:text-cyan-400 transition" />
          </div>
          <div className="text-gray-500">
            <LessonTypeIcon type={lesson.type} />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">{lesson.title}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="capitalize">{lesson.type}</span>
              <span>•</span>
              <span>{lesson.duration_minutes} min</span>
              {lesson.is_preview && (
                <>
                  <span>•</span>
                  <Badge className="bg-green-500/10 text-green-400 border-0 text-xs">
                    Preview
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(lesson)}
            className="text-gray-400 hover:text-white"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(lesson.id)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Module Dialog
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });

  // Lesson Dialog
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState<number | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    type: "text",
    duration_minutes: 10,
    is_preview: false,
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  };

  // Drag and Drop Handlers
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !course) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Handle module reordering
    if (activeId.startsWith("module-") && overId.startsWith("module-")) {
      const activeIndex = course.modules.findIndex(
        (m) => `module-${m.id}` === activeId,
      );
      const overIndex = course.modules.findIndex(
        (m) => `module-${m.id}` === overId,
      );

      const newModules = arrayMove(course.modules, activeIndex, overIndex).map(
        (mod, idx) => ({
          ...mod,
          order_index: idx,
        }),
      );

      setCourse({ ...course, modules: newModules });

      // Save to backend
      try {
        await api.post(`/courses/${courseId}/reorder-modules`, {
          module_ids: newModules.map((m) => m.id),
        });
      } catch (error) {
        console.error("Failed to reorder modules:", error);
        fetchCourse(); // Revert on error
      }
    }

    // Handle lesson reordering within a module
    if (activeId.startsWith("lesson-") && overId.startsWith("lesson-")) {
      const activeLessonId = parseInt(activeId.replace("lesson-", ""));
      const overLessonId = parseInt(overId.replace("lesson-", ""));

      // Find which module contains these lessons
      const moduleIndex = course.modules.findIndex((m) =>
        m.lessons.some((l) => l.id === activeLessonId || l.id === overLessonId),
      );

      if (moduleIndex === -1) return;

      const module = course.modules[moduleIndex];
      const activeIndex = module.lessons.findIndex(
        (l) => l.id === activeLessonId,
      );
      const overIndex = module.lessons.findIndex((l) => l.id === overLessonId);

      const newLessons = arrayMove(module.lessons, activeIndex, overIndex).map(
        (lesson, idx) => ({
          ...lesson,
          order_index: idx,
        }),
      );

      const newModules = [...course.modules];
      newModules[moduleIndex] = { ...module, lessons: newLessons };

      setCourse({ ...course, modules: newModules });

      // Save to backend
      try {
        await api.post(`/modules/${module.id}/reorder-lessons`, {
          lesson_ids: newLessons.map((l) => l.id),
        });
      } catch (error) {
        console.error("Failed to reorder lessons:", error);
        fetchCourse(); // Revert on error
      }
    }
  };

  // Module Functions
  const openModuleDialog = (module?: Module) => {
    if (module) {
      setEditingModule(module);
      setModuleForm({ title: module.title, description: module.description });
    } else {
      setEditingModule(null);
      setModuleForm({ title: "", description: "" });
    }
    setModuleDialogOpen(true);
  };

  const handleSaveModule = async () => {
    try {
      if (editingModule) {
        await api.put(`/modules/${editingModule.id}`, moduleForm);
      } else {
        await api.post(`/courses/${courseId}/modules`, {
          ...moduleForm,
          order_index: course?.modules.length || 0,
        });
      }
      setModuleDialogOpen(false);
      fetchCourse();
    } catch (error) {
      console.error("Failed to save module:", error);
      alert("Failed to save module");
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this module? All lessons will be deleted.",
      )
    )
      return;

    try {
      await api.delete(`/modules/${moduleId}`);
      fetchCourse();
    } catch (error) {
      console.error("Failed to delete module:", error);
      alert("Failed to delete module");
    }
  };

  // Lesson Functions
  const openLessonDialog = (moduleId: number, lesson?: Lesson) => {
    setCurrentModuleId(moduleId);
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        title: lesson.title,
        description: lesson.description,
        type: lesson.type,
        duration_minutes: lesson.duration_minutes,
        is_preview: lesson.is_preview,
      });
    } else {
      setEditingLesson(null);
      setLessonForm({
        title: "",
        description: "",
        type: "text",
        duration_minutes: 10,
        is_preview: false,
      });
    }
    setLessonDialogOpen(true);
  };

  const handleSaveLesson = async () => {
    try {
      if (editingLesson) {
        await api.put(`/lessons/${editingLesson.id}`, lessonForm);
      } else {
        const module = course?.modules.find((m) => m.id === currentModuleId);
        await api.post(`/modules/${currentModuleId}/lessons`, {
          ...lessonForm,
          order_index: module?.lessons.length || 0,
          content: lessonForm.type === "text" ? { markdown: "" } : {},
        });
      }
      setLessonDialogOpen(false);
      fetchCourse();
    } catch (error) {
      console.error("Failed to save lesson:", error);
      alert("Failed to save lesson");
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await api.delete(`/lessons/${lessonId}`);
      fetchCourse();
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      alert("Failed to delete lesson");
    }
  };

  const handleTogglePublish = async () => {
    try {
      await api.put(`/courses/${courseId}`, {
        is_published: !course?.is_published,
      });
      fetchCourse();
    } catch (error) {
      console.error("Failed to toggle publish:", error);
      alert("Failed to update course status");
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get(`/courses/${courseId}/export`);
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(response.data, null, 2));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute(
        "download",
        `course-${course?.title.toLowerCase().replace(/\s+/g, "-")}.json`,
      );
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error("Failed to export course:", error);
      alert("Failed to export course");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Course not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/lms/courses")}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {course.title}
              </h1>
              <p className="text-gray-400">{course.description}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                className="border-gray-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/lms/courses/${courseId}`)}
                className="border-gray-700"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={handleTogglePublish}
                className={
                  course.is_published
                    ? "bg-yellow-600 hover:bg-yellow-500"
                    : "bg-green-600 hover:bg-green-500"
                }
              >
                {course.is_published ? "Unpublish" : "Publish Course"}
              </Button>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <Badge
            className={`${course.is_published ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"} border`}
          >
            {course.is_published ? "Published" : "Draft"}
          </Badge>
        </div>

        {/* Course Structure with Drag and Drop */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Course Content</h2>
              <p className="text-sm text-gray-400 mt-1">
                Drag modules and lessons to reorder them
              </p>
            </div>
            <Button
              onClick={() => openModuleDialog()}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          </div>

          {course.modules.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-lg">
              <Sparkles className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                No modules yet. Add your first module to get started.
              </p>
              <Button
                onClick={() => openModuleDialog()}
                className="bg-cyan-600 hover:bg-cyan-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Module
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={course.modules.map((m) => `module-${m.id}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <SortableModule
                      key={module.id}
                      module={module}
                      moduleIndex={moduleIndex}
                      onEdit={openModuleDialog}
                      onDelete={handleDeleteModule}
                      onAddLesson={openLessonDialog}
                    >
                      {/* Lessons with Drag and Drop */}
                      {module.lessons.length > 0 && (
                        <SortableContext
                          items={module.lessons.map((l) => `lesson-${l.id}`)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="divide-y divide-gray-800">
                            {module.lessons.map((lesson) => (
                              <SortableLesson
                                key={lesson.id}
                                lesson={lesson}
                                onEdit={() =>
                                  openLessonDialog(module.id, lesson)
                                }
                                onDelete={handleDeleteLesson}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      )}
                    </SortableModule>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Module Dialog */}
      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingModule ? "Edit Module" : "Add New Module"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="module-title" className="text-white">
                Title
              </Label>
              <Input
                id="module-title"
                value={moduleForm.title}
                onChange={(e) =>
                  setModuleForm({ ...moduleForm, title: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white mt-2"
                placeholder="e.g., Getting Started with Python"
              />
            </div>
            <div>
              <Label htmlFor="module-description" className="text-white">
                Description
              </Label>
              <Textarea
                id="module-description"
                value={moduleForm.description}
                onChange={(e) =>
                  setModuleForm({ ...moduleForm, description: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white mt-2"
                rows={3}
                placeholder="Brief description of this module"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModuleDialogOpen(false)}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveModule}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingLesson ? "Edit Lesson" : "Add New Lesson"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="drip" disabled={!editingLesson}>
                  Drip Schedule
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="lesson-title" className="text-white">
                    Title
                  </Label>
                  <Input
                    id="lesson-title"
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, title: e.target.value })
                    }
                    className="bg-gray-800 border-gray-700 text-white mt-2"
                    placeholder="e.g., Introduction to Variables"
                  />
                </div>
                <div>
                  <Label htmlFor="lesson-description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="lesson-description"
                    value={lessonForm.description}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        description: e.target.value,
                      })
                    }
                    className="bg-gray-800 border-gray-700 text-white mt-2"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lesson-type" className="text-white">
                      Type
                    </Label>
                    <Select
                      value={lessonForm.type}
                      onValueChange={(value) =>
                        setLessonForm({ ...lessonForm, type: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="lesson-duration" className="text-white">
                      Duration (minutes)
                    </Label>
                    <Input
                      id="lesson-duration"
                      type="number"
                      min="1"
                      value={lessonForm.duration_minutes}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          duration_minutes: parseInt(e.target.value),
                        })
                      }
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lesson-preview"
                    checked={lessonForm.is_preview}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        is_preview: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <Label
                    htmlFor="lesson-preview"
                    className="text-white cursor-pointer"
                  >
                    Free preview lesson
                  </Label>
                </div>
              </TabsContent>

              <TabsContent value="drip" className="mt-4">
                {editingLesson ? (
                  <DripSettings
                    lessonId={editingLesson.id}
                    courseId={parseInt(courseId)}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Please save the lesson first to configure drip settings.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLessonDialogOpen(false)}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLesson}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

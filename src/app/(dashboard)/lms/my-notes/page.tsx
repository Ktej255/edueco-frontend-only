"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Bookmark, Search, BookOpen, Video } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Note {
  id: number;
  title?: string;
  content: string;
  lesson_title: string;
  course_title: string;
  timestamp?: number;
  color: string;
  created_at: string;
}

interface LessonBookmark {
  id: number;
  lesson_title: string;
  course_title: string;
  module_title: string;
  lesson_id: number;
  course_id: number;
  created_at: string;
}

interface CourseBookmark {
  id: number;
  course_title: string;
  instructor_name: string;
  course_id: number;
  created_at: string;
}

export default function MyNotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [lessonBookmarks, setLessonBookmarks] = useState<LessonBookmark[]>([]);
  const [courseBookmarks, setCourseBookmarks] = useState<CourseBookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/notes/my-notes-and-bookmarks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotes(response.data.notes || []);
      setLessonBookmarks(response.data.lesson_bookmarks || []);
      setCourseBookmarks(response.data.course_bookmarks || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.title &&
        note.title.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      yellow: "bg-yellow-100 border-yellow-300",
      blue: "bg-blue-100 border-blue-300",
      green: "bg-green-100 border-green-300",
      red: "bg-red-100 border-red-300",
      purple: "bg-purple-100 border-purple-300",
    };
    return colors[color] || colors.yellow;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Notes & Bookmarks</h1>
        <p className="text-muted-foreground">
          Access all your notes and bookmarked content in one place
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">
            <StickyNote className="w-4 h-4 mr-2" />
            Notes ({notes.length})
          </TabsTrigger>
          <TabsTrigger value="lessons">
            <Video className="w-4 h-4 mr-2" />
            Lesson Bookmarks ({lessonBookmarks.length})
          </TabsTrigger>
          <TabsTrigger value="courses">
            <BookOpen className="w-4 h-4 mr-2" />
            Course Bookmarks ({courseBookmarks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                Loading notes...
              </CardContent>
            </Card>
          ) : filteredNotes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <StickyNote className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No notes found. Start taking notes in your lessons!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className={`border-2 ${getColorClass(note.color)}`}
                >
                  <CardHeader>
                    {note.title && (
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{note.course_title}</span>
                      <span>•</span>
                      <span>{note.lesson_title}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap line-clamp-4 mb-2">
                      {note.content}
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                      {note.timestamp && (
                        <Badge variant="outline">
                          {Math.floor(note.timestamp / 60)}:
                          {(note.timestamp % 60).toString().padStart(2, "0")}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          {lessonBookmarks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No lesson bookmarks yet. Bookmark lessons to find them easily!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {lessonBookmarks.map((bookmark) => (
                <Card
                  key={bookmark.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    router.push(`/lms/courses/${bookmark.course_id}`)
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">
                          {bookmark.lesson_title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {bookmark.course_title} • {bookmark.module_title}
                        </p>
                      </div>
                      <Bookmark className="w-5 h-5 text-primary fill-current" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Bookmarked{" "}
                      {new Date(bookmark.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          {courseBookmarks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No course bookmarks yet. Bookmark courses for quick access!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courseBookmarks.map((bookmark) => (
                <Card
                  key={bookmark.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    router.push(`/lms/courses/${bookmark.course_id}`)
                  }
                >
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="flex-1">{bookmark.course_title}</span>
                      <Bookmark className="w-5 h-5 text-primary fill-current flex-shrink-0 ml-2" />
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      by {bookmark.instructor_name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Bookmarked{" "}
                      {new Date(bookmark.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

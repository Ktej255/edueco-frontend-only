"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  BookmarkPlus,
  FileText,
  Bookmark,
  Search,
  Trash2,
  Edit,
  Clock,
  Tag,
} from "lucide-react";

type Note = {
  id: number;
  lesson_id: number;
  lesson_title: string;
  course_title: string;
  content: string;
  timestamp_seconds?: number;
  created_at: string;
  updated_at: string;
  tags?: string[];
};

type BookmarkType = {
  id: number;
  lesson_id?: number;
  course_id?: number;
  lesson_title?: string;
  course_title: string;
  created_at: string;
  notes?: string;
};

export default function NotesBookmarksPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState({
    content: "",
    tags: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, searchQuery, sortBy]);

  const fetchData = async () => {
    try {
      const [notesRes, bookmarksRes] = await Promise.all([
        axios.get("/api/v1/notes/my-notes"),
        axios.get("/api/v1/bookmarks/my-bookmarks"),
      ]);
      setNotes(notesRes.data);
      setBookmarks(bookmarksRes.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortNotes = () => {
    let filtered = [...notes];

    // Filter by search
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (note) =>
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.lesson_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.course_title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
      );
    } else if (sortBy === "course") {
      filtered.sort((a, b) => a.course_title.localeCompare(b.course_title));
    }

    setFilteredNotes(filtered);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      content: note.content,
      tags: note.tags?.join(", ") || "",
    });
    setIsNoteDialogOpen(true);
  };

  const handleSaveNote = async () => {
    if (!editingNote || !noteForm.content.trim()) {
      toast.error("Note content is required");
      return;
    }

    try {
      await axios.patch(`/api/v1/notes/${editingNote.id}`, {
        content: noteForm.content,
        tags: noteForm.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      toast.success("Note updated");
      setIsNoteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!confirm("Delete this note?")) return;

    try {
      await axios.delete(`/api/v1/notes/${id}`);
      toast.success("Note deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleDeleteBookmark = async (id: number) => {
    if (!confirm("Remove this bookmark?")) return;

    try {
      await axios.delete(`/api/v1/bookmarks/${id}`);
      toast.success("Bookmark removed");
      fetchData();
    } catch (error) {
      toast.error("Failed to remove bookmark");
    }
  };

  const formatTimestamp = (seconds?: number) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Notes & Bookmarks</h1>
        <p className="text-gray-400">Organize your learning materials</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Notes</p>
                <p className="text-2xl font-bold">{notes.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Bookmarks</p>
                <p className="text-2xl font-bold">{bookmarks.length}</p>
              </div>
              <Bookmark className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Recent Activity</p>
                <p className="text-2xl font-bold">
                  {
                    notes.filter((n) => {
                      const dayAgo = new Date();
                      dayAgo.setDate(dayAgo.getDate() - 1);
                      return new Date(n.updated_at) > dayAgo;
                    }).length
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="bookmarks">
            Bookmarks ({bookmarks.length})
          </TabsTrigger>
        </TabsList>

        {/* Notes Tab */}
        <TabsContent value="notes">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-800"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-gray-900 border-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="course">By Course</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes List */}
          {filteredNotes.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-16 h-16 text-gray-700 mb-4" />
                <p className="text-gray-400 text-lg mb-2">
                  {searchQuery ? "No notes match your search" : "No notes yet"}
                </p>
                <p className="text-gray-500 text-sm">
                  Take notes while watching lessons to remember key points
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base font-medium mb-1">
                          {note.lesson_title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{note.course_title}</span>
                          {note.timestamp_seconds && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimestamp(note.timestamp_seconds)}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span>
                            {new Date(note.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNote(note)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 whitespace-pre-wrap mb-2">
                      {note.content}
                    </p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="w-3 h-3 text-gray-500" />
                        {note.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-800 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Bookmarks Tab */}
        <TabsContent value="bookmarks">
          {bookmarks.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bookmark className="w-16 h-16 text-gray-700 mb-4" />
                <p className="text-gray-400 text-lg mb-2">No bookmarks yet</p>
                <p className="text-gray-500 text-sm">
                  Bookmark lessons and courses for quick access
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map((bookmark) => (
                <Card
                  key={bookmark.id}
                  className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base font-medium mb-1">
                          {bookmark.lesson_title || bookmark.course_title}
                        </CardTitle>
                        <p className="text-sm text-gray-400">
                          {bookmark.lesson_title && bookmark.course_title}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  {bookmark.notes && (
                    <CardContent>
                      <p className="text-sm text-gray-300">{bookmark.notes}</p>
                    </CardContent>
                  )}
                  <CardContent>
                    <p className="text-xs text-gray-500">
                      Saved {new Date(bookmark.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Update your note content and tags
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Textarea
                value={noteForm.content}
                onChange={(e) =>
                  setNoteForm({ ...noteForm, content: e.target.value })
                }
                placeholder="Your note..."
                rows={8}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Input
                value={noteForm.tags}
                onChange={(e) =>
                  setNoteForm({ ...noteForm, tags: e.target.value })
                }
                placeholder="Tags (comma separated)"
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNoteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

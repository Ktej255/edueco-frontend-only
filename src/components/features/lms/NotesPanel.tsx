"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StickyNote, Plus, Trash2, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Note {
  id: number;
  title?: string;
  content: string;
  timestamp?: number;
  color: string;
  lesson_title: string;
  created_at: string;
}

export default function NotesPanel({ lessonId }: { lessonId: number }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    color: "yellow",
    timestamp: undefined as number | undefined,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    color: "yellow",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [lessonId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/notes/lessons/${lessonId}/notes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newNote.content.trim()) {
      toast.error("Note content is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/v1/notes/notes`,
        {
          lesson_id: lessonId,
          ...newNote,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNewNote({
        title: "",
        content: "",
        color: "yellow",
        timestamp: undefined,
      });
      toast.success("Note created!");
      fetchNotes();
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  const handleUpdate = async (noteId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/api/v1/notes/notes/${noteId}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      toast.success("Note updated!");
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  const handleDelete = async (noteId: number) => {
    if (!confirm("Delete this note?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/v1/notes/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Note deleted!");
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            My Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* New Note Form */}
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Label>New Note</Label>
              <Select
                value={newNote.color}
                onValueChange={(value) =>
                  setNewNote({ ...newNote, color: value })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Title (optional)"
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
            />
            <Textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              rows={3}
            />
            <Button onClick={handleCreate} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Note
            </Button>
          </div>

          {/* Notes List */}
          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading notes...
            </p>
          ) : notes.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No notes yet. Create one to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <Card
                  key={note.id}
                  className={`border-2 ${getColorClass(note.color)}`}
                >
                  <CardContent className="p-4">
                    {editingId === note.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editData.title}
                          onChange={(e) =>
                            setEditData({ ...editData, title: e.target.value })
                          }
                          placeholder="Title"
                        />
                        <Textarea
                          value={editData.content}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              content: e.target.value,
                            })
                          }
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(note.id)}
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {note.title && (
                          <h4 className="font-semibold mb-1">{note.title}</h4>
                        )}
                        <p className="text-sm whitespace-pre-wrap mb-2">
                          {note.content}
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingId(note.id);
                                setEditData({
                                  title: note.title || "",
                                  content: note.content,
                                  color: note.color,
                                });
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(note.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

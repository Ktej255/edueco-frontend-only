"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Pin,
  Lock,
  CheckCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Category {
  id: number;
  name: string;
  description: string;
  thread_count: number;
}

interface Thread {
  id: number;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  last_activity_at: string;
  reply_count: number;
  view_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  is_resolved: boolean;
  last_post_author?: string;
}

export default function DiscussionsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("recent");

  useEffect(() => {
    fetchCategories();
  }, [courseId]);

  useEffect(() => {
    // Only fetch on category/filter change, search is handled by debounced effect
    if (!searchQuery) {
      fetchThreads();
    }
  }, [courseId, selectedCategory, filterBy]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/discussions/courses/${courseId}/categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchThreads = async (searchTerm?: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params: any = { sort_by: filterBy };
      if (selectedCategory) params.category_id = selectedCategory;

      // Use search endpoint if search query exists, otherwise use regular list
      const endpoint = searchTerm
        ? `${API_URL}/api/v1/discussions/courses/${courseId}/threads/search`
        : `${API_URL}/api/v1/discussions/courses/${courseId}/threads`;

      if (searchTerm) {
        params.query = searchTerm;
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setThreads(response.data);
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search handler
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchThreads(searchQuery);
      } else {
        fetchThreads();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Course Discussions</h1>
          <p className="text-muted-foreground">
            Ask questions and share knowledge with your peers
          </p>
        </div>
        <Button
          onClick={() =>
            router.push(`/lms/courses/${courseId}/discussions/new`)
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          New Thread
        </Button>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All ({threads.length})
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name} ({cat.thread_count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Tabs value={filterBy} onValueChange={setFilterBy} className="flex-1">
          <TabsList>
            <TabsTrigger value="recent">
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="popular">
              <TrendingUp className="w-4 h-4 mr-2" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="unanswered">
              <MessageSquare className="w-4 h-4 mr-2" />
              Unanswered
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Threads List */}
      <div className="space-y-3">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              Loading discussions...
            </CardContent>
          </Card>
        ) : threads.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No discussions yet. Be the first to start one!
              </p>
            </CardContent>
          </Card>
        ) : (
          threads.map((thread) => (
            <Card
              key={thread.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                router.push(`/lms/courses/${courseId}/discussions/${thread.id}`)
              }
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {thread.is_pinned && (
                        <Pin className="w-4 h-4 text-blue-500" />
                      )}
                      {thread.is_locked && (
                        <Lock className="w-4 h-4 text-gray-500" />
                      )}
                      {thread.is_resolved && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <h3 className="text-lg font-semibold">{thread.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {thread.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {thread.author_name}</span>
                      <span>•</span>
                      <span>
                        {new Date(thread.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{thread.reply_count} replies</span>
                      <span>•</span>
                      <span>{thread.view_count} views</span>
                      {thread.last_post_author && (
                        <>
                          <span>•</span>
                          <span>Last by {thread.last_post_author}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

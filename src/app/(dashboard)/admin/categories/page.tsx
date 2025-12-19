"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Folder,
  Tag as TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/Toast";
import api from "@/lib/api";

// Types
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

// Schema
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const tagSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
});

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"categories" | "tags">(
    "categories",
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { showToast } = useToast();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(
      activeTab === "categories" ? categorySchema : tagSchema,
    ),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      icon: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catsRes, tagsRes] = await Promise.all([
        api.get("/categories/"),
        api.get("/categories/tags"),
      ]);
      setCategories(catsRes.data);
      setTags(tagsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showToast("Failed to load categories and tags", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      if (activeTab === "categories") {
        await api.post("/categories/", values);
        showToast("Category created successfully", "success");
      } else {
        await api.post("/categories/tags", {
          name: values.name,
          slug: values.slug,
        });
        showToast("Tag created successfully", "success");
      }
      setIsCreateOpen(false);
      form.reset();
      fetchData();
    } catch (error) {
      console.error("Failed to create:", error);
      showToast("Failed to create item. It might already exist.", "error");
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    form.setValue("slug", slug);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Taxonomy Management
          </h1>
          <p className="text-gray-400">Manage course categories and tags</p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create {activeTab === "categories" ? "Category" : "Tag"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-800">
        <button
          className={`pb-4 px-4 font-medium transition-colors ${activeTab === "categories"
            ? "text-cyan-400 border-b-2 border-cyan-400"
            : "text-gray-400 hover:text-white"
            }`}
          onClick={() => setActiveTab("categories")}
        >
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Categories
          </div>
        </button>
        <button
          className={`pb-4 px-4 font-medium transition-colors ${activeTab === "tags"
            ? "text-cyan-400 border-b-2 border-cyan-400"
            : "text-gray-400 hover:text-white"
            }`}
          onClick={() => setActiveTab("tags")}
        >
          <div className="flex items-center gap-2">
            <TagIcon className="h-4 w-4" />
            Tags
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-800/50">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Slug</TableHead>
              {activeTab === "categories" && (
                <TableHead className="text-gray-400">Description</TableHead>
              )}
              <TableHead className="text-right text-gray-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : (activeTab === "categories" ? categories : tags).length ===
              0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              (activeTab === "categories" ? categories : tags).map(
                (item: any) => (
                  <TableRow
                    key={item.id}
                    className="border-gray-800 hover:bg-gray-800/50"
                  >
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-3">
                        {activeTab === "categories" && (
                          <div className="h-8 w-8 rounded bg-gray-800 flex items-center justify-center text-gray-400">
                            <Folder className="h-4 w-4" />
                          </div>
                        )}
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400 font-mono text-sm">
                      {item.slug}
                    </TableCell>
                    {activeTab === "categories" && (
                      <TableCell className="text-gray-400 max-w-md truncate">
                        {item.description || "-"}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-gray-900 border-gray-800"
                        >
                          <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800 cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-red-900/20 cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>
              Create {activeTab === "categories" ? "Category" : "Tag"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a new {activeTab === "categories" ? "category" : "tag"} to
              organize courses.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={handleNameChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="e.g. Web Development"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="e.g. web-development"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {activeTab === "categories" && (
                <>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="Brief description..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon (Lucide Name)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="e.g. Code"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-500">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

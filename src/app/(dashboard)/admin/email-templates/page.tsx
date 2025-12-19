"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, Plus, Edit, Trash2, Eye, Code, FileText } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  subject: z.string().min(1, "Subject is required"),
  html_content: z.string().min(1, "HTML content is required"),
  text_content: z.string().optional(),
  description: z.string().optional(),
});

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  html_content: string;
  text_content: string | null;
  description: string | null;
  is_system: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      subject: "",
      html_content: "",
      text_content: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${API_URL}/api/v1/email-notifications/templates`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTemplates(response.data);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      toast.error(
        error.response?.data?.detail || "Failed to load email templates",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (data: z.infer<typeof templateSchema>) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${API_URL}/api/v1/email-notifications/templates`,
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Email template created successfully!");
      setIsCreateDialogOpen(false);
      form.reset();
      fetchTemplates();
    } catch (error: any) {
      console.error("Error creating template:", error);
      toast.error(error.response?.data?.detail || "Failed to create template");
    }
  };

  const handleEditTemplate = async (data: z.infer<typeof templateSchema>) => {
    if (!selectedTemplate) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `${API_URL}/api/v1/email-notifications/templates/${selectedTemplate.id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Email template updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedTemplate(null);
      form.reset();
      fetchTemplates();
    } catch (error: any) {
      console.error("Error updating template:", error);
      toast.error(error.response?.data?.detail || "Failed to update template");
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `${API_URL}/api/v1/email-notifications/templates/${templateId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Email template deleted successfully!");
      fetchTemplates();
    } catch (error: any) {
      console.error("Error deleting template:", error);
      toast.error(error.response?.data?.detail || "Failed to delete template");
    }
  };

  const openEditDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    form.reset({
      name: template.name,
      subject: template.subject,
      html_content: template.html_content,
      text_content: template.text_content || "",
      description: template.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsViewDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        Loading email templates...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-gray-400 mt-2">
            Manage system and custom email templates
          </p>
        </div>
        <Button
          onClick={() => {
            form.reset();
            setIsCreateDialogOpen(true);
          }}
          className="bg-cyan-600 hover:bg-cyan-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                    {template.is_system && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-600/20 text-blue-400"
                      >
                        System
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-2">
                    {template.description || "No description"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewDialog(template)}
                    className="border-gray-700"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {!template.is_system && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(template)}
                        className="border-gray-700"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="border-red-700 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <strong>Subject:</strong> {template.subject}
                </div>
                <div className="text-xs">
                  Last updated: {new Date(template.updated_at).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {templates.length === 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="py-12 text-center">
              <Mail className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No email templates found
              </h3>
              <p className="text-gray-400">
                Create your first custom email template to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Email Template</DialogTitle>
            <DialogDescription>
              Create a custom email template. Use variables like {`{user_name}`}
              , {`{course_name}`} in your content.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateTemplate)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Welcome Email"
                        className="bg-gray-800 border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Brief description of this template"
                        className="bg-gray-800 border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Subject</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Welcome to {course_name}!"
                        className="bg-gray-800 border-gray-700"
                      />
                    </FormControl>
                    <FormDescription>
                      You can use variables like {`{user_name}`},{" "}
                      {`{course_name}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="html_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HTML Content</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="<h1>Welcome {user_name}!</h1><p>You have enrolled in {course_name}</p>"
                        className="bg-gray-800 border-gray-700 min-h-[200px] font-mono text-sm"
                      />
                    </FormControl>
                    <FormDescription>
                      HTML formatted email content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plain Text Content (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Welcome {user_name}! You have enrolled in {course_name}"
                        className="bg-gray-800 border-gray-700 min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Fallback text version for email clients that don't support
                      HTML
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-500">
                  Create Template
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Email Template</DialogTitle>
            <DialogDescription>
              Update your custom email template.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEditTemplate)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-800 border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-800 border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Subject</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-800 border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="html_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HTML Content</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-gray-800 border-gray-700 min-h-[200px] font-mono text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plain Text Content (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-gray-800 border-gray-700 min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-500">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Template Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description || "Email template details"}
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Subject</Label>
                <p className="mt-1 p-3 bg-gray-800 rounded-md text-sm">
                  {selectedTemplate.subject}
                </p>
              </div>
              <div>
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  HTML Content
                </Label>
                <pre className="mt-1 p-3 bg-gray-800 rounded-md text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
                  {selectedTemplate.html_content}
                </pre>
              </div>
              {selectedTemplate.text_content && (
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Plain Text Content
                  </Label>
                  <pre className="mt-1 p-3 bg-gray-800 rounded-md text-xs overflow-x-auto max-h-[200px] overflow-y-auto">
                    {selectedTemplate.text_content}
                  </pre>
                </div>
              )}
              <div className="text-xs text-gray-400 space-y-1">
                <p>
                  Created:{" "}
                  {new Date(selectedTemplate.created_at).toLocaleString()}
                </p>
                <p>
                  Last updated:{" "}
                  {new Date(selectedTemplate.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setIsViewDialogOpen(false)}
              className="bg-gray-800 hover:bg-gray-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

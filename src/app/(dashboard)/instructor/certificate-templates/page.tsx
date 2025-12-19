"use client";

import React, { useEffect, useState } from "react";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateCard } from "@/components/features/lms/TemplateCard";
import api from "@/lib/api";
import { toast } from "sonner";

export default function TemplatesPage() {
  const [allTemplates, setAllTemplates] = useState<any[]>([]);
  const [myTemplates, setMyTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [templatesRes, myTemplatesRes] = await Promise.all([
        api.get("/certificate-templates/"),
        api
          .get("/certificate-templates/my-templates")
          .catch(() => ({ data: [] })),
      ]);

      setAllTemplates(templatesRes.data);
      setMyTemplates(myTemplatesRes.data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-400">Loading templates...</div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Certificate Templates
            </h1>
            <p className="text-gray-400">
              Customize your course completion certificates
            </p>
          </div>
          <Button className="bg-cyan-600 hover:bg-cyan-500">
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gray-700"
            >
              All Templates ({allTemplates.length})
            </TabsTrigger>
            <TabsTrigger value="my" className="data-[state=active]:bg-gray-700">
              My Templates ({myTemplates.length})
            </TabsTrigger>
          </TabsList>

          {/* All Templates Tab */}
          <TabsContent value="all">
            {allTemplates.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No templates available
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Templates Tab */}
          <TabsContent value="my">
            {myTemplates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">
                  You haven't created any templates yet
                </p>
                <Button className="bg-cyan-600 hover:bg-cyan-500">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Template
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {myTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

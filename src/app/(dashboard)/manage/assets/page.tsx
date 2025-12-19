"use client";

import { useEffect, useState } from "react";
import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import { FileText, Image as ImageIcon, Video } from "lucide-react";
import api from "@/lib/api";

export default function AssetLibraryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/assets/");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch assets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      key: "filename",
      label: "File Name",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-2">
          {row.file_type === "image" ? <ImageIcon className="h-4 w-4 text-blue-400" /> :
            row.file_type === "video" ? <Video className="h-4 w-4 text-purple-400" /> :
              <FileText className="h-4 w-4 text-gray-400" />}
          <span className="font-medium text-white">{value}</span>
        </div>
      )
    },
    { key: "file_type", label: "Type", render: (val: string) => <Badge variant="outline">{val}</Badge> },
    {
      key: "size",
      label: "Size",
      render: (value: number) => {
        const mb = value / (1024 * 1024);
        return <span className="text-gray-400">{mb.toFixed(2)} MB</span>;
      }
    },
    {
      key: "created_at",
      label: "Uploaded",
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <StandardListPage
      title="Asset Library"
      description="Manage your uploaded images, videos, and documents."
      columns={columns}
      data={data}
      actionLabel="Upload File"
      onAdd={() => console.log("Upload")}
      onDelete={(row) => console.log("Delete", row)}
    />
  );
}

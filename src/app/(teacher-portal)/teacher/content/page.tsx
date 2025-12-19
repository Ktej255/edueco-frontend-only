"use client";

import { useState } from "react";
import {
    FolderOpen,
    Video,
    FileText,
    Image as ImageIcon,
    Upload,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
    Download,
    Clock,
    HardDrive,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample content data
const contentItems = [
    {
        id: 1,
        name: "Indian Polity - Cycle 1 Day 1 Part 1",
        type: "video",
        size: "245 MB",
        duration: "25:32",
        uploadedAt: "2 hours ago",
        cycle: "Cycle 1",
        subject: "Indian Polity",
    },
    {
        id: 2,
        name: "Constitutional Development Notes",
        type: "pdf",
        size: "2.5 MB",
        pages: 12,
        uploadedAt: "5 hours ago",
        cycle: "Cycle 1",
        subject: "Indian Polity",
    },
    {
        id: 3,
        name: "Modern History - Timeline Infographic",
        type: "image",
        size: "1.2 MB",
        dimensions: "1920x1080",
        uploadedAt: "1 day ago",
        cycle: "Cycle 2",
        subject: "Modern History",
    },
    {
        id: 4,
        name: "Environment & Ecology - Segment 2",
        type: "video",
        size: "312 MB",
        duration: "28:15",
        uploadedAt: "2 days ago",
        cycle: "Cycle 5",
        subject: "Environment",
    },
    {
        id: 5,
        name: "Geography Maps Collection",
        type: "pdf",
        size: "8.7 MB",
        pages: 45,
        uploadedAt: "3 days ago",
        cycle: "Cycle 3",
        subject: "Geography",
    },
    {
        id: 6,
        name: "Science & Tech - Space Missions",
        type: "video",
        size: "198 MB",
        duration: "22:40",
        uploadedAt: "4 days ago",
        cycle: "Cycle 6",
        subject: "Science & Tech",
    },
];

// Stats data
const contentStats = [
    { label: "Total Videos", value: "48", icon: Video, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "Documents", value: "23", icon: FileText, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "Images", value: "15", icon: ImageIcon, color: "text-purple-600", bgColor: "bg-purple-100" },
    { label: "Storage Used", value: "12.5 GB", icon: HardDrive, color: "text-amber-600", bgColor: "bg-amber-100" },
];

const getTypeIcon = (type: string) => {
    switch (type) {
        case "video":
            return <Video className="h-5 w-5 text-blue-600" />;
        case "pdf":
            return <FileText className="h-5 w-5 text-red-600" />;
        case "image":
            return <ImageIcon className="h-5 w-5 text-purple-600" />;
        default:
            return <FileText className="h-5 w-5 text-gray-600" />;
    }
};

const getTypeBadge = (type: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
        video: { bg: "bg-blue-100", text: "text-blue-700" },
        pdf: { bg: "bg-red-100", text: "text-red-700" },
        image: { bg: "bg-purple-100", text: "text-purple-700" },
    };
    return badges[type] || { bg: "bg-gray-100", text: "text-gray-700" };
};

export default function ContentLibraryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");

    const filteredContent = contentItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || item.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <FolderOpen className="h-8 w-8 text-emerald-600" />
                        Content Library
                    </h1>
                    <p className="text-gray-600 mt-1">Manage all your uploaded content in one place</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {contentStats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search content..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={filterType === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterType("all")}
                            >
                                All
                            </Button>
                            <Button
                                variant={filterType === "video" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterType("video")}
                            >
                                <Video className="mr-1 h-4 w-4" />
                                Videos
                            </Button>
                            <Button
                                variant={filterType === "pdf" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterType("pdf")}
                            >
                                <FileText className="mr-1 h-4 w-4" />
                                Documents
                            </Button>
                            <Button
                                variant={filterType === "image" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterType("image")}
                            >
                                <ImageIcon className="mr-1 h-4 w-4" />
                                Images
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContent.map((item) => {
                    const typeBadge = getTypeBadge(item.type);
                    return (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-3 rounded-lg ${typeBadge.bg}`}>
                                            {getTypeIcon(item.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 truncate" title={item.name}>
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-0.5 rounded ${typeBadge.bg} ${typeBadge.text}`}>
                                                    {item.type.toUpperCase()}
                                                </span>
                                                <span className="text-xs text-gray-500">{item.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Preview
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="mt-4 pt-3 border-t flex items-center justify-between text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {item.uploadedAt}
                                    </span>
                                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                        {item.cycle}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredContent.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No content found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

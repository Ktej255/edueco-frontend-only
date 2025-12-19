"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Video, Upload, X, Save, Brain, Clock, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { adminMeditationService, ProcessCreateRequest, ProcessUpdateRequest } from "@/services/adminMeditationService";
import { MeditationProcessInfo } from "@/services/meditationService";

export default function AdminMeditationPage() {
    const [processes, setProcesses] = useState<MeditationProcessInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [editingProcess, setEditingProcess] = useState<MeditationProcessInfo | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<ProcessCreateRequest>({
        name: "",
        description: "",
        order: 1,
        duration_minutes: 5,
        level: 1
    });

    useEffect(() => {
        loadProcesses();
    }, [selectedLevel]);

    const loadProcesses = async () => {
        try {
            setLoading(true);
            const data = await adminMeditationService.getProcesses(selectedLevel);
            setProcesses(data);
        } catch (err: any) {
            console.error("Failed to load processes:", err);
            toast.error("Failed to load processes");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const newProcess = await adminMeditationService.createProcess({
                ...formData,
                level: selectedLevel
            });
            toast.success("Process created successfully");
            setProcesses([...processes, newProcess]);
            setIsAddingNew(false);
            setFormData({ name: "", description: "", order: processes.length + 1, duration_minutes: 5, level: selectedLevel });
        } catch (err: any) {
            toast.error(err.message || "Failed to create process");
        }
    };

    const handleUpdate = async () => {
        if (!editingProcess) return;
        try {
            const updated = await adminMeditationService.updateProcess(editingProcess.id, {
                name: formData.name,
                description: formData.description,
                order: formData.order,
                duration_minutes: formData.duration_minutes
            });
            toast.success("Process updated successfully");
            setProcesses(processes.map(p => p.id === updated.id ? updated : p));
            setEditingProcess(null);
        } catch (err: any) {
            toast.error(err.message || "Failed to update process");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this process?")) return;
        try {
            await adminMeditationService.deleteProcess(id);
            toast.success("Process deleted");
            setProcesses(processes.filter(p => p.id !== id));
        } catch (err: any) {
            toast.error(err.message || "Failed to delete process");
        }
    };

    const handleVideoUpload = async (processId: number, file: File) => {
        try {
            setUploadingVideo(processId);
            const updated = await adminMeditationService.uploadVideo(processId, file);
            toast.success("Video uploaded successfully");
            setProcesses(processes.map(p => p.id === updated.id ? updated : p));
        } catch (err: any) {
            toast.error(err.message || "Failed to upload video");
        } finally {
            setUploadingVideo(null);
        }
    };

    const handleDeleteVideo = async (processId: number) => {
        if (!confirm("Delete this video?")) return;
        try {
            await adminMeditationService.deleteVideo(processId);
            toast.success("Video deleted");
            setProcesses(processes.map(p =>
                p.id === processId ? { ...p, video_url: null, video_filename: null } : p
            ));
        } catch (err: any) {
            toast.error(err.message || "Failed to delete video");
        }
    };

    const startEdit = (process: MeditationProcessInfo) => {
        setEditingProcess(process);
        setFormData({
            name: process.name,
            description: process.description || "",
            order: process.order,
            duration_minutes: process.duration_minutes,
            level: process.level
        });
        setIsAddingNew(false);
    };

    const startAdd = () => {
        setIsAddingNew(true);
        setEditingProcess(null);
        setFormData({
            name: "",
            description: "",
            order: processes.length + 1,
            duration_minutes: 5,
            level: selectedLevel
        });
    };

    const cancelEdit = () => {
        setEditingProcess(null);
        setIsAddingNew(false);
    };

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Brain className="h-8 w-8 text-purple-600" />
                        Meditation Processes
                    </h1>
                    <p className="text-gray-500 mt-1">Manage meditation processes and upload explanation videos</p>
                </div>
                <Button onClick={startAdd} disabled={isAddingNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Process
                </Button>
            </div>

            {/* Level Tabs */}
            <div className="flex gap-2">
                {[1, 2, 3, 4].map(level => (
                    <Button
                        key={level}
                        variant={selectedLevel === level ? "default" : "outline"}
                        onClick={() => setSelectedLevel(level)}
                        className="flex items-center gap-2"
                    >
                        <Layers className="h-4 w-4" />
                        Level {level}
                    </Button>
                ))}
            </div>

            {/* Add/Edit Form */}
            {(isAddingNew || editingProcess) && (
                <Card className="border-2 border-primary">
                    <CardHeader>
                        <CardTitle>{isAddingNew ? "Add New Process" : "Edit Process"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Process Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Deep Breathing"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="order">Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={formData.order}
                                        onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="duration">Duration (min)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={formData.duration_minutes}
                                        onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the meditation process..."
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={cancelEdit}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button onClick={isAddingNew ? handleCreate : handleUpdate}>
                                <Save className="mr-2 h-4 w-4" />
                                {isAddingNew ? "Create" : "Save"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Processes List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : processes.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No processes for Level {selectedLevel} yet.</p>
                        <Button onClick={startAdd} className="mt-4">
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Process
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {processes.map(process => (
                        <Card key={process.id} className={`transition-all ${!process.is_active ? 'opacity-50' : ''}`}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    {/* Order Badge */}
                                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <span className="text-lg font-bold text-purple-600">{process.order}</span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{process.name}</h3>
                                        {process.description && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{process.description}</p>
                                        )}
                                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {process.duration_minutes} min
                                            </span>
                                            {process.video_url && (
                                                <span className="flex items-center gap-1 text-green-500">
                                                    <Video className="h-3 w-3" />
                                                    Video attached
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Video Actions */}
                                    <div className="flex items-center gap-2">
                                        {process.video_url ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDeleteVideo(process.id)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Video className="mr-1 h-4 w-4" />
                                                Remove Video
                                            </Button>
                                        ) : (
                                            <>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    className="hidden"
                                                    id={`video-${process.id}`}
                                                    onChange={e => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleVideoUpload(process.id, file);
                                                    }}
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => document.getElementById(`video-${process.id}`)?.click()}
                                                    disabled={uploadingVideo === process.id}
                                                >
                                                    <Upload className="mr-1 h-4 w-4" />
                                                    {uploadingVideo === process.id ? "Uploading..." : "Upload Video"}
                                                </Button>
                                            </>
                                        )}

                                        {/* Edit/Delete */}
                                        <Button size="sm" variant="ghost" onClick={() => startEdit(process)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleDelete(process.id)} className="text-red-500 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Info Card */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Process Unlock Schedule</h3>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                        <li>• <strong>Day 1:</strong> Processes 1-3 unlock (with video explanations)</li>
                        <li>• <strong>Day 8:</strong> Processes 4-6 unlock (with video explanations)</li>
                        <li>• <strong>Day 15:</strong> Processes 7-9 unlock (with video explanations)</li>
                        <li>• <strong>Day 22:</strong> Processes 10-12 unlock (with video explanations)</li>
                        <li>• Videos are shown only on the day new processes unlock</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

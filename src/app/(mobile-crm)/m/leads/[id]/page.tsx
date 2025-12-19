"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Phone,
    MessageCircle,
    Mail,
    ArrowLeft,
    MapPin,
    Calendar,
    Clock,
    Star,
    Edit2,
    Mic,
    Play,
    Trash2,
    Plus,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import CommunicationBar from "@/components/mobile-crm/CommunicationBar";
import VoiceRecorder from "@/components/mobile-crm/VoiceRecorder";
import api from "@/lib/api";

interface Lead {
    id: number;
    name: string;
    email: string;
    phone?: string;
    status: string;
    source_primary?: string;
    source_secondary?: string;
    intent_score: number;
    is_verified: boolean;
    notes?: string;
    last_activity: string;
    created_at: string;
}

interface VoiceNote {
    id: number;
    file_url: string;
    title?: string;
    duration_seconds?: number;
    created_at: string;
}

interface CallLog {
    id: number;
    call_type: string;
    duration_seconds: number;
    outcome?: string;
    notes?: string;
    call_started_at: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    NEW: { label: "New", color: "text-blue-400", bgColor: "bg-blue-500/20" },
    CONTACTED: { label: "Contacted", color: "text-purple-400", bgColor: "bg-purple-500/20" },
    INTERESTED: { label: "Interested", color: "text-amber-400", bgColor: "bg-amber-500/20" },
    ENROLLED: { label: "Enrolled", color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
    CLOSED: { label: "Closed", color: "text-gray-400", bgColor: "bg-gray-500/20" },
    JUNK: { label: "Junk", color: "text-red-400", bgColor: "bg-red-500/20" },
};

// Mock lead data
const mockLead: Lead = {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    status: "INTERESTED",
    source_primary: "Website",
    source_secondary: "Google Ads",
    intent_score: 0.85,
    is_verified: true,
    notes: "Interested in MBA program. Looking for early bird discount. Preferred batch: January 2024.",
    last_activity: new Date().toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
};

export default function LeadDetailPage() {
    const params = useParams();
    const router = useRouter();
    const leadId = params?.id as string;

    const [lead, setLead] = useState<Lead | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
    const [callLogs, setCallLogs] = useState<CallLog[]>([]);
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch lead details
    useEffect(() => {
        const fetchLead = async () => {
            setIsLoading(true);
            try {
                // In production, fetch from API
                // const response = await api.get(`/leads/${leadId}`);
                // setLead(response.data);

                // Mock for demo
                setLead(mockLead);

                // Fetch voice notes
                // const notesResponse = await api.get(`/voice-notes/lead/${leadId}`);
                // setVoiceNotes(notesResponse.data);

                // Fetch call logs
                // const callsResponse = await api.get(`/call-logs/lead/${leadId}`);
                // setCallLogs(callsResponse.data);
            } catch (error) {
                console.error("Error fetching lead:", error);
                setLead(mockLead);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLead();
    }, [leadId]);

    // Update lead notes
    const handleUpdateNotes = async () => {
        if (!lead || !newNote.trim()) return;

        setIsUpdating(true);
        try {
            const updatedNotes = lead.notes
                ? `${lead.notes}\n\n[${new Date().toLocaleDateString()}]: ${newNote}`
                : newNote;

            await api.put(`/leads/${lead.id}`, { notes: updatedNotes });
            setLead({ ...lead, notes: updatedNotes });
            setNewNote("");
        } catch (error) {
            console.error("Error updating notes:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle voice note upload
    const handleVoiceNoteUploaded = (voiceNote: VoiceNote) => {
        setVoiceNotes([voiceNote, ...voiceNotes]);
        setShowVoiceRecorder(false);
    };

    // Update lead status
    const updateStatus = async (newStatus: string) => {
        if (!lead) return;

        try {
            await api.put(`/leads/${lead.id}`, { status: newStatus });
            setLead({ ...lead, status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Lead not found</p>
            </div>
        );
    }

    const statusInfo = statusConfig[lead.status] || statusConfig.NEW;

    return (
        <div className="flex flex-col h-full">
            {/* Custom Header */}
            <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 p-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-300"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="font-semibold text-white">{lead.name}</h1>
                        <p className="text-xs text-gray-400">{lead.email}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-300">
                        <Edit2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto pb-32">
                {/* Profile Card */}
                <div className="p-4 space-y-4">
                    <Card className="bg-gray-800/50 border-gray-700/50">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                                    {lead.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>

                                {/* Info */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-white">{lead.name}</h2>
                                        {lead.is_verified && (
                                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                                            {statusInfo.label}
                                        </Badge>
                                        <Badge className="bg-amber-500/20 text-amber-400 border-0">
                                            <Star className="h-3 w-3 mr-1" />
                                            {Math.round(lead.intent_score * 100)}% Intent
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{lead.email}</span>
                                </div>
                                {lead.phone && (
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{lead.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-300">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{lead.source_primary || "Direct"}</span>
                                    {lead.source_secondary && (
                                        <span className="text-xs text-gray-500">→ {lead.source_secondary}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    Added {new Date(lead.created_at).toLocaleDateString()}
                                    <span className="mx-1">•</span>
                                    <Clock className="h-3 w-3" />
                                    Last activity {new Date(lead.last_activity).toLocaleDateString()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Update */}
                    <Card className="bg-gray-800/50 border-gray-700/50">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm text-gray-300">Update Status</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(statusConfig).map(([key, config]) => (
                                    <Badge
                                        key={key}
                                        className={`cursor-pointer transition-all ${lead.status === key
                                                ? `${config.bgColor} ${config.color} ring-2 ring-offset-2 ring-offset-gray-900 ring-current`
                                                : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                                            }`}
                                        onClick={() => updateStatus(key)}
                                    >
                                        {config.label}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes Section */}
                    <Card className="bg-gray-800/50 border-gray-700/50">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm text-gray-300">Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-3">
                            {lead.notes && (
                                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                                    {lead.notes}
                                </p>
                            )}
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Add a note..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 min-h-[60px] resize-none text-sm"
                                />
                            </div>
                            <Button
                                size="sm"
                                onClick={handleUpdateNotes}
                                disabled={!newNote.trim() || isUpdating}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600"
                            >
                                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Add Note
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Voice Notes Section */}
                    <Card className="bg-gray-800/50 border-gray-700/50">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm text-gray-300">Voice Notes</CardTitle>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-emerald-400"
                                onClick={() => setShowVoiceRecorder(true)}
                            >
                                <Mic className="h-4 w-4 mr-1" />
                                Record
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {voiceNotes.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    No voice notes yet
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {voiceNotes.map((note) => (
                                        <div
                                            key={note.id}
                                            className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg"
                                        >
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-400">
                                                <Play className="h-4 w-4" />
                                            </Button>
                                            <div className="flex-1">
                                                <p className="text-sm text-white">{note.title || "Voice Note"}</p>
                                                <p className="text-xs text-gray-500">
                                                    {note.duration_seconds}s • {new Date(note.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Call History */}
                    <Card className="bg-gray-800/50 border-gray-700/50">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm text-gray-300">Call History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {callLogs.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    No calls recorded yet
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {callLogs.map((call) => (
                                        <div
                                            key={call.id}
                                            className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg"
                                        >
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${call.outcome === "CONNECTED" ? "bg-emerald-500/20" : "bg-gray-600/50"
                                                }`}>
                                                <Phone className={`h-4 w-4 ${call.outcome === "CONNECTED" ? "text-emerald-400" : "text-gray-400"
                                                    }`} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-white capitalize">{call.call_type.toLowerCase()}</p>
                                                <p className="text-xs text-gray-500">
                                                    {call.duration_seconds}s • {call.outcome || "Unknown"}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {new Date(call.call_started_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Fixed Communication Bar */}
            <CommunicationBar
                phone={lead.phone}
                email={lead.email}
                leadId={lead.id}
            />

            {/* Voice Recorder Modal */}
            {showVoiceRecorder && (
                <VoiceRecorder
                    leadId={lead.id}
                    onClose={() => setShowVoiceRecorder(false)}
                    onUploaded={handleVoiceNoteUploaded}
                />
            )}
        </div>
    );
}

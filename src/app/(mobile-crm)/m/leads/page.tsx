"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Phone,
    MessageCircle,
    Mail,
    ChevronRight,
    Mic,
    X,
    Loader2,
    Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SwipeableCard from "@/components/mobile-crm/SwipeableCard";
import VoiceSearch from "@/components/mobile-crm/VoiceSearch";
import api from "@/lib/api";

interface Lead {
    id: number;
    name: string;
    email: string;
    phone?: string;
    status: "NEW" | "CONTACTED" | "INTERESTED" | "ENROLLED" | "CLOSED" | "JUNK";
    source_primary?: string;
    intent_score: number;
    last_activity: string;
    created_at: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
    NEW: { label: "New", color: "bg-blue-500/20 text-blue-400" },
    CONTACTED: { label: "Contacted", color: "bg-purple-500/20 text-purple-400" },
    INTERESTED: { label: "Interested", color: "bg-amber-500/20 text-amber-400" },
    ENROLLED: { label: "Enrolled", color: "bg-emerald-500/20 text-emerald-400" },
    CLOSED: { label: "Closed", color: "bg-gray-500/20 text-gray-400" },
    JUNK: { label: "Junk", color: "bg-red-500/20 text-red-400" },
};

// Mock data for demo
const mockLeads: Lead[] = [
    {
        id: 1,
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91 98765 43210",
        status: "NEW",
        source_primary: "Website",
        intent_score: 0.85,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
    },
    {
        id: 2,
        name: "Rahul Verma",
        email: "rahul.v@email.com",
        phone: "+91 87654 32109",
        status: "CONTACTED",
        source_primary: "LinkedIn",
        intent_score: 0.72,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
    },
    {
        id: 3,
        name: "Ananya Patel",
        email: "ananya.p@email.com",
        phone: "+91 76543 21098",
        status: "INTERESTED",
        source_primary: "Referral",
        intent_score: 0.91,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
    },
    {
        id: 4,
        name: "Vikram Singh",
        email: "vikram.s@email.com",
        phone: "+91 65432 10987",
        status: "NEW",
        source_primary: "Event",
        intent_score: 0.45,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
    },
    {
        id: 5,
        name: "Neha Gupta",
        email: "neha.g@email.com",
        phone: "+91 54321 09876",
        status: "ENROLLED",
        source_primary: "Website",
        intent_score: 0.98,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
    },
];

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>(mockLeads);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [showVoiceSearch, setShowVoiceSearch] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    // Fetch leads from API
    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const params: Record<string, string> = {};
            if (searchQuery) params.search = searchQuery;
            if (selectedStatus) params.status = selectedStatus;

            const response = await api.get("/leads", { params });
            setLeads(response.data);
        } catch (error) {
            console.error("Error fetching leads:", error);
            // Use mock data on error
            setLeads(mockLeads);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [selectedStatus]);

    // Filter leads based on search
    const filteredLeads = leads.filter(
        (lead) =>
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.phone?.includes(searchQuery)
    );

    // Handle call action
    const handleCall = (lead: Lead) => {
        if (lead.phone) {
            // Log the call
            api.post("/call-logs/quick-call", {
                lead_id: lead.id,
                phone_number: lead.phone,
            }).catch(console.error);

            // Open phone app
            window.location.href = `tel:${lead.phone}`;
        }
    };

    // Handle WhatsApp action
    const handleWhatsApp = (lead: Lead) => {
        if (lead.phone) {
            const phoneNumber = lead.phone.replace(/[^0-9]/g, "");
            window.open(`https://wa.me/${phoneNumber}`, "_blank");
        }
    };

    // Handle voice search result
    const handleVoiceResult = (transcript: string) => {
        setSearchQuery(transcript);
        setShowVoiceSearch(false);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Search & Filter Bar */}
            <div className="sticky top-14 z-40 bg-gray-950 p-4 space-y-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white"
                                onClick={() => setSearchQuery("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700"
                        onClick={() => setShowVoiceSearch(true)}
                    >
                        <Mic className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-10 w-10 bg-gray-800/50 ${showFilters ? "text-emerald-400" : "text-gray-400"} hover:text-white hover:bg-gray-700`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-5 w-5" />
                    </Button>
                </div>

                {/* Filter Pills */}
                {showFilters && (
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <Badge
                                key={key}
                                variant="outline"
                                className={`cursor-pointer transition-colors ${selectedStatus === key
                                        ? config.color + " border-current"
                                        : "border-gray-600 text-gray-400 hover:border-gray-500"
                                    }`}
                                onClick={() =>
                                    setSelectedStatus(selectedStatus === key ? null : key)
                                }
                            >
                                {config.label}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Leads List */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No leads found</p>
                    </div>
                ) : (
                    filteredLeads.map((lead) => (
                        <SwipeableCard
                            key={lead.id}
                            leftAction={{
                                icon: Phone,
                                color: "bg-emerald-500",
                                onAction: () => handleCall(lead),
                            }}
                            rightAction={{
                                icon: MessageCircle,
                                color: "bg-purple-500",
                                onAction: () => handleWhatsApp(lead),
                            }}
                        >
                            <Link href={`/m/leads/${lead.id}`}>
                                <Card className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/80 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold shrink-0">
                                                {lead.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-white truncate">
                                                        {lead.name}
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${statusConfig[lead.status]?.color || ""} border-0 shrink-0`}
                                                    >
                                                        {statusConfig[lead.status]?.label || lead.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-400 truncate">
                                                    {lead.email}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-gray-700/50 text-gray-300 border-0"
                                                    >
                                                        {lead.source_primary || "Direct"}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">
                                                        Score: {Math.round(lead.intent_score * 100)}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-emerald-400 hover:bg-emerald-500/20"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleCall(lead);
                                                    }}
                                                >
                                                    <Phone className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-purple-400 hover:bg-purple-500/20"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleWhatsApp(lead);
                                                    }}
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </SwipeableCard>
                    ))
                )}
            </div>

            {/* Floating Add Button */}
            <Link href="/m/leads/new">
                <Button className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg hover:shadow-xl">
                    <Plus className="h-6 w-6" />
                </Button>
            </Link>

            {/* Voice Search Modal */}
            {showVoiceSearch && (
                <VoiceSearch
                    onResult={handleVoiceResult}
                    onClose={() => setShowVoiceSearch(false)}
                />
            )}
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    MapPin,
    Users,
    Building2,
    Calendar,
    Camera,
    MessageSquare,
    Loader2,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface ActivityType {
    id: string;
    label: string;
    icon: any;
    color: string;
    description: string;
}

const activityTypes: ActivityType[] = [
    {
        id: "MEETING",
        label: "Meeting",
        icon: Users,
        color: "from-blue-500 to-indigo-600",
        description: "In-person or scheduled meeting",
    },
    {
        id: "VISIT",
        label: "Site Visit",
        icon: Building2,
        color: "from-purple-500 to-pink-600",
        description: "Visit to prospect location",
    },
    {
        id: "WALK_IN",
        label: "Walk-in",
        icon: MapPin,
        color: "from-emerald-500 to-teal-600",
        description: "Walk-in inquiry at office",
    },
    {
        id: "CAMPUS_VISIT",
        label: "Campus Visit",
        icon: Building2,
        color: "from-amber-500 to-orange-600",
        description: "Campus tour or visit",
    },
    {
        id: "EVENT",
        label: "Event/Fair",
        icon: Calendar,
        color: "from-rose-500 to-red-600",
        description: "Education fair or event",
    },
];

interface LocationData {
    latitude: number;
    longitude: number;
    address?: string;
}

export default function ActivitiesPage() {
    const router = useRouter();

    const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [duration, setDuration] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Get current location
    const getCurrentLocation = async () => {
        setIsLoadingLocation(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported");
            setIsLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                let address = "";
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    address = data.display_name || "";
                } catch (error) {
                    console.error("Error getting address:", error);
                }

                setLocation({ latitude, longitude, address });
                setIsLoadingLocation(false);
            },
            (error) => {
                setLocationError("Could not get location. Please enable location access.");
                setIsLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!selectedType) return;

        setIsSubmitting(true);
        try {
            await api.post("/field-activities/meeting", {
                activity_type: selectedType.id,
                latitude: location?.latitude,
                longitude: location?.longitude,
                address: location?.address,
                title: title || selectedType.label,
                notes: notes || undefined,
                duration_minutes: duration ? parseInt(duration) : undefined,
            });

            setIsSuccess(true);

            // Reset after delay
            setTimeout(() => {
                router.push("/m");
            }, 1500);
        } catch (error: any) {
            setLocationError(error.response?.data?.detail || "Failed to log activity");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success screen
    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle className="h-10 w-10 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Activity Logged!</h2>
                <p className="text-gray-400">Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            {/* Activity Type Selection */}
            {!selectedType ? (
                <>
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-bold text-white">Log Activity</h2>
                        <p className="text-gray-400 text-sm">Select the type of activity to record</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {activityTypes.map((type) => (
                            <Card
                                key={type.id}
                                className="bg-gray-800/50 border-gray-700/50 hover:border-gray-600 transition-colors cursor-pointer"
                                onClick={() => {
                                    setSelectedType(type);
                                    getCurrentLocation();
                                }}
                            >
                                <CardContent className="p-4 text-center space-y-3">
                                    <div
                                        className={`mx-auto w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center`}
                                    >
                                        <type.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{type.label}</p>
                                        <p className="text-xs text-gray-400 mt-1">{type.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {/* Activity Form */}
                    <div className="flex items-center gap-3 mb-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedType(null)}
                            className="text-gray-400"
                        >
                            ← Back
                        </Button>
                        <Badge className={`bg-gradient-to-r ${selectedType.color} border-0`}>
                            {selectedType.label}
                        </Badge>
                    </div>

                    {/* Location Card */}
                    <Card className="bg-gray-800/50 border-gray-700/50">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-blue-400" />
                                Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {isLoadingLocation ? (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">Getting location...</span>
                                </div>
                            ) : location ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-300">
                                        📍 {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={getCurrentLocation}
                                        className="text-emerald-400 h-8"
                                    >
                                        Refresh Location
                                    </Button>
                                </div>
                            ) : locationError ? (
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
                                    <div>
                                        <p className="text-sm text-amber-300">{locationError}</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={getCurrentLocation}
                                            className="text-emerald-400 h-8 mt-1 p-0"
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={getCurrentLocation}
                                    className="text-emerald-400 h-8"
                                >
                                    <MapPin className="h-4 w-4 mr-1" />
                                    Get Location
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Activity Details */}
                    <Card className="bg-gray-800/50 border-gray-700/50">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm text-gray-300">Activity Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Title</label>
                                <Input
                                    placeholder={`${selectedType.label} at...`}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Duration (minutes)</label>
                                <Input
                                    type="number"
                                    placeholder="30"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Notes</label>
                                <Textarea
                                    placeholder="Add notes about this activity..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 min-h-[100px] resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Photo Section - Placeholder */}
                    <Card className="bg-gray-800/50 border-gray-700/50">
                        <CardContent className="p-4">
                            <Button
                                variant="ghost"
                                className="w-full h-24 border-2 border-dashed border-gray-600 text-gray-400 hover:text-gray-300 hover:border-gray-500"
                            >
                                <Camera className="h-6 w-6 mr-2" />
                                Add Photo
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="fixed bottom-20 left-4 right-4">
                        <Button
                            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                <CheckCircle className="h-5 w-5 mr-2" />
                            )}
                            Log Activity
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

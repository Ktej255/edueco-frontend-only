"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    MapPin,
    Clock,
    CheckCircle2,
    Loader2,
    Navigation,
    Camera,
    MessageSquare,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

interface LocationData {
    latitude: number;
    longitude: number;
    address?: string;
    accuracy?: number;
}

export default function CheckInPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [location, setLocation] = useState<LocationData | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [notes, setNotes] = useState("");
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<Date | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Get current location
    const getCurrentLocation = async () => {
        setIsLoadingLocation(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setIsLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                // Try to get address via reverse geocoding
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

                setLocation({
                    latitude,
                    longitude,
                    address,
                    accuracy,
                });
                setIsLoadingLocation(false);
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("Location permission denied. Please enable location access.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        setLocationError("Location request timed out.");
                        break;
                    default:
                        setLocationError("An unknown error occurred.");
                }
                setIsLoadingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    // Get location on mount
    useEffect(() => {
        getCurrentLocation();
    }, []);

    // Handle check-in
    const handleCheckIn = async () => {
        if (!location) {
            setLocationError("Please wait for location to be captured");
            return;
        }

        setIsCheckingIn(true);
        try {
            await api.post("/field-activities/check-in", {
                latitude: location.latitude,
                longitude: location.longitude,
                address: location.address,
                notes: notes || undefined,
            });

            setIsCheckedIn(true);
            setCheckInTime(new Date());
        } catch (error: any) {
            const message = error.response?.data?.detail || "Failed to check in";
            setLocationError(message);
        } finally {
            setIsCheckingIn(false);
        }
    };

    // Handle check-out
    const handleCheckOut = async () => {
        setIsCheckingIn(true);
        try {
            await api.post("/field-activities/check-out", {
                latitude: location?.latitude,
                longitude: location?.longitude,
                notes: notes || undefined,
            });

            router.push("/m");
        } catch (error: any) {
            const message = error.response?.data?.detail || "Failed to check out";
            setLocationError(message);
            setIsCheckingIn(false);
        }
    };

    return (
        <div className="p-4 space-y-6">
            {/* Status Card */}
            <Card className={`border-2 ${isCheckedIn ? "border-emerald-500/50 bg-emerald-500/10" : "border-gray-700/50 bg-gray-800/50"}`}>
                <CardContent className="p-6 text-center space-y-4">
                    {/* Status Icon */}
                    <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${isCheckedIn
                            ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                            : "bg-gradient-to-br from-gray-600 to-gray-700"
                        }`}>
                        {isCheckedIn ? (
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        ) : (
                            <MapPin className="h-10 w-10 text-white" />
                        )}
                    </div>

                    {/* Status Text */}
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {isCheckedIn ? "Checked In" : "Not Checked In"}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {isCheckedIn && checkInTime
                                ? `Since ${checkInTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
                                : "Start your work day by checking in"}
                        </p>
                    </div>

                    {/* Current Time */}
                    <div className="flex items-center justify-center gap-2 text-gray-300">
                        <Clock className="h-4 w-4" />
                        <span className="text-lg font-mono">
                            {currentTime.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                            })}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-blue-400" />
                            Your Location
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={getCurrentLocation}
                            disabled={isLoadingLocation}
                            className="text-emerald-400 hover:text-emerald-300"
                        >
                            {isLoadingLocation ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : null}
                            Refresh
                        </Button>
                    </div>

                    {locationError && (
                        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-300">{locationError}</p>
                        </div>
                    )}

                    {isLoadingLocation && (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-center space-y-3">
                                <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto" />
                                <p className="text-sm text-gray-400">Getting your location...</p>
                            </div>
                        </div>
                    )}

                    {location && !isLoadingLocation && (
                        <div className="space-y-3">
                            {/* Map Placeholder */}
                            <div className="h-40 bg-gray-700/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10" />
                                <div className="text-center z-10">
                                    <MapPin className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                                    <p className="text-xs text-gray-400">
                                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                    </p>
                                </div>
                            </div>

                            {/* Address */}
                            {location.address && (
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    📍 {location.address}
                                </p>
                            )}

                            {/* Accuracy Badge */}
                            {location.accuracy && (
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                    Accuracy: ±{Math.round(location.accuracy)}m
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Notes Section */}
            <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-400" />
                        Notes (Optional)
                    </h3>
                    <Textarea
                        placeholder="Add any notes about your check-in..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 min-h-[80px] resize-none"
                    />
                </CardContent>
            </Card>

            {/* Action Button */}
            <div className="fixed bottom-20 left-4 right-4">
                {isCheckedIn ? (
                    <Button
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                        onClick={handleCheckOut}
                        disabled={isCheckingIn}
                    >
                        {isCheckingIn ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : null}
                        Check Out
                    </Button>
                ) : (
                    <Button
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                        onClick={handleCheckIn}
                        disabled={isCheckingIn || !location || isLoadingLocation}
                    >
                        {isCheckingIn ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                            <MapPin className="h-5 w-5 mr-2" />
                        )}
                        Check In Now
                    </Button>
                )}
            </div>
        </div>
    );
}

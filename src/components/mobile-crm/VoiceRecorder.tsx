"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

interface VoiceRecorderProps {
    leadId?: number;
    activityId?: number;
    onClose: () => void;
    onUploaded: (voiceNote: any) => void;
}

export default function VoiceRecorder({
    leadId,
    activityId,
    onClose,
    onUploaded,
}: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [title, setTitle] = useState("");
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Start recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm",
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));

                // Stop all tracks
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start(1000); // Collect data every second
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            setError("Could not access microphone. Please grant permission.");
            console.error("Error starting recording:", err);
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    // Pause/Resume recording
    const togglePause = () => {
        if (!mediaRecorderRef.current) return;

        if (isPaused) {
            mediaRecorderRef.current.resume();
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else {
            mediaRecorderRef.current.pause();
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
        setIsPaused(!isPaused);
    };

    // Play/Pause recorded audio
    const togglePlayback = () => {
        if (!audioRef.current || !audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Upload voice note
    const uploadVoiceNote = async () => {
        if (!audioBlob) return;

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", audioBlob, `voice_note_${Date.now()}.webm`);
            if (leadId) formData.append("lead_id", leadId.toString());
            if (activityId) formData.append("field_activity_id", activityId.toString());
            if (title) formData.append("title", title);
            formData.append("duration_seconds", recordingTime.toString());

            const response = await api.post("/voice-notes/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            onUploaded(response.data);
        } catch (err) {
            setError("Failed to upload voice note. Please try again.");
            console.error("Error uploading:", err);
        } finally {
            setIsUploading(false);
        }
    };

    // Reset recorder
    const resetRecorder = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingTime(0);
        setIsPlaying(false);
        setTitle("");
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    return (
        <div className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-lg flex flex-col items-center justify-center p-6">
            {/* Close Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={onClose}
            >
                <X className="h-6 w-6" />
            </Button>

            <div className="w-full max-w-sm space-y-8">
                {/* Title */}
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white">
                        {audioBlob ? "Review Recording" : isRecording ? "Recording..." : "Voice Note"}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {audioBlob
                            ? "Listen and save your recording"
                            : isRecording
                                ? "Tap stop when finished"
                                : "Tap the microphone to start"}
                    </p>
                </div>

                {/* Timer Display */}
                <div className="text-center">
                    <span className="text-5xl font-mono text-white">
                        {formatTime(recordingTime)}
                    </span>
                </div>

                {/* Waveform Placeholder / Recording Indicator */}
                <div className="h-20 bg-gray-800/50 rounded-xl flex items-center justify-center">
                    {isRecording ? (
                        <div className="flex items-center gap-1">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-emerald-400 rounded-full animate-pulse"
                                    style={{
                                        height: `${Math.random() * 40 + 10}px`,
                                        animationDelay: `${i * 0.05}s`,
                                    }}
                                />
                            ))}
                        </div>
                    ) : audioUrl ? (
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            onEnded={() => setIsPlaying(false)}
                            className="hidden"
                        />
                    ) : (
                        <div className="flex items-center gap-1">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-gray-600 rounded-full"
                                    style={{ height: "10px" }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                    {!audioBlob ? (
                        <>
                            {isRecording ? (
                                <>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-14 w-14 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
                                        onClick={togglePause}
                                    >
                                        {isPaused ? (
                                            <Play className="h-6 w-6" />
                                        ) : (
                                            <Pause className="h-6 w-6" />
                                        )}
                                    </Button>
                                    <Button
                                        size="icon"
                                        className="h-20 w-20 rounded-full bg-red-500 hover:bg-red-600"
                                        onClick={stopRecording}
                                    >
                                        <Square className="h-8 w-8" />
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    size="icon"
                                    className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30"
                                    onClick={startRecording}
                                >
                                    <Mic className="h-10 w-10" />
                                </Button>
                            )}
                        </>
                    ) : (
                        <>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-14 w-14 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
                                onClick={resetRecorder}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                            <Button
                                size="icon"
                                className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
                                onClick={togglePlayback}
                            >
                                {isPlaying ? (
                                    <Pause className="h-8 w-8" />
                                ) : (
                                    <Play className="h-8 w-8" />
                                )}
                            </Button>
                        </>
                    )}
                </div>

                {/* Title Input & Upload (after recording) */}
                {audioBlob && (
                    <div className="space-y-4">
                        <Input
                            placeholder="Add a title (optional)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        />

                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}

                        <Button
                            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600"
                            onClick={uploadVoiceNote}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                <Upload className="h-5 w-5 mr-2" />
                            )}
                            Save Voice Note
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

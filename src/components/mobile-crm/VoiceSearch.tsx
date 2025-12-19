"use client";

import { useState, useEffect, useCallback } from "react";
import { Mic, MicOff, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceSearchProps {
    onResult: (transcript: string) => void;
    onClose: () => void;
}

export default function VoiceSearch({ onResult, onClose }: VoiceSearchProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

    useEffect(() => {
        // Check for browser support
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Speech recognition is not supported in your browser");
            return;
        }

        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            setTranscript(transcriptText);

            // If final result, submit it
            if (event.results[current].isFinal) {
                onResult(transcriptText);
            }
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
            switch (event.error) {
                case "not-allowed":
                    setError("Microphone access denied");
                    break;
                case "no-speech":
                    setError("No speech detected. Please try again.");
                    break;
                case "network":
                    setError("Network error occurred");
                    break;
                default:
                    setError(`Error: ${event.error}`);
            }
            setIsListening(false);
        };

        recognitionInstance.onend = () => {
            setIsListening(false);
        };

        setRecognition(recognitionInstance);

        return () => {
            recognitionInstance.abort();
        };
    }, [onResult]);

    const startListening = useCallback(() => {
        if (recognition) {
            setTranscript("");
            setError(null);
            recognition.start();
        }
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
        }
    }, [recognition]);

    // Auto-start listening on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            if (recognition && !isListening && !error) {
                startListening();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [recognition, isListening, error, startListening]);

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

            {/* Animated Mic Circle */}
            <div className="relative mb-8">
                <div
                    className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isListening
                            ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30"
                            : error
                                ? "bg-gradient-to-br from-red-500 to-orange-600"
                                : "bg-gradient-to-br from-gray-600 to-gray-700"
                        }`}
                >
                    {isListening ? (
                        <Mic className="h-12 w-12 text-white animate-pulse" />
                    ) : error ? (
                        <MicOff className="h-12 w-12 text-white" />
                    ) : (
                        <Loader2 className="h-12 w-12 text-white animate-spin" />
                    )}
                </div>

                {/* Pulse rings when listening */}
                {isListening && (
                    <>
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                        <div
                            className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"
                            style={{ animationDelay: "0.2s" }}
                        />
                    </>
                )}
            </div>

            {/* Status Text */}
            <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-white">
                    {isListening
                        ? "Listening..."
                        : error
                            ? "Error"
                            : "Initializing..."}
                </h3>
                {error ? (
                    <p className="text-red-400 text-sm">{error}</p>
                ) : (
                    <p className="text-gray-400 text-sm">
                        {isListening
                            ? "Say a name to search for a lead"
                            : "Preparing voice recognition..."}
                    </p>
                )}
            </div>

            {/* Transcript Display */}
            {transcript && (
                <div className="mt-8 px-6 py-4 bg-gray-800/50 rounded-xl max-w-sm w-full">
                    <p className="text-white text-center text-lg">"{transcript}"</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
                {error ? (
                    <Button
                        onClick={startListening}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600"
                    >
                        <Mic className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                ) : isListening ? (
                    <Button
                        onClick={stopListening}
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-800"
                    >
                        Stop
                    </Button>
                ) : null}

                {transcript && (
                    <Button
                        onClick={() => onResult(transcript)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600"
                    >
                        Search "{transcript}"
                    </Button>
                )}
            </div>
        </div>
    );
}

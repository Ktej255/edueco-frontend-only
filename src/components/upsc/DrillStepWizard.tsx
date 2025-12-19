"use client";

import React, { useState } from "react";
import { DrillTimer } from "./DrillTimer";
import { QuestionCard } from "./QuestionCard";
import { AnswerUpload } from "./AnswerUpload";
import { VoiceRecorder } from "./VoiceRecorder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { upscService } from "@/services/upscService";

type DrillStep =
    | "read"
    | "write_before"
    | "upload_before"
    | "study"
    | "write_after"
    | "upload_after"
    | "complete";

interface DrillStepWizardProps {
    question: any;
    timerConfig: Record<string, number>;
    onSessionComplete: () => void;
}

export const DrillStepWizard: React.FC<DrillStepWizardProps> = ({
    question,
    timerConfig,
    onSessionComplete,
}) => {
    const [currentStep, setCurrentStep] = useState<DrillStep>("read");
    const [isUploading, setIsUploading] = useState(false);

    const steps: { id: DrillStep; label: string; duration?: number }[] = [
        { id: "read", label: "Read Question", duration: timerConfig.read },
        { id: "write_before", label: "Attempt 1 (Pre-Study)", duration: timerConfig.write_before },
        { id: "upload_before", label: "Upload Attempt 1" },
        { id: "study", label: "Study Content", duration: timerConfig.study },
        { id: "write_after", label: "Attempt 2 (Post-Study)", duration: timerConfig.write_after },
        { id: "upload_after", label: "Upload Attempt 2" },
        { id: "complete", label: "Analysis Report" },
    ];

    const handleTimerComplete = () => {
        // Auto-advance logic or show "Time's Up" modal
        advanceStep();
    };

    const advanceStep = () => {
        const currentIndex = steps.findIndex((s) => s.id === currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1].id as DrillStep);
        } else {
            onSessionComplete();
        }
    };

    const handleVoiceUpload = async (audioBlob: Blob) => {
        setIsUploading(true);
        try {
            const file = new File([audioBlob], "voice_recall.webm", { type: "audio/webm" });
            const attemptType = currentStep === "upload_before" ? "before" : "after";

            if (question.id) {
                await upscService.submitAttempt(question.id, attemptType, file, 'audio');
            } else {
                console.warn("Question ID missing, skipping API call (Mock Mode)");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            advanceStep();
        } catch (error) {
            console.error("Voice upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpload = async (imageSrc: string) => {
        setIsUploading(true);
        try {
            // Convert base64 to File
            const res = await fetch(imageSrc);
            const blob = await res.blob();
            const file = new File([blob], "attempt.jpg", { type: "image/jpeg" });

            // Determine attempt type based on current step
            const attemptType = currentStep === "upload_before" ? "before" : "after";

            // Use service to upload
            // Assuming question.id exists. If question is mock, this might fail if backend expects UUID.
            // For now, we'll try-catch and log.
            if (question.id) {
                await upscService.submitAttempt(question.id, attemptType, file, 'image');
            } else {
                console.warn("Question ID missing, skipping API call (Mock Mode)");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            advanceStep();
        } catch (error) {
            console.error("Upload failed:", error);
            // Show error toast here
        } finally {
            setIsUploading(false);
        }
    };

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
    const currentStepConfig = steps[currentStepIndex];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
                <QuestionCard question={question} />

                {/* Dynamic Content based on Step */}
                {(currentStep === "upload_before" || currentStep === "upload_after") && (
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Option 1: Upload Written Answer</h3>
                            <AnswerUpload onCapture={handleUpload} isUploading={isUploading} />
                        </Card>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-300" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-50 px-2 text-slate-500">Or</span>
                            </div>
                        </div>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Option 2: Voice Recall</h3>
                            <VoiceRecorder onRecordingComplete={handleVoiceUpload} isUploading={isUploading} />
                        </Card>
                    </div>
                )}

                {currentStep === "study" && (
                    <Card className="p-6 bg-amber-50 border-amber-200">
                        <h3 className="text-lg font-semibold text-amber-900 mb-4">Study Material</h3>
                        <div className="prose prose-amber">
                            <p>One-pager content would appear here...</p>
                            <ul>
                                <li>Key Concept 1</li>
                                <li>Key Concept 2</li>
                            </ul>
                        </div>
                        <Button onClick={advanceStep} className="mt-4 w-full">
                            I'm done studying
                        </Button>
                    </Card>
                )}

                {currentStep === "complete" && (
                    <Card className="p-8 text-center bg-green-50 border-green-200">
                        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-green-800">Drill Completed!</h2>
                        <p className="text-green-700 mt-2">Your AI analysis report is being generated.</p>
                        <Button className="mt-6" onClick={onSessionComplete}>View Report</Button>
                    </Card>
                )}
            </div>

            {/* Sidebar: Timer & Controls */}
            <div className="space-y-6">
                {currentStepConfig.duration && (
                    <DrillTimer
                        label={currentStepConfig.label}
                        durationSeconds={currentStepConfig.duration}
                        isActive={true}
                        onComplete={handleTimerComplete}
                    />
                )}

                <Card className="p-4 bg-slate-50">
                    <h4 className="font-semibold text-slate-700 mb-2">Session Info</h4>
                    <div className="text-sm text-slate-600 space-y-1">
                        <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="font-medium uppercase text-blue-600">{currentStep.replace("_", " ")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Next:</span>
                            <span className="font-medium">
                                {steps[currentStepIndex + 1]?.label || "Finish"}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Debug Skip Button (Dev only) */}
                <Button variant="ghost" size="sm" onClick={advanceStep} className="w-full text-slate-400">
                    Skip Step (Dev) <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
            </div>
        </div>
    );
};

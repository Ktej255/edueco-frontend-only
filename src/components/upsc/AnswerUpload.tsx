"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, RefreshCw, Check } from "lucide-react";

interface AnswerUploadProps {
    onCapture: (imageSrc: string) => void;
    isUploading: boolean;
}

export const AnswerUpload: React.FC<AnswerUploadProps> = ({
    onCapture,
    isUploading,
}) => {
    const webcamRef = useRef<Webcam>(null);
    const [image, setImage] = useState<string | null>(null);
    const [mode, setMode] = useState<"camera" | "upload">("camera");

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImage(imageSrc);
        }
    }, [webcamRef]);

    const retake = () => {
        setImage(null);
    };

    const confirmUpload = () => {
        if (image) {
            onCapture(image);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-center space-x-4 mb-4">
                <Button
                    variant={mode === "camera" ? "default" : "outline"}
                    onClick={() => setMode("camera")}
                >
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                </Button>
                <Button
                    variant={mode === "upload" ? "default" : "outline"}
                    onClick={() => setMode("upload")}
                >
                    <Upload className="w-4 h-4 mr-2" />
                    File Upload
                </Button>
            </div>

            <Card className="p-4 bg-slate-50 border-dashed border-2 border-slate-300 min-h-[400px] flex flex-col items-center justify-center">
                {mode === "camera" ? (
                    image ? (
                        <div className="relative w-full max-w-md">
                            <img src={image} alt="Captured answer" className="rounded-lg shadow-md" />
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                <Button variant="secondary" onClick={retake}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Retake
                                </Button>
                                <Button onClick={confirmUpload} disabled={isUploading}>
                                    <Check className="w-4 h-4 mr-2" />
                                    {isUploading ? "Uploading..." : "Submit Answer"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative w-full max-w-md">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="rounded-lg shadow-md w-full"
                            />
                            <Button
                                className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                                onClick={capture}
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                Capture
                            </Button>
                        </div>
                    )
                ) : (
                    <div className="text-center p-8">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 mb-4">Drag and drop your scanned answer here</p>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="file-upload"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setImage(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        <label htmlFor="file-upload">
                            <Button variant="outline" asChild>
                                <span>Select File</span>
                            </Button>
                        </label>
                        {image && (
                            <div className="mt-4">
                                <img src={image} alt="Preview" className="max-w-xs mx-auto rounded shadow" />
                                <Button className="mt-4" onClick={confirmUpload} disabled={isUploading}>
                                    Submit Upload
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

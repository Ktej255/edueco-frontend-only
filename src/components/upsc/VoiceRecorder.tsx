import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, Check, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceRecorderProps {
    onRecordingComplete: (audioBlob: Blob) => void;
    isUploading?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, isUploading }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            // Setup Audio Context for Waveform
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            source.connect(analyserRef.current);
            const bufferLength = analyserRef.current.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setIsPaused(false);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

            drawWaveform();

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please ensure permissions are granted.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            if (timerRef.current) clearInterval(timerRef.current);

            // Stop all tracks
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingTime(0);
        setIsRecording(false);
        setIsPaused(false);
    };

    const confirmRecording = () => {
        if (audioBlob) {
            onRecordingComplete(audioBlob);
        }
    };

    const drawWaveform = () => {
        if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            if (!isRecording || isPaused) return;

            animationFrameRef.current = requestAnimationFrame(draw);
            analyserRef.current!.getByteFrequencyData(dataArrayRef.current! as Uint8Array<ArrayBuffer>);

            ctx.fillStyle = '#1C1E4A'; // Deep Indigo Background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / dataArrayRef.current!.length) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < dataArrayRef.current!.length; i++) {
                barHeight = dataArrayRef.current![i] / 2;

                // Gradient for bars
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#2667FF'); // Electric Blue
                gradient.addColorStop(1, '#00C49A'); // Emerald Green

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-md mx-auto bg-[var(--primary-indigo)] rounded-3xl p-8 text-white shadow-2xl border border-white/10">
            {/* Header */}
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold font-display tracking-wide">Voice Answer</h3>
                <p className="text-blue-200 text-sm">Speak clearly. AI will analyze your tone.</p>
            </div>

            {/* Visualizer Area */}
            <div className="relative h-40 bg-black/20 rounded-2xl mb-8 overflow-hidden flex items-center justify-center border border-white/5">
                {isRecording ? (
                    <canvas ref={canvasRef} width={400} height={160} className="w-full h-full" />
                ) : audioUrl ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[var(--accent-green)] rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-[var(--accent-green)] font-bold">Recording Ready</p>
                    </div>
                ) : (
                    <div className="text-white/20 text-4xl font-light">
                        ••• ••• •••
                    </div>
                )}

                {/* Timer Overlay */}
                <div className="absolute top-4 right-4 font-mono text-2xl font-bold text-white drop-shadow-md">
                    {formatTime(recordingTime)}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
                {!isRecording && !audioUrl && (
                    <button
                        onClick={startRecording}
                        className="w-20 h-20 rounded-full bg-[var(--accent-coral)] hover:bg-red-500 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center group"
                    >
                        <Mic className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                    </button>
                )}

                {isRecording && (
                    <button
                        onClick={stopRecording}
                        className="w-20 h-20 rounded-full bg-white hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center group"
                    >
                        <Square className="w-8 h-8 text-[var(--primary-indigo)] group-hover:scale-110 transition-transform fill-current" />
                    </button>
                )}

                {audioUrl && (
                    <>
                        <button
                            onClick={resetRecording}
                            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                            title="Retake"
                        >
                            <RotateCcw className="w-6 h-6 text-white" />
                        </button>

                        <button
                            onClick={() => {
                                const audio = new Audio(audioUrl);
                                audio.play();
                            }}
                            className="w-14 h-14 rounded-full bg-[var(--primary-blue)] hover:bg-blue-600 transition-all flex items-center justify-center shadow-lg shadow-blue-500/30"
                            title="Play Preview"
                        >
                            <Play className="w-6 h-6 text-white ml-1" />
                        </button>

                        <button
                            onClick={confirmRecording}
                            disabled={isUploading}
                            className="w-14 h-14 rounded-full bg-[var(--accent-green)] hover:bg-green-500 transition-all flex items-center justify-center shadow-lg shadow-green-500/30"
                            title="Submit"
                        >
                            <Check className="w-6 h-6 text-white" />
                        </button>
                    </>
                )}
            </div>

            <div className="text-center mt-6 text-xs text-white/40">
                {isRecording ? "Recording in progress..." : "Tap mic to start"}
            </div>
        </div>
    );
}

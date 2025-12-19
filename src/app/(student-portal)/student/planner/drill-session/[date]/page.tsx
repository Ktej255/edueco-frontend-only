"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Clock, Upload, Camera, Image as ImageIcon, CheckCircle,
    ArrowRight, AlertCircle, FileText, Award, Coffee
} from "lucide-react";

// Mock data for 3 questions
const getMockDrillData = (questionNumber: number) => {
    const questions = [
        {
            title: "Indian Polity & Constitution - Question 1",
            text: "Discuss the significance of the Preamble to the Indian Constitution. How does it reflect the aspirations of the founding fathers and guide constitutional interpretation?",
            points: [
                "Explain the key features of the Preamble",
                "Discuss its role in constitutional interpretation",
                "Analyze landmark judgments related to the Preamble",
                "Evaluate its relevance in contemporary India"
            ]
        },
        {
            title: "Indian Polity & Constitution - Question 2",
            text: "Analyze the federal structure of India. How does it differ from other federal systems, and what are the unique features that make it quasi-federal?",
            points: [
                "Explain the federal features of Indian Constitution",
                "Discuss unitary features and their significance",
                "Compare with other federal systems (USA, Canada)",
                "Evaluate the balance between Centre and States"
            ]
        },
        {
            title: "Indian Polity & Constitution - Question 3",
            text: "Examine the role of the Supreme Court as the guardian of the Constitution. Discuss its powers of judicial review and their impact on governance.",
            points: [
                "Explain the concept of judicial review",
                "Discuss landmark cases establishing judicial supremacy",
                "Analyze the doctrine of basic structure",
                "Evaluate judicial activism vs judicial restraint"
            ]
        }
    ];

    return {
        question: questions[questionNumber - 1],
        content: {
            title: `Understanding Topic ${questionNumber}`,
            sections: [
                {
                    heading: "Introduction",
                    text: "This section provides comprehensive coverage of the topic with detailed explanations and examples..."
                },
                {
                    heading: "Key Concepts",
                    text: "Important concepts and principles that form the foundation of this topic..."
                },
                {
                    heading: "Analysis",
                    text: "Critical analysis with reference to landmark cases and constitutional provisions..."
                }
            ]
        },
        modelAnswer: {
            title: "Model Answer",
            text: "A comprehensive model answer demonstrating the ideal structure and content...",
            keyPoints: [
                "Point 1: Detailed explanation with examples",
                "Point 2: Constitutional provisions and their significance",
                "Point 3: Landmark judgments and their impact",
                "Point 4: Contemporary relevance and challenges",
                "Point 5: Conclusion with balanced perspective"
            ]
        }
    };
};

export default function DrillSessionPage() {
    const params = useParams();
    const router = useRouter();
    const date = params.date as string;

    const [currentQuestion, setCurrentQuestion] = useState(1); // 1, 2, or 3
    const [currentStep, setCurrentStep] = useState(1);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    // Separate state for each question's answers
    const [answers, setAnswers] = useState({
        q1: { before: null as string | null, after: null as string | null },
        q2: { before: null as string | null, after: null as string | null },
        q3: { before: null as string | null, after: null as string | null }
    });

    const [showExtensionPopup, setShowExtensionPopup] = useState(false);
    const [contentExtended, setContentExtended] = useState(false);

    // Report reading state
    const [isReadingReport, setIsReadingReport] = useState(false);
    const [reportReadingTimeLeft, setReportReadingTimeLeft] = useState(600); // 10 minutes

    // Break state
    const [showBreakPopup, setShowBreakPopup] = useState(false);
    const [isOnBreak, setIsOnBreak] = useState(false);
    const [breakTimeLeft, setBreakTimeLeft] = useState(600); // 10 minutes

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const drillData = getMockDrillData(currentQuestion);

    // Main timer logic
    useEffect(() => {
        if (!isTimerRunning || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimerComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft, currentStep]);

    // Report reading timer
    useEffect(() => {
        if (!isReadingReport || reportReadingTimeLeft <= 0) return;

        const interval = setInterval(() => {
            setReportReadingTimeLeft((prev) => {
                if (prev <= 1) {
                    handleReportReadingComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isReadingReport, reportReadingTimeLeft]);

    // Break timer
    useEffect(() => {
        if (!isOnBreak || breakTimeLeft <= 0) return;

        const interval = setInterval(() => {
            setBreakTimeLeft((prev) => {
                if (prev <= 1) {
                    handleBreakComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isOnBreak, breakTimeLeft]);

    // Save progress to localStorage
    useEffect(() => {
        localStorage.setItem(`drill_session_${date}`, JSON.stringify({
            currentQuestion,
            currentStep,
            answers,
            timestamp: new Date().toISOString()
        }));
    }, [currentQuestion, currentStep, answers, date]);

    const handleTimerComplete = () => {
        setIsTimerRunning(false);

        if (currentStep === 4 && !contentExtended) {
            setShowExtensionPopup(true);
        } else {
            setTimeout(() => handleNext(), 1000);
        }
    };

    const handleNext = () => {
        if (currentStep < 8) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            setIsTimerRunning(true);

            switch (nextStep) {
                case 2: setTimeLeft(1200); break; // 20 min
                case 4: setTimeLeft(3600); break; // 60 min
                case 5: setTimeLeft(1200); break; // 20 min
                case 7: setTimeLeft(600); break; // 10 min
                default: setTimeLeft(0);
            }
        } else {
            // Completed all 8 steps, show report with reading timer
            startReportReading();
        }
    };

    const startReportReading = () => {
        setIsReadingReport(true);
        setReportReadingTimeLeft(600); // 10 minutes for report reading
    };

    const handleReportReadingComplete = () => {
        setIsReadingReport(false);

        if (currentQuestion < 3) {
            if (currentQuestion === 2) {
                // Show break popup before Question 3
                setShowBreakPopup(true);
            } else {
                // Move to next question
                moveToNextQuestion();
            }
        } else {
            // All 3 questions completed, go to daily summary
            completeDailyDrill();
        }
    };

    const handleBreakDecision = (takeBreak: boolean) => {
        setShowBreakPopup(false);
        if (takeBreak) {
            setIsOnBreak(true);
            setBreakTimeLeft(600); // 10 minutes
        } else {
            moveToNextQuestion();
        }
    };

    const handleBreakComplete = () => {
        setIsOnBreak(false);
        moveToNextQuestion();
    };

    const moveToNextQuestion = () => {
        setCurrentQuestion(prev => prev + 1);
        setCurrentStep(1);
        setTimeLeft(300); // Reset to 5 minutes for question reading
        setIsTimerRunning(true);
        setContentExtended(false);
    };

    const handleExtension = (needMore: boolean) => {
        setShowExtensionPopup(false);
        if (needMore) {
            setTimeLeft(600);
            setContentExtended(true);
            setIsTimerRunning(true);
        } else {
            handleNext();
        }
    };

    const handleImageUpload = (file: File, type: 'before' | 'after') => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageUrl = reader.result as string;
            const questionKey = `q${currentQuestion}` as 'q1' | 'q2' | 'q3';

            setAnswers(prev => ({
                ...prev,
                [questionKey]: {
                    ...prev[questionKey],
                    [type]: imageUrl
                }
            }));

            setTimeout(() => handleNext(), 500);
        };
        reader.readAsDataURL(file);
    };

    const completeDailyDrill = () => {
        // Mark day as completed
        const [year, month, day] = date.split('-');
        const completionKey = `day_${year}_${parseInt(month) - 1}_${parseInt(day)}`;
        localStorage.setItem(completionKey, 'completed');

        // Save all drill data
        localStorage.setItem(`drill_complete_${date}`, JSON.stringify({
            answers,
            completedAt: new Date().toISOString()
        }));

        // Redirect to daily summary
        router.push(`/student/planner/daily-summary/${date}`);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const stepTitles = [
        "Read Question",
        "Before Answer Writing",
        "Upload Before Answer",
        "Study Content",
        "After Answer Writing",
        "Upload After Answer",
        "Review Model Answer",
        "View Report"
    ];

    const currentAnswers = answers[`q${currentQuestion}` as 'q1' | 'q2' | 'q3'];

    // If on break, show break screen
    if (isOnBreak) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center space-y-6">
                        <Coffee className="h-20 w-20 text-green-600 mx-auto" />
                        <h2 className="text-3xl font-bold text-foreground">Take a Break!</h2>
                        <p className="text-muted-foreground">You've completed 2 questions. Relax for a moment before continuing.</p>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Time Remaining</p>
                            <p className="text-5xl font-bold text-green-600">{formatTime(breakTimeLeft)}</p>
                        </div>
                        <Button onClick={handleBreakComplete} size="lg" className="w-full">
                            Skip Break & Continue
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // If reading report, show report reading screen
    if (isReadingReport) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Card className="border-2 border-primary">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Report Reading Time</p>
                                        <p className="text-3xl font-bold text-primary">{formatTime(reportReadingTimeLeft)}</p>
                                    </div>
                                </div>
                                <Button onClick={handleReportReadingComplete} size="lg">
                                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Show the actual report from drill-report page */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-6 w-6 text-yellow-500" />
                                Question {currentQuestion} - Performance Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center space-y-4 p-6 bg-muted/50 rounded-lg">
                                <p className="text-5xl font-bold text-primary">78%</p>
                                <p className="text-muted-foreground">Overall Score</p>
                                <p className="text-2xl font-bold text-green-600">+24% Improvement</p>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                                <p className="text-sm text-gray-800 dark:text-gray-200">
                                    Take your time to review your performance. The next question will begin automatically when the timer expires, or you can continue early.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Question Progress Header */}
                <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Daily Drill Progress</p>
                                <p className="text-2xl font-bold text-foreground">Question {currentQuestion} of 3</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Step {currentStep} of 8</p>
                                <Progress value={(currentStep / 8) * 100} className="h-2 w-32 mt-1" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-foreground">
                                    Question {currentQuestion} - Step {currentStep}
                                </h2>
                                <span className="text-sm text-muted-foreground">
                                    {stepTitles[currentStep - 1]}
                                </span>
                            </div>
                            <Progress value={(currentStep / 8) * 100} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                {/* Timer Card */}
                {[1, 2, 4, 5, 7].includes(currentStep) && (
                    <Card className="border-2 border-primary">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Time Remaining</p>
                                        <p className="text-3xl font-bold text-primary">{formatTime(timeLeft)}</p>
                                    </div>
                                </div>
                                <Button onClick={handleNext} size="lg">
                                    Done <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step Content */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                {currentStep}
                            </span>
                            {stepTitles[currentStep - 1]}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {/* Step 1: Question Display */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                        {drillData.question.title}
                                    </h3>
                                    <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">
                                        {drillData.question.text}
                                    </p>
                                    <div className="space-y-2">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">Key Points to Cover:</p>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                            {drillData.question.points.map((point, idx) => (
                                                <li key={idx}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-yellow-700 dark:text-yellow-500 mt-0.5" />
                                    <p className="text-sm text-gray-800 dark:text-gray-200">
                                        Read the question carefully. You have 5 minutes to understand the requirements before writing your answer.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Before Answer Writing */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                        Write Your Answer (Before Reading Content)
                                    </h3>
                                    <p className="text-gray-800 dark:text-gray-200 mb-4">
                                        Based on your current knowledge, write your answer to the question. You have 20 minutes.
                                    </p>
                                    <div className="space-y-2">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">Instructions:</p>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                            <li>Write your answer on paper</li>
                                            <li>Focus on structure and key points</li>
                                            <li>Use examples where relevant</li>
                                            <li>You'll upload a photo of your answer in the next step</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Upload Before Answer */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <div className="text-center space-y-4">
                                    <Upload className="h-16 w-16 text-primary mx-auto" />
                                    <h3 className="text-xl font-bold text-foreground">
                                        Upload Your Answer
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Take a clear photo of your written answer
                                    </p>
                                </div>

                                {currentAnswers.before ? (
                                    <div className="space-y-4">
                                        <img src={currentAnswers.before} alt="Before Answer" className="w-full rounded-lg border-2 border-green-500" />
                                        <div className="flex gap-4">
                                            <Button onClick={() => {
                                                const questionKey = `q${currentQuestion}` as 'q1' | 'q2' | 'q3';
                                                setAnswers(prev => ({
                                                    ...prev,
                                                    [questionKey]: { ...prev[questionKey], before: null }
                                                }));
                                            }} variant="outline" className="flex-1">
                                                Retake
                                            </Button>
                                            <Button onClick={handleNext} className="flex-1">
                                                Continue <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="h-32 flex-col gap-2"
                                            onClick={() => cameraInputRef.current?.click()}
                                        >
                                            <Camera className="h-8 w-8" />
                                            <span>Take Photo</span>
                                            <input
                                                ref={cameraInputRef}
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                className="hidden"
                                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'before')}
                                            />
                                        </Button>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="h-32 flex-col gap-2"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <ImageIcon className="h-8 w-8" />
                                            <span>Upload from Gallery</span>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'before')}
                                            />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Content Reading */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg space-y-4">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {drillData.content.title}
                                    </h3>
                                    {drillData.content.sections.map((section, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{section.heading}</h4>
                                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{section.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-blue-700 dark:text-blue-400 mt-0.5" />
                                    <p className="text-sm text-gray-800 dark:text-gray-200">
                                        Study this content carefully. You have 60 minutes. After reading, you'll write an improved answer.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 5: After Answer Writing */}
                        {currentStep === 5 && (
                            <div className="space-y-4">
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                        Write Your Improved Answer
                                    </h3>
                                    <p className="text-gray-800 dark:text-gray-200 mb-4">
                                        Now that you've studied the content, write an improved answer. You have 20 minutes.
                                    </p>
                                    <div className="space-y-2">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">Focus on:</p>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                            <li>Incorporating new knowledge from the content</li>
                                            <li>Better structure and flow</li>
                                            <li>More specific examples and facts</li>
                                            <li>Addressing all key points comprehensively</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 6: Upload After Answer */}
                        {currentStep === 6 && (
                            <div className="space-y-4">
                                <div className="text-center space-y-4">
                                    <Upload className="h-16 w-16 text-primary mx-auto" />
                                    <h3 className="text-xl font-bold text-foreground">
                                        Upload Your Improved Answer
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Take a clear photo of your revised answer
                                    </p>
                                </div>

                                {currentAnswers.after ? (
                                    <div className="space-y-4">
                                        <img src={currentAnswers.after} alt="After Answer" className="w-full rounded-lg border-2 border-green-500" />
                                        <div className="flex gap-4">
                                            <Button onClick={() => {
                                                const questionKey = `q${currentQuestion}` as 'q1' | 'q2' | 'q3';
                                                setAnswers(prev => ({
                                                    ...prev,
                                                    [questionKey]: { ...prev[questionKey], after: null }
                                                }));
                                            }} variant="outline" className="flex-1">
                                                Retake
                                            </Button>
                                            <Button onClick={handleNext} className="flex-1">
                                                Continue <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="h-32 flex-col gap-2"
                                            onClick={() => cameraInputRef.current?.click()}
                                        >
                                            <Camera className="h-8 w-8" />
                                            <span>Take Photo</span>
                                            <input
                                                ref={cameraInputRef}
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                className="hidden"
                                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'after')}
                                            />
                                        </Button>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="h-32 flex-col gap-2"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <ImageIcon className="h-8 w-8" />
                                            <span>Upload from Gallery</span>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'after')}
                                            />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 7: Model Answer Review */}
                        {currentStep === 7 && (
                            <div className="space-y-4">
                                <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg space-y-4">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {drillData.modelAnswer.title}
                                    </h3>
                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                        {drillData.modelAnswer.text}
                                    </p>
                                    <div className="space-y-2">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">Key Points:</p>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                            {drillData.modelAnswer.keyPoints.map((point, idx) => (
                                                <li key={idx}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-700 dark:text-green-400 mt-0.5" />
                                    <p className="text-sm text-gray-800 dark:text-gray-200">
                                        Compare this model answer with your responses. Identify areas of improvement.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 8: AI Report */}
                        {currentStep === 8 && (
                            <div className="space-y-6">
                                <div className="text-center space-y-4">
                                    <Award className="h-20 w-20 text-yellow-500 mx-auto" />
                                    <h3 className="text-2xl font-bold text-foreground">
                                        Generating Your Performance Report
                                    </h3>
                                    <p className="text-muted-foreground">
                                        AI is analyzing your answers and creating a detailed report...
                                    </p>
                                </div>
                                <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                                <Button onClick={() => startReportReading()} size="lg" className="w-full">
                                    View Report <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Extension Popup */}
                {showExtensionPopup && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="max-w-md w-full">
                            <CardHeader>
                                <CardTitle>Need More Time?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">
                                    The 60-minute reading time is over. Do you need an additional 10 minutes to complete the content?
                                </p>
                                <div className="flex gap-4">
                                    <Button onClick={() => handleExtension(false)} variant="outline" className="flex-1">
                                        No, I'm Done
                                    </Button>
                                    <Button onClick={() => handleExtension(true)} className="flex-1">
                                        Yes, +10 Minutes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Break Popup */}
                {showBreakPopup && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="max-w-md w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Coffee className="h-6 w-6 text-green-600" />
                                    Take a Break?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">
                                    You've completed 2 questions! Would you like to take a 10-minute break before starting Question 3?
                                </p>
                                <div className="flex gap-4">
                                    <Button onClick={() => handleBreakDecision(false)} variant="outline" className="flex-1">
                                        No, Continue
                                    </Button>
                                    <Button onClick={() => handleBreakDecision(true)} className="flex-1">
                                        <Coffee className="mr-2 h-4 w-4" />
                                        Yes, Take Break
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

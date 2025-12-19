"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

export default function DailySchedulePage() {
    const params = useParams();
    const router = useRouter();
    const date = params.date as string;

    // Parse date
    const [year, month, day] = date.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Mock schedule data - in real app, this would come from API or database
    const scheduleData = {
        topic: "Economy Day 1",
        subtitle: "The Growth Conundrum: Speed, Stability, and Inclusion",
        gs: "GS3",
        activities: [
            { time: "09:00 AM - 09:30 AM", activity: "Reading Material Review", duration: "30 mins" },
            { time: "09:30 AM - 10:30 AM", activity: "Conceptual Understanding", duration: "60 mins" },
            { time: "10:30 AM - 11:00 AM", activity: "Break", duration: "30 mins" },
            { time: "11:00 AM - 12:00 PM", activity: "Practice Questions", duration: "60 mins" },
            { time: "12:00 PM - 01:00 PM", activity: "Answer Writing Practice", duration: "60 mins" },
            { time: "01:00 PM - 02:00 PM", activity: "Lunch Break", duration: "60 mins" },
            { time: "02:00 PM - 03:00 PM", activity: "Revision & Notes Making", duration: "60 mins" },
        ],
        resources: [
            "NCERT Economics Class 11 & 12",
            "Economic Survey (Latest Edition)",
            "Indian Economy by Ramesh Singh",
            "Previous Year Question Papers"
        ],
        keyTopics: [
            "GDP Growth Rate Analysis",
            "Inflation and Price Stability",
            "Inclusive Growth Strategies",
            "Economic Reforms Post-1991",
            "Fiscal and Monetary Policy"
        ]
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Calendar
            </Button>

            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm">{formattedDate}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{scheduleData.topic}</h1>
                {scheduleData.subtitle && (
                    <p className="text-lg text-gray-700 dark:text-gray-300">{scheduleData.subtitle}</p>
                )}
                <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${scheduleData.gs === 'GS1' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        scheduleData.gs === 'GS2' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                            scheduleData.gs === 'GS3' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
                        }`}>
                        {scheduleData.gs}
                    </span>
                </div>
            </div>

            {/* Daily Schedule */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Daily Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {scheduleData.activities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                <div className="min-w-[140px] text-sm font-medium text-muted-foreground">
                                    {activity.time}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">{activity.activity}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Duration: {activity.duration}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Key Topics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Key Topics to Cover
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {scheduleData.keyTopics.map((topic, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-foreground">{topic}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Resources */}
            <Card>
                <CardHeader>
                    <CardTitle>Recommended Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {scheduleData.resources.map((resource, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-primary mt-1">📚</span>
                                <span className="text-foreground">{resource}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Link href={`/student/planner/drill-session/${date}`} className="flex-1">
                    <Button className="w-full" size="lg">
                        Start Today's Drill
                    </Button>
                </Link>
                <Button variant="outline" size="lg">
                    Download Study Material
                </Button>
            </div>
        </div>
    );
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import {
    Calendar,
    Clock,
    Video,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink,
    Users
} from "lucide-react"
import { LiveClassScheduler } from "@/components/features/lms/LiveClassScheduler"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type LiveClass = {
    id: number
    title: string
    description: string
    scheduled_at: string
    duration_minutes: number
    status: "scheduled" | "live" | "ended" | "cancelled"
    meeting_url?: string
    course_id: number
    course_title: string
    attendees_count?: number
}

export default function InstructorLiveClassesPage() {
    const router = useRouter()
    const [classes, setClasses] = useState<LiveClass[]>([])
    const [loading, setLoading] = useState(true)
    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false)
    const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null)

    // Mock courses for the scheduler (in a real app, fetch these)
    const [courses, setCourses] = useState<{ id: number; title: string }[]>([])
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)

    useEffect(() => {
        fetchClasses()
        fetchCourses()
    }, [])

    const fetchClasses = async () => {
        try {
            // Replace with actual API endpoint
            const response = await axios.get("/api/v1/live-classes/instructor/my-classes")
            setClasses(response.data)
        } catch (error) {
            console.error("Failed to fetch classes", error)
            // Mock data for demonstration if API fails
            setClasses([
                {
                    id: 1,
                    title: "Advanced React Patterns",
                    description: "Deep dive into compound components and render props.",
                    scheduled_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
                    duration_minutes: 60,
                    status: "scheduled",
                    course_id: 101,
                    course_title: "React Mastery",
                    attendees_count: 12
                },
                {
                    id: 2,
                    title: "Q&A Session: Backend Architecture",
                    description: "Open floor for questions about microservices.",
                    scheduled_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    duration_minutes: 45,
                    status: "ended",
                    course_id: 102,
                    course_title: "Backend Bootcamp",
                    attendees_count: 45
                },
                {
                    id: 3,
                    title: "Live Coding: Building a Chat App",
                    description: "Real-time coding session.",
                    scheduled_at: new Date().toISOString(), // Now
                    duration_minutes: 90,
                    status: "live",
                    course_id: 101,
                    course_title: "React Mastery",
                    attendees_count: 28
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    const fetchCourses = async () => {
        try {
            const response = await axios.get("/api/v1/courses/my-courses") // Instructor's courses
            setCourses(response.data)
            if (response.data.length > 0) {
                setSelectedCourseId(response.data[0].id)
            }
        } catch (error) {
            // Mock courses
            setCourses([
                { id: 101, title: "React Mastery" },
                { id: 102, title: "Backend Bootcamp" }
            ])
            setSelectedCourseId(101)
        }
    }

    const handleCreateSuccess = () => {
        setIsSchedulerOpen(false)
        fetchClasses()
        toast.success("Live class scheduled successfully")
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this class?")) return
        try {
            await axios.delete(`/api/v1/live-classes/${id}`)
            toast.success("Class cancelled")
            fetchClasses()
        } catch (error) {
            toast.error("Failed to cancel class")
        }
    }

    const handleStartClass = (id: number) => {
        router.push(`/lms/live-class/${id}`)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "live":
                return <Badge className="bg-red-600 animate-pulse">LIVE</Badge>
            case "scheduled":
                return <Badge className="bg-blue-600">Scheduled</Badge>
            case "ended":
                return <Badge className="bg-gray-600">Ended</Badge>
            case "cancelled":
                return <Badge variant="destructive">Cancelled</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-400">Loading live classes...</div>
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Live Classes</h1>
                    <p className="text-gray-400">Manage your upcoming streams and sessions</p>
                </div>
                <Dialog open={isSchedulerOpen} onOpenChange={setIsSchedulerOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-cyan-600 hover:bg-cyan-500">
                            <Plus className="w-4 h-4 mr-2" />
                            Schedule Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
                        {selectedCourseId ? (
                            <LiveClassScheduler
                                courseId={selectedCourseId}
                                onSuccess={handleCreateSuccess}
                                onCancel={() => setIsSchedulerOpen(false)}
                            />
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400 mb-4">You need to create a course first.</p>
                                <Button onClick={() => router.push("/instructor/courses/create")}>
                                    Create Course
                                </Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Upcoming</p>
                                <p className="text-2xl font-bold">
                                    {classes.filter(c => c.status === "scheduled").length}
                                </p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Total Students Reached</p>
                                <p className="text-2xl font-bold">
                                    {classes.reduce((acc, curr) => acc + (curr.attendees_count || 0), 0)}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Hours Streamed</p>
                                <p className="text-2xl font-bold">
                                    {(classes.filter(c => c.status === "ended").reduce((acc, curr) => acc + curr.duration_minutes, 0) / 60).toFixed(1)}
                                </p>
                            </div>
                            <Video className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Classes List */}
            <div className="space-y-4">
                {classes.length === 0 ? (
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Video className="w-16 h-16 text-gray-700 mb-4" />
                            <p className="text-gray-400 text-lg mb-4">No live classes scheduled</p>
                            <Button onClick={() => setIsSchedulerOpen(true)}>
                                Schedule Your First Class
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    classes.map((liveClass) => (
                        <Card key={liveClass.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {getStatusBadge(liveClass.status)}
                                            <h3 className="text-xl font-semibold">{liveClass.title}</h3>
                                        </div>
                                        <p className="text-gray-400 mb-4 line-clamp-2">{liveClass.description}</p>

                                        <div className="flex items-center gap-6 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(liveClass.scheduled_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {new Date(liveClass.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                <span className="text-gray-500">({liveClass.duration_minutes} min)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Video className="w-4 h-4" />
                                                {liveClass.course_title}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 ml-4">
                                        {liveClass.status === "live" && (
                                            <Button
                                                className="bg-red-600 hover:bg-red-700 animate-pulse"
                                                onClick={() => handleStartClass(liveClass.id)}
                                            >
                                                Join Stream
                                            </Button>
                                        )}
                                        {liveClass.status === "scheduled" && (
                                            <Button
                                                variant="outline"
                                                className="border-cyan-600 text-cyan-500 hover:bg-cyan-950"
                                                onClick={() => handleStartClass(liveClass.id)}
                                            >
                                                Start Class
                                            </Button>
                                        )}

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedClass(liveClass)
                                                    setIsSchedulerOpen(true)
                                                }}>
                                                    <Edit className="w-4 h-4 mr-2" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(liveClass.id)}>
                                                    <Trash2 className="w-4 h-4 mr-2" /> Cancel Class
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div >
    )
}

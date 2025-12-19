"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus, Search, Filter, Edit, Trash2, Eye,
    BookOpen, FileText, CheckCircle, XCircle
} from "lucide-react";
import Link from "next/link";

interface Question {
    id: string;
    gs_paper: string;
    topic: string;
    sub_topic?: string;
    question_text: string;
    difficulty: string;
    created_at: string;
    has_content?: boolean;
    has_model_answer?: boolean;
}

export default function AdminQuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterGS, setFilterGS] = useState<string>("");
    const [filterDifficulty, setFilterDifficulty] = useState<string>("");

    useEffect(() => {
        fetchQuestions();
    }, [filterGS, filterDifficulty]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filterGS) params.append("gs_paper", filterGS);
            if (filterDifficulty) params.append("difficulty", filterDifficulty);

            const token = localStorage.getItem("token") || localStorage.getItem("access_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiUrl}/api/v1/admin/drill/questions?${params}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            setQuestions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return;

        try {
            const token = localStorage.getItem("token") || localStorage.getItem("access_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            await fetch(`${apiUrl}/api/v1/admin/drill/questions/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            fetchQuestions();
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    const filteredQuestions = questions.filter(q =>
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Drill Questions Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage questions, content, and model answers
                    </p>
                </div>
                <Link href="/admin/drill/questions/new">
                    <Button size="lg" className="gap-2">
                        <Plus className="h-5 w-5" />
                        Add New Question
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search questions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={filterGS}
                            onChange={(e) => setFilterGS(e.target.value)}
                            className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
                        >
                            <option value="">All GS Papers</option>
                            <option value="GS1">GS1</option>
                            <option value="GS2">GS2</option>
                            <option value="GS3">GS3</option>
                            <option value="GS4">GS4</option>
                        </select>
                        <select
                            value={filterDifficulty}
                            onChange={(e) => setFilterDifficulty(e.target.value)}
                            className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
                        >
                            <option value="">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                        <Button variant="outline" onClick={fetchQuestions}>
                            <Filter className="h-4 w-4 mr-2" />
                            Apply Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Questions</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {questions.length}
                                </p>
                            </div>
                            <BookOpen className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">With Content</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {questions.filter(q => q.has_content).length}
                                </p>
                            </div>
                            <FileText className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">With Model Answer</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {questions.filter(q => q.has_model_answer).length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Incomplete</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {questions.filter(q => !q.has_content || !q.has_model_answer).length}
                                </p>
                            </div>
                            <XCircle className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Questions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Questions List</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : filteredQuestions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No questions found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 text-gray-700 dark:text-gray-300">GS Paper</th>
                                        <th className="text-left p-3 text-gray-700 dark:text-gray-300">Topic</th>
                                        <th className="text-left p-3 text-gray-700 dark:text-gray-300">Question</th>
                                        <th className="text-left p-3 text-gray-700 dark:text-gray-300">Difficulty</th>
                                        <th className="text-left p-3 text-gray-700 dark:text-gray-300">Status</th>
                                        <th className="text-right p-3 text-gray-700 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredQuestions.map((question) => (
                                        <tr key={question.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-sm font-medium ${question.gs_paper === 'GS1' ? 'bg-blue-100 text-blue-700' :
                                                    question.gs_paper === 'GS2' ? 'bg-purple-100 text-purple-700' :
                                                        question.gs_paper === 'GS3' ? 'bg-green-100 text-green-700' :
                                                            'bg-pink-100 text-pink-700'
                                                    }`}>
                                                    {question.gs_paper}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-900 dark:text-gray-100">{question.topic}</td>
                                            <td className="p-3 text-gray-700 dark:text-gray-300 max-w-md truncate">
                                                {question.question_text}
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-sm ${question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {question.difficulty}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-1">
                                                    {question.has_content ? (
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-gray-400" />
                                                    )}
                                                    {question.has_model_answer ? (
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/drill/questions/${question.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/drill/questions/${question.id}/edit`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(question.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

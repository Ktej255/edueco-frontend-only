"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewQuestionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        gs_paper: "GS2",
        topic: "",
        sub_topic: "",
        question_text: "",
        key_points: [""],
        difficulty: "medium",
        content: {
            title: "",
            sections: [{ heading: "", text: "" }],
            estimated_reading_time: 60
        },
        model_answer: {
            title: "",
            answer_text: "",
            key_points: [""]
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create question
            const questionResponse = await fetch("/api/admin/drill/questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gs_paper: formData.gs_paper,
                    topic: formData.topic,
                    sub_topic: formData.sub_topic,
                    question_text: formData.question_text,
                    key_points: formData.key_points.filter(p => p.trim()),
                    difficulty: formData.difficulty
                })
            });

            const question = await questionResponse.json();

            // Create content
            if (formData.content.title) {
                await fetch("/api/admin/drill/content", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        question_id: question.id,
                        ...formData.content,
                        sections: formData.content.sections.filter(s => s.heading || s.text)
                    })
                });
            }

            // Create model answer
            if (formData.model_answer.answer_text) {
                await fetch("/api/admin/drill/model-answers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        question_id: question.id,
                        title: formData.model_answer.title,
                        answer_text: formData.model_answer.answer_text,
                        key_points: formData.model_answer.key_points.filter(p => p.trim())
                    })
                });
            }

            alert("Question created successfully!");
            router.push("/admin/drill/questions");
        } catch (error) {
            console.error("Failed to create question:", error);
            alert("Failed to create question");
        } finally {
            setLoading(false);
        }
    };

    const addKeyPoint = () => {
        setFormData({
            ...formData,
            key_points: [...formData.key_points, ""]
        });
    };

    const removeKeyPoint = (index: number) => {
        setFormData({
            ...formData,
            key_points: formData.key_points.filter((_, i) => i !== index)
        });
    };

    const addContentSection = () => {
        setFormData({
            ...formData,
            content: {
                ...formData.content,
                sections: [...formData.content.sections, { heading: "", text: "" }]
            }
        });
    };

    const removeContentSection = (index: number) => {
        setFormData({
            ...formData,
            content: {
                ...formData.content,
                sections: formData.content.sections.filter((_, i) => i !== index)
            }
        });
    };

    const addModelAnswerKeyPoint = () => {
        setFormData({
            ...formData,
            model_answer: {
                ...formData.model_answer,
                key_points: [...formData.model_answer.key_points, ""]
            }
        });
    };

    const removeModelAnswerKeyPoint = (index: number) => {
        setFormData({
            ...formData,
            model_answer: {
                ...formData.model_answer,
                key_points: formData.model_answer.key_points.filter((_, i) => i !== index)
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/drill/questions">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Create New Question
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Add a new drill question with content and model answer
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    GS Paper *
                                </label>
                                <select
                                    required
                                    value={formData.gs_paper}
                                    onChange={(e) => setFormData({ ...formData, gs_paper: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
                                >
                                    <option value="GS1">GS1</option>
                                    <option value="GS2">GS2</option>
                                    <option value="GS3">GS3</option>
                                    <option value="GS4">GS4</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Topic *
                                </label>
                                <Input
                                    required
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    placeholder="e.g., Indian Polity & Constitution"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Sub-topic
                                </label>
                                <Input
                                    value={formData.sub_topic}
                                    onChange={(e) => setFormData({ ...formData, sub_topic: e.target.value })}
                                    placeholder="e.g., Preamble"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Difficulty *
                            </label>
                            <select
                                required
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Question Text *
                            </label>
                            <Textarea
                                required
                                rows={4}
                                value={formData.question_text}
                                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                                placeholder="Enter the question..."
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Key Points to Cover
                                </label>
                                <Button type="button" size="sm" onClick={addKeyPoint}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Point
                                </Button>
                            </div>
                            {formData.key_points.map((point, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        value={point}
                                        onChange={(e) => {
                                            const newPoints = [...formData.key_points];
                                            newPoints[index] = e.target.value;
                                            setFormData({ ...formData, key_points: newPoints });
                                        }}
                                        placeholder={`Key point ${index + 1}`}
                                    />
                                    {formData.key_points.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeKeyPoint(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Study Content (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Content Title
                            </label>
                            <Input
                                value={formData.content.title}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    content: { ...formData.content, title: e.target.value }
                                })}
                                placeholder="e.g., Understanding the Preamble"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Content Sections
                                </label>
                                <Button type="button" size="sm" onClick={addContentSection}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Section
                                </Button>
                            </div>
                            {formData.content.sections.map((section, index) => (
                                <div key={index} className="border p-4 rounded-md mb-4 bg-gray-50 dark:bg-gray-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Section {index + 1}
                                        </span>
                                        {formData.content.sections.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeContentSection(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <Input
                                        value={section.heading}
                                        onChange={(e) => {
                                            const newSections = [...formData.content.sections];
                                            newSections[index].heading = e.target.value;
                                            setFormData({
                                                ...formData,
                                                content: { ...formData.content, sections: newSections }
                                            });
                                        }}
                                        placeholder="Section heading"
                                        className="mb-2"
                                    />
                                    <Textarea
                                        rows={3}
                                        value={section.text}
                                        onChange={(e) => {
                                            const newSections = [...formData.content.sections];
                                            newSections[index].text = e.target.value;
                                            setFormData({
                                                ...formData,
                                                content: { ...formData.content, sections: newSections }
                                            });
                                        }}
                                        placeholder="Section content"
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Model Answer */}
                <Card>
                    <CardHeader>
                        <CardTitle>Model Answer (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Answer Title
                            </label>
                            <Input
                                value={formData.model_answer.title}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    model_answer: { ...formData.model_answer, title: e.target.value }
                                })}
                                placeholder="e.g., Model Answer: Significance of the Preamble"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Answer Text
                            </label>
                            <Textarea
                                rows={8}
                                value={formData.model_answer.answer_text}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    model_answer: { ...formData.model_answer, answer_text: e.target.value }
                                })}
                                placeholder="Write the model answer..."
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Key Points
                                </label>
                                <Button type="button" size="sm" onClick={addModelAnswerKeyPoint}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Point
                                </Button>
                            </div>
                            {formData.model_answer.key_points.map((point, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        value={point}
                                        onChange={(e) => {
                                            const newPoints = [...formData.model_answer.key_points];
                                            newPoints[index] = e.target.value;
                                            setFormData({
                                                ...formData,
                                                model_answer: { ...formData.model_answer, key_points: newPoints }
                                            });
                                        }}
                                        placeholder={`Key point ${index + 1}`}
                                    />
                                    {formData.model_answer.key_points.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeModelAnswerKeyPoint(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link href="/admin/drill/questions">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? "Creating..." : "Create Question"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

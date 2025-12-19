import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
    question: {
        question_number: number;
        title: string;
        question_text: string;
        marks: number;
        subject: string;
        microtopics: string[];
    };
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
    return (
        <Card className="w-full bg-white shadow-lg border-l-4 border-l-blue-600">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                            {question.subject} • Q{question.question_number}
                        </span>
                        <CardTitle className="text-xl font-bold text-slate-900">
                            {question.title}
                        </CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                        {question.marks} Marks
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="prose prose-slate max-w-none">
                    <p className="text-lg leading-relaxed text-slate-800 font-medium">
                        {question.question_text}
                    </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-2">
                        Focus Microtopics
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {question.microtopics.map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="bg-slate-50">
                                {topic}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

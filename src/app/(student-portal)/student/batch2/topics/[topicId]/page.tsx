import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink, ChevronRight, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    knowledgeNodes,
    getNodeById,
    getChildNodes,
    getParentNodes,
    type KnowledgeNode
} from "@/components/batch2/knowledge-graph-data";

// Generate static params for all nodes
export async function generateStaticParams() {
    return knowledgeNodes.map((node) => ({
        topicId: node.id,
    }));
}

// Generate metadata for each page
export async function generateMetadata({
    params
}: {
    params: Promise<{ topicId: string }>
}): Promise<Metadata> {
    const { topicId } = await params;
    const node = getNodeById(topicId);

    return {
        title: node ? `${node.label} | Sanatana Dharma` : "Topic Not Found",
        description: node?.description || `Learn about ${node?.label} in the Vedic knowledge system`,
    };
}

// Category badge colors
const categoryBadgeColors: Record<string, string> = {
    sruti: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    smriti: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    "prasthana-traya": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
    "sahayak-pathya": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    central: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

// Category display names
const categoryNames: Record<string, string> = {
    sruti: "Śruti (Revealed Knowledge)",
    smriti: "Smṛti (Remembered Tradition)",
    "prasthana-traya": "Prasthāna Traya (Three Foundations)",
    "sahayak-pathya": "Sahāyak Pāṭhya (Auxiliary Sciences)",
    central: "Central Teachings",
};

export default async function TopicPage({
    params
}: {
    params: Promise<{ topicId: string }>
}) {
    const { topicId } = await params;
    const node = getNodeById(topicId);

    if (!node) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-500">Topic Not Found</CardTitle>
                        <CardDescription>
                            The requested topic &quot;{topicId}&quot; could not be found.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/student/batch2">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Knowledge Tree
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Get related nodes
    const childNodes = getChildNodes(node.id)
        .map(id => getNodeById(id))
        .filter((n): n is KnowledgeNode => n !== undefined);

    const parentNodes = getParentNodes(node.id)
        .map(id => getNodeById(id))
        .filter((n): n is KnowledgeNode => n !== undefined);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A1512] via-[#2D2620] to-[#0D0A08] text-white">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/student/batch2" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm">Back to Knowledge Tree</span>
                    </Link>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryBadgeColors[node.category]}`}>
                        {categoryNames[node.category]}
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Title Section */}
                <div className="mb-10">
                    <div
                        className="inline-block w-20 h-20 rounded-full mb-6 flex items-center justify-center text-2xl font-bold shadow-lg"
                        style={{ backgroundColor: node.color }}
                    >
                        <BookOpen className="h-8 w-8" style={{ color: ['#E8B98D', '#D4C4A8', '#D4A5A5'].includes(node.color) ? '#3D3428' : '#FFF8E7' }} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: node.color }}>
                        {node.label}
                    </h1>
                    {node.sublabel && (
                        <p className="text-xl text-white/70 font-serif italic">
                            {node.sublabel}
                        </p>
                    )}
                </div>

                {/* Description */}
                <Card className="bg-white/5 border-white/10 mb-8">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            About
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-white/80 text-lg leading-relaxed">
                            {node.description || `${node.label} is an important concept in the Vedic knowledge system. Detailed content about this topic will be added soon.`}
                        </p>
                    </CardContent>
                </Card>

                {/* Linked Texts (for expandable nodes like Puranas) */}
                {node.linkedTexts && node.linkedTexts.length > 0 && (
                    <Card className="bg-white/5 border-white/10 mb-8">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Related Texts ({node.linkedTexts.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {node.linkedTexts.map((text, i) => (
                                    <li key={i} className="flex items-center gap-2 text-white/70 py-1">
                                        <ChevronRight className="h-4 w-4 text-amber-500" />
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Navigation to Related Nodes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Parent Nodes */}
                    {parentNodes.length > 0 && (
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Derived From</CardTitle>
                                <CardDescription className="text-white/50">Parent concepts in the hierarchy</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {parentNodes.map(parent => (
                                        <Link
                                            key={parent.id}
                                            href={`/student/batch2/topics/${parent.id}`}
                                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                                            style={{ borderLeft: `3px solid ${parent.color}` }}
                                        >
                                            <span>{parent.label}</span>
                                            <ExternalLink className="h-3 w-3 opacity-50" />
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Child Nodes */}
                    {childNodes.length > 0 && (
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Branches</CardTitle>
                                <CardDescription className="text-white/50">Child concepts and derivatives</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {childNodes.map(child => (
                                        <Link
                                            key={child.id}
                                            href={`/student/batch2/topics/${child.id}`}
                                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                                            style={{ borderLeft: `3px solid ${child.color}` }}
                                        >
                                            <span>{child.label}</span>
                                            <ExternalLink className="h-3 w-3 opacity-50" />
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Placeholder for future content */}
                <Card className="bg-amber-500/10 border-amber-500/30 mt-10">
                    <CardContent className="py-6">
                        <p className="text-amber-200/80 text-center text-sm">
                            📚 More detailed content, commentaries, and study materials for <strong>{node.label}</strong> will be added in future updates.
                        </p>
                    </CardContent>
                </Card>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8 mt-20">
                <div className="max-w-5xl mx-auto px-6 text-center text-white/40 text-sm">
                    <p>Part of the Sanatana Dharma Knowledge System • Batch 2</p>
                </div>
            </footer>
        </div>
    );
}

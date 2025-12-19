"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    ReactFlow,
    Controls,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    Panel,
    MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { upanishadNodeTypes } from "./upanishad-nodes";
import { ALL_108_UPANISHADS, STUDY_SEQUENCE } from "./upanishads-108-data";
import { BookOpen, GraduationCap, Sparkles, LayoutGrid } from "lucide-react";

// ==========================================
// MIRO-STYLE CONTAINER COLORS
// ==========================================
const VEDA_CONTAINERS = {
    "Rigveda": { bg: "#F4E1D2", border: "#D4A574", text: "#8B4513" },
    "Shukla Yajurveda": { bg: "#FFF5C4", border: "#E6C200", text: "#8B7500" },
    "Krishna Yajurveda": { bg: "#FFEDD5", border: "#EA8C1E", text: "#A85D00" },
    "Samaveda": { bg: "#D6EAF8", border: "#5DADE2", text: "#1B4F72" },
    "Atharvaveda": { bg: "#D5F5E3", border: "#58D68D", text: "#1D6F42" },
};

// ==========================================
// HORIZONTAL MIRO-STYLE LAYOUT GENERATOR
// ==========================================
function generateMiroLayout() {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Group Upanishads by Veda
    const vedaGroups: Record<string, typeof ALL_108_UPANISHADS> = {};
    ALL_108_UPANISHADS.forEach(u => {
        const key = u.veda;
        if (!vedaGroups[key]) vedaGroups[key] = [];
        vedaGroups[key].push(u);
    });

    const vedaList = Object.keys(vedaGroups);

    // Layout constants - WIDE SPACING for Miro effect
    const CONTAINER_WIDTH = 600;
    const CONTAINER_HEIGHT_PER_NODE = 70;
    const CONTAINER_PADDING = 40;
    const CONTAINER_GAP_X = 200; // Horizontal gap between Veda columns
    const NODE_WIDTH_PRINCIPAL = 180;
    const NODE_WIDTH_MINOR = 140;
    const NODE_HEIGHT = 50;
    const NODE_GAP_Y = 20;

    // Root node - Central "Brahman" source
    nodes.push({
        id: "root",
        type: "vedaHeader",
        position: { x: 0, y: 300 },
        data: {
            vedaName: "॥ उपनिषद् ॥",
            count: ALL_108_UPANISHADS.length,
            subtitle: "108 Sacred Texts",
            isRoot: true,
        },
    });

    let containerX = 350; // Start position for first Veda container

    vedaList.forEach((veda, vedaIdx) => {
        const upanishads = vedaGroups[veda];
        const colors = VEDA_CONTAINERS[veda as keyof typeof VEDA_CONTAINERS] || VEDA_CONTAINERS["Rigveda"];

        // Sort: Principal first
        const sorted = [...upanishads].sort((a, b) => {
            if (a.isPrincipal && !b.isPrincipal) return -1;
            if (!a.isPrincipal && b.isPrincipal) return 1;
            return a.studyOrder - b.studyOrder;
        });

        const principals = sorted.filter(u => u.isPrincipal);
        const minors = sorted.filter(u => !u.isPrincipal);

        // Calculate PRECISE container height based on actual content
        const headerHeight = 50; // Veda header
        const principalRows = Math.ceil(principals.length / 2); // 2 columns for principals
        const minorRows = Math.ceil(minors.length / 3); // 3 columns for minors
        const principalSectionHeight = principalRows * (NODE_HEIGHT + 8); // tighter spacing
        const minorSectionHeight = minorRows * (40 + 8); // smaller minor nodes
        const sectionGap = minors.length > 0 ? 25 : 0;

        // Compact content height with small padding (1.1x multiplier for breathing room)
        const contentHeight = headerHeight + principalSectionHeight + sectionGap + minorSectionHeight;
        const containerHeight = Math.ceil((20 + contentHeight + 20) * 1.1); // 1.1x content

        // Container/Group node for this Veda
        const containerId = `container-${veda.replace(/\s/g, '-')}`;
        nodes.push({
            id: containerId,
            type: "group",
            position: { x: containerX, y: 0 },
            style: {
                width: CONTAINER_WIDTH,
                height: containerHeight,
                backgroundColor: colors.bg,
                borderRadius: 16,
                border: `2px solid ${colors.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            },
            data: {},
        });

        // Veda Header inside container
        const headerY = CONTAINER_PADDING;
        nodes.push({
            id: `header-${veda.replace(/\s/g, '-')}`,
            type: "vedaHeader",
            position: { x: CONTAINER_WIDTH / 2 - 90, y: headerY },
            parentId: containerId,
            extent: "parent",
            data: {
                vedaName: veda,
                count: upanishads.length,
                headerColor: colors.text,
            },
        });

        // Edge from Root to Veda Container Header
        edges.push({
            id: `e-root-${veda}`,
            source: "root",
            target: `header-${veda.replace(/\s/g, '-')}`,
            type: "smoothstep",
            style: { stroke: colors.border, strokeWidth: 3 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 15,
                height: 15,
                color: colors.border,
            },
        });

        // Place Principal Upanishads (LEFT COLUMN - Bold/Solid)
        let nodeY = headerY + 80;
        let leftColX = 30;
        let rightColX = CONTAINER_WIDTH / 2 + 20;

        principals.forEach((u, idx) => {
            const nodeId = u.id;
            const isLeft = idx % 2 === 0;
            const xPos = isLeft ? leftColX : rightColX;

            nodes.push({
                id: nodeId,
                type: "principalNode",
                position: { x: xPos, y: nodeY },
                parentId: containerId,
                extent: "parent",
                data: {
                    ...u,
                    isPrincipal: true,
                    solidStyle: true, // Bold solid fill
                    bgColor: colors.border,
                    textColor: "#FFFFFF",
                },
            });

            // Edge from header to principal
            edges.push({
                id: `e-header-${nodeId}`,
                source: `header-${veda.replace(/\s/g, '-')}`,
                target: nodeId,
                type: "smoothstep",
                style: { stroke: colors.border, strokeWidth: 2 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: colors.border,
                },
            });

            if (!isLeft) nodeY += NODE_HEIGHT + NODE_GAP_Y;
        });

        // Adjust Y for minors
        nodeY += NODE_HEIGHT + NODE_GAP_Y + 20;

        // Place Minor Upanishads (Ghost/Outlined style) - 3 columns
        const COL_COUNT = 3;
        const minorColWidth = (CONTAINER_WIDTH - 60) / COL_COUNT;

        minors.forEach((u, idx) => {
            const col = idx % COL_COUNT;
            const row = Math.floor(idx / COL_COUNT);
            const xPos = 20 + col * minorColWidth;
            const yPos = nodeY + row * (45 + 10);

            nodes.push({
                id: u.id,
                type: "minorNode",
                position: { x: xPos, y: yPos },
                parentId: containerId,
                extent: "parent",
                data: {
                    ...u,
                    isPrincipal: false,
                    ghostStyle: true, // Outlined/ghost
                    borderColor: colors.border,
                    textColor: colors.text,
                },
            });
        });

        // Move to next container column
        containerX += CONTAINER_WIDTH + CONTAINER_GAP_X;
    });

    return { nodes, edges };
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function UpanishadMasterPortal() {
    const router = useRouter();
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => generateMiroLayout(), []);
    const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>(initialEdges);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        // Only navigate for actual Upanishad nodes
        if (!node.id.startsWith("header-") && !node.id.startsWith("container-") && node.id !== "root") {
            router.push(`/student/batch2/upanishads/${node.id}`);
        }
    }, [router]);

    return (
        <div className="w-full">
            {/* Back Navigation */}
            <div className="mb-4">
                <button
                    onClick={() => router.push("/student/batch2")}
                    className="flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Hindu Scriptures
                </button>
            </div>

            {/* Study Guide Header */}
            <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2 mb-4">
                    <GraduationCap className="w-7 h-7" />
                    Recommended Study Sequence
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/60 rounded-lg p-4 border border-amber-200">
                        <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                            <Sparkles className="w-4 h-4" /> Beginner (Start Here)
                        </div>
                        <div className="space-y-1">
                            {STUDY_SEQUENCE.beginner.map((u, i) => (
                                <div key={u.id} className="text-sm text-amber-800 cursor-pointer hover:text-amber-600"
                                    onClick={() => router.push(`/student/batch2/upanishads/${u.id}`)}>
                                    {i + 1}. <span className="font-medium">{u.name}</span> ({u.nameSanskrit})
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4 border border-amber-200">
                        <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                            <BookOpen className="w-4 h-4" /> Intermediate
                        </div>
                        <div className="space-y-1">
                            {STUDY_SEQUENCE.intermediate.map((u, i) => (
                                <div key={u.id} className="text-sm text-amber-800 cursor-pointer hover:text-amber-600"
                                    onClick={() => router.push(`/student/batch2/upanishads/${u.id}`)}>
                                    {i + 4}. <span className="font-medium">{u.name}</span> ({u.nameSanskrit})
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4 border border-amber-200">
                        <div className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                            <GraduationCap className="w-4 h-4" /> Advanced
                        </div>
                        <div className="space-y-1">
                            {STUDY_SEQUENCE.advanced.map((u, i) => (
                                <div key={u.id} className="text-sm text-amber-800 cursor-pointer hover:text-amber-600"
                                    onClick={() => router.push(`/student/batch2/upanishads/${u.id}`)}>
                                    {i + 8}. <span className="font-medium">{u.name}</span> ({u.nameSanskrit})
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Miro-Style Knowledge Map */}
            <div className="w-full h-[800px] rounded-xl overflow-hidden border border-amber-300/50" style={{ background: "#FAFAFA" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    nodeTypes={upanishadNodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.15, minZoom: 0.2, maxZoom: 1 }}
                    minZoom={0.1}
                    maxZoom={1.5}
                    proOptions={{ hideAttribution: true }}
                    defaultEdgeOptions={{
                        type: "smoothstep",
                        animated: false,
                    }}
                >
                    <Background variant={BackgroundVariant.Dots} gap={30} size={1.5} color="rgba(0, 0, 0, 0.05)" />
                    <Controls className="!bg-white/90 !border-gray-200 !rounded-lg !shadow-lg" />

                    <Panel position="top-left" className="!bg-white/95 !rounded-lg !px-4 !py-3 !border !border-gray-200 !shadow-md !m-3">
                        <div className="flex items-center gap-3 text-gray-700">
                            <LayoutGrid className="w-5 h-5 text-amber-600" />
                            <div>
                                <div className="font-bold text-lg">{ALL_108_UPANISHADS.length} Upaniṣads</div>
                                <div className="text-xs text-gray-500">Grouped by Veda • Click to explore</div>
                            </div>
                        </div>
                    </Panel>

                    <Panel position="bottom-center" className="!bg-white/95 !rounded-full !px-5 !py-2 !border !border-gray-200 !shadow-md !text-sm !text-gray-600">
                        🖱️ Drag to pan • Scroll to zoom • Click nodes to study
                    </Panel>
                </ReactFlow>
            </div>
        </div>
    );
}

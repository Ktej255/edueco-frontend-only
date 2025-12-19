"use client";

import React, { useCallback, useMemo, useEffect, useState } from "react";
import {
    ReactFlow,
    Controls,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    ConnectionMode,
    Panel,
    MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./flow-nodes/custom-nodes";
import { getLayoutedElements } from "./hooks/use-dagre-layout";
import { ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";

// ==========================================
// ZONE BACKGROUND COMPONENT
// ==========================================

interface ZoneConfig {
    label: string;
    sublabel: string;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

const ZONES: ZoneConfig[] = [
    { label: "ŚRUTI", sublabel: "श्रुति", color: "rgba(224, 123, 57, 0.08)", x: 0, y: 0, width: 800, height: 400 },
    { label: "SMṚTI", sublabel: "स्मृति", color: "rgba(184, 134, 11, 0.08)", x: 0, y: 400, width: 400, height: 700 },
    { label: "PRASTHĀNA TRAYA", sublabel: "प्रस्थान त्रय", color: "rgba(232, 185, 141, 0.1)", x: 400, y: 200, width: 400, height: 400 },
    { label: "SAHĀYAK PĀṬHYA", sublabel: "सहायक पाठ्य", color: "rgba(74, 144, 164, 0.08)", x: 400, y: 600, width: 400, height: 500 },
];

function ZoneBackgrounds() {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {ZONES.map((zone, i) => (
                <g key={i}>
                    <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.width}
                        height={zone.height}
                        fill={zone.color}
                        rx={16}
                    />
                    <text
                        x={zone.x + 30}
                        y={zone.y + zone.height / 2}
                        fill={zone.color.replace("0.08", "0.5").replace("0.1", "0.5")}
                        fontSize={20}
                        fontWeight={600}
                        transform={`rotate(-90, ${zone.x + 30}, ${zone.y + zone.height / 2})`}
                        textAnchor="middle"
                        style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.15em" }}
                    >
                        {zone.label}
                    </text>
                </g>
            ))}
        </svg>
    );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function VedicKnowledgeGraph() {
    const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
    const [loading, setLoading] = useState(true);

    // Fetch and layout data
    useEffect(() => {
        async function loadData() {
            try {
                const [nodesRes, edgesRes] = await Promise.all([
                    fetch("/data/knowledge-map/nodes.json"),
                    fetch("/data/knowledge-map/edges.json"),
                ]);
                const rawNodes = await nodesRes.json();
                const rawEdges = await edgesRes.json();

                // Transform to React Flow format
                const rfNodes = rawNodes.map((n: any) => ({
                    id: n.id,
                    // Use listNode type for nodes with listItems
                    type: n.listItems && n.listItems.length > 0 ? "listNode" : "vedicNode",
                    position: { x: n.x || 0, y: n.y || 0 },
                    data: {
                        label: n.label,
                        sublabel: n.sublabel,
                        style: n.style,
                        listItems: n.listItems,
                        url: n.url,
                    },
                }));

                // Transform edges with arrow markers
                const rfEdges = rawEdges.map((e: any, i: number) => ({
                    id: `e-${i}`,
                    source: e.source,
                    target: e.target,
                    type: "smoothstep",
                    animated: false,
                    style: { stroke: "rgba(139, 115, 85, 0.6)", strokeWidth: 2 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 16,
                        height: 16,
                        color: "rgba(139, 115, 85, 0.8)",
                    },
                }));

                setNodes(rfNodes);
                setEdges(rfEdges);
            } catch (error) {
                console.error("Failed to load knowledge graph data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [setNodes, setEdges]);

    // Node click handler - internal navigation for student pages
    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        const url = node.data?.url;
        if (url && typeof url === "string") {
            // Use internal navigation for student pages
            if (url.startsWith("/student")) {
                window.location.href = url;
            } else {
                window.open(url, "_blank");
            }
        }
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[900px] flex items-center justify-center bg-[#F8F4EB] rounded-xl border border-amber-200">
                <div className="text-amber-800/60 text-lg animate-pulse">Loading Vedic Knowledge Graph...</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[900px] rounded-xl overflow-hidden border border-amber-300/50" style={{ background: "#F8F4EB" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.2}
                maxZoom={2}
                defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
                proOptions={{ hideAttribution: true }}
            >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(139, 115, 85, 0.1)" />
                <Controls
                    showInteractive={false}
                    className="!bg-amber-50/90 !border-amber-300/50 !rounded-lg !shadow-sm"
                />

                {/* Info Panel */}
                <Panel position="bottom-center" className="!bg-amber-50/80 !rounded-full !px-4 !py-2 !border !border-amber-200/50 !text-xs !text-amber-800/60 flex items-center gap-2">
                    <Move className="h-3 w-3" />
                    <span>Drag to pan • Scroll to zoom • Click node to open details</span>
                </Panel>

                {/* Legend Panel */}
                <Panel position="bottom-right" className="!bg-amber-50/90 !rounded-lg !p-3 !border !border-amber-200/50 !shadow-sm">
                    <div className="text-xs text-amber-800/70 font-medium mb-2">Category Legend</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded" style={{ backgroundColor: "#E07B39" }} />
                            <span className="text-amber-700/70">Śruti (Vedas)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded" style={{ backgroundColor: "#E8B98D" }} />
                            <span className="text-amber-700/70">Upaniṣads</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded" style={{ backgroundColor: "#C94C4C" }} />
                            <span className="text-amber-700/70">Itihāsa</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded" style={{ backgroundColor: "#9B6B9E" }} />
                            <span className="text-amber-700/70">Purāṇas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded" style={{ backgroundColor: "#5A8F7B" }} />
                            <span className="text-amber-700/70">Darśanas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded" style={{ backgroundColor: "#4A90A4" }} />
                            <span className="text-amber-700/70">Vedāṅgas</span>
                        </div>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
}

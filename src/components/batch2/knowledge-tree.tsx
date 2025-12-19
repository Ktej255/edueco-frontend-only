"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Move, Maximize2, ExternalLink, Edit3, Save, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    knowledgeNodes,
    knowledgeEdges,
    getConnectedNodes,
    getNodeById,
    categoryColors,
    axisLabels,
    type KnowledgeNode,
    type KnowledgeEdge,
    type NodeCategory,
    type Point,
} from "./knowledge-graph-data";

// ==========================================
// LAYOUT CONFIGURATION
// ==========================================

const LAYOUT = {
    // Canvas dimensions (logical coordinates)
    width: 1600,
    height: 2400,
    padding: 60,

    // Four vertical bands
    bands: {
        srutiLeft: 80,      // ŚRUTI band starts
        smritiLeft: 100,    // SMṚTI band starts (lower left)
        centralStart: 400,  // Central spine
        centralEnd: 900,
        prasthanaTrayaRight: 1100, // PRASṬHĀNA TRAYA
        sahayakPathyaRight: 1200,  // SAHĀYAK PATHYA
    },

    // Row spacing
    rowHeight: 110,
    columnSpacing: 100,

    // Node sizes in pixels
    nodeSizes: {
        xl: 85,
        lg: 70,
        md: 58,
        sm: 50,
        xs: 42,
    },

    // Font sizes
    fontSizes: {
        xl: 13,
        lg: 11,
        md: 10,
        sm: 9,
        xs: 8,
    },
};

// ==========================================
// POSITION CALCULATOR
// ==========================================

function calculateNodePosition(node: KnowledgeNode): { x: number; y: number } {
    const { bands, rowHeight, columnSpacing, padding } = LAYOUT;

    // Base Y from row
    const y = padding + (node.row * rowHeight);

    // X position based on category and column
    let baseX: number;

    switch (node.category) {
        case "sruti":
            baseX = bands.srutiLeft + 150;
            break;
        case "smriti":
            baseX = bands.smritiLeft + 100;
            break;
        case "prasthana-traya":
            baseX = bands.prasthanaTrayaRight;
            break;
        case "sahayak-pathya":
            baseX = bands.sahayakPathyaRight;
            break;
        case "central":
        default:
            baseX = (bands.centralStart + bands.centralEnd) / 2;
            break;
    }

    // Offset by column
    const x = baseX + (node.column * columnSpacing);

    return { x, y };
}

// ==========================================
// PATH GENERATOR FOR EDGES
// ==========================================

function generatePath(
    from: KnowledgeNode,
    to: KnowledgeNode,
    fromPos: { x: number; y: number },
    toPos: { x: number; y: number },
    edge: KnowledgeEdge,
    customBendPoints?: Point[]
): string {
    const fromSize = LAYOUT.nodeSizes[from.size];
    const toSize = LAYOUT.nodeSizes[to.size];

    // Start from bottom of source node
    const startX = fromPos.x;
    const startY = fromPos.y + fromSize / 2;

    // End at top of target node
    const endX = toPos.x;
    const endY = toPos.y - toSize / 2;

    // Use bend points from edge or custom override
    const bendPoints = customBendPoints || edge.bendPoints;

    // If bend points exist, create a path through them
    if (bendPoints && bendPoints.length > 0) {
        // Create path through all bend points
        let path = `M ${startX} ${startY}`;

        // Use quadratic curves through bend points for smooth path
        if (bendPoints.length === 1) {
            // Single bend point - quadratic bezier
            const bp = bendPoints[0];
            path += ` Q ${bp.x} ${bp.y} ${endX} ${endY}`;
        } else {
            // Multiple bend points - connect with line segments and curves
            for (let i = 0; i < bendPoints.length; i++) {
                const bp = bendPoints[i];
                if (i === 0) {
                    // First segment: curve from start to first bend point
                    const midX = (startX + bp.x) / 2;
                    const midY = (startY + bp.y) / 2;
                    path += ` Q ${startX} ${(startY + midY) / 2} ${midX} ${midY}`;
                    path += ` T ${bp.x} ${bp.y}`;
                } else {
                    // Connect bend points
                    path += ` L ${bp.x} ${bp.y}`;
                }
            }
            // Final curve to end
            const lastBp = bendPoints[bendPoints.length - 1];
            path += ` Q ${lastBp.x} ${(lastBp.y + endY) / 2} ${endX} ${endY}`;
        }

        return path;
    }

    const dx = Math.abs(endX - startX);
    const dy = endY - startY;
    const midY = (startY + endY) / 2;

    // Different curve styles based on edge type
    if (edge.type === "convergence") {
        // Special convergence curves for Prasthana Traya
        const ctrl1Y = startY + dy * 0.4;
        const ctrl2Y = endY - dy * 0.4;
        return `M ${startX} ${startY} C ${startX} ${ctrl1Y} ${endX} ${ctrl2Y} ${endX} ${endY}`;
    }

    if (dx < 50) {
        // Nearly vertical - use quadratic curve
        return `M ${startX} ${startY} Q ${startX} ${midY} ${endX} ${endY}`;
    } else {
        // Diagonal - use cubic bezier
        const ctrlY1 = startY + dy * 0.3;
        const ctrlY2 = endY - dy * 0.3;
        return `M ${startX} ${startY} C ${startX} ${ctrlY1} ${endX} ${ctrlY2} ${endX} ${endY}`;
    }
}

// ==========================================
// NODE COMPONENT
// ==========================================

interface NodeProps {
    node: KnowledgeNode;
    position: { x: number; y: number };
    customSize?: number;
    isHighlighted: boolean;
    isHovered: boolean;
    isEditMode: boolean;
    isDraggingNode: boolean;
    isSelected: boolean;
    onHover: (nodeId: string | null) => void;
    onClick: (node: KnowledgeNode) => void;
    onDragStart: (nodeId: string, e: React.MouseEvent) => void;
    onResizeStart: (nodeId: string, e: React.MouseEvent) => void;
    onSelect: (nodeId: string) => void;
}

function GraphNode({
    node, position, customSize, isHighlighted, isHovered, isEditMode,
    isDraggingNode, isSelected, onHover, onClick, onDragStart, onResizeStart, onSelect
}: NodeProps) {
    const baseSize = LAYOUT.nodeSizes[node.size];
    const size = customSize || baseSize;
    const fontSize = Math.max(8, Math.min(14, size / 5)); // Scale font with size
    const isLarge = size >= 70;

    // Determine text color based on node color brightness
    const lightBackgrounds = ["#E8B98D", "#D4C4A8", "#D4A5A5"];
    const textColor = lightBackgrounds.includes(node.color) ? "#3D3428" : "#FFF8E7";

    // Handle long labels - wrap based on size
    const maxChars = Math.floor(size / 6);
    const displayLabel = node.label.length > maxChars
        ? node.label.slice(0, maxChars - 1) + "…"
        : node.label;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isEditMode) {
            e.stopPropagation();
            onDragStart(node.id, e);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isEditMode) {
            e.stopPropagation();
            onSelect(node.id);
        } else {
            onClick(node);
        }
    };

    return (
        <g
            className={isEditMode ? "cursor-move" : "cursor-pointer"}
            style={{
                transformOrigin: `${position.x}px ${position.y}px`,
                transition: isDraggingNode ? "none" : "transform 0.2s ease-out, opacity 0.2s ease-out",
                transform: isHovered && !isEditMode ? "scale(1.12)" : "scale(1)",
                opacity: isHighlighted || isHovered ? 1 : 0.8,
            }}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
        >
            {/* Selection ring - shown when node is selected in edit mode */}
            {isEditMode && isSelected && (
                <circle
                    cx={position.x}
                    cy={position.y}
                    r={size / 2 + 8}
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth={2}
                    strokeDasharray="5,3"
                />
            )}

            {/* Glow effect for hovered/highlighted nodes */}
            {(isHovered || isHighlighted) && (
                <circle
                    cx={position.x}
                    cy={position.y}
                    r={size / 2 + 6}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={2}
                    opacity={0.4}
                    style={{ filter: "blur(4px)" }}
                />
            )}

            {/* Main node circle */}
            <circle
                cx={position.x}
                cy={position.y}
                r={size / 2}
                fill={node.color}
                stroke={isSelected ? "#FFD700" : isHovered ? "#FFD700" : "rgba(255,255,255,0.25)"}
                strokeWidth={isLarge ? 3 : 2}
                style={{
                    filter: isLarge ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : undefined,
                    transition: "stroke 0.2s ease-out",
                }}
            />

            {/* Node label */}
            <text
                x={position.x}
                y={position.y + (node.sublabel && isLarge ? -4 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={textColor}
                fontSize={fontSize}
                fontWeight={isLarge ? 600 : 500}
                className="pointer-events-none select-none"
                style={{ fontFamily: "'Poppins', 'Noto Sans Devanagari', sans-serif" }}
            >
                {displayLabel}
            </text>

            {/* Sublabel for large nodes */}
            {node.sublabel && isLarge && (
                <text
                    x={position.x}
                    y={position.y + size / 2 + 14}
                    textAnchor="middle"
                    fill="rgba(255,248,232,0.7)"
                    fontSize={8}
                    className="pointer-events-none select-none"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    {node.sublabel}
                </text>
            )}

            {/* Resize handle - only shown when selected in edit mode */}
            {isEditMode && isSelected && (
                <g
                    style={{ cursor: "se-resize" }}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        onResizeStart(node.id, e);
                    }}
                >
                    <circle
                        cx={position.x + size / 2 - 5}
                        cy={position.y + size / 2 - 5}
                        r={8}
                        fill="#4CAF50"
                        stroke="#fff"
                        strokeWidth={2}
                    />
                    <text
                        x={position.x + size / 2 - 5}
                        y={position.y + size / 2 - 4}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#fff"
                        fontSize={10}
                        fontWeight="bold"
                    >
                        ↘
                    </text>
                </g>
            )}

            {/* External link indicator */}
            {isHovered && !isEditMode && (
                <g transform={`translate(${position.x + size / 2 - 8}, ${position.y - size / 2 - 8})`}>
                    <circle cx={8} cy={8} r={10} fill="rgba(0,0,0,0.7)" />
                    <ExternalLink x={2} y={2} width={12} height={12} color="#FFD700" />
                </g>
            )}
        </g>
    );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

// Role types for access control
export type UserRole = "admin" | "student";

interface KnowledgeTreeProps {
    userRole?: UserRole; // Default to "student" for safety
}

export default function KnowledgeTree({ userRole = "student" }: KnowledgeTreeProps) {
    const isAdmin = userRole === "admin";
    const [zoom, setZoom] = useState(0.55);
    const [pan, setPan] = useState({ x: 50, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Edit mode state
    const [isEditMode, setIsEditMode] = useState(false);
    const [customPositions, setCustomPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
    const [nodeDragStart, setNodeDragStart] = useState({ x: 0, y: 0 });
    const [nodeDragOffset, setNodeDragOffset] = useState({ x: 0, y: 0 });

    // Bend points state - key is "fromId-toId"
    const [customBendPoints, setCustomBendPoints] = useState<Map<string, Point[]>>(new Map());
    const [draggingBendPoint, setDraggingBendPoint] = useState<{ edgeKey: string; index: number } | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

    // Node sizing state
    const [customSizes, setCustomSizes] = useState<Map<string, number>>(new Map());
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [resizingNodeId, setResizingNodeId] = useState<string | null>(null);
    const [resizeStartSize, setResizeStartSize] = useState(0);
    const [resizeStartY, setResizeStartY] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Helper to get edge key
    const getEdgeKey = (from: string, to: string) => `${from}-${to}`;



    // Save changes to backend
    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            // Prepare data payload
            const positionsData: Record<string, { x: number; y: number }> = {};
            nodePositions.forEach((pos, id) => {
                positionsData[id] = pos;
            });

            const bendPointsData: Record<string, Point[]> = {};
            customBendPoints.forEach((points, key) => {
                bendPointsData[key] = points;
            });

            const sizesData: Record<string, number> = {};
            customSizes.forEach((size, id) => {
                sizesData[id] = size;
            });

            // Call API
            const response = await fetch('/api/knowledge-atlas/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nodes: positionsData,
                    bendPoints: bendPointsData,
                    sizes: sizesData
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert("Layout saved successfully! Changes are now permanent.");
                setIsEditMode(false);
            } else {
                alert(`Failed to save layout: ${result.message}`);
            }
        } catch (error) {
            console.error("Error saving layout:", error);
            alert("Error saving layout. Check console for details.");
        } finally {
            setIsSaving(false);
        }
    };

    // Get bend points for an edge (custom or from edge data)
    const getBendPoints = useCallback((edge: KnowledgeEdge): Point[] => {
        const key = getEdgeKey(edge.from, edge.to);
        return customBendPoints.get(key) || edge.bendPoints || [];
    }, [customBendPoints]);

    // Calculate default node positions
    const defaultPositions = useMemo(() => {
        const positions = new Map<string, { x: number; y: number }>();
        knowledgeNodes.forEach(node => {
            positions.set(node.id, calculateNodePosition(node));
        });
        return positions;
    }, []);

    // Get current node positions (custom or default)
    const nodePositions = useMemo(() => {
        const positions = new Map<string, { x: number; y: number }>();
        knowledgeNodes.forEach(node => {
            const customPos = customPositions.get(node.id);
            if (customPos) {
                positions.set(node.id, customPos);
            } else {
                positions.set(node.id, calculateNodePosition(node));
            }
        });
        return positions;
    }, [customPositions]);

    // Get highlighted nodes (connected to hovered node)
    const highlightedNodes = useMemo(() => {
        if (!hoveredNode) return new Set<string>();
        const connected = getConnectedNodes(hoveredNode);
        return new Set([hoveredNode, ...connected]);
    }, [hoveredNode]);

    // Zoom controls
    const handleZoomIn = () => setZoom(z => Math.min(z + 0.15, 2.5));
    const handleZoomOut = () => setZoom(z => Math.max(z - 0.15, 0.25));
    const handleReset = () => {
        setZoom(0.55);
        setPan({ x: 50, y: 20 });
    };
    const handleFitToView = () => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            const scaleX = (width - 100) / LAYOUT.width;
            const scaleY = (height - 100) / LAYOUT.height;
            setZoom(Math.min(scaleX, scaleY, 0.8));
            setPan({ x: 50, y: 20 });
        }
    };

    // Reset positions to default
    const handleResetPositions = () => {
        setCustomPositions(new Map());
        setCustomBendPoints(new Map());
        setCustomSizes(new Map());
        setSelectedEdge(null);
        setSelectedNode(null);
    };

    // Export positions as JSON for saving
    const handleExportPositions = () => {
        const positionsData: Record<string, { x: number; y: number }> = {};
        nodePositions.forEach((pos, id) => {
            positionsData[id] = pos;
        });

        const bendPointsData: Record<string, Point[]> = {};
        customBendPoints.forEach((points, key) => {
            bendPointsData[key] = points;
        });

        const sizesData: Record<string, number> = {};
        customSizes.forEach((size, id) => {
            sizesData[id] = size;
        });

        const exportData = {
            nodes: positionsData,
            bendPoints: bendPointsData,
            sizes: sizesData,
            exportedAt: new Date().toISOString(),
        };

        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "knowledge-atlas-layout.json";
        a.click();
        URL.revokeObjectURL(url);

        // Also log to console for easy copy
        console.log("📍 Current layout:", exportData);
        alert("Layout exported! Check console for JSON data.");
    };

    // Add bend point to edge
    const handleAddBendPoint = useCallback((edgeKey: string, fromPos: Point, toPos: Point) => {
        const midPoint: Point = {
            x: (fromPos.x + toPos.x) / 2,
            y: (fromPos.y + toPos.y) / 2 - 30, // Offset slightly for visibility
        };

        setCustomBendPoints(prev => {
            const next = new Map(prev);
            const existing = next.get(edgeKey) || [];
            next.set(edgeKey, [...existing, midPoint]);
            return next;
        });
    }, []);

    // Bend point drag start
    const handleBendPointDragStart = useCallback((edgeKey: string, index: number, e: React.MouseEvent) => {
        if (!isEditMode) return;
        e.stopPropagation();
        setDraggingBendPoint({ edgeKey, index });
    }, [isEditMode]);

    // Edge click handler - select edge for adding bend points
    const handleEdgeClick = useCallback((edgeKey: string, e: React.MouseEvent) => {
        if (!isEditMode) return;
        e.stopPropagation();
        setSelectedEdge(prev => prev === edgeKey ? null : edgeKey);
    }, [isEditMode]);

    // Node drag handlers
    const handleNodeDragStart = useCallback((nodeId: string, e: React.MouseEvent) => {
        if (!isEditMode) return;

        const currentPos = nodePositions.get(nodeId);
        if (!currentPos) return;

        setDraggingNodeId(nodeId);
        const svgPoint = {
            x: (e.clientX - pan.x) / zoom,
            y: (e.clientY - pan.y) / zoom
        };
        setNodeDragOffset({
            x: currentPos.x - svgPoint.x,
            y: currentPos.y - svgPoint.y
        });
    }, [isEditMode, nodePositions, pan, zoom]);

    // Pan handlers (modified for node dragging)
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0 && !draggingNodeId) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const svgPoint = {
            x: (e.clientX - pan.x) / zoom,
            y: (e.clientY - pan.y) / zoom
        };

        // Handle bend point dragging
        if (draggingBendPoint && isEditMode) {
            setCustomBendPoints(prev => {
                const next = new Map(prev);
                const points = [...(next.get(draggingBendPoint.edgeKey) || [])];
                points[draggingBendPoint.index] = svgPoint;
                next.set(draggingBendPoint.edgeKey, points);
                return next;
            });
            return;
        }

        // Handle node dragging
        if (draggingNodeId && isEditMode) {
            const newPos = {
                x: svgPoint.x + nodeDragOffset.x,
                y: svgPoint.y + nodeDragOffset.y
            };

            setCustomPositions(prev => {
                const next = new Map(prev);
                next.set(draggingNodeId, newPos);
                return next;
            });
            return;
        }

        // Handle node resizing
        if (resizingNodeId && isEditMode) {
            const deltaY = (e.clientY - resizeStartY) / zoom;
            const newSize = Math.max(30, Math.min(150, resizeStartSize + deltaY));

            setCustomSizes(prev => {
                const next = new Map(prev);
                next.set(resizingNodeId, newSize);
                return next;
            });
            return;
        }

        // Handle pan dragging
        if (isDragging) {
            setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggingNodeId(null);
        setDraggingBendPoint(null);
        setResizingNodeId(null);
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.08 : 0.08;
            setZoom(z => Math.max(0.25, Math.min(2.5, z + delta)));
        }
    };

    // Node selection handler
    const handleNodeSelect = useCallback((nodeId: string) => {
        setSelectedNode(prev => prev === nodeId ? null : nodeId);
        setSelectedEdge(null); // Deselect edge when node is selected
    }, []);

    // Resize start handler
    const handleResizeStart = useCallback((nodeId: string, e: React.MouseEvent) => {
        if (!isEditMode) return;

        const node = knowledgeNodes.find(n => n.id === nodeId);
        if (!node) return;

        const baseSize = LAYOUT.nodeSizes[node.size];
        const currentSize = customSizes.get(nodeId) || baseSize;

        setResizingNodeId(nodeId);
        setResizeStartSize(currentSize);
        setResizeStartY(e.clientY);
    }, [isEditMode, customSizes]);

    // Node click handler - opens page in new tab
    const handleNodeClick = useCallback((node: KnowledgeNode) => {
        if (isEditMode) return; // Don't open in edit mode
        const topicUrl = `/student/batch2/topics/${node.id}`;
        window.open(topicUrl, '_blank');
    }, [isEditMode]);

    // Node hover handler
    const handleNodeHover = useCallback((nodeId: string | null) => {
        setHoveredNode(nodeId);
    }, []);

    return (
        <div className="relative w-full h-[750px] bg-gradient-to-br from-[#1A1512] via-[#2D2620] to-[#0D0A08] rounded-xl overflow-hidden border border-white/10">

            {/* Section Labels - Four Axes */}
            <div
                className="absolute left-3 top-[15%] z-10 text-center transform -rotate-90 origin-left"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
                <span className="text-amber-600/60 font-serif text-sm tracking-[0.25em] font-semibold">
                    {axisLabels.sruti.label}
                </span>
            </div>

            <div
                className="absolute left-3 bottom-[20%] z-10 text-center transform -rotate-90 origin-left"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
                <span className="text-amber-700/60 font-serif text-sm tracking-[0.25em] font-semibold">
                    {axisLabels.smriti.label}
                </span>
            </div>

            <div
                className="absolute right-3 top-[20%] z-10 text-center transform rotate-90 origin-right"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
                <span className="text-orange-500/60 font-serif text-xs tracking-[0.2em] font-semibold">
                    {axisLabels["prasthana-traya"].label}
                </span>
            </div>

            <div
                className="absolute right-3 bottom-[25%] z-10 text-center transform rotate-90 origin-right"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
                <span className="text-blue-400/60 font-serif text-xs tracking-[0.2em] font-semibold">
                    {axisLabels["sahayak-pathya"].label}
                </span>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                <Button size="sm" variant="ghost" onClick={handleZoomIn} className="text-white hover:bg-white/10" title="Zoom In">
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="text-center text-xs text-white/60 font-mono">{Math.round(zoom * 100)}%</div>
                <Button size="sm" variant="ghost" onClick={handleZoomOut} className="text-white hover:bg-white/10" title="Zoom Out">
                    <ZoomOut className="h-4 w-4" />
                </Button>
                <div className="w-full h-px bg-white/10" />
                <Button size="sm" variant="ghost" onClick={handleFitToView} className="text-white hover:bg-white/10" title="Fit to View">
                    <Maximize2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleReset} className="text-white hover:bg-white/10" title="Reset View">
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>

            {/* Edit Mode Controls - Only for Admin */}
            {isAdmin && (
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <Button
                        size="sm"
                        variant={isEditMode ? "default" : "outline"}
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={isEditMode
                            ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
                            : "bg-black/50 backdrop-blur-sm text-white border-white/20 hover:bg-white/10"
                        }
                        title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
                    >
                        {isEditMode ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                        {isEditMode ? "Exit Edit" : "Edit Layout"}
                    </Button>

                    {isEditMode && (
                        <div className="flex flex-col gap-2 bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-amber-500/30">
                            <div className="text-xs text-amber-400 font-medium px-1">Edit Mode Active</div>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className="text-amber-400 hover:bg-amber-500/20 justify-start"
                                title="Finalize and save changes to disk"
                            >
                                {isSaving ? (
                                    <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                {isSaving ? "Saving..." : "Finalize Layout"}
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleExportPositions}
                                className="text-green-400 hover:bg-green-500/20 justify-start"
                                title="Export current positions"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export Positions
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleResetPositions}
                                className="text-red-400 hover:bg-red-500/20 justify-start"
                                title="Reset all positions to default"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset All
                            </Button>
                            <div className="text-xs text-white/50 px-1 mt-1">
                                Drag nodes to reposition
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-xs text-white/50 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <Move className="h-3 w-3" />
                <span>
                    {isEditMode
                        ? "Drag nodes to reposition • Click edge to select & add bend points • Drag resizing handle"
                        : isAdmin
                            ? "Drag to pan • Ctrl+Scroll to zoom • Click 'Edit Layout' to customize"
                            : "Drag to pan • Ctrl+Scroll to zoom • Click node to open details"
                    }
                </span>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <div className="text-xs text-white/70 font-medium mb-2">Category Legend</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E07B39' }} />
                        <span className="text-white/60">Śruti (Vedas)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E8B98D' }} />
                        <span className="text-white/60">Upaniṣads</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C94C4C' }} />
                        <span className="text-white/60">Itihāsa</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#9B6B9E' }} />
                        <span className="text-white/60">Purāṇas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5A8F7B' }} />
                        <span className="text-white/60">Darśanas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4A90A4' }} />
                        <span className="text-white/60">Vedāṅgas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#9370DB' }} />
                        <span className="text-white/60">Bhāṣyas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#708090' }} />
                        <span className="text-white/60">Prakaraṇa</span>
                    </div>
                </div>
            </div>

            {/* Hovered Node Info */}
            {hoveredNode && (
                <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-white/20 max-w-xs">
                    {(() => {
                        const node = getNodeById(hoveredNode);
                        if (!node) return null;
                        return (
                            <>
                                <h3 className="text-white font-semibold text-sm">{node.label}</h3>
                                {node.sublabel && (
                                    <p className="text-white/70 text-xs mt-0.5">{node.sublabel}</p>
                                )}
                                {node.description && (
                                    <p className="text-white/60 text-xs mt-1 leading-relaxed">{node.description}</p>
                                )}
                                <p className="text-amber-400/80 text-xs mt-2 flex items-center gap-1">
                                    <ExternalLink className="h-3 w-3" /> Click to open in new tab
                                </p>
                            </>
                        );
                    })()}
                </div>
            )}

            {/* Main Canvas */}
            <div
                ref={containerRef}
                className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}
                    style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: "top left",
                    }}
                >
                    {/* Definitions */}
                    <defs>
                        {/* Arrow markers */}
                        <marker
                            id="arrowhead"
                            markerWidth="8"
                            markerHeight="8"
                            refX="7"
                            refY="4"
                            orient="auto"
                        >
                            <path d="M0,0 L8,4 L0,8 Z" fill="rgba(196,163,90,0.6)" />
                        </marker>
                        <marker
                            id="arrowhead-highlight"
                            markerWidth="8"
                            markerHeight="8"
                            refX="7"
                            refY="4"
                            orient="auto"
                        >
                            <path d="M0,0 L8,4 L0,8 Z" fill="#FFD700" />
                        </marker>

                        {/* Glow filter */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Category background gradients */}
                        <linearGradient id="srutiBg" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(224,123,57,0.08)" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                        <linearGradient id="smritiBg" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(184,134,11,0.06)" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                        <linearGradient id="prasthanaTraya" x1="100%" y1="0%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="rgba(232,185,141,0.08)" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                        <linearGradient id="sahayakPathya" x1="100%" y1="0%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="rgba(74,144,164,0.08)" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>

                    {/* Category background bands */}
                    <rect x="0" y="0" width="350" height="600" fill="url(#srutiBg)" />
                    <rect x="0" y="500" width="350" height={LAYOUT.height - 500} fill="url(#smritiBg)" />
                    <rect x={LAYOUT.width - 350} y="200" width="350" height="700" fill="url(#prasthanaTraya)" />
                    <rect x={LAYOUT.width - 350} y="800" width="350" height={LAYOUT.height - 800} fill="url(#sahayakPathya)" />

                    {/* Draw edges */}
                    <g>
                        {knowledgeEdges.map((edge, i) => {
                            const fromNode = getNodeById(edge.from);
                            const toNode = getNodeById(edge.to);
                            if (!fromNode || !toNode) return null;

                            const fromPos = nodePositions.get(edge.from);
                            const toPos = nodePositions.get(edge.to);
                            if (!fromPos || !toPos) return null;

                            const edgeKey = getEdgeKey(edge.from, edge.to);
                            const bendPoints = getBendPoints(edge);
                            const isHighlighted = highlightedNodes.has(edge.from) && highlightedNodes.has(edge.to);
                            const isConvergence = edge.type === "convergence";
                            const isSelected = selectedEdge === edgeKey;

                            return (
                                <g key={`edge-group-${i}`}>
                                    {/* The actual path */}
                                    <path
                                        d={generatePath(fromNode, toNode, fromPos, toPos, edge, customBendPoints.get(edgeKey))}
                                        stroke={isSelected ? "#FFD700" : isHighlighted ? "#FFD700" : isConvergence ? "rgba(196,163,90,0.6)" : "rgba(196,163,90,0.35)"}
                                        strokeWidth={isSelected ? 3 : isHighlighted ? 2.5 : isConvergence ? 2 : 1.5}
                                        fill="none"
                                        markerEnd={isHighlighted || isSelected ? "url(#arrowhead-highlight)" : "url(#arrowhead)"}
                                        style={{
                                            transition: "stroke 0.2s ease-out, stroke-width 0.2s ease-out",
                                            cursor: isEditMode ? "pointer" : "default",
                                        }}
                                        onClick={(e) => handleEdgeClick(edgeKey, e)}
                                    />

                                    {/* Invisible wider path for easier clicking in edit mode */}
                                    {isEditMode && (
                                        <path
                                            d={generatePath(fromNode, toNode, fromPos, toPos, edge, customBendPoints.get(edgeKey))}
                                            stroke="transparent"
                                            strokeWidth={15}
                                            fill="none"
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => handleEdgeClick(edgeKey, e)}
                                        />
                                    )}

                                    {/* Bend point handles - only in edit mode and when edge is selected */}
                                    {isEditMode && isSelected && bendPoints.map((bp, bpIndex) => (
                                        <g key={`bp-${bpIndex}`}>
                                            <circle
                                                cx={bp.x}
                                                cy={bp.y}
                                                r={8}
                                                fill="#FFD700"
                                                stroke="#000"
                                                strokeWidth={2}
                                                style={{ cursor: "move" }}
                                                onMouseDown={(e) => handleBendPointDragStart(edgeKey, bpIndex, e)}
                                            />
                                        </g>
                                    ))}

                                    {/* Add bend point button - shown when edge is selected */}
                                    {isEditMode && isSelected && (
                                        <g
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleAddBendPoint(edgeKey, fromPos, toPos)}
                                        >
                                            <circle
                                                cx={(fromPos.x + toPos.x) / 2}
                                                cy={(fromPos.y + toPos.y) / 2}
                                                r={12}
                                                fill="#4CAF50"
                                                stroke="#fff"
                                                strokeWidth={2}
                                            />
                                            <text
                                                x={(fromPos.x + toPos.x) / 2}
                                                y={(fromPos.y + toPos.y) / 2 + 1}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fill="#fff"
                                                fontSize={16}
                                                fontWeight="bold"
                                            >
                                                +
                                            </text>
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                    </g>

                    {/* Draw nodes */}
                    <g>
                        {knowledgeNodes.map(node => {
                            const position = nodePositions.get(node.id);
                            if (!position) return null;

                            return (
                                <GraphNode
                                    key={node.id}
                                    node={node}
                                    position={position}
                                    customSize={customSizes.get(node.id)}
                                    isHighlighted={highlightedNodes.has(node.id)}
                                    isHovered={hoveredNode === node.id}
                                    isEditMode={isEditMode}
                                    isDraggingNode={draggingNodeId === node.id}
                                    isSelected={selectedNode === node.id}
                                    onHover={handleNodeHover}
                                    onClick={handleNodeClick}
                                    onDragStart={handleNodeDragStart}
                                    onResizeStart={handleResizeStart}
                                    onSelect={handleNodeSelect}
                                />
                            );
                        })}
                    </g>
                </svg>
            </div>
        </div>
    );
}

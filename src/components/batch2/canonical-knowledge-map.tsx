"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Move, Maximize2, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface MapNode {
    id: string;
    label: string;
    sublabel?: string;
    description?: string;
    category: string;
    x: number;
    y: number;
    width: number;
    height: number;
    url: string;
    style: string;
    listItems?: string[];
}

interface MapEdge {
    source: string;
    target: string;
    type: string;
}

// ==========================================
// STYLE CONFIGURATION - Academic Manuscript Theme
// ==========================================

const STYLES = {
    background: "#F8F4EB",
    canvasWidth: 1800,
    canvasHeight: 2400,

    nodeStyles: {
        "primary": {
            bg: "linear-gradient(135deg, #C4A35A 0%, #B8963D 100%)",
            border: "#8B7355",
            text: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 700,
            padding: "12px 18px"
        },
        "secondary": {
            bg: "linear-gradient(135deg, #E07B39 0%, #D06A28 100%)",
            border: "#C66830",
            text: "#FFFFFF",
            fontSize: "13px",
            fontWeight: 600,
            padding: "10px 16px"
        },
        "veda": {
            bg: "#E07B39",
            border: "#C66830",
            text: "#FFFFFF",
            fontSize: "11px",
            fontWeight: 600,
            padding: "8px 12px"
        },
        "section": {
            bg: "#D4C4A8",
            border: "#B8A88C",
            text: "#3D3428",
            fontSize: "11px",
            fontWeight: 600,
            padding: "8px 14px"
        },
        "section-header": {
            bg: "linear-gradient(135deg, #B8860B 0%, #A07605 100%)",
            border: "#8B6914",
            text: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 700,
            padding: "10px 14px"
        },
        "text": {
            bg: "#EDE6D6",
            border: "#C4B896",
            text: "#3D3428",
            fontSize: "10px",
            fontWeight: 500,
            padding: "6px 10px"
        },
        "text-small": {
            bg: "#F0EBE0",
            border: "#D4CFC0",
            text: "#5A5040",
            fontSize: "9px",
            fontWeight: 500,
            padding: "5px 8px"
        },
        "prasthana": {
            bg: "linear-gradient(135deg, #E8B98D 0%, #DBA77A 100%)",
            border: "#C99F6D",
            text: "#3D3428",
            fontSize: "12px",
            fontWeight: 600,
            padding: "10px 14px"
        },
        "upanishad": {
            bg: "#F0E6D8",
            border: "#D4C4A8",
            text: "#5A5040",
            fontSize: "9px",
            fontWeight: 500,
            padding: "5px 8px"
        },
        "smriti": {
            bg: "#B8860B",
            border: "#8B6914",
            text: "#FFFFFF",
            fontSize: "11px",
            fontWeight: 600,
            padding: "8px 12px"
        },
        "itihas": {
            bg: "linear-gradient(135deg, #C94C4C 0%, #B83C3C 100%)",
            border: "#A93C3C",
            text: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 600,
            padding: "10px 14px"
        },
        "itihas-text": {
            bg: "#E8D4D4",
            border: "#C94C4C",
            text: "#6B3030",
            fontSize: "10px",
            fontWeight: 500,
            padding: "6px 10px"
        },
        "purana": {
            bg: "linear-gradient(135deg, #9B6B9E 0%, #8B5B8E 100%)",
            border: "#7B4B7E",
            text: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 600,
            padding: "10px 14px"
        },
        "darshana-header": {
            bg: "linear-gradient(135deg, #5A8F7B 0%, #4A7F6B 100%)",
            border: "#3A6F5B",
            text: "#FFFFFF",
            fontSize: "13px",
            fontWeight: 700,
            padding: "10px 16px"
        },
        "darshana": {
            bg: "#D8E8E0",
            border: "#5A8F7B",
            text: "#2A4A3B",
            fontSize: "10px",
            fontWeight: 500,
            padding: "6px 10px"
        },
        "vedanga-header": {
            bg: "linear-gradient(135deg, #4A90A4 0%, #3A8094 100%)",
            border: "#2A7084",
            text: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 600,
            padding: "10px 14px"
        },
        "vedanga": {
            bg: "#D8E8F0",
            border: "#4A90A4",
            text: "#2A5060",
            fontSize: "9px",
            fontWeight: 500,
            padding: "5px 8px"
        },
        "sutra": {
            bg: "#E8E0D0",
            border: "#8B7355",
            text: "#5A5040",
            fontSize: "9px",
            fontWeight: 500,
            padding: "5px 8px"
        },
        "upaveda-header": {
            bg: "linear-gradient(135deg, #6B8E23 0%, #5B7E13 100%)",
            border: "#4B6E03",
            text: "#FFFFFF",
            fontSize: "11px",
            fontWeight: 600,
            padding: "8px 12px"
        },
        "upaveda": {
            bg: "#E8F0D8",
            border: "#6B8E23",
            text: "#3A4A13",
            fontSize: "9px",
            fontWeight: 500,
            padding: "5px 8px"
        },
        "agama-header": {
            bg: "#D4A5A5",
            border: "#B48585",
            text: "#3D2828",
            fontSize: "11px",
            fontWeight: 600,
            padding: "8px 12px"
        },
        "agama": {
            bg: "#F0E0E0",
            border: "#D4A5A5",
            text: "#5A4040",
            fontSize: "9px",
            fontWeight: 500,
            padding: "5px 8px"
        },
        "bhashya-header": {
            bg: "linear-gradient(135deg, #9370DB 0%, #8360CB 100%)",
            border: "#7350BB",
            text: "#FFFFFF",
            fontSize: "11px",
            fontWeight: 600,
            padding: "8px 12px"
        },
        "bhashya": {
            bg: "#E8E0F0",
            border: "#9370DB",
            text: "#4A3060",
            fontSize: "10px",
            fontWeight: 500,
            padding: "6px 10px"
        },
        "bhashya-text": {
            bg: "#F0E8F8",
            border: "#9370DB",
            text: "#5A4070",
            fontSize: "8px",
            fontWeight: 500,
            padding: "4px 8px"
        },
        "prakarana-header": {
            bg: "#708090",
            border: "#506070",
            text: "#FFFFFF",
            fontSize: "11px",
            fontWeight: 600,
            padding: "8px 12px"
        },
        "prakarana-text": {
            bg: "#E8E8F0",
            border: "#708090",
            text: "#404858",
            fontSize: "8px",
            fontWeight: 500,
            padding: "4px 8px"
        },
        "commentary": {
            bg: "#E0E0E8",
            border: "#708090",
            text: "#404858",
            fontSize: "9px",
            fontWeight: 500,
            padding: "5px 8px"
        },
        "list-container": {
            bg: "#FDF8F0",
            border: "#D4C4A8",
            text: "#3D3428",
            fontSize: "8px",
            fontWeight: 500,
            padding: "8px 10px"
        }
    } as Record<string, { bg: string; border: string; text: string; fontSize: string; fontWeight: number; padding: string }>,

    edgeColors: {
        derivation: "rgba(139, 115, 85, 0.6)",
        branch: "rgba(139, 115, 85, 0.5)",
        classification: "rgba(139, 115, 85, 0.5)",
        convergence: "rgba(196, 163, 90, 0.7)",
    } as Record<string, string>,
};

// ==========================================
// CSS STYLES (Injected via style tag)
// ==========================================

const nodeStyles = `
/* ==========================================
   KNOWLEDGE MAP NODE STYLES - Dynamic Sizing
   ========================================== */

.knowledge-map-node {
    position: absolute;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border-width: 2px;
    border-style: solid;
    cursor: pointer;
    transition: transform 0.15s ease-out, box-shadow 0.15s ease-out, border-color 0.15s ease-out;
    box-sizing: border-box;
    
    /* CRITICAL: Dynamic sizing - NO fixed width/height */
    width: auto;
    height: auto;
    min-width: 60px;
    max-width: 180px;
    
    font-family: 'Poppins', 'Noto Sans Devanagari', -apple-system, sans-serif;
}

.knowledge-map-node:hover {
    transform: scale(1.08) translate(-46%, -46%);
    box-shadow: 0 6px 20px rgba(139, 105, 20, 0.3);
    border-color: #8B6914 !important;
    z-index: 100;
}

.knowledge-map-node.highlighted {
    box-shadow: 0 3px 14px rgba(139, 105, 20, 0.25);
}

.knowledge-map-node.dimmed {
    opacity: 0.4;
}

/* Text wrapping - MANDATORY for all text elements */
.node-label {
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
    text-align: center;
    width: 100%;
    max-width: 100%;
    line-height: 1.35;
    display: block;
}

.node-sublabel {
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    text-align: center;
    width: 100%;
    max-width: 100%;
    line-height: 1.25;
    opacity: 0.85;
    margin-top: 3px;
    display: block;
}

/* List container for nodes with multiple items */
.node-list-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    width: 100%;
    padding: 2px 0;
}

.node-list-title {
    font-weight: 600;
    margin-bottom: 6px;
    text-align: center;
    width: 100%;
    white-space: normal;
    word-wrap: break-word;
}

.node-list {
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: left;
    width: 100%;
}

.node-list li {
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.5;
    padding: 2px 0 2px 16px;
    position: relative;
}

.node-list li::before {
    content: "•";
    position: absolute;
    left: 4px;
    top: 2px;
    color: inherit;
    opacity: 0.7;
    font-weight: bold;
}

.external-link-indicator {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, rgba(139, 105, 20, 0.95) 0%, rgba(180, 140, 40, 0.95) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.15s ease-out, transform 0.15s ease-out;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.knowledge-map-node:hover .external-link-indicator {
    opacity: 1;
    transform: scale(1.1);
}

/* Wide nodes for list content */
.knowledge-map-node.list-node {
    max-width: 240px;
    align-items: flex-start;
}
`;


// ==========================================
// ZONE LABELS
// ==========================================

const ZONE_LABELS = [
    { label: "ŚRUTI", sublabel: "श्रुति • That which is heard", x: 50, y: 300, rotation: -90, color: "#E07B39" },
    { label: "SMṚTI", sublabel: "स्मृति • That which is remembered", x: 50, y: 1400, rotation: -90, color: "#B8860B" },
    { label: "PRASTHĀNA TRAYA", sublabel: "प्रस्थान त्रय", x: 1700, y: 600, rotation: 90, color: "#C99F6D" },
    { label: "SAHĀYAK PĀṬHYA", sublabel: "सहायक पाठ्य", x: 1700, y: 1800, rotation: 90, color: "#4A90A4" },
];

// ==========================================
// NODE COMPONENT - HTML Based with Dynamic Sizing
// ==========================================

interface NodeProps {
    node: MapNode;
    isHighlighted: boolean;
    isHovered: boolean;
    hasHoveredNode: boolean;
    onHover: (nodeId: string | null) => void;
    onClick: (node: MapNode) => void;
    zoom: number;
}

function MapNodeComponent({ node, isHighlighted, isHovered, hasHoveredNode, onHover, onClick, zoom }: NodeProps) {
    const style = STYLES.nodeStyles[node.style] || STYLES.nodeStyles["text"];
    const isDimmed = hasHoveredNode && !isHighlighted && !isHovered;

    // Determine if this is a list node
    const isListNode = node.listItems && node.listItems.length > 0;

    // Calculate appropriate max-width based on node type
    const getMaxWidth = () => {
        if (isListNode) return 240;
        if (node.style?.includes('header')) return 160;
        if (node.style === 'primary' || node.style === 'secondary') return 140;
        return 160;
    };

    return (
        <div
            className={`knowledge-map-node ${isHighlighted ? 'highlighted' : ''} ${isDimmed ? 'dimmed' : ''} ${isListNode ? 'list-node' : ''}`}
            style={{
                left: node.x,
                top: node.y,
                background: style.bg,
                borderColor: style.border,
                color: style.text,
                padding: style.padding,
                // Dynamic sizing - NO fixed width from JSON
                maxWidth: getMaxWidth(),
                transform: `translate(-50%, -50%)`,
            }}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(node)}
        >
            {/* External link indicator */}
            <div className="external-link-indicator">
                <ExternalLink size={11} color="#FFFFFF" />
            </div>

            {/* Node content */}
            {isListNode ? (
                <div className="node-list-container">
                    <div className="node-list-title" style={{ fontSize: style.fontSize, fontWeight: style.fontWeight }}>
                        {node.label}
                    </div>
                    {node.sublabel && (
                        <div className="node-sublabel" style={{ fontSize: `calc(${style.fontSize} - 1px)`, marginBottom: '6px' }}>
                            {node.sublabel}
                        </div>
                    )}
                    <ul className="node-list" style={{ fontSize: `calc(${style.fontSize} - 1px)` }}>
                        {node.listItems!.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <>
                    <span
                        className="node-label"
                        style={{
                            fontSize: style.fontSize,
                            fontWeight: style.fontWeight,
                        }}
                    >
                        {node.label}
                    </span>
                    {node.sublabel && (
                        <span
                            className="node-sublabel"
                            style={{
                                fontSize: `calc(${style.fontSize} - 2px)`,
                            }}
                        >
                            {node.sublabel}
                        </span>
                    )}
                </>
            )}
        </div>
    );
}


// ==========================================
// EDGE PATH GENERATOR
// ==========================================

function generateEdgePath(
    fromNode: MapNode,
    toNode: MapNode,
    edgeType: string
): string {
    const startX = fromNode.x;
    const startY = fromNode.y + (fromNode.height || 20) / 2 + 5;
    const endX = toNode.x;
    const endY = toNode.y - (toNode.height || 20) / 2 - 5;

    const dy = endY - startY;
    const dx = Math.abs(endX - startX);

    if (dy < 0) {
        // Target is above source - horizontal edge
        const midX = (startX + endX) / 2;
        return `M ${startX} ${fromNode.y} L ${midX} ${fromNode.y} L ${midX} ${toNode.y} L ${endX} ${toNode.y}`;
    }

    if (edgeType === "convergence") {
        const ctrlY1 = startY + dy * 0.4;
        const ctrlY2 = endY - dy * 0.4;
        return `M ${startX} ${startY} C ${startX} ${ctrlY1} ${endX} ${ctrlY2} ${endX} ${endY}`;
    }

    if (dx < 50) {
        return `M ${startX} ${startY} Q ${startX} ${(startY + endY) / 2} ${endX} ${endY}`;
    }

    const ctrlY1 = startY + dy * 0.3;
    const ctrlY2 = endY - dy * 0.3;
    return `M ${startX} ${startY} C ${startX} ${ctrlY1} ${endX} ${ctrlY2} ${endX} ${endY}`;
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function CanonicalKnowledgeMap() {
    const [nodes, setNodes] = useState<MapNode[]>([]);
    const [edges, setEdges] = useState<MapEdge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [zoom, setZoom] = useState(0.5);
    const [pan, setPan] = useState({ x: 100, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Inject CSS
    useEffect(() => {
        const styleEl = document.createElement('style');
        styleEl.id = 'knowledge-map-styles';
        styleEl.textContent = nodeStyles;
        document.head.appendChild(styleEl);
        return () => {
            const el = document.getElementById('knowledge-map-styles');
            if (el) el.remove();
        };
    }, []);

    // Load JSON data
    useEffect(() => {
        async function loadData() {
            try {
                const [nodesRes, edgesRes] = await Promise.all([
                    fetch("/data/knowledge-map/nodes.json"),
                    fetch("/data/knowledge-map/edges.json"),
                ]);

                if (!nodesRes.ok || !edgesRes.ok) {
                    throw new Error("Failed to load data files");
                }

                const nodesData = await nodesRes.json();
                const edgesData = await edgesRes.json();
                setNodes(nodesData);
                setEdges(edgesData);
            } catch (err) {
                console.error("Failed to load knowledge map data:", err);
                setError("Failed to load knowledge map data. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Create node lookup map
    const nodeMap = useMemo(() => {
        const map = new Map<string, MapNode>();
        nodes.forEach(node => map.set(node.id, node));
        return map;
    }, [nodes]);

    // Get highlighted nodes
    const highlightedNodes = useMemo(() => {
        if (!hoveredNode) return new Set<string>();
        const connected = new Set<string>([hoveredNode]);
        edges.forEach(edge => {
            if (edge.source === hoveredNode) connected.add(edge.target);
            if (edge.target === hoveredNode) connected.add(edge.source);
        });
        return connected;
    }, [hoveredNode, edges]);

    // Zoom controls
    const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 2));
    const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.2));
    const handleReset = () => {
        setZoom(0.5);
        setPan({ x: 100, y: 50 });
    };
    const handleFitToView = () => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            const scaleX = (width - 100) / STYLES.canvasWidth;
            const scaleY = (height - 100) / STYLES.canvasHeight;
            setZoom(Math.min(scaleX, scaleY, 0.8));
            setPan({ x: 100, y: 50 });
        }
    };

    // Pan handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current || e.target === containerRef.current) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setZoom(z => Math.max(0.2, Math.min(2, z + delta)));
    }, []);

    const handleNodeClick = useCallback((node: MapNode) => {
        window.open(node.url, "_blank");
    }, []);

    const handleNodeHover = useCallback((nodeId: string | null) => {
        setHoveredNode(nodeId);
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[850px] flex items-center justify-center bg-[#F8F4EB] rounded-xl border border-amber-200">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin h-8 w-8 border-3 border-amber-400/30 border-t-amber-600 rounded-full"></div>
                    <div className="text-amber-800/60 text-lg">Loading Knowledge Map...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[850px] flex items-center justify-center bg-[#F8F4EB] rounded-xl border border-red-200">
                <div className="flex flex-col items-center gap-3 text-red-800/70">
                    <Info className="h-8 w-8" />
                    <div>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[850px] rounded-xl overflow-hidden border border-amber-300/50"
            style={{ background: STYLES.background }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        >
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 bg-amber-50/95 backdrop-blur-sm rounded-lg p-2 border border-amber-300/50 shadow-md">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleZoomIn}
                    className="text-amber-800 hover:bg-amber-100"
                    title="Zoom In"
                >
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="text-center text-xs text-amber-700/70 font-mono px-1">
                    {Math.round(zoom * 100)}%
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleZoomOut}
                    className="text-amber-800 hover:bg-amber-100"
                    title="Zoom Out"
                >
                    <ZoomOut className="h-4 w-4" />
                </Button>
                <div className="w-full h-px bg-amber-300/50" />
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleFitToView}
                    className="text-amber-800 hover:bg-amber-100"
                    title="Fit to View"
                >
                    <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleReset}
                    className="text-amber-800 hover:bg-amber-100"
                    title="Reset View"
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-xs text-amber-800/60 bg-amber-50/90 px-4 py-2 rounded-full border border-amber-200/50 shadow-sm">
                <Move className="h-3 w-3" />
                <span>Drag to pan • Scroll to zoom • Click any node to explore</span>
            </div>

            {/* Hovered Node Info */}
            {hoveredNode && (
                <div className="absolute top-4 left-4 z-30 bg-amber-50/98 backdrop-blur-sm rounded-lg p-4 border border-amber-300/50 max-w-xs shadow-md">
                    {(() => {
                        const node = nodeMap.get(hoveredNode);
                        if (!node) return null;
                        return (
                            <>
                                <h3 className="text-amber-900 font-semibold text-base">{node.label}</h3>
                                {node.sublabel && (
                                    <p className="text-amber-700/80 text-sm mt-0.5">{node.sublabel}</p>
                                )}
                                {node.description && (
                                    <p className="text-amber-700/60 text-sm mt-2 leading-relaxed">
                                        {node.description}
                                    </p>
                                )}
                                <p className="text-amber-600 text-xs mt-3 flex items-center gap-1.5 font-medium">
                                    <ExternalLink className="h-3.5 w-3.5" /> Click to open in new tab
                                </p>
                            </>
                        );
                    })()}
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 z-20 bg-amber-50/95 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50 shadow-md">
                <div className="text-xs text-amber-800/80 font-semibold mb-2">Category Legend</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    {[
                        { color: "#E07B39", label: "Śruti (Vedas)" },
                        { color: "#E8B98D", label: "Upaniṣads" },
                        { color: "#C94C4C", label: "Itihāsa" },
                        { color: "#9B6B9E", label: "Purāṇas" },
                        { color: "#5A8F7B", label: "Darśanas" },
                        { color: "#4A90A4", label: "Vedāṅgas" },
                        { color: "#9370DB", label: "Bhāṣyas" },
                        { color: "#708090", label: "Prakaraṇa" },
                    ].map(({ color, label }) => (
                        <div key={label} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-amber-700/70">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Canvas Container */}
            <div
                ref={canvasRef}
                className={`absolute inset-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: "top left",
                    width: STYLES.canvasWidth,
                    height: STYLES.canvasHeight,
                }}
            >
                {/* Zone Labels */}
                {ZONE_LABELS.map((zone, i) => (
                    <div
                        key={`zone-${i}`}
                        className="absolute pointer-events-none select-none"
                        style={{
                            left: zone.x,
                            top: zone.y,
                            transform: `rotate(${zone.rotation}deg)`,
                            transformOrigin: "center",
                            color: zone.color,
                            opacity: 0.6,
                        }}
                    >
                        <div
                            className="font-serif text-2xl tracking-[0.25em] font-semibold whitespace-nowrap"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {zone.label}
                        </div>
                        <div className="text-sm opacity-60 mt-1 whitespace-nowrap">
                            {zone.sublabel}
                        </div>
                    </div>
                ))}

                {/* SVG Layer for Edges */}
                <svg
                    className="absolute inset-0 pointer-events-none"
                    width={STYLES.canvasWidth}
                    height={STYLES.canvasHeight}
                    style={{ overflow: "visible" }}
                >
                    <defs>
                        <marker
                            id="arrowhead-map"
                            markerWidth="8"
                            markerHeight="8"
                            refX="7"
                            refY="4"
                            orient="auto"
                        >
                            <path d="M0,0 L8,4 L0,8 Z" fill="rgba(139, 115, 85, 0.5)" />
                        </marker>
                        <marker
                            id="arrowhead-map-highlight"
                            markerWidth="8"
                            markerHeight="8"
                            refX="7"
                            refY="4"
                            orient="auto"
                        >
                            <path d="M0,0 L8,4 L0,8 Z" fill="#8B6914" />
                        </marker>
                    </defs>

                    {edges.map((edge, i) => {
                        const fromNode = nodeMap.get(edge.source);
                        const toNode = nodeMap.get(edge.target);
                        if (!fromNode || !toNode) return null;

                        const isHighlighted =
                            highlightedNodes.has(edge.source) && highlightedNodes.has(edge.target);
                        const color = STYLES.edgeColors[edge.type] || STYLES.edgeColors.derivation;

                        return (
                            <path
                                key={`edge-${i}`}
                                d={generateEdgePath(fromNode, toNode, edge.type)}
                                stroke={isHighlighted ? "#8B6914" : color}
                                strokeWidth={isHighlighted ? 2.5 : 1.5}
                                fill="none"
                                markerEnd={
                                    isHighlighted
                                        ? "url(#arrowhead-map-highlight)"
                                        : "url(#arrowhead-map)"
                                }
                                style={{
                                    transition: "stroke 0.15s ease-out, stroke-width 0.15s ease-out",
                                    opacity: hoveredNode && !isHighlighted ? 0.3 : 1,
                                }}
                            />
                        );
                    })}
                </svg>

                {/* HTML Layer for Nodes */}
                {nodes.map(node => (
                    <MapNodeComponent
                        key={node.id}
                        node={node}
                        isHighlighted={highlightedNodes.has(node.id)}
                        isHovered={hoveredNode === node.id}
                        hasHoveredNode={!!hoveredNode}
                        onHover={handleNodeHover}
                        onClick={handleNodeClick}
                        zoom={zoom}
                    />
                ))}
            </div>
        </div>
    );
}

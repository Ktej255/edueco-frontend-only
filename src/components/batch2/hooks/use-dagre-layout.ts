"use client";

import dagre from "dagre";
import { Node, Edge } from "@xyflow/react";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 150;
const NODE_HEIGHT = 50;

export interface LayoutOptions {
    direction?: "TB" | "LR" | "BT" | "RL";
    nodeWidth?: number;
    nodeHeight?: number;
    rankSep?: number;
    nodeSep?: number;
}

export function getLayoutedElements(
    nodes: Node[],
    edges: Edge[],
    options: LayoutOptions = {}
): { nodes: Node[]; edges: Edge[] } {
    const {
        direction = "TB",
        nodeWidth = NODE_WIDTH,
        nodeHeight = NODE_HEIGHT,
        rankSep = 80,
        nodeSep = 40,
    } = options;

    const isHorizontal = direction === "LR" || direction === "RL";

    dagreGraph.setGraph({ rankdir: direction, ranksep: rankSep, nodesep: nodeSep });

    // Clear previous graph
    dagreGraph.nodes().forEach((n) => dagreGraph.removeNode(n));

    nodes.forEach((node) => {
        const width = node.data?.width || nodeWidth;
        const height = node.data?.height || nodeHeight;
        dagreGraph.setNode(node.id, { width, height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const width = node.data?.width || nodeWidth;
        const height = node.data?.height || nodeHeight;

        return {
            ...node,
            position: {
                x: nodeWithPosition.x - width / 2,
                y: nodeWithPosition.y - height / 2,
            },
            targetPosition: isHorizontal ? "left" : "top",
            sourcePosition: isHorizontal ? "right" : "bottom",
        } as Node;
    });

    return { nodes: layoutedNodes, edges };
}

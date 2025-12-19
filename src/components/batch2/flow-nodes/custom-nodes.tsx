"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

// ==========================================
// STYLE CONFIG - Matching existing design
// ==========================================

interface StyleConfig {
    bg: string;
    border: string;
    text: string;
    fontSize: number;
    padding: string;
}

const STYLES: Record<string, StyleConfig> = {
    primary: { bg: "linear-gradient(135deg, #C4A35A 0%, #B8963D 100%)", border: "#8B7355", text: "#FFFFFF", fontSize: 14, padding: "14px 20px" },
    secondary: { bg: "linear-gradient(135deg, #E07B39 0%, #D06A28 100%)", border: "#C66830", text: "#FFFFFF", fontSize: 13, padding: "12px 18px" },
    veda: { bg: "#E07B39", border: "#C66830", text: "#FFFFFF", fontSize: 11, padding: "10px 14px" },
    section: { bg: "#D4C4A8", border: "#B8A88C", text: "#3D3428", fontSize: 11, padding: "10px 16px" },
    "section-header": { bg: "linear-gradient(135deg, #B8860B 0%, #A07605 100%)", border: "#8B6914", text: "#FFFFFF", fontSize: 12, padding: "12px 16px" },
    text: { bg: "#EDE6D6", border: "#C4B896", text: "#3D3428", fontSize: 10, padding: "8px 12px" },
    "text-small": { bg: "#F0EBE0", border: "#D4CFC0", text: "#5A5040", fontSize: 9, padding: "6px 10px" },
    prasthana: { bg: "linear-gradient(135deg, #E8B98D 0%, #DBA77A 100%)", border: "#C99F6D", text: "#3D3428", fontSize: 12, padding: "12px 16px" },
    upanishad: { bg: "#F0E6D8", border: "#D4C4A8", text: "#5A5040", fontSize: 9, padding: "6px 10px" },
    smriti: { bg: "#B8860B", border: "#8B6914", text: "#FFFFFF", fontSize: 11, padding: "10px 14px" },
    itihas: { bg: "linear-gradient(135deg, #C94C4C 0%, #B83C3C 100%)", border: "#A93C3C", text: "#FFFFFF", fontSize: 12, padding: "12px 16px" },
    "itihas-text": { bg: "#E8D4D4", border: "#C94C4C", text: "#6B3030", fontSize: 10, padding: "8px 12px" },
    purana: { bg: "linear-gradient(135deg, #9B6B9E 0%, #8B5B8E 100%)", border: "#7B4B7E", text: "#FFFFFF", fontSize: 12, padding: "12px 16px" },
    "purana-list": { bg: "#F8F0F8", border: "#9B6B9E", text: "#5A4060", fontSize: 9, padding: "12px 14px" },
    "darshana-header": { bg: "linear-gradient(135deg, #5A8F7B 0%, #4A7F6B 100%)", border: "#3A6F5B", text: "#FFFFFF", fontSize: 13, padding: "12px 18px" },
    darshana: { bg: "#D8E8E0", border: "#5A8F7B", text: "#2A4A3B", fontSize: 10, padding: "8px 12px" },
    "vedanga-header": { bg: "linear-gradient(135deg, #4A90A4 0%, #3A8094 100%)", border: "#2A7084", text: "#FFFFFF", fontSize: 12, padding: "12px 16px" },
    vedanga: { bg: "#D8E8F0", border: "#4A90A4", text: "#2A5060", fontSize: 9, padding: "6px 10px" },
    "vedanga-list": { bg: "#E8F0F8", border: "#4A90A4", text: "#2A5060", fontSize: 9, padding: "12px 14px" },
    sutra: { bg: "#E8E0D0", border: "#8B7355", text: "#5A5040", fontSize: 9, padding: "6px 10px" },
    "upaveda-header": { bg: "linear-gradient(135deg, #6B8E23 0%, #5B7E13 100%)", border: "#4B6E03", text: "#FFFFFF", fontSize: 11, padding: "10px 14px" },
    upaveda: { bg: "#E8F0D8", border: "#6B8E23", text: "#3A4A13", fontSize: 9, padding: "6px 10px" },
    "upaveda-list": { bg: "#F0F8E8", border: "#6B8E23", text: "#3A4A13", fontSize: 9, padding: "12px 14px" },
    "agama-header": { bg: "#D4A5A5", border: "#B48585", text: "#3D2828", fontSize: 11, padding: "10px 14px" },
    agama: { bg: "#F0E0E0", border: "#D4A5A5", text: "#5A4040", fontSize: 9, padding: "6px 10px" },
    "bhashya-header": { bg: "linear-gradient(135deg, #9370DB 0%, #8360CB 100%)", border: "#7350BB", text: "#FFFFFF", fontSize: 11, padding: "10px 14px" },
    bhashya: { bg: "#E8E0F0", border: "#9370DB", text: "#4A3060", fontSize: 10, padding: "8px 12px" },
    "bhashya-text": { bg: "#F0E8F8", border: "#9370DB", text: "#5A4070", fontSize: 8, padding: "5px 8px" },
    "bhashya-list": { bg: "#F8F0FF", border: "#9370DB", text: "#4A3060", fontSize: 8, padding: "10px 12px" },
    "prakarana-header": { bg: "#708090", border: "#506070", text: "#FFFFFF", fontSize: 11, padding: "10px 14px" },
    "prakarana-text": { bg: "#E8E8F0", border: "#708090", text: "#404858", fontSize: 8, padding: "5px 8px" },
    commentary: { bg: "#E0E0E8", border: "#708090", text: "#404858", fontSize: 9, padding: "6px 10px" },
    "list-container": { bg: "#FDF8F0", border: "#D4C4A8", text: "#3D3428", fontSize: 9, padding: "12px 14px" },
    "upanishad-list": { bg: "#FFF8F0", border: "#E8B98D", text: "#5A5040", fontSize: 9, padding: "12px 14px" },
};

// ==========================================
// VEDIC NODE COMPONENT - Standard Nodes
// ==========================================

interface VedicNodeData {
    label: string;
    sublabel?: string;
    style?: string;
    listItems?: string[];
    url?: string;
    [key: string]: unknown;
}

function VedicNodeComponent({ data }: NodeProps) {
    const nodeData = data as VedicNodeData;
    const styleConfig = STYLES[nodeData.style || "text"] || STYLES.text;

    return (
        <>
            <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
            <div
                style={{
                    width: "auto",
                    height: "auto",
                    minWidth: 50,
                    maxWidth: 180,
                    background: styleConfig.bg,
                    border: `2px solid ${styleConfig.border}`,
                    borderRadius: 10,
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: styleConfig.padding,
                    cursor: "pointer",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                    transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
                    boxSizing: "border-box",
                }}
                className="hover:scale-105 hover:shadow-xl"
            >
                <span
                    style={{
                        color: styleConfig.text,
                        fontSize: styleConfig.fontSize,
                        fontWeight: 600,
                        textAlign: "center",
                        lineHeight: 1.35,
                        fontFamily: "'Poppins', 'Noto Sans Devanagari', sans-serif",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        width: "100%",
                        display: "block",
                    }}
                >
                    {nodeData.label}
                </span>
                {nodeData.sublabel && (
                    <span
                        style={{
                            color: styleConfig.text,
                            fontSize: styleConfig.fontSize - 2,
                            fontWeight: 400,
                            opacity: 0.8,
                            textAlign: "center",
                            marginTop: 3,
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            width: "100%",
                            display: "block",
                        }}
                    >
                        {nodeData.sublabel}
                    </span>
                )}
            </div>
            <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
        </>
    );
}

// ==========================================
// LIST NODE COMPONENT - For sections with items
// ==========================================

interface ListNodeData {
    label: string;
    sublabel?: string;
    style?: string;
    listItems: string[];
    url?: string;
    [key: string]: unknown;
}

function ListNodeComponent({ data }: NodeProps) {
    const nodeData = data as ListNodeData;
    const styleConfig = STYLES[nodeData.style || "list-container"] || STYLES["list-container"];
    const items = nodeData.listItems || [];

    return (
        <>
            <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
            <div
                style={{
                    width: "auto",
                    height: "auto",
                    minWidth: 160,
                    maxWidth: 280,
                    background: styleConfig.bg,
                    border: `2px solid ${styleConfig.border}`,
                    borderRadius: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: styleConfig.padding,
                    cursor: "pointer",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
                    transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
                    boxSizing: "border-box",
                }}
                className="hover:scale-[1.02] hover:shadow-xl"
            >
                {/* Header */}
                <div
                    style={{
                        width: "100%",
                        borderBottom: `1px solid ${styleConfig.border}`,
                        paddingBottom: 8,
                        marginBottom: 8,
                    }}
                >
                    <span
                        style={{
                            color: styleConfig.text,
                            fontSize: styleConfig.fontSize + 2,
                            fontWeight: 700,
                            textAlign: "left",
                            lineHeight: 1.3,
                            fontFamily: "'Poppins', 'Noto Sans Devanagari', sans-serif",
                            display: "block",
                        }}
                    >
                        {nodeData.label}
                    </span>
                    {nodeData.sublabel && (
                        <span
                            style={{
                                color: styleConfig.text,
                                fontSize: styleConfig.fontSize,
                                fontWeight: 400,
                                opacity: 0.7,
                                display: "block",
                                marginTop: 2,
                            }}
                        >
                            {nodeData.sublabel}
                        </span>
                    )}
                </div>

                {/* List Items */}
                <ul
                    style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        width: "100%",
                        columns: items.length > 8 ? 2 : 1,
                        columnGap: 16,
                    }}
                >
                    {items.map((item, i) => (
                        <li
                            key={i}
                            style={{
                                color: styleConfig.text,
                                fontSize: styleConfig.fontSize,
                                lineHeight: 1.6,
                                padding: "2px 0 2px 14px",
                                position: "relative",
                                whiteSpace: "nowrap",
                                breakInside: "avoid",
                            }}
                        >
                            <span
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 2,
                                    opacity: 0.6,
                                    fontSize: styleConfig.fontSize - 1,
                                }}
                            >
                                •
                            </span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
        </>
    );
}

export const VedicNode = memo(VedicNodeComponent);
export const ListNode = memo(ListNodeComponent);

// Node type registry for React Flow
export const nodeTypes = {
    vedicNode: VedicNode,
    listNode: ListNode,
};

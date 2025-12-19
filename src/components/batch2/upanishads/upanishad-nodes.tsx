"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

// ==========================================
// ROOT/HEADER NODE - Sanskrit styled
// ==========================================
const VedaHeaderComponent = memo(({ data }: NodeProps) => {
    const isRoot = data?.isRoot;
    const headerColor = data?.headerColor || "#8B4513";

    return (
        <div
            className={`relative flex flex-col items-center justify-center text-center transition-all duration-300 ${isRoot
                    ? "px-8 py-5 bg-gradient-to-br from-amber-100 to-orange-100 border-3 border-amber-500 rounded-2xl shadow-xl"
                    : "px-5 py-3"
                }`}
            style={{
                minWidth: isRoot ? 180 : 160,
                borderColor: isRoot ? undefined : headerColor,
            }}
        >
            <Handle type="target" position={Position.Left} className="!bg-amber-500 !w-3 !h-3" />

            <div
                className={`font-bold ${isRoot ? "text-2xl text-amber-900" : "text-lg"}`}
                style={{ color: isRoot ? undefined : headerColor, fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            >
                {data?.vedaName}
            </div>

            {data?.subtitle && (
                <div className="text-xs text-amber-600 mt-1">{data.subtitle}</div>
            )}

            {data?.count && (
                <div
                    className={`text-xs mt-1 px-2 py-0.5 rounded-full ${isRoot ? "bg-amber-200 text-amber-800" : ""}`}
                    style={{ backgroundColor: isRoot ? undefined : `${headerColor}20`, color: headerColor }}
                >
                    {data.count} texts
                </div>
            )}

            <Handle type="source" position={Position.Right} className="!bg-amber-500 !w-3 !h-3" />
            <Handle type="source" position={Position.Bottom} className="!bg-amber-500 !w-3 !h-3" />
        </div>
    );
});
VedaHeaderComponent.displayName = "VedaHeaderComponent";

// ==========================================
// PRINCIPAL NODE - Bold/Solid Style
// ==========================================
const PrincipalNodeComponent = memo(({ data }: NodeProps) => {
    const bgColor = data?.bgColor || "#D4A574";
    const textColor = data?.textColor || "#FFFFFF";
    const studyOrder = data?.studyOrder;

    return (
        <div
            className="relative px-4 py-3 rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
                backgroundColor: bgColor,
                minWidth: 160,
                border: `2px solid ${bgColor}`,
            }}
        >
            <Handle type="target" position={Position.Left} className="!bg-white !w-2.5 !h-2.5 !border-2" style={{ borderColor: bgColor }} />

            {/* Study Order Badge */}
            {studyOrder && studyOrder <= 10 && (
                <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md"
                    style={{ backgroundColor: "#FFF", color: bgColor }}
                >
                    {studyOrder}
                </div>
            )}

            {/* Sanskrit Name */}
            <div
                className="font-bold text-base leading-tight"
                style={{ color: textColor, fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            >
                {data?.nameSanskrit || data?.name}
            </div>

            {/* English Name */}
            <div className="text-xs mt-1 opacity-90" style={{ color: textColor }}>
                {data?.name}
            </div>

            <Handle type="source" position={Position.Right} className="!bg-white !w-2 !h-2" />
        </div>
    );
});
PrincipalNodeComponent.displayName = "PrincipalNodeComponent";

// ==========================================
// MINOR NODE - Ghost/Outlined Style
// ==========================================
const MinorNodeComponent = memo(({ data }: NodeProps) => {
    const borderColor = data?.borderColor || "#D4A574";
    const textColor = data?.textColor || "#8B4513";

    return (
        <div
            className="relative px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-102"
            style={{
                border: `2px solid ${borderColor}`,
                minWidth: 120,
            }}
        >
            <Handle type="target" position={Position.Left} className="!w-2 !h-2" style={{ backgroundColor: borderColor }} />

            {/* Name */}
            <div
                className="font-medium text-sm leading-tight"
                style={{ color: textColor }}
            >
                {data?.name}
            </div>

            {/* Sanskrit in smaller text */}
            {data?.nameSanskrit && (
                <div
                    className="text-xs opacity-70 mt-0.5"
                    style={{ color: textColor, fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                >
                    {data?.nameSanskrit}
                </div>
            )}

            <Handle type="source" position={Position.Right} className="!w-2 !h-2" style={{ backgroundColor: borderColor }} />
        </div>
    );
});
MinorNodeComponent.displayName = "MinorNodeComponent";

// ==========================================
// EXPORT NODE TYPES
// ==========================================
export const upanishadNodeTypes = {
    vedaHeader: VedaHeaderComponent,
    principalNode: PrincipalNodeComponent,
    minorNode: MinorNodeComponent,
};

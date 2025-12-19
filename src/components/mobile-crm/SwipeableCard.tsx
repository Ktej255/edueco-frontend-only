"use client";

import { useState, useRef, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SwipeAction {
    icon: LucideIcon;
    color: string;
    onAction: () => void;
}

interface SwipeableCardProps {
    children: ReactNode;
    leftAction?: SwipeAction;
    rightAction?: SwipeAction;
    threshold?: number;
}

export default function SwipeableCard({
    children,
    leftAction,
    rightAction,
    threshold = 80,
}: SwipeableCardProps) {
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const diff = e.touches[0].clientX - startX;

        // Limit swipe distance
        const maxSwipe = 120;
        const limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));

        // Only allow swipe in direction that has an action
        if (diff > 0 && !leftAction) return;
        if (diff < 0 && !rightAction) return;

        setCurrentX(limitedDiff);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);

        // Trigger action if threshold exceeded
        if (currentX > threshold && leftAction) {
            leftAction.onAction();
        } else if (currentX < -threshold && rightAction) {
            rightAction.onAction();
        }

        // Reset position
        setCurrentX(0);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setStartX(e.clientX);
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const diff = e.clientX - startX;

        const maxSwipe = 120;
        const limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));

        if (diff > 0 && !leftAction) return;
        if (diff < 0 && !rightAction) return;

        setCurrentX(limitedDiff);
    };

    const handleMouseUp = () => {
        handleTouchEnd();
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            handleTouchEnd();
        }
    };

    // Calculate opacity based on swipe distance
    const leftOpacity = Math.min(1, currentX / threshold);
    const rightOpacity = Math.min(1, -currentX / threshold);

    return (
        <div className="relative overflow-hidden rounded-xl">
            {/* Left Action Background */}
            {leftAction && (
                <div
                    className={`absolute inset-y-0 left-0 w-24 flex items-center justify-start pl-4 ${leftAction.color}`}
                    style={{ opacity: leftOpacity }}
                >
                    <leftAction.icon className="h-6 w-6 text-white" />
                </div>
            )}

            {/* Right Action Background */}
            {rightAction && (
                <div
                    className={`absolute inset-y-0 right-0 w-24 flex items-center justify-end pr-4 ${rightAction.color}`}
                    style={{ opacity: rightOpacity }}
                >
                    <rightAction.icon className="h-6 w-6 text-white" />
                </div>
            )}

            {/* Swipeable Content */}
            <div
                ref={cardRef}
                className="relative z-10 cursor-grab active:cursor-grabbing"
                style={{
                    transform: `translateX(${currentX}px)`,
                    transition: isDragging ? "none" : "transform 0.3s ease-out",
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>
        </div>
    );
}

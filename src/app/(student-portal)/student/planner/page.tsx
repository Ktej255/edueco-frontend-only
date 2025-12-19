"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar as CalendarIcon, Lock } from "lucide-react";
import Link from "next/link";

// TRIAL MODE: Set to true to unlock everything for testing/content upload
// Set to false when deploying to production/AWS
const TRIAL_MODE = true;

// Helper function to check if a day is unlocked
const isDayUnlocked = (year: number, month: number, day: number): boolean => {
    // TRIAL MODE: Everything unlocked
    if (TRIAL_MODE) return true;

    const today = new Date();
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetDate = new Date(year, month, day);

    // Check if target date is before or equal to today
    if (targetDate > currentDate) {
        return false;
    }

    // Check localStorage for completion status of previous day
    if (targetDate.getTime() === currentDate.getTime()) {
        return true; // Today is always unlocked
    }

    // For past dates, check if they were completed
    const previousDay = new Date(targetDate);
    previousDay.setDate(previousDay.getDate() - 1);
    const prevKey = `day_${previousDay.getFullYear()}_${previousDay.getMonth()}_${previousDay.getDate()}`;
    const prevCompleted = localStorage.getItem(prevKey) === 'completed';

    return prevCompleted || targetDate < currentDate;
};

// Monthly schedule data
const monthlySchedules = {
    august: {
        name: "August",
        year: 2025,
        status: "completed",
        days: [
            { date: 18, topic: "Economy Day 1", subtitle: "The Growth Conundrum: Speed, Stability, and Inclusion", gs: "GS3", color: "bg-yellow-100 dark:bg-yellow-900/30" },
            { date: 19, topic: "Economy Day 2", subtitle: "Public Finance & The Fiscal Framework", gs: "GS3", color: "bg-yellow-100 dark:bg-yellow-900/30" },
            { date: 20, topic: "Economy Day 3", subtitle: "Agriculture & The Agrarian Economy", gs: "GS3", color: "bg-yellow-100 dark:bg-yellow-900/30" },
            { date: 21, topic: "Economy Day 4", subtitle: "Industrial Policy & Structural Transformation", gs: "GS3", color: "bg-yellow-100 dark:bg-yellow-900/30" },
            { date: 22, topic: "Economy Day 5", subtitle: "Infrastructure & Investment Models", gs: "GS3", color: "bg-yellow-100 dark:bg-yellow-900/30" },
            { date: 23, topic: "Recall", subtitle: "", gs: "", color: "bg-blue-200 dark:bg-blue-900/40" },
            { date: 24, topic: "Retention", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-800/40" },
            { date: 25, topic: "Economy Day 6", subtitle: "The External Sector & Global Institutions", gs: "GS3", color: "bg-yellow-100 dark:bg-yellow-900/30" },
            { date: 26, topic: "Economy Day 7", subtitle: "Economic Dimensions of Internal Security", gs: "GS3", color: "bg-yellow-100 dark:bg-yellow-900/30" },
            { date: 27, topic: "Mock Test 1 (Mini)", subtitle: "Eco Theme 1to 8", gs: "", color: "bg-purple-100 dark:bg-purple-900/30" },
            { date: 28, topic: "Agri DAY 1", subtitle: "", gs: "GS3", color: "bg-green-100 dark:bg-green-900/30" },
            { date: 29, topic: "Agri DAY 2", subtitle: "", gs: "GS3", color: "bg-green-100 dark:bg-green-900/30" },
            { date: 30, topic: "Recall", subtitle: "", gs: "", color: "bg-blue-200 dark:bg-blue-900/40" },
            { date: 31, topic: "Retention", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-800/40" },
        ]
    },
    september: {
        name: "September",
        year: 2025,
        status: "completed",
        days: [
            { date: 1, topic: "Agri DAY 3", subtitle: "", gs: "GS3", color: "bg-green-100 dark:bg-green-900/30" },
            { date: 2, topic: "Agri DAY 4", subtitle: "", gs: "GS3", color: "bg-green-100 dark:bg-green-900/30" },
            { date: 3, topic: "Agri DAY 5", subtitle: "", gs: "GS3", color: "bg-green-100 dark:bg-green-900/30" },
            { date: 4, topic: "Agri DAY 6", subtitle: "", gs: "GS3", color: "bg-green-100 dark:bg-green-900/30" },
            { date: 5, topic: "Recall", subtitle: "", gs: "", color: "bg-blue-200 dark:bg-blue-900/40" },
            { date: 6, topic: "Retention", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-800/40" },
            { date: 7, topic: "MOCK TEST -02 (Mini)", subtitle: "", gs: "", color: "bg-purple-100 dark:bg-purple-900/30" },
            { date: 8, topic: "Environment Day 1", subtitle: "", gs: "GS3", color: "bg-teal-100 dark:bg-teal-900/30" },
            { date: 9, topic: "Environment Day 2", subtitle: "", gs: "GS3", color: "bg-teal-100 dark:bg-teal-900/30" },
            { date: 10, topic: "Disaster Management Day 1", subtitle: "", gs: "GS3", color: "bg-orange-100 dark:bg-orange-900/30" },
            { date: 11, topic: "Disaster Management Day 2", subtitle: "", gs: "GS3", color: "bg-orange-100 dark:bg-orange-900/30" },
            { date: 12, topic: "Internal Security Day 1", subtitle: "", gs: "GS3", color: "bg-red-100 dark:bg-red-900/30" },
            { date: 13, topic: "Internal Security Day 1", subtitle: "", gs: "GS3", color: "bg-red-100 dark:bg-red-900/30" },
            { date: 14, topic: "Recall", subtitle: "", gs: "", color: "bg-blue-200 dark:bg-blue-900/40" },
            { date: 15, topic: "Retention", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-800/40" },
            { date: 16, topic: "Sci & Tech Day 1", subtitle: "", gs: "GS3", color: "bg-cyan-100 dark:bg-cyan-900/30" },
            { date: 17, topic: "Sci & Tech Day 2", subtitle: "", gs: "GS3", color: "bg-cyan-100 dark:bg-cyan-900/30" },
            { date: 18, topic: "Sci & Tech Day 3", subtitle: "", gs: "GS3", color: "bg-cyan-100 dark:bg-cyan-900/30" },
            { date: 19, topic: "MOCK TEST -03 (Major TEST)", subtitle: "", gs: "", color: "bg-purple-100 dark:bg-purple-900/30" },
            { date: 20, topic: "Holiday", subtitle: "", gs: "", color: "bg-gray-100 dark:bg-gray-800" },
            { date: 21, topic: "Holiday", subtitle: "", gs: "", color: "bg-gray-100 dark:bg-gray-800" },
            { date: 22, topic: "Holiday", subtitle: "", gs: "", color: "bg-gray-100 dark:bg-gray-800" },
            { date: 26, topic: "Test -01 (Eco + Envir + DM)", subtitle: "", gs: "", color: "bg-purple-100 dark:bg-purple-900/30" },
            { date: 27, topic: "Test -02 (Agriculture + Internal Security)", subtitle: "", gs: "", color: "bg-purple-100 dark:bg-purple-900/30" },
            { date: 28, topic: "Break", subtitle: "", gs: "", color: "bg-blue-400 dark:bg-blue-700" },
            { date: 29, topic: "GS 4 Ethics Day 1 + English CSAT", subtitle: "", gs: "GS4", color: "bg-pink-100 dark:bg-pink-900/30" },
            { date: 30, topic: "GS 4 Ethics Day 2 + English CSAT", subtitle: "", gs: "GS4", color: "bg-pink-100 dark:bg-pink-900/30" },
        ]
    },
    october: {
        name: "October",
        year: 2025,
        status: "completed",
        days: [
            { date: 1, topic: "GS 4 Ethics Day 3 + English CSAT", subtitle: "", gs: "GS4", color: "bg-pink-100 dark:bg-pink-900/30" },
            { date: 2, topic: "GS 4 Ethics Day 4 + English CSAT", subtitle: "", gs: "GS4", color: "bg-pink-100 dark:bg-pink-900/30" },
            { date: 3, topic: "GS 4 Ethics Day 5 + English CSAT", subtitle: "", gs: "GS4", color: "bg-pink-100 dark:bg-pink-900/30" },
            { date: 4, topic: "Recall", subtitle: "", gs: "", color: "bg-blue-200 dark:bg-blue-900/40" },
            { date: 5, topic: "Retention MOCK TEST - 04", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-800/40" },
            { date: 6, topic: "GS 4 Ethics Day 6 + English CSAT", subtitle: "", gs: "GS4", color: "bg-pink-100 dark:bg-pink-900/30" },
            { date: 7, topic: "GS 4 Ethics Day 7 + English CSAT", subtitle: "", gs: "GS4", color: "bg-pink-100 dark:bg-pink-900/30" },
            { date: 8, topic: "GS 4 Ethics Day 8 + English CSAT", subtitle: "", gs: "GS4", color: "bg-pink-100 dark:bg-pink-900/30" },
            { date: 9, topic: "GS 4 Ethics Day 9 + English CSAT", subtitle: "", gs: "GS4", color: "bg-pink-100 dark:bg-pink-900/30" },
            { date: 10, topic: "GS 4 Ethics Day 10 + English CSAT", subtitle: "", gs: "GS4", color: "bg-pink-100 dark:bg-pink-900/30" },
            { date: 11, topic: "GS 4 Ethics Day 11 + English CSAT", subtitle: "", gs: "GS4", color: "bg-pink-100 dark:bg-pink-900/30" },
            { date: 12, topic: "Recall", subtitle: "", gs: "", color: "bg-blue-200 dark:bg-blue-900/40" },
            { date: 13, topic: "Retention MOCK TEST - 04", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-800/40" },
            { date: 14, topic: "Revision", subtitle: "", gs: "", color: "bg-lime-100 dark:bg-lime-900/30" },
            { date: 15, topic: "Revision", subtitle: "", gs: "", color: "bg-lime-100 dark:bg-lime-900/30" },
            { date: 16, topic: "Revision", subtitle: "", gs: "", color: "bg-lime-100 dark:bg-lime-900/30" },
            { date: 17, topic: "Revision", subtitle: "", gs: "", color: "bg-lime-100 dark:bg-lime-900/30" },
            { date: 18, topic: "Diwali Vacation", subtitle: "", gs: "", color: "bg-amber-200 dark:bg-amber-900/40" },
            { date: 19, topic: "Diwali Vacation", subtitle: "", gs: "", color: "bg-amber-200 dark:bg-amber-900/40" },
            { date: 20, topic: "Diwali Vacation", subtitle: "", gs: "", color: "bg-amber-200 dark:bg-amber-900/40" },
            { date: 21, topic: "Diwali Vacation", subtitle: "", gs: "", color: "bg-amber-200 dark:bg-amber-900/40" },
            { date: 22, topic: "Diwali Vacation", subtitle: "", gs: "", color: "bg-amber-200 dark:bg-amber-900/40" },
            { date: 23, topic: "Diwali Vacation", subtitle: "", gs: "", color: "bg-amber-200 dark:bg-amber-900/40" },
            { date: 24, topic: "Diwali Vacation", subtitle: "", gs: "", color: "bg-amber-200 dark:bg-amber-900/40" },
            { date: 25, topic: "Revision", subtitle: "", gs: "", color: "bg-lime-100 dark:bg-lime-900/30" },
            { date: 26, topic: "Revision", subtitle: "", gs: "", color: "bg-lime-100 dark:bg-lime-900/30" },
            { date: 27, topic: "Revision", subtitle: "", gs: "", color: "bg-lime-100 dark:bg-lime-900/30" },
        ]
    },
    november: {
        name: "November",
        year: 2025,
        status: "completed",
        days: [
            { date: 1, topic: "Day - 1 MODERN INDIAN HISTORY", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 2, topic: "Day - 2 MODERN INDIAN HISTORY", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 3, topic: "Day - 3 MODERN INDIAN HISTORY", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 4, topic: "Day - 4 MODERN INDIAN HISTORY", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 5, topic: "Day - 5 MODERN INDIAN HISTORY", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 6, topic: "Day - 6 MODERN INDIAN HISTORY", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 7, topic: "Day - 7 MODERN INDIAN HISTORY", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 8, topic: "Recall", subtitle: "", gs: "", color: "bg-orange-300 dark:bg-orange-700" },
            { date: 9, topic: "Day 1 WORLD HISTORY", subtitle: "", gs: "GS1", color: "bg-yellow-400 text-black dark:bg-yellow-600" },
            { date: 10, topic: "Day 2 WORLD HISTORY", subtitle: "", gs: "GS1", color: "bg-yellow-400 text-black dark:bg-yellow-600" },
            { date: 11, topic: "Day 3 WORLD HISTORY", subtitle: "", gs: "GS1", color: "bg-yellow-400 text-black dark:bg-yellow-600" },
            { date: 12, topic: "Day 4 WORLD HISTORY", subtitle: "", gs: "GS1", color: "bg-yellow-400 text-black dark:bg-yellow-600" },
            { date: 13, topic: "Day 1 INDIAN HERITAGE & CULTURE", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 14, topic: "Day 2 INDIAN HERITAGE & CULTURE", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 15, topic: "Day 3 INDIAN HERITAGE & CULTURE", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 16, topic: "Day 4 INDIAN HERITAGE & CULTURE", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 17, topic: "Recall", subtitle: "", gs: "", color: "bg-orange-300 dark:bg-orange-700" },
            { date: 18, topic: "MOCK TEST - 05", subtitle: "", gs: "", color: "bg-purple-100 dark:bg-purple-900/30" },
            { date: 19, topic: "Day 1 INDIAN SOCIETY", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 20, topic: "Day 2 INDIAN SOCIETY", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 21, topic: "Day 3 INDIAN SOCIETY", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 22, topic: "Day 4 INDIAN SOCIETY", subtitle: "", gs: "GS1", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 23, topic: "Recall", subtitle: "", gs: "", color: "bg-orange-300 dark:bg-orange-700" },
            { date: 24, topic: "Day 1 Geography", subtitle: "", gs: "GS1", color: "bg-yellow-400 text-black dark:bg-yellow-600" },
            { date: 25, topic: "Day 2 Geography", subtitle: "", gs: "GS1", color: "bg-yellow-400 text-black dark:bg-yellow-600" },
            { date: 26, topic: "Day 3 Geography", subtitle: "", gs: "GS1", color: "bg-yellow-400 text-black dark:bg-yellow-600" },
            { date: 27, topic: "Day 4 Geography", subtitle: "", gs: "GS1", color: "bg-yellow-400 text-black dark:bg-yellow-600" },
            { date: 28, topic: "Day 5 Geography", subtitle: "", gs: "GS1", color: "bg-yellow-400 text-black dark:bg-yellow-600" },
            { date: 29, topic: "Day 6 Geography", subtitle: "", gs: "GS1", color: "bg-yellow-400 text-black dark:bg-yellow-600" },
            { date: 30, topic: "MOCK TEST - 06", subtitle: "", gs: "", color: "bg-purple-100 dark:bg-purple-900/30" },
        ]
    },
    december: {
        name: "December",
        year: 2025,
        status: "ongoing",
        days: [
            { date: 1, topic: "Day 1 Indian Polity & Constitution", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 2, topic: "Day 2 Indian Polity & Constitution", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 3, topic: "Day 3 Indian Polity & Constitution", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 4, topic: "Day 4 Indian Polity & Constitution", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 5, topic: "Day 5 Indian Polity & Constitution", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 6, topic: "Day 6 Indian Polity & Constitution", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 7, topic: "Day 7 Indian Polity & Constitution", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 8, topic: "Recall", subtitle: "", gs: "", color: "bg-orange-300 dark:bg-orange-700" },
            { date: 9, topic: "Day 1 Governance & Social Justice", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 10, topic: "Day 2 Governance & Social Justice", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 11, topic: "Day 3 Governance & Social Justice", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 12, topic: "Day 4 Governance & Social Justice", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 13, topic: "Day 5 Governance & Social Justice", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 14, topic: "Day 6 Governance & Social Justice", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 15, topic: "Recall", subtitle: "", gs: "", color: "bg-orange-300 dark:bg-orange-700" },
            { date: 16, topic: "MOCK TEST - 07", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-700" },
            { date: 17, topic: "Day 1 International Relations", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 18, topic: "Day 2 International Relations", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 19, topic: "Day 3 International Relations", subtitle: "", gs: "GS2", color: "bg-purple-600 text-white dark:bg-purple-800" },
            { date: 20, topic: "MOCK TEST - 08 GS - 01 (Test 01 & 02)", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-700" },
            { date: 21, topic: "MOCK TEST - 09 GS - 02 (Test 01 & 02)", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-700" },
            { date: 22, topic: "MOCK TEST - 10 GS - 03 (Test 01 & 02)", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-700" },
            { date: 23, topic: "MOCK TEST - 11 GS - 03 (Test 01 & 02)", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-700" },
            { date: 24, topic: "Revision GS - 01", subtitle: "", gs: "", color: "bg-pink-200 dark:bg-pink-800" },
            { date: 25, topic: "Revision GS - 02", subtitle: "", gs: "", color: "bg-pink-200 dark:bg-pink-800" },
            { date: 26, topic: "Revision GS - 03", subtitle: "", gs: "", color: "bg-pink-200 dark:bg-pink-800" },
            { date: 27, topic: "Revision GS - 04", subtitle: "", gs: "", color: "bg-pink-200 dark:bg-pink-800" },
            { date: 28, topic: "MOCK TEST - 12 (GS 01 & 02)", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-700" },
            { date: 29, topic: "MOCK TEST - 13 (GS 01 & 02)", subtitle: "", gs: "", color: "bg-blue-300 dark:bg-blue-700" },
            { date: 30, topic: "Final Revision", subtitle: "", gs: "", color: "bg-pink-200 dark:bg-pink-800" },
            { date: 31, topic: "Year End Review", subtitle: "", gs: "", color: "bg-pink-200 dark:bg-pink-800" },
        ]
    },
    january: {
        name: "January",
        year: 2026,
        status: TRIAL_MODE ? "ongoing" : "locked",
        days: [
            { date: 1, topic: "Cycle 1: Indian Polity Day 1", subtitle: "Constitutional Framework", gs: "Prelims", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 2, topic: "Cycle 1: Indian Polity Day 2", subtitle: "Fundamental Rights", gs: "Prelims", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 3, topic: "Cycle 1: Indian Polity Day 3", subtitle: "DPSP & Duties", gs: "Prelims", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 4, topic: "Cycle 1: Indian Polity Day 4", subtitle: "Union Executive", gs: "Prelims", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 5, topic: "Cycle 1: Indian Polity Day 5", subtitle: "Parliament", gs: "Prelims", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 6, topic: "Cycle 1: Indian Polity Day 6", subtitle: "Judiciary", gs: "Prelims", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 7, topic: "Cycle 1: Indian Polity Day 7", subtitle: "State Government", gs: "Prelims", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 8, topic: "Cycle 1: Indian Polity Day 8", subtitle: "Local Government", gs: "Prelims", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 9, topic: "Cycle 1: Indian Polity Day 9", subtitle: "Constitutional Bodies", gs: "Prelims", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 10, topic: "Cycle 1: Indian Polity Day 10", subtitle: "Review & Practice", gs: "Prelims", color: "bg-blue-500 text-white dark:bg-blue-700" },
            { date: 11, topic: "Cycle 2: Modern History Day 1", subtitle: "British Expansion", gs: "Prelims", color: "bg-amber-500 text-white dark:bg-amber-700" },
            { date: 12, topic: "Cycle 2: Modern History Day 2", subtitle: "1857 Revolt", gs: "Prelims", color: "bg-amber-500 text-white dark:bg-amber-700" },
            { date: 13, topic: "Cycle 2: Modern History Day 3", subtitle: "Social Reform", gs: "Prelims", color: "bg-amber-500 text-white dark:bg-amber-700" },
            { date: 14, topic: "Cycle 2: Modern History Day 4", subtitle: "Early Nationalism", gs: "Prelims", color: "bg-amber-500 text-white dark:bg-amber-700" },
            { date: 15, topic: "Cycle 2: Modern History Day 5", subtitle: "Gandhi Era", gs: "Prelims", color: "bg-amber-500 text-white dark:bg-amber-700" },
            { date: 16, topic: "Cycle 2: Modern History Day 6", subtitle: "Revolutionary Movements", gs: "Prelims", color: "bg-amber-500 text-white dark:bg-amber-700" },
            { date: 17, topic: "Cycle 2: Modern History Day 7", subtitle: "Quit India", gs: "Prelims", color: "bg-amber-500 text-white dark:bg-amber-700" },
            { date: 18, topic: "Cycle 2: Modern History Day 8", subtitle: "Partition & Independence", gs: "Prelims", color: "bg-amber-500 text-white dark:bg-amber-700" },
            { date: 19, topic: "Cycle 2: Modern History Day 9", subtitle: "Integration", gs: "Prelims", color: "bg-amber-500 text-white dark:bg-amber-700" },
            { date: 20, topic: "Cycle 2: Modern History Day 10", subtitle: "Review & Practice", gs: "Prelims", color: "bg-amber-500 text-white dark:bg-amber-700" },
            { date: 21, topic: "Cycle 3: Geography Day 1", subtitle: "Physical Geography", gs: "Prelims", color: "bg-green-500 text-white dark:bg-green-700" },
            { date: 22, topic: "Cycle 3: Geography Day 2", subtitle: "Climate", gs: "Prelims", color: "bg-green-500 text-white dark:bg-green-700" },
            { date: 23, topic: "Cycle 3: Geography Day 3", subtitle: "Drainage", gs: "Prelims", color: "bg-green-500 text-white dark:bg-green-700" },
            { date: 24, topic: "Cycle 3: Geography Day 4", subtitle: "Natural Vegetation", gs: "Prelims", color: "bg-green-500 text-white dark:bg-green-700" },
            { date: 25, topic: "Cycle 3: Geography Day 5", subtitle: "Soils & Minerals", gs: "Prelims", color: "bg-green-500 text-white dark:bg-green-700" },
            { date: 26, topic: "Cycle 3: Geography Day 6", subtitle: "Agriculture", gs: "Prelims", color: "bg-green-500 text-white dark:bg-green-700" },
            { date: 27, topic: "Cycle 3: Geography Day 7", subtitle: "Industries", gs: "Prelims", color: "bg-green-500 text-white dark:bg-green-700" },
            { date: 28, topic: "Cycle 3: Geography Day 8", subtitle: "Transport", gs: "Prelims", color: "bg-green-500 text-white dark:bg-green-700" },
            { date: 29, topic: "Cycle 3: Geography Day 9", subtitle: "Maps", gs: "Prelims", color: "bg-green-500 text-white dark:bg-green-700" },
            { date: 30, topic: "Cycle 3: Geography Day 10", subtitle: "Review & Practice", gs: "Prelims", color: "bg-green-500 text-white dark:bg-green-700" },
            { date: 31, topic: "Cycle 4: Economy Day 1", subtitle: "GDP & Growth", gs: "Prelims", color: "bg-purple-500 text-white dark:bg-purple-700" },
        ]
    },
    february: {
        name: "February",
        year: 2026,
        status: TRIAL_MODE ? "ongoing" : "locked",
        days: [
            { date: 1, topic: "Cycle 4: Economy Day 2", subtitle: "Budget Basics", gs: "Prelims", color: "bg-purple-500 text-white dark:bg-purple-700" },
            { date: 2, topic: "Cycle 4: Economy Day 3", subtitle: "Banking & RBI", gs: "Prelims", color: "bg-purple-500 text-white dark:bg-purple-700" },
            { date: 3, topic: "Cycle 4: Economy Day 4", subtitle: "Inflation & Monetary", gs: "Prelims", color: "bg-purple-500 text-white dark:bg-purple-700" },
            { date: 4, topic: "Cycle 4: Economy Day 5", subtitle: "Fiscal Policy", gs: "Prelims", color: "bg-purple-500 text-white dark:bg-purple-700" },
            { date: 5, topic: "Cycle 4: Economy Day 6", subtitle: "External Sector", gs: "Prelims", color: "bg-purple-500 text-white dark:bg-purple-700" },
            { date: 6, topic: "Cycle 4: Economy Day 7", subtitle: "Planning", gs: "Prelims", color: "bg-purple-500 text-white dark:bg-purple-700" },
            { date: 7, topic: "Cycle 4: Economy Day 8", subtitle: "Poverty & Schemes", gs: "Prelims", color: "bg-purple-500 text-white dark:bg-purple-700" },
            { date: 8, topic: "Cycle 4: Economy Day 9", subtitle: "Agriculture Economy", gs: "Prelims", color: "bg-purple-500 text-white dark:bg-purple-700" },
            { date: 9, topic: "Cycle 4: Economy Day 10", subtitle: "Review & Practice", gs: "Prelims", color: "bg-purple-500 text-white dark:bg-purple-700" },
            { date: 10, topic: "Cycle 5: Environment Day 1", subtitle: "Ecology Basics", gs: "Prelims", color: "bg-emerald-500 text-white dark:bg-emerald-700" },
            { date: 11, topic: "Cycle 5: Environment Day 2", subtitle: "Biodiversity", gs: "Prelims", color: "bg-emerald-500 text-white dark:bg-emerald-700" },
            { date: 12, topic: "Cycle 5: Environment Day 3", subtitle: "Protected Areas", gs: "Prelims", color: "bg-emerald-500 text-white dark:bg-emerald-700" },
            { date: 13, topic: "Cycle 5: Environment Day 4", subtitle: "Conservation", gs: "Prelims", color: "bg-emerald-500 text-white dark:bg-emerald-700" },
            { date: 14, topic: "Cycle 5: Environment Day 5", subtitle: "Pollution", gs: "Prelims", color: "bg-emerald-500 text-white dark:bg-emerald-700" },
            { date: 15, topic: "Cycle 5: Environment Day 6", subtitle: "Climate Change", gs: "Prelims", color: "bg-emerald-500 text-white dark:bg-emerald-700" },
            { date: 16, topic: "Cycle 5: Environment Day 7", subtitle: "Acts & Policies", gs: "Prelims", color: "bg-emerald-500 text-white dark:bg-emerald-700" },
            { date: 17, topic: "Cycle 5: Environment Day 8", subtitle: "Conferences", gs: "Prelims", color: "bg-emerald-500 text-white dark:bg-emerald-700" },
            { date: 18, topic: "Cycle 5: Environment Day 9", subtitle: "Species in News", gs: "Prelims", color: "bg-emerald-500 text-white dark:bg-emerald-700" },
            { date: 19, topic: "Cycle 5: Environment Day 10", subtitle: "Review & Practice", gs: "Prelims", color: "bg-emerald-500 text-white dark:bg-emerald-700" },
            { date: 20, topic: "Cycle 6: Sci & Tech Day 1", subtitle: "Space", gs: "Prelims", color: "bg-cyan-500 text-white dark:bg-cyan-700" },
            { date: 21, topic: "Cycle 6: Sci & Tech Day 2", subtitle: "Defence", gs: "Prelims", color: "bg-cyan-500 text-white dark:bg-cyan-700" },
            { date: 22, topic: "Cycle 6: Sci & Tech Day 3", subtitle: "Nuclear", gs: "Prelims", color: "bg-cyan-500 text-white dark:bg-cyan-700" },
            { date: 23, topic: "Cycle 6: Sci & Tech Day 4", subtitle: "IT & AI", gs: "Prelims", color: "bg-cyan-500 text-white dark:bg-cyan-700" },
            { date: 24, topic: "Cycle 6: Sci & Tech Day 5", subtitle: "Biotech", gs: "Prelims", color: "bg-cyan-500 text-white dark:bg-cyan-700" },
            { date: 25, topic: "Cycle 6: Sci & Tech Day 6", subtitle: "Health & Medicine", gs: "Prelims", color: "bg-cyan-500 text-white dark:bg-cyan-700" },
            { date: 26, topic: "Cycle 6: Sci & Tech Day 7", subtitle: "Nanotechnology", gs: "Prelims", color: "bg-cyan-500 text-white dark:bg-cyan-700" },
            { date: 27, topic: "Cycle 6: Sci & Tech Day 8", subtitle: "Robotics", gs: "Prelims", color: "bg-cyan-500 text-white dark:bg-cyan-700" },
            { date: 28, topic: "Cycle 6: Sci & Tech Day 9", subtitle: "Current S&T", gs: "Prelims", color: "bg-cyan-500 text-white dark:bg-cyan-700" },
        ]
    },
    march: {
        name: "March",
        year: 2026,
        status: TRIAL_MODE ? "ongoing" : "locked",
        days: [
            { date: 1, topic: "Cycle 6: Sci & Tech Day 10", subtitle: "Review & Practice", gs: "Prelims", color: "bg-cyan-500 text-white dark:bg-cyan-700" },
            { date: 2, topic: "Cycle 7: Ancient & Medieval Day 1", subtitle: "Indus Valley", gs: "Prelims", color: "bg-orange-500 text-white dark:bg-orange-700" },
            { date: 3, topic: "Cycle 7: Ancient & Medieval Day 2", subtitle: "Vedic Period", gs: "Prelims", color: "bg-orange-500 text-white dark:bg-orange-700" },
            { date: 4, topic: "Cycle 7: Ancient & Medieval Day 3", subtitle: "Mauryas", gs: "Prelims", color: "bg-orange-500 text-white dark:bg-orange-700" },
            { date: 5, topic: "Cycle 7: Ancient & Medieval Day 4", subtitle: "Post-Maurya", gs: "Prelims", color: "bg-orange-500 text-white dark:bg-orange-700" },
            { date: 6, topic: "Cycle 7: Ancient & Medieval Day 5", subtitle: "Guptas", gs: "Prelims", color: "bg-orange-500 text-white dark:bg-orange-700" },
            { date: 7, topic: "Cycle 7: Ancient & Medieval Day 6", subtitle: "Delhi Sultanate", gs: "Prelims", color: "bg-orange-500 text-white dark:bg-orange-700" },
            { date: 8, topic: "Cycle 7: Ancient & Medieval Day 7", subtitle: "Mughals", gs: "Prelims", color: "bg-orange-500 text-white dark:bg-orange-700" },
            { date: 9, topic: "Cycle 7: Ancient & Medieval Day 8", subtitle: "Art & Culture", gs: "Prelims", color: "bg-orange-500 text-white dark:bg-orange-700" },
            { date: 10, topic: "Cycle 7: Ancient & Medieval Day 9", subtitle: "Religion & Philosophy", gs: "Prelims", color: "bg-orange-500 text-white dark:bg-orange-700" },
            { date: 11, topic: "Cycle 7: Ancient & Medieval Day 10", subtitle: "Review & Practice", gs: "Prelims", color: "bg-orange-500 text-white dark:bg-orange-700" },
            { date: 12, topic: "Cycle 8: IR Day 1", subtitle: "India & Neighbors", gs: "Prelims", color: "bg-rose-500 text-white dark:bg-rose-700" },
            { date: 13, topic: "Cycle 8: IR Day 2", subtitle: "India-China", gs: "Prelims", color: "bg-rose-500 text-white dark:bg-rose-700" },
            { date: 14, topic: "Cycle 8: IR Day 3", subtitle: "India-Pak", gs: "Prelims", color: "bg-rose-500 text-white dark:bg-rose-700" },
            { date: 15, topic: "Cycle 8: IR Day 4", subtitle: "India-US", gs: "Prelims", color: "bg-rose-500 text-white dark:bg-rose-700" },
            { date: 16, topic: "Cycle 8: IR Day 5", subtitle: "Groupings QUAD/BRICS", gs: "Prelims", color: "bg-rose-500 text-white dark:bg-rose-700" },
            { date: 17, topic: "Cycle 8: IR Day 6", subtitle: "UN & Agencies", gs: "Prelims", color: "bg-rose-500 text-white dark:bg-rose-700" },
            { date: 18, topic: "Cycle 8: IR Day 7", subtitle: "Maritime Issues", gs: "Prelims", color: "bg-rose-500 text-white dark:bg-rose-700" },
            { date: 19, topic: "Cycle 8: IR Day 8", subtitle: "Treaties", gs: "Prelims", color: "bg-rose-500 text-white dark:bg-rose-700" },
            { date: 20, topic: "Cycle 8: IR Day 9", subtitle: "Current Affairs", gs: "Prelims", color: "bg-rose-500 text-white dark:bg-rose-700" },
            { date: 21, topic: "Cycle 8: IR Day 10", subtitle: "Review & Practice", gs: "Prelims", color: "bg-rose-500 text-white dark:bg-rose-700" },
            { date: 22, topic: "Cycle 9: Revision Day 1", subtitle: "Polity Revision", gs: "Prelims", color: "bg-indigo-500 text-white dark:bg-indigo-700" },
            { date: 23, topic: "Cycle 9: Revision Day 2", subtitle: "History Revision", gs: "Prelims", color: "bg-indigo-500 text-white dark:bg-indigo-700" },
            { date: 24, topic: "Cycle 9: Revision Day 3", subtitle: "Geography Revision", gs: "Prelims", color: "bg-indigo-500 text-white dark:bg-indigo-700" },
            { date: 25, topic: "Cycle 9: Revision Day 4", subtitle: "Economy Revision", gs: "Prelims", color: "bg-indigo-500 text-white dark:bg-indigo-700" },
            { date: 26, topic: "Cycle 9: Revision Day 5", subtitle: "Environment Revision", gs: "Prelims", color: "bg-indigo-500 text-white dark:bg-indigo-700" },
            { date: 27, topic: "Cycle 9: Revision Day 6", subtitle: "S&T Revision", gs: "Prelims", color: "bg-indigo-500 text-white dark:bg-indigo-700" },
            { date: 28, topic: "Cycle 9: Revision Day 7", subtitle: "Mock Test 1", gs: "Prelims", color: "bg-indigo-500 text-white dark:bg-indigo-700" },
            { date: 29, topic: "Cycle 9: Revision Day 8", subtitle: "Mock Test 2", gs: "Prelims", color: "bg-indigo-500 text-white dark:bg-indigo-700" },
            { date: 30, topic: "Cycle 9: Revision Day 9", subtitle: "Mock Test 3", gs: "Prelims", color: "bg-indigo-500 text-white dark:bg-indigo-700" },
            { date: 31, topic: "Cycle 9: Revision Day 10", subtitle: "Final Review", gs: "Prelims", color: "bg-indigo-500 text-white dark:bg-indigo-700" },
        ]
    },
    april: {
        name: "April",
        year: 2026,
        status: TRIAL_MODE ? "ongoing" : "locked",
        days: [
            { date: 1, topic: "Mock Test Series Day 1", subtitle: "", gs: "", color: "bg-purple-100 dark:bg-purple-900/30" },
            // Add more days as needed
        ]
    },
    may: {
        name: "May",
        year: 2026,
        status: TRIAL_MODE ? "ongoing" : "locked",
        days: [
            { date: 1, topic: "Final Preparation Day 1", subtitle: "", gs: "", color: "bg-pink-200 dark:bg-pink-800" },
            // Add more days as needed
        ]
    }
};

export default function PlannerPage() {
    const [selectedMonth, setSelectedMonth] = useState<keyof typeof monthlySchedules>("december");
    const [unlockedDays, setUnlockedDays] = useState<Set<string>>(new Set());
    const currentSchedule = monthlySchedules[selectedMonth];

    useEffect(() => {
        // Calculate unlocked days on mount and when month changes
        const unlocked = new Set<string>();
        const monthIndex = {
            august: 7, september: 8, october: 9, november: 10, december: 11,
            january: 0, february: 1, march: 2, april: 3, may: 4
        };

        currentSchedule.days.forEach(day => {
            if (isDayUnlocked(currentSchedule.year, monthIndex[selectedMonth], day.date)) {
                unlocked.add(`${day.date}`);
            }
        });

        setUnlockedDays(unlocked);
    }, [selectedMonth, currentSchedule]);

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const monthIndex = {
        august: 7, september: 8, october: 9, november: 10, december: 11,
        january: 0, february: 1, march: 2, april: 3, may: 4
    };

    const firstDay = getFirstDayOfMonth(currentSchedule.year, monthIndex[selectedMonth]);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const handleDayClick = (day: any, e: React.MouseEvent) => {
        const isUnlocked = unlockedDays.has(`${day.date}`);
        if (!isUnlocked || currentSchedule.status === "locked") {
            e.preventDefault();
            alert("This day is locked. Complete previous days to unlock.");
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Batch 01 - Study Planner</h1>
                    <p className="text-gray-700 dark:text-gray-300">Progressive unlock system - Complete each day to unlock the next</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium">GS1</span>
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-sm font-medium">GS2</span>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-sm font-medium">GS3</span>
                    <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 text-sm font-medium">GS4</span>
                    <Link href="/student/batch1">
                        <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm font-medium cursor-pointer hover:bg-indigo-700 transition-colors">Prelims →</span>
                    </Link>
                </div>
            </div>

            {/* Month Tabs */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(monthlySchedules).map(([key, month]) => (
                    <Button
                        key={key}
                        variant={selectedMonth === key ? "default" : "outline"}
                        onClick={() => setSelectedMonth(key as keyof typeof monthlySchedules)}
                        className="relative"
                        disabled={month.status === "locked"}
                    >
                        {month.name} {month.year}
                        {month.status === "completed" && (
                            <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                        )}
                        {month.status === "ongoing" && (
                            <span className="ml-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        )}
                        {month.status === "locked" && (
                            <Lock className="ml-2 h-4 w-4 text-gray-400" />
                        )}
                    </Button>
                ))}
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
                {currentSchedule.status === "completed" ? (
                    <span className="px-4 py-2 rounded-lg bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-semibold flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Completed
                    </span>
                ) : currentSchedule.status === "ongoing" ? (
                    <span className="px-4 py-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-semibold flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Ongoing
                    </span>
                ) : (
                    <span className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 font-semibold flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Locked - Complete previous months first
                    </span>
                )}
            </div>

            {/* Calendar Grid */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{currentSchedule.name} {currentSchedule.year}</CardTitle>
                </CardHeader>
                <CardContent className="p-2 md:p-6">
                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                        {daysOfWeek.map(day => (
                            <div key={day} className="text-center font-semibold text-xs md:text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                                {day.slice(0, 3)}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1 md:gap-2">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square"></div>
                        ))}

                        {/* Actual days */}
                        {currentSchedule.days.map((day) => {
                            const isUnlocked = unlockedDays.has(`${day.date}`) && currentSchedule.status !== "locked";

                            // For Prelims days (Jan/Feb/Mar), redirect to prelims learning flow
                            let dayHref = `/student/planner/daily-schedule/${currentSchedule.year}-${String(monthIndex[selectedMonth] + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;

                            if (day.gs === "Prelims") {
                                // Calculate cycle and day number from topic
                                // Topics are like "Cycle 1: Indian Polity Day 1"
                                const cycleMatch = day.topic.match(/Cycle (\d+)/);
                                const dayMatch = day.topic.match(/Day (\d+)/);
                                if (cycleMatch && dayMatch) {
                                    const cycleNum = parseInt(cycleMatch[1]);
                                    const dayNum = parseInt(dayMatch[1]);
                                    dayHref = `/student/batch1/cycle/${cycleNum}/day/${dayNum}/part/1`;
                                }
                            }

                            const dayContent = (
                                <div className={`h-full ${day.color} rounded-lg p-1 md:p-2 ${isUnlocked ? 'hover:ring-2 hover:ring-primary cursor-pointer' : 'opacity-50 cursor-not-allowed'} transition-all flex flex-col justify-between relative`}>
                                    {!isUnlocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                                            <Lock className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs md:text-sm font-bold">{day.date}</span>
                                        {day.gs && (
                                            <span className="text-[8px] md:text-[10px] font-bold px-1 py-0.5 rounded bg-white/50 dark:bg-black/30">
                                                {day.gs}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-[8px] md:text-xs font-medium leading-tight line-clamp-2 md:line-clamp-3">
                                        {day.topic}
                                    </div>
                                </div>
                            );

                            return isUnlocked ? (
                                <Link
                                    key={day.date}
                                    href={dayHref}
                                    className="aspect-square"
                                >
                                    {dayContent}
                                </Link>
                            ) : (
                                <div
                                    key={day.date}
                                    className="aspect-square"
                                    onClick={(e) => handleDayClick(day, e)}
                                >
                                    {dayContent}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

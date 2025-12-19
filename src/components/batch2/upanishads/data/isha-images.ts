// Image mappings for Isha Upanishad shlokas
// Generated using Nano Banana Pro AI - Complete 18 shlokas

export const ISHA_SHLOKA_IMAGES: Record<number, string> = {
    // First batch - mystical art style
    1: "/assets/upanishads/isha/isha_shloka_1_1766041124260.png",
    2: "/assets/upanishads/isha/isha_shloka_2_1766041147165.png",
    3: "/assets/upanishads/isha/isha_shloka_3_1766043066742.png",
    4: "/assets/upanishads/isha/isha_shloka_4_1766045715536.png",
    5: "/assets/upanishads/isha/isha_shloka_5_1766045833089.png",
    6: "/assets/upanishads/isha/isha_shloka_6_1766045358148.png",
    7: "/assets/upanishads/isha/isha_shloka_7_1766045587416.png",
    8: "/assets/upanishads/isha/isha_shloka_8_1766045982389.png",
    9: "/assets/upanishads/isha/isha_shloka_9_1766046135768.png",

    // Infographic/Flowchart style images
    10: "/assets/upanishads/isha/isha_shloka_10_flowchart_1766055765683.png",
    11: "/assets/upanishads/isha/isha_shloka_11_flowchart_1766055785390.png",
    12: "/assets/upanishads/isha/isha_shloka_12_flowchart_1766055826963.png",
    13: "/assets/upanishads/isha/isha_shloka_13_flowchart_1766055848312.png",
    14: "/assets/upanishads/isha/isha_shloka_14_flowchart_1766055870697.png",

    // Closing shlokas
    15: "/assets/upanishads/isha/isha_shloka_15_1766041170238.png",
    16: "/assets/upanishads/isha/isha_shloka_16_1766041187834.png",
    17: "/assets/upanishads/isha/isha_shloka_17_flowchart_1766055912212.png",
    18: "/assets/upanishads/isha/isha_shloka_18_1766041209304.png",
};

export function getShlokaImage(shlokaNumber: number): string | null {
    return ISHA_SHLOKA_IMAGES[shlokaNumber] || null;
}

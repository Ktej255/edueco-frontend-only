// Kena Upanishad Image Mapping
// Maps shloka IDs and story step IDs to their generated image paths

export const KENA_IMAGES: Record<number, string> = {
    // CHUNK 1: THE INQUIRY
    1: "/assets/upanishads/kena/kena_shloka_1_1766057519391.png", // Mind's source
    2: "/assets/upanishads/kena/kena_sensor_behind_sensors.png", // Placeholder

    // CHUNK 3: THE STORY
    19: "/assets/upanishads/kena/kena_agni_straw_1766057630739.png", // Agni fail
    24: "/assets/upanishads/kena/kena_vayu_straw.png", // Vayu fail
    27: "/assets/upanishads/kena/kena_uma_revelation_1766060664728.png", // Uma appears
    32: "/assets/upanishads/kena/kena_lightning_1766060684813.png", // Lightning analogy
    33: "/assets/upanishads/kena/kena_three_pillars.png", // Foundation
    34: "/assets/upanishads/kena/kena_liberation_1766060700780.png", // Final liberation
};

export const getKenaShlokaImage = (id: number): string | null => {
    return KENA_IMAGES[id] || null;
};

export const KENA_HEADER_BG = "/assets/upanishads/kena/kena_header_bg_1766057445730.png";

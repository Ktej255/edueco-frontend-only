export interface Upanishad {
    id: string;
    number: number;
    name: string;
    veda: "Rigveda" | "Yajurveda" | "Samaveda" | "Atharvaveda";
    category: "Mukhya" | "Samanya" | "Sannyasa" | "Shakta" | "Vaishnava" | "Shaiva" | "Yoga";
    description?: string;
}

export const upanishads: Upanishad[] = [
    // Mukhya (Principal) Upanishads
    { number: 1, id: "isa", name: "Isha", veda: "Yajurveda", category: "Mukhya", description: "Learn about the divinity inherent in all things." },
    { number: 2, id: "kena", name: "Kena", veda: "Samaveda", category: "Mukhya", description: "Explore the nature of Brahman and knowledge." },
    { number: 3, id: "katha", name: "Katha", veda: "Yajurveda", category: "Mukhya", description: "The story of Nachiketa and the secrets of death." },
    { number: 4, id: "prasna", name: "Prashna", veda: "Atharvaveda", category: "Mukhya", description: "Six questions about the source of life." },
    { number: 5, id: "mundaka", name: "Mundaka", veda: "Atharvaveda", category: "Mukhya", description: "Distinction between higher and lower knowledge." },
    { number: 6, id: "mandukya", name: "Mandukya", veda: "Atharvaveda", category: "Mukhya", description: "Analysis of Om and the four states of consciousness." },
    { number: 7, id: "taittiriya", name: "Taittiriya", veda: "Yajurveda", category: "Mukhya", description: "Levels of reality (Koshas) and self-realization." },
    { number: 8, id: "aitareya", name: "Aitareya", veda: "Rigveda", category: "Mukhya", description: "Creation of the universe and consciousness." },
    { number: 9, id: "chandogya", name: "Chandogya", veda: "Samaveda", category: "Mukhya", description: "Meditation on Om and the statement 'Tat Tvam Asi'." },
    { number: 10, id: "brihadaranyaka", name: "Brihadaranyaka", veda: "Yajurveda", category: "Mukhya", description: "One of the oldest; deep philosophical debates." },

    // Samanya (General)
    { number: 11, id: "svetasvatara", name: "Shvetashvatara", veda: "Yajurveda", category: "Shaiva" },
    { number: 12, id: "kaushitaki", name: "Kaushitaki", veda: "Rigveda", category: "Samanya" },
    { number: 13, id: "maitrayani", name: "Maitrayani", veda: "Samaveda", category: "Samanya" },
    { number: 14, id: "kaivalya", name: "Kaivalya", veda: "Yajurveda", category: "Shaiva" },
    { number: 15, id: "jabala", name: "Jabala", veda: "Yajurveda", category: "Sannyasa" },

    // Yoga Upanishads
    { number: 16, id: "yogatattva", name: "Yogatattva", veda: "Yajurveda", category: "Yoga" },
    { number: 17, id: "nadabindu", name: "Nadabindu", veda: "Rigveda", category: "Yoga" },
    { number: 18, id: "hamsaupanishad", name: "Hamsa", veda: "Yajurveda", category: "Yoga" }, // Fixed ID to avoid conflict if any
    { number: 19, id: "amritabindu", name: "Amritabindu", veda: "Atharvaveda", category: "Yoga" },

    // Sannyasa Upanishads
    { number: 20, id: "aruni", name: "Aruni", veda: "Samaveda", category: "Sannyasa" },
    { number: 21, id: "paramahamsa", name: "Paramahamsa", veda: "Yajurveda", category: "Sannyasa" },

    // Vaishnava
    { number: 22, id: "narayana", name: "Narayana", veda: "Yajurveda", category: "Vaishnava" },
    { number: 23, id: "nrsimhatapani", name: "Nrsimha Tapani", veda: "Atharvaveda", category: "Vaishnava" },

    // Shaiva
    { number: 24, id: "atharvasiras", name: "Atharvashiras", veda: "Atharvaveda", category: "Shaiva" },
    { number: 25, id: "atharvasikha", name: "Atharvashikha", veda: "Atharvaveda", category: "Shaiva" },

    // Shakta
    { number: 26, id: "sita", name: "Sita", veda: "Atharvaveda", category: "Shakta" },
    { number: 27, id: "tripuratapini", name: "Tripura Tapini", veda: "Atharvaveda", category: "Shakta" },

    // Placeholder generation for the rest to simulate full 108 list for UI development
    // In a real scenario, we would populate this with the exact canonical list.
    ...Array.from({ length: 81 }).map((_, i) => ({
        number: 28 + i,
        id: `upanishad-${28 + i}`,
        name: `Upanishad ${28 + i}`,
        veda: ["Rigveda", "Yajurveda", "Samaveda", "Atharvaveda"][i % 4] as any,
        category: ["Samanya", "Sannyasa", "Shakta", "Vaishnava", "Shaiva", "Yoga"][i % 6] as any,
    })),
];

// Knowledge Graph Data Structure
// Complete hierarchy of Vedic/Hindu philosophical texts
// Based on the four-axis layout: ŚRUTI, PRASṬHĀNA TRAYA, SMṚTI, SAHĀYAK PATHYA

export type NodeCategory =
    | "sruti"           // ŚRUTI (left vertical) - Revealed knowledge
    | "prasthana-traya" // PRASṬHĀNA TRAYA (right vertical) - Three canonical foundations
    | "smriti"          // SMṚTI (left-lower) - Remembered texts
    | "sahayak-pathya"  // SAHĀYAK PATHYA (right-lower) - Auxiliary sciences
    | "central";        // Central spine - Flow of knowledge

export type EdgeType = "derivation" | "classification" | "convergence" | "branch";

// Point for bend points and positions
export interface Point {
    x: number;
    y: number;
}

export interface KnowledgeNode {
    id: string;
    label: string;
    sublabel?: string;
    description?: string;
    category: NodeCategory;
    section?: string;
    color: string;
    size: "xl" | "lg" | "md" | "sm" | "xs";
    row: number;      // Logical row for vertical positioning (0 = top)
    column: number;   // Logical column within category (-2 to 2, 0 = center)
    linkedTexts?: string[];  // For expandable lists (Puranas, etc.)
    vedaLink?: string;       // Which Veda this belongs to
    // Custom overrides (set by editor)
    customX?: number;        // Override calculated X position
    customY?: number;        // Override calculated Y position
    customWidth?: number;    // Override calculated width
    customHeight?: number;   // Override calculated height
}

export interface KnowledgeEdge {
    from: string;
    to: string;
    type: EdgeType;
    label?: string;
    bendPoints?: Point[];   // Manual control points for edge routing
}

// ==========================================
// ALL NODES - Organized by Section
// ==========================================

export const knowledgeNodes: KnowledgeNode[] = [
    // ========== TOP SECTION: BRAHMAN → VEDAS ==========
    {
        id: "brahman",
        label: "BRAHMAN",
        sublabel: "Divine Source (Eternal)",
        description: "The Absolute Reality, the ultimate source of all knowledge",
        category: "central",
        color: "#C4A35A",
        size: "xl",
        row: 0,
        column: 0,
    },
    {
        id: "vedas",
        label: "VEDAS",
        sublabel: "c. 1500 BCE",
        description: "The foundational divine hymns, considered apaurusheya (not of human origin)",
        category: "central",
        section: "sruti",
        color: "#E07B39",
        size: "lg",
        row: 1,
        column: 0,
    },

    // ========== FOUR VEDAS ==========
    {
        id: "rig-veda",
        label: "Ṛg Veda",
        sublabel: "The Foundational of Divine Hymns",
        description: "The oldest Veda, containing 1028 hymns (suktas) to the deities",
        category: "sruti",
        color: "#E07B39",
        size: "sm",
        row: 2,
        column: -2,
    },
    {
        id: "sama-veda",
        label: "Sāma Veda",
        sublabel: "The Melodic Chants of Devotion",
        description: "The Veda of melodies and chants, primarily drawn from Rig Veda",
        category: "sruti",
        color: "#E07B39",
        size: "sm",
        row: 2,
        column: -1,
    },
    {
        id: "yajur-veda",
        label: "Yajur Veda",
        sublabel: "The Ritualistic Scripture",
        description: "The Veda of ritual formulas and procedures for yajna",
        category: "sruti",
        color: "#E07B39",
        size: "sm",
        row: 2,
        column: 1,
    },
    {
        id: "atharva-veda",
        label: "Atharva Veda",
        sublabel: "The Repository of Mystical Wisdom",
        description: "The Veda of applied knowledge, spells, and philosophical hymns",
        category: "sruti",
        color: "#E07B39",
        size: "sm",
        row: 2,
        column: 2,
    },

    // ========== VEDIC INTERNAL DIVISIONS ==========
    {
        id: "karma-kand",
        label: "Karma Kāṇḍa",
        sublabel: "Ritualistic Section",
        description: "The portion of Vedas dealing with rituals and actions",
        category: "sruti",
        color: "#D4C4A8",
        size: "sm",
        row: 3,
        column: -1,
    },
    {
        id: "jnana-kand",
        label: "Jñāna Kāṇḍa",
        sublabel: "Knowledge Section",
        description: "The portion of Vedas dealing with spiritual wisdom",
        category: "sruti",
        color: "#E8B98D",
        size: "sm",
        row: 3,
        column: 1,
    },

    // ========== KARMA KAND SUBDIVISIONS ==========
    {
        id: "samhitas",
        label: "Saṁhitās",
        sublabel: "Hymns/Mantras",
        description: "Collections of mantras and hymns",
        category: "sruti",
        color: "#D4C4A8",
        size: "xs",
        row: 4,
        column: -2,
    },
    {
        id: "brahmanas",
        label: "Brāhmaṇas",
        sublabel: "Ritual Commentaries",
        description: "Prose texts explaining the procedures and meaning of rituals",
        category: "sruti",
        color: "#D4C4A8",
        size: "xs",
        row: 4,
        column: -1,
    },

    // ========== JNANA KAND SUBDIVISIONS ==========
    {
        id: "aranyakas",
        label: "Āraṇyakas",
        sublabel: "Forest Texts",
        description: "Philosophical interpretations for forest-dwelling hermits",
        category: "sruti",
        color: "#E8B98D",
        size: "xs",
        row: 4,
        column: 0,
    },
    {
        id: "upanishads",
        label: "UPANIṢADS",
        sublabel: "Philosophical/Mystical Texts",
        description: "The philosophical core of Vedas, discussing Brahman and Atman",
        category: "sruti",
        section: "prasthana-traya",
        color: "#E8B98D",
        size: "lg",
        row: 4,
        column: 1,
    },

    // ========== 10 PRINCIPAL UPANISHADS ==========
    {
        id: "isa-upanishad",
        label: "Īśa",
        sublabel: "Rig Veda / Śukla Yajur",
        vedaLink: "yajur-veda",
        category: "prasthana-traya",
        color: "#E8B98D",
        size: "xs",
        row: 3,
        column: 2,
    },
    {
        id: "kena-upanishad",
        label: "Kena",
        sublabel: "Sāma Veda",
        vedaLink: "sama-veda",
        category: "prasthana-traya",
        color: "#E8B98D",
        size: "xs",
        row: 4,
        column: 2,
    },
    {
        id: "katha-upanishad",
        label: "Kaṭha",
        sublabel: "Kṛṣṇa Yajur Veda",
        vedaLink: "yajur-veda",
        category: "prasthana-traya",
        color: "#E8B98D",
        size: "xs",
        row: 3,
        column: 3,
    },
    {
        id: "prashna-upanishad",
        label: "Praśna",
        sublabel: "Atharva Veda",
        vedaLink: "atharva-veda",
        category: "prasthana-traya",
        color: "#E8B98D",
        size: "xs",
        row: 5,
        column: 2,
    },
    {
        id: "mundaka-upanishad",
        label: "Muṇḍaka",
        sublabel: "Atharva Veda",
        vedaLink: "atharva-veda",
        category: "prasthana-traya",
        color: "#E8B98D",
        size: "xs",
        row: 6,
        column: 2,
    },
    {
        id: "mandukya-upanishad",
        label: "Māṇḍūkya",
        sublabel: "Atharva Veda",
        vedaLink: "atharva-veda",
        category: "prasthana-traya",
        color: "#E8B98D",
        size: "xs",
        row: 7,
        column: 2,
    },
    {
        id: "taittiriya-upanishad",
        label: "Taittirīya",
        sublabel: "Kṛṣṇa Yajur Veda",
        vedaLink: "yajur-veda",
        category: "prasthana-traya",
        color: "#E8B98D",
        size: "xs",
        row: 4,
        column: 3,
    },
    {
        id: "aitareya-upanishad",
        label: "Aitareya",
        sublabel: "Rig Veda",
        vedaLink: "rig-veda",
        category: "prasthana-traya",
        color: "#E8B98D",
        size: "xs",
        row: 5,
        column: 3,
    },
    {
        id: "chandogya-upanishad",
        label: "Chāndogya",
        sublabel: "Sāma Veda",
        vedaLink: "sama-veda",
        category: "prasthana-traya",
        color: "#E8B98D",
        size: "xs",
        row: 6,
        column: 3,
    },
    {
        id: "brihadaranyaka-upanishad",
        label: "Bṛhadāraṇyaka",
        sublabel: "Śukla Yajur Veda",
        vedaLink: "yajur-veda",
        category: "prasthana-traya",
        color: "#E8B98D",
        size: "xs",
        row: 7,
        column: 3,
    },

    // ========== ITIHĀSA (History/Epics) ==========
    {
        id: "itihas",
        label: "ITIHĀSA",
        sublabel: "History",
        description: "The two great epics of Indian tradition",
        category: "smriti",
        color: "#C94C4C",
        size: "lg",
        row: 5,
        column: 0,
    },
    {
        id: "ramayana",
        label: "Rāmāyaṇa",
        sublabel: "Valmiki",
        description: "The epic of Lord Rama, authored by Sage Valmiki",
        category: "smriti",
        color: "#C94C4C",
        size: "sm",
        row: 6,
        column: -1,
        linkedTexts: [
            "Bālakāṇḍa (Book of Youth)",
            "Ayodhyākāṇḍa (Book of Ayodhya)",
            "Araṇyakāṇḍa (Book of the Forest)",
            "Kiṣkindhākāṇḍa (Book of Kishkindha)",
            "Sundarakāṇḍa (Book of Beauty)",
            "Yuddhakāṇḍa (Book of War)",
            "Uttarakāṇḍa (Last Book)"
        ]
    },
    {
        id: "mahabharata",
        label: "Mahābhārata",
        sublabel: "Vyasa",
        description: "The great epic of the Bharata dynasty, authored by Sage Vyasa",
        category: "smriti",
        color: "#C94C4C",
        size: "sm",
        row: 6,
        column: 1,
    },
    {
        id: "bhagavad-gita",
        label: "Bhagavad Gītā",
        sublabel: "Part of Prasthāna Traya",
        description: "The divine song of Lord Krishna, part of Mahabharata",
        category: "smriti",
        section: "prasthana-traya",
        color: "#C4A35A",
        size: "md",
        row: 7,
        column: 1,
    },

    // ========== SMṚTI (Dharma Shastras) ==========
    {
        id: "dharma-shastras",
        label: "Dharma Śāstras",
        sublabel: "Law & Conduct",
        description: "Texts on religious and legal duty",
        category: "smriti",
        color: "#B8860B",
        size: "md",
        row: 8,
        column: -3,
    },
    {
        id: "manu-smriti",
        label: "Manu Smṛti",
        sublabel: "Laws of Manu",
        description: "The most authoritative dharmashastra text",
        category: "smriti",
        color: "#B8860B",
        size: "xs",
        row: 9,
        column: -4,
    },
    {
        id: "yajnavalkya-smriti",
        label: "Yājñavalkya Smṛti",
        description: "Second most important dharmashastra",
        category: "smriti",
        color: "#B8860B",
        size: "xs",
        row: 10,
        column: -4,
    },
    {
        id: "parashara-smriti",
        label: "Parāśara Smṛti",
        description: "Dharmashastra for Kali Yuga",
        category: "smriti",
        color: "#B8860B",
        size: "xs",
        row: 11,
        column: -4,
    },
    {
        id: "narada-smriti",
        label: "Nārada Smṛti",
        sublabel: "Judicial",
        description: "Focus on legal procedures and administration",
        category: "smriti",
        color: "#B8860B",
        size: "xs",
        row: 12,
        column: -4,
    },

    // ========== PURĀṆAS ==========
    {
        id: "puranas",
        label: "PURĀṆAS",
        sublabel: "Mythology",
        description: "Ancient lore, containing cosmology, genealogies, and stories",
        category: "smriti",
        color: "#9B6B9E",
        size: "lg",
        row: 10,
        column: -2,
        linkedTexts: [
            "1. Bhāgavata Purāṇa",
            "2. Liṅga Purāṇa",
            "3. Nārada Purāṇa",
            "4. Skanda Purāṇa",
            "5. Garuḍa Purāṇa",
            "6. Matsya Purāṇa",
            "7. Vāyu Purāṇa",
            "8. Bhaviṣya Purāṇa",
            "9. Brahmāṇḍa Purāṇa",
            "10. Brahma Purāṇa",
            "11. Padma Purāṇa",
            "12. Viṣṇu Purāṇa",
            "13. Śiva Purāṇa",
            "14. Vāmana Purāṇa",
            "15. Mārkaṇḍeya Purāṇa",
            "16. Varāha Purāṇa",
            "17. Agni Purāṇa",
            "18. Kūrma Purāṇa"
        ]
    },

    // ========== SŪTRA ==========
    {
        id: "sutra",
        label: "SŪTRA",
        sublabel: "Aphorisms",
        description: "Concise statements capturing essential teachings",
        category: "central",
        color: "#8B7355",
        size: "lg",
        row: 8,
        column: 0,
    },
    {
        id: "brahma-sutra",
        label: "Brahma Sūtra",
        sublabel: "Part of Prasthāna Traya",
        description: "Systematization of Upanishadic philosophy by Badarayana",
        category: "central",
        section: "prasthana-traya",
        color: "#8B7355",
        size: "md",
        row: 9,
        column: 0,
    },
    {
        id: "kalpa-sutra",
        label: "Kalpa Sūtra",
        sublabel: "Rituals",
        category: "sahayak-pathya",
        color: "#8B7355",
        size: "xs",
        row: 9,
        column: 1,
    },
    {
        id: "sulba-sutra",
        label: "Śulba Sūtra",
        sublabel: "Geometry",
        description: "Mathematical texts for altar construction",
        category: "sahayak-pathya",
        color: "#4A90A4",
        size: "xs",
        row: 10,
        column: 1,
    },
    {
        id: "dharma-sutra",
        label: "Dharma Sūtra",
        sublabel: "Duty/Conduct",
        category: "sahayak-pathya",
        color: "#8B7355",
        size: "xs",
        row: 9,
        column: 2,
    },
    {
        id: "grihya-sutra",
        label: "Gṛhya Sūtra",
        sublabel: "Public Rites",
        category: "sahayak-pathya",
        color: "#8B7355",
        size: "xs",
        row: 10,
        column: 2,
    },
    {
        id: "shrauta-sutra",
        label: "Śrauta Sūtra",
        sublabel: "Public Rites",
        category: "sahayak-pathya",
        color: "#8B7355",
        size: "xs",
        row: 11,
        column: 2,
    },

    // ========== DARŚANAS (Six Philosophical Systems) ==========
    {
        id: "darshanas",
        label: "DARŚANAS",
        sublabel: "Philosophy",
        description: "The six orthodox schools of Hindu philosophy",
        category: "central",
        color: "#5A8F7B",
        size: "lg",
        row: 10,
        column: 0,
    },
    {
        id: "samkhya",
        label: "Sāṅkhya",
        sublabel: "Kapila",
        description: "Dualistic philosophy of Purusha and Prakriti",
        category: "central",
        color: "#5A8F7B",
        size: "xs",
        row: 11,
        column: -2,
    },
    {
        id: "yoga",
        label: "Yoga",
        sublabel: "Patañjali",
        description: "Discipline of mind and body for liberation",
        category: "central",
        color: "#5A8F7B",
        size: "xs",
        row: 11,
        column: -1,
    },
    {
        id: "nyaya",
        label: "Nyāya",
        sublabel: "Gautama",
        description: "Logic and epistemology",
        category: "central",
        color: "#5A8F7B",
        size: "xs",
        row: 11,
        column: 0,
    },
    {
        id: "vaisheshika",
        label: "Vaiśeṣika",
        sublabel: "Kaṇāda",
        description: "Atomic theory and metaphysics",
        category: "central",
        color: "#5A8F7B",
        size: "xs",
        row: 11,
        column: 1,
    },
    {
        id: "purva-mimamsa",
        label: "Pūrva Mīmāṁsā",
        sublabel: "Jaimini",
        description: "Ritual interpretation and Vedic exegesis",
        category: "central",
        color: "#5A8F7B",
        size: "xs",
        row: 11,
        column: 2,
    },
    {
        id: "uttara-mimamsa",
        label: "Uttara Mīmāṁsā",
        sublabel: "Vedānta",
        description: "Philosophy based on Upanishads",
        category: "central",
        color: "#5A8F7B",
        size: "xs",
        row: 11,
        column: 3,
    },

    // ========== VEDĀNGAS (Six Limbs of Vedas) ==========
    {
        id: "vedangas",
        label: "VEDĀṄGAS",
        sublabel: "Veda's Limbs",
        description: "Six auxiliary disciplines for understanding Vedas",
        category: "sahayak-pathya",
        color: "#4A90A4",
        size: "lg",
        row: 8,
        column: 2,
    },
    {
        id: "shiksha",
        label: "Śikṣā",
        sublabel: "Phonetics",
        description: "Science of pronunciation and phonetics",
        category: "sahayak-pathya",
        color: "#4A90A4",
        size: "xs",
        row: 9,
        column: 3,
    },
    {
        id: "vyakarana",
        label: "Vyākaraṇa",
        sublabel: "Grammar",
        description: "Sanskrit grammar, particularly Panini's Ashtadhyayi",
        category: "sahayak-pathya",
        color: "#4A90A4",
        size: "xs",
        row: 10,
        column: 3,
    },
    {
        id: "chandas",
        label: "Chandas",
        sublabel: "Prosody",
        description: "Science of Vedic meters",
        category: "sahayak-pathya",
        color: "#4A90A4",
        size: "xs",
        row: 11,
        column: 3,
    },
    {
        id: "nirukta",
        label: "Nirukta",
        sublabel: "Etymology",
        description: "Science of word meanings and interpretation",
        category: "sahayak-pathya",
        color: "#4A90A4",
        size: "xs",
        row: 12,
        column: 3,
    },
    {
        id: "jyotisha",
        label: "Jyotiṣa",
        sublabel: "Astronomy",
        description: "Vedic astronomy for determining ritual timing",
        category: "sahayak-pathya",
        color: "#4A90A4",
        size: "xs",
        row: 12,
        column: 2,
    },
    {
        id: "kalpa",
        label: "Kalpa",
        sublabel: "Ritual",
        description: "Ritual procedures and temple construction",
        category: "sahayak-pathya",
        color: "#4A90A4",
        size: "xs",
        row: 13,
        column: 3,
    },

    // ========== UPAVEDAS (Applied Sciences) ==========
    {
        id: "upavedas",
        label: "UPAVEDAS",
        sublabel: "Applied Knowledge",
        description: "Four subsidiary Vedas of applied sciences",
        category: "smriti",
        color: "#6B8E23",
        size: "lg",
        row: 10,
        column: -2,
    },
    {
        id: "ayurveda",
        label: "Āyurveda",
        sublabel: "Medicine (Atharva Veda)",
        description: "Science of life and healing",
        category: "smriti",
        color: "#6B8E23",
        size: "sm",
        row: 11,
        column: -3,
    },
    {
        id: "dhanurveda",
        label: "Dhanurveda",
        sublabel: "Archery (Yajur Veda)",
        description: "Military science and martial arts",
        category: "smriti",
        color: "#6B8E23",
        size: "xs",
        row: 12,
        column: -3,
    },
    {
        id: "gandharvaveda",
        label: "Gāndharvaveda",
        sublabel: "Music/Dance (Sāma Veda)",
        description: "Music, dance, and performing arts",
        category: "smriti",
        color: "#6B8E23",
        size: "xs",
        row: 13,
        column: -3,
    },
    {
        id: "sthapatyaveda",
        label: "Sthāpatyaveda",
        sublabel: "Architecture (Rig Veda)",
        description: "Architecture, sculpture, and construction",
        category: "smriti",
        color: "#6B8E23",
        size: "xs",
        row: 14,
        column: -3,
    },

    // ========== ĀGAMAS / TANTRA ==========
    {
        id: "agamas",
        label: "ĀGAMAS",
        sublabel: "Tantric Texts",
        description: "Texts on temple worship, rituals, and philosophy",
        category: "smriti",
        color: "#D4A5A5",
        size: "lg",
        row: 12,
        column: -2,
    },
    {
        id: "shaiva-agama",
        label: "Śaiva",
        sublabel: "Śiva",
        description: "Texts focused on Lord Shiva",
        category: "smriti",
        color: "#D4A5A5",
        size: "xs",
        row: 13,
        column: -2,
    },
    {
        id: "vaishnava-agama",
        label: "Vaiṣṇava",
        sublabel: "Viṣṇu",
        description: "Texts focused on Lord Vishnu",
        category: "smriti",
        color: "#D4A5A5",
        size: "xs",
        row: 14,
        column: -2,
    },
    {
        id: "shakta-agama",
        label: "Śākta",
        sublabel: "Śakti",
        description: "Texts focused on the Divine Mother",
        category: "smriti",
        color: "#D4A5A5",
        size: "xs",
        row: 15,
        column: -2,
    },

    // ========== COMMENTARIES ==========
    {
        id: "bhashyam",
        label: "BHĀṢYAM",
        sublabel: "Primary Treatises",
        description: "Primary commentaries by great acharyas",
        category: "sahayak-pathya",
        color: "#9370DB",
        size: "lg",
        row: 13,
        column: 1,
    },
    {
        id: "prakarana",
        label: "PRAKARAṆA",
        sublabel: "Commentaries",
        description: "Independent philosophical treatises",
        category: "sahayak-pathya",
        color: "#708090",
        size: "md",
        row: 14,
        column: 2,
    },
    {
        id: "vartika",
        label: "Vārtika",
        sublabel: "Sub-commentaries",
        description: "Critical studies on primary commentaries",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 14,
        column: 1,
    },
    {
        id: "tika",
        label: "Ṭīkā",
        sublabel: "Glosses",
        description: "Explanatory glosses on texts",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 15,
        column: 1,
    },

    // ========== Additional Notable Texts from Image ==========
    {
        id: "smriti-section",
        label: "SMṚTI",
        sublabel: "Remembered Tradition",
        description: "Human-authored texts based on Vedic tradition",
        category: "smriti",
        color: "#B8860B",
        size: "lg",
        row: 5,
        column: -3,
    },
    {
        id: "vedanta",
        label: "VEDĀNTA",
        sublabel: "End of the Vedas",
        description: "The culmination of Vedic philosophy",
        category: "central",
        section: "prasthana-traya",
        color: "#5A8F7B",
        size: "lg",
        row: 9,
        column: -1,
    },

    // Prakarana Grantha (Independent Treatises) - commonly attributed to Adi Shankaracharya
    {
        id: "aparokshanubhuti",
        label: "Aparokṣānubhūti",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 15,
        column: 2,
    },
    {
        id: "atma-bodha",
        label: "Ātma Bodha",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 16,
        column: 2,
    },
    {
        id: "vivekachudamani",
        label: "Vivekacūḍāmaṇi",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 17,
        column: 2,
    },
    {
        id: "tattva-bodha",
        label: "Tattva Bodha",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 16,
        column: 1,
    },

    // ========== ADDITIONAL PRAKARANA TEXTS (from image) ==========
    {
        id: "drik-drishya-viveka",
        label: "Dṛk Dṛśya Viveka",
        description: "Discrimination between the Seer and the Seen",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 15,
        column: 3,
    },
    {
        id: "panchikaranam",
        label: "Pañcīkaraṇam",
        description: "Five-fold division of elements",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 16,
        column: 3,
    },
    {
        id: "sadhana-panchakam",
        label: "Sādhana Pañcakam",
        description: "Five Verses on Spiritual Practice",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 17,
        column: 3,
    },
    {
        id: "manisha-panchakam",
        label: "Manīṣā Pañcakam",
        description: "Five Verses on Conviction",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 18,
        column: 2,
    },
    {
        id: "upadesa-sahasri",
        label: "Upadeśa Sāhasrī",
        description: "A Thousand Teachings",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 18,
        column: 3,
    },
    {
        id: "vakya-vritti",
        label: "Vākya Vṛtti",
        description: "Commentary on the Great Saying",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 17,
        column: 1,
    },
    {
        id: "sarva-vedanta-siddhanta",
        label: "Sarva Vedānta Siddhānta",
        description: "Essence of all Vedānta",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 18,
        column: 1,
    },
    {
        id: "dakshinamurti-stotram",
        label: "Dakṣiṇāmūrti Stotram",
        description: "Hymn to Lord Dakṣiṇāmūrti",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 19,
        column: 2,
    },
    {
        id: "panchadashi",
        label: "Pañcadaśī",
        sublabel: "Vidyāranya Swami",
        description: "Fifteen chapters on Vedānta",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 19,
        column: 3,
    },
    {
        id: "naishkarmya-siddhi",
        label: "Naiṣkarmya Siddhi",
        sublabel: "Sureśvara",
        description: "Attainment of Actionlessness",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 20,
        column: 2,
    },
    {
        id: "vedantasara",
        label: "Vedāntasāra",
        sublabel: "Sadānanda",
        description: "Essence of Vedānta",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 20,
        column: 3,
    },
    {
        id: "advaita-makaranda",
        label: "Advaita Makaranda",
        sublabel: "Lakṣmīdhara",
        description: "Nectar of Non-duality",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 19,
        column: 1,
    },
    {
        id: "mandukya-karika",
        label: "Māṇḍūkya Kārikā",
        sublabel: "Gauḍapāda",
        description: "Verses on Māṇḍūkya Upaniṣad",
        category: "sahayak-pathya",
        color: "#708090",
        size: "xs",
        row: 20,
        column: 1,
    },

    // ========== UPANISHAD BHASHYAS ==========
    {
        id: "isa-bhashya",
        label: "Īśa Up. Bhāṣya",
        description: "Commentary on Īśa Upaniṣad",
        category: "sahayak-pathya",
        color: "#9370DB",
        size: "xs",
        row: 14,
        column: 3,
    },
    {
        id: "kena-bhashya",
        label: "Kena Up. Bhāṣya",
        description: "Commentary on Kena Upaniṣad",
        category: "sahayak-pathya",
        color: "#9370DB",
        size: "xs",
        row: 15,
        column: 4,
    },
    {
        id: "katha-bhashya",
        label: "Kaṭha Up. Bhāṣya",
        description: "Commentary on Kaṭha Upaniṣad",
        category: "sahayak-pathya",
        color: "#9370DB",
        size: "xs",
        row: 16,
        column: 4,
    },
    {
        id: "prashna-bhashya",
        label: "Praśna Up. Bhāṣya",
        description: "Commentary on Praśna Upaniṣad",
        category: "sahayak-pathya",
        color: "#9370DB",
        size: "xs",
        row: 17,
        column: 4,
    },
    {
        id: "mundaka-bhashya",
        label: "Muṇḍaka Up. Bhāṣya",
        description: "Commentary on Muṇḍaka Upaniṣad",
        category: "sahayak-pathya",
        color: "#9370DB",
        size: "xs",
        row: 18,
        column: 4,
    },
    {
        id: "mandukya-bhashya",
        label: "Māṇḍūkya Up. Bhāṣya",
        description: "Commentary on Māṇḍūkya Upaniṣad",
        category: "sahayak-pathya",
        color: "#9370DB",
        size: "xs",
        row: 19,
        column: 4,
    },
    {
        id: "taittiriya-bhashya",
        label: "Taittirīya Up. Bhāṣya",
        description: "Commentary on Taittirīya Upaniṣad",
        category: "sahayak-pathya",
        color: "#9370DB",
        size: "xs",
        row: 20,
        column: 4,
    },
    {
        id: "chandogya-bhashya",
        label: "Chāndogya Up. Bhāṣya",
        description: "Commentary on Chāndogya Upaniṣad",
        category: "sahayak-pathya",
        color: "#9370DB",
        size: "xs",
        row: 21,
        column: 4,
    },
    {
        id: "brihadaranyaka-bhashya",
        label: "Bṛhadāraṇyaka Bhāṣya",
        description: "Commentary on Bṛhadāraṇyaka Upaniṣad",
        category: "sahayak-pathya",
        color: "#9370DB",
        size: "xs",
        row: 22,
        column: 4,
    },
    {
        id: "brahmasutra-bhashya",
        label: "Brahma Sūtra Bhāṣya",
        description: "Commentary on Brahma Sūtra by Śaṅkarācārya",
        category: "sahayak-pathya",
        color: "#9370DB",
        size: "sm",
        row: 14,
        column: 4,
    },
    {
        id: "gita-bhashya",
        label: "Bhagavad Gītā Bhāṣya",
        description: "Commentary on Bhagavad Gītā by Śaṅkarācārya",
        category: "sahayak-pathya",
        color: "#9370DB",
        size: "sm",
        row: 13,
        column: 3,
    },
];

// ==========================================
// ALL EDGES - Directed connections
// ==========================================

export const knowledgeEdges: KnowledgeEdge[] = [
    // ===== Brahman → Vedas =====
    { from: "brahman", to: "vedas", type: "derivation" },

    // ===== Vedas → Four Vedas =====
    { from: "vedas", to: "rig-veda", type: "branch" },
    { from: "vedas", to: "sama-veda", type: "branch" },
    { from: "vedas", to: "yajur-veda", type: "branch" },
    { from: "vedas", to: "atharva-veda", type: "branch" },

    // ===== Vedas → Kāṇḍas =====
    { from: "vedas", to: "karma-kand", type: "classification" },
    { from: "vedas", to: "jnana-kand", type: "classification" },

    // ===== Karma Kāṇḍa branches =====
    { from: "karma-kand", to: "samhitas", type: "derivation" },
    { from: "karma-kand", to: "brahmanas", type: "derivation" },

    // ===== Jñāna Kāṇḍa branches =====
    { from: "jnana-kand", to: "aranyakas", type: "derivation" },
    { from: "jnana-kand", to: "upanishads", type: "derivation" },

    // ===== Upanishads → Principal Upanishads =====
    { from: "upanishads", to: "isa-upanishad", type: "branch" },
    { from: "upanishads", to: "kena-upanishad", type: "branch" },
    { from: "upanishads", to: "katha-upanishad", type: "branch" },
    { from: "upanishads", to: "prashna-upanishad", type: "branch" },
    { from: "upanishads", to: "mundaka-upanishad", type: "branch" },
    { from: "upanishads", to: "mandukya-upanishad", type: "branch" },
    { from: "upanishads", to: "taittiriya-upanishad", type: "branch" },
    { from: "upanishads", to: "aitareya-upanishad", type: "branch" },
    { from: "upanishads", to: "chandogya-upanishad", type: "branch" },
    { from: "upanishads", to: "brihadaranyaka-upanishad", type: "branch" },

    // ===== Smṛti Section =====
    { from: "smriti-section", to: "dharma-shastras", type: "branch" },
    { from: "smriti-section", to: "itihas", type: "branch" },

    // ===== Dharma Shastras =====
    { from: "dharma-shastras", to: "manu-smriti", type: "derivation" },
    { from: "dharma-shastras", to: "yajnavalkya-smriti", type: "derivation" },
    { from: "dharma-shastras", to: "parashara-smriti", type: "derivation" },
    { from: "dharma-shastras", to: "narada-smriti", type: "derivation" },

    // ===== Itihāsa =====
    { from: "itihas", to: "ramayana", type: "branch" },
    { from: "itihas", to: "mahabharata", type: "branch" },
    { from: "mahabharata", to: "bhagavad-gita", type: "derivation" },

    // ===== Purāṇas =====
    { from: "smriti-section", to: "puranas", type: "branch" },

    // ===== Sūtra =====
    { from: "sutra", to: "brahma-sutra", type: "branch" },
    { from: "sutra", to: "kalpa-sutra", type: "branch" },
    { from: "sutra", to: "sulba-sutra", type: "branch" },
    { from: "sutra", to: "dharma-sutra", type: "branch" },
    { from: "sutra", to: "grihya-sutra", type: "branch" },
    { from: "sutra", to: "shrauta-sutra", type: "branch" },

    // ===== Prasthāna Traya → Vedānta (Convergence) =====
    { from: "upanishads", to: "vedanta", type: "convergence" },
    { from: "bhagavad-gita", to: "vedanta", type: "convergence" },
    { from: "brahma-sutra", to: "vedanta", type: "convergence" },

    // ===== Darśanas =====
    { from: "vedanta", to: "darshanas", type: "derivation" },
    { from: "darshanas", to: "samkhya", type: "branch" },
    { from: "darshanas", to: "yoga", type: "branch" },
    { from: "darshanas", to: "nyaya", type: "branch" },
    { from: "darshanas", to: "vaisheshika", type: "branch" },
    { from: "darshanas", to: "purva-mimamsa", type: "branch" },
    { from: "darshanas", to: "uttara-mimamsa", type: "branch" },

    // ===== Vedāṅgas =====
    { from: "vedas", to: "vedangas", type: "derivation" },
    { from: "vedangas", to: "shiksha", type: "branch" },
    { from: "vedangas", to: "vyakarana", type: "branch" },
    { from: "vedangas", to: "chandas", type: "branch" },
    { from: "vedangas", to: "nirukta", type: "branch" },
    { from: "vedangas", to: "jyotisha", type: "branch" },
    { from: "vedangas", to: "kalpa", type: "branch" },

    // ===== Upavedas =====
    { from: "smriti-section", to: "upavedas", type: "branch" },
    { from: "upavedas", to: "ayurveda", type: "branch" },
    { from: "upavedas", to: "dhanurveda", type: "branch" },
    { from: "upavedas", to: "gandharvaveda", type: "branch" },
    { from: "upavedas", to: "sthapatyaveda", type: "branch" },

    // ===== Āgamas =====
    { from: "smriti-section", to: "agamas", type: "branch" },
    { from: "agamas", to: "shaiva-agama", type: "branch" },
    { from: "agamas", to: "vaishnava-agama", type: "branch" },
    { from: "agamas", to: "shakta-agama", type: "branch" },

    // ===== Commentaries =====
    { from: "vedanta", to: "bhashyam", type: "derivation" },
    { from: "bhashyam", to: "prakarana", type: "derivation" },
    { from: "bhashyam", to: "vartika", type: "derivation" },
    { from: "vartika", to: "tika", type: "derivation" },

    // ===== Prakarana Granthas =====
    { from: "prakarana", to: "aparokshanubhuti", type: "branch" },
    { from: "prakarana", to: "atma-bodha", type: "branch" },
    { from: "prakarana", to: "vivekachudamani", type: "branch" },
    { from: "prakarana", to: "tattva-bodha", type: "branch" },
    { from: "prakarana", to: "drik-drishya-viveka", type: "branch" },
    { from: "prakarana", to: "panchikaranam", type: "branch" },
    { from: "prakarana", to: "sadhana-panchakam", type: "branch" },
    { from: "prakarana", to: "manisha-panchakam", type: "branch" },
    { from: "prakarana", to: "upadesa-sahasri", type: "branch" },
    { from: "prakarana", to: "vakya-vritti", type: "branch" },
    { from: "prakarana", to: "sarva-vedanta-siddhanta", type: "branch" },
    { from: "prakarana", to: "dakshinamurti-stotram", type: "branch" },
    { from: "prakarana", to: "panchadashi", type: "branch" },
    { from: "prakarana", to: "naishkarmya-siddhi", type: "branch" },
    { from: "prakarana", to: "vedantasara", type: "branch" },
    { from: "prakarana", to: "advaita-makaranda", type: "branch" },
    { from: "prakarana", to: "mandukya-karika", type: "branch" },

    // ===== Upanishad Bhashyas =====
    { from: "bhashyam", to: "gita-bhashya", type: "branch" },
    { from: "bhashyam", to: "brahmasutra-bhashya", type: "branch" },
    { from: "bhashyam", to: "isa-bhashya", type: "branch" },
    { from: "bhashyam", to: "kena-bhashya", type: "branch" },
    { from: "bhashyam", to: "katha-bhashya", type: "branch" },
    { from: "bhashyam", to: "prashna-bhashya", type: "branch" },
    { from: "bhashyam", to: "mundaka-bhashya", type: "branch" },
    { from: "bhashyam", to: "mandukya-bhashya", type: "branch" },
    { from: "bhashyam", to: "taittiriya-bhashya", type: "branch" },
    { from: "bhashyam", to: "chandogya-bhashya", type: "branch" },
    { from: "bhashyam", to: "brihadaranyaka-bhashya", type: "branch" },
];

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export function getNodeById(id: string): KnowledgeNode | undefined {
    return knowledgeNodes.find(node => node.id === id);
}

export function getConnectedNodes(nodeId: string): string[] {
    const connected: string[] = [];

    knowledgeEdges.forEach(edge => {
        if (edge.from === nodeId) {
            connected.push(edge.to);
        }
        if (edge.to === nodeId) {
            connected.push(edge.from);
        }
    });

    return connected;
}

export function getChildNodes(nodeId: string): string[] {
    return knowledgeEdges
        .filter(edge => edge.from === nodeId)
        .map(edge => edge.to);
}

export function getParentNodes(nodeId: string): string[] {
    return knowledgeEdges
        .filter(edge => edge.to === nodeId)
        .map(edge => edge.from);
}

export function getNodesByCategory(category: NodeCategory): KnowledgeNode[] {
    return knowledgeNodes.filter(node => node.category === category);
}

// Color palette for categories
export const categoryColors = {
    sruti: "rgba(224, 123, 57, 0.15)",         // Orange tint
    "prasthana-traya": "rgba(232, 185, 141, 0.15)", // Peach tint
    smriti: "rgba(184, 134, 11, 0.15)",        // Gold tint
    "sahayak-pathya": "rgba(74, 144, 164, 0.15)",   // Blue tint
    central: "transparent",
};

// Axis labels for the four bands
export const axisLabels = {
    sruti: { label: "ŚRUTI", sublabel: "श्रुति • That which is heard" },
    smriti: { label: "SMṚTI", sublabel: "स्मृति • That which is remembered" },
    "prasthana-traya": { label: "PRASṬHĀNA TRAYA", sublabel: "प्रस्थान त्रय • Three Foundations" },
    "sahayak-pathya": { label: "SAHĀYAK PĀṬHYA", sublabel: "सहायक पाठ्य • Auxiliary Sciences" },
};

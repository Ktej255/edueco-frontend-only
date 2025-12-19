// The Complete Muktika Canon - 108 Upanishads
// Organized by Veda with study sequence recommendations

export interface Upanishad108 {
    id: string;
    name: string;
    nameSanskrit: string;
    veda: "Rigveda" | "Shukla Yajurveda" | "Krishna Yajurveda" | "Samaveda" | "Atharvaveda";
    category: "Mukhya" | "Samanya" | "Sannyasa" | "Shakta" | "Vaishnava" | "Shaiva" | "Yoga";
    studyOrder: number;
    isPrincipal: boolean;
    shlokaCount?: number;
    description: string;
    theme?: string;
}

// Color scheme for each Veda
export const VEDA_COLORS = {
    "Rigveda": { bg: "#E6B89C", border: "#C4956A", text: "#5D3A1A" },
    "Shukla Yajurveda": { bg: "#F0D5BA", border: "#D4B896", text: "#5A4020" },
    "Krishna Yajurveda": { bg: "#F5E6C8", border: "#D4C4A0", text: "#5A4A30" },
    "Samaveda": { bg: "#D4E6F1", border: "#A8C8DC", text: "#1A3A5D" },
    "Atharvaveda": { bg: "#D5F5E3", border: "#A8DCC0", text: "#1A5D3A" },
};

// ==========================================
// COMPLETE 108 UPANISHADS (MUKTIKA CANON)
// ==========================================

export const ALL_108_UPANISHADS: Upanishad108[] = [
    // ========== RIGVEDA (10 Upanishads) ==========
    { id: "aitareya", name: "Aitareya", nameSanskrit: "ऐतरेय", veda: "Rigveda", category: "Mukhya", studyOrder: 8, isPrincipal: true, shlokaCount: 33, description: "Creation of universe and nature of Atman" },
    { id: "kaushitaki", name: "Kaushitaki", nameSanskrit: "कौषीतकि", veda: "Rigveda", category: "Samanya", studyOrder: 15, isPrincipal: false, description: "Doctrine of Prana and transmigration" },
    { id: "nadabindu", name: "Nadabindu", nameSanskrit: "नादबिन्दु", veda: "Rigveda", category: "Yoga", studyOrder: 45, isPrincipal: false, description: "Meditation on the inner sound" },
    { id: "atmaprabodha", name: "Atmaprabodha", nameSanskrit: "आत्मप्रबोध", veda: "Rigveda", category: "Samanya", studyOrder: 60, isPrincipal: false, description: "Self-awakening" },
    { id: "nirvana", name: "Nirvana", nameSanskrit: "निर्वाण", veda: "Rigveda", category: "Sannyasa", studyOrder: 70, isPrincipal: false, description: "Liberation teachings" },
    { id: "mudgala", name: "Mudgala", nameSanskrit: "मुद्गल", veda: "Rigveda", category: "Samanya", studyOrder: 80, isPrincipal: false, description: "Purusha Sukta commentary" },
    { id: "akshamalika", name: "Akshamalika", nameSanskrit: "अक्षमालिका", veda: "Rigveda", category: "Shaiva", studyOrder: 85, isPrincipal: false, description: "Rosary meditation" },
    { id: "tripura", name: "Tripura", nameSanskrit: "त्रिपुरा", veda: "Rigveda", category: "Shakta", studyOrder: 90, isPrincipal: false, description: "Tripura Sundari worship" },
    { id: "saubhagyalakshmi", name: "Saubhagya Lakshmi", nameSanskrit: "सौभाग्यलक्ष्मी", veda: "Rigveda", category: "Shakta", studyOrder: 95, isPrincipal: false, description: "Lakshmi worship" },
    { id: "bahvricha", name: "Bahvricha", nameSanskrit: "बह्वृच", veda: "Rigveda", category: "Shakta", studyOrder: 100, isPrincipal: false, description: "Goddess worship" },

    // ========== SHUKLA YAJURVEDA (19 Upanishads) ==========
    { id: "isa", name: "Isha", nameSanskrit: "ईशावास्य", veda: "Shukla Yajurveda", category: "Mukhya", studyOrder: 1, isPrincipal: true, shlokaCount: 18, description: "Divine pervasion and renunciation" },
    { id: "brihadaranyaka", name: "Brihadaranyaka", nameSanskrit: "बृहदारण्यक", veda: "Shukla Yajurveda", category: "Mukhya", studyOrder: 10, isPrincipal: true, shlokaCount: 435, description: "Largest and oldest Upanishad" },
    { id: "jabala", name: "Jabala", nameSanskrit: "जाबाल", veda: "Shukla Yajurveda", category: "Sannyasa", studyOrder: 14, isPrincipal: false, description: "Renunciation stages" },
    { id: "hamsa", name: "Hamsa", nameSanskrit: "हंस", veda: "Shukla Yajurveda", category: "Yoga", studyOrder: 16, isPrincipal: false, description: "Swan meditation" },
    { id: "paramahamsa", name: "Paramahamsa", nameSanskrit: "परमहंस", veda: "Shukla Yajurveda", category: "Sannyasa", studyOrder: 17, isPrincipal: false, description: "Supreme renunciate" },
    { id: "subala", name: "Subala", nameSanskrit: "सुबाल", veda: "Shukla Yajurveda", category: "Samanya", studyOrder: 18, isPrincipal: false, description: "Cosmology teachings" },
    { id: "mantrika", name: "Mantrika", nameSanskrit: "मन्त्रिका", veda: "Shukla Yajurveda", category: "Samanya", studyOrder: 25, isPrincipal: false, description: "Mantra science" },
    { id: "niralamba", name: "Niralamba", nameSanskrit: "निरालम्ब", veda: "Shukla Yajurveda", category: "Sannyasa", studyOrder: 30, isPrincipal: false, description: "Supportless Brahman" },
    { id: "trisikhibrahmana", name: "Trisikhibrahmana", nameSanskrit: "त्रिशिखिब्राह्मण", veda: "Shukla Yajurveda", category: "Yoga", studyOrder: 35, isPrincipal: false, description: "Yoga techniques" },
    { id: "mandalabrahmana", name: "Mandalabrahmana", nameSanskrit: "मण्डलब्राह्मण", veda: "Shukla Yajurveda", category: "Yoga", studyOrder: 40, isPrincipal: false, description: "Circle meditation" },
    { id: "advayataraka", name: "Advayataraka", nameSanskrit: "अद्वयतारक", veda: "Shukla Yajurveda", category: "Yoga", studyOrder: 50, isPrincipal: false, description: "Non-dual star" },
    { id: "paingala", name: "Paingala", nameSanskrit: "पैङ्गल", veda: "Shukla Yajurveda", category: "Samanya", studyOrder: 55, isPrincipal: false, description: "Yajnavalkya's student" },
    { id: "bhikshuka", name: "Bhikshuka", nameSanskrit: "भिक्षुक", veda: "Shukla Yajurveda", category: "Sannyasa", studyOrder: 60, isPrincipal: false, description: "Mendicant life" },
    { id: "turiyatita", name: "Turiyatita", nameSanskrit: "तुरीयातीत", veda: "Shukla Yajurveda", category: "Sannyasa", studyOrder: 65, isPrincipal: false, description: "Beyond the fourth state" },
    { id: "adhyatma", name: "Adhyatma", nameSanskrit: "अध्यात्म", veda: "Shukla Yajurveda", category: "Samanya", studyOrder: 70, isPrincipal: false, description: "Inner Self study" },
    { id: "tarasara", name: "Tarasara", nameSanskrit: "तारसार", veda: "Shukla Yajurveda", category: "Vaishnava", studyOrder: 75, isPrincipal: false, description: "Essence of OM" },
    { id: "yajnavalkya", name: "Yajnavalkya", nameSanskrit: "याज्ञवल्क्य", veda: "Shukla Yajurveda", category: "Sannyasa", studyOrder: 80, isPrincipal: false, description: "Sage Yajnavalkya's teachings" },
    { id: "satyayaniya", name: "Satyayaniya", nameSanskrit: "सात्यायनीय", veda: "Shukla Yajurveda", category: "Sannyasa", studyOrder: 85, isPrincipal: false, description: "Truth seeker" },
    { id: "muktika", name: "Muktika", nameSanskrit: "मुक्तिका", veda: "Shukla Yajurveda", category: "Samanya", studyOrder: 108, isPrincipal: false, description: "Lists all 108 Upanishads" },

    // ========== KRISHNA YAJURVEDA (32 Upanishads) ==========
    { id: "katha", name: "Katha", nameSanskrit: "कठ", veda: "Krishna Yajurveda", category: "Mukhya", studyOrder: 3, isPrincipal: true, shlokaCount: 119, description: "Nachiketa's dialogue with Yama" },
    { id: "taittiriya", name: "Taittiriya", nameSanskrit: "तैत्तिरीय", veda: "Krishna Yajurveda", category: "Mukhya", studyOrder: 7, isPrincipal: true, shlokaCount: 31, description: "Five sheaths of the Self" },
    { id: "brahma", name: "Brahma", nameSanskrit: "ब्रह्म", veda: "Krishna Yajurveda", category: "Sannyasa", studyOrder: 11, isPrincipal: false, description: "Brahman meditation" },
    { id: "kaivalya", name: "Kaivalya", nameSanskrit: "कैवल्य", veda: "Krishna Yajurveda", category: "Shaiva", studyOrder: 12, isPrincipal: false, description: "Liberation and Shiva" },
    { id: "shvetashvatara", name: "Shvetashvatara", nameSanskrit: "श्वेताश्वतर", veda: "Krishna Yajurveda", category: "Shaiva", studyOrder: 13, isPrincipal: false, description: "Personal God and Rudra" },
    { id: "garbha", name: "Garbha", nameSanskrit: "गर्भ", veda: "Krishna Yajurveda", category: "Samanya", studyOrder: 19, isPrincipal: false, description: "Embryonic development" },
    { id: "narayana", name: "Narayana", nameSanskrit: "नारायण", veda: "Krishna Yajurveda", category: "Vaishnava", studyOrder: 20, isPrincipal: false, description: "Vishnu worship" },
    { id: "amritabindu", name: "Amritabindu", nameSanskrit: "अमृतबिन्दु", veda: "Krishna Yajurveda", category: "Yoga", studyOrder: 21, isPrincipal: false, description: "Drop of immortality" },
    { id: "amritanada", name: "Amritanada", nameSanskrit: "अमृतनाद", veda: "Krishna Yajurveda", category: "Yoga", studyOrder: 22, isPrincipal: false, description: "Sound of immortality" },
    { id: "kalagnirudra", name: "Kalagnirudra", nameSanskrit: "कालाग्निरुद्र", veda: "Krishna Yajurveda", category: "Shaiva", studyOrder: 23, isPrincipal: false, description: "Rudra as time-fire" },
    { id: "kshurika", name: "Kshurika", nameSanskrit: "क्षुरिका", veda: "Krishna Yajurveda", category: "Yoga", studyOrder: 24, isPrincipal: false, description: "Razor-sharp wisdom" },
    { id: "sarvasara", name: "Sarvasara", nameSanskrit: "सर्वसार", veda: "Krishna Yajurveda", category: "Samanya", studyOrder: 26, isPrincipal: false, description: "Essence of all" },
    { id: "shukarahasya", name: "Shukarahasya", nameSanskrit: "शुकरहस्य", veda: "Krishna Yajurveda", category: "Samanya", studyOrder: 27, isPrincipal: false, description: "Shuka's secret" },
    { id: "tejobindu", name: "Tejobindu", nameSanskrit: "तेजोबिन्दु", veda: "Krishna Yajurveda", category: "Yoga", studyOrder: 28, isPrincipal: false, description: "Drop of light" },
    { id: "dhyanabindu", name: "Dhyanabindu", nameSanskrit: "ध्यानबिन्दु", veda: "Krishna Yajurveda", category: "Yoga", studyOrder: 29, isPrincipal: false, description: "Drop of meditation" },
    { id: "brahmavidya", name: "Brahmavidya", nameSanskrit: "ब्रह्मविद्या", veda: "Krishna Yajurveda", category: "Yoga", studyOrder: 31, isPrincipal: false, description: "Knowledge of Brahman" },
    { id: "yogatattva", name: "Yogatattva", nameSanskrit: "योगतत्त्व", veda: "Krishna Yajurveda", category: "Yoga", studyOrder: 32, isPrincipal: false, description: "Essence of Yoga" },
    { id: "dakshinamurti", name: "Dakshinamurti", nameSanskrit: "दक्षिणामूर्ति", veda: "Krishna Yajurveda", category: "Shaiva", studyOrder: 33, isPrincipal: false, description: "South-facing Shiva" },
    { id: "skanda", name: "Skanda", nameSanskrit: "स्कन्द", veda: "Krishna Yajurveda", category: "Shaiva", studyOrder: 34, isPrincipal: false, description: "Kartikeya worship" },
    { id: "shariraka", name: "Shariraka", nameSanskrit: "शारीरक", veda: "Krishna Yajurveda", category: "Samanya", studyOrder: 36, isPrincipal: false, description: "Body and Self" },
    { id: "yogashikha", name: "Yogashikha", nameSanskrit: "योगशिखा", veda: "Krishna Yajurveda", category: "Yoga", studyOrder: 37, isPrincipal: false, description: "Yoga crest" },
    { id: "ekakshara", name: "Ekakshara", nameSanskrit: "एकाक्षर", veda: "Krishna Yajurveda", category: "Samanya", studyOrder: 38, isPrincipal: false, description: "Single syllable OM" },
    { id: "akshi", name: "Akshi", nameSanskrit: "अक्षि", veda: "Krishna Yajurveda", category: "Samanya", studyOrder: 39, isPrincipal: false, description: "Eye symbolism" },
    { id: "avadhuta", name: "Avadhuta", nameSanskrit: "अवधूत", veda: "Krishna Yajurveda", category: "Sannyasa", studyOrder: 41, isPrincipal: false, description: "Free renunciate" },
    { id: "katharudra", name: "Katharudra", nameSanskrit: "कठरुद्र", veda: "Krishna Yajurveda", category: "Shaiva", studyOrder: 42, isPrincipal: false, description: "Rudra section of Katha" },
    { id: "rudrahridaya", name: "Rudrahridaya", nameSanskrit: "रुद्रहृदय", veda: "Krishna Yajurveda", category: "Shaiva", studyOrder: 43, isPrincipal: false, description: "Heart of Rudra" },
    { id: "yogakundalini", name: "Yogakundalini", nameSanskrit: "योगकुण्डलिनी", veda: "Krishna Yajurveda", category: "Yoga", studyOrder: 44, isPrincipal: false, description: "Kundalini awakening" },
    { id: "panchabrahma", name: "Panchabrahma", nameSanskrit: "पञ्चब्रह्म", veda: "Krishna Yajurveda", category: "Shaiva", studyOrder: 46, isPrincipal: false, description: "Five faces of Shiva" },
    { id: "pranagnihotra", name: "Pranagnihotra", nameSanskrit: "प्राणाग्निहोत्र", veda: "Krishna Yajurveda", category: "Samanya", studyOrder: 47, isPrincipal: false, description: "Fire offering of breath" },
    { id: "varaha", name: "Varaha", nameSanskrit: "वराह", veda: "Krishna Yajurveda", category: "Vaishnava", studyOrder: 48, isPrincipal: false, description: "Boar avatar" },
    { id: "kalisantarana", name: "Kalisantarana", nameSanskrit: "कलिसन्तरण", veda: "Krishna Yajurveda", category: "Vaishnava", studyOrder: 49, isPrincipal: false, description: "Crossing Kali age" },
    { id: "sarasvati-rahasya", name: "Sarasvati Rahasya", nameSanskrit: "सरस्वतीरहस्य", veda: "Krishna Yajurveda", category: "Shakta", studyOrder: 51, isPrincipal: false, description: "Sarasvati's secret" },

    // ========== SAMAVEDA (16 Upanishads) ==========
    { id: "kena", name: "Kena", nameSanskrit: "केन", veda: "Samaveda", category: "Mukhya", studyOrder: 2, isPrincipal: true, shlokaCount: 35, description: "Inquiry into Brahman" },
    { id: "chandogya", name: "Chandogya", nameSanskrit: "छान्दोग्य", veda: "Samaveda", category: "Mukhya", studyOrder: 9, isPrincipal: true, shlokaCount: 154, description: "Tat Tvam Asi" },
    { id: "aruneya", name: "Aruneya", nameSanskrit: "आरुणेय", veda: "Samaveda", category: "Sannyasa", studyOrder: 52, isPrincipal: false, description: "Aruni's teachings" },
    { id: "maitrayani", name: "Maitrayani", nameSanskrit: "मैत्रायणी", veda: "Samaveda", category: "Samanya", studyOrder: 53, isPrincipal: false, description: "Six limbs of Yoga" },
    { id: "maitreyi", name: "Maitreyi", nameSanskrit: "मैत्रेयी", veda: "Samaveda", category: "Sannyasa", studyOrder: 54, isPrincipal: false, description: "Maitreyi's dialogue" },
    { id: "vajrasuchika", name: "Vajrasuchika", nameSanskrit: "वज्रसूचिका", veda: "Samaveda", category: "Samanya", studyOrder: 56, isPrincipal: false, description: "Diamond needle - caste" },
    { id: "yogachudamani", name: "Yogachudamani", nameSanskrit: "योगचूडामणि", veda: "Samaveda", category: "Yoga", studyOrder: 57, isPrincipal: false, description: "Crest jewel of Yoga" },
    { id: "vasudeva", name: "Vasudeva", nameSanskrit: "वासुदेव", veda: "Samaveda", category: "Vaishnava", studyOrder: 58, isPrincipal: false, description: "Krishna worship" },
    { id: "mahopanishad", name: "Mahopanishad", nameSanskrit: "महोपनिषद्", veda: "Samaveda", category: "Samanya", studyOrder: 59, isPrincipal: false, description: "Great Upanishad" },
    { id: "sannyasa", name: "Sannyasa", nameSanskrit: "संन्यास", veda: "Samaveda", category: "Sannyasa", studyOrder: 61, isPrincipal: false, description: "Renunciation rules" },
    { id: "kundika", name: "Kundika", nameSanskrit: "कुण्डिका", veda: "Samaveda", category: "Sannyasa", studyOrder: 62, isPrincipal: false, description: "Water pot symbolism" },
    { id: "savitri", name: "Savitri", nameSanskrit: "सावित्री", veda: "Samaveda", category: "Samanya", studyOrder: 63, isPrincipal: false, description: "Gayatri meditation" },
    { id: "rudrakshajabaala", name: "Rudrakshajabaala", nameSanskrit: "रुद्राक्षजाबाल", veda: "Samaveda", category: "Shaiva", studyOrder: 64, isPrincipal: false, description: "Rudraksha beads" },
    { id: "darsana", name: "Darsana", nameSanskrit: "दर्शन", veda: "Samaveda", category: "Yoga", studyOrder: 66, isPrincipal: false, description: "Vision of truth" },
    { id: "jabali", name: "Jabali", nameSanskrit: "जाबालि", veda: "Samaveda", category: "Shaiva", studyOrder: 67, isPrincipal: false, description: "Jabali sage" },
    { id: "kena-talavakaara", name: "Kena Talavakaara", nameSanskrit: "तलवकार", veda: "Samaveda", category: "Mukhya", studyOrder: 2, isPrincipal: false, description: "Alternate Kena name" },

    // ========== ATHARVAVEDA (31 Upanishads) ==========
    { id: "prasna", name: "Prashna", nameSanskrit: "प्रश्न", veda: "Atharvaveda", category: "Mukhya", studyOrder: 4, isPrincipal: true, shlokaCount: 67, description: "Six questions about life" },
    { id: "mundaka", name: "Mundaka", nameSanskrit: "मुण्डक", veda: "Atharvaveda", category: "Mukhya", studyOrder: 5, isPrincipal: true, shlokaCount: 64, description: "Higher vs lower knowledge" },
    { id: "mandukya", name: "Mandukya", nameSanskrit: "माण्डूक्य", veda: "Atharvaveda", category: "Mukhya", studyOrder: 6, isPrincipal: true, shlokaCount: 12, description: "Analysis of OM" },
    { id: "atharvasiras", name: "Atharvasiras", nameSanskrit: "अथर्वशिरस्", veda: "Atharvaveda", category: "Shaiva", studyOrder: 68, isPrincipal: false, description: "Head of Atharvaveda" },
    { id: "atharvasikha", name: "Atharvasikha", nameSanskrit: "अथर्वशिखा", veda: "Atharvaveda", category: "Shaiva", studyOrder: 69, isPrincipal: false, description: "Crest of Atharvaveda" },
    { id: "brihajjabala", name: "Brihajjabala", nameSanskrit: "बृहज्जाबाल", veda: "Atharvaveda", category: "Shaiva", studyOrder: 71, isPrincipal: false, description: "Great Jabala" },
    { id: "nrisimhatapaniya", name: "Nrisimhatapaniya", nameSanskrit: "नृसिंहतापनीय", veda: "Atharvaveda", category: "Vaishnava", studyOrder: 72, isPrincipal: false, description: "Narasimha worship" },
    { id: "narada-parivrajaka", name: "Narada Parivrajaka", nameSanskrit: "नारदपरिव्राजक", veda: "Atharvaveda", category: "Sannyasa", studyOrder: 73, isPrincipal: false, description: "Narada's wanderings" },
    { id: "sita", name: "Sita", nameSanskrit: "सीता", veda: "Atharvaveda", category: "Shakta", studyOrder: 74, isPrincipal: false, description: "Sita as Shakti" },
    { id: "sharabha", name: "Sharabha", nameSanskrit: "शरभ", veda: "Atharvaveda", category: "Shaiva", studyOrder: 76, isPrincipal: false, description: "Eight-legged beast" },
    { id: "mahanarayana", name: "Mahanarayana", nameSanskrit: "महानारायण", veda: "Atharvaveda", category: "Vaishnava", studyOrder: 77, isPrincipal: false, description: "Great Narayana" },
    { id: "ramarahasya", name: "Ramarahasya", nameSanskrit: "रामरहस्य", veda: "Atharvaveda", category: "Vaishnava", studyOrder: 78, isPrincipal: false, description: "Secret of Rama" },
    { id: "ramatapaniya", name: "Ramatapaniya", nameSanskrit: "रामतापनीय", veda: "Atharvaveda", category: "Vaishnava", studyOrder: 79, isPrincipal: false, description: "Rama meditation" },
    { id: "sandilya", name: "Sandilya", nameSanskrit: "शाण्डिल्य", veda: "Atharvaveda", category: "Yoga", studyOrder: 81, isPrincipal: false, description: "Sandilya's Yoga" },
    { id: "paramahamsaparivrajaka", name: "Paramahamsaparivrajaka", nameSanskrit: "परमहंसपरिव्राजक", veda: "Atharvaveda", category: "Sannyasa", studyOrder: 82, isPrincipal: false, description: "Supreme swan wanderer" },
    { id: "annapurna", name: "Annapurna", nameSanskrit: "अन्नपूर्णा", veda: "Atharvaveda", category: "Shakta", studyOrder: 83, isPrincipal: false, description: "Goddess of food" },
    { id: "surya", name: "Surya", nameSanskrit: "सूर्य", veda: "Atharvaveda", category: "Samanya", studyOrder: 84, isPrincipal: false, description: "Sun worship" },
    { id: "atma", name: "Atma", nameSanskrit: "आत्मा", veda: "Atharvaveda", category: "Samanya", studyOrder: 86, isPrincipal: false, description: "Nature of Self" },
    { id: "pashupata", name: "Pashupata", nameSanskrit: "पाशुपत", veda: "Atharvaveda", category: "Shaiva", studyOrder: 87, isPrincipal: false, description: "Pashupata Shaivism" },
    { id: "parabrahma", name: "Parabrahma", nameSanskrit: "परब्रह्म", veda: "Atharvaveda", category: "Samanya", studyOrder: 88, isPrincipal: false, description: "Supreme Brahman" },
    { id: "tripuratapini", name: "Tripuratapini", nameSanskrit: "त्रिपुरातापिनी", veda: "Atharvaveda", category: "Shakta", studyOrder: 89, isPrincipal: false, description: "Tripura meditation" },
    { id: "devi", name: "Devi", nameSanskrit: "देवी", veda: "Atharvaveda", category: "Shakta", studyOrder: 91, isPrincipal: false, description: "Goddess worship" },
    { id: "bhavana", name: "Bhavana", nameSanskrit: "भावना", veda: "Atharvaveda", category: "Shakta", studyOrder: 92, isPrincipal: false, description: "Meditation on goddess" },
    { id: "bhasma-jabala", name: "Bhasma Jabala", nameSanskrit: "भस्मजाबाल", veda: "Atharvaveda", category: "Shaiva", studyOrder: 93, isPrincipal: false, description: "Sacred ash" },
    { id: "ganapati", name: "Ganapati", nameSanskrit: "गणपति", veda: "Atharvaveda", category: "Shaiva", studyOrder: 94, isPrincipal: false, description: "Ganesha worship" },
    { id: "mahaavakya", name: "Mahavakya", nameSanskrit: "महावाक्य", veda: "Atharvaveda", category: "Samanya", studyOrder: 96, isPrincipal: false, description: "Great sayings" },
    { id: "gopala-tapaniya", name: "Gopala Tapaniya", nameSanskrit: "गोपालतापनीय", veda: "Atharvaveda", category: "Vaishnava", studyOrder: 97, isPrincipal: false, description: "Krishna worship" },
    { id: "krishna", name: "Krishna", nameSanskrit: "कृष्ण", veda: "Atharvaveda", category: "Vaishnava", studyOrder: 98, isPrincipal: false, description: "Krishna meditation" },
    { id: "hayagriva", name: "Hayagriva", nameSanskrit: "हयग्रीव", veda: "Atharvaveda", category: "Vaishnava", studyOrder: 99, isPrincipal: false, description: "Horse-headed avatar" },
    { id: "dattatreya", name: "Dattatreya", nameSanskrit: "दत्तात्रेय", veda: "Atharvaveda", category: "Vaishnava", studyOrder: 101, isPrincipal: false, description: "Dattatreya worship" },
    { id: "garuda", name: "Garuda", nameSanskrit: "गरुड", veda: "Atharvaveda", category: "Vaishnava", studyOrder: 102, isPrincipal: false, description: "Eagle vehicle" },
].sort((a, b) => a.studyOrder - b.studyOrder);

// Get Upanishads by Veda for clustering
export const getUpanishadsByVeda = () => ({
    rigveda: ALL_108_UPANISHADS.filter(u => u.veda === "Rigveda"),
    shuklaYajurveda: ALL_108_UPANISHADS.filter(u => u.veda === "Shukla Yajurveda"),
    krishnaYajurveda: ALL_108_UPANISHADS.filter(u => u.veda === "Krishna Yajurveda"),
    samaveda: ALL_108_UPANISHADS.filter(u => u.veda === "Samaveda"),
    atharvaveda: ALL_108_UPANISHADS.filter(u => u.veda === "Atharvaveda"),
});

// Principal 10 only
export const PRINCIPAL_UPANISHADS = ALL_108_UPANISHADS.filter(u => u.isPrincipal);

// Study sequence with grouping
export const STUDY_SEQUENCE = {
    beginner: PRINCIPAL_UPANISHADS.slice(0, 3), // Isha, Kena, Katha
    intermediate: PRINCIPAL_UPANISHADS.slice(3, 7), // Prasna, Mundaka, Mandukya, Taittiriya
    advanced: PRINCIPAL_UPANISHADS.slice(7, 10), // Aitareya, Chandogya, Brihadaranyaka
};

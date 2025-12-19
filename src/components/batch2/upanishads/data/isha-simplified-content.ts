// Isha Upanishad Simplified - Bilingual Content
// "The Administrator's Guide to the Universe"

export interface IshaSimplifiedSection {
    id: string;
    icon: string;
    titleEn: string;
    titleHi: string;
    subtitleEn: string;
    subtitleHi: string;
    contentEn: string;
    ruleEn: string;
    contentHi: string;
    ruleHi: string;
    hotspotPosition: { x: number; y: number }; // % position on journey map
}

export const ISHA_SIMPLIFIED_CONTENT: IshaSimplifiedSection[] = [
    {
        id: "arrival",
        icon: "🚪",
        titleEn: "The Arrival (Entrance)",
        titleHi: "प्रवेश (आगमन)",
        subtitleEn: "Mantra 1: Isha Vasyam",
        subtitleHi: "मंत्र १: ईशावास्यम्",
        contentEn: "Imagine you have just checked into the most luxurious 7-star hotel in the universe. It has infinite food, gold, and beauty. You are the \"Guest.\" The hotel belongs to the \"Divine Owner\" (Isha).",
        ruleEn: "The Rule: You can use the pool, sleep in the bed, and eat the food. But you cannot claim, \"This room is mine forever.\" You must enjoy it as a guest (Tena Tyaktena). If you try to steal the towels or claim the property, you suffer.",
        contentHi: "कल्पना कीजिए कि आपने ब्रह्मांड के सबसे शानदार 7-सितारा होटल में चेक-इन किया है। यहाँ अनंत भोजन, सोना और सुंदरता है। आप \"मेहमान\" हैं। यह होटल \"दिव्य मालिक\" (ईश) का है।",
        ruleHi: "नियम: आप पूल का उपयोग कर सकते हैं, बिस्तर पर सो सकते हैं और भोजन कर सकते हैं। लेकिन आप यह दावा नहीं कर सकते, \"यह कमरा हमेशा के लिए मेरा है।\" आपको एक मेहमान की तरह इसका आनंद लेना होगा (तेन त्यक्तेन)। यदि आप तौलिए चुराने की कोशिश करते हैं या संपत्ति पर कब्जा करते हैं, तो आपको दुःख मिलेगा।",
        hotspotPosition: { x: 12, y: 50 },
    },
    {
        id: "karma",
        icon: "🔨",
        titleEn: "The Job (Karma Yoga)",
        titleHi: "कर्म (कर्मयोग)",
        subtitleEn: "Mantra 2: Kurvanneveha Karmani",
        subtitleHi: "मंत्र २: कुर्वन्नेवेह कर्माणि",
        contentEn: "Just because you are a guest doesn't mean you sit idle. The Owner has appointed you as the \"Manager\" of this hotel. You must work efficiently for 100 years (Kurvanneveha karmani). Keep the hotel clean, serve others, and maintain order.",
        ruleEn: "The Secret: Work like a Manager, not an Owner. A Manager works hard but doesn't cry if a glass breaks, because he knows he doesn't own the glass. This brings fearlessness.",
        contentHi: "सिर्फ इसलिए कि आप मेहमान हैं, इसका मतलब यह नहीं है कि आप खाली बैठे रहें। मालिक ने आपको इस होटल का \"प्रबंधक\" (Manager) नियुक्त किया है। आपको 100 वर्षों तक कुशलतापूर्वक कार्य करना होगा (कुर्वन्नेवेह कर्माणि)। होटल को साफ रखें, दूसरों की सेवा करें और व्यवस्था बनाए रखें।",
        ruleHi: "रहस्य: एक प्रबंधक की तरह काम करें, मालिक की तरह नहीं। एक प्रबंधक कड़ी मेहनत करता है लेकिन अगर गिलास टूट जाए तो रोता नहीं है, क्योंकि वह जानता है कि वह गिलास का मालिक नहीं है। इससे निर्भयता आती है।",
        hotspotPosition: { x: 37, y: 50 },
    },
    {
        id: "oneness",
        icon: "✨",
        titleEn: "The Vision (Oneness)",
        titleHi: "दृष्टि (एकता)",
        subtitleEn: "Mantra 6-7: Ya Sarvani Bhutani",
        subtitleHi: "मंत्र ६-७: यः सर्वाणि भूतानि",
        contentEn: "As you manage the hotel, you realize a secret. The same electricity that powers your room powers your neighbor's room. The light is one, the bulbs are different.",
        ruleEn: "The Result: When you realize everyone is powered by the same Divine electricity (Atman), jealousy disappears. How can you hate your neighbor when you know he is just another version of you?",
        contentHi: "जैसे-जैसे आप होटल का प्रबंधन करते हैं, आपको एक रहस्य का पता चलता है। जो बिजली आपके कमरे को रोशन करती है, वही आपके पड़ोसी के कमरे को भी रोशन करती है। प्रकाश एक है, बल्ब अलग-अलग हैं।",
        ruleHi: "परिणाम: जब आपको यह एहसास होता है कि हर कोई एक ही दिव्य बिजली (आत्मन्) से संचालित है, तो ईर्ष्या गायब हो जाती है। आप अपने पड़ोसी से नफरत कैसे कर सकते हैं जब आप जानते हैं कि वह आप ही का दूसरा रूप है?",
        hotspotPosition: { x: 62, y: 50 },
    },
    {
        id: "exit",
        icon: "☀️",
        titleEn: "The Exit (The Golden Lid)",
        titleHi: "प्रस्थान (स्वर्ण आवरण)",
        subtitleEn: "Mantra 15-16: Hiranmayena Patrena",
        subtitleHi: "मंत्र १५-१६: हिरण्मयेन पात्रेण",
        contentEn: "Finally, your checkout time arrives. You look at the Sun outside. It looks like a glittering golden disc. But this glitter is a distraction (Hiranmayena Patrena). It hides the Truth.",
        ruleEn: "The Prayer: You ask the Divine to remove the glitter (Wealth, Fame, Ego) so you can see the Truth behind it. You leave the key at the desk and merge with the Light.",
        contentHi: "अंत में, आपका चेकआउट समय आ जाता है। आप बाहर सूर्य को देखते हैं। वह एक चमकती हुई सोने की तश्तरी जैसा दिखता है। लेकिन यह चमक एक व्याकुलता है (हिरण्मयेन पात्रेण)। यह सत्य को छुपाती है।",
        ruleHi: "प्रार्थना: आप ईश्वर से प्रार्थना करते हैं कि वह इस चमक (धन, प्रसिद्धि, अहंकार) को हटा दे ताकि आप इसके पीछे के सत्य को देख सकें। आप डेस्क पर चाबी छोड़ते हैं और प्रकाश में विलीन हो जाते हैं।",
        hotspotPosition: { x: 88, y: 50 },
    },
];

export const ISHA_SIMPLIFIED_META = {
    titleEn: "The Administrator's Guide to the Universe",
    titleHi: "ब्रह्मांड का प्रशासनिक गाइड",
    subtitleEn: "Isha Upanishad Simplified",
    subtitleHi: "ईशोपनिषद सरल भाषा में",
    journeyMapImage: "/assets/upanishads/isha/journey_map.png",
    revealTextEn: "So'ham Asmi - I am That",
    revealTextHi: "सोऽहम् अस्मि - मैं वही हूँ",
};

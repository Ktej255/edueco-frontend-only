// Kena Upanishad Simplified - Bilingual Content
// "The Source behind the Senses"

export interface KenaSimplifiedSection {
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

export const KENA_SIMPLIFIED_CONTENT: KenaSimplifiedSection[] = [
    {
        id: "inquiry",
        icon: "🧠",
        titleEn: "The Inquiry (Who pushes the button?)",
        titleHi: "जिज्ञासा (प्रेरक कौन?)",
        subtitleEn: "Mantra 1-8: The Source",
        subtitleHi: "मंत्र १-८: स्रोत",
        contentEn: "Think of your body as a high-tech drone. Your eyes are cameras, your ears are microphones, and your mind is the processor. But who is the 'Pilot' who willed it all to start? Who is the power in the battery?",
        ruleEn: "The Rule: The ear doesn't hear, and the eye doesn't see by itself. They are just tools. The real power is Brahman—the 'Ear of the ear.' Don't mistake the tool for the power source.",
        contentHi: "अपने शरीर को एक हाई-टेक ड्रोन की तरह समझें। आपकी आँखें कैमरे हैं, आपके कान माइक्रोफोन हैं, और आपका मन प्रोसेसर है। लेकिन वह 'पायलट' कौन है जिसने यह सब शुरू करने की इच्छा की? बैटरी में शक्ति कौन है?",
        ruleHi: "नियम: कान खुद नहीं सुनता, और आँख खुद नहीं देखती। वे केवल उपकरण हैं। असली शक्ति ब्रह्म है—'कान का कान'। उपकरण को शक्ति स्रोत समझने की गलती न करें।",
        hotspotPosition: { x: 15, y: 40 },
    },
    {
        id: "paradox",
        icon: "❓",
        titleEn: "The Paradox (Knowing vs. Feeling)",
        titleHi: "विरोधाभास (जानना बनाम महसूस करना)",
        subtitleEn: "Mantra 9-13: The Limit of Logic",
        subtitleHi: "मंत्र ९-१३: तर्क की सीमा",
        contentEn: "Imagine trying to explain 'Color' to someone who has never seen light. No matter how many books they read, they won't 'know' it until they see it. If you think you 'know' Brahman like a math formula, you don't know it at all.",
        ruleEn: "The Secret: Truth is not a trophy to be won; it is a pulse to be felt. It is known to those who admit they cannot grasp it with the mind. Silence is the highest answer.",
        contentHi: "कल्पना कीजिए कि किसी ऐसे व्यक्ति को 'रंग' समझाने की कोशिश की जा रही है जिसने कभी प्रकाश नहीं देखा है। चाहे वे कितनी भी किताबें पढ़ लें, वे इसे तब तक नहीं 'जानेंगे' जब तक वे इसे देख नहीं लेते। यदि आपको लगता है कि आप ब्रह्म को गणित के सूत्र की तरह 'जानते' हैं, तो आप उसे बिल्कुल नहीं जानते।",
        ruleHi: "रहस्य: सत्य जीतने के लिए कोई ट्रॉफी नहीं है; यह महसूस करने के लिए एक स्पंदन है। यह उन लोगों को ज्ञात होता है जो स्वीकार करते हैं कि वे इसे मन से नहीं समझ सकते। मौन ही सर्वोच्च उत्तर है।",
        hotspotPosition: { x: 40, y: 60 },
    },
    {
        id: "humility",
        icon: "⚡",
        titleEn: "The Story (The Humility of Gods)",
        titleHi: "कहानी (देवताओं की विनम्रता)",
        subtitleEn: "Mantra 14-25: The Straw Test",
        subtitleHi: "मंत्र १४-२५: तिनके की परीक्षा",
        contentEn: "The Gods Agni (Fire) and Vayu (Wind) were proud of their victory. Then a mysterious Spirit (Yaksha) appeared and put a tiny straw before them. Agni couldn't burn it, and Vayu couldn't lift it. Their power was useless without the Spark of Brahman.",
        ruleEn: "The Lesson: Your talent, your money, and your status are all 'borrowed energy.' If the Divine 'Power Grid' shuts down, even the strongest person can't lift a finger. Stay humble.",
        contentHi: "अग्नि और वायु देवताओं को अपनी विजय पर गर्व था। तभी एक रहस्यमयी यक्ष प्रकट हुआ और उनके सामने एक छोटा सा तिनका रख दिया। अग्नि उसे जला नहीं पाया, और वायु उसे हिला नहीं पाया। ब्रह्म की चिनगारी के बिना उनकी शक्ति बेकार थी।",
        ruleHi: "सबक: आपकी प्रतिभा, आपका पैसा और आपकी स्थिति सभी 'उधार ली गई ऊर्जा' हैं। यदि दिव्य 'पावर ग्रिड' बंद हो जाए, तो सबसे शक्तिशाली व्यक्ति भी उंगली नहीं उठा सकता। विनम्र रहें।",
        hotspotPosition: { x: 65, y: 35 },
    },
    {
        id: "revelation",
        icon: "🔱",
        titleEn: "The Revelation (Indra Meets Wisdom)",
        titleHi: "प्रकटीकरण (इंद्र और ज्ञान)",
        subtitleEn: "Mantra 26-34: The Flash of Truth",
        subtitleHi: "मंत्र २६-३४: सत्य की चमक",
        contentEn: "Indra, the king of Gods, approached the Spirit, and it vanished. In its place stood Mother Uma (Wisdom). She revealed that the Spirit was Brahman. Indra finally understood that Enlightenment is like a flash of lightning—sudden and total.",
        ruleEn: "The Goal: Life is an 'Open-Book' test. The answers are everywhere—in a flash of lightning, a wink of an eye, or a heartbeat. Find the source, and find eternal freedom.",
        contentHi: "देवताओं के राजा इंद्र यक्ष के पास पहुंचे, और वह गायब हो गया। उसके स्थान पर माता उमा (ज्ञान) खड़ी थीं। उन्होंने बताया कि वह यक्ष ब्रह्म था। इंद्र अंततः समझ गए कि ज्ञानोदय बिजली की चमक की तरह है—अचानक और पूर्ण।",
        ruleHi: "लक्ष्य: जीवन एक 'ओपन-बुक' परीक्षा है। उत्तर हर जगह हैं—बिजली की चमक में, आँख झपकाने में, या दिल की धड़कन में। स्रोत को खोजें, और शाश्वत स्वतंत्रता पाएं।",
        hotspotPosition: { x: 88, y: 55 },
    },
];

export const KENA_SIMPLIFIED_META = {
    titleEn: "The Science of Perception",
    titleHi: "अनुभूति का विज्ञान",
    subtitleEn: "Kena Upanishad Simplified",
    subtitleHi: "केनोपनिषद सरल भाषा में",
    journeyMapImage: "/assets/upanishads/kena/journey_map.png",
    revealTextEn: "Om Tat Sat - That is Reality",
    revealTextHi: "ॐ तत् सत् - वही वास्तविकता है",
};

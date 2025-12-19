// Kena Upanishad - The Complete 34 Mantras
// Logical Chunks: Philosophy (1-13) and Story (14-34)

export interface KenaDataEntry {
    id: number;
    section: "Philosophy" | "Story";
    sanskrit: string;
    transliteration: string;
    hindi: string;
    english: string;
    simpleExplanation: string;
    simpleExplanationHindi: string;
    nanoBananaPrompt: string;
    theme?: string;
}

export const kenaData: KenaDataEntry[] = [
    // CHUNK 1: THE INQUIRY (Khanda 1: Verses 1-8)
    {
        id: 1,
        section: "Philosophy",
        sanskrit: "ॐ केनेषितं पतति प्रेषितं मनः केन प्राणः प्रथमः प्रैति युक्तः । केनेषितां वाचमिमां वदन्ति चक्षुः श्रोत्रं क उ देवो युनक्ति ॥",
        transliteration: "Om keneṣitaṃ patati preṣitaṃ manaḥ kena prāṇaḥ prathamaḥ praiti yuktaḥ | keneṣitāṃ vācam imāṃ vadanti cakṣuḥ śrotraṃ ka u devo yunakti ||",
        hindi: "किसकी इच्छा से भेजा गया यह मन अपने विषयों में गिरता है? किसकी प्रेरणा से प्राण सबसे पहले कार्य करता है? किसकी प्रेरणा से लोग यह वाणी बोलते हैं? कौन देव नेत्र और कान को उनके विषयों से जोड़ता है?",
        english: "By whom willed and directed does the mind light upon its objects? By whose command does the first life-breath proceed? By whose will do people utter this speech? What god directs the eyes and ears to their objects?",
        simpleExplanation: "Think of your brain like a computer. Who pushed the 'Power On' button? Who is the electricity running the hardware? That source is Brahman.",
        simpleExplanationHindi: "अपने मस्तिष्क को एक कंप्यूटर की तरह समझें। 'पावर ऑन' बटन किसने दबाया? हार्डवेयर चलाने वाली बिजली कौन है? वह स्रोत ब्रह्म है।",
        nanoBananaPrompt: "A glowing human brain connected to an infinite beam of light from above, digital art style, cyber-spiritual aesthetic.",
        theme: "The Inquiry"
    },
    {
        id: 2,
        section: "Philosophy",
        sanskrit: "श्रोत्रस्य श्रोत्रं मनसो मनो यद्वाचो ह वाचं स उ प्राणस्य प्राणः । चक्षुषश्चक्षुरतिमुच्य धीराः प्रेत्यास्माल्लोकादमृता भवन्ति ॥",
        transliteration: "śrotrasya śrotraṃ manaso mano yadvāco ha vācaṃ sa u prāṇasya prāṇaḥ | cakṣuṣaścakṣuratimucya dhīrāḥ pretyāsmāllokādamṛtā bhavanti ||",
        hindi: "वह कान का कान, मन का मन, वाणी की वाणी, प्राण का प्राण और आँख की आँख है। बुद्धिमान लोग शरीर से मोह त्यागकर अमर हो जाते हैं।",
        english: "It is the Ear of the ear, the Mind of the mind, the Speech of speech, the Life of life, and the Eye of the eye. The wise, giving up the identification with the senses, become immortal.",
        simpleExplanation: "The Sensor behind the Sensors. Your eyes are cameras, but who is the observer watching the feed? You are the electricity, not just the bulb.",
        simpleExplanationHindi: "सेंसर के पीछे का सेंसर। आपकी आँखें कैमरे हैं, लेकिन फीड देखने वाला पर्यवेक्षक कौन है? आप बिजली हैं, सिर्फ बल्ब नहीं।",
        nanoBananaPrompt: "A central glowing eye or heart surrounded by smaller icons of ears, eyes, and mouths, all connected by golden threads of light.",
        theme: "Internal Sensors"
    },
    {
        id: 3,
        section: "Philosophy",
        sanskrit: "न तत्र चक्षुर्गच्छति न वाग्गच्छति नो मनः । न विद्मो न विजानीमो यथैतदनुशिष्यात् ॥",
        transliteration: "na tatra cakṣurgacchati na vāggacchati no manaḥ | na vidmo na vijānīmo yathaitadanuśiṣyāt ||",
        hindi: "वहाँ न आँख जाती है, न वाणी, न ही मन। हम नहीं जानते और न ही समझते हैं कि इसे कैसे सिखाया जाए।",
        english: "The eye does not go there, nor does speech, nor the mind. We do not know, we do not understand, how one can teach it.",
        simpleExplanation: "The Limit of logic. Imagine trying to explain 'Color' to someone who has never seen light. Brahman is beyond the reach of our physical tools.",
        simpleExplanationHindi: "तर्क की सीमा। कल्पना कीजिए कि किसी ऐसे व्यक्ति को 'रंग' समझाने की कोशिश की जा रही है जिसने कभी प्रकाश नहीं देखा है। ब्रह्म हमारे भौतिक उपकरणों की पहुंच से परे है।",
        nanoBananaPrompt: "A figure standing at the edge of a vast ocean of light, reaching out but unable to touch the horizon. Ethereal teal colors.",
        theme: "Beyond Reach"
    },
    {
        id: 4,
        section: "Philosophy",
        sanskrit: "अन्यदेव तद्विदितादथो अविदितादधि । इति शुश्रुम पूर्वेषां ये नस्तद्व्याचचक्षिरे ॥",
        transliteration: "anyadeva tadviditādatho aviditādadhi | iti śuśruma pūrveṣāṃ ye nastadvyācacakṣire ||",
        hindi: "यह ज्ञात से भिन्न है और अज्ञात से भी परे है। ऐसा हमने अपने पूर्वजों से सुना है जिन्होंने हमें यह समझाया।",
        english: "It is different from the known and beyond the unknown. Thus we have heard from the ancient teachers who explained it to us.",
        simpleExplanation: "Neither Google nor Ignorance. It's not something you already know, and it's not something you can't ever know. It's a different dimension of reality.",
        simpleExplanationHindi: "न गूगल, न अज्ञान। यह ऐसा कुछ नहीं है जिसे आप पहले से जानते हैं, और यह ऐसा कुछ भी नहीं है जिसे आप कभी नहीं जान सकते। यह वास्तविकता का एक अलग आयाम है।",
        nanoBananaPrompt: "A glowing portal between a library (known) and a dark nebula (unknown), with the portal representing a higher truth.",
        theme: "The Third Dimension"
    },
    {
        id: 5,
        section: "Philosophy",
        sanskrit: "यद्वाचानभ्युदितं येन वागभ्युद्यते । तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥",
        transliteration: "yadvācānabhyuditaṃ yena vāgabhyudyate | tadeva brahma tvaṃ viddhi nedaṃ yadidamupāsate ||",
        hindi: "जो वाणी द्वारा व्यक्त नहीं किया जा सकता, परंतु जिससे वाणी व्यक्त होती है - उसी को ब्रह्म जानो, न कि उसे जिसकी लोग उपासना करते हैं।",
        english: "That which cannot be expressed by speech, but by which speech is expressed - know that alone as Brahman, not what people worship here.",
        simpleExplanation: "The Source of Voice. Words can describe a mountain, but they cannot describe the silence from which the words come. Know that silence as the source.",
        simpleExplanationHindi: "वाणी का स्रोत। शब्द एक पर्वत का वर्णन कर सकते हैं, लेकिन वे उस मौन का वर्णन नहीं कर सकते जिससे शब्द निकलते हैं। उस मौन को स्रोत के रूप में जानें।",
        nanoBananaPrompt: "Luminous ripples spreading out from a silent center, visualizing the power of sound emerging from stillness.",
        theme: "Unspoken Power"
    },
    {
        id: 6,
        section: "Philosophy",
        sanskrit: "यन्मनसा न मनुते येनाहुर्मनो मतम् । तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥",
        transliteration: "yanmanasā na manute yenāhurmano matam | tadeva brahma tvaṃ viddhi nedaṃ yadidamupāsate ||",
        hindi: "जो मन से नहीं सोचा जा सकता, परंतु जिससे मन सोचता है - उसी को ब्रह्म जानो।",
        english: "That which cannot be thought by the mind, but by which the mind is thought to think - know that alone as Brahman.",
        simpleExplanation: "The Thinker. You can think about a car, but can you think about the 'thing' that is doing the thinking? Brahman is the subject, not the object.",
        simpleExplanationHindi: "विचारक। आप एक कार के बारे में सोच सकते हैं, लेकिन क्या आप उस 'चीज़' के बारे में सोच सकते हैं जो सोच रही है? ब्रह्म विषय है, वस्तु नहीं।",
        nanoBananaPrompt: "A brain silhouetted against a universe of stars, with a single bright light at the core of the mind.",
        theme: "The Thinker"
    },
    {
        id: 7,
        section: "Philosophy",
        sanskrit: "यच्चक्षुषा न पश्यति येन चक्षूंषि पश्यति । तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥",
        transliteration: "yaccakṣuṣā na paśyati yena cakṣūṃṣi paśyati | tadeva brahma tvaṃ viddhi nedaṃ yadidamupāsate ||",
        hindi: "जो आँख से नहीं देखा जा सकता, परंतु जिससे आँख देखती है - उसी को ब्रह्म जानो।",
        english: "That which cannot be seen by the eye, but by which the eyes see - know that alone as Brahman.",
        simpleExplanation: "The Eye of the Eye. You see the screen, but you don't see the light particles that make seeing possible. Brahman is that fundamental light.",
        simpleExplanationHindi: "आँख की आँख। आप स्क्रीन को देखते हैं, लेकिन आप उन प्रकाश कणों को नहीं देखते जो देखना संभव बनाते हैं। ब्रह्म वह मौलिक प्रकाश है।",
        nanoBananaPrompt: "An eye reflecting a galaxy, with golden rays of light originating from behind the eye.",
        theme: "Divine Sight"
    },
    {
        id: 8,
        section: "Philosophy",
        sanskrit: "यच्छ्रोत्रेण न शृणोति येन श्रोत्रमिदं श्रुतम् । तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥",
        transliteration: "yacchrotreṇa na śṛṇoti yena śrotramidaṃ śrutam | tadeva brahma tvaṃ viddhi nedaṃ yadidamupāsate ||",
        hindi: "जो कान से नहीं सुना जा सकता, परंतु जिससे कान सुनता है - उसी को ब्रह्म जानो।",
        english: "That which cannot be heard by the ear, but by which the ear hears - know that alone as Brahman.",
        simpleExplanation: "The Silent Listener. Behind every sound you hear, there is a space of awareness that hears it. That space is Brahman.",
        simpleExplanationHindi: "मौन श्रोता। आपके द्वारा सुनी जाने वाली हर ध्वनि के पीछे जागरूकता का एक स्थान होता है जो उसे सुनता है। वह स्थान ब्रह्म है।",
        nanoBananaPrompt: "Sound waves turning into glowing vines that lead into a chamber of pure, golden light.",
        theme: "Eternal Hearing"
    },

    // CHUNK 2: THE PARADOX (Khanda 2: Verses 9-13)
    {
        id: 9,
        section: "Philosophy",
        sanskrit: "यदि मन्यसे सुवेदेति दभ्रमेवापि नूनं त्वं वेत्थ ब्रह्मणो रूपम् ...",
        transliteration: "yadi manyase suvedeti dabhram evāpi nūnaṃ tvaṃ vettha brahmaṇo rūpam ...",
        hindi: "यदि तुम सोचते हो कि तुम ब्रह्म को अच्छी तरह जानते हो, तो तुम वास्तव में बहुत कम जानते हो।",
        english: "If you think you know Brahman well, you know but little. You must investigate It further.",
        simpleExplanation: "The Hubris of Knowledge. The moment you say 'I know everything about the Ocean,' you have missed its depth. Stay curious, stay humble.",
        simpleExplanationHindi: "ज्ञान का अहंकार। जिस क्षण आप कहते हैं 'मैं समुद्र के बारे में सब कुछ जानता हूँ', आप उसकी गहराई को भूल जाते हैं। जिज्ञासु रहें, विनम्र रहें।",
        nanoBananaPrompt: "A scientist looking through a microscope at a tiny speck, unaware of a giant cosmic entity behind them.",
        theme: "Humility in Knowledge"
    },
    {
        id: 10,
        section: "Philosophy",
        sanskrit: "नाहं मन्ये सुवेदेति नो न वेदेति वेद च । यो नस्तद्वेद तद्वेद नो न वेदेति वेद च ॥",
        transliteration: "nāhaṃ manye suvedeti no na vedeti veda ca | yo nastad veda tad veda no na vedeti veda ca ||",
        hindi: "मैं यह नहीं मानता कि मैं इसे अच्छी तरह जानता हूँ, और न ही यह कि मैं इसे नहीं जानता।",
        english: "I do not think I know It well, nor do I think I do not know It. He among us who knows this, knows It.",
        simpleExplanation: "The Great 'I Don't Know'. True wisdom is knowing that you are part of the truth, even if you can't define it in words. It's a feeling, not a fact.",
        simpleExplanationHindi: "महान 'मैं नहीं जानता'। सच्ची बुद्धिमत्ता यह जानना है कि आप सत्य का हिस्सा हैं, भले ही आप इसे शब्दों में परिभाषित न कर सकें। यह एक एहसास है, तथ्य नहीं।",
        nanoBananaPrompt: "A man holding a lantern in a misty forest, where the light shows the path but not the end of the forest.",
        theme: "The Middle Path"
    },
    {
        id: 11,
        section: "Philosophy",
        sanskrit: "यस्यामतं तस्य मतं मतं यस्य न वेद सः । अविज्ञातं विजानतां विज्ञातमविजानताम् ॥",
        transliteration: "yasyāmataṃ tasya mataṃ mataṃ yasya na veda saḥ | avijñātaṃ vijānatāṃ vijñātam avijānatām ||",
        hindi: "जिसके लिए यह अज्ञात है, वह इसे जानता है; जो इसे जानता है, वह इसे नहीं जानता।",
        english: "It is known to him to whom It is unknown; he to whom It is known does not know It. It is unknown to those who know; known to those who do not know.",
        simpleExplanation: "The Knowledge Paradox. If you think Truth is a trophy on your shelf, you don't have it. If you search for it like your own breath, you found it.",
        simpleExplanationHindi: "ज्ञान का विरोधाभास। यदि आपको लगता है कि सत्य आपकी शेल्फ पर एक ट्रॉफी है, तो आपके पास यह नहीं है। यदि आप इसे अपनी साँस की तरह खोजते हैं, तो आपने इसे पा लिया।",
        nanoBananaPrompt: "An empty pedestal glowing with light, while scholars with heavy books walk away in confusion.",
        theme: "The Paradox"
    },
    {
        id: 12,
        section: "Philosophy",
        sanskrit: "प्रतिबोधविदितं मतममृतत्वं हि विन्दते । आत्मना विन्दते वीर्यं विद्यया विन्दतेऽमृतम् ॥",
        transliteration: "pratibodhaviditaṃ matam amṛtatvaṃ hi vindate | ātmanā vindate vīryaṃ vidyayā vindate'mṛtam ||",
        hindi: "ब्रह्म का ज्ञान हर अनुभूति (पल्स) के माध्यम से होता है। इसी से अमरता प्राप्त होती है।",
        english: "It is known through every pulse of awareness. By the Self one obtains strength, by knowledge one obtains immortality.",
        simpleExplanation: "The Golden Thread. Every time you feel happy, sad, or alive, that's a 'ping' from Brahman. You don't need a temple; you just need to pay attention.",
        simpleExplanationHindi: "स्वर्ण धागा। हर बार जब आप खुशी, दुख या जीवित महसूस करते हैं, तो वह ब्रह्म का एक 'पिंग' होता है। आपको मंदिर की आवश्यकता नहीं है; आपको बस ध्यान देने की आवश्यकता है।",
        nanoBananaPrompt: "A heart beating with golden light, sending ripples of energy through a transparent human body.",
        theme: "Every Pulse"
    },
    {
        id: 13,
        section: "Philosophy",
        sanskrit: "इह चेदवेदीदथ सत्यमस्ति न चेदिहावेदीन्महती विनष्टिः । भूतेषु भूतेषु विचित्य धीराः ...",
        transliteration: "iha ced avedīd atha satyam asti na ced ihāvedīn mahatī vinaṣṭiḥ | bhūteṣu bhūteṣu vicitya dhīrāḥ ...",
        hindi: "यदि यहाँ जान लिया तो सत्य है; यदि नहीं जाना तो महान विनाश है।",
        english: "If one knows It here, truth is attained. If one does not know It here, there is great destruction. Recognizing It in all beings, the wise become immortal.",
        simpleExplanation: "Don't Waste Life. Life is a limited-time opportunity to find the source. If you miss it, you're just a machine running on borrowed time. Find it now.",
        simpleExplanationHindi: "जीवन व्यर्थ न गँवाएँ। जीवन स्रोत को खोजने का एक सीमित समय का अवसर है। यदि आप इसे चूक जाते हैं, तो आप केवल उधार के समय पर चलने वाली एक मशीन हैं। इसे अभी खोजें।",
        nanoBananaPrompt: "An hourglass where the sand is turning into golden light as it falls. Time vs Eternity theme.",
        theme: "The Urgency"
    },

    // CHUNK 3: THE STORY OF THE GODS (Khanda 3: Verses 14-25)
    {
        id: 14,
        section: "Story",
        sanskrit: "ब्रह्म ह देवेभ्यो विजिग्ये तस्य ह ब्रह्मणो विजये देवा अमहीयन्त ...",
        transliteration: "brahma ha devebhyo vijigye tasya ha brahmaṇo vijaye devā amahīyanta ...",
        hindi: "ब्रह्म ने देवताओं के लिए विजय प्राप्त की, पर देवताओं ने सोचा - 'यह विजय हमारी है' |",
        english: "Brahman once won a victory for the Devas (Gods). But the Devas, proud of their triumph, thought: 'Ours is this victory, ours is this glory.'",
        simpleExplanation: "The Stolen Credit. Imagine a company wins a big contract because of the invisible founder, but the employees think it was all their individual talent. That's Ego.",
        simpleExplanationHindi: "चोरी का श्रेय। कल्पना कीजिए कि एक कंपनी अदृश्य संस्थापक के कारण एक बड़ा अनुबंध जीतती है, लेकिन कर्मचारी सोचते हैं कि यह सब उनकी व्यक्तिगत प्रतिभा थी। यही अहंकार है।",
        nanoBananaPrompt: "Shining gods (Agni, Vayu, Indra) celebrating on a golden pedestal, looking proud and arrogant.",
        theme: "The Illusion of Success"
    },
    {
        id: 15,
        section: "Story",
        sanskrit: "तद्धैषां विजज्ञौ तेभ्यो ह प्रादुर्बभूव तन्न व्यजानन्त किमिदं यक्षमिति ॥",
        transliteration: "taddhaisāṃ vijajñau tebhyo ha prādurbabhūva tanna vyajānanta kimidaṃ yakṣamiti ||",
        hindi: "ब्रह्म उनके अहंकार को जान गया और उनके सामने एक यक्ष (आत्मा) के रूप में प्रकट हुआ।",
        english: "Brahman knew their pride and appeared before them in the form of a Yaksha (Spirit). They did not know who this mysterious Spirit was.",
        simpleExplanation: "The Mystery Guest. A stranger enters the party, and suddenly the most powerful people feel small because they can't identify him. The unknown is the greatest teacher.",
        simpleExplanationHindi: "रहस्यमय अतिथि। पार्टी में एक अजनबी प्रवेश करता है, और अचानक सबसे शक्तिशाली लोग छोटा महसूस करते हैं क्योंकि वे उसे पहचान नहीं पाते। अज्ञात सबसे बड़ा शिक्षक है।",
        nanoBananaPrompt: "A towering silhouette of pure light appearing before the gods, casting a long shadow.",
        theme: "The Intrusion"
    },
    {
        id: 16,
        section: "Story",
        sanskrit: "तेऽग्निमब्रुवञ्जातवेद एतद्विजानीहि किमेतद्यक्षमिति तथेति ॥",
        transliteration: "te'gnimabruvañ jātaveda etadvijānīhi kimetadyakṣamiti tatheti ||",
        hindi: "देवताओं ने अग्नि से कहा - 'हे अग्नि! जाओ और पता लगाओ कि यह यक्ष कौन है' |",
        english: "They said to Agni: 'O Jataveda (Fire God)! Find out what this Spirit is.' Agni said: 'So be it.'",
        simpleExplanation: "The First Scout. Agni, the god of fire and intelligence, is sent first. He represents our 'sight' and 'power to act.'",
        simpleExplanationHindi: "पहला स्काउट। अग्नि, अग्नि और बुद्धि के देवता, पहले भेजे जाते हैं। वह हमारी 'दृष्टि' और 'कार्य करने की शक्ति' का प्रतिनिधित्व करते हैं।",
        nanoBananaPrompt: "Agni, the god of fire with flames around him, walking towards a column of white light.",
        theme: "Mission Intelligence"
    },
    {
        id: 17,
        section: "Story",
        sanskrit: "तदभ्यद्रवत्तमभ्यवदत्कोऽसीत्यग्निर्वा अहमस्मीत्यब्रवीज्जातवेदा वा अहमस्मीति ॥",
        transliteration: "tadabhyadravat tamabhyavadat ko'sītyagnirvā ahamasmītyabravīj jātavedā vā ahamasmīti ||",
        hindi: "अग्नि यक्ष के पास पहुँचा। यक्ष ने पूछा - 'तुम कौन हो?' अग्नि ने गर्व से कहा - 'मैं अग्नि हूँ' |",
        english: "He rushed towards It. The Yaksha asked: 'Who are you?' He replied: 'I am Agni; I am Jataveda (the knower of all things born).'",
        simpleExplanation: "The Resume. Agni lists his titles. He is proud of his 'identity.' This is how we behave when we meet the Divine—we show our visiting cards first.",
        simpleExplanationHindi: "बायोडाटा। अग्नि अपनी उपाधियाँ गिनाते हैं। उन्हें अपनी 'पहचान' पर गर्व है। जब हम ईश्वर से मिलते हैं तो हम इसी तरह व्यवहार करते हैं—हम पहले अपने विजिटिंग कार्ड दिखाते हैं।",
        nanoBananaPrompt: "Agni standing tall, glowing brightly, pointing at himself while talking to a brilliant light.",
        theme: "The Ego's Name"
    },
    {
        id: 18,
        section: "Story",
        sanskrit: "तस्मिंस्त्वयि किं वीर्यमित्यपीदं सर्वं दहेयं यदिदं पृथिव्यामिति ॥",
        transliteration: "tashmiṃstvayi kiṃ vīryamityapīdaṃ sarvaṃ daheyaṃ yadidaṃ pṛthivyāmiti ||",
        hindi: "यक्ष ने पूछा - 'तुममें क्या शक्ति है?' अग्नि ने कहा - 'मैं इस पृथ्वी पर सब कुछ जला सकता हूँ' |",
        english: "The Yaksha asked: 'What power is in you?' Agni said: 'I can burn everything that is on this earth.'",
        simpleExplanation: "The Boast. 'I am a disruptor! I am a leader!' Agni thinks the heat is HIS. He forgets he's just a channel for the energy.",
        simpleExplanationHindi: "डींग मारना। 'मैं एक विघ्नकारी हूँ! मैं एक नेता हूँ!' अग्नि को लगता है कि गर्मी उसकी है। वह भूल जाता है कि वह केवल ऊर्जा का एक माध्यम है।",
        nanoBananaPrompt: "Agni shooting beams of fire from his hands into a dark void, showing off his power.",
        theme: "The Boast"
    },
    {
        id: 19,
        section: "Story",
        sanskrit: "तस्मै तृणं निदधावेतद्दहेति तदुपप्रेयाय सर्वजवेन तन्न शशाक दग्धुं ...",
        transliteration: "tasmai tṛṇaṃ nidadhāvetaddaheti tadupapreyāya sarvajavena tanna śaśāka dagdhuṃ ...",
        hindi: "यक्ष ने अग्नि के सामने एक तिनका रखा और कहा - 'इसे जलाओ' | अग्नि अपनी पूरी शक्ति लगाकर भी उसे जला नहीं पाया।",
        english: "The Yaksha placed a straw before him and said: 'Burn this.' Agni rushed at it with all his might, but was unable to burn it.",
        simpleExplanation: "The Ultimate Test. Even the mighty God of Fire cannot destroy a tiny piece of grass without the main power source (Brahman). Your talent is zero without the Soul.",
        simpleExplanationHindi: "अंतिम परीक्षा। यहां तक कि अग्नि का शक्तिशाली देवता भी मुख्य शक्ति स्रोत (ब्रह्म) के बिना घास के एक छोटे से टुकड़े को नष्ट नहीं कर सकता। आत्मा के बिना आपकी प्रतिभा शून्य है।",
        nanoBananaPrompt: "A mighty god of fire trying to burn a single floating blade of grass but failing, dramatic lighting.",
        theme: "The Straw Test"
    },
    {
        id: 20,
        section: "Story",
        sanskrit: "स तत एव निववृते नैतदशकं विज्ञातुं यदेतद्यक्षमिति ॥",
        transliteration: "sa tata eva nivavṛte naitadaśakaṃ vijñātuṃ yadetadyakṣamiti ||",
        hindi: "अग्नि हार मानकर वापस लौट आया और कहा - 'मैं नहीं जान पाया कि यह यक्ष कौन है' |",
        english: "He returned from there and said to the Gods: 'I was unable to find out what this Spirit is.'",
        simpleExplanation: "Humbled. The first 'Expert' admits failure. This is the beginning of wisdom: admitting you don't have all the answers.",
        simpleExplanationHindi: "विनम्रता। पहला 'विशेषज्ञ' असफलता स्वीकार करता है। यह बुद्धिमत्ता की शुरुआत है: यह स्वीकार करना कि आपके पास सभी उत्तर नहीं हैं।",
        nanoBananaPrompt: "Agni walking back to the other gods with his head bowed down and flames dimmed.",
        theme: "The Retreat of Fire"
    },
    {
        id: 21,
        section: "Story",
        sanskrit: "अथ वायुमब्रुवन्वायवेतद्विजानीहि किमेतद्यक्षमिति तथेति ॥",
        transliteration: "atha vāyumabruvan vāyavetadvijānīhi kimetadyakṣamiti tatheti ||",
        hindi: "फिर देवताओं ने वायु से कहा - 'हे वायु! तुम जाओ और पता लगाओ' |",
        english: "Then they said to Vayu: 'O Vayu (Wind God)! Find out what this Spirit is.' Vayu said: 'So be it.'",
        simpleExplanation: "The Second Scout. Now the power of 'Movement' and 'Will' is tested. Vayu thinks he is the master of speed.",
        simpleExplanationHindi: "दूसरा स्काउट। अब 'गति' और 'इच्छा' की शक्ति का परीक्षण किया गया है। वायु को लगता है कि वह गति का स्वामी है।",
        nanoBananaPrompt: "Vayu, the god of wind with swirling clouds around him, flying towards the mysterious Spirit.",
        theme: "The Force of Nature"
    },
    {
        id: 22,
        section: "Story",
        sanskrit: "तदभ्यद्रवत्तमभ्यवदत्कोऽसीति वायुर्वा अहमस्मीत्यब्रवीन्मातरिश्वा वा अहमस्मीति ॥",
        transliteration: "tadabhyadravat tamabhyavadat ko'sīti vāyurvā ahamasmītyabravīn mātariśvā vā ahamasmīti ||",
        hindi: "वायु यक्ष के पास पहुँचा। यक्ष ने पूछा - 'तुम कौन हो?' वायु ने कहा - 'मैं वायु हूँ' |",
        english: "He rushed towards It. The Yaksha asked: 'Who are you?' He replied: 'I am Vayu; I am Matarisvan (the one who moves through space).'",
        simpleExplanation: "The Brand. Vayu uses another fancy name - Matarisvan. We love our titles, don't we? Manager, Director, Vayu.",
        simpleExplanationHindi: "ब्रांड। वायु एक और शानदार नाम का उपयोग करता है - मातरिश्वन। हमें अपनी उपाधियाँ पसंद हैं, है न? प्रबंधक, निदेशक, वायु।",
        nanoBananaPrompt: "Vayu boasting with giant cyclones forming under his feet in front of the light.",
        theme: "The Pride of Movement"
    },
    {
        id: 23,
        section: "Story",
        sanskrit: "तस्मिंस्त्वयि किं वीर्यमित्यपीदं सर्वमाददीय यदिदं पृथिव्यामिति ॥",
        transliteration: "tasmiṃstvayi kiṃ vīryamityapīdaṃ sarvamādadīya yadidaṃ pṛthivyāmiti ||",
        hindi: "यक्ष ने पूछा - 'तुममें क्या शक्ति है?' वायु ने कहा - 'मैं पृथ्वी पर सब कुछ उड़ा सकता हूँ' |",
        english: "The Yaksha asked: 'What power is in you?' Vayu said: 'I can blow away everything that is on this earth.'",
        simpleExplanation: "The Force. 'I can move mountains!' Vayu is certain of his physical strength. He is the master of hurricanes.",
        simpleExplanationHindi: "शक्ति। 'मैं पहाड़ों को हिला सकता हूँ!' वायु को अपनी शारीरिक शक्ति पर पूरा भरोसा है। वह तूफानों का स्वामी है।",
        nanoBananaPrompt: "Vayu creating a massive hurricane that shakes everything except the mysterious Spirit.",
        theme: "The Great Blow"
    },
    {
        id: 24,
        section: "Story",
        sanskrit: "तस्मै तृणं निदधावेतदादत्स्वेति तदुपप्रेयाय सर्वजवेन तन्न शशाकादातुम् ...",
        transliteration: "tasmai tṛṇaṃ nidadhāvetadādatśveti tadupapreyāya sarvajavena tanna śaśākādātum ...",
        hindi: "यक्ष ने वही तिनका रखा और कहा - 'इसे उड़ा दो' | वायु ने पूरी शक्ति लगाई पर तिनका टस से मस नहीं हुआ।",
        english: "The Yaksha placed the same straw before him and said: 'Lift this.' Vayu rushed at it with all his force, but was unable to lift it.",
        simpleExplanation: "The Dead Weight. The greatest hurricane in the universe cannot move a single dry leaf if the 'Life Force' within the leaf is anchored by Brahman.",
        simpleExplanationHindi: "मृत भार। यदि पत्ती के भीतर की 'जीवन शक्ति' ब्रह्म द्वारा लंगर डाले हुए है, तो ब्रह्मांड का सबसे बड़ा तूफान एक सूखी पत्ती को भी नहीं हिला सकता।",
        nanoBananaPrompt: "A hurricane swirling around a tiny straw which remains fixed to the ground as if made of lead.",
        theme: "Immutable Straw"
    },
    {
        id: 25,
        section: "Story",
        sanskrit: "स तत एव निववृते नैतदशकं विज्ञातुं यदेतद्यक्षमिति ॥",
        transliteration: "sa tata eva nivavṛte naitadaśakaṃ vijñātuṃ yadetadyakṣamiti ||",
        hindi: "वायु भी वापस लौट आया। वह भी यक्ष को नहीं पहचान पाया।",
        english: "He returned from there and said to the Gods: 'I was unable to find out what this Spirit is.'",
        simpleExplanation: "Failure #2. Speed and Power are useless without Awareness. Vayu learns that his breath is not his own.",
        simpleExplanationHindi: "असफलता #2। जागरूकता के बिना गति और शक्ति बेकार हैं। वायु को पता चला है कि उसकी साँस उसकी अपनी नहीं है।",
        nanoBananaPrompt: "Vayu descending from the clouds, looking exhausted and quiet.",
        theme: "The Retreat of Wind"
    },

    // CHUNK 4: THE REVELATION (Khanda 4: Verses 26-34)
    {
        id: 26,
        section: "Story",
        sanskrit: "अथेन्द्रमब्रुवन मघवन्नेतद्विजानीहि किमेतद्यक्षमिति तथेति तदभ्यद्रवत्तस्मात्तिरोदधे ॥",
        transliteration: "athendramabruvan maghavannetadvijānīhi kimetadyakṣamiti tatheti tadabhyadravat tasmāt tirodadhe ||",
        hindi: "अंत में इंद्र यक्ष के पास गया, पर यक्ष उसके सामने से गायब हो गया।",
        english: "Then they said to Indra: 'O Maghavan (Indra)! find out who this Spirit is.' He rushed towards It, but the Yaksha vanished from his sight.",
        simpleExplanation: "The CEO approaches. Indra, the king of the gods (symbolizing the Mind/Ego), goes to meet Truth. But Truth cannot be caught by the ego. It vanishes.",
        simpleExplanationHindi: "CEO आता है। इंद्र, देवताओं का राजा (मन/अहंकार का प्रतीक), सत्य से मिलने जाता है। लेकिन सत्य अहंकार द्वारा नहीं पकड़ा जा सकता। वह गायब हो जाता है।",
        nanoBananaPrompt: "Indra, the king with a crown, reaching out to touch a fading ghost of golden light.",
        theme: "The Vanished Truth"
    },
    {
        id: 27,
        section: "Story",
        sanskrit: "स तस्मिन्नेवाकाशे स्त्रियमाजगाम बहुशोभमानामुमां हैमवतीं तां होवाच किमेतद्यक्षमिति ॥",
        transliteration: "sa tasminnevākāśe striyamājagāma bahuśobhamānām umāṃ haimavatīṃ tāṃ hovāca kimetadyakṣamiti ||",
        hindi: "उसी स्थान पर अत्यंत सुंदर देवी उमा (पार्वती) प्रकट हुई। इंद्र ने उनसे पूछा - 'यह यक्ष कौन था?'",
        english: "In that very spot in the sky, he beheld a woman of dazzling beauty, Uma (Haimavati). He asked her: 'Who was this Spirit?",
        simpleExplanation: "The Guide Appears. When the ego is confused, Divine Mother Uma (Knowledge/Wisdom) appears. You need a teacher to bridge the gap between You and Brahman.",
        simpleExplanationHindi: "मार्गदर्शक प्रकट होता है। जब अहंकार भ्रमित होता है, तो दिव्य माता उमा (ज्ञान/बुद्धि) प्रकट होती हैं। आपको अपने और ब्रह्म के बीच की खाई को पाटने के लिए एक शिक्षक की आवश्यकता है।",
        nanoBananaPrompt: "A beautiful celestial goddess in golden robes appearing in a vast indigo sky.",
        theme: "Goddess of Wisdom"
    },
    {
        id: 28,
        section: "Story",
        sanskrit: "सा ब्रह्मति होवाच ब्रह्मणो वा एतद्विजये महीयध्वमिति ...",
        transliteration: "sā brahmeti hovāca brahmaṇo vā etad vijaye mahīyadhvamiti ...",
        hindi: "उमा ने कहा - 'वह ब्रह्म था। उसकी विजय में ही तुम विजय का अनुभव कर रहे हो' |",
        english: "She said: 'That was Brahman. Through the victory of Brahman alone have you attained this glory.'",
        simpleExplanation: "The Big Reveal. 'It wasn't you, Indra. It was Brahman.' The miracle of life is not your achievement; it's the signature of the creator.",
        simpleExplanationHindi: "बड़ा खुलासा। 'यह तुम नहीं थे, इंद्र। यह ब्रह्म था।' जीवन का चमत्कार आपकी उपलब्धि नहीं है; यह रचयिता के हस्ताक्षर हैं।",
        nanoBananaPrompt: "Uma pointing towards the infinite sky, showing Indra the source of all power.",
        theme: "The Revelation"
    },
    {
        id: 29,
        section: "Story",
        sanskrit: "ततो हैव विदाञ्चकार ब्रह्मति ॥",
        transliteration: "tato haiva vidāñcakāra brahmeti ||",
        hindi: "तब इंद्र ने जाना कि वह ब्रह्म था।",
        english: "Then Indra understood that it was Brahman.",
        simpleExplanation: "Epiphany. The moment of realization. The 'Aha!' moment where the ego dissolves and knows the true power source.",
        simpleExplanationHindi: "जागरूकता। अहसास का क्षण। 'अहा!' क्षण जहाँ अहंकार विलीन हो जाता है और सच्ची शक्ति के स्रोत को जान जाता है।",
        nanoBananaPrompt: "Indra kneeling in respect to the sky, with a look of profound peace on his face.",
        theme: "The Realization"
    },
    {
        id: 30,
        section: "Story",
        sanskrit: "तस्माद्वा एते देवा अतितरामिवान्यान्देवान्यदग्निर्वायुरापस्ते ह्येनन्नेदिष्ठं पस्पर्शुरन्यत् ...",
        transliteration: "tasmādvā ete devā atitarāmivānyān devān yadagnir vāyurāpaste hyenannediṣṭhaṃ pasparśur ...",
        hindi: "इसीलिए अग्नि, वायु और इंद्र अन्य देवताओं से श्रेष्ठ माने जाते हैं, क्योंकि उन्होंने ब्रह्म को निकट से छुआ।",
        english: "Therefore, these Gods—Agni, Vayu, and Indra—excel the other Gods, for they approached nearest to Brahman and were the first to know It.",
        simpleExplanation: "The Superior Gods. Why is some knowledge better than others? Because it brings you closer to the core. Physics, Chemistry are great, but Philosophy (Self-knowledge) is supreme.",
        simpleExplanationHindi: "श्रेष्ठ देवता। क्यों कुछ ज्ञान दूसरों से बेहतर है? क्योंकि यह आपको मूल के करीब लाता है। भौतिकी, रसायन विज्ञान महान हैं, लेकिन दर्शन (आत्म-ज्ञान) सर्वोच्च है।",
        nanoBananaPrompt: "The three gods Agni, Vayu, and Indra standing closer to a central sun than all other divine beings.",
        theme: "The Inner Circle"
    },
    {
        id: 31,
        section: "Story",
        sanskrit: "तस्माद्वा इन्द्रोऽतितरामिवान्यान्देवान्स ह्येनन्नेदिष्ठं पस्पर्श ...",
        transliteration: "tasmādvā indro'titarāmivānyān devān sa hyenannediṣṭhaṃ pasparśa ...",
        hindi: "और इसीलिए इंद्र सबसे श्रेष्ठ है, क्योंकि उसने सबसे पहले इसे जाना।",
        english: "Therefore, Indra excels the other Gods, for he approached nearest to Brahman and was the first to know It.",
        simpleExplanation: "The King of Senses. Indra is our Mind. The mind is superior because it can process the mystery that the body and breath cannot. It can 'realize' Truth.",
        simpleExplanationHindi: "इंद्रियों का राजा। इंद्र हमारा मन है। मन श्रेष्ठ है क्योंकि यह उस रहस्य को संसाधित कर सकता है जिसे शरीर और श्वास नहीं कर सकते। यह सत्य का 'अहसास' कर सकता है।",
        nanoBananaPrompt: "Indra crowned with a halo of light, standing at the summit of a crystal mountain.",
        theme: "Supremacy of Mind"
    },
    {
        id: 32,
        section: "Story",
        sanskrit: "तस्यैष आदेशो यदेतद्विद्युतो व्यद्युतदा३ इतीति न्यमीमिषदा३ इत्यधिदैवतम् ॥",
        transliteration: "tasyaiṣa ādeśo yadetadvidyuto vyadyutadā3 itīti nyamīmiṣadā3 ityadhidaivatam ||",
        hindi: "ब्रह्म का आदेश बिजली की चमक की तरह है, या आँख झपकाने की तरह।",
        english: "Its instruction is this: It is like a flash of lightning; It is like a wink of the eye. This is with regard to the Devas (cosmic forces).",
        simpleExplanation: "Lightning Strike. Enlightenment is fast. You don't 'slowly' realize your house is on fire—you see it in a split second. Brahman is a sudden Flash of Truth.",
        simpleExplanationHindi: "बिजली का गिरना। ज्ञानोदय तीव्र है। आपको 'धीरे-धीरे' यह अहसास नहीं होता कि आपके घर में आग लगी है—आप इसे एक सेकंड में देखते हैं। ब्रह्म सत्य की एक अचानक चमक है।",
        nanoBananaPrompt: "A giant lightning bolt illuminating a dark city for a fraction of a second, revealing its true beauty.",
        theme: "The Flash"
    },
    {
        id: 33,
        section: "Story",
        sanskrit: "तपः दमो कर्मेति प्रतिष्ठा वेदाः सर्वाङ्गानि सत्यमायतनम् ॥",
        transliteration: "tapaḥ damo karmeti pratiṣṭhā vedāḥ sarvāṅgāni satyam āyatanam ||",
        hindi: "तपस्या, संयम और कर्म इस ज्ञान के आधार हैं। वेद इसके अंग हैं और सत्य इसका निवास है।",
        english: "Austerity, restraint, and dedicated work are Its feet; the Vedas are Its limbs; Truth is Its abode.",
        simpleExplanation: "The Foundation. How do you keep the light on? You need 'Tapa' (Hard work), 'Dama' (Control), and 'Karma' (Service). This is the infrastructure of a spiritual life.",
        simpleExplanationHindi: "बुनियाद। आप प्रकाश को कैसे चालू रखते हैं? आपको 'तप' (कड़ी मेहनत), 'दम' (नियंत्रण), और 'कर्म' (सेवा) की आवश्यकता है। यह एक आध्यात्मिक जीवन का बुनियादी ढांचा है।",
        nanoBananaPrompt: "A temple with three strong pillars labeled 'Austerity', 'Restraint', and 'Action'. Clean, minimal design.",
        theme: "The Three Pillars"
    },
    {
        id: 34,
        section: "Story",
        sanskrit: "यो वा एतामेवं वेदापहत्य पाप्मानमनन्ते स्वर्गे लोके ज्येये प्रतितिष्ठति प्रतितिष्ठति ॥",
        transliteration: "yo vā etāmevaṃ vedāpahatya pāpmānamanante svarge loke jyeye pratitiṣṭhati pratitiṣṭhati ||",
        hindi: "जो इसे इस प्रकार जानता है, वह पापों को नष्ट कर अनंत स्वर्ग लोक में प्रतिष्ठित होता है।",
        english: "He who knows this thus, shaking off all evil, becomes established in the infinite, blissful, and supreme heaven.",
        simpleExplanation: "Total Freedom. Success is not a bigger house. Success is 'Pratitiṣṭhati'—becoming established in your own infinite self. This is the end of all suffering.",
        simpleExplanationHindi: "पूर्ण स्वतंत्रता। सफलता एक बड़ा घर नहीं है। सफलता 'प्रतिष्ठित' होना है—अपने स्वयं के अनंत स्व में स्थापित होना। यह सभी दुखों का अंत है।",
        nanoBananaPrompt: "A human figure dissolving into a golden sun, representing total liberation and bliss.",
        theme: "Final Liberation"
    }
];

export const KENA_METADATA = {
    id: "kena",
    name: "Kena",
    nameSanskrit: "केन",
    veda: "Samaveda",
    shlokaCount: 34,
    khandaCount: 4,
    meaning: "By Whom? (The Science of Perception)",
    theme: "Deep Inquiry into the Mind and Senses",
    visualTheme: {
        primary: "#083344", // cyan-950
        secondary: "#2DD4BF", // teal-400
        accent: "#ECFEFF", // cyan-50
        gradient: "from-cyan-950 via-teal-900 to-slate-900",
    },
};

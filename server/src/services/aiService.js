// server/src/services/aiService.js

const MOCK_PLANT_DATABASE = {
    "cassava": {
        "issue": "Cassava Mosaic Disease (CMD)",
        "solution": "Uproot infected plants immediately. Use disease-resistant varieties like TMS 92/0326.",
        "fertilizer": "NPK 15-15-15 (apply 4-6 weeks after planting)",
        "confidence": 0.94
    },
    // ... we don't necessarily need to translate disease detect here since the frontend mostly uses ai/guide for textual info 
    // unless they use detect (which works via Python or fallback).
};

const GUIDE_DATABASE = {
    "maize": {
        "en": {
            "title": "Maize (Corn) High-Yield Guide",
            "description": "High-performing Maize requires deep plowing and early nitrogen application. Monitor for Fall Armyworm from germination.",
            "planting": "Plant in early March (March 15-31) for the main season. Space 75cm x 25cm.",
            "fertilizer": "Apply NPK 15-15-15 at planting. Follow with Urea at 4 and 7 weeks.",
            "harvest": "Harvest after 90-110 days when husks turn brown and dry.",
            "duration": "3.5 Months",
            "growthStages": [
                {"level": "Pre-planting", "fertilizer": "NPK 15-15-15 (Two bags/ha)", "herbicide": "LADABA (Pre-emergence)"},
                {"level": "3-4 Weeks", "fertilizer": "Urea (Top-dressing)", "herbicide": "Selective weeding"},
                {"level": "6 Weeks (Flowers)", "fertilizer": "NPK 20-10-10", "herbicide": "Manual weeding only"}
            ]
        },
        "fr": {
            "title": "Guide de Production de Maïs à Haut Rendement",
            "description": "Le maïs performant nécessite un labour profond et un apport précoce en azote. Surveillez la chenille légionnaire.",
            "planting": "Semer début mars (15-31 mars). Écartement 75cm x 25cm.",
            "fertilizer": "Appliquer NPK 15-15-15 au semis. Suivi d'Urée à 4 et 7 semaines.",
            "harvest": "Récolter après 90-110 jours quand les feuilles brunissent.",
            "duration": "3.5 Mois",
            "growthStages": [
                {"level": "Pré-semis", "fertilizer": "NPK 15-15-15 (Deux sacs/ha)", "herbicide": "LADABA (Pré-levée)"},
                {"level": "3-4 Semaines", "fertilizer": "Urée", "herbicide": "Désherbage sélectif"},
                {"level": "6 Semaines", "fertilizer": "NPK 20-10-10", "herbicide": "Désherbage manuel uniquement"}
            ]
        }
    },
    "cassava": {
        "en": {
            "title": "Cassava Tubers Growth Manual",
            "description": "Cassava is the most resilient crop. Best in sandy loam. Tuberization starts after month 3.",
            "planting": "Plant cuttings at 45 degree angle. Best in loose, sandy-loam soil.",
            "fertilizer": "Use NPK 12-12-17 or wood ash. Nitrogen is critical in first 3 months.",
            "harvest": "Ready in 10-12 months. Uproot carefully to avoid tuber damage.",
            "duration": "12 Months",
            "growthStages": [
                {"level": "1 Month", "fertilizer": "NPK 12-12-17", "herbicide": "Diuron (Pre-emergence)"},
                {"level": "3 Months", "fertilizer": "Potassium-rich organic mix", "herbicide": "Selective weeding"},
                {"level": "6-8 Months", "fertilizer": "Wood ash or Poultry manure", "herbicide": "Final cleaning"}
            ]
        },
        "fr": {
            "title": "Manuel de Croissance du Manioc",
            "description": "Le manioc est très résilient. Idéal en sol sablo-limoneux. La tubérisation commence au 3ème mois.",
            "planting": "Planter les boutures à un angle de 45 degrés.",
            "fertilizer": "Utiliser NPK 12-12-17 ou cendres. L'azote est crucial les 3 premiers mois.",
            "harvest": "Prêt en 10-12 mois. Déraciner avec précaution.",
            "duration": "12 Mois",
            "growthStages": [
                {"level": "1 Mois", "fertilizer": "NPK 12-12-17", "herbicide": "Diuron (Pré-levée)"},
                {"level": "3 Mois", "fertilizer": "Mélange bio riche en Potassium", "herbicide": "Désherbage sélectif"},
                {"level": "6-8 Mois", "fertilizer": "Cendre de bois ou fumier", "herbicide": "Nettoyage final"}
            ]
        }
    }
};

exports.detectDisease = async (imagePath) => {
    const fullPath = imagePath.toLowerCase();
    let detectedCrop = "Generic Crop";
    
    for (const crop of Object.keys(MOCK_PLANT_DATABASE)) {
        if (fullPath.includes(crop) || fullPath.includes(crop.replace(" ", "_"))) {
            detectedCrop = crop;
            break;
        }
    }

    if (MOCK_PLANT_DATABASE[detectedCrop]) {
        const result = MOCK_PLANT_DATABASE[detectedCrop];
        return {
            status: "success",
            crop: detectedCrop,
            disease: result.issue,
            solution: result.solution,
            treatment_window: result.fertilizer,
            confidence: `${(result.confidence * 100).toFixed(1)}%`
        };
    }

    return {
        status: "success",
        crop: "Generic Crop",
        disease: "General Environmental Stress",
        confidence: "45.0%",
        solution: "Optimize watering schedule and ensure adequate sunlight. Consult local experts.",
        treatment_window: "NPK 15-15-15 (Standard)"
    };
};

exports.getPlantGuide = async (plantName, lang = 'en') => {
    if (!plantName || typeof plantName !== 'string') {
        return { status: "error", message: "Invalid plant name" };
    }
    const query = plantName.toLowerCase().trim();
    for (const crop of Object.keys(GUIDE_DATABASE)) {
        if (query.includes(crop)) {
            const guide = GUIDE_DATABASE[crop][lang] || GUIDE_DATABASE[crop]['en'];
            return { status: "success", data: guide };
        }
    }

    // Smart AI Category Matching for Fallback
    const categories = {
        "tuber": ["yam", "potato", "macabo", "taro", "sweet", "igname", "pomme"],
        "fruit": ["mango", "avocado", "orange", "lemon", "guava", "papaya", "apple", "pineapple", "mangue", "avocat", "citron"],
        "leafy": ["lettuce", "cabbage", "spinach", "ndole", "kelenkelen", "laitue", "chou"],
        "cereal": ["rice", "sorghum", "millet", "wheat", "riz", "blé"],
        "bean": ["bean", "pea", "soya", "groundnut", "haricot", "pois", "arachide"]
    };

    let foundCategory = "general";
    for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some(kw => query.includes(kw))) {
            foundCategory = cat;
            break;
        }
    }

    const isFr = lang === 'fr';

    // Tailored Fallback Templates
    const templates = {
        "tuber": {
            title: isFr ? `Guide Spécialisé: Tubercules (${plantName})` : `Root & Tuber Guide: ${plantName}`,
            description: isFr ? `Les tubercules ont besoin d'un sol meuble pour s'étendre.` : `Tubers need loose, aerated soil to allow expansion.`,
            planting: isFr ? `Planter sur des billons ou buttes pour un bon drainage.` : `Plant in ridges or mounds for best crop drainage.`,
            fertilizer: isFr ? `Un apport élevé en Potassium (K) est vital pour le poids.` : `High Potassium (K) is needed for heavy tuber weight.`,
            harvest: isFr ? `Récolter quand les feuilles jaunissent (6-9 mois).` : `Harvest when leaves yellow or after 6-9 months.`,
            duration: isFr ? "6 - 9 Mois" : "6 - 9 Months",
            growthStages: [
                {level: isFr ? "Phase Initiale" : "Early Stage", fertilizer: "NPK 15-15-15", herbicide: isFr ? "Manuel" : "Manual weeding"},
                {level: isFr ? "Tubérisation" : "Tuberization", fertilizer: isFr ? "Riche en Potassium" : "Potassium Rich", herbicide: "N/A"},
                {level: isFr ? "Maturité" : "Maturity", fertilizer: "N/A", herbicide: "N/A"}
            ]
        },
        "fruit": {
            title: isFr ? `Guide Arbre Fruitier: ${plantName}` : `Fruit Tree Guide: ${plantName}`,
            description: isFr ? `Culture à long terme. Nécessite de grands trous de plantation.` : `Long-term investment tree crop. Requires large planting holes.`,
            planting: isFr ? `Trous de 60cm, mélanger terre et fumier organique.` : `Dig 60cm holes, mix soil with organic manure.`,
            fertilizer: isFr ? `Appliquer NPK 2 fois par an (saison des pluies).` : `Apply NPK twice a year during rainy seasons.`,
            harvest: isFr ? `Prêt quand la couleur change.` : `Ready when fruit color changes or falls naturally.`,
            duration: isFr ? "3 - 5 Ans" : "3 - 5 Years",
            growthStages: [
                {level: isFr ? "Jeune plant" : "Juvenile", fertilizer: isFr ? "Boost Azote" : "Nitrogen boost", herbicide: isFr ? "Désherbage en rond" : "Ring weeding"},
                {level: isFr ? "Floraison" : "Flowering", fertilizer: isFr ? "Pulvérisation Bore/Zinc" : "Zinc/Boron foliar spray", herbicide: "Minimal"},
                {level: isFr ? "Fructification" : "Fruiting", fertilizer: "MOP / K-Sulfate", herbicide: "N/A"}
            ]
        },
        "leafy": {
            title: isFr ? `Légume Feuille: ${plantName}` : `Leafy Vegetable: ${plantName}`,
            description: isFr ? `Nécessite beaucoup d'eau et de nutriments pour le feuillage.` : `Requires constant moisture and high nitrogen for lush foliage.`,
            planting: isFr ? `Semis direct ou en pépinière avec arrosage quotidien.` : `Direct mapping or nursery with daily watering.`,
            fertilizer: isFr ? `Riche en Azote (Urée ou fumier de volaille).` : `High Nitrogen (Urea or pure poultry manure).`,
            harvest: isFr ? `Récolte continue. Ne pas arracher les racines.` : `Continuous harvest. Pluck leaves carefully.`,
            duration: isFr ? "30 - 60 Jours" : "30 - 60 Days",
            growthStages: [
                {level: isFr ? "Semis" : "Seeding", fertilizer: isFr ? "Fumier de fond" : "Base manure", herbicide: isFr ? "Paillage" : "Mulch"},
                {level: isFr ? "Poussée foliaire" : "Vegetative", fertilizer: isFr ? "Top-dress Azote" : "Nitrogen Top-dress", herbicide: isFr ? "Manuel" : "Hand-picking"}
            ]
        },
        "general": {
            title: isFr ? `Guide Expert IA: ${plantName}` : `AI Expert Guide: ${plantName} (Cameroon Zone)`,
            description: isFr ? `Feuille de route sur mesure pour ${plantName}. Optimisé pour notre sol.` : `Custom production roadmap for ${plantName}. Optimized for local soil.`,
            planting: isFr ? `Assurer un pH optimal du sol (5.5-7.0) pendant la saison des pluies.` : `For ${plantName}, ensure optimal soil pH (5.5-7.0) during rainy season.`,
            fertilizer: isFr ? `Recommandation Générale: Commencer avec NPK 15-15-15.` : "General Recommendation: Start with NPK 15-15-15.",
            harvest: isFr ? `Récolter quand les signes de maturité apparaissent.` : "Harvest when signs of physiological maturity appear.",
            duration: isFr ? "Spécifique à la plante" : "Plant-Specific",
            growthStages: [
                {level: isFr ? "Phase 1: Semis" : "Phase 1: Seedling", fertilizer: "NPK 15-15-15", herbicide: isFr ? "Pré-émergence" : "Pre-emergence"},
                {level: isFr ? "Phase 2: Croissance" : "Phase 2: Growth", fertilizer: isFr ? "Boost d'Azote" : "Nitrogen Boost", herbicide: isFr ? "Sarclage" : "Selective Weeding"},
                {level: isFr ? "Phase 3: Maturité" : "Phase 3: Maturity", fertilizer: isFr ? "Boost Potassium" : "Potassium Boost", herbicide: isFr ? "Nettoyage" : "Cleanup"}
            ]
        }
    };

    return {
        status: "success",
        data: templates[foundCategory] || templates["general"]
    };
};

exports.scanBags = async (imagePath) => {
    const isCorn = imagePath.toLowerCase().includes('corn') || imagePath.toLowerCase().includes('maize');
    return {
        status: "success",
        count: isCorn ? 14 : 8,
        weight: isCorn ? "700 kg" : "400 kg",
        crop: isCorn ? "White Corn" : "Cassava Tubers",
        status: `Graded (${isCorn ? 'A' : 'B'})`,
        confidence: "98.4%"
    };
};

exports.generateQuiz = async (cropName, lang = 'en') => {
    const name = cropName.toLowerCase();
    const isCorn = name.includes('corn') || name.includes('maize');
    const isFr = lang === 'fr';

    let quiz = [];
    if (isCorn) {
        quiz = isFr ? [
            {question: "Quelle est la meilleure période pour planter le maïs au Cameroun ?", options: ["Mars-Avril", "Octobre-Novembre", "Décembre-Janvier"], answer: "Mars-Avril"},
            {question: "Quel herbicide est utilisé en pré-émergence pour le maïs ?", options: ["Urée", "LADABA", "Huile de Neem"], answer: "LADABA"},
            {question: "Combien de temps faut-il pour qu'un maïs commun soit mature ?", options: ["6 mois", "3-4 mois", "1 an"], answer: "3-4 mois"}
        ] : [
            {question: "When is the best time to plant Maize in Cameroon?", options: ["March-April", "October-November", "December-January"], answer: "March-April"},
            {question: "Which herbicide is used as pre-emergence for Maize?", options: ["Urea", "LADABA", "Neem Oil"], answer: "LADABA"},
            {question: "How long does common Maize take to mature?", options: ["6 months", "3-4 months", "1 year"], answer: "3-4 months"}
        ];
    } else {
        quiz = isFr ? [
            {question: `Le ${cropName} pousse-t-il mieux sur des billons ou des buttes ?`, options: ["Billons", "Buttes", "Les deux"], answer: "Billons"},
            {question: "Quel est l'engrais principal pour la croissance initiale ?", options: ["Urée", "NPK 15-15-15", "MOP"], answer: "NPK 15-15-15"},
            {question: "Comment identifier la maturité ?", options: ["Les feuilles jaunissent", "Taille du fruit", "Les deux"], answer: "Les deux"}
        ] : [
            {question: `Is ${cropName} best grown in ridges or mounds?`, options: ["Ridges", "Mounds", "Either"], answer: "Ridges"},
            {question: "What is the primary fertilizer for initial growth?", options: ["Urea", "NPK 15-15-15", "MOP"], answer: "NPK 15-15-15"},
            {question: "How do you identify maturity?", options: ["Leaves turn yellow", "Fruit size", "Both"], answer: "Both"}
        ];
    }

    return { status: "success", quiz };
};

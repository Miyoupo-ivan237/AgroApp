// server/src/services/aiService.js

const MOCK_PLANT_DATABASE = {
    "cassava": {
        "issue": "Cassava Mosaic Disease (CMD)",
        "solution": "Uproot infected plants immediately. Use disease-resistant varieties like TMS 92/0326.",
        "fertilizer": "NPK 15-15-15 (apply 4-6 weeks after planting)",
        "confidence": 0.94
    },
    "maize": {
        "issue": "Fall Armyworm Damage",
        "solution": "Manual collection of larvae or use of organic pesticides (Neem oil).",
        "fertilizer": "NPK 15-15-15 (Two bags/ha) + Urea (apply 2 and 6 weeks after germination). Note: Use LADABA as pre-emergence herbicide.",
        "confidence": 0.88
    },
    "tomato": {
        "issue": "Early Blight",
        "solution": "Remove lower infected leaves. Avoid overhead watering.",
        "fertilizer": "Calcium-rich fertilizer to prevent blossom end rot.",
        "confidence": 0.91
    },
    "cocoa": {
        "issue": "Black Pod Disease (Phytophthora)",
        "solution": "Prune excess branches for better airflow. Remove and destroy infected pods.",
        "fertilizer": "NPK 0-23-19 or specialized Cocoa fertilizer.",
        "confidence": 0.92
    },
    "oil palm": {
        "issue": "Basal Stem Rot (Ganoderma)",
        "solution": "Isolate infected trees. Improve soil drainage and use Bio-fungicides.",
        "fertilizer": "Potassium-rich fertilization (MOP).",
        "confidence": 0.85
    }
};

const GUIDE_DATABASE = {
    "maize": {
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
    "cassava": {
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
    }
    // ... more can be ported as needed
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

exports.getPlantGuide = async (plantName) => {
    const query = plantName.toLowerCase().trim();
    for (const crop of Object.keys(GUIDE_DATABASE)) {
        if (query.includes(crop)) {
            return { status: "success", data: GUIDE_DATABASE[crop] };
        }
    }

    // AI Fallback Generation (Instant)
    return {
        status: "success",
        data: {
            title: `AI Expert Guide: ${plantName} (Cameroon Zone)`,
            description: `Custom production roadmap for ${plantName}. Optimized for local soil.`,
            planting: `For ${plantName}, ensure optimal soil pH (5.5-7.0) during rainy season.`,
            fertilizer: "General Recommendation: Start with NPK 15-15-15.",
            harvest: "Harvest when signs of physiological maturity appear.",
            duration: "Category Specific",
            growthStages: [
                {level: "Phase 1: Seedling", fertilizer: "NPK 15-15-15", herbicide: "Pre-emergence"},
                {level: "Phase 2: Growth", fertilizer: "Nitrogen Boost", herbicide: "Selective Weeding"},
                {level: "Phase 3: Maturity", fertilizer: "Potassium Boost", herbicide: "Cleanup"}
            ]
        }
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

exports.generateQuiz = async (cropName) => {
    const name = cropName.toLowerCase();
    const isCorn = name.includes('corn') || name.includes('maize');
    
    const quiz = isCorn ? [
        {question: "When is the best time to plant Maize in Cameroon?", options: ["March-April", "October-November", "December-January"], answer: "March-April"},
        {question: "Which herbicide is used as pre-emergence for Maize?", options: ["Urea", "LADABA", "Neem Oil"], answer: "LADABA"},
        {question: "How long does common Maize take to mature?", options: ["6 months", "3-4 months", "1 year"], answer: "3-4 months"}
    ] : [
        {question: `Is ${cropName} best grown in ridges or mounds?`, options: ["Ridges", "Mounds", "Either"], answer: "Ridges"},
        {question: "What is the primary fertilizer for initial growth?", options: ["Urea", "NPK 15-15-15", "MOP"], answer: "NPK 15-15-15"},
        {question: "How do you identify maturity?", options: ["Leaves turn yellow", "Fruit size", "Both"], answer: "Both"}
    ];

    return { status: "success", quiz };
};

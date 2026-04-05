<?php
// php-server/include/ai_engine.php

function generatePlantGuide($plant_name, $lang = 'en') {
    $plant_name = strtolower(trim($plant_name));
    
    // 1. Exact/Partial Match Database
    $database = [
        "maize" => [
            "en" => [
                "title" => "Maize (Corn) High-Yield Guide",
                "description" => "High-performing Maize requires deep plowing and early nitrogen application.",
                "planting" => "Plant in early March (March 15-31). Space 75cm x 25cm.",
                "fertilizer" => "Apply NPK 15-15-15 at planting. Follow with Urea at 4 and 7 weeks.",
                "harvest" => "Harvest after 90-110 days when husks turn brown.",
                "herbicide_info" => "Use LADABA as pre-emergence. Post-emergence weeding at 3 weeks.",
                "duration" => "3.5 Months",
                "growthStages" => [
                    ["level" => "Seeding", "fertilizer" => "NPK 15-15-15", "herbicide" => "LADABA"],
                    ["level" => "V4 Stage", "fertilizer" => "Urea", "herbicide" => "Selective weeding"],
                    ["level" => "Flowering", "fertilizer" => "NPK 20-10-10", "herbicide" => "Manual"]
                ]
            ],
            "fr" => [
                "title" => "Guide de Production de Maïs",
                "description" => "Le maïs à haut rendement nécessite un labour profond et un apport d'azote précoce.",
                "planting" => "Semer fin mars. Espacement 75cm x 25cm.",
                "fertilizer" => "NPK 15-15-15 au semis. Urée à 4 et 7 semaines.",
                "harvest" => "Récolte après 90-110 jours.",
                "herbicide_info" => "Utiliser LADABA en pré-émergence. Sarclage à 3 semaines.",
                "duration" => "3.5 Mois",
                "growthStages" => [
                    ["level" => "Semis", "fertilizer" => "NPK 15-15-15", "herbicide" => "LADABA"],
                    ["level" => "Croissance", "fertilizer" => "Urée", "herbicide" => "Désherbage sélectif"]
                ]
            ]
        ],
        "cassava" => [
            "en" => [
                "title" => "Cassava (Manioc) Expert Manual",
                "description" => "Cassava is the most resilient crop. Best in sandy loam.",
                "planting" => "Plant cuttings at 45° angle vertically.",
                "fertilizer" => "NPK 12-12-17 or wood ash. Nitrogen is critical in first 3 months.",
                "harvest" => "Ready in 10-12 months.",
                "herbicide_info" => "Apply Diuron before planting.",
                "duration" => "12 Months",
                "growthStages" => [
                    ["level" => "1 Month", "fertilizer" => "NPK 12-12-17", "herbicide" => "Diuron"],
                    ["level" => "3 Months", "fertilizer" => "Potassium mix", "herbicide" => "Manual"]
                ]
            ],
             "fr" => [
                "title" => "Manuel d'Expert : Manioc (Cassava)",
                "description" => "Le manioc est la culture la plus résiliente. Préfère les sols sablo-limoneux.",
                "planting" => "Planter les boutures à un angle de 45°.",
                "fertilizer" => "NPK 12-12-17 ou cendres de bois. L'azote est crucial les 3 premiers mois.",
                "harvest" => "Prêt en 10-12 mois.",
                "herbicide_info" => "Appliquer Diuron avant plantation.",
                "duration" => "12 Mois",
                "growthStages" => [
                    ["level" => "1 Mois", "fertilizer" => "NPK 12-12-17", "herbicide" => "Diuron"],
                    ["level" => "3 Mois", "fertilizer" => "Mélange potassique", "herbicide" => "Manuel"]
                ]
            ]
        ],
        "tomato" => [
            "en" => [
                "title" => "Tomato Intensive Production",
                "description" => "Requires high maintenance and staking.",
                "planting" => "Transplant after 3 weeks in nursery.",
                "fertilizer" => "NPK 15-15-15 + Calcium Nitrate.",
                "harvest" => "Harvest once pink/red blush appears.",
                "herbicide_info" => "Mulching is better than chemical herbicides.",
                "duration" => "2.5 Months",
                "growthStages" => [
                    ["level" => "Transplant", "fertilizer" => "Phosphate swap", "herbicide" => "Mulching"],
                    ["level" => "Fruiting", "fertilizer" => "Calcium Nitrate", "herbicide" => "Spot weeding"]
                ]
            ],
            "fr" => [
                "title" => "Production Intensive de Tomates",
                "description" => "Nécessite un entretien élevé et un tuteurage.",
                "planting" => "Repiquage après 3 semaines en pépinière.",
                "fertilizer" => "NPK 15-15-15 + Nitrate de Calcium.",
                "harvest" => "Récolter dès l'apparition du rose/rouge.",
                "herbicide_info" => "Le paillage est préférable aux herbicides chimiques.",
                "duration" => "2.5 Mois",
                "growthStages" => [
                    ["level" => "Repiquage", "fertilizer" => "Phosphate", "herbicide" => "Paillage"],
                    ["level" => "Fructification", "fertilizer" => "Nitrate de Calcium", "herbicide" => "Désherbage manuel"]
                ]
            ]
        ],
        "cocoa" => [
            "en" => [
                "title" => "Cocoa (Cacao) High Quality Manual",
                "description" => "Shade management is key to success.",
                "planting" => "Plant under temporary shade (plantain/banana).",
                "fertilizer" => "NPK 0-23-19 in circular trenches.",
                "harvest" => "Pick ripe pods with a sharp cutter.",
                "herbicide_info" => "Manual slashing of weeds is recommended.",
                "duration" => "3-4 Years",
                "growthStages" => [
                    ["level" => "Year 1", "fertilizer" => "Manure mix", "herbicide" => "Slashing"],
                    ["level" => "Production", "fertilizer" => "NPK 0-23-19", "herbicide" => "Manual"]
                ]
            ],
            "fr" => [
                "title" => "Manuel Cocoa (Cacao) de Haute Qualité",
                "description" => "La gestion de l'ombre est la clé du succès.",
                "planting" => "Planter sous ombre temporaire (plantain/banane).",
                "fertilizer" => "NPK 0-23-19 en tranchées circulaires.",
                "harvest" => "Récolter les cabosses mûres avec un sécateur.",
                "herbicide_info" => "Le fauchage manuel des mauvaises herbes est recommandé.",
                "duration" => "3-4 Ans",
                "growthStages" => [
                    ["level" => "An 1", "fertilizer" => "Mélange de fiente", "herbicide" => "Fauchage"],
                    ["level" => "Production", "fertilizer" => "NPK 0-23-19", "herbicide" => "Manuel"]
                ]
            ]
        ],
        "oil palm" => [
            "en" => [
                "title" => "Oil Palm Success Guide",
                "description" => "Requires magnesium and potassium balance.",
                "planting" => "Space 9m x 9m in triangle pattern.",
                "fertilizer" => "NPK 12-12-17-2 + MOP.",
                "harvest" => "Use specialized harvesting chisel or knife.",
                "herbicide_info" => "Maintain clean circles around the palms.",
                "duration" => "3 Years",
                "growthStages" => [
                    ["level" => "Immature", "fertilizer" => "NPK 15-15-15", "herbicide" => "Ring weeding"],
                    ["level" => "Production", "fertilizer" => "MOP + Urea", "herbicide" => "Ring weeding"]
                ]
            ]
        ]
    ];
    
    // Check for match
    foreach ($database as $key => $guides) {
        if (strpos($plant_name, $key) !== false) {
            return $guides[$lang] ?? $guides['en'];
        }
    }
    
    // 2. Rule-Based Fallback (The "Engine")
    // If not in database, we classify the plant category and generate a logic
    $categories = [
        "tuber" => ["yam", "potato", "macabo", "taro", "sweet"],
        "fruit" => ["mango", "avocado", "orange", "lemon", "guava", "papaya", "apple", "pineapple"],
        "leafy" => "lettuce cabbage spinach ndole kelenkelen",
        "cereal" => "rice sorghum millet wheat",
        "bean" => "bean pea soya groundnut"
    ];
    
    $found_cat = "general";
    foreach ($categories as $cat => $keywords) {
        if (is_array($keywords)) {
            foreach ($keywords as $kw) {
                if (strpos($plant_name, $kw) !== false) { $found_cat = $cat; break 2; }
            }
        } else {
            if (strpos($keywords, $plant_name) !== false) { $found_cat = $cat; break; }
        }
    }
    
    $templates = [
        "tuber" => [
            "en" => [
                "title" => "Root & Tuber Guide: " . ucfirst($plant_name),
                "description" => "Tubers like " . $plant_name . " need loose, aerated soil to allow expansion.",
                "planting" => "Plant in ridges or mounds for best drainage.",
                "fertilizer" => "High Potassium (K) is needed for tuber weight.",
                "harvest" => "Harvest when leaves yellow or after 6-9 months.",
                "herbicide_info" => "Manual weeding is safest to avoid root damage.",
                "duration" => "8 Months",
                "growthStages" => [
                    ["level" => "Early", "fertilizer" => "NPK 15-15-15", "herbicide" => "Manual"],
                    ["level" => "Tuberization", "fertilizer" => "Potassium rich", "herbicide" => "N/A"]
                ]
            ]
        ],
        "fruit" => [
            "en" => [
                "title" => "Fruit Tree Guide: " . ucfirst($plant_name),
                "description" => ucfirst($plant_name) . " trees are long-term investments. Ensure big holes.",
                "planting" => "Dig 60cm holes, mix soil with organic manure.",
                "fertilizer" => "Apply NPK 15-15-15 twice a year (Rainy seasons).",
                "harvest" => "Ready when fruit color changes or falls naturally.",
                "herbicide_info" => "Ring weeding around the base (1.5m radius).",
                "duration" => "3-5 Years",
                "growthStages" => [
                    ["level" => "Juvenile", "fertilizer" => "Nitrogen boost", "herbicide" => "Ring weeding"],
                    ["level" => "Fruiting", "fertilizer" => "MOP or K-Sulfate", "herbicide" => "N/A"]
                ]
            ]
        ],
        "general" => [
            "en" => [
                "title" => "Agro Knowledge: " . ucfirst($plant_name),
                "description" => "Custom guide for " . $plant_name . " production in Cameroon.",
                "planting" => "Start at the onset of the first rainy season (March/April).",
                "fertilizer" => "Standard NPK 15-15-15 application after germination.",
                "harvest" => "Monitor color and size for harvest readiness.",
                "herbicide_info" => "Consult local experts for selective herbicides.",
                "duration" => "4 Months",
                "growthStages" => [
                    ["level" => "Vegetative", "fertilizer" => "NPK 15-15-15", "herbicide" => "Weeding"],
                    ["level" => "Reproduction", "fertilizer" => "Potassium boost", "herbicide" => "Cleanup"]
                ]
            ]
        ]
    ];
    
    return $templates[$found_cat][$lang] ?? $templates[$found_cat]['en'] ?? $templates['general']['en'];
}

/* 
AI DIAGNOSIS ENGINE (Rule-based)
*/
function analyzePlantDisease($crop_name) {
    $crop_name = strtolower(trim($crop_name));
    
    $common_issues = [
        "maize" => [
            "issue" => "Possible Fall Armyworm or Nitrogen Deficiency",
            "solution" => "Use EMAMECTINE BENZOATE for worms. Apply Top-dressing Urea if leaves are yellowing.",
            "window" => "3-6 Weeks after planting"
        ],
        "tomato" => [
            "issue" => "Blight or Blossom End Rot",
            "solution" => "Apply Mancozeb for blight. Use Calcium Nitrate for end rot (brown bottoms).",
            "window" => "During flowering/fruiting"
        ],
        "cassava" => [
            "issue" => "Cassava Mosaic Virus",
            "solution" => "Uproot and burn infected plants. Use CMD-resistant varieties like TMS-92/0326.",
            "window" => "1-4 Months after planting"
        ]
    ];
    
    foreach ($common_issues as $crop => $data) {
        if (strpos($crop_name, $crop) !== false) {
            return $data;
        }
    }
    
    return [
        "issue" => "Environmental Stress / Nutrient Deficit",
        "solution" => "Optimize irrigation and apply balanced NPK 15-15-15. Check soil pH.",
        "window" => "Immediate attention"
    ];
}
?>

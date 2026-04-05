<?php
// php-server/api/ai-guide.php
require_once __DIR__ . '/../include/helpers.php';

$token = getBearerToken();
$payload = verifyToken($token);

if (!$payload || ($payload['role'] !== 'ADMIN' && $payload['role'] !== 'FARMER')) {
    sendResponse(['error' => 'Unauthorized access.'], 403);
}

$data = json_decode(file_get_contents("php://input"), true);
$plant_name = trim($data['plant_name'] ?? '');

if (!$plant_name) {
    sendResponse(['error' => 'Please provide a plant name.'], 400);
}

// Performance Optimization: Check PHP static database first to avoid Python overhead
$php_guide_database = [
    "maize" => [
        "title" => "Maize (Corn) High-Yield Guide",
        "description" => "High-performing Maize requires deep plowing and early nitrogen application.",
        "planting" => "Plant in early March (March 15-31). Space 75cm x 25cm.",
        "fertilizer" => "Apply NPK 15-15-15 at planting. Follow with Urea at 4 and 7 weeks.",
        "harvest" => "Harvest after 90-110 days when husks turn brown and dry.",
        "herbicide_info" => "Use LADABA as pre-emergence. Post-emergence weeding at 3 weeks.",
        "duration" => "3.5 Months",
        "growthStages" => [
            ["level" => "Pre-planting", "fertilizer" => "NPK 15-15-15 (Two bags/ha)", "herbicide" => "LADABA (Pre-emergence)"],
            ["level" => "3-4 Weeks", "fertilizer" => "Urea (Top-dressing)", "herbicide" => "Selective weeding"],
            ["level" => "6 Weeks", "fertilizer" => "NPK 20-10-10", "herbicide" => "Manual weeding only"]
        ]
    ],
    "cassava" => [
        "title" => "Cassava Tubers Growth Manual",
        "description" => "Cassava is the most resilient crop. Best in sandy loam.",
        "planting" => "Plant cuttings at 45 degree angle. Best in loose, sandy-loam soil.",
        "fertilizer" => "Use NPK 12-12-17 or wood ash. Nitrogen is critical in first 3 months.",
        "harvest" => "Ready in 10-12 months. Uproot carefully.",
        "herbicide_info" => "Apply Diuron before planting. Manual weeding at 2 and 5 months.",
        "duration" => "12 Months",
        "growthStages" => [
            ["level" => "1 Month", "fertilizer" => "NPK 12-12-17", "herbicide" => "Diuron"],
            ["level" => "3 Months", "fertilizer" => "Potassium-rich organic mix", "herbicide" => "Selective weeding"],
            ["level" => "6-8 Months", "fertilizer" => "Wood ash", "herbicide" => "Final cleaning"]
        ]
    ],
    "tomato" => [
        "title" => "Tomato Expert Production",
        "description" => "Intensive management required. High irrigation and staking recommended.",
        "planting" => "Start in nursery for 3 weeks. Transplant in late afternoon.",
        "fertilizer" => "High Phosphorus at transplanting. Calcium Nitrate during flowering.",
        "harvest" => "Start picking at 'breaker' stage (first sign of pink).",
        "herbicide_info" => "Mulching is preferred over herbicides.",
        "duration" => "2.5 Months",
        "growthStages" => [
            ["level" => "Transplant", "fertilizer" => "DAP Starter", "herbicide" => "Mulching"],
            ["level" => "Growth Phase", "fertilizer" => "NPK 15-15-15", "herbicide" => "Hand pulling"],
            ["level" => "Fruiting", "fertilizer" => "Calcium Nitrate", "herbicide" => "Spot cleanup"]
        ]
    ],
    "cocoa" => [
        "title" => "Cocoa (Cacao) Production Guide",
        "description" => "Foundational crop for Cameroon. Needs tropical humidity and protection.",
        "planting" => "Plant in shaded nurseries then transplant under permanent shade (3m x 3m).",
        "fertilizer" => "NPK 0-23-19 applied in circular trenches.",
        "harvest" => "Pick ripe yellow/orange pods. Avoid damaging the flower cushion.",
        "herbicide_info" => "Manual slashing of weeds. Avoid chemicals near young trees.",
        "duration" => "3-5 Years (Initial)",
        "growthStages" => [
            ["level" => "Year 1", "fertilizer" => "Organic manure + NPK 15-15-15", "herbicide" => "Manual clearing"],
            ["level" => "Pre-flowering", "fertilizer" => "Potassium-rich blend", "herbicide" => "Slashing"],
            ["level" => "Main Harvest", "fertilizer" => "Cocoa specialized mix", "herbicide" => "N/A"]
        ]
    ],
    "oil palm" => [
        "title" => "Oil Palm (Elite Varieties)",
        "description" => "Steady income source. Requires careful ring weeding.",
        "planting" => "Triangular spacing 9m x 9m. Dig large holes (60cm).",
        "fertilizer" => "Heavy needs for Potassium and Magnesium.",
        "harvest" => "Cut clusters once at least 5 fruits detach naturally.",
        "herbicide_info" => "Ring weeding and path maintenance are critical.",
        "duration" => "3 Years (Initial)",
        "growthStages" => [
            ["level" => "Nursery", "fertilizer" => "Soluble NPK", "herbicide" => "Hand weeding"],
            ["level" => "Immature", "fertilizer" => "NPK 12-12-17-2", "herbicide" => "Ring weeding"],
            ["level" => "Mature", "fertilizer" => "MOP + Urea + Boron", "herbicide" => "N/A"]
        ]
    ],
    "avocado" => [
        "title" => "Avocado (Pear) Export Guide",
        "description" => "High-value fruit. Vulnerable to root rot; ensure excellent drainage.",
        "planting" => "Plant 7m x 7m apart in well-drained volcanic soil.",
        "fertilizer" => "Nitrogen in early years, more Potassium during fruit development.",
        "harvest" => "Harvest when full-sized but firm; ripens off the tree.",
        "herbicide_info" => "Mulching is vital to protect sensitive surface roots.",
        "duration" => "3-4 Years",
        "growthStages" => [
            ["level" => "Establishment", "fertilizer" => "NPK 20-10-10", "herbicide" => "Mulching"],
            ["level" => "Flowering", "fertilizer" => "Boron + Zinc spray", "herbicide" => "N/A"],
            ["level" => "Fruit Set", "fertilizer" => "Sulfate of Potash", "herbicide" => "N/A"]
        ]
    ],
    "pepper" => [
        "title" => "Hot Pepper (Chili) Success",
        "description" => "Very profitable but sensitive to water stress.",
        "planting" => "Nursery for 6 weeks. Transplant at 50cm x 50cm.",
        "fertilizer" => "NPK 15-15-15 + Urea. Needs Calcium to avoid rot.",
        "harvest" => "Once they reach desired color/size (start at 3 months).",
        "herbicide_info" => "Hand weeding only. Shallow roots are easily damaged.",
        "duration" => "3-5 Months",
        "growthStages" => [
            ["level" => "Transplant", "fertilizer" => "Starter solution", "herbicide" => "N/A"],
            ["level" => "Growth", "fertilizer" => "NPK 15-15-15", "herbicide" => "Hand weeding"],
            ["level" => "Fruiting", "fertilizer" => "Calcium Nitrate", "herbicide" => "N/A"]
        ]
    ],
    "yam" => [
        "title" => "Yam Tuber Production Manual",
        "description" => "High-value crop requiring ridges or mounds.",
        "planting" => "Mound or Ridge planting. 1m between mounds.",
        "fertilizer" => "NPK 15-15-15 + Organic matter.",
        "harvest" => "When vines dry completely (6-9 months).",
        "herbicide_info" => "Pre-emergence herbicide can be used on ridges.",
        "duration" => "8 Months",
        "growthStages" => [
            ["level" => "Vine emergence", "fertilizer" => "NPK 15-15-15", "herbicide" => "Manual weeding"],
            ["level" => "Tuberization", "fertilizer" => "Potassium boost", "herbicide" => "N/A"]
        ]
    ],
    "plantain" => [
        "title" => "Plantain & Banana Expert Guide",
        "description" => "Needs high rainfall. Heavy organic manure ensures large bunches.",
        "planting" => "Plant in holes 60x60x60cm with 2kg of manure.",
        "fertilizer" => "Needs lots of Potassium (MOP).",
        "harvest" => "Ready when top fruits turn yellow (9-12 months).",
        "herbicide_info" => "Manual weeding or mulching with old leaves.",
        "duration" => "10-14 Months",
        "growthStages" => [
            ["level" => "Establishment", "fertilizer" => "NPK 15-15-15", "herbicide" => "Manual clearing"],
            ["level" => "Vegetative", "fertilizer" => "Urea + MOP", "herbicide" => "Mulching"]
        ]
    ],
    "onion" => [
        "title" => "Onion Bulb Production",
        "description" => "Sensitive to competing weeds. Bulbing requires N-K balance.",
        "planting" => "Transplant after 6-8 weeks. 10cm apart.",
        "fertilizer" => "Needs Sulfur (Ammonium Sulfate).",
        "harvest" => "When 50-70% of necks break and tops fall over.",
        "herbicide_info" => "Very sensitive. Use selective pre-emergence.",
        "duration" => "4-5 Months",
        "growthStages" => [
            ["level" => "Early growth", "fertilizer" => "DAP", "herbicide" => "Pre-emergence"],
            ["level" => "Bulbing", "fertilizer" => "Ammonium Sulfate", "herbicide" => "Selective weeding"]
        ]
    ]
];

$query = strtolower($plant_name);
foreach ($php_guide_database as $key => $guide) {
    if (strpos($query, $key) !== false) {
        sendResponse([
            'message' => 'Cache search complete (Instant)',
            'plant' => $plant_name,
            'data' => $guide
        ]);
    }
}

// Fallback to Python AI if not in cache (This part takes more time)
$scriptPath = realpath('../../ai/plant_detector.py');
// On Windows, use 'py' for the script path launcher
$command = "py \"$scriptPath\" guide " . escapeshellarg($plant_name);
$output = shell_exec($command);

if (!$output) {
    sendResponse(['error' => 'AI Guide Module failed.'], 500);
}

$result = json_decode(trim($output), true);

if (isset($result['status']) && $result['status'] === 'success') {
    sendResponse([
        'message' => 'AI analysis complete',
        'plant' => $plant_name,
        'data' => $result['guide_data']
    ]);
} else {
    sendResponse(['error' => 'No guide found for this plant.'], 404);
}
?>

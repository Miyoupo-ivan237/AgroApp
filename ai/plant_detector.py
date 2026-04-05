import sys
import os
import json

# Mock AI Plant Detector for AgroConnect
# This script simulates the analysis of a crop image and returns solutions/fertilizer advice.

def detect_plant_issue(image_path):
    """
    Simulates TFLite model inference.
    """
    MOCK_DATABASE = {
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
        },
        "rubber": {
            "issue": "White Root Disease",
            "solution": "Apply sulfur powder around the base. Remove dead roots.",
            "fertilizer": "Standard ammonia-nitrogen mix.",
            "confidence": 0.87
        },
        "plantain": {
            "issue": "Black Sigatoka (Leaf Streak)",
            "solution": "Deleaf infected parts. Improve drainage and space plants 3m x 3m.",
            "fertilizer": "High Potassium (MOP) + Organic compost.",
            "confidence": 0.90
        },
        "banana": {
            "issue": "Panama Disease (Fusarium Wilt)",
            "solution": "Quarantine the area. Use tissue-culture clean plantlets.",
            "fertilizer": "NPK 15-15-15 regularly along the pseudostem base.",
            "confidence": 0.89
        },
        "yam": {
            "issue": "Yam Anthracnose",
            "solution": "Use certified clean seed yams. Spray with copper-based fungicides if severe.",
            "fertilizer": "Apply NPK 15-15-15 at 2 months after vine emergence.",
            "confidence": 0.86
        },
        "pepper": {
            "issue": "Pepper Veinal Mottle Virus",
            "solution": "Control aphids with soapy water. Remove infected plants.",
            "fertilizer": "Nitrogen-rich starting mix then Phosphorus for flowering.",
            "confidence": 0.92
        },
        "onion": {
            "issue": "Purple Blotch",
            "solution": "Crop rotation for 3 years. Ensure good bulb drying after harvest.",
            "fertilizer": "Apply Ammonium Sulfate as top-dressing.",
            "confidence": 0.88
        },
        "coffee": {
            "issue": "Coffee Berry Borer",
            "solution": "Harvest all ripe berries. Use traps with ethanol/methanol.",
            "fertilizer": "NPK 20-10-10 or specialized Coffee blends.",
            "confidence": 0.93
        },
        "rice": {
            "issue": "Rice Blast",
            "solution": "Avoid over-application of Nitrogen. Use resistant varieties like NERICA.",
            "fertilizer": "Split application of Urea (Basal + Panicle initiation).",
            "confidence": 0.91
        },
        "beans": {
            "issue": "Bean Rust",
            "solution": "Clean up crop debris after harvest. Avoid walking through wet fields.",
            "fertilizer": "DAP at planting helps root development.",
            "confidence": 0.88
        }
    }

    # Use full path for matching to allow folder-based identification (e.g., maize_samples/leaf.jpg)
    full_path = image_path.lower()
    filename = os.path.basename(image_path).lower()
    detected_crop = "General Plant"
    
    for crop in MOCK_DATABASE.keys():
        # Match with or without underscores (e.g., 'oil palm' matches 'oil_palm.jpg')
        crop_pattern = crop.replace(" ", "_")
        if crop in full_path or crop_pattern in full_path:
            detected_crop = crop
            break

    if detected_crop in MOCK_DATABASE:
        result = MOCK_DATABASE[detected_crop]
        return {
            "status": "success",
            "crop": detected_crop,
            "detected_issue": result["issue"],
            "recommended_solution": result["solution"],
            "fertilizer_schedule": result["fertilizer"],
            "confidence_score": result["confidence"]
        }
    else:
        return {
            "status": "success",
            "crop": "Generic Crop",
            "detected_issue": "General Nutrient Deficiency / Mild Stress",
            "recommended_solution": "Ensure consistent watering and check for small insects under leaves. Use organic manure to boost plant immunity.",
            "fertilizer_schedule": "Balanced NPK 15-15-15 or Compost application.",
            "confidence_score": 0.72
        }

def get_plant_guide(plant_name):
    """
    Returns growing details and fertilizer schedules for Cameroon-specific crops.
    """
    GUIDE_DATABASE = {
        "maize": {
            "title": "Maize (Corn) High-Yield Guide",
            "planting": "Plant in early March (March 15-31) for the main season. Space 75cm x 25cm.",
            "fertilizer": "Apply NPK 15-15-15 at planting. Follow with Urea at 4 and 7 weeks.",
            "harvest": "Harvest after 90-110 days when husks turn brown and dry.",
            "herbicide_info": "Use LADABA as pre-emergence. Post-emergence weeding at 3 weeks.",
            "duration": "3.5 Months",
            "growthStages": [
                {"level": "Pre-planting", "fertilizer": "NPK 15-15-15 (Two bags/ha)", "herbicide": "LADABA (Pre-emergence)"},
                {"level": "3-4 Weeks", "fertilizer": "Urea (Top-dressing)", "herbicide": "Selective weeding"},
                {"level": "6 Weeks (Flowers)", "fertilizer": "NPK 20-10-10", "herbicide": "Manual weeding only"}
            ]
        },
        "cassava": {
            "title": "Cassava Tubers Growth Manual",
            "planting": "Plant cuttings at 45 degree angle. Best in loose, sandy-loam soil.",
            "fertilizer": "Use NPK 12-12-17 or wood ash. Nitrogen is critical in first 3 months.",
            "harvest": "Ready in 10-12 months. Uproot carefully to avoid tuber damage.",
            "herbicide_info": "Apply Diuron before planting. Manual weeding at 2 and 5 months.",
            "duration": "12 Months",
            "growthStages": [
                {"level": "1 Month", "fertilizer": "NPK 12-12-17", "herbicide": "Diuron (Pre-emergence)"},
                {"level": "3 Months", "fertilizer": "Potassium-rich organic mix", "herbicide": "Selective weeding"},
                {"level": "6-8 Months", "fertilizer": "Wood ash or Poultry manure", "herbicide": "Final cleaning"}
            ]
        },
        "tomato": {
            "title": "Tomato Expert Production",
            "planting": "Start in nursery for 3 weeks. Transplant in late afternoon to reduce stress.",
            "fertilizer": "High Phosphorus at transplanting. Calcium Nitrate during flowering.",
            "harvest": "Start picking at 'breaker' stage (first sign of pink) for shipping.",
            "herbicide_info": "Mulching is preferred over herbicides to protect shallow roots.",
            "duration": "2.5 Months",
            "growthStages": [
                {"level": "Transplant", "fertilizer": "DAP or Starter mix", "herbicide": "Mulching"},
                {"level": "Growth Phase", "fertilizer": "NPK 15-15-15", "herbicide": "Hand pulling"},
                {"level": "Fruiting", "fertilizer": "Calcium Nitrate", "herbicide": "Spot cleanup"}
            ]
        },
        "beans": {
            "title": "Bush/Climbing Beans Guide",
            "planting": "Double rows for climbing beans. 50cm between rows, 10cm between plants.",
            "fertilizer": "Fixes its own nitrogen but benefits from initial DAP or NPK.",
            "harvest": "Harvest pods when they are dry and seeds rattle inside.",
            "herbicide_info": "Selective grass killers can be used if manual weeding is difficult.",
            "duration": "2.5 - 3 Months",
            "growthStages": [
                {"level": "Planting", "fertilizer": "Initial DAP (Optional)", "herbicide": "Pre-emergence"},
                {"level": "Flowering", "fertilizer": "N/A", "herbicide": "Selective weeding"},
                {"level": "Pod Filling", "fertilizer": "Potassium spray", "herbicide": "N/A"}
            ]
        },
        "plantain": {
            "title": "Plantain & Banana Expert Guide",
            "planting": "Plant in holes 60x60x60cm. Add 2kg of manure per hole.",
            "fertilizer": "Needs lots of Potassium. Apply 300g of MOP per mat per year.",
            "harvest": "Ready when top fruits turn slightly yellow (9-12 months).",
            "herbicide_info": "Manual weeding or mulching with old leaves is best.",
            "duration": "10-14 Months",
            "growthStages": [
                {"level": "Establisment", "fertilizer": "NPK 15-15-15", "herbicide": "Manual clearing"},
                {"level": "Vegetative", "fertilizer": "Urea + MOP", "herbicide": "Mulching"},
                {"level": "Flowering", "fertilizer": "Potassium sulfate", "herbicide": "N/A"}
            ]
        },
        "yam": {
            "title": "Yam Tuber Production Manual",
            "planting": "Mound or Ridge planting. 1m between mounds.",
            "fertilizer": "NPK 15-15-15 + Organic matter. Avoid direct contact with setts.",
            "harvest": "When vines dry completely (6-9 months).",
            "herbicide_info": "Pre-emergence herbicide can be used on ridges before vines emerge.",
            "duration": "8 Months",
            "growthStages": [
                {"level": "Vine emergence", "fertilizer": "NPK 15-15-15", "herbicide": "Manual weeding"},
                {"level": "Tuberization", "fertilizer": "Potassium boost", "herbicide": "N/A"},
                {"level": "Senescence", "fertilizer": "N/A", "herbicide": "N/A"}
            ]
        },
        "pepper": {
            "title": "Hot Pepper (Chili) Success",
            "planting": "Nursery for 6 weeks. Transplant at 50cm x 50cm.",
            "fertilizer": "NPK 15-15-15 + Urea. Needs Calcium to avoid rot.",
            "harvest": "Once they reach desired color/size (start at 3 months).",
            "herbicide_info": "Hand weeding. Shallow roots are easily damaged.",
            "duration": "3-5 Months",
            "growthStages": [
                {"level": "Transplant", "fertilizer": "Starter solution", "herbicide": "N/A"},
                {"level": "Growth Phase", "fertilizer": "NPK 15-15-15", "herbicide": "Hand weeding"},
                {"level": "Fruiting", "fertilizer": "Calcium Nitrate", "herbicide": "N/A"}
            ]
        },
        "onion": {
            "title": "Onion Bulb Production",
            "planting": "Sow in nursery. Transplant after 6-8 weeks. 10cm apart.",
            "fertilizer": "Needs Sulfur. Use Ammonium Sulfate as Nitrogen source.",
            "harvest": "When 50-70% of necks break and tops fall over.",
            "herbicide_info": "Very sensitive to weeds. Use selective pre-emergence.",
            "duration": "4-5 Months",
            "growthStages": [
                {"level": "Early growth", "fertilizer": "DAP", "herbicide": "Pre-emergence"},
                {"level": "Bulbbing", "fertilizer": "Ammonium Sulfate", "herbicide": "Selective weeding"},
                {"level": "Maturity", "fertilizer": "N/A", "herbicide": "N/A"}
            ]
        },
        "coffee": {
            "title": "Coffee (Arabica/Robusta) Guide",
            "planting": "Partial shade is best for young plants. Space 3m x 3m.",
            "fertilizer": "NPK 20-10-10 or 17-17-17. Apply twice a year.",
            "harvest": "Hand-pick only deep red cherries.",
            "herbicide_info": "Ring weeding around the base to reduce competition.",
            "duration": "3-4 Years (Initial)",
            "growthStages": [
                {"level": "Juvenile", "fertilizer": "NPK 15-15-15", "herbicide": "Ring weeding"},
                {"level": "Production", "fertilizer": "NPK 20-10-10", "herbicide": "Manual cleanup"},
                {"level": "Post-Harvest", "fertilizer": "Organic manure", "herbicide": "N/A"}
            ]
        },
        "rice": {
            "title": "Lowland/Upland Rice Manual",
            "planting": "Direct seeding or transplanting (20cm x 20cm).",
            "fertilizer": "Nitrogen split (Basal, Tillering, Panicle Initiation).",
            "harvest": "80% of grains in panicle turn straw-colored.",
            "herbicide_info": "Keep water level controlled to suppress weeds.",
            "duration": "4-5 Months",
            "growthStages": [
                {"level": "Tillering", "fertilizer": "Urea", "herbicide": "Flood control"},
                {"level": "Booting", "fertilizer": "NPK blend", "herbicide": "Spot weeding"},
                {"level": "Ripening", "fertilizer": "N/A", "herbicide": "N/A"}
            ]
        },
        "cocoa": {
            "title": "Cocoa (Cacao) Production Guide",
            "planting": "Plant in shaded nurseries then transplant under permanent shade (3m x 3m).",
            "fertilizer": "NPK 0-23-19 (high Phosphorus/Potassium) applied in circular trenches.",
            "harvest": "Pick ripe yellow/orange pods. Avoid damaging the flower cushion.",
            "herbicide_info": "Manual slashing of weeds. Avoid chemicals near young trees.",
            "duration": "3-5 Years (Initial)",
            "growthStages": [
                {"level": "Year 1", "fertilizer": "Organic manure + NPK 15-15-15", "herbicide": "Manual clearing"},
                {"level": "Pre-flowering", "fertilizer": "Potassium-rich blend", "herbicide": "Slashing"},
                {"level": "Main Harvest", "fertilizer": "Cocoa specialized mix", "herbicide": "N/A"}
            ]
        },
        "oil palm": {
            "title": "Oil Palm (Elite Varieties)",
            "planting": "Triangular spacing 9m x 9m. Dig large holes (60cm) with compost.",
            "fertilizer": "Heavy needs for Potassium and Magnesium (MOP & Kieserite).",
            "harvest": "Cut clusters when at least 5 fruits have detached naturally.",
            "herbicide_info": "Ring weeding and path maintenance are critical.",
            "duration": "3 Years (Initial)",
            "growthStages": [
                {"level": "Nursery", "fertilizer": "Soluble NPK", "herbicide": "Hand weeding"},
                {"level": "Immature", "fertilizer": "NPK 12-12-17-2", "herbicide": "Ring weeding"},
                {"level": "Mature", "fertilizer": "MOP + Urea + Boron", "herbicide": "N/A"}
            ]
        },
        "avocado": {
            "title": "Avocado (Pear) Export Guide",
            "planting": "Best in well-drained volcanic soil. Plant 7m x 7m apart.",
            "fertilizer": "Nitrogen in early years, more Potassium during fruit development.",
            "harvest": "Harvest when full-sized but still firm. Will ripen off the tree.",
            "herbicide_info": "Mulching is vital to protect sensitive surface roots.",
            "duration": "3-4 Years",
            "growthStages": [
                {"level": "Establishment", "fertilizer": "NPK 20-10-10", "herbicide": "Mulching"},
                {"level": "Flowering", "fertilizer": "Boron + Zinc spray", "herbicide": "N/A"},
                {"level": "Fruit Set", "fertilizer": "Sulfate of Potash", "herbicide": "N/A"}
            ]
        },
        "cabbage": {
            "title": "Cabbage (Market Head)",
            "planting": "4 weeks in nursery. Space 45cm x 45cm in the field.",
            "fertilizer": "High Nitrogen for leafy growth. Side-dress with Urea at 4 weeks.",
            "harvest": "Cut once the head is firm and reaches desired size.",
            "herbicide_info": "Requires frequent weeding until the canopy closes.",
            "duration": "3 Months",
            "growthStages": [
                {"level": "Transplant", "fertilizer": "DAP", "herbicide": "N/A"},
                {"level": "Head initiation", "fertilizer": "Ammonium Nitrate", "herbicide": "Manual weeding"},
                {"level": "Heading", "fertilizer": "Potassium Nitrate", "herbicide": "N/A"}
            ]
        }
    }
    
    query = plant_name.lower().strip()
    # Check for direct matches
    for crop in GUIDE_DATABASE:
        if crop in query:
            return {
                "status": "success",
                "guide_data": GUIDE_DATABASE[crop]
            }
    
    # AI Simulation Fallback - Smarter generation
    return {
        "status": "success",
        "guide_data": {
            "title": f"AI Expert Guide: {plant_name.capitalize()} (Cameroon Zone)",
            "planting": f"For {plant_name}, ensure optimal soil pH (5.5-7.0). Best planted during the rainy season onset in your specific Cameroon region.",
            "fertilizer": "General Recommendation: Start with NPK 15-15-15 at planting. Use Urea for leafy growth and Potassium-rich blends during fruit/tuber development.",
            "harvest": f"Harvest {plant_name} when signs of physiological maturity appear (dried leaves, color change, or size).",
            "herbicide_info": "Integrated Pest Management (IPM) is recommended: Combine manual weeding with selective herbicides if available.",
            "duration": "Category Specific - Consult Local Extension",
            "growthStages": [
                {"level": "Phase 1: Seedling", "fertilizer": "NPK 15-15-15", "herbicide": "Pre-emergence"},
                {"level": "Phase 2: Growth", "fertilizer": "Nitrogen Boost", "herbicide": "Selective Weeding"},
                {"level": "Phase 3: Maturity", "fertilizer": "Potassium Boost", "herbicide": "Cleanup"}
            ]
        }
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Incorrect arguments. Use 'detect [path]' or 'guide [name]'" }))
        sys.exit(1)
        
    command = sys.argv[1]
    
    # Handle direct path if someone uses the old way (python script.py path)
    if command.endswith(('.jpg', '.jpeg', '.png', '.webp')):
        result = detect_plant_issue(command)
        print(json.dumps(result, indent=4))
        sys.exit(0)

    if command == "detect" and len(sys.argv) >= 3:
        img_path = sys.argv[2]
        result = detect_plant_issue(img_path)
        print(json.dumps(result, indent=4))
    elif command == "guide" and len(sys.argv) >= 3:
        plant_name = sys.argv[2]
        result = get_plant_guide(plant_name)
        print(json.dumps(result, indent=4))
    else:
        print(json.dumps({"error": "Command not recognized or missing parameter."}))

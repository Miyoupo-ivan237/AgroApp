// src/pages/FarmerAssets.js

export const CAMEROON_SEASONAL_DATA = [
    { name: 'Maize (Corn)', bestPlanted: 'March - April', duration: '3-4 Months', tasks: ['Land prep (Feb)', 'Planting (Mar)', 'Weeding (Apr)', 'Harvest (July)'] },
    { name: 'Cassava', bestPlanted: 'March - May', duration: '12 Months', tasks: ['Planting (Mar)', 'Weeding (May)', 'Harvest (Next Mar)'] },
    { name: 'Potatoes', bestPlanted: 'Oct - Nov', duration: '3 Months', tasks: ['Planting (Oct)', 'Hilling (Nov)', 'Harvest (Jan)'] },
    { name: 'Tomatoes', bestPlanted: 'Jan - Feb (Irrigated)', duration: '2.5 Months', tasks: ['Nursery (Jan)', 'Transplant (Feb)', 'Harvest (April)'] },
    { name: 'Beans', bestPlanted: 'March - April', duration: '2.5 Months', tasks: ['Planting (Mar)', 'Staking (Apr)', 'Harvest (May)'] }
];

export const LEARNING_HUB_DATA = [
    { 
        id: 1, title: "Maize (Corn) Production", category: "Grains", topic: "Yield optimization & Solutions", color: "border-t-agro-orange", 
        description: "Maize is a staple crop in Cameroon. High yield requires early nitrogen and weed control.", language: "en",
        growthStages: [
            { level: "Pre-planting / Planting", fertilizer: "NPK 15-15-15 (Two bags/ha)", herbicide: "LADABA (Pre-emergence - Use before plant is out)" },
            { level: "3-4 Weeks (Vegetative)", fertilizer: "Urea (Top-dressing)", herbicide: "Selective Maize weeding product" },
            { level: "6 Weeks (Flowering)", fertilizer: "NPK 20-10-10", herbicide: "Hand weeding only" }
        ]
    },
    { 
        id: 2, title: "Cassava (Manioc) Guide", category: "Tubers", topic: "Maturation: 12 Months", color: "border-t-agro-green", 
        description: "Cassava needs loose soil and long-term weeding. Highly resilient.", language: "en",
        growthStages: [
            { level: "1 Month (Establishment)", fertilizer: "NPK 12-12-17", herbicide: "LADABA (Apply early for grass control)" },
            { level: "3 Months (Bulking)", fertilizer: "Potassium-rich organic mix", herbicide: "Selective weeding" },
            { level: "6-8 Months (Starch Dev)", fertilizer: "Wood ash or Poultry manure", herbicide: "Final cleaning" }
        ]
    },
    { 
        id: 3, title: "Tomato Expert Production", category: "Vegetables", topic: "Maturation: 70 Days", color: "border-t-red-400", 
        description: "Intensive care needed. Use stakes to keep fruits off the ground.", language: "en",
        growthStages: [
            { level: "Transplant", fertilizer: "Phosphate-rich (Starter)", herbicide: "N/A - Mulching recommended" },
            { level: "Vegetative", fertilizer: "NPK 15-15-15", herbicide: "Hand pulling weeds" },
            { level: "Fruiting", fertilizer: "Calcium Nitrate (Prevents rot)", herbicide: "Spot cleanup" }
        ]
    },
    { 
        id: 101, title: "Production de Maïs", category: "Céréales", topic: "Optimisation du rendement", color: "border-t-agro-orange", 
        description: "Maïs demande beaucoup d'azote tôt. Désherbage critique dès le début.", language: "fr",
        growthStages: [
            { level: "Avant Semis / Semis", fertilizer: "NPK 15-15-15 (Deux sacs/ha)", herbicide: "LADABA (Pré-émergence - Utiliser avant que la plante ne sorte)" },
            { level: "3-4 Semaines", fertilizer: "Urée (Couverture)", herbicide: "Désherbage sélectif Maïs" },
            { level: "6 Semaines", fertilizer: "NPK 20-10-10", herbicide: "Désherbage manuel uniquement" }
        ]
    },
    { 
        id: 102, title: "Manioc (Cassava)", category: "Tubercules", topic: "Maturation: 12 Mois", color: "border-t-agro-green", 
        description: "Besoin de sol meuble et désherbage régulier.", language: "fr",
        growthStages: [
            { level: "1 Mois", fertilizer: "NPK 12-12-17", herbicide: "Diuron (Pré-émergence)" },
            { level: "3 Mois (Tubérisation)", fertilizer: "Mélange potassique", herbicide: "Dégagement manuel" },
            { level: "6-8 Mois", fertilizer: "Cendres ou fiente", herbicide: "Nettoyage final" }
        ]
    }
];

export const MARKET_PRICES = [
    { name: 'White Maize', price: '220 CFA', trend: 'up', region: 'Bafoussam', unit: 'kg' },
    { name: 'Red Beans', price: '850 CFA', trend: 'down', region: 'Foumbot', unit: 'kg' },
    { name: 'Garri (Cassava)', price: '350 CFA', trend: 'stable', region: 'Douala', unit: 'kg' },
    { name: 'Tomatoes', price: '4500 CFA', trend: 'up', region: 'Mbouda', unit: 'Crate (15kg)' },
    { name: 'Onions', price: '450 CFA', trend: 'down', region: 'Maroua', unit: 'kg' },
    { name: 'Plantains', price: '3200 CFA', trend: 'up', region: 'Njombé', unit: 'Bunch' }
];

export const FR_MARKET_PRICES = [
    { name: 'Maïs Blanc', price: '220 CFA', trend: 'up', region: 'Bafoussam', unit: 'kg' },
    { name: 'Haricots Rouges', price: '850 CFA', trend: 'down', region: 'Foumbot', unit: 'kg' },
    { name: 'Garri (Manioc)', price: '350 CFA', trend: 'stable', region: 'Douala', unit: 'kg' },
    { name: 'Tomates', price: '4500 CFA', trend: 'up', region: 'Mbouda', unit: 'Cagette (15kg)' },
    { name: 'Oignons', price: '450 CFA', trend: 'down', region: 'Maroua', unit: 'kg' },
    { name: 'Banane Plantain', price: '3200 CFA', trend: 'up', region: 'Njombé', unit: 'Régime' }
];

export const AI_TIPS = [
    { id: 1, title: "Soil Moisture Alert", tip: "West region rainfall is increasing. Reduce irrigation for your Tubers to avoid root rot.", icon: "droplets" },
    { id: 2, title: "Market Spike Ready?", tip: "Tomato prices in Mbouda are up 15%. Consider harvesting your early 'breaker' stage crops now.", icon: "trending-up" },
    { id: 3, title: "Pest Warning", tip: "Fall Armyworm sightings reported in nearby Littoral. Inspect your Maize leaves for small holes daily.", icon: "alert-triangle" }
];

export const AI_FR_TIPS = [
    { id: 1, title: "Alerte Humidité", tip: "Les pluies augmentent à l'Ouest. Réduisez l'irrigation des tubercules pour éviter la pourriture.", icon: "droplets" },
    { id: 2, title: "Opportunité Marché", tip: "Le prix des tomates à Mbouda a grimpé de 15%. Récoltez vos fruits au stade 'vireux' maintenant.", icon: "trending-up" },
    { id: 3, title: "Alerte Ravageurs", tip: "Chenille légionnaire signalée au Littoral. Inspectez vos feuilles de maïs quotidiennement.", icon: "alert-triangle" }
];

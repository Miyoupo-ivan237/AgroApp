const { Crop, User } = require('../models');

exports.listCrops = async (req, res) => {
    try {
        const crops = await Crop.findAll({
            include: [{ model: User, as: 'farmer', attributes: ['id', 'full_name', 'phone'] }]
        });
        res.json(crops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addCrop = async (req, res) => {
    try {
        const { name, category, quantity_available_kg, price_per_kg_fcfa, region_location, image_url } = req.body;
        
        const newCrop = await Crop.create({
            farmer_id: req.user.id,
            name,
            category,
            quantity_available_kg,
            price_per_kg_fcfa,
            region_location,
            image_url
        });
        
        res.status(201).json(newCrop);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

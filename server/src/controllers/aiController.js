const aiService = require('../services/aiService');
const fs = require('fs');

/**
 * AI Controller - Optimized for Performance
 * Uses internal JS service for simulated AI to avoid process overhead.
 */

exports.detectDisease = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload an image for analysis.' });
    }

    try {
        const result = await aiService.detectDisease(req.file.path);
        
        // Clean up the uploaded file
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.json({
            disease: result.disease || 'Unknown',
            confidence: result.confidence || '0%',
            solution: result.solution || 'Consult an expert.',
            treatment_window: result.treatment_window || 'Immediate Attention Required',
            crop: result.crop || 'Unknown'
        });
    } catch (e) {
        console.error(`AI Detection Error:`, e);
        res.status(500).json({ error: 'AI Detection failed.' });
    }
};

exports.getPlantGuide = async (req, res) => {
    const { plant_name } = req.body;
    if (!plant_name) {
        return res.status(400).json({ error: 'Please provide a plant name.' });
    }

    try {
        const result = await aiService.getPlantGuide(plant_name);
        if (result.status === 'success') {
            res.json({
                status: 'success',
                data: result.data
            });
        } else {
            res.status(404).json({ error: 'Plant guide not found.' });
        }
    } catch (e) {
        console.error(`AI Guide Error:`, e);
        res.status(500).json({ error: 'AI Guide Module failed.' });
    }
};

exports.scanBags = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload an image of your bags.' });
    }

    try {
        const result = await aiService.scanBags(req.file.path);

        // Clean up the uploaded file
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.json({
            count: result.count,
            weight: result.weight,
            crop: result.crop,
            status: result.status,
            confidence: result.confidence
        });
    } catch (e) {
        console.error(`AI Bag Scan Error:`, e);
        res.status(500).json({ error: 'AI Bag Scan Module failed.' });
    }
};

exports.generateQuiz = async (req, res) => {
    const { crop_name } = req.body;
    if (!crop_name) {
        return res.status(400).json({ error: 'Please provide a crop name.' });
    }

    try {
        const result = await aiService.generateQuiz(crop_name);
        if (result.status === 'success') {
            res.json({
                status: 'success',
                quiz: result.quiz
            });
        } else {
            res.status(500).json({ error: 'Failed to generate quiz.' });
        }
    } catch (e) {
        console.error(`AI Error:`, e);
        res.status(500).json({ error: 'AI Module failed.' });
    }
};

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.detectDisease = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload an image for analysis.' });
    }

    const imagePath = req.file.path;
    const scriptPath = path.join(__dirname, '../../../ai/plant_detector.py');

    // Execute the Python script with 'detect' command
    exec(`python "${scriptPath}" detect "${imagePath}"`, (error, stdout, stderr) => {
        // Clean up the uploaded file after processing
        fs.unlinkSync(imagePath);

        if (error) {
            console.error(`AI Error: ${error.message}`);
            return res.status(500).json({ error: 'AI Module failed to process the image.' });
        }

        try {
            const result = JSON.parse(stdout);
            
            if (result.status === 'success') {
                res.json({
                    disease: result.detected_issue,
                    confidence: `${(result.confidence_score * 100).toFixed(1)}%`,
                    solution: result.recommended_solution,
                    treatment_window: result.fertilizer_schedule || 'Immediate Attention Required',
                    crop: result.crop || 'Unknown'
                });
            } else {
                res.json({
                    error: result.message || 'Crop not recognized by AI.'
                });
            }
        } catch (e) {
            console.error(`Parsing Error: ${stdout}`);
            res.status(500).json({ error: 'Failed to parse AI response.' });
        }
    });
};

exports.getPlantGuide = (req, res) => {
    const { plant_name } = req.body;
    if (!plant_name) {
        return res.status(400).json({ error: 'Please provide a plant name.' });
    }

    const scriptPath = path.join(__dirname, '../../../ai/plant_detector.py');

    // Execute the Python script with 'guide' command
    exec(`python "${scriptPath}" guide "${plant_name}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`AI Guide Error: ${error.message}`);
            return res.status(500).json({ error: 'AI Guide Module failed.' });
        }

        try {
            const result = JSON.parse(stdout);
            if (result.status === 'success') {
                res.json({
                    status: 'success',
                    data: result.guide_data
                });
            } else {
                res.status(404).json({ error: 'Plant guide not found.' });
            }
        } catch (e) {
            console.error(`Parsing Error: ${stdout}`);
            res.status(500).json({ error: 'Failed to parse AI guide response.' });
        }
    });
};

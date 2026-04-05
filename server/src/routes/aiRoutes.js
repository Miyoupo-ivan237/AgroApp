const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiController = require('../controllers/aiController');
const path = require('path');

// Configure Multer for temporary storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `plant-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

router.post('/detect', upload.single('image'), aiController.detectDisease);
router.post('/guide', aiController.getPlantGuide);
router.post('/quiz-gen', aiController.generateQuiz);
router.post('/bag_scan', upload.single('image'), aiController.scanBags);

module.exports = router;

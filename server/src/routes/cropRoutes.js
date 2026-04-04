const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleCheck');

// Public route to view crops
router.get('/', cropController.listCrops);

// Protected route for Farmers only
router.post('/', verifyToken, checkRole(['FARMER']), cropController.addCrop);

module.exports = router;

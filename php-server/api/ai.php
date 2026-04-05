<?php
// php-server/api/ai.php
require_once __DIR__ . '/../include/db.php';
require_once __DIR__ . '/../include/helpers.php';
require_once __DIR__ . '/../include/ai_engine.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

if (!isset($_FILES['image'])) {
    sendResponse(['error' => 'Please upload an image for analysis.'], 400);
}

$uploadDir = '../uploads/';
$fileName = 'plant-' . time() . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
$imagePath = $uploadDir . $fileName;

$crop_guess = $_POST['crop'] ?? 'maize'; // Get the crop from the user input if possible

if (move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
    // Correct paths for Python execution
    $absoluteImagePath = realpath($imagePath);
    $scriptPath = realpath('../../ai/plant_detector.py');
    
    // Execute Python script (with fallback)
    $command = "py \"$scriptPath\" detect \"$absoluteImagePath\"";
    $output = shell_exec($command);
    
    // Clean up
    if (file_exists($absoluteImagePath)) {
        unlink($absoluteImagePath);
    }
    
    // Attempt JSON parse
    $result = null;
    if ($output) {
        $result = json_decode(trim($output), true);
    }
    
    if ($result && isset($result['status']) && $result['status'] === 'success') {
        sendResponse([
            'status' => 'success',
            'disease' => $result['detected_issue'],
            'detected_issue' => $result['detected_issue'],
            'confidence_score' => $result['confidence_score'],
            'solution' => $result['recommended_solution'],
            'recommended_solution' => $result['recommended_solution'],
            'treatment_window' => $result['fertilizer_schedule'],
            'fertilizer_schedule' => $result['fertilizer_schedule'],
            'crop' => $result['crop'] ?? 'Unknown crop'
        ]);
    } else {
        // AI Fallback using Rule-based engine
        $lang = $_POST['lang'] ?? 'en';
        $instantDiagnosis = analyzePlantDisease($crop_guess, $lang);
        sendResponse([
            'status' => 'success',
            'disease' => $instantDiagnosis['issue'],
            'detected_issue' => $instantDiagnosis['issue'],
            'confidence_score' => 0.55,
            'solution' => $instantDiagnosis['solution'],
            'recommended_solution' => $instantDiagnosis['solution'],
            'treatment_window' => $instantDiagnosis['window'],
            'fertilizer_schedule' => $instantDiagnosis['window'],
            'crop' => $crop_guess,
            'fallback' => true 
        ]);
    }
} else {
    sendResponse(['error' => 'Failed to save uploaded image.'], 500);
}
?>

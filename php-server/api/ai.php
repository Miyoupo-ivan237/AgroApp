<?php
// php-server/api/ai.php
require_once __DIR__ . '/../include/db.php';
require_once __DIR__ . '/../include/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

if (!isset($_FILES['image'])) {
    sendResponse(['error' => 'Please upload an image for analysis.'], 400);
}

$uploadDir = '../uploads/';
$fileName = 'plant-' . time() . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
$imagePath = $uploadDir . $fileName;

if (move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
    // Correct paths for Python execution
    $absoluteImagePath = realpath($imagePath);
    $scriptPath = realpath('../../ai/plant_detector.py');
    
    // Execute Python script with 'detect' command
    $command = "py \"$scriptPath\" detect \"$absoluteImagePath\"";
    $output = shell_exec($command);
    
    // Clean up
    if (file_exists($absoluteImagePath)) {
        unlink($absoluteImagePath);
    }
    
    if (!$output) {
        sendResponse(['error' => 'AI Module failed to process the image.'], 500);
    }
    
    $result = json_decode($output, true);
    
    if (isset($result['status']) && $result['status'] === 'success') {
        sendResponse([
            'disease' => $result['detected_issue'],
            'confidence' => ($result['confidence_score'] * 100) . '%',
            'solution' => $result['recommended_solution'],
            'treatment_window' => $result['fertilizer_schedule'] ?? 'Immediate Attention Required'
        ]);
    } else {
        sendResponse(['error' => $result['message'] ?? 'Crop not recognized by AI.'], 400);
    }
} else {
    sendResponse(['error' => 'Failed to save uploaded image.'], 500);
}
?>

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
    
    $result = json_decode(trim($output), true);
    
    if ($result === null) {
        sendResponse(['error' => 'JSON Decode Error: ' . json_last_error_msg(), 'raw_output' => $output], 500);
    }
    
    if (isset($result['status']) && $result['status'] === 'success') {
        sendResponse([
            'status' => 'success',
            'disease' => $result['detected_issue'],
            'detected_issue' => $result['detected_issue'],
            'confidence_score' => $result['confidence_score'], // Return numeric for client-side formatting
            'solution' => $result['recommended_solution'],
            'recommended_solution' => $result['recommended_solution'],
            'treatment_window' => $result['fertilizer_schedule'],
            'fertilizer_schedule' => $result['fertilizer_schedule'],
            'crop' => $result['crop'] ?? 'Unknown crop'
        ]);
    } else {
        sendResponse(['error' => $result['message'] ?? 'Crop not recognized by AI.'], 400);
    }
} else {
    sendResponse(['error' => 'Failed to save uploaded image.'], 500);
}
?>

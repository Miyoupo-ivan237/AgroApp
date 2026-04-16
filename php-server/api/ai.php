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
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}
$fileName = 'plant-' . time() . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
$imagePath = $uploadDir . $fileName;

$crop_hint = $_POST['plant_name'] ?? $_POST['crop'] ?? 'general'; 

if (move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
    // Correct paths for Python execution
    $absoluteImagePath = realpath($imagePath);
    $scriptPath = realpath(__DIR__ . '/../../ai/plant_detector.py');
    
    // Environment-aware Python execution
    $pythonCmd = 'python3';
    exec("python3 --version", $out, $ret);
    if ($ret !== 0) {
        $pythonCmd = 'python';
        exec("python --version", $out, $ret);
        if ($ret !== 0) {
            $pythonCmd = 'py';
        }
    }

    $command = "$pythonCmd \"$scriptPath\" detect \"$absoluteImagePath\" \"$crop_hint\"";
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
        $instantDiagnosis = analyzePlantDisease($crop_hint, $lang);
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

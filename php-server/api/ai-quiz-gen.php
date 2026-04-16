<?php
// php-server/api/ai-quiz-gen.php
require_once __DIR__ . '/../include/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$data = json_decode(file_get_contents("php://input"), true);
$crop_name = $data['crop_name'] ?? 'general';

$scriptPath = realpath(__DIR__ . '/../../ai/plant_detector.py');

// Environment-aware Python execution
$pythonCmd = 'python3';
exec("python3 --version 2>&1", $out, $ret);
if ($ret !== 0) {
    $pythonCmd = 'python';
}

// Execute Python script
$command = "$pythonCmd \"$scriptPath\" quiz_gen \"$crop_name\"";
$output = shell_exec($command);

$result = null;
if ($output) {
    $result = json_decode(trim($output), true);
}

if ($result && isset($result['status']) && $result['status'] === 'success') {
    sendResponse($result);
} else {
    // Fallback
    sendResponse([
        'status' => 'success',
        'quiz' => [
            ["question" => "What is the best soil for this crop?", "options" => ["Sandy", "Loam", "Clay"], "answer" => "Loam"],
            ["question" => "When should you apply the first fertilizer?", "options" => ["At planting", "After 2 months", "During harvest"], "answer" => "At planting"]
        ]
    ]);
}
?>

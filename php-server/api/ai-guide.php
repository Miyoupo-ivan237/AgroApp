<?php
// php-server/api/ai-guide.php
require_once __DIR__ . '/../include/helpers.php';

$token = getBearerToken();
$payload = verifyToken($token);

if (!$payload || ($payload['role'] !== 'ADMIN' && $payload['role'] !== 'FARMER')) {
    sendResponse(['error' => 'Unauthorized access.'], 403);
}

$data = json_decode(file_get_contents("php://input"), true);
$plant_name = trim($data['plant_name'] ?? '');

if (!$plant_name) {
    sendResponse(['error' => 'Please provide a plant name.'], 400);
}

// Execute Python script with 'guide' command
$scriptPath = realpath('../../ai/plant_detector.py');
// On Windows, use 'py' for the script path launcher
$command = "py \"$scriptPath\" guide " . escapeshellarg($plant_name);
$output = shell_exec($command);

if (!$output) {
    sendResponse(['error' => 'AI Guide Module failed.'], 500);
}

$result = json_decode($output, true);

if (isset($result['status']) && $result['status'] === 'success') {
    sendResponse([
        'message' => 'AI analysis complete',
        'plant' => $plant_name,
        'data' => $result['guide_data']
    ]);
} else {
    sendResponse(['error' => 'Plant guide not found.'], 404);
}
?>

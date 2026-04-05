<?php
// php-server/api/ai-guide.php
require_once __DIR__ . '/../include/helpers.php';
require_once __DIR__ . '/../include/ai_engine.php';

$token = getBearerToken();
$payload = verifyToken($token);

if (!$payload || ($payload['role'] !== 'ADMIN' && $payload['role'] !== 'FARMER')) {
    sendResponse(['error' => 'Unauthorized access.'], 403);
}

$data = json_decode(file_get_contents("php://input"), true);
$plant_name = trim($data['plant_name'] ?? '');
$lang = $data['lang'] ?? 'en';

if (!$plant_name) {
    sendResponse(['error' => 'Please provide a plant name.'], 400);
}

// Instant AI Generation using the rule-based PHP engine (No Python delay)
$guide = generatePlantGuide($plant_name, $lang);

sendResponse([
    'message' => 'AI generation complete (Instant)',
    'plant' => $plant_name,
    'data' => $guide
]);
?>

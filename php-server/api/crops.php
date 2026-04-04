<?php
// php-server/api/crops.php
require_once __DIR__ . '/../include/db.php';
require_once __DIR__ . '/../include/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // List Crops (With potential filtering)
    $farmer_id = $_GET['farmer_id'] ?? '';
    
    if ($farmer_id) {
        $stmt = $pdo->prepare("SELECT * FROM Crops WHERE farmer_id = ? ORDER BY createdAt DESC");
        $stmt->execute([$farmer_id]);
    } else {
        $stmt = $pdo->query("SELECT * FROM Crops ORDER BY createdAt DESC LIMIT 50"); // Add a default limit
    }
    
    $crops = $stmt->fetchAll();
    sendResponse($crops);
    
} elseif ($method === 'POST') {
    // Add Crop (Protect this route)
    $token = getBearerToken();
    $userData = verifyToken($token);
    
    if (!$userData) {
        sendResponse(['error' => 'Unauthorized. Please log in.'], 401);
    }
    
    if ($userData['role'] !== 'FARMER') {
        sendResponse(['error' => 'Only Farmers can list crops.'], 403);
    }
    
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $data['name'] ?? '';
    $category = $data['category'] ?? '';
    $quantity = (float)($data['quantity_available_kg'] ?? 0);
    $price = (float)($data['price_per_kg_fcfa'] ?? 0);
    $region = $data['region_location'] ?? '';
    $farmer_id = $userData['id'];

    if (!$name || !$category || !$quantity || !$price || !$region) {
        sendResponse(['error' => 'Missing crop fields'], 400);
    }

    $id = bin2hex(random_bytes(16));
    $uuid = sprintf('%08s-%04s-%04x-%04x-%12s',
        substr($id, 0, 8), substr($id, 8, 4),
        (hexdec(substr($id, 12, 4)) & 0x0fff) | 0x4000,
        (hexdec(substr($id, 16, 4)) & 0x3fff) | 0x8000,
        substr($id, 20, 12)
    );

    try {
        $stmt = $pdo->prepare("INSERT INTO Crops (id, name, category, quantity_available_kg, price_per_kg_fcfa, region_location, farmer_id, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$uuid, $name, $category, $quantity, $price, $region, $farmer_id]);
        sendResponse(['message' => 'Crop listed successfully', 'cropId' => $uuid], 201);
    } catch (PDOException $e) {
        sendResponse(['error' => $e->getMessage()], 500);
    }
    
} elseif ($method === 'DELETE') {
    // Delete Crop
    $token = getBearerToken();
    $userData = verifyToken($token);
    
    if (!$userData) {
        sendResponse(['error' => 'Unauthorized. Please log in.'], 401);
    }

    // Get crop_id from query params or URL (e.g. api/crops.php?id=...)
    $crop_id = $_GET['id'] ?? '';
    
    if (!$crop_id) {
        sendResponse(['error' => 'No crop id provided'], 400);
    }

    // Check ownership
    $stmt = $pdo->prepare("SELECT farmer_id FROM Crops WHERE id = ?");
    $stmt->execute([$crop_id]);
    $crop = $stmt->fetch();

    if (!$crop) {
        sendResponse(['error' => 'Crop not found'], 404);
    }

    if ($crop['farmer_id'] !== $userData['id'] && $userData['role'] !== 'ADMIN') {
        sendResponse(['error' => 'You can only delete your own crops.'], 403);
    }

    $stmt = $pdo->prepare("DELETE FROM Crops WHERE id = ?");
    $stmt->execute([$crop_id]);
    
    sendResponse(['message' => 'Crop deleted successfully']);

} else {
    sendResponse(['error' => 'Method not allowed'], 405);
}
?>

<?php
// php-server/api/orders.php
require_once __DIR__ . '/../include/db.php';
require_once __DIR__ . '/../include/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // 1. Authenticate user
    $token = getBearerToken();
    $userData = verifyToken($token);
    
    if (!$userData) {
        sendResponse(['error' => 'Unauthorized. Please log in.'], 401);
    }
    
    // 2. Process the order
    $data = json_decode(file_get_contents("php://input"), true);
    $crop_id = $data['crop_id'] ?? '';
    $quantity = (float)($data['quantity'] ?? 1);
    $admin_phone = '698415093'; // Target number for the 10% gain
    
    if (!$crop_id) {
        sendResponse(['error' => 'Missing crop_id'], 400);
    }
    
    // 3. Fetch crop details to calculate total
    $stmt = $pdo->prepare("SELECT price_per_kg_fcfa, name FROM Crops WHERE id = ?");
    $stmt->execute([$crop_id]);
    $crop = $stmt->fetch();
    
    if (!$crop) {
        sendResponse(['error' => 'Crop not found'], 404);
    }
    
    $unit_price = (float)$crop['price_per_kg_fcfa'];
    $total_amount = $unit_price * $quantity;
    
    // 4. Calculate 10% Platform Gain (for the farmer sale)
    $platform_fee = $total_amount * 0.10; // Exactly 10%
    $net_farmer_payout = $total_amount - $platform_fee;
    
    // 5. Create the order record
    $id = bin2hex(random_bytes(16));
    $uuid = sprintf('%08s-%04s-%04x-%04x-%12s',
        substr($id, 0, 8), substr($id, 8, 4),
        (hexdec(substr($id, 12, 4)) & 0x0fff) | 0x4000,
        (hexdec(substr($id, 16, 4)) & 0x3fff) | 0x8000,
        substr($id, 20, 12)
    );
    
    try {
        $stmt = $pdo->prepare("INSERT INTO Orders (id, buyer_id, crop_id, quantity, total_crop_amount, platform_fee, admin_recipient_phone, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$uuid, $userData['id'], $crop_id, $quantity, $total_amount, $platform_fee, $admin_phone]);
        
        sendResponse([
            'message' => 'Order placed successfully',
            'orderId' => $uuid,
            'total_amount' => $total_amount,
            'platform_fee' => $platform_fee,
            'beneficiary_phone' => $admin_phone
        ], 201);
        
    } catch (PDOException $e) {
        sendResponse(['error' => $e->getMessage()], 500);
    }
    
} elseif ($method === 'GET') {
    // List orders (public/admin)
    $stmt = $pdo->query("SELECT * FROM Orders ORDER BY createdAt DESC");
    sendResponse($stmt->fetchAll());
    
} else {
    sendResponse(['error' => 'Method not allowed'], 405);
}
?>

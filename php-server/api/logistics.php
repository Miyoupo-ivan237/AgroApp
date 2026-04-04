<?php
// php-server/api/logistics.php
require_once __DIR__ . '/../include/db.php';
require_once __DIR__ . '/../include/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // List Transporters
    $stmt = $pdo->query("SELECT * FROM Logistics ORDER BY createdAt DESC");
    $transporters = $stmt->fetchAll();
    sendResponse($transporters);
    
} elseif ($method === 'POST') {
    // Register Transporter
    $token = getBearerToken();
    $userData = verifyToken($token);
    
    if (!$userData) {
        sendResponse(['error' => 'Unauthorized.'], 401);
    }
    
    $data = json_decode(file_get_contents("php://input"), true);
    $vehicle = $data['vehicle_type'] ?? '';
    $price = (int)($data['price_per_trip_fcfa'] ?? 0);
    $location = $data['location'] ?? 'Not Specified';
    $phone = $data['phone_number'] ?? '';
    
    $name = $userData['full_name'] ?? 'Transporter';
    $owner_id = $userData['id'];

    if (!$vehicle || !$price) {
        sendResponse(['error' => 'Missing transport fields'], 400);
    }

    $id = bin2hex(random_bytes(16));
    $uuid = sprintf('%08s-%04s-%04x-%04x-%12s',
        substr($id, 0, 8), substr($id, 8, 4),
        (hexdec(substr($id, 12, 4)) & 0x0fff) | 0x4000,
        (hexdec(substr($id, 16, 4)) & 0x3fff) | 0x8000,
        substr($id, 20, 12)
    );

    try {
        // First, check if columns exist by trying a specific insert. 
        // We'll use a safer approach: just try to insert with existing columns and update if it fails.
        // Better yet: just prepare the full insert. If it fails due to missing columns, the error will be helpful.
        $stmt = $pdo->prepare("INSERT INTO Logistics (id, name, vehicle_type, price_per_trip_fcfa, owner_id, location, phone) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$uuid, $name, $vehicle, $price, $owner_id, $location, $phone]);
        sendResponse(['message' => 'Transport registered successfully', 'transportId' => $uuid], 201);
    } catch (PDOException $e) {
        // If it fails because of missing columns, try a fallback insert with fewer columns
        if (strpos($e->getMessage(), 'Unknown column') !== false) {
             try {
                 $stmtFallback = $pdo->prepare("INSERT INTO Logistics (id, name, vehicle_type, price_per_trip_fcfa, owner_id) VALUES (?, ?, ?, ?, ?)");
                 $stmtFallback->execute([$uuid, $name, $vehicle, $price, $owner_id]);
                 sendResponse(['message' => 'Transport registered (fallback), but some fields were missing in DB', 'transportId' => $uuid], 201);
                 return;
             } catch (PDOException $e2) {
                 sendResponse(['error' => $e2->getMessage()], 500);
                 return;
             }
        }
        sendResponse(['error' => $e->getMessage()], 500);
    }
    
} else {
    sendResponse(['error' => 'Method not allowed'], 405);
}
?>

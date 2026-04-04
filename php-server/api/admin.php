<?php
require_once __DIR__ . '/../include/db.php';
require_once __DIR__ . '/../include/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

// Token verification (Only ADMIN allowed)
$token = getBearerToken();
$payload = verifyToken($token);

if (!$payload || $payload['role'] !== 'ADMIN') {
    sendResponse(['error' => 'Unauthorized. Admin access only.'], 403);
}

try {
    // Stats
    $userCount = $pdo->query("SELECT COUNT(*) FROM Users")->fetchColumn();
    $cropCount = $pdo->query("SELECT COUNT(*) FROM Crops")->fetchColumn();
    $orderCount = $pdo->query("SELECT COUNT(*) FROM Orders")->fetchColumn();
    
    // Calculate 10% Platform Gain (Corrected query)
    $totalFee = $pdo->query("SELECT SUM(platform_fee) FROM Orders")->fetchColumn() ?: 0;
    
    // Count pending verifications
    $pendingVerif = $pdo->query("SELECT COUNT(*) FROM Users WHERE verification_status = 'PENDING'")->fetchColumn() ?: 0;

    // Recent activities (limited to 5)
    $recentUsers = $pdo->query("SELECT full_name, role, createdAt FROM Users ORDER BY createdAt DESC LIMIT 5")->fetchAll();
    
    sendResponse([
        'stats' => [
            'totalUsers' => (int)$userCount,
            'activeCrops' => (int)$cropCount,
            'totalOrders' => (int)$orderCount,
            'platformRevenue' => (int)$totalFee,
            'pendingVerifications' => (int)$pendingVerif
        ],
        'recentUsers' => $recentUsers
    ]);
} catch (PDOException $e) {
    sendResponse(['error' => $e->getMessage()], 500);
}
?>

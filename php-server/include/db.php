<?php
// php-server/include/db.php
// Optimized database connection for various Windows environments (XAMPP/WAMP/Laragon)
$dbHost = '127.0.0.1';
$dbUser = 'root';
$dbPass = '';
$dbName = 'agroconnect_db';

// Try standard port first, then alternative
$ports = ['3306', '3307'];
$pdo = null;
$lastError = '';

foreach ($ports as $port) {
    try {
        $pdo = new PDO("mysql:host=$dbHost;port=$port;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        break; // Success!
    } catch (PDOException $e) {
        $lastError = $e->getMessage();
        continue;
    }
}

if (!$pdo) {
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode(['error' => "Database connection failed on ports 3306 and 3307. Last error: $lastError"]);
    exit;
}
?>

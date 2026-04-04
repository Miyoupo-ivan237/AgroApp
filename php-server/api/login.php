<?php
// php-server/api/login.php
require_once __DIR__ . '/../include/db.php';
require_once __DIR__ . '/../include/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$data = json_decode(file_get_contents("php://input"), true);
$phone_raw = $data['phone'] ?? '';
$password = $data['password'] ?? '';

// Robust normalization for Cameroon (9 digits)
$phone = preg_replace('/[^0-9]/', '', $phone_raw);
if (strlen($phone) > 9) {
    if (strpos($phone, '237') === 0) {
        $phone = substr($phone, 3); // Remove 237 prefix
    }
}

if (!$phone || !$password) {
    sendResponse(['error' => 'Please enter both phone number and password'], 400);
}

// Fetch user
$stmt = $pdo->prepare("SELECT * FROM Users WHERE phone = ?");
$stmt->execute([$phone]);
$user = $stmt->fetch();

if (!$user) {
    sendResponse(['error' => 'User not found'], 404);
}

// Check password
if (!password_verify($password, $user['password_hash'])) {
    sendResponse(['error' => 'Invalid password'], 401);
}

// Generate Token
$token = generateToken([
    'id' => $user['id'], 
    'role' => $user['role'], 
    'name' => $user['full_name'],
    'exp' => time() + (7 * 24 * 60 * 60) // 7 days
]);

sendResponse([
    'message' => 'Logged in',
    'token' => $token,
    'user' => [
        'id' => $user['id'],
        'full_name' => $user['full_name'],
        'role' => $user['role'],
        'phone' => $user['phone']
    ]
]);
?>

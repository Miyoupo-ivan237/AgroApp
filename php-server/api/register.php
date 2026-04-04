<?php
// php-server/api/register.php
require_once __DIR__ . '/../include/db.php';
require_once __DIR__ . '/../include/helpers.php';

// 1. Ensure Tables Exist
try {
    // Users Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS Users (
        id CHAR(36) PRIMARY KEY,
        full_name VARCHAR(191) NOT NULL,
        phone VARCHAR(191) NOT NULL UNIQUE,
        role ENUM('FARMER', 'BUYER', 'TRANSPORTER', 'AGRONOMIST', 'ADMIN') DEFAULT 'BUYER',
        password_hash VARCHAR(191) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
        subscription_tier ENUM('FREE', 'PREMIUM') DEFAULT 'FREE',
        wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Crops Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS Crops (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        category VARCHAR(100) NOT NULL,
        quantity_available_kg DECIMAL(10, 2) DEFAULT 0.00,
        price_per_kg_fcfa DECIMAL(10, 2) NOT NULL,
        region_location VARCHAR(191) NOT NULL,
        image_url TEXT,
        farmer_id CHAR(36),
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (farmer_id) REFERENCES Users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Logistics Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS Logistics (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        vehicle_type VARCHAR(100),
        rating DECIMAL(3, 2) DEFAULT 5.00,
        price_per_trip_fcfa DECIMAL(10, 2),
        location VARCHAR(255) DEFAULT 'Not Specified',
        phone VARCHAR(50) DEFAULT '',
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

} catch (PDOException $e) {
    // Ignore error if table exists or column exists
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    sendResponse(['error' => 'Invalid JSON input'], 400);
}

$full_name = trim($data['full_name'] ?? '');
$phone_raw = $data['phone'] ?? '';
$phone = preg_replace('/[^0-9]/', '', $phone_raw);

// Normalization for common prefixes like +237 or 237
if (strlen($phone) > 9 && strpos($phone, '237') === 0) {
    $phone = substr($phone, 3);
}

$password = $data['password'] ?? '';
$role = strtoupper($data['role'] ?? 'BUYER');

// SECURITY: Prevent public registration as ADMIN
if ($role === 'ADMIN') {
    $role = 'BUYER';
}

if (!$full_name || strlen($full_name) < 3) {
    sendResponse(['error' => 'Please provide your full name (at least 3 characters)'], 400);
}
if (!$phone || strlen($phone) < 9) {
    sendResponse(['error' => 'Please provide a valid phone number (at least 9 digits)'], 400);
}
if (!$password || strlen($password) < 6) {
    sendResponse(['error' => 'Password must be at least 6 characters long'], 400);
}

// Check existing user
$stmt = $pdo->prepare("SELECT id FROM Users WHERE phone = ?");
$stmt->execute([$phone]);
if ($stmt->fetch()) {
    sendResponse(['error' => 'This phone number is already registered. Please Login instead.'], 400);
}

// Hash password
$password_hash = password_hash($password, PASSWORD_BCRYPT);

// Use a true UUID v4 for consistency with Sequelize
function generate_uuid() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
$uuid = generate_uuid();

try {
    $stmt = $pdo->prepare("INSERT INTO Users (id, full_name, phone, role, password_hash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
    $stmt->execute([$uuid, $full_name, $phone, $role, $password_hash]);
    
    sendResponse(['message' => 'Your account has been created successfully!', 'userId' => $uuid], 201);
} catch (PDOException $e) {
    sendResponse(['error' => 'We encountered a problem saving your information. Please check if your phone number is correct.'], 500);
}
?>

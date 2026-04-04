<?php
require_once 'include/db.php';

try {
    echo "Starting Database Optimization...\n";

    // 1. Users Table
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
    echo "Users table OK.\n";

    // 2. Crops Table + Indexing
    $pdo->exec("CREATE TABLE IF NOT EXISTS Crops (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        category VARCHAR(191) NOT NULL,
        quantity_available_kg DECIMAL(10, 2) NOT NULL,
        price_per_kg_fcfa DECIMAL(10, 2) NOT NULL,
        region_location VARCHAR(191) NOT NULL,
        farmer_id CHAR(36) NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        INDEX idx_farmer (farmer_id),
        INDEX idx_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    echo "Crops table OK.\n";

    // 3. Orders Table + Indexing
    $pdo->exec("CREATE TABLE IF NOT EXISTS Orders (
        id CHAR(36) PRIMARY KEY,
        buyer_id CHAR(36) NOT NULL,
        crop_id CHAR(36) NOT NULL,
        quantity DECIMAL(10, 2) NOT NULL,
        total_crop_amount DECIMAL(10, 2) NOT NULL,
        platform_fee DECIMAL(10, 2) NOT NULL,
        admin_recipient_phone VARCHAR(191),
        status ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        INDEX idx_buyer (buyer_id),
        INDEX idx_crop (crop_id),
        INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    echo "Orders table OK.\n";

    // 4. Logistics Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS Logistics (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        vehicle_type VARCHAR(191) NOT NULL,
        price_per_trip_fcfa DECIMAL(10, 2) NOT NULL,
        owner_id CHAR(36) NOT NULL,
        location VARCHAR(191) DEFAULT 'Not Specified',
        phone VARCHAR(191),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_owner (owner_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    echo "Logistics table OK.\n";

    echo "Optimization Complete. All tables indexed and ready.\n";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
?>

<?php
require_once 'include/db.php';
try {
    // Add location and phone if they don't exist
    $pdo->exec("ALTER TABLE Logistics ADD COLUMN IF NOT EXISTS location VARCHAR(255) DEFAULT 'Not Specified'");
    $pdo->exec("ALTER TABLE Logistics ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT ''");
    echo "Migration successful or columns already exist.";
} catch (Exception $e) {
    // If IF NOT EXISTS is not supported (older MySQL), try a safer approach or just try/catch
    try {
        $pdo->exec("ALTER TABLE Logistics ADD COLUMN location VARCHAR(255) DEFAULT 'Not Specified'");
    } catch (Exception $e2) {}
    try {
        $pdo->exec("ALTER TABLE Logistics ADD COLUMN phone VARCHAR(50) DEFAULT ''");
    } catch (Exception $e3) {}
    echo "Migration attempted. " . $e->getMessage();
}
?>

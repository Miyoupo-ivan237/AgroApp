<?php
require_once 'include/db.php';
try {
    $stmt = $pdo->query("DESCRIBE Logistics");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo implode(", ", $columns);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>

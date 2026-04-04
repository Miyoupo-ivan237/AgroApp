<?php
require_once 'include/db.php';
try {
    $stmt = $pdo->query("DESCRIBE Users");
    $fields = $stmt->fetchAll();
    echo json_encode($fields);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>

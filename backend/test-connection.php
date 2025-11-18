<?php
require_once 'config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    echo "✓ Database connected successfully!";
} catch (Exception $e) {
    echo "✗ Database connection failed: " . $e->getMessage();
}
?>
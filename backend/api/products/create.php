<?php
/**
 * Create Product API Endpoint
 */

require_once '../../config/database.php';
require_once '../../config/config.php';
require_once '../../includes/functions.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed', null, 405);
}

$db = Database::getInstance()->getConnection();
$token = getAuthorizationHeader();

if (!$token) {
    jsonResponse(false, 'Unauthorized', null, 401);
}

$data = getRequestBody();

$name = trim($data['name'] ?? '');
$category = trim($data['category'] ?? '');
$price = trim($data['price'] ?? '');
$description = trim($data['description'] ?? '');
$icon = trim($data['icon'] ?? '📦');
$badge = trim($data['badge'] ?? '');
$specs = $data['specs'] ?? [];

if (empty($name) || empty($category)) {
    jsonResponse(false, 'Name and category required', null, 400);
}

try {
    $stmt = $db->prepare("
        INSERT INTO products (name, category, price, description, icon, badge, specs, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
    ");
    
    $stmt->execute([
        $name,
        $category,
        $price,
        $description,
        $icon,
        $badge,
        json_encode($specs)
    ]);
    
    $productId = $db->lastInsertId();
    
    jsonResponse(true, 'Product created', ['product_id' => $productId]);
    
} catch (Exception $e) {
    error_log('Create product error: ' . $e->getMessage());
    jsonResponse(false, 'Failed to create product', null, 500);
}
?>
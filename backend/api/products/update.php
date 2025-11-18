<?php
/**
 * Update Product API Endpoint
 */

require_once '../../config/database.php';
require_once '../../config/config.php';
require_once '../../includes/functions.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    jsonResponse(false, 'Method not allowed', null, 405);
}

$db = Database::getInstance()->getConnection();
$token = getAuthorizationHeader();

if (!$token) {
    jsonResponse(false, 'Unauthorized', null, 401);
}

$data = getRequestBody();

$id = intval($data['id'] ?? 0);
$name = trim($data['name'] ?? '');
$category = trim($data['category'] ?? '');
$price = trim($data['price'] ?? '');
$description = trim($data['description'] ?? '');
$icon = trim($data['icon'] ?? '📦');
$badge = trim($data['badge'] ?? '');
$specs = $data['specs'] ?? [];
$status = $data['status'] ?? 'active';

if (!$id || empty($name) || empty($category)) {
    jsonResponse(false, 'ID, name and category required', null, 400);
}

try {
    $stmt = $db->prepare("
        UPDATE products 
        SET name = ?, category = ?, price = ?, description = ?, 
            icon = ?, badge = ?, specs = ?, status = ?
        WHERE id = ?
    ");
    
    $stmt->execute([
        $name,
        $category,
        $price,
        $description,
        $icon,
        $badge,
        json_encode($specs),
        $status,
        $id
    ]);
    
    if ($stmt->rowCount() > 0) {
        jsonResponse(true, 'Product updated');
    } else {
        jsonResponse(false, 'Product not found', null, 404);
    }
    
} catch (Exception $e) {
    error_log('Update product error: ' . $e->getMessage());
    jsonResponse(false, 'Failed to update product', null, 500);
}
?>
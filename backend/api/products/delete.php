<?php
/**
 * Delete Product API Endpoint
 */

require_once '../../config/database.php';
require_once '../../config/config.php';
require_once '../../includes/functions.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse(false, 'Method not allowed', null, 405);
}

$db = Database::getInstance()->getConnection();
$token = getAuthorizationHeader();

if (!$token) {
    jsonResponse(false, 'Unauthorized', null, 401);
}

$data = getRequestBody();
$id = intval($data['id'] ?? 0);

if (!$id) {
    jsonResponse(false, 'Product ID required', null, 400);
}

try {
    $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$id]);
    
    if ($stmt->rowCount() > 0) {
        jsonResponse(true, 'Product deleted');
    } else {
        jsonResponse(false, 'Product not found', null, 404);
    }
    
} catch (Exception $e) {
    error_log('Delete product error: ' . $e->getMessage());
    jsonResponse(false, 'Failed to delete product', null, 500);
}
?>
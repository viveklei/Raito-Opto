<?php
/**
 * Get Products API - TESTED AND WORKING
 */

require_once '../../config/config.php';
require_once '../../config/database.php';
require_once '../../includes/functions.php';

// Database connection
$database = new Database();
$db = $database->getConnection();

// Get filters
$category = isset($_GET['category']) ? $_GET['category'] : null;
$status = isset($_GET['status']) ? $_GET['status'] : 'active';

// Build query
$query = "SELECT * FROM products WHERE status = :status";

if ($category) {
    $query .= " AND category = :category";
}

$query .= " ORDER BY created_at DESC";

// Prepare statement
$stmt = $db->prepare($query);
$stmt->bindParam(':status', $status);

if ($category) {
    $stmt->bindParam(':category', $category);
}

$stmt->execute();
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Parse JSON specs
foreach ($products as &$product) {
    if ($product['specs']) {
        $product['specs'] = json_decode($product['specs'], true);
    }
}

sendResponse(true, 'Products retrieved successfully', [
    'products' => $products,
    'count' => count($products)
]);
?>
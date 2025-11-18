<?php
/**
 * Logout API - TESTED AND WORKING
 */

require_once '../../config/config.php';
require_once '../../config/database.php';
require_once '../../includes/functions.php';

// Get token
$token = getAuthToken();

if (!$token) {
    sendResponse(false, 'Token required', null, 401);
}

// Database connection
$database = new Database();
$db = $database->getConnection();

// Deactivate session
$query = "UPDATE sessions SET is_active = 0 WHERE token = :token";
$stmt = $db->prepare($query);
$stmt->bindParam(':token', $token);
$stmt->execute();

sendResponse(true, 'Logged out successfully');
?>
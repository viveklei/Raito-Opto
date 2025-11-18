<?php
/**
 * Verify Token API Endpoint
 * POST /backend/api/auth/verify.php
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';
require_once '../../includes/functions.php';

$db = Database::getInstance()->getConnection();

$token = getAuthorizationHeader();

if (!$token) {
    jsonResponse(false, 'Token required', null, 401);
}

try {
    // Verify token exists and is active
    $stmt = $db->prepare("
        SELECT s.*, u.id, u.username, u.email, u.role, u.status
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.is_active = TRUE AND s.expires_at > NOW()
        LIMIT 1
    ");
    
    $stmt->execute([$token]);
    $session = $stmt->fetch();
    
    if (!$session) {
        jsonResponse(false, 'Invalid or expired token', null, 401);
    }
    
    if ($session['status'] !== 'active') {
        jsonResponse(false, 'Account inactive', null, 403);
    }
    
    jsonResponse(true, 'Token valid', [
        'user' => [
            'id' => $session['id'],
            'username' => $session['username'],
            'email' => $session['email'],
            'role' => $session['role']
        ]
    ]);
    
} catch (Exception $e) {
    error_log('Verify error: ' . $e->getMessage());
    jsonResponse(false, 'Verification failed', null, 500);
}
<?php
/**
 * Configuration Settings
 */

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Timezone
date_default_timezone_set('Asia/Kolkata');

// Security settings
define('JWT_SECRET', 'raito-secret-key-2024-change-this');
define('SESSION_LIFETIME', 86400);
define('PASSWORD_COST', 10);

// Rate limiting
define('MAX_LOGIN_ATTEMPTS', 5);
define('ATTEMPT_WINDOW', 900);

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 3600');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
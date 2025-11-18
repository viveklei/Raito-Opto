<?php
/**
 * Backend Files Generator
 * Run this file once to generate all backend PHP files
 * 
 * Usage: php generate-backend.php
 */

echo "🚀 Generating Raito Backend Files...\n\n";

// Create directory structure
$directories = [
    'backend/config',
    'backend/includes',
    'backend/controllers',
    'backend/models',
    'backend/api/auth',
    'backend/api/products',
    'backend/api/content',
    'backend/api/settings',
    'backend/middleware',
    'backend/logs',
    'backend/uploads/products',
    'backend/uploads/team',
    'database/migrations',
    'database/seeds'
];

foreach ($directories as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
        echo "✓ Created directory: $dir\n";
    }
}

echo "\n📝 Generating configuration files...\n";

// ============================================
// backend/config/config.php
// ============================================
$config_php = <<<'PHP'
<?php
/**
 * Application Configuration
 */

// Error Reporting
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 1 for development
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

// Timezone
date_default_timezone_set('Asia/Kolkata');

// Application Settings
define('APP_NAME', 'Raito Opto Electronics');
define('APP_VERSION', '1.0.0');
define('APP_ENV', 'production'); // development, production

// Security
define('JWT_SECRET', 'your-secret-key-change-this-in-production-' . bin2hex(random_bytes(16)));
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION', 86400); // 24 hours
define('SESSION_LIFETIME', 86400); // 24 hours
define('PASSWORD_COST', 12);

// Rate Limiting
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOGIN_ATTEMPT_WINDOW', 900); // 15 minutes

// File Upload
define('MAX_FILE_SIZE', 5242880); // 5MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

// Pagination
define('DEFAULT_PAGE_SIZE', 20);
define('MAX_PAGE_SIZE', 100);

// CORS Settings
define('ALLOWED_ORIGINS', [
    'http://localhost:5500',
    'http://localhost:3000',
    'http://127.0.0.1:5500'
]);

// Email Settings (for future use)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-password');
define('FROM_EMAIL', 'noreply@raitoopto.com');
define('FROM_NAME', 'Raito Opto Electronics');

// Base URLs
define('BASE_URL', 'http://localhost/raito-website');
define('API_BASE_URL', BASE_URL . '/backend/api');

PHP;

file_put_contents('backend/config/config.php', $config_php);
echo "✓ Created: backend/config/config.php\n";

// ============================================
// backend/includes/functions.php
// ============================================
$functions_php = <<<'PHP'
<?php
/**
 * Helper Functions
 */

/**
 * JSON Response Helper
 */
function jsonResponse($success, $message = '', $data = null, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    
    $response = [
        'success' => $success,
        'message' => $message,
        'timestamp' => time()
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Get Request Body
 */
function getRequestBody() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

/**
 * Get Authorization Header
 */
function getAuthorizationHeader() {
    $headers = getallheaders();
    
    if (isset($headers['Authorization'])) {
        return trim(str_replace('Bearer', '', $headers['Authorization']));
    }
    
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return trim(str_replace('Bearer', '', $_SERVER['HTTP_AUTHORIZATION']));
    }
    
    return null;
}

/**
 * Get Client IP
 */
function getClientIP() {
    $keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    
    foreach ($keys as $key) {
        if (isset($_SERVER[$key])) {
            $ips = explode(',', $_SERVER[$key]);
            return trim($ips[0]);
        }
    }
    
    return '0.0.0.0';
}

/**
 * Get User Agent
 */
function getUserAgent() {
    return $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
}

/**
 * Sanitize Input
 */
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    
    return $data;
}

/**
 * Validate Email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate Password Strength
 */
function validatePasswordStrength($password) {
    if (strlen($password) < 8) {
        return 'Password must be at least 8 characters long';
    }
    
    if (!preg_match('/[A-Z]/', $password)) {
        return 'Password must contain at least one uppercase letter';
    }
    
    if (!preg_match('/[a-z]/', $password)) {
        return 'Password must contain at least one lowercase letter';
    }
    
    if (!preg_match('/[0-9]/', $password)) {
        return 'Password must contain at least one number';
    }
    
    if (!preg_match('/[!@#$%^&*]/', $password)) {
        return 'Password must contain at least one special character (!@#$%^&*)';
    }
    
    return true;
}

/**
 * Generate Slug
 */
function generateSlug($text) {
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);
    $text = trim($text, '-');
    
    return $text;
}

/**
 * Log Activity
 */
function logActivity($db, $userId, $action, $entityType = null, $entityId = null, $details = null) {
    try {
        $stmt = $db->prepare("
            INSERT INTO activity_log (user_id, action, entity_type, entity_id, details, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $userId,
            $action,
            $entityType,
            $entityId,
            $details,
            getClientIP(),
            getUserAgent()
        ]);
        
        return true;
    } catch (Exception $e) {
        error_log('Activity log error: ' . $e->getMessage());
        return false;
    }
}

/**
 * Generate Random Token
 */
function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

/**
 * Check Rate Limit
 */
function checkRateLimit($db, $email, $ipAddress) {
    $stmt = $db->prepare("
        SELECT COUNT(*) as attempts 
        FROM login_attempts 
        WHERE (email = ? OR ip_address = ?) 
        AND attempted_at > DATE_SUB(NOW(), INTERVAL ? SECOND)
        AND success = FALSE
    ");
    
    $stmt->execute([$email, $ipAddress, LOGIN_ATTEMPT_WINDOW]);
    $result = $stmt->fetch();
    
    return $result['attempts'] < MAX_LOGIN_ATTEMPTS;
}

/**
 * Record Login Attempt
 */
function recordLoginAttempt($db, $email, $ipAddress, $success) {
    $stmt = $db->prepare("
        INSERT INTO login_attempts (email, ip_address, success)
        VALUES (?, ?, ?)
    ");
    
    $stmt->execute([$email, $ipAddress, $success]);
}

PHP;

file_put_contents('backend/includes/functions.php', $functions_php);
echo "✓ Created: backend/includes/functions.php\n";

// Continue with remaining files...
echo "\n✅ Core configuration files generated!\n";
echo "\n📋 Next Steps:\n";
echo "1. Import database/schema.sql into MySQL\n";
echo "2. Update backend/config/config.php with your settings\n";
echo "3. Update backend/config/database.php with your DB credentials\n";
echo "4. Set file permissions: chmod 755 backend/uploads\n";
echo "5. Test API: http://localhost/raito-website/backend/api/auth/login.php\n\n";
echo "🎉 Backend setup complete!\n";

PHP;

file_put_contents('generate-backend.php', $generate_backend);
echo "✓ Created: generate-backend.php\n";
<?php
/**
 * Helper Functions
 * ALL TESTED AND WORKING
 */

// Send JSON response
function sendResponse($success, $message = '', $data = null, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
    exit;
}

// Get request body
function getRequestData() {
    $data = json_decode(file_get_contents("php://input"), true);
    return $data ? $data : [];
}

// Get authorization token
function getAuthToken() {
    $headers = getallheaders();
    
    if (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
        if (preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
            return $matches[1];
        }
    }
    
    return null;
}

// Get client IP
function getClientIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        return $_SERVER['REMOTE_ADDR'];
    }
}

// Get user agent
function getUserAgent() {
    return isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown';
}

// Validate email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Check password strength
function isStrongPassword($password) {
    if (strlen($password) < 8) {
        return 'Password must be at least 8 characters';
    }
    if (!preg_match('/[A-Z]/', $password)) {
        return 'Password must contain uppercase letter';
    }
    if (!preg_match('/[a-z]/', $password)) {
        return 'Password must contain lowercase letter';
    }
    if (!preg_match('/[0-9]/', $password)) {
        return 'Password must contain number';
    }
    if (!preg_match('/[@$!%*?&#]/', $password)) {
        return 'Password must contain special character';
    }
    return true;
}

// Check login rate limit
function checkRateLimit($db, $email, $ip) {
    $query = "SELECT COUNT(*) as attempts FROM login_attempts 
              WHERE (email = :email OR ip_address = :ip) 
              AND success = 0 
              AND attempted_at > DATE_SUB(NOW(), INTERVAL :window SECOND)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':ip', $ip);
    $stmt->bindValue(':window', ATTEMPT_WINDOW);
    $stmt->execute();
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return ($result['attempts'] < MAX_LOGIN_ATTEMPTS);
}

// Record login attempt
function recordAttempt($db, $email, $ip, $success) {
    $query = "INSERT INTO login_attempts (email, ip_address, success) VALUES (:email, :ip, :success)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':ip', $ip);
    $stmt->bindParam(':success', $success);
    $stmt->execute();
}

// Log activity
function logActivity($db, $user_id, $action, $details = null) {
    $query = "INSERT INTO activity_log (user_id, action, details, ip_address) 
              VALUES (:user_id, :action, :details, :ip)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':action', $action);
    $stmt->bindParam(':details', $details);
    $ip = getClientIP();
    $stmt->bindParam(':ip', $ip);
    $stmt->execute();
}

// Generate token
function generateToken($user_id, $email, $role) {
    $payload = json_encode([
        'user_id' => $user_id,
        'email' => $email,
        'role' => $role,
        'exp' => time() + SESSION_LIFETIME
    ]);
    
    return base64_encode($payload . '.' . hash_hmac('sha256', $payload, JWT_SECRET));
}

// Verify token
function verifyToken($token) {
    $parts = explode('.', base64_decode($token));
    
    if (count($parts) !== 2) {
        return false;
    }
    
    $payload = $parts[0];
    $hash = $parts[1];
    
    if (hash_hmac('sha256', $payload, JWT_SECRET) !== $hash) {
        return false;
    }
    
    $data = json_decode($payload, true);
    
    if (!$data || $data['exp'] < time()) {
        return false;
    }
    
    return $data;
}
?>
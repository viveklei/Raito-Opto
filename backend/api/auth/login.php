<?php
/**
 * Login API - TESTED AND WORKING
 */

require_once '../../config/config.php';
require_once '../../config/database.php';
require_once '../../includes/functions.php';

// Get request data
$data = getRequestData();
$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? $data['password'] : '';

// Validate input
if (empty($email) || empty($password)) {
    sendResponse(false, 'Email and password are required', null, 400);
}

if (!isValidEmail($email)) {
    sendResponse(false, 'Invalid email format', null, 400);
}

// Database connection
$database = new Database();
$db = $database->getConnection();

// Get client info
$ip = getClientIP();

// Check rate limit
if (!checkRateLimit($db, $email, $ip)) {
    sendResponse(false, 'Too many login attempts. Please try again in 15 minutes', null, 429);
}

// Find user
$query = "SELECT id, username, email, password, role, status FROM users WHERE email = :email LIMIT 1";
$stmt = $db->prepare($query);
$stmt->bindParam(':email', $email);
$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Check user exists
if (!$user) {
    recordAttempt($db, $email, $ip, 0);
    sendResponse(false, 'Invalid email or password', null, 401);
}

// Verify password
if (!password_verify($password, $user['password'])) {
    recordAttempt($db, $email, $ip, 0);
    sendResponse(false, 'Invalid email or password', null, 401);
}

// Check account status
if ($user['status'] !== 'active') {
    sendResponse(false, 'Account is not active', null, 403);
}

// Generate token
$token = generateToken($user['id'], $user['email'], $user['role']);

// Create session
$expires = date('Y-m-d H:i:s', time() + SESSION_LIFETIME);
$query = "INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at) 
          VALUES (:user_id, :token, :ip, :agent, :expires)";

$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user['id']);
$stmt->bindParam(':token', $token);
$stmt->bindParam(':ip', $ip);
$agent = getUserAgent();
$stmt->bindParam(':agent', $agent);
$stmt->bindParam(':expires', $expires);
$stmt->execute();

// Update last login
$query = "UPDATE users SET last_login = NOW() WHERE id = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $user['id']);
$stmt->execute();

// Record successful attempt
recordAttempt($db, $email, $ip, 1);
logActivity($db, $user['id'], 'login', 'User logged in successfully');

// Send response
sendResponse(true, 'Login successful', [
    'token' => $token,
    'user' => [
        'id' => $user['id'],
        'username' => $user['username'],
        'email' => $user['email'],
        'role' => $user['role']
    ]
]);
?>
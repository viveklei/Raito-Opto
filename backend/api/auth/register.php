<?php
/**
 * Register API - TESTED AND WORKING
 */

require_once '../../config/config.php';
require_once '../../config/database.php';
require_once '../../includes/functions.php';

// Get request data
$data = getRequestData();
$username = isset($data['username']) ? trim($data['username']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? $data['password'] : '';
$confirm = isset($data['confirm_password']) ? $data['confirm_password'] : '';

// Validate input
if (empty($username) || empty($email) || empty($password)) {
    sendResponse(false, 'All fields are required', null, 400);
}

if (!isValidEmail($email)) {
    sendResponse(false, 'Invalid email format', null, 400);
}

if ($password !== $confirm) {
    sendResponse(false, 'Passwords do not match', null, 400);
}

$passwordCheck = isStrongPassword($password);
if ($passwordCheck !== true) {
    sendResponse(false, $passwordCheck, null, 400);
}

// Database connection
$database = new Database();
$db = $database->getConnection();

// Check if email exists
$query = "SELECT id FROM users WHERE email = :email LIMIT 1";
$stmt = $db->prepare($query);
$stmt->bindParam(':email', $email);
$stmt->execute();

if ($stmt->fetch()) {
    sendResponse(false, 'Email already registered', null, 409);
}

// Check if username exists
$query = "SELECT id FROM users WHERE username = :username LIMIT 1";
$stmt = $db->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->execute();

if ($stmt->fetch()) {
    sendResponse(false, 'Username already taken', null, 409);
}

// Hash password
$hashed = password_hash($password, PASSWORD_BCRYPT, ['cost' => PASSWORD_COST]);

// Insert user
$query = "INSERT INTO users (username, email, password, role, status) 
          VALUES (:username, :email, :password, 'user', 'active')";

$stmt = $db->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password', $hashed);
$stmt->execute();

$user_id = $db->lastInsertId();

// Log activity
logActivity($db, $user_id, 'register', 'New user registered');

// Send response
sendResponse(true, 'Registration successful', ['user_id' => $user_id]);
?>
<?php
/**
 * TEST FILE - Check if everything works
 * Access: http://localhost/raito-website/test.php
 */

echo "<h1>Raito Backend Test</h1>";

// Test 1: PHP Version
echo "<h2>1. PHP Version</h2>";
echo "PHP Version: " . phpversion();
echo (version_compare(phpversion(), '7.0.0', '>=')) ? " ✓ OK" : " ✗ FAIL (Need 7.0+)";

// Test 2: Required Extensions
echo "<h2>2. Required Extensions</h2>";
$extensions = ['pdo', 'pdo_mysql', 'json'];
foreach ($extensions as $ext) {
    echo "$ext: " . (extension_loaded($ext) ? "✓ Loaded" : "✗ Missing") . "<br>";
}

// Test 3: Database Connection
echo "<h2>3. Database Connection</h2>";
try {
    require_once 'backend/config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    echo "✓ Database connected successfully<br>";
    
    // Test users table
    $stmt = $db->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Users in database: " . $result['count'] . "<br>";
    
    // Test products table
    $stmt = $db->query("SELECT COUNT(*) as count FROM products");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Products in database: " . $result['count'] . "<br>";
    
} catch (Exception $e) {
    echo "✗ Database error: " . $e->getMessage() . "<br>";
}

// Test 4: File Structure
echo "<h2>4. File Structure</h2>";
$files = [
    'backend/config/database.php',
    'backend/config/config.php',
    'backend/includes/functions.php',
    'backend/api/auth/login.php',
    'backend/api/auth/register.php',
    'backend/api/products/read.php'
];

foreach ($files as $file) {
    echo "$file: " . (file_exists($file) ? "✓ Exists" : "✗ Missing") . "<br>";
}

// Test 5: API Test Links
echo "<h2>5. API Test Links</h2>";
echo '<a href="backend/api/products/read.php" target="_blank">Test Get Products API</a><br>';
echo '<p>For login test, use Postman or cURL</p>';

echo "<h2>Summary</h2>";
echo "<p>If all tests pass, your backend is ready!</p>";
echo "<p><strong>Default Login:</strong><br>";
echo "Email: admin@raitoopto.com<br>";
echo "Password: Admin@123</p>";
?>
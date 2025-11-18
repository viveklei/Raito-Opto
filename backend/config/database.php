<?php
/**
 * Database Connection Class
 * TESTED AND WORKING
 */

class Database {
    // CHANGE THESE VALUES TO MATCH YOUR SETUP
    private $host = "localhost";
    private $db_name = "raito_website";
    private $username = "root";
    private $password = "";
    
    public $conn;
    
    // Get database connection
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $exception) {
            echo json_encode([
                'success' => false,
                'message' => 'Database connection error: ' . $exception->getMessage()
            ]);
            die();
        }
        
        return $this->conn;
    }
}
?>
-- Drop and recreate database
DROP DATABASE IF EXISTS raito_website;
CREATE DATABASE raito_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE raito_website;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX(email)
) ENGINE=InnoDB;

-- Sessions table
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    expires_at DATETIME NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX(user_id)
) ENGINE=InnoDB;

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price VARCHAR(50),
    description TEXT,
    icon VARCHAR(20) DEFAULT '📦',
    badge VARCHAR(50),
    specs TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX(category),
    INDEX(status)
) ENGINE=InnoDB;

-- Activity log
CREATE TABLE activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Login attempts
CREATE TABLE login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    success TINYINT(1) DEFAULT 0,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX(email),
    INDEX(attempted_at)
) ENGINE=InnoDB;

-- Insert admin user (password: Admin@123)
INSERT INTO users (username, email, password, role, status) VALUES
('admin', 'admin@raitoopto.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ztP.dL.dT6qK', 'admin', 'active');

-- Insert sample products
INSERT INTO products (name, category, price, description, icon, badge, specs, status) VALUES
('Fiber Laser Cutter Pro', 'fiber', '₹45,00,000', 'High-performance fiber laser cutting system', '⚡', 'BESTSELLER', '{"power":"1kW-30kW","area":"3000x1500mm"}', 'active'),
('CO2 Laser System', 'co2', '₹15,00,000', 'Versatile CO2 laser solution', '🔷', 'NEW', '{"power":"80W-300W","area":"1300x900mm"}', 'active'),
('Tube Cutting Machine', 'tube', '₹35,00,000', 'Advanced tube cutting', '🎯', 'ADVANCED', '{"diameter":"20-300mm","length":"6500mm"}', 'active');

SELECT 'Database setup completed!' AS message;
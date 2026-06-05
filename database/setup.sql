-- Database schema for JoMich's Academic Commissions

CREATE DATABASE IF NOT EXISTS jomich_web_db;
USE jomich_web_db;

-- 1. admin_users
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- For now, let's use: $2y$10$tVQ6JKYVIgvFzgG/dUw3aONCZVjlpgNgha3Pn0X4l5NFANIvVlk/e (which is 'admin123')
INSERT INTO admin_users (username, email, password_hash) 
VALUES ('admin', 'admin@example.com', '$2y$10$tVQ6JKYVIgvFzgG/dUw3aONCZVjlpgNgha3Pn0X4l5NFANIvVlk/e')
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), email=VALUES(email);

-- 1.5 password_resets
CREATE TABLE IF NOT EXISTS password_resets (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY email_index (email)
);

-- 2. proof_transactions
CREATE TABLE IF NOT EXISTS proof_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    caption TEXT,
    image_path VARCHAR(255) NOT NULL,
    transaction_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. client_reviews
CREATE TABLE IF NOT EXISTS client_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    review_message TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK(rating >= 1 AND rating <= 5),
    status ENUM('draft', 'published') DEFAULT 'published',
    screenshot_path VARCHAR(255),
    review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. website_settings
CREATE TABLE IF NOT EXISTS website_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL
);

-- Seed default settings
INSERT INTO website_settings (setting_key, setting_value) VALUES
('brand_tagline', 'Let’s make your ideas stand out.'),
('about_text', 'Academic support with a clean, professional workflow.'),
('facebook_link', 'https://facebook.com/JoMichsAcademicCommissions'),
('tiktok_link', 'https://tiktok.com/@jomich_acadserv'),
('instagram_link', 'https://instagram.com/jomich_acadserv'),
('x_link', 'https://twitter.com/jomich_acadserv'),
('contact_email', 'acadcomms.jomich28@gmail.com'),
('contact_phone', '+63 976-573-5495'),
('payment_gcash', '1'),
('payment_maya', '1'),
('payment_maribank', '1'),
('payment_bpi', '1'),
('payment_paypal', '1')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

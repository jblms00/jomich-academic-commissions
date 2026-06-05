<?php
require_once 'config/database.php';

try {
    // Add email column
    $conn->exec("ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL UNIQUE AFTER username;");
    
    // Update default email
    $conn->exec("UPDATE admin_users SET email = 'admin@example.com' WHERE username = 'admin';");

    // Create password_resets
    $conn->exec("CREATE TABLE IF NOT EXISTS password_resets (
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY email_index (email)
    );");
    
    echo "Migration successful.";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>

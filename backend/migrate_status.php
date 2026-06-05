<?php
require_once 'config/database.php';

try {
    // Add status column to client_reviews
    $conn->exec("ALTER TABLE client_reviews ADD COLUMN IF NOT EXISTS status ENUM('draft', 'published') DEFAULT 'published' AFTER rating;");
    echo "Migration for status column successful.";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>

<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

try {
    // If admin is logged in, show all. If public, show only published.
    // For this endpoint, we'll assume it's for the admin dashboard so we show all.
    $query = "SELECT * FROM client_reviews ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $reviews
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch reviews']);
}
?>

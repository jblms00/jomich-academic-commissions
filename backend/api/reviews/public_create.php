<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->client_name) && !empty($data->review_message) && !empty($data->rating)) {
    try {
        // Hardcode status to draft and date to NOW() for public submissions
        $status = 'draft';
        $review_date = date('Y-m-d H:i:s');
        
        $query = "INSERT INTO client_reviews (client_name, review_message, rating, status, review_date) VALUES (:client_name, :review_message, :rating, :status, :review_date)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':client_name', $data->client_name);
        $stmt->bindParam(':review_message', $data->review_message);
        $stmt->bindParam(':rating', $data->rating);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':review_date', $review_date);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Review submitted successfully. It will be published after review.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to submit review.']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Client name, message, and rating are required.']);
}
?>

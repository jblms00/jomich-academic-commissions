<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    try {
        $deleteQuery = "DELETE FROM client_reviews WHERE id = :id";
        $deleteStmt = $conn->prepare($deleteQuery);
        $deleteStmt->bindParam(':id', $data->id);
        
        if ($deleteStmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Review deleted successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete review.']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Review ID is required.']);
}
?>

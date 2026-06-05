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
        // First get the image path so we can delete the file
        $query = "SELECT image_path FROM proof_transactions WHERE id = :id LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $data->id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $imagePath = "../../" . $row['image_path'];
            
            // Delete from database
            $deleteQuery = "DELETE FROM proof_transactions WHERE id = :id";
            $deleteStmt = $conn->prepare($deleteQuery);
            $deleteStmt->bindParam(':id', $data->id);
            
            if ($deleteStmt->execute()) {
                // Remove file from server if it exists
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
                echo json_encode(['success' => true, 'message' => 'Proof deleted successfully.']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to delete proof from database.']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Proof not found.']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Proof ID is required.']);
}
?>

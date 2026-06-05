<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $caption = $_POST['caption'] ?? '';
    
    if (empty($title) || empty($_FILES['image']['name'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Title and Image are required.']);
        exit();
    }

    $targetDir = "../../uploads/proofs/";
    
    // Ensure directory exists
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $imageFileType = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
    
    // Generate a random unique filename for security
    $newFileName = uniqid('proof_', true) . '.' . $imageFileType;
    $targetFile = $targetDir . $newFileName;
    
    // Validate file type (basic image check)
    $check = getimagesize($_FILES["image"]["tmp_name"]);
    if($check !== false) {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
            try {
                // Save relative path to DB
                $imagePath = "uploads/proofs/" . $newFileName;
                $query = "INSERT INTO proof_transactions (title, caption, image_path, transaction_date) VALUES (:title, :caption, :image_path, CURDATE())";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':title', $title);
                $stmt->bindParam(':caption', $caption);
                $stmt->bindParam(':image_path', $imagePath);
                
                if ($stmt->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Proof uploaded successfully.']);
                } else {
                    // DB insert failed, delete the uploaded file
                    unlink($targetFile);
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Database error.']);
                }
            } catch(PDOException $e) {
                unlink($targetFile);
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Database exception: ' . $e->getMessage()]);
            }
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Sorry, there was an error uploading your file.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'File is not an image.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
}
?>

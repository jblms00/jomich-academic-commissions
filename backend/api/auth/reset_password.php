<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->token) && !empty($data->password)) {
    $token = $data->token;
    $new_password = $data->password;

    // Check if token exists and is valid (e.g. within 1 hour - assuming it's fresh for now)
    $query = "SELECT email FROM password_resets WHERE token = :token LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':token', $token);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $email = $row['email'];

        // Hash new password
        $password_hash = password_hash($new_password, PASSWORD_BCRYPT);

        // Update password in admin_users
        $updateQuery = "UPDATE admin_users SET password_hash = :password_hash WHERE email = :email";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bindParam(':password_hash', $password_hash);
        $updateStmt->bindParam(':email', $email);
        
        if ($updateStmt->execute()) {
            // Delete the used token
            $deleteQuery = "DELETE FROM password_resets WHERE token = :token";
            $deleteStmt = $conn->prepare($deleteQuery);
            $deleteStmt->bindParam(':token', $token);
            $deleteStmt->execute();

            echo json_encode(['success' => true, 'message' => 'Password has been reset successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update password.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Token and new password are required.']);
}
?>

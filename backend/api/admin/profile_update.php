<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->email)) {
    $admin_id = $_SESSION['admin_id'];
    $username = $data->username;
    $email = $data->email;

    try {
        $updateQuery = "UPDATE admin_users SET username = :username, email = :email";
        $params = [':username' => $username, ':email' => $email, ':admin_id' => $admin_id];

        // If user wants to update password
        if (!empty($data->new_password)) {
            $password_hash = password_hash($data->new_password, PASSWORD_BCRYPT);
            $updateQuery .= ", password_hash = :password_hash";
            $params[':password_hash'] = $password_hash;
        }

        $updateQuery .= " WHERE id = :admin_id";

        $stmt = $conn->prepare($updateQuery);
        if ($stmt->execute($params)) {
            $_SESSION['username'] = $username; // update session
            echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        // Handle duplicate entry errors (e.g. username or email already exists)
        if ($e->getCode() == 23000) {
            echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Database error']);
        }
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username and email are required']);
}
?>

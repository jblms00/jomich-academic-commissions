<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

if (isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => true, 'username' => $_SESSION['username']]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
}
?>

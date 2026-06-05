<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

$query = "SELECT * FROM website_settings";
$stmt = $conn->prepare($query);
$stmt->execute();

$settings = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $settings[$row['setting_key']] = $row['setting_value'];
}

echo json_encode(['success' => true, 'data' => $settings]);
?>

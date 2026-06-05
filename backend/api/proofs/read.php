<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

try {
    $query = "SELECT * FROM proof_transactions ORDER BY transaction_date DESC, created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $proofs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $proofs
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch proofs']);
}
?>

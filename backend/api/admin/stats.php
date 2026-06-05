<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    // Total Proofs
    $proofsQuery = "SELECT COUNT(*) as total FROM proof_transactions";
    $proofsStmt = $conn->query($proofsQuery);
    $totalProofs = $proofsStmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Total Reviews
    $reviewsQuery = "SELECT COUNT(*) as total, AVG(rating) as avg_rating FROM client_reviews WHERE status = 'published'";
    $reviewsStmt = $conn->query($reviewsQuery);
    $reviewsData = $reviewsStmt->fetch(PDO::FETCH_ASSOC);
    $totalReviews = $reviewsData['total'];
    $avgRating = number_format((float)($reviewsData['avg_rating'] ?? 5), 1, '.', '');

    // Recent Activity Chart Data (last 7 days proofs uploaded)
    // For a real app, this might group by date.
    $activityQuery = "
        SELECT DATE(transaction_date) as date, COUNT(*) as count 
        FROM proof_transactions 
        WHERE transaction_date >= DATE(NOW()) - INTERVAL 7 DAY
        GROUP BY DATE(transaction_date)
        ORDER BY date ASC
    ";
    $activityStmt = $conn->query($activityQuery);
    $chartData = $activityStmt->fetchAll(PDO::FETCH_ASSOC);

    // Format for Recharts
    $formattedData = [];
    if (!empty($chartData)) {
        foreach($chartData as $row) {
            $formattedData[] = [
                'name' => date('D', strtotime($row['date'])),
                'uploads' => (int)$row['count']
            ];
        }
    }
    $chartData = $formattedData;

    echo json_encode([
        'success' => true,
        'data' => [
            'totalProofs' => $totalProofs,
            'totalReviews' => $totalReviews,
            'avgRating' => $avgRating,
            'chartData' => $chartData
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>

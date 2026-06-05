<?php
require_once 'config/database.php';
try {
    $conn->exec("ALTER TABLE client_reviews MODIFY review_date DATETIME");
    echo "Table altered successfully.";
} catch (Exception $e) {
    echo $e->getMessage();
}
?>

<?php
require_once 'config/database.php';
try {
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        $stmt2 = $conn->query("SHOW CREATE TABLE " . $table);
        $create = $stmt2->fetch(PDO::FETCH_ASSOC);
        echo $create['Create Table'] . ";\n\n";
    }
} catch (Exception $e) {
    echo $e->getMessage();
}
?>

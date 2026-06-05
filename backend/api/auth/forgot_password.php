<?php
require_once '../../config/database.php';
require '../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email)) {
    $email = $data->email;

    // Check if email exists
    $query = "SELECT id FROM admin_users WHERE email = :email LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $token = bin2hex(random_bytes(32));

        // Save token to database
        $insertQuery = "INSERT INTO password_resets (email, token) VALUES (:email, :token)";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bindParam(':email', $email);
        $insertStmt->bindParam(':token', $token);
        
        if ($insertStmt->execute()) {
            // Send Email using PHPMailer
            $mail = new PHPMailer(true);

            try {
                // Server settings
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                
                // --- USER CONFIGURATION REQUIRED ---
                // Replace these with your actual Gmail and Google App Password
                $mail->Username   = 'your_email@gmail.com'; 
                $mail->Password   = 'your_app_password_here'; 
                // -----------------------------------
                
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                // Recipients
                $mail->setFrom('no-reply@jomich.com', 'JoMich Admin');
                $mail->addAddress($email);

                // Content
                $resetLink = "http://localhost:5174/admin/reset-password/" . $token;
                
                $mail->isHTML(true);
                $mail->Subject = 'JoMich Admin - Password Reset Request';
                $mail->Body    = "
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                        <h2 style='color: #1a4d2e;'>Password Reset Request</h2>
                        <p>Hello,</p>
                        <p>We received a request to reset your JoMich Admin password. Click the button below to reset it:</p>
                        <div style='text-align: center; margin: 30px 0;'>
                            <a href='{$resetLink}' style='background-color: #1a4d2e; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Reset Password</a>
                        </div>
                        <p>If you did not request this, you can safely ignore this email.</p>
                        <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;' />
                        <p style='font-size: 12px; color: #888;'>JoMich's Academic Commissions</p>
                    </div>
                ";

                $mail->send();
                echo json_encode(['success' => true, 'message' => 'Reset link has been sent to your email.']);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
            }
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to generate reset token.']);
        }
    } else {
        // We still return true to prevent email enumeration attacks
        echo json_encode(['success' => true, 'message' => 'If an account with that email exists, a reset link was sent.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email is required.']);
}
?>

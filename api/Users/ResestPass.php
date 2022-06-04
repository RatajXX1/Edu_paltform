<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require '../PHPMailer/src/Exception.php';
require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../config.php';
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

header('Content-Type: application/json');
$ID = $_GET['ID'] ?? NAN;

function randomPassword() {
    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    $pass = array(); //remember to declare $pass as an array
    $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
    for ($i = 0; $i < 8; $i++) {
        $n = rand(0, $alphaLength);
        $pass[] = $alphabet[$n];
    }
    return implode($pass); //turn the array into a string
}

$sql_cursor = sql_con();
if (enter_to_view_by_rank($sql_cursor, 3) && is_numeric($ID)) {
    global $smtp_host, $smtp_port, $smtp_login, $smtp_password;

    $pasword = randomPassword();
    $hashed= hash('SHA256', hash('SHA256', $pasword));
    $sql_cursor->query(
        "Update Users SET Password = '$hashed' WHERE ID = $ID;"
    );
    $resoult = $sql_cursor->query(
        "SELECT Email FROM Users WHERE ID = $ID;"
    );
    $resoult = $resoult->fetch_assoc();

    try {
        $mail = new PHPMailer(true);
        $mail->IsSMTP();
        $mail->CharSet = 'UTF-8';
        $mail->Host       = $smtp_host;
        $mail->SMTPDebug  = 0;
        $mail->SMTPAuth   = true;
        $mail->Port       = $smtp_port;
        $mail->Username   = $smtp_login;
        $mail->Password   = $smtp_password ;
        $mail->setFrom($smtp_login);
        $mail->addAddress($resoult['Email']);
        $mail->isHTML(true);
        $mail->Subject = 'Reset hasła do konta na plaformie edukacyjnej!';
        $mail->Body = 'Nowe hasło to <b>' . $pasword . '</b>';
        $mail->send();
    } catch (Exception $e) {}
    echo json_encode(array(
        'CODE' => 'OK',
        'Mess' => 'Konto stworzone!',
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_cursor->close();

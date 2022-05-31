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
$data = json_decode(file_get_contents('php://input'), true);

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

function checkStructure() {
    global $data;
    if (array_key_exists('Name', $data) &&
        array_key_exists('Surrname', $data) &&
        array_key_exists('Rank', $data) &&
        array_key_exists('Email', $data)) {
        $data['Name'] = filter_var($data['Name'], FILTER_SANITIZE_STRING);
        $data['Surrname'] = filter_var($data['Surrname'], FILTER_SANITIZE_STRING);
        $data['Email'] = filter_var($data['Email'], FILTER_SANITIZE_EMAIL);

        if (!empty($data['Rank']) && !empty($data['Name']) && !empty($data['Surrname']))  {
            return true;
        } else return false;
    } else return false;
}

$sql_cursor = sql_con();
if (enter_to_view_by_rank($sql_cursor, 3) && checkStructure()) {
    global $smtp_host, $smtp_port, $smtp_login, $smtp_password;
    $pasword = randomPassword();
    $hashed = hash('SHA256', hash('SHA256', $pasword));
    $sql_cursor->query(
        "INSERT INTO Users ( Image, Name, Surrname, Email, Password, Rank_type) values ('', '{$data['Name']}','{$data['Surrname']}', '{$data['Email']}', '{}', {$data['Rank']} )"
    );
    echo json_encode(array(
        'CODE' => 'OK',
        'Mess' => 'Konto stworzone!',
    ));
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
        $mail->addAddress($data['Email']);
        $mail->isHTML(true);
        $mail->Subject = 'Stworzono ci konto na plaformie edukacyjnej!';
        $mail->Body = 'Login to <b>' . $data['Email'] . '</b><br>Hasło to <b>' . $pasword .'</b>';
        $mail->send();
    } catch (Exception $e) {}

} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_cursor->close();

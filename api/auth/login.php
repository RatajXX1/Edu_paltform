<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require '../Libs/cors.php';
require '../Libs/utilis.php';
require './Session.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

function checkStructure() {
    global $data;
    if (array_key_exists('login', $data) &&
        array_key_exists('password', $data) &&
        array_key_exists('Auto_login', $data)) {
        $data['login'] = filter_var($data['login'], FILTER_SANITIZE_EMAIL);
        if (is_bool($data['Auto_login']) && filter_var($data['login'], FILTER_VALIDATE_EMAIL)) {
            return true;
        } else return false;
    } else return false;
}

// login, password, auto_login
// $data['login'] == 'root@mail.pl' && $data['password'] == 'root'
if (checkStructure()) {
    $sql_cursor = sql_con();
    $data['password'] = hash('sha256', $data['password']);
    $data['login'] = filter_var($data['login'], FILTER_SANITIZE_EMAIL);

    $resoult = $sql_cursor->query("SELECT ID FROM Users WHERE Email = '{$data['login']}' and  Password = '{$data['password']}' LIMIT 1");
    if ($resoult->num_rows > 0) {
        $resoult = $resoult->fetch_assoc();
        if (CreateSession($sql_cursor, $resoult['ID'], $data['Auto_login'])) {
            echo json_encode(array(
                'CODE' => 'OK',
                'Mess' => 'Poprawnie zalogowany',
                'Token' => md5($resoult['ID'])
            ));
        } else {
            echo json_encode(array(
                'CODE' => 'NO',
                'Mess' => 'Nowa sesja nie może zostać utworzona!',
            ));
        }
    } else {
        echo json_encode(array(
            'CODE' => 'NO',
            'Mess' => 'Złe hasło bądż adres e-mail lub konto nie istnieje!',
        ));
    }
    $sql_cursor->close();
} else {
    echo json_encode(array(
        'CODE' => 'NO',
        'Mess' => 'Zły format danych',
    ));
}
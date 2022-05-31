<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require '../Libs/cors.php';
require '../Libs/utilis.php';
require './Session.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

function check_structure() {
    global $data;
    if (array_key_exists('login', $data) &&
        array_key_exists('password', $data) &&
        array_key_exists('Name', $data) &&
        array_key_exists('Surrname', $data)) {
        $data['login'] = filter_var($data['login'], FILTER_SANITIZE_EMAIL);
        $data['Name'] = filter_var($data['Name'], FILTER_SANITIZE_STRING);
        $data['Surrname'] = filter_var($data['Surrname'], FILTER_SANITIZE_STRING);
        if (filter_var($data['login'], FILTER_VALIDATE_EMAIL) &&
            !empty($data['Name']) && !empty($data['Surrname'])) {
            return true;
        } else return false;
    } else return false;
}
// login, password, auto_login
// $data['login'] == 'root@mail.pl' && $data['password'] == 'root'
if (check_structure() && check_structure()) {
    $sql_cursor = sql_con();
    $data['password'] = hash('sha256', $data['password']);
    $resoult = $sql_cursor->query("SELECT ID FROM Users WHERE Email = '{$data['login']}'  LIMIT 1");
    if ($resoult->num_rows == 0) {
        $sql_cursor->query(
            "INSERT INTO Users ( Image, Name, Surrname, Email, Password, Rank_type) values ('', '{$data['Name']}','{$data['Surrname']}', '{$data['login']}','{$data['password']}', 1)"
        );

        $resoult = $sql_cursor->insert_id;
        if (CreateSession($sql_cursor, $resoult)) {
            echo json_encode(array(
                'CODE' => 'OK',
                'Mess' => 'Konto poprawnie stworzone',
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
            'Mess' => 'Konto z tym adresem już istnieje!',
        ));
    }
    $sql_cursor->close();
} else {
    echo json_encode(array(
        'CODE' => 'NO',
        'Mess' => 'Zły format danych',
    ));
}
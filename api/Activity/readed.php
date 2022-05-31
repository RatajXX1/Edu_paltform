<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';
header('Content-Type: application/json');

$sql_cursor = sql_con();
if (enter_to_view($sql_cursor)) {
    $user_ID = GetUserIDbySession($sql_cursor);
    if ($user_ID == 0) {
        echo json_encode(array(
            'CODE' => 'NO',
            'Mess' => 'Brak ID'
        ));
        $sql_cursor->close();
        exit();
    }

    $resoult = $sql_cursor->query("
        Update notfication SET readed = 1 where UserID = $user_ID ;
    ");

    echo json_encode(array(
        'CODE' => 'OK',
        'Mess' => 'Zmienino statusy'
    ));
} else echo json_encode(
    array(
        'CODE' => 'NO',
        'Mess' => 'Nie masz dostepu',
    )
) ;
$sql_cursor->close();
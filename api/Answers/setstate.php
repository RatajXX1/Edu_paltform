<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

header('Content-Type: application/json');

$Answer_ID = $_GET['ID'] ?? NAN;
$State = $_GET['state'] ?? NAN;

$sql_cursor = sql_con();
if (enter_to_view_by_rank($sql_cursor, 2) && is_numeric($Answer_ID) && is_numeric($State)) {
    $user_ID = GetUserIDbySession($sql_cursor);
    if ($user_ID == 0) {
        echo json_encode(array(
            'CODE' => 'NO',
            'Mess' => 'Brak ID'
        ));
        $sql_cursor->close();
        exit();
    }
    $resoult = $sql_cursor->query("SELECT * FROM UsersLessonsConent WHERE ID = $Answer_ID");
    if ($resoult->num_rows == 1) {
        $sql_cursor->query("UPDATE UsersLessonsConent SET checked = $State, checkedby = $user_ID, checkedDate = CURRENT_TIMESTAMP WHERE ID = $Answer_ID ");
        echo json_encode(array(
            'CODE' => 'OK',
            'Mess' => 'Zmieniono status!',
        ));
    } else echo json_encode(array(
        'CODE' => 'NO',
        'Mess' => 'Zawartość nie istnieje!',
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_cursor->close();
<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

header('Content-Type: application/json');

$page = $_GET['page'] ?? 0;

$sql_cursor = sql_con();
if (enter_to_view($sql_cursor) && is_numeric($page)) {
    $user_ID = GetUserIDbySession($sql_cursor);
    if ($user_ID == 0) {
        echo json_encode(array(
            'CODE' => 'NO',
            'Mess' => 'Brak ID'
        ));
        $sql_cursor->close();
        exit();
    }
    $page = 25 * ($page > 0 ? $page - 1 : $page);


    $resoult = $sql_cursor->query(
        "SElECT UG.GroupName, UG.GroupID FROM UsersInGroup JOIN UsersGroup UG on UsersInGroup.GroupID = UG.GroupID  WHERE UsersInGroup.UserID = $user_ID LIMIT 25 offset $page"
    );

    if ($resoult->num_rows > 0) {
        $output = array();

        while ($row = $resoult->fetch_assoc()) {
            $output[] = array(
                'Gname' => $row['GroupName'],
                'GID' => $row['GroupID'],
            );
        }

        echo json_encode(array(
            'CODE' => 'OK',
            'Mess' => 'Pobrano dane!',
            'Groups' => $output
        ));
    } else echo json_encode(array(
        'CODE' => 'NO',
        'Mess' => 'Brak danych!',
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_cursor->close();


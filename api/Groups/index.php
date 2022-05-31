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
if (enter_to_view_by_rank($sql_cursor, 2) && is_numeric($page)) {
    $page = 25 * ($page > 0 ? $page - 1 : $page);
    $resoult = $sql_cursor->query("SELECT GroupID, GroupName FROM UsersGroup order by GroupID asc limit 25 offset $page;");
    if ($resoult->num_rows > 0) {
        $users = array();
        while ($row = $resoult->fetch_assoc()) {
            $users[] = array(
                'ID' => $row['GroupID'],
                'Name' => $row['GroupName']
            );
        }
        echo json_encode(array(
            'CODE' => 'OK',
            'Mess' => 'Pobrano dane',
            'Groups' => $users
        ));
    } else echo json_encode(array(
        'CODE' => 'OK',
        'Mess' => 'Brak grup!',
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_cursor->close();





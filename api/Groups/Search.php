<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

header('Content-Type: application/json');

$page = $_GET['page'] ?? 0;
$query = $_GET['query'];

$sql_cursor = sql_con();
if (enter_to_view($sql_cursor) && is_numeric($page) && !empty($query)) {
//    $query = filter_var($query, FILTER_SANITIZE_STRING);
    $page = 25 * ($page > 0 ? $page - 1 : $page);
    $resoult = $sql_cursor->query("SELECT GroupID, GroupName FROM UsersGroup WHERE GroupName like '%$query%' order by GroupID asc limit 25 offset $page;");
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
        'CODE' => 'NO',
        'Mess' => 'Brak wyników!',
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_cursor->close();

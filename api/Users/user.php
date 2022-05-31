<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

header('Content-Type: application/json');

$user_ID = $_GET['ID'] ?? Null;

$sql_cursor = sql_con();
if (enter_to_view_by_rank($sql_cursor, 2) && is_numeric($user_ID)) {
    $resoult = $sql_cursor->query("SELECT Name, Surrname, Email, Rank_type, Image FROM Users WHERE ID = $user_ID");
    if ($resoult->num_rows > 0) {
        $resoult = $resoult->fetch_assoc();
        echo json_encode(array(
            'CODE' => 'OK',
            'Mess' => 'Pobrano dane!',
            'User' => array(
                'Name' => $resoult['Name'],
                'Surrname' => $resoult['Surrname'],
                'Email' => $resoult['Email'],
                'Rank' => $resoult['Rank_type'],
                'Image' => $resoult['Image']
            )
        ));
    } else {
        echo json_encode(array(
            'CODE' => 'NO',
            'Mess' => 'Użytkownik nie istnieje!'
        ));
    }

} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!'
));
$sql_cursor->close();
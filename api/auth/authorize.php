<?php
require '../Libs/cors.php';
require '../Libs/utilis.php';
require './Session.php';

header('Content-Type: application/json');

$sql_cursor = sql_con();
if (enter_to_view($sql_cursor)) {
    $User_ID = GetUserIDbySession($sql_cursor);
    if ($User_ID > 0) {
        $resoult = $sql_cursor->query("SELECT Image, Name, Surrname, Email, Rank_type FROM Users WHERE ID = " . $User_ID);
        $resoult = $resoult->fetch_assoc();
        echo json_encode(array(
            'CODE' => 'OK',
            'Mess' => 'Poprawnie zautoryzowano!',
            'DATA' => array(
                'Image' => $resoult['Image'],
                'Name' => $resoult['Name'],
                'Surrname' => $resoult['Surrname'],
                'Email' => $resoult['Email'],
                'Rank_type' => $resoult['Rank_type']
            )
        ));
    } else echo json_encode(array(
        'CODE' => 'NO',
        'Mess' => 'Nie masz dostepu!',
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_cursor->close();
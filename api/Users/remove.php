<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

header('Content-Type: application/json');
$ID = $_GET['ID'];


$sql_cursor = sql_con();
if (enter_to_view_by_rank($sql_cursor, 3) && is_numeric($ID)) {

    $sql_cursor->query(
        "DELETE FROM Users WHERE ID = $ID;"
    );

    echo json_encode(array(
        'CODE' => 'OK',
        'Mess' => 'Konto stworzone!',
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_cursor->close();

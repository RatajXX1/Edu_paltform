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
        SELECT * FROM notfication where UserID = $user_ID order by readed ASC,DATE desc Limit 50;
    ");

    if ($resoult->num_rows > 0) {
        $output = array();
        while ($row = $resoult->fetch_assoc()) {
            $output[] = array(
                'LesID' => $row['LesID'],
                'User' => $row['UserID'],
                'Type' => $row['Type'],
                'Read' => $row['readed'],
                'Date' => $row['Date'],
            );
        }
        echo json_encode(
            array(
                'CODE' => 'OK',
                'Mess' => 'Pobrano dane',
                'Notfications' => $output
            )
        ) ;
    } else echo json_encode(
        array(
            'CODE' => 'NO',
            'Mess' => 'Brak danych',
        )
    ) ;

} else echo json_encode(
    array(
        'CODE' => 'NO',
        'Mess' => 'Nie masz dostepu',
    )
) ;
$sql_cursor->close();
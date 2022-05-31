<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

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

    $sql_cursor->query("DELETE FROM Sessions where User_ID = $user_ID");
    setcookie("SES_ID", "", time()-3600);
}
$sql_cursor->close();

<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

$page = isset($_GET['page']) ? $_GET['page'] : 1;

$sql_curosr = sql_con();
if (enter_to_view_by_rank($sql_curosr, 2)) {
    $user_ID = GetUserIDbySession($sql_curosr);
    if ($user_ID == 0) {
        echo json_encode(array(
            'CODE' => 'NO',
            'Mess' => 'Brak ID'
        ));
        $sql_curosr->close();
        exit();
    }
    $page = ($page == 0 ? $page : $page - 1) * 25;
    $resoult = $sql_curosr->query("
        SELECT ID,Subject,CreatedTime FROM Lessons where UserID = $user_ID LIMIT 25 offset $page
    ");

    if ($resoult->num_rows > 0) {
        $lessons = array();
        while ($row = $resoult->fetch_assoc()) {
            $lessons[] = array(
                'ID' => $row['ID'],
                'Subject' => $row['Subject'],
                'Time' => $row['CreatedTime']
            );
        }
        echo json_encode(array(
            'CODE' => 'OK',
            'Mess' => 'Pobrano dane',
            'Lessons' => $lessons
        ));
    } else echo json_encode(array(
        'CODE' => 'NO',
        'Mess' => 'Nie masz dostępu'
    ));

} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostępu'
));
$sql_curosr->close();
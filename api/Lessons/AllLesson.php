<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

header('Content-Type: application/json');

$page = isset($_GET['page']) ? $_GET['page'] : 0;

$sql_curosr = sql_con();
if (enter_to_view($sql_curosr) && is_numeric($page) ) {
    $page = ($page == 0 ? $page : $page - 1) * 25;
    $user_ID = GetUserIDbySession($sql_curosr);
    if ($user_ID == 0) {
        echo json_encode(array(
            'CODE' => 'NO',
            'Mess' => 'Brak ID'
        ));
        $sql_curosr->close();
        exit();
    }
    $resoult = $sql_curosr->query(
        "
           SELECT DISTINCT ID, Subject, BackImage
           FROM (
                SELECT
                    Lessons.ID,
                    Lessons.Subject,
                    Lessons.BackImage
                FROM LessonPermision
                    JOIN Lessons on Lessons.ID = LessonPermision.LessonID
               where 
                     (LessonPermision.Type = 1 and LessonPermision.ID_ITEM = $user_ID)
                or
                     (LessonPermision.Type = 2 and LessonPermision.ID_ITEM in (SELECT UsersInGroup.GroupID FROM UsersInGroup WHERE UsersInGroup.UserID = $user_ID))
               ORDER BY Lessons.CreatedTime ASC
           ) as ISBI LIMIT 25 OFFSET $page;
        "
    );
    if ($resoult->num_rows > 0) {
        $tab = array();
        while ($row = $resoult->fetch_assoc()) {
            $tab[] = array(
                'ID' => $row['ID'],
                'Subject' => $row['Subject'],
                'Image' => $row['BackImage'],
            );
        }
        echo json_encode(array(
            'CODE' => 'OK',
            'Mess' => 'Pobrano wyniki',
            'Lessons' => $tab
        ));
    } else echo json_encode(array(
        'CODE' => 'NO',
        'Mess' => 'Brak wynikow'
    ));
}else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_curosr->close();

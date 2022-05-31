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
    $resoult = $sql_cursor->query(
        "
            SELECT DISTINCT ID, Subject, BackImage
            FROM
            (
             SELECT
                    Lessons.ID,
                    Lessons.Subject,
                    Lessons.BackImage
             FROM LessonPermision
                 JOIN Lessons on Lessons.ID = LessonPermision.LessonID
             where
                 (LessonPermision.Type = 1 AND ID_ITEM = $user_ID)
                or
                 (LessonPermision.Type = 2 AND LessonPermision.ID_ITEM in (SELECT UsersInGroup.GroupID FROM UsersInGroup WHERE UsersInGroup.UserID = $user_ID)) order by Lessons.CreatedTime ASC
            ) as ISBI
            limit 5;
        "
    );
    if ($resoult->num_rows > 0) {
        $lessons = array();
        while ($row = $resoult->fetch_assoc()) {
            $lessons[] = array(
                'ID' => $row['ID'],
                'Subject' => $row['Subject'],
                'Image' => $row['BackImage'],
            );
        }
        echo  json_encode(array(
            'CODE' => 'OK',
            'Mess' => 'Porano dane',
            'Lessons' => $lessons
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
<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

header('Content-Type: application/json');

$page = $_GET['page'] ?? 0;
$Les_ID = $_GET['ID'] ?? NAN;

$sql_cursor = sql_con();
if (enter_to_view_by_rank($sql_cursor, 2) && is_numeric($Les_ID)) {
    $page = 25 * ($page > 0 ? $page - 1 : $page);
    $resoult = $sql_cursor->query(
        "
            SELECT 
                   Users.Name,
                   Users.Surrname,
                   Users.Image,
                   UsersLessonsConent.ID,
                   UsersLessonsConent.Les_Content,
                   UsersLessonsConent.checked,
                   UsersLessonsConent.Times
            FROM UsersLessonsConent 
                JOIN Users ON UsersLessonsConent.UserID = Users.ID 
            WHERE UsersLessonsConent.Les_ID = $Les_ID
            ORDER BY UsersLessonsConent.checked DESC 
            LIMIT 25 OFFSET $page;
        "
    );
    if ($resoult->num_rows > 0) {
        $output = array();
        while ($row = $resoult->fetch_assoc()) {
            $output[] = array(
                'Name' => $row['Name'],
                'Surrname' => $row['Surrname'],
                'Image' => $row['Image'],
                'ContentID' => $row['ID'],
                'ContentChapter' => $row['Les_Content'],
                'ContentState' => $row['checked'],
                'ContentDate' => $row['Times']
            );
        }
        echo json_encode(array(
            'CODE' => 'OK',
            'Mess' => 'Pobrano dano!',
            'Answers' => $output,
        ));
    } else echo json_encode(array(
        'CODE' => 'NO',
        'Mess' => 'Brak danych!',
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_cursor->close();
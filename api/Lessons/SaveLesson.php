<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

function isHTML($string){
    if($string != strip_tags($string)){
        return true;
    }else{
        return false;
    }
}

function checkStructure() {
    global $data;
    if (array_key_exists('Les_ID', $data) &&
        array_key_exists('Con_ID', $data) &&
        array_key_exists('Text', $data) &&
        array_key_exists('Files', $data)) {
        if (is_numeric($data['Les_ID']) && is_numeric($data['Con_ID'])) {
            return true;
        } else return false;
    } else return false;
}

$sql_cursor = sql_con();
if (enter_to_view($sql_cursor) && checkStructure()) {
    $user_ID = GetUserIDbySession($sql_cursor);
    if ($user_ID == 0) {
        echo json_encode(array(
            'CODE' => 'NO',
            'Mess' => 'Brak ID'
        ));
        $sql_cursor->close();
        exit();
    }
    $resoult  = $sql_cursor->query("
        SELECT LessonPermision.LessonID
                FROM LessonPermision
               where 
                     (LessonPermision.Type = 1 and LessonPermision.LessonID = {$data['Les_ID']} and LessonPermision.ID_ITEM = $user_ID)
                or
                     (LessonPermision.Type = 2 and LessonPermision.LessonID = {$data['Les_ID']} and LessonPermision.ID_ITEM in (SELECT UsersInGroup.GroupID FROM UsersInGroup WHERE UsersInGroup.UserID = $user_ID) )
    ");
    if ($resoult->num_rows == 0) {
        echo json_encode(array(
            'CODE' => 'NO',
            'Mess' => 'Lekcja nie istnieje albo nie masz dostępu!'
        ));
        $sql_cursor->close();
        exit();
    }
    $sql_cursor->query("DELETE FROM UsersLessonsConent WHERE Les_ID = {$data['Les_ID']} AND Les_Content = {$data['Con_ID']} AND UserID = $user_ID");


    $stmnt = $sql_cursor->prepare(
        "INSERT INTO UsersLessonsConent 
                (
                 Les_ID,
                 Les_Content,
                 UserID,
                 ContentText,
                 ContentFiles,
                 checked,
                 checkedby
                ) 
                values (
                        {$data['Les_ID']},
                        {$data['Con_ID']},
                        $user_ID,
                        ?,
                        '{$data['Files']}',
                        2,
                        0
                );"
    );
    $stmnt->bind_param('s', $data['Text']);
    $stmnt->execute();
    $stmnt->close();
    echo json_encode(array(
        'CODE' => 'OK',
        'Mess' => 'Stan lekcji zapisany'
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostępu'
));
$sql_cursor->close();
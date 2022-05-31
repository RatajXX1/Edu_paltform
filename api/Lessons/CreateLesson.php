<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';
require '../Activity/notfication.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

function checkStructure() {
    global $data;
    if (array_key_exists('Subject', $data) &&
        array_key_exists('Desc', $data) &&
        array_key_exists('Image', $data) &&
        array_key_exists('CanExpire', $data) &&
        array_key_exists('Expire', $data) &&
        array_key_exists('EnableCode', $data) &&
        array_key_exists('Code', $data) &&
        array_key_exists('Users', $data) &&
        array_key_exists('Groups', $data) &&
        array_key_exists('Lesson', $data)) {

        $data['Subject'] = filter_var($data['Subject'], FILTER_SANITIZE_STRING);
        $data['Desc'] = filter_var($data['Desc'], FILTER_SANITIZE_STRING);

        if (
            !empty($data['Subject']) && !empty($data['Image']) &&
            is_array($data['Users']) &&
            is_array($data['Lesson']) &&
            is_array($data['Groups'])
        ) {
            return true;
        } else return false;
    } else return false;
}

$sql_cursor = sql_con();
if (enter_to_view_by_rank($sql_cursor,2 ) && checkStructure()) {
    $user_ID = GetUserIDbySession($sql_cursor);
    if ($user_ID == 0) {
        echo json_encode(array(
            'CODE' => 'NO',
            'Mess' => 'Brak ID'
        ));
        $sql_cursor->close();
        exit();
    }
    $sql_cursor->query(
        "INSERT INTO Lessons (
                         Subject, 
                         Description,
                         BackImage, 
                         UserID,
                         CanExpire,
                         Expire,
                         SecureByCode,
                         Code
                     ) 
                        VALUES (
                            '" . $data['Subject'] . "', 
                            '" . $data['Desc'] . "',
                            '" . $data['Image'] . "',
                            $user_ID, 
                            " . $data['CanExpire'] . ", 
                            '" . $data['Expire'] . "', 
                            " . $data['EnableCode'] . ", 
                            '" . $data['Code'] . "' 
                     );"
    );

    $query = "INSERT INTO LessonContent (LessonID, ID_Content, Content, Files, AnswerType) values ";

    $Lesson_ID = $sql_cursor->insert_id;

    foreach ($data['Lesson'] as $i => $val) {
        $query .= "($Lesson_ID, $i + 1, '" . $val['Text'] . "' , '{$val['Files']}', " . $val['Answer'] . "),";
    }
    if ($query[-1] == ',') $query[-1] = ';';
    else $query .= ';';
    $sql_cursor->query($query);

    $query = "INSERT INTO LessonPermision values ";

    foreach ($data['Users'] as $i) {
        $query .= "($Lesson_ID, 1, $i),";
        NewNotfiUser($sql_cursor, $i, 1, $Lesson_ID);
    }

    foreach ($data['Groups'] as $i) {
        $query .= "($Lesson_ID, 2, $i),";
        NewNotfiGroup($sql_cursor, $i, 1, $Lesson_ID);
    }
    if ($query[-1] == ',') $query[-1] = ';';
    else $query .= ';';
    $sql_cursor->query($query);


    echo json_encode(array(
        'CODE' => 'OK',
        'Mess' => 'Udało się!',
        'ID' => $Lesson_ID
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_cursor->close();


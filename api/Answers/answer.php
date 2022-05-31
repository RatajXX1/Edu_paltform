<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

header('Content-Type: application/json');

$Answer_ID = $_GET['ID'] ?? NAN;


$sql_cursor = sql_con();
if (enter_to_view_by_rank($sql_cursor, 2) && is_numeric($Answer_ID)) {

    $resoult = $sql_cursor->query(
      "
        SELECT 
                   Users.Name,
                   Users.Surrname,
                   UsersLessonsConent.Les_Content,
                   UsersLessonsConent.checked,
                   UsersLessonsConent.ContentText,
                   UsersLessonsConent.ContentFiles
            FROM UsersLessonsConent 
                JOIN Users ON UsersLessonsConent.UserID = Users.ID 
            WHERE UsersLessonsConent.ID = $Answer_ID 
      "
    );

    if ($resoult->num_rows != 0) {
        $resoult = $resoult->fetch_assoc();
        $files_1_O = array();
        if ($resoult['ContentFiles'] != "") {
            $files_1  = $sql_cursor->query("Select FileName, FilePath FROM Files where FileID in (" . str_ireplace('|', ',', $resoult['ContentFiles']) . ");");
            while ($rows = $files_1->fetch_assoc()) {
                $files_1_O[] = array(
                    'FileName' => $rows['FileName'],
                    'FilePath' => $rows['FilePath'],
                );
            }
        }
        echo json_encode(array(
            'CODE' => 'OK',
            'Mess' => 'Pobrano dane!',
            'Answer' => array(
                'Name' => $resoult['Name'],
                'Surrname' => $resoult['Surrname'],
                'ContentChapter' => $resoult['Les_Content'],
                'ContentState' => $resoult['checked'],
                'ContentText' => $resoult['ContentText'],
                'ContentFiles' => $files_1_O,
            )
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
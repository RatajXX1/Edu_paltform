<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

$les_ID = isset($_GET['ID']) ? $_GET['ID'] : NAN;

//
// Lessons State
//  0 - lesson no done
//  1 - lesson editable
//  2 - lesson wait for verify
//  3 - lesson done

$sql_cursor = sql_con();
if (enter_to_view($sql_cursor) && is_numeric($les_ID)) {
    $resoult = $sql_cursor->query("
        Select
            Subject,
            Description,
            BackImage
        From
            Lessons
        WHERE
            ID = $les_ID
    ");
    if ($resoult->num_rows > 0) {
        $data = array();
        $resoult = $resoult->fetch_assoc();
        $data['Subject'] = $resoult['Subject'];
        $data['Desc'] = $resoult['Description'];
        $data['Image'] = $resoult['BackImage'];
        $resoult = $sql_cursor->query(
            "
                SELECT
                    Content,
                    Files,
                    AnswerType,
                    ID_Content
                FROM
                    LessonContent where LessonID = $les_ID
            "
        );

        if ($resoult->num_rows > 0) {
            $data_1 = array();
            $iterotor = 1;
            while ($row = $resoult->fetch_assoc()) {
                $lesson_state = $sql_cursor->query(
                    "SELECT ContentFiles,ContentText,checked FROM UsersLessonsConent WHERE Les_ID = $les_ID and Les_Content = {$row['ID_Content']}"
                );
                $files_1_O = array();
                if ($row['Files'] != '') {
                    $files_1  = $sql_cursor->query("Select FileName, FilePath FROM Files where FileID in (" . str_ireplace('|', ',', $row['Files']) . ");");
                    while ($rows = $files_1->fetch_assoc()) {
                        $files_1_O[] = array(
                            'FileName' => $rows['FileName'],
                            'FilePath' => $rows['FilePath'],
                        );
                    }
                }
                if ($lesson_state->num_rows == 0) {

                    $data_1[] = array(
                        'Content' => $row['Content'],
                        'Files' => $files_1_O,
                        'Answer' => $row['AnswerType'],
                        'UFiles' =>  '',
                        'UText' =>  '',
                        'State' => 0,
                        'More' => !($iterotor == $resoult->num_rows),
                    );
                    break;
                } else {
                    $lesson_state = $lesson_state->fetch_assoc();
                    $files_2_O = array();
                    if ($lesson_state['ContentFiles'] != '') {
                        $files_1  = $sql_cursor->query("Select FileName, FilePath FROM Files where FileID in (" . str_ireplace('|', ',', $lesson_state['ContentFiles']) . ");");
                        while ($rows = $files_1->fetch_assoc()) {
                            $files_2_O[] = array(
                                'FileName' => $rows['FileName'],
                                'FilePath' => $rows['FilePath'],
                            );
                        }
                    }
                    $data_1[] = array(
                        'Content' => $row['Content'],
                        'Files' => $files_1_O,
                        'Answer' => $row['AnswerType'],
                        'UFiles' =>  $files_2_O,
                        'UText' =>  $lesson_state['ContentText'],
                        'State' => $lesson_state['checked'],
                        'More' => !($iterotor == $resoult->num_rows),
                    );
                    if ($lesson_state['checked'] != 3) {
                        break;
                    }
                }
                $iterotor++;
            }
            $data['Content'] = $data_1;
        }

        echo json_encode(array(
            'CODE' => 'OK',
            'Mess' => 'Pobrano dane',
            'Content' => $data
        ));

    } else json_encode(array(
        'CODE' => 'NO',
        'Mess' => 'Lekcja nie istnieje'
    ));
} else json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Brak dostępu'
));
$sql_cursor->close();
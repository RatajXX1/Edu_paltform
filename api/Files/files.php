<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require "../Libs/cors.php";
require "../Libs/utilis.php";
require "../auth/Session.php";

header('Content-Type: application/json');

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

$sql_cursor = sql_con();
if (enter_to_view($sql_cursor) && isset($_FILES) && count($_FILES) > 0) {
    $query = "INSERT INTO Files (FileName, FilePath, UserAdd) values ";
    $names = array();
    foreach ($_FILES as $val) {
        $newFileName = '';
        do {
            $newFileName = hash('sha256' ,generateRandomString(rand(4, 20))) . '.' . pathinfo(basename($val['name']))['extension'];
        } while (file_exists( __DIR__  . '/Upload/' . $newFileName));
        $query .= "('{$val['name']}', '". '/Upload/' . $newFileName . "', 1),";
        $names[] =  "'/Upload/" . $newFileName . "'";
        move_uploaded_file($val['tmp_name'], __DIR__  . '/Upload/' . $newFileName);
    }
    $names = implode(',', $names);
    if ($names[-1] == ',') $names[-1] = ")";
    else $names .= ')';
    if ($query[-1] == ',') $query[-1] = ';';
    else $query .= ';';
    $sql_cursor->query($query);
    $resoult = $sql_cursor->query("Select FileID FROM Files where FilePath in (" . $names );
    $names = array();
    if ($resoult->num_rows > 0) {
        while ($row = $resoult->fetch_assoc()) {
            array_push($names, $row["FileID"]);
        }
    }
    echo json_encode(array(
        'CODE' => 'OK',
        'Mess' => 'Udało się!',
        'Files' => $names
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostępu do tego!'
));
$sql_cursor->close();


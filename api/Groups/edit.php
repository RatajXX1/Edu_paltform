<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require '../Libs/cors.php';
require '../Libs/utilis.php';
require '../auth/Session.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

function checkStructure() {
    global $data;
    if (array_key_exists('Users', $data) &&
        array_key_exists('ID', $data) &&
        array_key_exists('Name', $data)) {
        $data['Name'] = filter_var($data['Name'], FILTER_SANITIZE_STRING);
//        var_dump($data);
        if (is_array($data['Users']) && !empty($data['Name']) ) {
            return true;
        } else return false;
    } else return false;
}

$sql_cursor = sql_con();
if (enter_to_view_by_rank($sql_cursor, 3) && checkStructure()) {

    $sql_cursor->query(
        "Update UsersGroup SET GroupName = '{$data['Name']}' WHERE GroupID = {$data['ID']};"
    );

    $sql_cursor->query(
        "DELETE FROM UsersInGroup WHERE GroupID = {$data['ID']};"
    );

    $query = "INSERT INTO UsersInGroup values ";

    foreach ($data['Users'] as $i) {
        $query .= "({$data['ID']}, $i),";
    }

    if ($query[-1] == ',') $query[-1] = ';';
    else $query .= ';';
    $sql_cursor->query($query);


    echo json_encode(array(
        'CODE' => 'OK',
        'Mess' => 'Konto stworzone!',
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_cursor->close();

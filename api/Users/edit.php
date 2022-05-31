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
    if (array_key_exists('Name', $data) &&
        array_key_exists('Surrname', $data) &&
        array_key_exists('Rank', $data) &&
        array_key_exists('ID', $data) &&
        array_key_exists('Email', $data)) {
        $data['Name'] = filter_var($data['Name'], FILTER_SANITIZE_STRING);
        $data['Surrname'] = filter_var($data['Surrname'], FILTER_SANITIZE_STRING);
        $data['Email'] = filter_var($data['Email'], FILTER_SANITIZE_EMAIL);
        if (is_numeric($data['Rank']) && is_numeric($data['ID']) && !empty($data['Name']) && !empty($data['Surrname']))  {
            return true;
        } else return false;
    } else return false;
}

$sql_cursor = sql_con();
if (enter_to_view_by_rank($sql_cursor, 3) && checkStructure()) {

    $sql_cursor->query(
        "Update Users SET Name = '{$data['Name']}', Surrname = '{$data['Surrname']}', Email = '{$data['Email']}', Rank_type = {$data['Rank']} WHERE ID = {$data['ID']};"
    );

    echo json_encode(array(
        'CODE' => 'OK',
        'Mess' => 'Konto stworzone!',
    ));
} else echo json_encode(array(
    'CODE' => 'NO',
    'Mess' => 'Nie masz dostepu!',
));
$sql_cursor->close();

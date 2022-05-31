<?php

ini_set('upload_max_filesize', '2048M');
ini_set('post_max_size', '2048M');

require '../config.php';

function sql_con() {
    global $MYSQL_USER, $MYSQL_DATABASE, $MYSQL_HOST, $MYSQL_PASSWORD, $MYSQL_PORT;
    $sql_cursor = new mysqli($MYSQL_HOST, $MYSQL_USER, $MYSQL_PASSWORD, $MYSQL_DATABASE, $MYSQL_PORT);
    $sql_cursor->set_charset('utf8');
    return $sql_cursor;
}
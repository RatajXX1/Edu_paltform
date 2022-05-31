<?php

function NewNotfiUser($sql_curosr, $userID, $type, $lesID) {
    $sql_curosr->query("
       INSERT INTO notfication (LesID, UserID, Type, readed) values ($lesID, $userID, $type, 0);
    ");
}

function NewNotfiGroup($sql_curosr, $groupID, $type, $lesID) {
    $sql_curosr->query("
       INSERT INTO notfication (LesID, UserID, Type, readed) SELECT $lesID, UsersInGroup.UserID, $type, 0 FROM UsersInGroup WHERE UsersInGroup.GroupID = $groupID;
    ");
}

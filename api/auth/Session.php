<?php

// TODO: Secure and HTTPONLY to TRUE!

if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}

function VerifySession($sql_cursor, $User_ID) {
    global $ip;
    if (!isset($_COOKIE['SES_ID'])) return false;
    $resoult = $sql_cursor->query('SELECT User_IP, User_Device, Ses_ID FROM Sessions WHERE User_ID = ' . $User_ID);
    if ($resoult->num_rows > 0) {
        $resoult = $resoult->fetch_assoc();
        if ($_COOKIE['SES_ID'] == $resoult['Ses_ID'] && $ip == $resoult["User_IP"]) {
            if ($resoult['User_Device'] == $_SERVER['HTTP_USER_AGENT']) return true;
            else {
                ForceClearSessionsByUser($sql_cursor, $User_ID);
                return false;
            }
        } else {
            ForceClearSessionsByUser($sql_cursor, $User_ID);
            return false;
        }
    } else return false;
}

function isStaticSession($sql_cursor) {
    $resoult = $sql_cursor->query("SELECT Auto_login FROM Sessions WHERE Ses_ID = '{$_COOKIE['SES_ID']}'");
    if ($resoult->num_rows > 0) {
        return $resoult->fetch_assoc()['Auto_login'];
    } else return false;
}

function ForceClearSessionsByUser($sql_cursor, $User_ID) {
    $sql_cursor->query("DELETE FROM Sessions WHERE User_ID = " . $User_ID);
}

function ClearOldSessions($sql_cursor) {
    $sql_cursor->query("DELETE FROM Sessions WHERE Expires < CURRENT_TIMESTAMP AND Auto_login = false");
}

function CreateSession($sql_cursor, $User_ID, $Auto_login = false) {
    global $ip;
    $ses_id = md5($User_ID);
    $Auto_login = $Auto_login ? 'true' : 'false';
    ForceClearSessionsByUser($sql_cursor, $User_ID);
    $sql_cursor->query("INSERT INTO Sessions (User_ID, Ses_ID, User_IP, User_Device, Auto_login, Expires) VALUES (
        {$User_ID},
        '{$ses_id}',
        '{$ip}',
        '{$_SERVER['HTTP_USER_AGENT']}',
        {$Auto_login},
        TIMESTAMPADD(DAY, 1 ,CURRENT_TIMESTAMP) 
    );");
    if (PHP_VERSION_ID < 70300) {
        setcookie('SES_ID', $ses_id, strtotime($Auto_login ? '+ 1 month' : '+ 1 day', strtotime(date("Y-m-d"))),  '/; samesite=None', '', false, false);
    } else {
        setcookie('SES_ID', $ses_id, [
            'expires' => strtotime($Auto_login ? '+ 1 month' : '+ 1 day', strtotime(date("Y-m-d"))),
            'path' => '/',
            'domain' => '',
            'secure' => false,
            'httponly' => false,
            'samesite' => 'None',
        ]);
    }
    return true;
}

function SessionExists($sql_cursor, $User_ID) {
    if (isset($_COOKIE['SES_ID'])) {
        $resoult = $sql_cursor->query("SELECT * FROM Sessions WHERE User_ID = {$User_ID} and Ses_ID = '{$_COOKIE['SES_ID']}'");
        if ($resoult->num_rows > 0) return true;
        else return false;
    } else return false;
}

function LoadSession($sql_cursor, $User_ID) {
    if (PHP_VERSION_ID < 70300) {
        setcookie('SES_ID', $_COOKIE['SES_ID'], strtotime(isStaticSession($sql_cursor) ? '+ 1 month' : '+ 1 day', strtotime(date("Y-m-d"))),  '/; samesite=None', '', false, false);
    } else {
        setcookie('SES_ID', $_COOKIE['SES_ID'], [
            'expires' => strtotime(isStaticSession($sql_cursor) ? '+ 1 month' : '+ 1 day', strtotime(date("Y-m-d"))),
            'path' => '/',
            'domain' => '',
            'secure' => false,
            'httponly' => false,
            'samesite' => 'None',
        ]);
    }
    $sql_cursor->query("UPDATE Sessions SET Expires = TIMESTAMPADD(DAY, 1 ,CURRENT_TIMESTAMP) WHERE User_ID = " . $User_ID);
    return true;
}

function GetUserIDbySession($sql_cursor) {
    if (isset($_COOKIE['SES_ID'])) {
        $resoult =  $sql_cursor->query("SELECT User_ID FROM Sessions WHERE Ses_ID='{$_COOKIE['SES_ID']}'");
        if ($resoult->num_rows > 0) {
            return $resoult->fetch_assoc()['User_ID'];
        } else return 0;
    } else return false;
}

function getUserRankBySession($sql_cursor, $User_ID) {
    $resoult = $sql_cursor->query("SELECT Rank_type FROM Users WHERE ID = " . $User_ID);
    if ($resoult->num_rows > 0) {
        return $resoult->fetch_assoc()['Rank_type'];
    } else return null;
}

function enter_to_view($sql_cursor) {
    $user_ID = GetUserIDbySession($sql_cursor);
    if ($user_ID > 0 && VerifySession($sql_cursor, $user_ID)) {
        ClearOldSessions($sql_cursor);
        if (SessionExists($sql_cursor, $user_ID)) {
            // Load Session
            return LoadSession($sql_cursor, $user_ID);
        } else {
            // Create Session
            return CreateSession($sql_cursor, $user_ID);
        }
    } else return false;
}

function enter_to_view_by_rank($sql_cursor, $rank_user) {
    $user_ID = GetUserIDbySession($sql_cursor);
    if ($user_ID > 0 && VerifySession($sql_cursor, $user_ID)) {
        ClearOldSessions($sql_cursor);
        $rank = getUserRankBySession($sql_cursor, $user_ID);
        if ($rank == null || $rank < $rank_user) return false;
        if (SessionExists($sql_cursor, $user_ID)) {
            // Load Session
            return LoadSession($sql_cursor, $user_ID);
        } else {
            // Create Session
            return CreateSession($sql_cursor, $user_ID);
        }
    } else return false;
}
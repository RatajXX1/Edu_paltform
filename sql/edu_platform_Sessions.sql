create table Sessions
(
    User_ID     int                                  not null,
    Ses_ID      text                                 not null,
    User_IP     varchar(16)                          not null,
    User_Device text                                 not null,
    Auto_login  tinyint(1) default 0                 not null,
    Expires     datetime   default CURRENT_TIMESTAMP not null,
    Created     datetime   default CURRENT_TIMESTAMP not null
);


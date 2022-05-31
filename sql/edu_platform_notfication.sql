create table notfication
(
    LesID  int                                  not null,
    UserID int                                  not null,
    Type   int                                  not null,
    readed tinyint(1) default 0                 null,
    Date   datetime   default CURRENT_TIMESTAMP null
);


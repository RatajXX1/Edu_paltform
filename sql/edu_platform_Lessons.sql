create table Lessons
(
    ID           int auto_increment
        primary key,
    Subject      text                                 not null,
    Description  text                                 not null,
    BackImage    text                                 not null,
    UserID       int                                  not null,
    CreatedTime  datetime   default CURRENT_TIMESTAMP not null,
    CanExpire    tinyint(1) default 0                 not null,
    Expire       datetime   default CURRENT_TIMESTAMP not null,
    AllView      tinyint(1) default 0                 not null,
    SecureByCode tinyint(1) default 0                 not null,
    Code         text                                 not null
);


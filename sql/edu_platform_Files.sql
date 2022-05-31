create table Files
(
    FileID     int auto_increment
        primary key,
    FileName   varchar(255)                       not null,
    FilePath   text                               not null,
    UserAdd    int                                not null,
    UploadDate datetime default CURRENT_TIMESTAMP null
);


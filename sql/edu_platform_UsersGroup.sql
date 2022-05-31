create table UsersGroup
(
    GroupID     int auto_increment
        primary key,
    GroupName   text                               not null,
    UserCreated int                                not null,
    CreatedDate datetime default CURRENT_TIMESTAMP not null
);


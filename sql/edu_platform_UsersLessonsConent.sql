create table UsersLessonsConent
(
    ID           int auto_increment
        primary key,
    Les_ID       int                                not null,
    Les_Content  int                                not null,
    UserID       int                                not null,
    ContentText  text                               not null,
    ContentFiles text                               not null,
    Times        datetime default CURRENT_TIMESTAMP null,
    checked      int                                null,
    checkedby    int                                not null,
    checkedDate  datetime default CURRENT_TIMESTAMP not null
);


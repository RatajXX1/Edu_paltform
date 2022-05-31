create table LessonContent
(
    LessonID    int                                not null,
    ID_Content  int                                not null,
    Content     text                               not null,
    Files       text                               not null,
    AnswerType  int                                not null,
    CreatedTime datetime default CURRENT_TIMESTAMP null
);


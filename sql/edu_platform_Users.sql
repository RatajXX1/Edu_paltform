create table Users
(
    ID        int auto_increment
        primary key,
    Image     text                               not null,
    Name      text                               not null,
    Surrname  text                               not null,
    Email     text                               not null,
    Password  text                               not null,
    Rank_type int      default 0                 not null,
    Created   datetime default CURRENT_TIMESTAMP not null
);

INSERT INTO edu_platform.Users (ID, Image, Name, Surrname, Email, Password, Rank_type, Created) VALUES (33, '''''', 'Michał', 'dsadasd', 'ratajx1@gmail.com', '8737fe2e24535f5a4ffafdf7e7e4da78b4805aed77e8bb6ab36ea079bbfb8c1c', 3, '2022-05-30 08:51:28');

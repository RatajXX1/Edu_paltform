create table Configuration
(
    Conf_Name  text not null,
    Conf_Value text not null
);

INSERT INTO edu_platform.Configuration (Conf_Name, Conf_Value) VALUES ('WebsiteName', 'Platforma Edukacyjna');

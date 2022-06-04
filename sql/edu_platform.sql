-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Czas generowania: 04 Cze 2022, 12:59
-- Wersja serwera: 8.0.28
-- Wersja PHP: 7.2.24-0ubuntu0.18.04.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `edu_platform`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Configuration`
--

CREATE TABLE `Configuration` (
  `Conf_Name` text COLLATE utf8_polish_ci NOT NULL,
  `Conf_Value` text COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `Configuration`
--

INSERT INTO `Configuration` (`Conf_Name`, `Conf_Value`) VALUES
('WebsiteName', 'Platforma Edukacyjna');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Files`
--

CREATE TABLE `Files` (
  `FileID` int NOT NULL,
  `FileName` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `FilePath` text COLLATE utf8_polish_ci NOT NULL,
  `UserAdd` int NOT NULL,
  `UploadDate` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `LessonContent`
--

CREATE TABLE `LessonContent` (
  `LessonID` int NOT NULL,
  `ID_Content` int NOT NULL,
  `Content` text COLLATE utf8_polish_ci NOT NULL,
  `Files` text COLLATE utf8_polish_ci NOT NULL,
  `AnswerType` int NOT NULL,
  `CreatedTime` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `LessonPermision`
--

CREATE TABLE `LessonPermision` (
  `LessonID` int NOT NULL,
  `Type` int NOT NULL DEFAULT '1',
  `ID_ITEM` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Lessons`
--

CREATE TABLE `Lessons` (
  `ID` int NOT NULL,
  `Subject` text COLLATE utf8_polish_ci NOT NULL,
  `Description` text COLLATE utf8_polish_ci NOT NULL,
  `BackImage` text COLLATE utf8_polish_ci NOT NULL,
  `UserID` int NOT NULL,
  `CreatedTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CanExpire` tinyint(1) NOT NULL DEFAULT '0',
  `Expire` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `AllView` tinyint(1) NOT NULL DEFAULT '0',
  `SecureByCode` tinyint(1) NOT NULL DEFAULT '0',
  `Code` text COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `notfication`
--

CREATE TABLE `notfication` (
  `LesID` int NOT NULL,
  `UserID` int NOT NULL,
  `Type` int NOT NULL,
  `readed` tinyint(1) DEFAULT '0',
  `Date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Sessions`
--

CREATE TABLE `Sessions` (
  `User_ID` int NOT NULL,
  `Ses_ID` text COLLATE utf8_polish_ci NOT NULL,
  `User_IP` varchar(16) COLLATE utf8_polish_ci NOT NULL,
  `User_Device` text COLLATE utf8_polish_ci NOT NULL,
  `Auto_login` tinyint(1) NOT NULL DEFAULT '0',
  `Expires` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Users`
--

CREATE TABLE `Users` (
  `ID` int NOT NULL,
  `Image` text COLLATE utf8_polish_ci NOT NULL,
  `Name` text COLLATE utf8_polish_ci NOT NULL,
  `Surrname` text COLLATE utf8_polish_ci NOT NULL,
  `Email` text COLLATE utf8_polish_ci NOT NULL,
  `Password` text COLLATE utf8_polish_ci NOT NULL,
  `Rank_type` int NOT NULL DEFAULT '0',
  `Created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `Users`
--

INSERT INTO `Users` (`ID`, `Image`, `Name`, `Surrname`, `Email`, `Password`, `Rank_type`, `Created`) VALUES
(NULL, '', 'Admin', 'Admin', 'admin@admin.com', '998ed4d621742d0c2d85ed84173db569afa194d4597686cae947324aa58ab4bb', 3, '2022-05-30 08:51:28');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `UsersGroup`
--

CREATE TABLE `UsersGroup` (
  `GroupID` int NOT NULL,
  `GroupName` text COLLATE utf8_polish_ci NOT NULL,
  `UserCreated` int NOT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `UsersInGroup`
--

CREATE TABLE `UsersInGroup` (
  `GroupID` int NOT NULL,
  `UserID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `UsersLessonsConent`
--

CREATE TABLE `UsersLessonsConent` (
  `ID` int NOT NULL,
  `Les_ID` int NOT NULL,
  `Les_Content` int NOT NULL,
  `UserID` int NOT NULL,
  `ContentText` text COLLATE utf8_polish_ci NOT NULL,
  `ContentFiles` text COLLATE utf8_polish_ci NOT NULL,
  `Times` datetime DEFAULT CURRENT_TIMESTAMP,
  `checked` int DEFAULT NULL,
  `checkedby` int NOT NULL,
  `checkedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `Files`
--
ALTER TABLE `Files`
  ADD PRIMARY KEY (`FileID`);

--
-- Indeksy dla tabeli `Lessons`
--
ALTER TABLE `Lessons`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `UsersGroup`
--
ALTER TABLE `UsersGroup`
  ADD PRIMARY KEY (`GroupID`);

--
-- Indeksy dla tabeli `UsersLessonsConent`
--
ALTER TABLE `UsersLessonsConent`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `Files`
--
ALTER TABLE `Files`
  MODIFY `FileID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `Lessons`
--
ALTER TABLE `Lessons`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `Users`
--
ALTER TABLE `Users`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT dla tabeli `UsersGroup`
--
ALTER TABLE `UsersGroup`
  MODIFY `GroupID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `UsersLessonsConent`
--
ALTER TABLE `UsersLessonsConent`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июл 24 2023 г., 13:17
-- Версия сервера: 10.5.19-MariaDB-cll-lve
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `u476231205_motelit`
--

-- --------------------------------------------------------

--
-- Структура таблицы `DataPets`
--

CREATE TABLE `DataPets` (
  `id` int(10) UNSIGNED NOT NULL,
  `login` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` char(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `date_reg` text NOT NULL,
  `Level` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `Score` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `Energy` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `Coins` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `Emeralds` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `Prestige` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `Awards` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `Clothes` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'cat_1|pk_1|Default|Default|Default|Default|Default|Default|Default|Default|default|Default|Default|Default',
  `Wardrobe` text NOT NULL DEFAULT '/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/P_default#B_default#',
  `Stickers` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `Kiths` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '$',
  `Inventory` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0/Default/$%',
  `Gifts` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `Time` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '01.01.2001$',
  `Home` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '1/0',
  `Mail` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `Card` text NOT NULL DEFAULT '1.1.2001',
  `Quests` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'LotuSchool#27.05.2050#0$//',
  `Extra` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Дамп данных таблицы `DataPets`
--

INSERT INTO `DataPets` (`id`, `login`, `email`, `password`, `date_reg`, `Level`, `Score`, `Energy`, `Coins`, `Emeralds`, `Prestige`, `Awards`, `Clothes`, `Wardrobe`, `Stickers`, `Kiths`, `Inventory`, `Gifts`, `Time`, `Home`, `Mail`, `Card`, `Quests`, `Extra`) VALUES
(45, 'Даня', 'отсутствует', '81dc9bdb52d04dc20036dbd8313ed055', '24.09.2019', 12, 236, 0, 999754, 1000, 3840, 'A_oh#', 'cat_1|pk_1|Default|Default|Default|Default|Default|Default|Default|Default|default|Default|default|Default', 'dog_1#E_pk_3#cat_1#cat_2#dog_2#dog_3#E_pk_1#E_pk_2#cat_3#/takeoff#fut_1#/takeoff#hat_1#/takeoff#bot_1#/takeoff#AA1_br_1#G_och_1#//takeoff#/P_default#B_default#B_def_blue#B_def_green#B_def_pink#P_spruce#', 'vabl_1/vabl_2/vabl_3/vabl_4/', '$Лена/мотя/', '0/Default/$%', '', '3.11.2021$', '0/0', '', '1.1.2022', 'LotuSchool#27.05.2022#0$//', '2'),
(119, 'яяяя', 'elizarti@gmail.com', '02c425157ecd32f259548b33402ff6d3', '25.11.2020', 1, 2, 0, 13, 0, 0, '', 'cat_1|pk_1|Default|Default|Default|Default|Default|Default|Default|Default|default|Default|default|Default', '/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/P_default#B_default#', '', '$', '0/Default/$%', '', '25.11.2020$', '0/0', '', '1.1.2001', 'LotuSchool#27.05.2050#0$//', '0'),
(47, 'Лена', '@sfsdf.ru', '81dc9bdb52d04dc20036dbd8313ed055', '1.10.2019', 4, 82, 0, 58, 20, 157, 'A_oh#', 'dog_1|pk_3|Default|Default|Default|Default|Default|Default|Default|Default|default|Default|default|Default', 'dog_1#E_pk_3#E_pk_1#cat_3#E_pk_2#dog_3#/takeoff#fut_1#/takeoff#hat_1#/takeoff#/takeoff#AA1_br_1#//takeoff#/P_default#', '', '$Даня/', '0/default/$1/default/$%', '', '7.04.2021$', '0/0', 'Даня|Привет!|', '1.1.2022', '//', '0'),
(85, '5555', '5555@.', '6074c6aa3488f3c2dddff2a7ca821aab', '3.01.2020', 1, 0, 0, 0, 0, 0, '', 'dog_1|pk_3|Default|Default|Default|Default|Default|Default|Default|Default|default|Default|default|Default', 'dog_1#E_pk_3#/takeoff#/takeoff#/takeoff#/takeoff#//takeoff#/P_default#', '', '$лошара/', '0/Default/$%', '', '22.10.2020$', '1/0', '', '1.1.2001', '//', ''),
(1, 'Котиплекс', 'kotiplex@motelit.ml', '3cd2e1894cb070459d13de86e4c8edf7', '2.02.2020', 1, 0, 0, 0, 0, 0, '', 'cat_1|pk_3|default|default|default|default|default|default|default|default|default|default|default|default', 'cat_1#E_pk_3#/takeoff#/takeoff#/takeoff#/takeoff#//takeoff#/P_default#/B_default#', '', '$', '0/Default/$%', '', '2.02.2020$', '0/0', '', '1.1.2001', '//', ''),
(113, 'Барс', 'fdhfdg@maqi.ru', '81dc9bdb52d04dc20036dbd8313ed055', '10.10.2020', 1, 0, 0, 0, 0, 0, '', 'cat_3|pk_3|Default|Default|Default|Default|Default|Default|Default|Default|default|Default|default|Default', '/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/P_default#B_default#', '', '$', '0/Default/$%', '', '7.04.2021$', '0/0', '', '1.1.2001', 'LotuSchool#27.05.2050#0$//', '5'),
(114, '1234', '1231541@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', '14.10.2020', 999, 2, 1, 119, 102, 63250, 'A_oh#', 'dog_1|pk_1|br_1|ch_1|sh_1|naush_1|fut_1|och_1|hat_1|bot_1|def_green|Default|default|Default', 'dog_1#dog_3#cat_2#/takeoff#fut_1#/takeoff#hat_1#/takeoff#bot_1#/takeoff#AA1_br_1#AA2_ch_1#AB_sh_1#AH_naush_1#G_och_1#/takeoff#/takeoff#/P_default#B_default#B_def_blue#B_def_green#/', '', '$лошара/', '0/Default/$%0lime_chair#0/0wood_table#0/1wow_lamp_br#0/', '', '22.05.2021$', '0/0', '', '1.1.2001', '//', '5'),
(2, 'Макс', 'max@motelit.ml', '81dc9bdb52d04dc20036dbd8313ed055', '31.03.2020', 1, 0, 0, 0, 0, 0, '', 'dog_3|pk_1|default|default|default|default|default|default|default|default|default|default|default|default', 'dog_3#E_pk_1#/takeoff#/takeoff#/takeoff#/takeoff#//takeoff#/P_default#/B_default#', '', '$', '0/Default/$%', '', '7.04.2021$', '0/0', '', '1.1.2001', 'LotuSchool#27.05.2050#0$//', ''),
(117, 'мотя', 'pxmurmansk@gmail.com', '35506394c8c0d50785349a08efdfac9c', '25.11.2020', 1, 0, 0, 0, 0, 0, '', 'dog_2|pk_2|Default|Default|Default|Default|Default|Default|Default|Default|default|Default|default|Default', '/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/P_default#B_default#', '', '$Даня/', '0/Default/$%', '', '25.11.2020$', '0/0', '', '1.1.2001', 'LotuSchool#27.05.2050#0$//', ''),
(118, 'Панда', 'ffhh@mail.ru', 'ed366fe0cda8c62e80f95098666534d6', '25.11.2020', 1, 0, 0, 9999, 0, 0, '', 'dog_1|pk_2|default|default|default|default|default|default|default|default|default|default|default|default', '/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/P_default#B_default#', '', '$', '0/Default/$%', '', '25.11.2020$', '0/0', '', '1.1.2001', 'LotuSchool#27.05.2050#0$//', ''),
(116, 'Никита', 'uhanovn626@gmail.com', '897efc6cb54c62dd9c04687cc07608d8', '26.10.2020', 1, 2, 0, 18, 0, 0, '', 'cat_3|pk_3|Default|Default|Default|Default|Default|Default|Default|Default|default|Default|default|Default', '/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/P_default#B_default#', '', '$', '0/Default/$%', '', '26.10.2020$', '0/0', '', '1.1.2001', 'LotuSchool#27.05.2050#0$//', '0'),
(120, 'Пандаа', 'sgewrgs@mail.ru', 'd8578edf8458ce06fbc5bb76a58c5ca4', '25.11.2020', 1, 0, 0, 0, 0, 0, '', 'dog_2|pk_3|default|default|default|default|default|default|default|default|default|default|default|default', '/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/P_default#B_default#', '', '$', '0/Default/$%', '', '25.11.2020$', '0/0', '', '1.1.2001', 'LotuSchool#27.05.2050#0$//', ''),
(121, 'Фирс', 'dsadas@mail.ru', '81dc9bdb52d04dc20036dbd8313ed055', '24.04.2021', 1, 0, 0, 8, 0, 0, '', 'dog_3|pk_1|Default|Default|Default|Default|Default|Default|Default|Default|default|Default|default|Default', '/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/takeoff#/P_default#B_default#', '', '$', '0/Default/$%', '', '24.04.2021$', '0/0', '', '1.1.2001', 'LotuSchool#27.05.2050#0$//', '15');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `DataPets`
--
ALTER TABLE `DataPets`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `email` (`email`) USING BTREE,
  ADD UNIQUE KEY `login` (`login`) USING BTREE;

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `DataPets`
--
ALTER TABLE `DataPets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

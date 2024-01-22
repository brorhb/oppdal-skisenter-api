-- -------------------------------------------------------------
-- TablePlus 5.8.4(532)
--
-- https://tableplus.com/
--
-- Database: heroku_4abc66414d32f46
-- Generation Time: 2024-01-22 15:58:45.6030
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `alert`;
CREATE TABLE `alert` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(255) NOT NULL,
  `is_live` tinyint(1) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  `billboard` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `avalanche_levels`;
CREATE TABLE `avalanche_levels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `avalanche_log`;
CREATE TABLE `avalanche_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `level` int NOT NULL DEFAULT '1',
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `level` (`level`),
  CONSTRAINT `avalanche_log_ibfk_1` FOREIGN KEY (`level`) REFERENCES `avalanche_levels` (`id`),
  CONSTRAINT `avalanche_log_ibfk_2` FOREIGN KEY (`level`) REFERENCES `avalanche_levels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `billboards`;
CREATE TABLE `billboards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `is_deleted` tinyint(1) DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `port` varchar(255) NOT NULL,
  `zone` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10033 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `camera`;
CREATE TABLE `camera` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT 'utf8mb4_0900_ai_ci',
  `url` varchar(255) DEFAULT 'utf8mb4_0900_ai_ci',
  `zone` int DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `zone` (`zone`),
  CONSTRAINT `camera_ibfk_1` FOREIGN KEY (`zone`) REFERENCES `zones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `difficulty`;
CREATE TABLE `difficulty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `facilities`;
CREATE TABLE `facilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` int NOT NULL,
  `status` int DEFAULT '2',
  `zone` int DEFAULT NULL,
  `panorama_position` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `type` (`type`),
  KEY `status` (`status`),
  CONSTRAINT `facilities_ibfk_1` FOREIGN KEY (`type`) REFERENCES `facilities_types` (`id`),
  CONSTRAINT `facilities_ibfk_2` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `facilities_types`;
CREATE TABLE `facilities_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `feature_types`;
CREATE TABLE `feature_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `features`;
CREATE TABLE `features` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` float DEFAULT NULL,
  `track` int NOT NULL,
  `type` int NOT NULL,
  `difficulty` int NOT NULL,
  `status` int DEFAULT '2',
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `track_id` (`track`),
  KEY `type_id` (`type`),
  KEY `difficulty` (`difficulty`),
  KEY `status` (`status`),
  CONSTRAINT `features_ibfk_1` FOREIGN KEY (`track`) REFERENCES `tracks` (`id`),
  CONSTRAINT `features_ibfk_2` FOREIGN KEY (`type`) REFERENCES `feature_types` (`id`),
  CONSTRAINT `features_ibfk_3` FOREIGN KEY (`difficulty`) REFERENCES `difficulty` (`id`),
  CONSTRAINT `features_ibfk_4` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `lift_coord_in_map`;
CREATE TABLE `lift_coord_in_map` (
  `id` int NOT NULL AUTO_INCREMENT,
  `coord` varchar(255) NOT NULL,
  `lift` int NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `lift` (`lift`),
  CONSTRAINT `lift_coord_in_map_ibfk_1` FOREIGN KEY (`lift`) REFERENCES `lifts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=202 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `lift_type`;
CREATE TABLE `lift_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `lifts`;
CREATE TABLE `lifts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` int DEFAULT '2',
  `start_position` float DEFAULT NULL,
  `end_position` float DEFAULT NULL,
  `elevation` int DEFAULT NULL,
  `length` int DEFAULT NULL,
  `type` int NOT NULL,
  `map_name` varchar(255) NOT NULL,
  `zone` int DEFAULT NULL,
  `panorama_position` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `status` (`status`),
  CONSTRAINT `lifts_ibfk_1` FOREIGN KEY (`type`) REFERENCES `lift_type` (`id`),
  CONSTRAINT `lifts_ibfk_2` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `snow_conditions`;
CREATE TABLE `snow_conditions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(255) NOT NULL,
  `is_live` tinyint(1) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `status_types`;
CREATE TABLE `status_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `track_coord_in_map`;
CREATE TABLE `track_coord_in_map` (
  `id` int NOT NULL AUTO_INCREMENT,
  `coord` varchar(255) NOT NULL,
  `track` int NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `track` (`track`),
  CONSTRAINT `track_coord_in_map_ibfk_1` FOREIGN KEY (`track`) REFERENCES `tracks` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=393 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `tracks`;
CREATE TABLE `tracks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `connected_tracks` varchar(255) DEFAULT NULL,
  `season` int DEFAULT NULL,
  `status` int DEFAULT '2',
  `length` int DEFAULT NULL,
  `difficulty` int NOT NULL,
  `lifts` varchar(255) DEFAULT NULL,
  `zone` int DEFAULT NULL,
  `panorama_position` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `map_name` varchar(255) DEFAULT NULL,
  `hidden` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `difficulty` (`difficulty`),
  KEY `status` (`status`),
  KEY `zone` (`zone`),
  CONSTRAINT `tracks_ibfk_1` FOREIGN KEY (`difficulty`) REFERENCES `difficulty` (`id`),
  CONSTRAINT `tracks_ibfk_2` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`),
  CONSTRAINT `tracks_ibfk_3` FOREIGN KEY (`zone`) REFERENCES `zones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` int NOT NULL,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `weather_station`;
CREATE TABLE `weather_station` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `weather_station_zone`;
CREATE TABLE `weather_station_zone` (
  `station_id` int NOT NULL DEFAULT '0',
  `zone_id` int DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`station_id`),
  KEY `zone_id` (`zone_id`),
  CONSTRAINT `weather_station_zone_ibfk_1` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `zones`;
CREATE TABLE `zones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;

INSERT INTO `alert` (`id`, `message`, `is_live`, `timestamp`, `is_deleted`, `billboard`) VALUES
(1, 'Vangslia stengt grunnet vind.', 0, '2008-01-01 00:00:01', 0, NULL),
(11, 'Håkerexpressen er stengt grunnet vind', 0, '2024-01-20 18:56:19', 0, NULL),
(52, 'Åpent i Vangslia hver dag 10:00 - 16:00. Stølen og Hovden er åpen lørdag og søndag. Kveldsåpent i Vangslia tirsdag og torsdag 18:00 - 20:30.', 0, '2024-01-16 16:44:54', 0, NULL),
(55, 'Åpent i Vangslia hver dag 10:00 - 16:00. Stølen, Hovden og Ådalen er åpen lørdag og søndag. Kveldskjøring i Vangslia tirsdag og torsdag 18:00 - 20:30.', 0, '2024-01-21 09:40:01', 0, NULL),
(58, 'Sletvoldheisen er åpen for transport av gjester opp til resten av skisenteret hver lørdag og søndag samt i vinterferien og påskeferien 10:00 - 11-30.', 0, '2024-01-21 09:28:01', 0, NULL),
(61, 'Søndag 21/1: Vindøkning etter åpningstid gjør at Fjellheisen i Stølen og øvre del av Vangsliekspressen nå er stengt. Løypeforbindelser via Hovden.', 0, '2024-01-21 15:15:40', 0, NULL),
(64, 'Åpent i Vangslia hver dag 10:00 - 16:00. Stølen og Hovden er åpen lørdag og søndag. Kveldskjøring i Vangslia tirsdag og torsdag 18:00 - 20:30.', 1, '2024-01-21 09:40:40', 0, NULL),
(67, 'Søndag 21/1: Øvre del av Vangsliekspressen er stengt pga vind.', 0, '2024-01-21 13:46:37', 0, NULL),
(70, '21/1 klokka 13.00: Hovden og Fjellheisen i Stølen stenger pga sterk vind. Begrenset løypeforbindelse.', 0, '2024-01-21 13:46:31', 0, NULL);

INSERT INTO `avalanche_levels` (`id`, `value`, `is_deleted`) VALUES
(1, 'none', 0),
(2, 'low', 0),
(3, 'medium', 0),
(4, 'high', 0);

INSERT INTO `avalanche_log` (`id`, `level`, `timestamp`, `is_deleted`) VALUES
(1, 1, '2008-01-01 00:00:01', 0);

INSERT INTO `billboards` (`id`, `is_deleted`, `name`, `port`, `zone`) VALUES
(10029, 0, 'Vangslia', '10029', 1),
(10030, 0, 'Vangslia (Solheisen)', '10030', 1),
(10031, 0, 'Hovden', '10031', 3),
(10032, 0, 'Stølen', '10032', 4);

INSERT INTO `camera` (`id`, `name`, `url`, `zone`, `is_deleted`) VALUES
(1, 'Vangslia', 'https://player.twitch.tv/?channel=oppdal_skisenter&parent=${PARENT}&autoplay=true', 1, 0),
(2, 'Stølen', 'https://player.twitch.tv/?channel=rockoss_oppdal&parent=${PARENT}&autoplay=true', 4, 0);

INSERT INTO `difficulty` (`id`, `label`, `is_deleted`) VALUES
(1, 'beginner', 0),
(2, 'intermediate', 0),
(3, 'advanced', 0),
(4, 'expert', 0),
(5, 'professional', 0),
(6, 'not rated', 0),
(7, 'terrainpark', 0);

INSERT INTO `facilities` (`id`, `name`, `type`, `status`, `zone`, `panorama_position`, `is_deleted`) VALUES
(1, 'Storstuggu i Vangslia', 2, 1, NULL, '[0,41]', 0),
(11, 'The Hill 1125 i Hovden', 2, 1, NULL, '[0,42]', 0),
(21, 'Rockoss i Stølen', 2, 1, NULL, '[0,43]', 0),
(31, 'Gråberget i Stølen', 2, 1, NULL, '[0,24]', 0),
(41, 'Carving cafe', 2, 1, NULL, '', 0),
(71, 'Aurhøa', 6, 1, NULL, '', 0),
(81, 'Ådalen', 6, 1, NULL, '', 0),
(91, 'Vangslia - Skiutleie', 4, 1, NULL, '', 0),
(101, 'Hovden - Skiutleie', 4, 1, NULL, '', 0),
(111, 'Stølen - Skiutleie', 4, 1, NULL, '', 0),
(121, 'Loftet afterski', 7, 1, NULL, '', 0),
(131, 'Låven afterski', 7, 1, NULL, '', 0),
(141, 'Rockoss', 7, 1, NULL, '', 0);

INSERT INTO `facilities_types` (`id`, `name`, `is_deleted`) VALUES
(1, 'toilet', 0),
(2, 'cafe', 0),
(3, 'workshop', 0),
(4, 'rental', 0),
(5, 'shop', 0),
(6, 'warming', 0),
(7, 'afterski', 0);

INSERT INTO `feature_types` (`id`, `name`, `is_deleted`) VALUES
(1, 'jump', 0),
(2, 'rollers', 0),
(3, 'big jump', 0),
(4, 'air bag', 0),
(5, 'ral', 0),
(6, 'box', 0);

INSERT INTO `lift_coord_in_map` (`id`, `coord`, `lift`, `is_deleted`) VALUES
(1, '207, 405', 18, 0),
(41, '3,371', 20, 0),
(61, '251,177', 13, 0),
(71, '163, 370', 14, 0),
(81, '174,361', 15, 0),
(91, '181, 378', 16, 0),
(101, '193,371', 17, 0),
(111, '631,260', 19, 0),
(121, '648,266', 21, 0),
(131, '520,548', 22, 0),
(141, '535,562', 23, 0),
(151, '625,320', 24, 0),
(161, '841,519', 25, 0),
(171, '1105, 483', 26, 0),
(181, '1096, 453', 27, 0),
(191, '1096, 436', 28, 0),
(201, '1028, 298', 29, 0);

INSERT INTO `lift_type` (`id`, `type`, `is_deleted`) VALUES
(1, 'ufo', 0),
(2, 'flying carpet', 0),
(3, 't-hook', 0),
(4, 'chairlift', 0);

INSERT INTO `lifts` (`id`, `name`, `status`, `start_position`, `end_position`, `elevation`, `length`, `type`, `map_name`, `zone`, `panorama_position`, `is_deleted`) VALUES
(13, 'Toppheisen', 2, NULL, NULL, 90, 360, 3, 'G', 1, '[0,7]', 0),
(14, 'Langheisen', 1, NULL, NULL, 481, 1614, 3, 'B', 1, '[0,1]', 0),
(15, 'Kortheisen', 1, NULL, NULL, 493, 1688, 3, 'C', 1, '[0,2]', 0),
(16, 'Barneheisen', 1, NULL, NULL, 108, 500, 1, 'D', 1, '[0,3]', 0),
(17, 'Rullebåndet', 1, NULL, NULL, NULL, NULL, 2, 'E', 1, '[0,4]', 0),
(18, 'Vangsliaekspressen (midten)', 1, NULL, NULL, 309, 1382, 4, 'F', 1, '[0,5]', 0),
(19, 'Ådalsheisen', 2, NULL, NULL, 315, 1154, 3, 'H', 2, '[0,10]', 0),
(20, 'Håkerekspressen', 2, NULL, NULL, 340, 1340, 4, 'A', 1, '[0,0]', 0),
(21, 'Tverrheisen', 2, NULL, NULL, 129, 1041, 3, 'I', 2, '[0,11]', 0),
(22, 'Hovedenekspressen', 2, NULL, NULL, 534, 1716, 4, 'J', 3, '[0,14]', 0),
(23, 'Hovdenheisen', 2, NULL, NULL, 447, 1547, 3, 'L', 3, NULL, 1),
(24, 'Toppheisen', 2, NULL, NULL, 95, 273, 1, 'M', 3, NULL, 1),
(25, 'Sletvoldheisen', 2, NULL, NULL, 123, 460, 1, 'K', 3, '[0,15]', 0),
(26, 'Barneheis', 2, NULL, NULL, 40, 200, 1, 'L', 4, '[0,18]', 0),
(27, 'Stølen 1', 2, NULL, NULL, 341, 1343, 3, 'M', 4, '[0,19]', 0),
(28, 'Stølen 2', 2, NULL, NULL, 299, 1089, 3, 'N', 4, '[0,20]', 0),
(29, 'Fjellheisen', 2, NULL, NULL, 353, 1618, 3, 'O', 4, '[0,21]', 0),
(30, 'Vangsliaekspressen (toppen)', 1, NULL, NULL, 309, 1382, 4, 'F', 1, '[0,6]', 0);

INSERT INTO `snow_conditions` (`id`, `message`, `is_live`, `timestamp`, `is_deleted`) VALUES
(1, 'Nysnø gjør at det er svært gode forhold i Stølen i dag!', 0, '2008-01-01 00:00:01', 0),
(2, 'Svært gode forhold i Vangslia i dag.', 0, '2008-01-01 00:00:01', 0),
(3, 'Svært gode forhold i Hovden i dag.', 0, '2008-01-01 00:00:01', 0),
(21, 'Gode forhold i løypene i dag. ', 0, '2008-01-01 00:00:01', 0);

INSERT INTO `status_types` (`id`, `name`, `is_deleted`) VALUES
(1, 'open', 0),
(2, 'closed', 0),
(3, 'maintanence', 0);

INSERT INTO `track_coord_in_map` (`id`, `coord`, `track`, `is_deleted`) VALUES
(1, '168, 272', 1, 0),
(11, '122, 279', 17, 0),
(21, '173, 326', 3, 0),
(31, '252, 307', 5, 0),
(41, '225, 332', 4, 0),
(51, '310, 293', 6, 0),
(61, '362,275', 7, 0),
(71, '271, 208', 8, 0),
(81, '386,256', 9, 0),
(91, '208, 334', 10, 0),
(111, '231,206', 12, 0),
(121, '240, 265', 13, 0),
(131, '236,158', 14, 0),
(141, '344, 194', 15, 0),
(151, '262,153', 16, 0),
(161, '532,371', 21, 0),
(171, '553,386', 22, 0),
(181, '612,346', 23, 0),
(191, '650,355', 24, 0),
(201, '813,302', 25, 0),
(211, '672,275', 26, 0),
(221, '817,445', 28, 0),
(231, '877,348', 31, 0),
(241, '977,361', 32, 0),
(251, '983, 335', 33, 0),
(261, '1050,329', 34, 0),
(271, '834,198', 35, 0),
(281, '948,222', 36, 0),
(291, '996,232', 37, 0),
(301, '1057,312', 38, 0),
(311, '1103, 460', 39, 0),
(321, '631,213', 41, 0),
(331, '678,191', 42, 0),
(341, '587,275', 43, 0),
(351, '434,323', 43, 0),
(361, '389,402', 44, 0),
(371, '314,344', 45, 0),
(381, '860,271', 46, 0),
(391, '293,275', 20, 0),
(392, '430, 230', 47, 0);

INSERT INTO `tracks` (`id`, `name`, `connected_tracks`, `season`, `status`, `length`, `difficulty`, `lifts`, `zone`, `panorama_position`, `is_deleted`, `map_name`, `hidden`) VALUES
(1, 'Danskeløypa', '[1,3]', 2, 2, 1500, 2, '[20]', 1, NULL, 1, NULL, NULL),
(3, 'Pomaløypa', '[]', 2, 1, 1200, 2, '[20,4,14,15]', 1, NULL, 0, '2', NULL),
(4, 'Midtløypa', '[]', 2, 1, 1400, 2, '[]', 1, NULL, 0, '4', NULL),
(5, 'Utforløypa', '[6]', 2, 1, 1600, 3, '[18]', 1, '', 0, '5', NULL),
(6, 'Solheisløypa', '[]', 2, 1, 1500, 1, '[18]', 1, '', 0, '6', NULL),
(7, 'Slettbakken', NULL, NULL, 1, 1700, 1, '[18]', 1, '', 0, '7', NULL),
(8, 'Henget', '[]', NULL, 1, 700, 4, '[]', 1, '', 0, '8', NULL),
(9, 'Solsvingen', NULL, NULL, 2, 2900, 1, NULL, 1, '', 1, '7', NULL),
(10, 'Barneland', '[]', 2, 1, 500, 1, '[]', 1, '', 0, '3', NULL),
(11, 'Tverrløypa', NULL, NULL, 2, 1500, 1, NULL, 1, '', 1, NULL, NULL),
(12, 'Vesthenget', NULL, NULL, 2, 700, 4, NULL, 1, '', 1, NULL, NULL),
(13, 'Lysløypa', '[]', 2, 2, 500, 2, '[]', 1, '', 1, NULL, NULL),
(14, 'Vesttoppen', NULL, NULL, 2, 400, 6, NULL, 1, '', 1, NULL, NULL),
(15, 'Solsvingen', '[]', NULL, 1, 2100, 2, '[]', 1, '', 0, '9', NULL),
(16, 'Toppløypa', NULL, NULL, 2, 400, 3, NULL, 1, '', 0, '11', NULL),
(17, 'Håkerløypa', '[]', NULL, 2, 1500, 2, '[20]', 1, '', 0, '1', NULL),
(20, 'Park', '[5]', 2, 1, 1500, 7, '[18]', 1, '', 0, '10', NULL),
(21, 'Bjørndalsløypa', NULL, NULL, 2, 1900, 4, NULL, 3, '', 0, '21', NULL),
(22, 'Høgerhenget', NULL, NULL, 2, 600, 4, NULL, 3, '', 0, '22', NULL),
(23, 'Bjerkeløypa', NULL, NULL, 2, 1900, 6, NULL, 3, '', 0, '23', NULL),
(24, 'Storstugguløypa', NULL, NULL, 2, 1500, 6, NULL, 3, '', 0, '24', NULL),
(25, 'Bualøypa', NULL, NULL, 2, 2600, 2, NULL, 11, '', 0, '25', NULL),
(26, 'Baksida', NULL, NULL, 2, 1500, 2, NULL, 3, '', 0, '26', NULL),
(28, 'Slettvoldløypa', NULL, NULL, 2, 600, 3, NULL, 3, '', 0, '28', NULL),
(31, 'Håmmårløypa', NULL, NULL, 2, 3100, 2, NULL, 11, '', 0, '31', NULL),
(32, 'Jonasløypa', NULL, NULL, 2, 1300, 2, NULL, 4, '', 0, '32', NULL),
(33, 'World cup løypa', '[]', NULL, 2, 1100, 3, '[]', 4, '', 0, '33', NULL),
(34, 'Ekkerenget', NULL, NULL, 2, 1500, 3, NULL, 4, '', 0, '34', NULL),
(35, 'Ormhaugen', NULL, NULL, 2, 2600, 1, NULL, 11, '', 0, '35', NULL),
(36, 'Parallellen', NULL, NULL, 2, 1800, 2, NULL, 4, '', 0, '36', NULL),
(37, 'Storsleppet', NULL, NULL, 2, 1800, 1, NULL, 4, '', 1, NULL, NULL),
(38, 'Skogsløypa', NULL, NULL, 2, 500, 6, NULL, 4, '', 1, NULL, NULL),
(39, 'Trolland', '[]', NULL, 2, 300, 1, '[]', 4, '', 0, '39', NULL),
(41, 'Presten', NULL, NULL, 2, 1200, 3, NULL, 2, '', 0, '41', NULL),
(42, 'Ådalsløypa', NULL, NULL, 2, 2300, 2, NULL, 2, '', 0, '42', NULL),
(43, 'Transporten', NULL, NULL, 2, 2000, 1, NULL, 11, '', 0, '43', NULL),
(44, 'Hovdensvingen', NULL, NULL, 2, 2200, 1, NULL, 11, '', 0, '44', NULL),
(45, 'Elvekanten', NULL, NULL, 2, 900, 2, NULL, 11, '', 0, '45', NULL),
(46, 'Gråbergløypa', NULL, NULL, 2, 1600, 1, NULL, 2, '', 0, '46', NULL),
(47, 'Fjellsida', NULL, NULL, 2, NULL, 2, NULL, 11, NULL, 0, '15', NULL),
(49, 'Vangslia - Ådalen', NULL, NULL, 2, NULL, 1, NULL, 11, '[0,24]', 0, NULL, 1),
(50, 'Vangslia - Hovden', NULL, NULL, 2, NULL, 1, NULL, 11, '[0,25]', 0, NULL, 1),
(51, 'Vangslia - Stølen', NULL, NULL, 2, NULL, 1, NULL, 11, '[0,26]', 0, NULL, 1),
(52, 'Hovden - Vangslia', NULL, NULL, 2, NULL, 1, NULL, 11, '[0,28]', 0, NULL, 1),
(53, 'Hovden - Stølen', NULL, NULL, 2, NULL, 1, NULL, 11, '[0,29]', 0, NULL, 1),
(54, 'Hovden - Ådalen', NULL, NULL, 2, NULL, 1, NULL, 11, '[0,30]', 0, NULL, 1),
(55, 'Stølen - Hovden', NULL, NULL, 2, NULL, 1, NULL, 11, '[0,32]', 0, NULL, 1),
(56, 'Stølen - Ådalen', NULL, NULL, 2, NULL, 1, NULL, 11, '[0,33]', 0, NULL, 1),
(57, 'Stølen - Vangslia', NULL, NULL, 2, NULL, 1, NULL, 11, '[0,34]', 0, NULL, 1),
(58, 'Ådalen - Vangslia', NULL, NULL, 2, NULL, 1, NULL, 11, '[0,36]', 0, NULL, 1),
(59, 'Ådalen - Hovden', NULL, NULL, 2, NULL, 1, NULL, 11, '[0,37]', 0, NULL, 1),
(60, 'Ådalen - Stølen', NULL, NULL, 2, NULL, 1, NULL, 11, '[0,38]', 0, NULL, 1);

INSERT INTO `user_roles` (`id`, `type`) VALUES
(1, 'admin');

INSERT INTO `users` (`id`, `username`, `password`, `role`, `is_deleted`) VALUES
(1, 'admin', '$2b$10$7c/YHI//E9bas8h8gIN3/O7BmdBZ5wEpwFycMp0BT4sNH/gsMZnGS', 1, 0),
(2, 'admin2', '$2a$10$ruD1UD8jGgY1.m03VdhElurcWI9VR6ALuxwcEcXTrlbxm8uGXgoBq', 1, 0),
(3, 'oppski', '$2a$10$n6WG3vy9vEfd2zcuAyykj.YooqBt8lnuvNqhp1ub3poJJzA6t7qY6', 1, 0);

INSERT INTO `weather_station` (`id`, `label`, `url`, `is_deleted`) VALUES
(1, 'All', 'http://api.holfuy.com/live/?s=all&pw={PASSWORD}&m=JSON&tu=C&su=m/s&daily', 0);

INSERT INTO `weather_station_zone` (`station_id`, `zone_id`, `is_deleted`) VALUES
(796, 1, 0),
(1346, 1, 0),
(1377, 4, 0);

INSERT INTO `zones` (`id`, `name`, `is_deleted`) VALUES
(1, 'Vangslia', 0),
(2, 'Ådalen', 0),
(3, 'Hovden', 0),
(4, 'Stølen', 0),
(11, 'Transport', 0);



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
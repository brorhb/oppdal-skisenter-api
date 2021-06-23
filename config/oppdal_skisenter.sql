-- -------------------------------------------------------------
-- TablePlus 4.0.0(370)
--
-- https://tableplus.com/
--
-- Database: oppdal_skisenter
-- Generation Time: 2021-06-15 16:35:44.5480
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `avalanche_levels`;
CREATE TABLE `avalanche_levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `avalanche_log`;
CREATE TABLE `avalanche_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `level` int(11) NOT NULL DEFAULT '1',
  `timestamp` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `level` (`level`),
  CONSTRAINT `avalanche_log_ibfk_1` FOREIGN KEY (`level`) REFERENCES `avalanche_levels` (`id`),
  CONSTRAINT `avalanche_log_ibfk_2` FOREIGN KEY (`level`) REFERENCES `avalanche_levels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `camera`;
CREATE TABLE `camera` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT 'utf8mb4_0900_ai_ci',
  `url` varchar(255) DEFAULT 'utf8mb4_0900_ai_ci',
  `zone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `zone` (`zone`),
  CONSTRAINT `camera_ibfk_1` FOREIGN KEY (`zone`) REFERENCES `zones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `difficulty`;
CREATE TABLE `difficulty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `facilities`;
CREATE TABLE `facilities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` int(11) NOT NULL,
  `status` int(11) DEFAULT '2',
  `zone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `type` (`type`),
  KEY `status` (`status`),
  CONSTRAINT `facilities_ibfk_1` FOREIGN KEY (`type`) REFERENCES `facilities_types` (`id`),
  CONSTRAINT `facilities_ibfk_2` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `facilities_types`;
CREATE TABLE `facilities_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `feature_types`;
CREATE TABLE `feature_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `features`;
CREATE TABLE `features` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` float DEFAULT NULL,
  `track` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `difficulty` int(11) NOT NULL,
  `status` int(11) DEFAULT '2',
  PRIMARY KEY (`id`),
  KEY `track_id` (`track`),
  KEY `type_id` (`type`),
  KEY `difficulty` (`difficulty`),
  KEY `status` (`status`),
  CONSTRAINT `features_ibfk_1` FOREIGN KEY (`track`) REFERENCES `tracks` (`id`),
  CONSTRAINT `features_ibfk_2` FOREIGN KEY (`type`) REFERENCES `feature_types` (`id`),
  CONSTRAINT `features_ibfk_3` FOREIGN KEY (`difficulty`) REFERENCES `difficulty` (`id`),
  CONSTRAINT `features_ibfk_4` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `lift_coord_in_map`;
CREATE TABLE `lift_coord_in_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coord` varchar(255) NOT NULL,
  `lift` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lift` (`lift`),
  CONSTRAINT `lift_coord_in_map_ibfk_1` FOREIGN KEY (`lift`) REFERENCES `lifts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=202 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `lift_type`;
CREATE TABLE `lift_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `lifts`;
CREATE TABLE `lifts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` int(11) DEFAULT '2',
  `start_position` float DEFAULT NULL,
  `end_position` float DEFAULT NULL,
  `elevation` int(11) DEFAULT NULL,
  `length` int(11) DEFAULT NULL,
  `type` int(11) NOT NULL,
  `map_name` varchar(255) NOT NULL,
  `zone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `status` (`status`),
  CONSTRAINT `lifts_ibfk_1` FOREIGN KEY (`type`) REFERENCES `lift_type` (`id`),
  CONSTRAINT `lifts_ibfk_2` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `status_types`;
CREATE TABLE `status_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `track_coord_in_map`;
CREATE TABLE `track_coord_in_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coord` varchar(255) NOT NULL,
  `track` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `track` (`track`),
  CONSTRAINT `track_coord_in_map_ibfk_1` FOREIGN KEY (`track`) REFERENCES `tracks` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=392 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `tracks`;
CREATE TABLE `tracks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `connected_tracks` varchar(255) DEFAULT NULL,
  `season` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT '2',
  `length` int(11) DEFAULT NULL,
  `difficulty` int(11) NOT NULL,
  `lifts` varchar(255) DEFAULT NULL,
  `zone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `difficulty` (`difficulty`),
  KEY `status` (`status`),
  KEY `zone` (`zone`),
  CONSTRAINT `tracks_ibfk_1` FOREIGN KEY (`difficulty`) REFERENCES `difficulty` (`id`),
  CONSTRAINT `tracks_ibfk_2` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`),
  CONSTRAINT `tracks_ibfk_3` FOREIGN KEY (`zone`) REFERENCES `zones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `weather_station`;
CREATE TABLE `weather_station` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `weather_station_zone`;
CREATE TABLE `weather_station_zone` (
  `station_id` int(11) NOT NULL DEFAULT '0',
  `zone_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`station_id`),
  KEY `zone_id` (`zone_id`),
  CONSTRAINT `weather_station_zone_ibfk_1` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `zones`;
CREATE TABLE `zones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `important_message`;
CREATE TABLE `important_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` varchar(255) NOT NULL,
  `is_live` boolean,
  `timestamp` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `avalanche_levels` (`id`, `value`) VALUES
(1, 'none'),
(2, 'low'),
(3, 'medium'),
(4, 'high');

INSERT INTO `avalanche_log` (`id`, `level`, `timestamp`) VALUES
(1, 1, '2020-12-03');

INSERT INTO `camera` (`id`, `name`, `url`, `zone`) VALUES
(1, 'Vangslia', 'https://player.twitch.tv/?channel=oppdal_skisenter&parent=${PARENT}&autoplay=true', 1),
(2, 'Stølen', 'https://player.twitch.tv/?channel=rockoss_oppdal&parent=${PARENT}&autoplay=true', 4);

INSERT INTO `difficulty` (`id`, `label`) VALUES
(1, 'beginner'),
(2, 'intermediate'),
(3, 'advanced'),
(4, 'expert'),
(5, 'professional'),
(6, 'not rated'),
(7, 'terrainpark');

INSERT INTO `facilities_types` (`id`, `name`) VALUES
(1, 'toilet'),
(2, 'cafe'),
(3, 'workshop'),
(4, 'rental'),
(5, 'shop');

INSERT INTO `feature_types` (`id`, `name`) VALUES
(1, 'jump'),
(2, 'rollers'),
(3, 'big jump'),
(4, 'air bag'),
(5, 'ral'),
(6, 'box');

INSERT INTO `lift_coord_in_map` (`id`, `coord`, `lift`) VALUES
(1, '207, 405', 18),
(41, '3,371', 20),
(61, '251,177', 13),
(71, '163, 370', 14),
(81, '174,361', 15),
(91, '181, 378', 16),
(101, '193,371', 17),
(111, '631,260', 19),
(121, '648,266', 21),
(131, '520,548', 22),
(141, '535,562', 23),
(151, '625,320', 24),
(161, '841,519', 25),
(171, '1105, 483', 26),
(181, '1096, 453', 27),
(191, '1096, 436', 28),
(201, '1028, 298', 29);

INSERT INTO `lift_type` (`id`, `type`) VALUES
(1, 'ufo'),
(2, 'flying carpet'),
(3, 't-hook'),
(4, 'chairlift');

INSERT INTO `lifts` (`id`, `name`, `status`, `start_position`, `end_position`, `elevation`, `length`, `type`, `map_name`, `zone`) VALUES
(13, 'Toppheisen', 2, NULL, NULL, 90, 360, 3, 'b', 1),
(14, 'Vangsheisen 1', 1, NULL, NULL, 481, 1614, 3, 'c', 1),
(15, 'Vangsheisen 2', 1, NULL, NULL, 493, 1688, 3, 'd', 1),
(16, 'Barneheisen', 1, NULL, NULL, 108, 500, 1, 'e', 1),
(17, 'Båndheis for barn', 1, NULL, NULL, NULL, NULL, 2, 'f', 1),
(18, 'Vangsliaekspressen', 1, NULL, NULL, 309, 1382, 4, 'g', 1),
(19, 'Ådalsheisen', 2, NULL, NULL, 315, 1154, 3, 'h', 2),
(20, 'Håkerxpressen', 1, NULL, NULL, 340, 1340, 4, 'i', 1),
(21, 'Tverrheisen', 2, NULL, NULL, 129, 1041, 3, 'j', 2),
(22, 'Hovedenekspressen', 1, NULL, NULL, 534, 1716, 4, 'k', 3),
(23, 'Hovdenheisen', 2, NULL, NULL, 447, 1547, 3, 'l', 3),
(24, 'Toppheisen', 2, NULL, NULL, 95, 273, 1, 'm', 3),
(25, 'Sletvoldheisen', 2, NULL, NULL, 123, 460, 1, 'o', 3),
(26, 'Barneheis', 1, NULL, NULL, 40, 200, 1, 'p', 4),
(27, 'Stølen 1', 1, NULL, NULL, 341, 1343, 3, 'r', 4),
(28, 'Stølen 3', 1, NULL, NULL, 299, 1089, 3, 's', 4),
(29, 'Fjellheisen', 2, NULL, NULL, 353, 1618, 3, 't', 4);

INSERT INTO `status_types` (`id`, `name`) VALUES
(1, 'open'),
(2, 'closed'),
(3, 'maintanence');

INSERT INTO `track_coord_in_map` (`id`, `coord`, `track`) VALUES
(1, '168, 272', 1),
(11, '122, 279', 17),
(21, '173, 326', 3),
(31, '252, 307', 5),
(41, '225, 332', 4),
(51, '310, 293', 6),
(61, '362,275', 7),
(71, '271, 208', 8),
(81, '386,256', 9),
(91, '208, 334', 10),
(111, '231,206', 12),
(121, '240, 265', 13),
(131, '236,158', 14),
(141, '344, 194', 15),
(151, '262,153', 16),
(161, '532,371', 21),
(171, '553,386', 22),
(181, '612,346', 23),
(191, '650,355', 24),
(201, '813,302', 25),
(211, '672,275', 26),
(221, '817,445', 28),
(231, '877,348', 31),
(241, '977,361', 32),
(251, '983, 335', 33),
(261, '1050,329', 34),
(271, '834,198', 35),
(281, '948,222', 36),
(291, '996,232', 37),
(301, '1057,312', 38),
(311, '1103, 460', 39),
(321, '631,213', 41),
(331, '678,191', 42),
(341, '587,275', 43),
(351, '434,323', 43),
(361, '389,402', 44),
(371, '314,344', 45),
(381, '860,271', 46),
(391, '293,275', 20);

INSERT INTO `tracks` (`id`, `name`, `connected_tracks`, `season`, `status`, `length`, `difficulty`, `lifts`, `zone`) VALUES
(1, 'Danskeløypa', '[1,3]', 2, 2, 1500, 2, '[20]', 1),
(3, 'Pomaløypa', '[]', 2, 2, 1200, 2, '[20,4,14,15]', 1),
(4, 'Midtløypa', '[]', 2, 2, 1400, 2, '[]', 1),
(5, 'Utforløypa', '[6]', 2, 2, 1600, 3, '[18]', 1),
(6, 'Solheisløypa', '[]', 2, 2, 1500, 1, '[18]', 1),
(7, 'Minipark', NULL, NULL, 2, 1700, 7, '[18]', 1),
(8, 'Henget', '[]', NULL, 2, 700, 4, '[]', 1),
(9, 'Solsvingen', NULL, NULL, 2, 2900, 1, NULL, 1),
(10, 'Barneland', '[]', 2, 2, 500, 1, '[]', 1),
(11, 'Tverrløypa', NULL, NULL, 2, 1500, 1, NULL, 1),
(12, 'Vesthenget', NULL, NULL, 2, 700, 4, NULL, 1),
(13, 'Lysløypa', '[]', 2, 2, 500, 2, '[]', 1),
(14, 'Vesttoppen', NULL, NULL, 2, 400, 6, NULL, 1),
(15, 'Fjellsida', '[]', NULL, 2, 2100, 2, '[]', 11),
(16, 'Toppløypa', NULL, NULL, 2, 400, 3, NULL, 1),
(17, 'Håkerløypa', '[]', NULL, 2, 1500, 2, '[20]', 1),
(20, 'Park', '[5]', 2, 2, 1500, 7, '[18]', 1),
(21, 'Bjørndalsløypa', NULL, NULL, 2, 1900, 4, NULL, 3),
(22, 'Høgerhenget', NULL, NULL, 2, 600, 4, NULL, 3),
(23, 'Bjerkeløypa', NULL, NULL, 2, 1900, 6, NULL, 3),
(24, 'Storstugguløypa', NULL, NULL, 2, 1500, 6, NULL, 3),
(25, 'Bualøypa', NULL, NULL, 2, 2600, 2, NULL, 11),
(26, 'Baksida', NULL, NULL, 2, 1500, 2, NULL, 3),
(28, 'Slettvoldløypa', NULL, NULL, 2, 600, 3, NULL, 3),
(31, 'Håmmårløypa', NULL, NULL, 2, 3100, 2, NULL, 11),
(32, 'Jonasløypa', NULL, NULL, 2, 1300, 2, NULL, 4),
(33, 'World cup løypa', '[]', NULL, 2, 1100, 3, '[]', 4),
(34, 'Ekkerenget', NULL, NULL, 2, 1500, 3, NULL, 4),
(35, 'Ormhaugen', NULL, NULL, 2, 2600, 1, NULL, 11),
(36, 'Parallellen', NULL, NULL, 2, 1800, 2, NULL, 4),
(37, 'Storsleppet', NULL, NULL, 2, 1800, 1, NULL, 4),
(38, 'Skogsløypa', NULL, NULL, 2, 500, 6, NULL, 4),
(39, 'Trolland', '[]', NULL, 2, 300, 1, '[]', 4),
(41, 'Presten', NULL, NULL, 2, 1200, 3, NULL, 2),
(42, 'Ådalsløypa', NULL, NULL, 2, 2300, 2, NULL, 2),
(43, 'Transporten', NULL, NULL, 2, 2000, 1, NULL, 11),
(44, 'Hovdensvingen', NULL, NULL, 2, 2200, 1, NULL, 11),
(45, 'Elvekanten', NULL, NULL, 2, 900, 2, NULL, 11),
(46, 'Gråbergløypa', NULL, NULL, 2, 1600, 1, NULL, NULL);

INSERT INTO `user_roles` (`id`, `type`) VALUES
(1, 'admin');

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'admin', '$2b$10$7c/YHI//E9bas8h8gIN3/O7BmdBZ5wEpwFycMp0BT4sNH/gsMZnGS', 1),
(2, 'admin2', '$2a$10$ruD1UD8jGgY1.m03VdhElurcWI9VR6ALuxwcEcXTrlbxm8uGXgoBq', 1);

INSERT INTO `weather_station` (`id`, `label`, `url`) VALUES
(1, 'All', 'http://api.holfuy.com/live/?s=all&pw={PASSWORD}&m=JSON&tu=C&su=m/s&daily');

INSERT INTO `weather_station_zone` (`station_id`, `zone_id`) VALUES
(796, 1),
(1346, 1),
(1377, 4);

INSERT INTO `zones` (`id`, `name`) VALUES
(1, 'Vangslia'),
(2, 'Ådalen'),
(3, 'Hovden'),
(4, 'Stølen'),
(11, 'Transport');

INSERT INTO `important_message`(`id`, `message`, `is_live`, `timestamp`) VALUES 
(1, 'Vanglisa stengt grunnet vind.', true, '2020-12-03'),
(2, 'Hovden stegnt grunnet vind', true, '2021-12-03');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
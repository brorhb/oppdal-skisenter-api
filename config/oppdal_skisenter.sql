-- -------------------------------------------------------------
-- TablePlus 4.0.2(374)
--
-- https://tableplus.com/
--
-- Database: heroku_a02421771039358
-- Generation Time: 2021-08-04 13:45:17.3220
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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` varchar(255) NOT NULL,
  `is_live` tinyint(1) DEFAULT NULL,
  `timestamp` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

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
  `panorama_position` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `type` (`type`),
  KEY `status` (`status`),
  CONSTRAINT `facilities_ibfk_1` FOREIGN KEY (`type`) REFERENCES `facilities_types` (`id`),
  CONSTRAINT `facilities_ibfk_2` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `facilities_types`;
CREATE TABLE `facilities_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

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
  `panorama_position` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `status` (`status`),
  CONSTRAINT `lifts_ibfk_1` FOREIGN KEY (`type`) REFERENCES `lift_type` (`id`),
  CONSTRAINT `lifts_ibfk_2` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `snow_conditions`;
CREATE TABLE `snow_conditions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` varchar(255) NOT NULL,
  `is_live` tinyint(1) DEFAULT NULL,
  `timestamp` date DEFAULT NULL,
  `zone_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `zone_id` (`zone_id`),
  CONSTRAINT `zone_ibfk_1` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;

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
  `panorama_position` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `difficulty` (`difficulty`),
  KEY `status` (`status`),
  KEY `zone` (`zone`),
  CONSTRAINT `tracks_ibfk_1` FOREIGN KEY (`difficulty`) REFERENCES `difficulty` (`id`),
  CONSTRAINT `tracks_ibfk_2` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`),
  CONSTRAINT `tracks_ibfk_3` FOREIGN KEY (`zone`) REFERENCES `zones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

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

INSERT INTO `alert` (`id`, `message`, `is_live`, `timestamp`) VALUES
(1, 'Vangslia stengt grunnet vind.', 0, '2021-06-09'),
(2, 'Hovden stengt grunnet vind', 1, '2021-07-04'),
(11, 'Håkerexpressen er stengt grunnet vind', 0, '2021-07-04'),
(21, 'En ny melding', 0, '2021-06-09'),
(31, 'Veldig nice', 0, '2021-07-03');

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

INSERT INTO `facilities` (`id`, `name`, `type`, `status`, `zone`, `panorama_position`) VALUES
(1, 'Vangslia Kro', 2, 1, NULL, NULL),
(11, 'Topp resturanten', 2, 1, NULL, NULL),
(21, 'Rockoss', 2, 1, NULL, NULL),
(31, 'Gråberget', 2, 1, NULL, NULL),
(41, 'Carving cafe', 2, 1, NULL, NULL),
(71, 'Aurhøa', 6, 1, NULL, NULL),
(81, 'Ådalen', 6, 1, NULL, NULL),
(91, 'Vangslia - Skiutleie', 4, 1, NULL, NULL),
(101, 'Hovden - Skiutleie', 4, 1, NULL, NULL),
(111, 'Stølen - Skiutleie', 4, 1, NULL, NULL),
(121, 'Loftet afterski', 7, 1, NULL, NULL),
(131, 'Låven afterski', 7, 1, NULL, NULL),
(141, 'Rockoss', 7, 1, NULL, NULL);

INSERT INTO `facilities_types` (`id`, `name`) VALUES
(1, 'toilet'),
(2, 'cafe'),
(3, 'workshop'),
(4, 'rental'),
(5, 'shop'),
(6, 'warming'),
(7, 'afterski');

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

INSERT INTO `lifts` (`id`, `name`, `status`, `start_position`, `end_position`, `elevation`, `length`, `type`, `map_name`, `zone`, `panorama_position`) VALUES
(13, 'Toppheisen', 2, NULL, NULL, 90, 360, 3, 'b', 1, '[0,1]'),
(14, 'Vangsheisen 1', 2, NULL, NULL, 481, 1614, 3, 'c', 1, '[0,2]'),
(15, 'Vangsheisen 2', 2, NULL, NULL, 493, 1688, 3, 'd', 1, '[0,3]'),
(16, 'Barneheisen', 2, NULL, NULL, 108, 500, 1, 'e', 1, '[0,4]'),
(17, 'Båndheis for barn', 2, NULL, NULL, NULL, NULL, 2, 'f', 1, '[0,5]'),
(18, 'Vangsliaekspressen', 2, NULL, NULL, 309, 1382, 4, 'g', 1, '[0,6]'),
(19, 'Ådalsheisen', 1, NULL, NULL, 315, 1154, 3, 'h', 2, '[0,7]'),
(20, 'Håkerxpressen', 2, NULL, NULL, 340, 1340, 4, 'i', 1, '[0,8]'),
(21, 'Tverrheisen', 2, NULL, NULL, 129, 1041, 3, 'j', 2, '[0,9]'),
(22, 'Hovedenekspressen', 2, NULL, NULL, 534, 1716, 4, 'k', 3, '[0,10]'),
(23, 'Hovdenheisen', 2, NULL, NULL, 447, 1547, 3, 'l', 3, '[0,11]'),
(24, 'Toppheisen', 2, NULL, NULL, 95, 273, 1, 'm', 3, '[0,12]'),
(25, 'Sletvoldheisen', 2, NULL, NULL, 123, 460, 1, 'o', 3, '[0,13]'),
(26, 'Barneheis', 1, NULL, NULL, 40, 200, 1, 'p', 4, '[0,14]'),
(27, 'Stølen 1', 1, NULL, NULL, 341, 1343, 3, 'r', 4, '[0,15]'),
(28, 'Stølen 3', 1, NULL, NULL, 299, 1089, 3, 's', 4, '[0,16]'),
(29, 'Fjellheisen', 1, NULL, NULL, 353, 1618, 3, 't', 4, '[0,17]'),
(30, 'Ny heis', 2, NULL, NULL, 500, 2000, 4, '', 3, NULL);

INSERT INTO `snow_conditions` (`id`, `message`, `is_live`, `timestamp`, `zone_id`) VALUES
(1, 'Nysnø gjør at det er svært gode forhold i Stølen i dag!', 1, '2020-12-03', 4),
(2, 'Svært gode forhold i Vangslia i dag.', 1, '2020-12-03', 1),
(3, 'Svært gode forhold i Hovden i dag.', 0, '2020-12-03', 3),
(11, 'Test', 0, '2021-06-09', 1),
(21, 'Gode forhold i løypene i dag. ', 0, '2021-07-03', 1),
(31, 'Veldig nice', 0, '2021-07-03', 1),
(41, 'Test', 0, '2021-07-04', 11);

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

INSERT INTO `tracks` (`id`, `name`, `connected_tracks`, `season`, `status`, `length`, `difficulty`, `lifts`, `zone`, `panorama_position`) VALUES
(1, 'Danskeløypa', '[1,3]', 2, 2, 1500, 2, '[20]', 1, '[1,0]'),
(3, 'Pomaløypa', '[]', 2, 2, 1200, 2, '[20,4,14,15]', 1, '[1,1]'),
(4, 'Midtløypa', '[]', 2, 2, 1400, 2, '[]', 1, '[1,2]'),
(5, 'Utforløypa', '[6]', 2, 2, 1600, 3, '[18]', 1, '[1,3]'),
(6, 'Solheisløypa', '[]', 2, 2, 1500, 1, '[18]', 1, '[1,4]'),
(7, 'Minipark', NULL, NULL, 2, 1700, 7, '[18]', 1, '[1,5]'),
(8, 'Henget', '[]', NULL, 2, 700, 4, '[]', 1, '[1,6]'),
(9, 'Solsvingen', NULL, NULL, 2, 2900, 1, NULL, 1, '[1,7]'),
(10, 'Barneland', '[]', 2, 2, 500, 1, '[]', 1, '[1,8]'),
(11, 'Tverrløypa', NULL, NULL, 2, 1500, 1, NULL, 1, '[1,9]'),
(12, 'Vesthenget', NULL, NULL, 2, 700, 4, NULL, 1, '[1,10]'),
(13, 'Lysløypa', '[]', 2, 2, 500, 2, '[]', 1, '[1,11]'),
(14, 'Vesttoppen', NULL, NULL, 2, 400, 6, NULL, 1, '[1,12]'),
(15, 'Fjellsida', '[]', NULL, 1, 2100, 2, '[]', 11, '[1,13]'),
(16, 'Toppløypa', NULL, NULL, 2, 400, 3, NULL, 1, '[1,14]'),
(17, 'Håkerløypa', '[]', NULL, 2, 1500, 2, '[20]', 1, '[1,15]'),
(20, 'Park', '[5]', 2, 2, 1500, 7, '[18]', 1, '[1,16]'),
(21, 'Bjørndalsløypa', NULL, NULL, 1, 1900, 4, NULL, 3, '[1,17]'),
(22, 'Høgerhenget', NULL, NULL, 1, 600, 4, NULL, 3, '[1,18]'),
(23, 'Bjerkeløypa', NULL, NULL, 1, 1900, 6, NULL, 3, '[1,19]'),
(24, 'Storstugguløypa', NULL, NULL, 1, 1500, 6, NULL, 3, '[1,20]'),
(25, 'Bualøypa', NULL, NULL, 1, 2600, 2, NULL, 11, '[1,21]'),
(26, 'Baksida', NULL, NULL, 1, 1500, 2, NULL, 3, '[1,22]'),
(28, 'Slettvoldløypa', NULL, NULL, 1, 600, 3, NULL, 3, '[1,23]'),
(31, 'Håmmårløypa', NULL, NULL, 1, 3100, 2, NULL, 11, '[1,24]'),
(32, 'Jonasløypa', NULL, NULL, 1, 1300, 2, NULL, 4, '[1,25]'),
(33, 'World cup løypa', '[]', NULL, 1, 1100, 3, '[]', 4, '[1,26]'),
(34, 'Ekkerenget', NULL, NULL, 1, 1500, 3, NULL, 4, '[1,27]'),
(35, 'Ormhaugen', NULL, NULL, 1, 2600, 1, NULL, 11, '[1,28]'),
(36, 'Parallellen', NULL, NULL, 1, 1800, 2, NULL, 4, '[1,29]'),
(37, 'Storsleppet', NULL, NULL, 1, 1800, 1, NULL, 4, '[1,30]'),
(38, 'Skogsløypa', NULL, NULL, 1, 500, 6, NULL, 4, '[1,31]'),
(39, 'Trolland', '[]', NULL, 1, 300, 1, '[]', 4, '[1,32]'),
(41, 'Presten', NULL, NULL, 1, 1200, 3, NULL, 2, '[1,33]'),
(42, 'Ådalsløypa', NULL, NULL, 1, 2300, 2, NULL, 2, '[1,34]'),
(43, 'Transporten', NULL, NULL, 1, 2000, 1, NULL, 11, '[1,35]'),
(44, 'Hovdensvingen', NULL, NULL, 1, 2200, 1, NULL, 11, '[1,36]'),
(45, 'Elvekanten', NULL, NULL, 1, 900, 2, NULL, 11, '[1,37]'),
(46, 'Gråbergløypa', NULL, NULL, 1, 1600, 1, NULL, NULL, '[1,38]'),
(47, 'Ny nedfart', '[4,5]', 2, 2, 4, 4, '[18]', 1, '[1,39]');

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



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
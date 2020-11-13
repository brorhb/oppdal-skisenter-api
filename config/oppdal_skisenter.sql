-- -------------------------------------------------------------
-- TablePlus 3.10.0(348)
--
-- https://tableplus.com/
--
-- Database: oppdal_skisenter
-- Generation Time: 2020-11-13 23:12:18.3020
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `difficulty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `facilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` int NOT NULL,
  `status` int DEFAULT 2,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `type` (`type`),
  KEY `status` (`status`),
  CONSTRAINT `facilities_ibfk_1` FOREIGN KEY (`type`) REFERENCES `facilities_types` (`id`),
  CONSTRAINT `facilities_ibfk_2` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `facilities_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feature_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `features` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` json DEFAULT NULL,
  `track` int NOT NULL,
  `type` int NOT NULL,
  `difficulty` int NOT NULL,
  `status` int DEFAULT 2,
  PRIMARY KEY (`id`),
  KEY `track_id` (`track`),
  KEY `type_id` (`type`),
  KEY `difficulty` (`difficulty`),
  KEY `status` (`status`),
  CONSTRAINT `features_ibfk_1` FOREIGN KEY (`track`) REFERENCES `tracks` (`id`),
  CONSTRAINT `features_ibfk_2` FOREIGN KEY (`type`) REFERENCES `feature_types` (`id`),
  CONSTRAINT `features_ibfk_3` FOREIGN KEY (`difficulty`) REFERENCES `difficulty` (`id`),
  CONSTRAINT `features_ibfk_4` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lift_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lifts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` int DEFAULT 2,
  `start_position` json DEFAULT NULL,
  `end_position` json DEFAULT NULL,
  `elevation` int DEFAULT NULL,
  `length` int DEFAULT NULL,
  `type` int NOT NULL,
  `map_name` tinytext,
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `status` (`status`),
  CONSTRAINT `lifts_ibfk_1` FOREIGN KEY (`type`) REFERENCES `lift_type` (`id`),
  CONSTRAINT `lifts_ibfk_2` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `status_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tracks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `connected_tracks` blob,
  `season` int DEFAULT NULL,
  `status` int DEFAULT 2,
  `length` int DEFAULT NULL,
  `difficulty` int NOT NULL,
  `lifts` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `difficulty` (`difficulty`),
  KEY `status` (`status`),
  CONSTRAINT `tracks_ibfk_1` FOREIGN KEY (`difficulty`) REFERENCES `difficulty` (`id`),
  CONSTRAINT `tracks_ibfk_2` FOREIGN KEY (`status`) REFERENCES `status_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_roles` (
  `id` int NOT NULL,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `difficulty` (`id`, `label`) VALUES
('1', 'beginner'),
('2', 'intermediate'),
('3', 'advanced'),
('4', 'expert'),
('5', 'professional'),
('6', 'not rated'),
('7', 'terrainpark');

INSERT INTO `facilities` (`id`, `name`, `type`, `status`) VALUES
('1', 'Onkel pudder', '5', '1');

INSERT INTO `facilities_types` (`id`, `name`) VALUES
('1', 'toilet'),
('2', 'cafe'),
('3', 'workshop'),
('4', 'rental'),
('5', 'shop');

INSERT INTO `feature_types` (`id`, `name`) VALUES
('7', 'jump'),
('8', 'rollers'),
('9', 'big jump'),
('10', 'air bag'),
('11', 'ral'),
('12', 'box');

INSERT INTO `lift_type` (`id`, `type`) VALUES
('1', 'ufo'),
('2', 'flying carpet'),
('3', 't-hook'),
('4', 'chairlift');

INSERT INTO `lifts` (`id`, `name`, `status`, `start_position`, `end_position`, `elevation`, `length`, `type`, `map_name`) VALUES
('4', 'Pomaen', '2', NULL, NULL, '271', '1054', '1', 'a'),
('13', 'Toppheisen', '2', NULL, NULL, '90', '360', '3', 'b'),
('14', 'Vangsheisen 1', '2', NULL, NULL, '481', '1614', '3', 'c'),
('15', 'Vangsheisen 2', '2', NULL, NULL, '493', '1688', '3', 'd'),
('16', 'Barneheisen', '2', NULL, NULL, '108', '500', '1', 'e'),
('17', 'Båndheis for barn', '2', NULL, NULL, NULL, NULL, '2', 'f'),
('18', 'Solheisen', '2', NULL, NULL, '309', '1382', '4', 'g'),
('19', 'Ådalsheisen', '2', NULL, NULL, '315', '1154', '3', 'h'),
('20', 'Håkerxpressen', '2', NULL, NULL, '340', '1340', '4', 'i'),
('21', 'Tverrheisen', '2', NULL, NULL, '129', '1041', '3', 'j'),
('22', 'Hovedenekspressen', '2', NULL, NULL, '534', '1716', '4', 'k'),
('23', 'Hovdenheisen', '2', NULL, NULL, '447', '1547', '3', 'l'),
('24', 'Toppheisen', '2', NULL, NULL, '95', '273', '1', 'm'),
('25', 'Sletvoldheisen', '2', NULL, NULL, '123', '460', '1', 'o'),
('26', 'Barneheis', '2', NULL, NULL, '40', '200', '1', 'p'),
('27', 'Stølen 1', '2', NULL, NULL, '341', '1343', '3', 'r'),
('28', 'Stølen 3', '2', NULL, NULL, '299', '1089', '3', 's'),
('29', 'Fjellheisen', '2', NULL, NULL, '353', '1618', '3', 't');

INSERT INTO `status_types` (`id`, `name`) VALUES
('1', 'open'),
('2', 'closed'),
('3', 'maintanence');

INSERT INTO `tracks` (`id`, `name`, `connected_tracks`, `season`, `status`, `length`, `difficulty`, `lifts`) VALUES
('1', 'Danskeløype', NULL, NULL, '2', '1500', '2', NULL),
('2', 'Vestløypa', NULL, NULL, '2', '1200', '1', NULL),
('3', 'Pomaløypa', NULL, NULL, '2', '1200', '2', NULL),
('4', 'Midtløypa', NULL, NULL, '2', '1400', '2', NULL),
('5', 'Terrengparken', NULL, NULL, '2', '1600', '7', NULL),
('6', 'Solheisløypa', NULL, NULL, '2', '1500', '1', NULL),
('7', 'Slettbakken', NULL, NULL, '2', '1700', '1', NULL),
('8', 'Henge', NULL, NULL, '2', '700', '4', NULL),
('9', 'Solsvingen', NULL, NULL, '2', '2900', '1', NULL),
('10', 'Barneland', NULL, NULL, '2', '500', '1', NULL),
('11', 'Tverrløypa', NULL, NULL, '2', '1500', '1', NULL),
('12', 'Vesthenget', NULL, NULL, '2', '700', '4', NULL),
('13', 'Lysløypa', NULL, NULL, '2', '500', '2', NULL),
('14', 'Vesttoppen', NULL, NULL, '2', '400', '6', NULL),
('15', 'Fjellsida', NULL, NULL, '2', '2100', '2', NULL),
('16', 'Toppløypa', NULL, NULL, '2', '400', '3', NULL),
('17', 'Håkerløypa', NULL, NULL, '2', '1500', '2', NULL),
('21', 'Bjørndalsløypa', NULL, NULL, '2', '1900', '4', NULL),
('22', 'Høgerhenget', NULL, NULL, '2', '600', '4', NULL),
('23', 'Bjerkeløypa', NULL, NULL, '2', '1900', '6', NULL),
('24', 'Storstugguløypa', NULL, NULL, '2', '1500', '6', NULL),
('25', 'Bualøypa', NULL, NULL, '2', '2600', '2', NULL),
('26', 'Baksida', NULL, NULL, '2', '1500', '2', NULL),
('28', 'Slettvoldløypa', NULL, NULL, '2', '600', '3', NULL),
('31', 'Håmmårløypa', NULL, NULL, '2', '3100', '2', NULL),
('32', 'Jonasløypa', NULL, NULL, '2', '1300', '2', NULL),
('33', 'World cup løypa', NULL, NULL, '2', '1100', '3', NULL),
('34', 'Ekkerenget', NULL, NULL, '2', '1500', '3', NULL),
('35', 'Ormhaugen', NULL, NULL, '2', '2600', '1', NULL),
('36', 'Parallellen', NULL, NULL, '2', '1800', '2', NULL),
('37', 'Storsleppet', NULL, NULL, '2', '1800', '1', NULL),
('38', 'Skogsløypa', NULL, NULL, '2', '500', '6', NULL),
('39', 'Trolland', NULL, NULL, '2', '300', '1', NULL),
('41', 'Presten', NULL, NULL, '2', '1200', '3', NULL),
('42', 'Ådalsløypa', NULL, NULL, '2', '2300', '2', NULL),
('43', 'Transporten', NULL, NULL, '2', '2000', '1', NULL),
('44', 'Hovdensvingen', NULL, NULL, '2', '2200', '1', NULL),
('45', 'Elvekanten', NULL, NULL, '2', '900', '2', NULL),
('46', 'Gråbergløypa', NULL, NULL, '2', '1600', '1', NULL);

INSERT INTO `user_roles` (`id`, `type`) VALUES
('1', 'admin');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
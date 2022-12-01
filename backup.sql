CREATE DATABASE  IF NOT EXISTS `project_loukatos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `project_loukatos`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: project_loukatos
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `date_of_insertion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `product_code` varchar(50) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `date_of_withdrawal` datetime DEFAULT NULL,
  `seller_name` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `seller_name` (`seller_name`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`seller_name`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'PlayStation 4','PS4',299.99,NULL,'seller','Gaming'),(2,'iPad','P107',10000.00,NULL,'seller','Tablets'),(3,'Replay Jeans','MA931 .000.617 314',165.00,NULL,'seller','Clothing'),(4,'Samsung Galaxy Tab','SM-X700',529.99,NULL,'seller','Tablets'),(5,'DualShock 4','DS4',45.50,NULL,'seller','Gaming'),(6,'Levi\'s Jeans','# 845580100',99.00,NULL,'seller','Clothing'),(7,'Î§ÎµÎ¹ÏÎ¹ÏƒÏ„Î®ÏÎ¹Î¿ PS4 (Official)','DS4',9.99,NULL,'seller','Gaming'),(8,'Î ÎµÏÎ¹Ï€Ï„ÎµÏipad','P107',20.00,NULL,'seller','Tablets');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `salt` char(22) NOT NULL,
  `hash` binary(64) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('admin','product seller','user') DEFAULT 'user',
  `confirmed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Î£Ï€ÏÏÎ¿Ï‚','Î›Î¿Ï…ÎºÎ¬Ï„Î¿Ï‚','admin','QqjnpsFF-B0i-xzVq_sk0A',_binary '\Éö|\Ğ\ç\é\ÓJ&¸d„¦€Œğ\Ú«>¡OÁ%—Ì•u*Ch±ºexJ±Ğ¤„—Ï²\Úb\Îtf¨\Í{nIv”\åì™','admin@tuc.gr','admin',1),(2,'Î£Ï€ÏÏÎ¿Ï‚','Î›Î¿Ï…ÎºÎ¬Ï„Î¿Ï‚','seller','NHXEYvnfmnfRQ0BjudPd8w',_binary 'o%\ì\Îõ\ÄA´9\'$\Şj[™½DÖˆ$,G9È¯dCW^\r\ë\Ñh\Ê?\ãt)\â\'\Ôº@;<][…m—ueŒI\ço','seller@tuc.gr','product seller',1),(3,'Î£Ï€ÏÏÎ¿Ï‚','Î›Î¿Ï…ÎºÎ¬Ï„Î¿Ï‚','user','xTeykjCK_XWmqWClfFssgA',_binary 'ÿzTT\ë×‚‘\Òò\ÃfôyXø”P•\Ü\Äccl\êü3E§ÿ/\ÌÇ¿\Ö#\ê±\à²\éú–\Å5½vW@\×\"P3Öœ','user@tuc.gr','user',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-29  3:26:51

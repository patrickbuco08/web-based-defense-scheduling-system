-- -------------------------------------------------------------
-- TablePlus 6.8.2(656)
--
-- https://tableplus.com/
--
-- Database: defense_scheduling
-- Generation Time: 2026-03-08 12:47:32.2930
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE `activity_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `log_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject_id` bigint unsigned DEFAULT NULL,
  `event` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `causer_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `causer_id` bigint unsigned DEFAULT NULL,
  `properties` json DEFAULT NULL,
  `batch_uuid` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subject` (`subject_type`,`subject_id`),
  KEY `causer` (`causer_type`,`causer_id`),
  KEY `activity_log_log_name_index` (`log_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `defense_panelist`;
CREATE TABLE `defense_panelist` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `defense_id` bigint unsigned NOT NULL,
  `panelist_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `defense_panelist_defense_id_panelist_id_unique` (`defense_id`,`panelist_id`),
  KEY `defense_panelist_panelist_id_foreign` (`panelist_id`),
  CONSTRAINT `defense_panelist_defense_id_foreign` FOREIGN KEY (`defense_id`) REFERENCES `defenses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `defense_panelist_panelist_id_foreign` FOREIGN KEY (`panelist_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `defenses`;
CREATE TABLE `defenses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `room_id` bigint unsigned DEFAULT NULL,
  `group_id` bigint unsigned DEFAULT NULL,
  `adviser_id` bigint unsigned DEFAULT NULL,
  `proposed_by_id` bigint unsigned DEFAULT NULL,
  `approved_by_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `presentation_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `status` enum('pending','approved','rejected','cancelled','reschedule','reappearance','re-defense') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `archived` tinyint(1) NOT NULL DEFAULT '0',
  `notes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rejection_note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `defenses_group_id_foreign` (`group_id`),
  KEY `defenses_adviser_id_foreign` (`adviser_id`),
  KEY `defenses_proposed_by_id_foreign` (`proposed_by_id`),
  KEY `defenses_approved_by_id_foreign` (`approved_by_id`),
  KEY `defenses_room_id_start_at_end_at_index` (`room_id`,`start_at`,`end_at`),
  CONSTRAINT `defenses_adviser_id_foreign` FOREIGN KEY (`adviser_id`) REFERENCES `users` (`id`),
  CONSTRAINT `defenses_approved_by_id_foreign` FOREIGN KEY (`approved_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `defenses_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL,
  CONSTRAINT `defenses_proposed_by_id_foreign` FOREIGN KEY (`proposed_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `defenses_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `department_group`;
CREATE TABLE `department_group` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `department_group_group_id_department_id_unique` (`group_id`,`department_id`),
  KEY `department_group_department_id_foreign` (`department_id`),
  CONSTRAINT `department_group_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `department_group_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `department_room`;
CREATE TABLE `department_room` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `room_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `department_room_room_id_department_id_unique` (`room_id`,`department_id`),
  KEY `department_room_department_id_foreign` (`department_id`),
  CONSTRAINT `department_room_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `department_room_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `department_user`;
CREATE TABLE `department_user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `department_user_user_id_department_id_unique` (`user_id`,`department_id`),
  KEY `department_user_department_id_foreign` (`department_id`),
  CONSTRAINT `department_user_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `department_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departments_code_unique` (`code`),
  UNIQUE KEY `departments_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `group_members`;
CREATE TABLE `group_members` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group_id` bigint unsigned NOT NULL,
  `student_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_members_group_id_foreign` (`group_id`),
  CONSTRAINT `group_members_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `department_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `group_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adviser_id` bigint unsigned DEFAULT NULL,
  `critic_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `groups_group_code_unique` (`group_code`),
  KEY `groups_term_id_foreign` (`term_id`),
  KEY `groups_adviser_id_foreign` (`adviser_id`),
  KEY `groups_critic_id_foreign` (`critic_id`),
  KEY `groups_department_id_foreign` (`department_id`),
  CONSTRAINT `groups_adviser_id_foreign` FOREIGN KEY (`adviser_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `groups_critic_id_foreign` FOREIGN KEY (`critic_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `groups_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `groups_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `model_has_permissions`;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `model_has_roles`;
CREATE TABLE `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `role_has_permissions`;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `room_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `building` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rooms_room_number_building_unique` (`room_number`,`building`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `terms`;
CREATE TABLE `terms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_year` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `semester` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `department_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_department_id_foreign` (`department_id`),
  CONSTRAINT `users_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `defense_panelist` (`id`, `defense_id`, `panelist_id`, `created_at`, `updated_at`) VALUES
(1, 4, 8, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(2, 4, 9, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(3, 4, 10, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(4, 5, 8, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(5, 5, 9, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(6, 5, 10, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(7, 6, 8, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(8, 6, 9, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(9, 6, 10, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(10, 7, 8, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(11, 7, 9, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(12, 7, 10, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(13, 8, 8, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(14, 8, 9, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(15, 8, 10, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(16, 9, 8, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(17, 9, 9, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(18, 9, 10, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(19, 10, 8, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(20, 10, 9, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(21, 10, 10, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(22, 11, 8, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(23, 11, 9, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(24, 11, 10, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(25, 12, 8, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(26, 12, 9, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(27, 12, 10, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(28, 13, 8, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(29, 13, 9, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(30, 13, 10, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(31, 14, 8, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(32, 14, 9, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(33, 14, 10, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(34, 15, 8, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(35, 15, 9, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(36, 15, 10, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(37, 16, 8, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(38, 16, 9, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(39, 16, 10, '2026-03-08 12:44:42', '2026-03-08 12:44:42');

INSERT INTO `defenses` (`id`, `room_id`, `group_id`, `adviser_id`, `proposed_by_id`, `approved_by_id`, `title`, `presentation_type`, `start_at`, `end_at`, `status`, `archived`, `notes`, `rejection_note`, `created_at`, `updated_at`) VALUES
(1, NULL, 1, 2, 2, NULL, 'AI-Powered Student Performance Analytics System', NULL, '2026-03-11 10:30:00', '2026-03-11 12:00:00', 'pending', 0, 'Good day, my preferred schedule is Wednesday, March 11, 2026 from 10:30 AM to 12:00 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(2, NULL, 2, 3, 3, NULL, 'Blockchain-Based Academic Records Management', NULL, '2026-03-13 12:00:00', '2026-03-13 13:30:00', 'pending', 0, 'Good day, my preferred schedule is Friday, March 13, 2026 from 12:00 PM to 1:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(3, NULL, 3, 4, 4, NULL, 'Mobile Learning Platform with Gamification', NULL, '2026-03-15 12:00:00', '2026-03-15 13:30:00', 'pending', 0, 'Good day, my preferred schedule is Sunday, March 15, 2026 from 12:00 PM to 1:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(4, NULL, 4, 12, 12, NULL, 'Digital Classroom Management System for Elementary Education', NULL, '2026-03-11 09:00:00', '2026-03-11 10:30:00', 'pending', 0, 'Good day, my preferred schedule is Wednesday, March 11, 2026 from 9:00 AM to 10:30 AM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(5, NULL, 5, 13, 13, NULL, 'Interactive Learning Modules for Mathematics', NULL, '2026-03-13 12:30:00', '2026-03-13 14:00:00', 'pending', 0, 'Good day, my preferred schedule is Friday, March 13, 2026 from 12:30 PM to 2:00 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(6, NULL, 6, 14, 14, NULL, 'Student Assessment and Progress Tracking Platform', NULL, '2026-03-15 12:00:00', '2026-03-15 13:30:00', 'pending', 0, 'Good day, my preferred schedule is Sunday, March 15, 2026 from 12:00 PM to 1:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(7, NULL, 7, 22, 22, NULL, 'Hotel Reservation and Management System', NULL, '2026-03-11 14:00:00', '2026-03-11 15:30:00', 'pending', 0, 'Good day, my preferred schedule is Wednesday, March 11, 2026 from 2:00 PM to 3:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(8, NULL, 8, 23, 23, NULL, 'Tourism Destination Recommendation Platform', NULL, '2026-03-13 14:00:00', '2026-03-13 15:30:00', 'pending', 0, 'Good day, my preferred schedule is Friday, March 13, 2026 from 2:00 PM to 3:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(9, NULL, 9, 24, 24, NULL, 'Restaurant Point of Sale and Inventory System', NULL, '2026-03-15 15:30:00', '2026-03-15 17:00:00', 'pending', 0, 'Good day, my preferred schedule is Sunday, March 15, 2026 from 3:30 PM to 5:00 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(10, NULL, 10, 32, 32, NULL, 'Business Intelligence Dashboard for SMEs', NULL, '2026-03-11 15:00:00', '2026-03-11 16:30:00', 'pending', 0, 'Good day, my preferred schedule is Wednesday, March 11, 2026 from 3:00 PM to 4:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(11, NULL, 11, 33, 33, NULL, 'Customer Relationship Management System', NULL, '2026-03-13 10:30:00', '2026-03-13 12:00:00', 'pending', 0, 'Good day, my preferred schedule is Friday, March 13, 2026 from 10:30 AM to 12:00 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(12, NULL, 12, 34, 34, NULL, 'Supply Chain Management and Analytics Platform', NULL, '2026-03-15 13:00:00', '2026-03-15 14:30:00', 'pending', 0, 'Good day, my preferred schedule is Sunday, March 15, 2026 from 1:00 PM to 2:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(13, NULL, 13, 42, 42, NULL, 'Laboratory Information Management System', NULL, '2026-03-11 10:00:00', '2026-03-11 11:30:00', 'pending', 0, 'Good day, my preferred schedule is Wednesday, March 11, 2026 from 10:00 AM to 11:30 AM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(14, NULL, 14, 43, 43, NULL, 'Research Data Collection and Analysis Platform', NULL, '2026-03-13 14:30:00', '2026-03-13 16:00:00', 'pending', 0, 'Good day, my preferred schedule is Friday, March 13, 2026 from 2:30 PM to 4:00 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(15, NULL, 15, 44, 44, NULL, 'Academic Publication Management System', NULL, '2026-03-15 15:00:00', '2026-03-15 16:30:00', 'pending', 0, 'Good day, my preferred schedule is Sunday, March 15, 2026 from 3:00 PM to 4:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(16, NULL, 16, 52, 52, NULL, 'Multi-Department Adviser Scheduling Demo', NULL, '2026-03-31 10:00:00', '2026-03-31 11:30:00', 'pending', 0, 'Good day, my preferred schedule is Tuesday, March 31, 2026 from 10:00 AM to 11:30 AM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2026-03-08 12:44:42', '2026-03-08 12:44:42');

INSERT INTO `department_group` (`id`, `group_id`, `department_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(2, 2, 1, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(3, 3, 1, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(4, 4, 2, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(5, 5, 2, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(6, 6, 2, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(7, 7, 3, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(8, 8, 3, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(9, 9, 3, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(10, 10, 4, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(11, 11, 4, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(12, 12, 4, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(13, 13, 5, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(14, 14, 5, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(15, 15, 5, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(16, 16, 1, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(17, 16, 2, '2026-03-08 12:44:42', '2026-03-08 12:44:42');

INSERT INTO `department_room` (`id`, `room_id`, `department_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(2, 1, 2, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(3, 2, 2, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(4, 3, 3, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(5, 3, 4, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(6, 4, 4, '2026-03-08 12:44:42', '2026-03-08 12:44:42');

INSERT INTO `department_user` (`id`, `user_id`, `department_id`, `created_at`, `updated_at`) VALUES
(1, 2, 1, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(2, 3, 1, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(3, 4, 1, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(4, 5, 1, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(5, 6, 1, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(6, 7, 1, '2026-03-08 12:44:32', '2026-03-08 12:44:32'),
(7, 8, 1, '2026-03-08 12:44:32', '2026-03-08 12:44:32'),
(8, 9, 1, '2026-03-08 12:44:32', '2026-03-08 12:44:32'),
(9, 10, 1, '2026-03-08 12:44:32', '2026-03-08 12:44:32'),
(10, 11, 1, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(11, 12, 2, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(12, 13, 2, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(13, 14, 2, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(14, 15, 2, '2026-03-08 12:44:34', '2026-03-08 12:44:34'),
(15, 16, 2, '2026-03-08 12:44:34', '2026-03-08 12:44:34'),
(16, 17, 2, '2026-03-08 12:44:34', '2026-03-08 12:44:34'),
(17, 18, 2, '2026-03-08 12:44:34', '2026-03-08 12:44:34'),
(18, 19, 2, '2026-03-08 12:44:34', '2026-03-08 12:44:34'),
(19, 20, 2, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(20, 21, 2, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(21, 22, 3, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(22, 23, 3, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(23, 24, 3, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(24, 25, 3, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(25, 26, 3, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(26, 27, 3, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(27, 28, 3, '2026-03-08 12:44:37', '2026-03-08 12:44:37'),
(28, 29, 3, '2026-03-08 12:44:37', '2026-03-08 12:44:37'),
(29, 30, 3, '2026-03-08 12:44:37', '2026-03-08 12:44:37'),
(30, 31, 3, '2026-03-08 12:44:37', '2026-03-08 12:44:37'),
(31, 32, 4, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(32, 33, 4, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(33, 34, 4, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(34, 35, 4, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(35, 36, 4, '2026-03-08 12:44:39', '2026-03-08 12:44:39'),
(36, 37, 4, '2026-03-08 12:44:39', '2026-03-08 12:44:39'),
(37, 38, 4, '2026-03-08 12:44:39', '2026-03-08 12:44:39'),
(38, 39, 4, '2026-03-08 12:44:39', '2026-03-08 12:44:39'),
(39, 40, 4, '2026-03-08 12:44:39', '2026-03-08 12:44:39'),
(40, 41, 4, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(41, 42, 5, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(42, 43, 5, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(43, 44, 5, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(44, 45, 5, '2026-03-08 12:44:41', '2026-03-08 12:44:41'),
(45, 46, 5, '2026-03-08 12:44:41', '2026-03-08 12:44:41'),
(46, 47, 5, '2026-03-08 12:44:41', '2026-03-08 12:44:41'),
(47, 48, 5, '2026-03-08 12:44:41', '2026-03-08 12:44:41'),
(48, 49, 5, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(49, 50, 5, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(50, 51, 5, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(51, 52, 1, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(52, 52, 2, '2026-03-08 12:44:42', '2026-03-08 12:44:42');

INSERT INTO `departments` (`id`, `code`, `name`, `created_at`, `updated_at`) VALUES
(1, 'BSCS', 'Computer Studies', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(2, 'BSE', 'Education', '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(3, 'BSHTM', 'Hospitality and Tourism Management', '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(4, 'BSM', 'Business and Management', '2026-03-08 12:44:37', '2026-03-08 12:44:37'),
(5, 'BSAS', 'Arts and Sciences', '2026-03-08 12:44:40', '2026-03-08 12:44:40');

INSERT INTO `group_members` (`id`, `group_id`, `student_name`, `created_at`, `updated_at`) VALUES
(1, 1, 'Juan Morales', '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(2, 1, 'Angelica Salazar', '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(3, 1, 'Patricia Mercado', '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(4, 2, 'Manuel Domingo', '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(5, 2, 'Eduardo Ramos', '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(6, 2, 'Gabriela Jimenez', '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(7, 3, 'Gabriel Diaz', '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(8, 3, 'Lucia Navarro', '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(9, 3, 'Rosa Castro', '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(10, 4, 'Ana Valdez', '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(11, 4, 'Ramon Salazar', '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(12, 4, 'Gabriela Alvarez', '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(13, 5, 'Carmen Gonzales', '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(14, 5, 'Elena Bautista', '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(15, 5, 'Lucia Flores', '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(16, 6, 'Fernando Santiago', '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(17, 6, 'Roberto Diaz', '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(18, 6, 'Valentina Santos', '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(19, 7, 'Camila Santos', '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(20, 7, 'Natalia Rivera', '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(21, 7, 'Maria Castro', '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(22, 8, 'Jose Garcia', '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(23, 8, 'Angelica Mendoza', '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(24, 8, 'Patricia Pascual', '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(25, 9, 'Andres Villanueva', '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(26, 9, 'Camila Flores', '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(27, 9, 'Victoria Aguilar', '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(28, 10, 'Manuel Torres', '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(29, 10, 'Lucia Santiago', '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(30, 10, 'Ana Hernandez', '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(31, 11, 'Miguel Castro', '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(32, 11, 'Eduardo Castillo', '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(33, 11, 'Pedro Jimenez', '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(34, 12, 'Diego Aguilar', '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(35, 12, 'Patricia Torres', '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(36, 12, 'Camila Rojas', '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(37, 13, 'Francisco Perez', '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(38, 13, 'Cristina Morales', '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(39, 13, 'Juan Ramos', '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(40, 14, 'Valentina Rojas', '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(41, 14, 'Luis Castro', '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(42, 14, 'Antonio Aquino', '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(43, 15, 'Pedro Pascual', '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(44, 15, 'Rafael Santos', '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(45, 15, 'Lucia Castro', '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(46, 16, 'Alex Santos', '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(47, 16, 'Bianca Reyes', '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(48, 16, 'Carlos Dela Cruz', '2026-03-08 12:44:42', '2026-03-08 12:44:42');

INSERT INTO `groups` (`id`, `department_id`, `term_id`, `group_code`, `course_code`, `adviser_id`, `critic_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'BSCS01-THESIS-2025', NULL, 2, NULL, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(2, 1, 1, 'BSCS02-THESIS-2025', NULL, 3, NULL, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(3, 1, 1, 'BSCS03-THESIS-2025', NULL, 4, NULL, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(4, 2, 1, 'BSE01-THESIS-2025', NULL, 12, NULL, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(5, 2, 1, 'BSE02-THESIS-2025', NULL, 13, NULL, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(6, 2, 1, 'BSE03-THESIS-2025', NULL, 14, NULL, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(7, 3, 1, 'BSHTM01-THESIS-2025', NULL, 22, NULL, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(8, 3, 1, 'BSHTM02-THESIS-2025', NULL, 23, NULL, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(9, 3, 1, 'BSHTM03-THESIS-2025', NULL, 24, NULL, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(10, 4, 1, 'BSM01-THESIS-2025', NULL, 32, NULL, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(11, 4, 1, 'BSM02-THESIS-2025', NULL, 33, NULL, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(12, 4, 1, 'BSM03-THESIS-2025', NULL, 34, NULL, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(13, 5, 1, 'BSAS01-THESIS-2025', NULL, 42, NULL, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(14, 5, 1, 'BSAS02-THESIS-2025', NULL, 43, NULL, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(15, 5, 1, 'BSAS03-THESIS-2025', NULL, 44, NULL, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(16, 1, 1, 'BSCSMD01-THESIS-2025', 'MULTI-DEPT-DEMO', 52, 17, '2026-03-08 12:44:42', '2026-03-08 12:44:42');

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_09_16_170141_create_permission_tables', 1),
(5, '2025_09_16_171915_create_rooms_table', 1),
(6, '2025_09_16_172003_create_terms_table', 1),
(7, '2025_09_17_102245_create_groups_table', 1),
(8, '2025_09_17_102634_create_group_members_table', 1),
(9, '2025_09_17_102635_create_defenses_table', 1),
(10, '2025_09_17_102636_create_defense_panelist_table', 1),
(11, '2025_09_18_193348_create_departments_table', 1),
(12, '2025_09_18_194255_add_department_id_to_users_table', 1),
(13, '2025_09_18_194311_add_department_id_to_groups_table', 1),
(14, '2025_10_06_135651_create_activity_log_table', 1),
(15, '2026_03_08_103839_create_department_user_table', 1),
(16, '2026_03_08_103847_create_department_group_table', 1),
(17, '2026_03_08_114500_create_department_room_table', 1);

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'Bocum\\Models\\User', 11),
(1, 'Bocum\\Models\\User', 21),
(1, 'Bocum\\Models\\User', 31),
(1, 'Bocum\\Models\\User', 41),
(1, 'Bocum\\Models\\User', 51),
(2, 'Bocum\\Models\\User', 1),
(3, 'Bocum\\Models\\User', 2),
(3, 'Bocum\\Models\\User', 3),
(3, 'Bocum\\Models\\User', 4),
(3, 'Bocum\\Models\\User', 12),
(3, 'Bocum\\Models\\User', 13),
(3, 'Bocum\\Models\\User', 14),
(3, 'Bocum\\Models\\User', 22),
(3, 'Bocum\\Models\\User', 23),
(3, 'Bocum\\Models\\User', 24),
(3, 'Bocum\\Models\\User', 32),
(3, 'Bocum\\Models\\User', 33),
(3, 'Bocum\\Models\\User', 34),
(3, 'Bocum\\Models\\User', 42),
(3, 'Bocum\\Models\\User', 43),
(3, 'Bocum\\Models\\User', 44),
(3, 'Bocum\\Models\\User', 52),
(4, 'Bocum\\Models\\User', 5),
(4, 'Bocum\\Models\\User', 6),
(4, 'Bocum\\Models\\User', 7),
(4, 'Bocum\\Models\\User', 15),
(4, 'Bocum\\Models\\User', 16),
(4, 'Bocum\\Models\\User', 17),
(4, 'Bocum\\Models\\User', 25),
(4, 'Bocum\\Models\\User', 26),
(4, 'Bocum\\Models\\User', 27),
(4, 'Bocum\\Models\\User', 35),
(4, 'Bocum\\Models\\User', 36),
(4, 'Bocum\\Models\\User', 37),
(4, 'Bocum\\Models\\User', 45),
(4, 'Bocum\\Models\\User', 46),
(4, 'Bocum\\Models\\User', 47),
(5, 'Bocum\\Models\\User', 8),
(5, 'Bocum\\Models\\User', 9),
(5, 'Bocum\\Models\\User', 10),
(5, 'Bocum\\Models\\User', 18),
(5, 'Bocum\\Models\\User', 19),
(5, 'Bocum\\Models\\User', 20),
(5, 'Bocum\\Models\\User', 28),
(5, 'Bocum\\Models\\User', 29),
(5, 'Bocum\\Models\\User', 30),
(5, 'Bocum\\Models\\User', 38),
(5, 'Bocum\\Models\\User', 39),
(5, 'Bocum\\Models\\User', 40),
(5, 'Bocum\\Models\\User', 48),
(5, 'Bocum\\Models\\User', 49),
(5, 'Bocum\\Models\\User', 50);

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'manage defenses', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(2, 'view defenses', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(3, 'create defenses', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(4, 'edit defenses', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(5, 'delete defenses', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(6, 'manage schedule', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(7, 'view calendar', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(8, 'manage terms', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(9, 'manage rooms', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(10, 'manage coordinators', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30');

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 2),
(9, 2),
(10, 2);

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'coordinator', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(2, 'admin', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(3, 'adviser', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(4, 'critic', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(5, 'panelist', 'web', '2026-03-08 12:44:30', '2026-03-08 12:44:30');

INSERT INTO `rooms` (`id`, `room_number`, `building`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'CS-101', 'Main Building', 1, '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(2, 'CS-102', 'Main Building', 1, '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(3, 'CS-201', 'Main Building', 1, '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(4, 'CS-202', 'Main Building', 1, '2026-03-08 12:44:30', '2026-03-08 12:44:30');

INSERT INTO `terms` (`id`, `school_year`, `semester`, `is_current`, `created_at`, `updated_at`) VALUES
(1, '2025-2026', '1st Semester', 1, '2026-03-08 12:44:30', '2026-03-08 12:44:30');

INSERT INTO `users` (`id`, `department_id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Admin', 'admin@cct.edu.ph', '2026-03-08 12:44:30', '$2y$12$Qe3H0GuJT3DfwThsQ6F4pu/YH4ITP/2TWfOc33HQR2HHfCt1g0yGm', NULL, '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(2, 1, 'Adviser 1 (BSCS)', 'adviser1.bscs@cct.edu.ph', NULL, '$2y$12$GaF9a0NEl6cply.FklhSyuf42bc8X5GhghE3VNws6KyH.Hn022sdC', NULL, '2026-03-08 12:44:30', '2026-03-08 12:44:30'),
(3, 1, 'Adviser 2 (BSCS)', 'adviser2.bscs@cct.edu.ph', NULL, '$2y$12$rltuZqE/UmsiQb5X5Sbcu.DZ9awfk7RU1zQcu4KokJk6vJpJbrWMq', NULL, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(4, 1, 'Adviser 3 (BSCS)', 'adviser3.bscs@cct.edu.ph', NULL, '$2y$12$DmostbLH4o1jcDo/irqMOeDb8E7RP8CiKRQI98ofNmKu9WwlDXHQK', NULL, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(5, 1, 'Critic 1 (BSCS)', 'critic1.bscs@cct.edu.ph', NULL, '$2y$12$Yp6EGcAH1zkNI/nkbNO23eEPKXO43mU/JhaieXoEh77bwFFk7INtu', NULL, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(6, 1, 'Critic 2 (BSCS)', 'critic2.bscs@cct.edu.ph', NULL, '$2y$12$LNWTPbwaWXFILlYKcMkcg.8YFDv38IJf69xN9lPAyEfLQ4yEPLL8G', NULL, '2026-03-08 12:44:31', '2026-03-08 12:44:31'),
(7, 1, 'Critic 3 (BSCS)', 'critic3.bscs@cct.edu.ph', NULL, '$2y$12$0Vw9P1WhQtkh7be6CDR42.o5x9CojVn02kjFRpG0pJ/sUxYKcaI6C', NULL, '2026-03-08 12:44:32', '2026-03-08 12:44:32'),
(8, 1, 'Panelist 1 (BSCS)', 'panelist1.bscs@cct.edu.ph', NULL, '$2y$12$lyWFsJKIOvA1GLddmpAGSOeSjQ0/FJJipzfwyIufog2vqCczbDm8q', NULL, '2026-03-08 12:44:32', '2026-03-08 12:44:32'),
(9, 1, 'Panelist 2 (BSCS)', 'panelist2.bscs@cct.edu.ph', NULL, '$2y$12$4Rxy9YyJ6dHoW5jwHS6vNuBPhBCti5xQaHNmO9bOE6EGn/j4kQQ4u', NULL, '2026-03-08 12:44:32', '2026-03-08 12:44:32'),
(10, 1, 'Panelist 3 (BSCS)', 'panelist3.bscs@cct.edu.ph', NULL, '$2y$12$wtGICSD6oriMB0sAoE8EKuAmFP6Kn4sBBUkdlOFhcGzCcO9OlWcyy', NULL, '2026-03-08 12:44:32', '2026-03-08 12:44:32'),
(11, 1, 'Coordinator (BSCS)', 'coordinator.bscs@cct.edu.ph', NULL, '$2y$12$gDrK90S/s5zgoCImFlx96eglfnqzUtrzl0aPN/apNhBVdSVBVBOY6', NULL, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(12, 2, 'Adviser 1 (BSE)', 'adviser1.bse@cct.edu.ph', NULL, '$2y$12$Sv9OyCy0bNPX3u/a9simPedMt1rM6UNgy9WmWpkXrGHWXkaAznb3e', NULL, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(13, 2, 'Adviser 2 (BSE)', 'adviser2.bse@cct.edu.ph', NULL, '$2y$12$kGuN407.ikBOOwctM.d/bObBU6S5zzt/Xjmkcd92AJNoWXgNj18c2', NULL, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(14, 2, 'Adviser 3 (BSE)', 'adviser3.bse@cct.edu.ph', NULL, '$2y$12$p3/h7XqHMbHAgK1mRiXSYu3Folohg6fYqjT.RGAfOPGOZDmBODGU.', NULL, '2026-03-08 12:44:33', '2026-03-08 12:44:33'),
(15, 2, 'Critic 1 (BSE)', 'critic1.bse@cct.edu.ph', NULL, '$2y$12$uwy6JV3UHGEPfKEujHeHeeiBgEbBjNXHQKbtU8iqgSGqHuCg5EXJy', NULL, '2026-03-08 12:44:34', '2026-03-08 12:44:34'),
(16, 2, 'Critic 2 (BSE)', 'critic2.bse@cct.edu.ph', NULL, '$2y$12$5TExtXa/8FuBsZ1NsDqeHuwEn9QTM2zQceDLqsCw3r5gTIHwWQbvm', NULL, '2026-03-08 12:44:34', '2026-03-08 12:44:34'),
(17, 2, 'Critic 3 (BSE)', 'critic3.bse@cct.edu.ph', NULL, '$2y$12$tekOJfPQwCsx/AlwStLC3u4Cuhr27Ww5SASnDXM2k2T47FJWsl21C', NULL, '2026-03-08 12:44:34', '2026-03-08 12:44:34'),
(18, 2, 'Panelist 1 (BSE)', 'panelist1.bse@cct.edu.ph', NULL, '$2y$12$pKr/8E0O3TSCKpZ9kfmyju5QIrp5GuhDI3YcAxGMKCWLu0XQzuT86', NULL, '2026-03-08 12:44:34', '2026-03-08 12:44:34'),
(19, 2, 'Panelist 2 (BSE)', 'panelist2.bse@cct.edu.ph', NULL, '$2y$12$NPQBN.2n54Xfj7JN1dSlt.XRUK7ij22JGJfFt6dJ2rCBixRoQxtVe', NULL, '2026-03-08 12:44:34', '2026-03-08 12:44:34'),
(20, 2, 'Panelist 3 (BSE)', 'panelist3.bse@cct.edu.ph', NULL, '$2y$12$OrI2QKNwvogm2FFeY93v9eK5JgsOKD8NMxVoVNzWma9X4y9vc/lsi', NULL, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(21, 2, 'Coordinator (BSE)', 'coordinator.bse@cct.edu.ph', NULL, '$2y$12$g3b4nO32zY.lRClV6sNiqeh3TPPX0tPvLkC80jYauEGCJxUJ7YqNC', NULL, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(22, 3, 'Adviser 1 (BSHTM)', 'adviser1.bshtm@cct.edu.ph', NULL, '$2y$12$Jwy.qChLKJVME0fzQt0wZeUMwpw5Qpw2ExdonGiH0B04pYxoVN.MC', NULL, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(23, 3, 'Adviser 2 (BSHTM)', 'adviser2.bshtm@cct.edu.ph', NULL, '$2y$12$bTLpR6dPv8IyVOJFkQIJW.swraQQC8sMaVA802eaIup1bGFZ8ZSpq', NULL, '2026-03-08 12:44:35', '2026-03-08 12:44:35'),
(24, 3, 'Adviser 3 (BSHTM)', 'adviser3.bshtm@cct.edu.ph', NULL, '$2y$12$U.DGnjyXAeR/yHvlQmToLuXnB2ezgFGUnizt7lPCORq3i2B/wzbYS', NULL, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(25, 3, 'Critic 1 (BSHTM)', 'critic1.bshtm@cct.edu.ph', NULL, '$2y$12$Qj.8AdfzdU1ff37Z4UQXOO09uo/3HdYBkqwWelks1HY7DtqO.HTeW', NULL, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(26, 3, 'Critic 2 (BSHTM)', 'critic2.bshtm@cct.edu.ph', NULL, '$2y$12$7ZGri0pcYV.BR/DahMRTh.vW0VceOKqBrZrrzJKFhfteJywXpCsqK', NULL, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(27, 3, 'Critic 3 (BSHTM)', 'critic3.bshtm@cct.edu.ph', NULL, '$2y$12$Wg/KOrTyaIc4Ipda0sq6Z.mVCeEuK2DUARzfL8Pcyqhfl7Zysd4rq', NULL, '2026-03-08 12:44:36', '2026-03-08 12:44:36'),
(28, 3, 'Panelist 1 (BSHTM)', 'panelist1.bshtm@cct.edu.ph', NULL, '$2y$12$2D5am6pcRXkrb49FOs7v0eEA/GxX9ZMonLru/NV33gNLcq050BGb6', NULL, '2026-03-08 12:44:37', '2026-03-08 12:44:37'),
(29, 3, 'Panelist 2 (BSHTM)', 'panelist2.bshtm@cct.edu.ph', NULL, '$2y$12$dvzfaiv9HZTeBuQsgB4V3uKLk1emItLc7311Gu/IOnjIdFiw4XdRS', NULL, '2026-03-08 12:44:37', '2026-03-08 12:44:37'),
(30, 3, 'Panelist 3 (BSHTM)', 'panelist3.bshtm@cct.edu.ph', NULL, '$2y$12$z4aHn5Ye7mv5GfyN3YwbSuq/MLSsS2symsWkFSzlNo5FPxhy1LXcy', NULL, '2026-03-08 12:44:37', '2026-03-08 12:44:37'),
(31, 3, 'Coordinator (BSHTM)', 'coordinator.bshtm@cct.edu.ph', NULL, '$2y$12$XEFGf0o6KpyXG0nbcvPUEe4HCpADQisVkAItqL7drR2aoO5FM7Zie', NULL, '2026-03-08 12:44:37', '2026-03-08 12:44:37'),
(32, 4, 'Adviser 1 (BSM)', 'adviser1.bsm@cct.edu.ph', NULL, '$2y$12$NSwk.7PaRo9MJ1H1KohV2OEo3V6ABQRF0MXUCXpEqTe5Gt2gm7Cf6', NULL, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(33, 4, 'Adviser 2 (BSM)', 'adviser2.bsm@cct.edu.ph', NULL, '$2y$12$iyAOaNGQxR2vdttxbGy3lu2lPVbMiaoW410MGjsafnuEmX.Q1j6VG', NULL, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(34, 4, 'Adviser 3 (BSM)', 'adviser3.bsm@cct.edu.ph', NULL, '$2y$12$mSGyDFPGUssHj4GLVlEVv.PnJk0eH7ijT6FfK9oir2m857S49b5UC', NULL, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(35, 4, 'Critic 1 (BSM)', 'critic1.bsm@cct.edu.ph', NULL, '$2y$12$jzKA6OlyTAv1ZqKO9aOBWu2FmNXIwGUH6NVKtAJSwUPzcRUYgbUia', NULL, '2026-03-08 12:44:38', '2026-03-08 12:44:38'),
(36, 4, 'Critic 2 (BSM)', 'critic2.bsm@cct.edu.ph', NULL, '$2y$12$vepT0p1wRHC7uQinpu1AsefQqKcZ3FsihsBpIT2YqfQD4sJ67Yzea', NULL, '2026-03-08 12:44:39', '2026-03-08 12:44:39'),
(37, 4, 'Critic 3 (BSM)', 'critic3.bsm@cct.edu.ph', NULL, '$2y$12$Ea09mx3dmU3XF7XYK16HmerfqEhT0oW8OeEs/I01bng.chUS9RP2K', NULL, '2026-03-08 12:44:39', '2026-03-08 12:44:39'),
(38, 4, 'Panelist 1 (BSM)', 'panelist1.bsm@cct.edu.ph', NULL, '$2y$12$K1tQ7BVT4BgWD9AssNbre.bAUcD2GV8ewXNoxyAX9F7tGhipDFk8y', NULL, '2026-03-08 12:44:39', '2026-03-08 12:44:39'),
(39, 4, 'Panelist 2 (BSM)', 'panelist2.bsm@cct.edu.ph', NULL, '$2y$12$nHsTRAWetC0p70XJPtORH.aQz1UUHWVJr6j5qU1Ur3khCHrZjZAzW', NULL, '2026-03-08 12:44:39', '2026-03-08 12:44:39'),
(40, 4, 'Panelist 3 (BSM)', 'panelist3.bsm@cct.edu.ph', NULL, '$2y$12$DmHHcE9z3KOP0S7.Be/YIe5bslaMcfBw3hl1WyQr2l333VfNfTC1y', NULL, '2026-03-08 12:44:39', '2026-03-08 12:44:39'),
(41, 4, 'Coordinator (BSM)', 'coordinator.bsm@cct.edu.ph', NULL, '$2y$12$R8i/w9Fo1CGxaJljUvVLluIPRZY517RBXseUjFXeyGbXLRdoPK8..', NULL, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(42, 5, 'Adviser 1 (BSAS)', 'adviser1.bsas@cct.edu.ph', NULL, '$2y$12$9fbuI7ebrhxfnikNgDdc.eydm//AWr20Is4V4ZDyk9lf1H5n51LMq', NULL, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(43, 5, 'Adviser 2 (BSAS)', 'adviser2.bsas@cct.edu.ph', NULL, '$2y$12$bqsSZ2F75cm3GZmIcf.bD.9zVIeT7C9dZYPDHq5EwPH4gTPGJVwtq', NULL, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(44, 5, 'Adviser 3 (BSAS)', 'adviser3.bsas@cct.edu.ph', NULL, '$2y$12$IKoJolqwjdnyB9N3MLK3..2Fdr0pdcm9.TqkECYyVlHkNXPIjQbA2', NULL, '2026-03-08 12:44:40', '2026-03-08 12:44:40'),
(45, 5, 'Critic 1 (BSAS)', 'critic1.bsas@cct.edu.ph', NULL, '$2y$12$uByhAhD6kvcScEqMpptTQ.bQXaxHaSj8Rd8S2xLJy29tdJtwf.Nka', NULL, '2026-03-08 12:44:41', '2026-03-08 12:44:41'),
(46, 5, 'Critic 2 (BSAS)', 'critic2.bsas@cct.edu.ph', NULL, '$2y$12$fE2yerzyAFw/aPBvkrBrBuvHu2dNPZysYXcYAbcaiiEt7USvJ.xt6', NULL, '2026-03-08 12:44:41', '2026-03-08 12:44:41'),
(47, 5, 'Critic 3 (BSAS)', 'critic3.bsas@cct.edu.ph', NULL, '$2y$12$U3bqP8JgY6RnU3Rzz5sZLeWwxhpU/XSdG6/PjutC488/p.K9ZEitG', NULL, '2026-03-08 12:44:41', '2026-03-08 12:44:41'),
(48, 5, 'Panelist 1 (BSAS)', 'panelist1.bsas@cct.edu.ph', NULL, '$2y$12$07mGwvkIyQjsln4H0QJt8.hHPJ1.ikeiVHiBAqtQtor5ytzKMuXsO', NULL, '2026-03-08 12:44:41', '2026-03-08 12:44:41'),
(49, 5, 'Panelist 2 (BSAS)', 'panelist2.bsas@cct.edu.ph', NULL, '$2y$12$34qQZuEx1V7Z.8Ke6XkpkOTZlVe459MaIf5tNrbkkxF6703ciwni6', NULL, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(50, 5, 'Panelist 3 (BSAS)', 'panelist3.bsas@cct.edu.ph', NULL, '$2y$12$hHs/Civ9fvk7/F4sWVLDDOnedFZGUBa20zYwvMSgxQ0NT2n6Fjkc2', NULL, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(51, 5, 'Coordinator (BSAS)', 'coordinator.bsas@cct.edu.ph', NULL, '$2y$12$nwOAYR4J5Ja1AEqwJtW0I.1PZDrXWJJd3Nms37GNGuesx2esTfmYe', NULL, '2026-03-08 12:44:42', '2026-03-08 12:44:42'),
(52, 1, 'Adviser Multi (BSCS/BSE)', 'adviser.multi@cct.edu.ph', NULL, '$2y$12$kl6XwYMwQYMcOzNRMN1rEeQw6J/jG3REdr0mD5/IAwk.65iYE4r2C', NULL, '2026-03-08 12:44:42', '2026-03-08 12:44:42');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
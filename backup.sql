-- -------------------------------------------------------------
-- TablePlus 6.8.0(654)
--
-- https://tableplus.com/
--
-- Database: defense_scheduling
-- Generation Time: 2026-03-04 11:36:31.6790
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
  `event` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject_id` bigint unsigned DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `defenses`;
CREATE TABLE `defenses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `room_id` bigint unsigned DEFAULT NULL,
  `group_id` bigint unsigned DEFAULT NULL,
  `adviser_id` bigint unsigned DEFAULT NULL,
  `proposed_by_id` bigint unsigned DEFAULT NULL,
  `approved_by_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `status` enum('pending','approved','rejected','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_members_group_id_foreign` (`group_id`),
  KEY `group_members_email_index` (`email`),
  CONSTRAINT `group_members_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES
(1, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 16, 'Bocum\\Models\\User', 2, '{\"end_at\": \"2026-02-04T04:00:00.000000Z\", \"term_id\": 1, \"group_id\": 1, \"start_at\": \"2026-02-04T03:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-04 10:48:20', '2026-02-04 10:48:20'),
(2, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 16, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"]}', NULL, '2026-02-04 10:51:38', '2026-02-04 10:51:38'),
(3, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 16, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-04T04:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-04T03:00:00.000000Z\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-04 10:51:38', '2026-02-04 10:51:38'),
(4, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 17, 'Bocum\\Models\\User', 3, '{\"end_at\": \"2026-02-04T04:00:00.000000Z\", \"term_id\": 1, \"group_id\": 2, \"start_at\": \"2026-02-04T03:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-04 10:52:50', '2026-02-04 10:52:50'),
(5, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 18, 'Bocum\\Models\\User', 2, '{\"end_at\": \"2026-02-05T02:00:00.000000Z\", \"term_id\": 1, \"group_id\": 1, \"start_at\": \"2026-02-05T01:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-04 11:37:00', '2026-02-04 11:37:00'),
(6, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 18, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"]}', NULL, '2026-02-04 11:37:22', '2026-02-04 11:37:22'),
(7, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 18, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-05T02:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-05T01:00:00.000000Z\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-04 11:37:22', '2026-02-04 11:37:22'),
(8, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 19, 'Bocum\\Models\\User', 2, '{\"end_at\": \"2026-02-08T01:29:00.000000Z\", \"term_id\": 1, \"group_id\": 1, \"start_at\": \"2026-02-08T01:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-08 12:16:04', '2026-02-08 12:16:04'),
(9, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 20, 'Bocum\\Models\\User', 2, '{\"end_at\": \"2026-02-08T02:15:00.000000Z\", \"term_id\": 1, \"group_id\": 1, \"start_at\": \"2026-02-08T02:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-08 12:17:08', '2026-02-08 12:17:08'),
(10, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 21, 'Bocum\\Models\\User', 2, '{\"end_at\": \"2026-02-07T16:15:00.000000Z\", \"term_id\": 1, \"group_id\": 1, \"start_at\": \"2026-02-07T16:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-08 12:20:08', '2026-02-08 12:20:08'),
(11, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 22, 'Bocum\\Models\\User', 2, '{\"end_at\": \"2026-02-08T01:30:00.000000Z\", \"term_id\": 1, \"group_id\": 1, \"start_at\": \"2026-02-08T01:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-08 12:25:57', '2026-02-08 12:25:57'),
(12, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 17, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"]}', NULL, '2026-02-08 14:15:23', '2026-02-08 14:15:23'),
(13, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 17, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-09T02:30:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-09T02:00:00.000000Z\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-08 14:15:23', '2026-02-08 14:15:23'),
(14, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 23, 'Bocum\\Models\\User', 2, '{\"end_at\": \"2026-02-11T02:00:00.000000Z\", \"term_id\": 1, \"group_id\": 1, \"start_at\": \"2026-02-11T01:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-10 20:46:23', '2026-02-10 20:46:23'),
(15, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 23, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\"]}', NULL, '2026-02-10 20:48:52', '2026-02-10 20:48:52'),
(16, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 23, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-11T02:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-11T01:00:00.000000Z\", \"panelists\": [\"Panelist 1 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-10 20:48:52', '2026-02-10 20:48:52'),
(17, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 24, 'Bocum\\Models\\User', 3, '{\"end_at\": \"2026-02-10T02:00:00.000000Z\", \"term_id\": 1, \"group_id\": 2, \"start_at\": \"2026-02-10T01:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-10 20:51:17', '2026-02-10 20:51:17'),
(18, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 25, 'Bocum\\Models\\User', 2, '{\"end_at\": \"2026-02-12T02:00:00.000000Z\", \"term_id\": 1, \"group_id\": 1, \"start_at\": \"2026-02-12T01:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-10 20:52:00', '2026-02-10 20:52:00'),
(19, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 25, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Adviser 3 (BSCS)\"]}', NULL, '2026-02-10 21:03:17', '2026-02-10 21:03:17'),
(20, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 25, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-12T02:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-12T01:00:00.000000Z\", \"panelists\": [\"Adviser 3 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-10 21:03:17', '2026-02-10 21:03:17'),
(21, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 26, 'Bocum\\Models\\User', 3, '{\"end_at\": \"2026-02-12T02:00:00.000000Z\", \"term_id\": 1, \"group_id\": 2, \"start_at\": \"2026-02-12T01:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-10 21:03:45', '2026-02-10 21:03:45'),
(22, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 26, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\"]}', NULL, '2026-02-10 21:09:45', '2026-02-10 21:09:45'),
(23, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 26, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-12T03:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-12T02:00:00.000000Z\", \"panelists\": [\"Panelist 1 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-10 21:09:46', '2026-02-10 21:09:46'),
(24, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 27, 'Bocum\\Models\\User', 2, '{\"end_at\": \"2026-02-13T02:00:00.000000Z\", \"term_id\": 1, \"group_id\": 1, \"start_at\": \"2026-02-13T01:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-10 21:11:28', '2026-02-10 21:11:28'),
(25, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 25, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Adviser 3 (BSCS)\"]}', NULL, '2026-02-10 21:34:27', '2026-02-10 21:34:27'),
(26, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 25, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-12T01:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-12T00:00:00.000000Z\", \"panelists\": [\"Adviser 3 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-10 21:34:27', '2026-02-10 21:34:27'),
(27, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 28, 'Bocum\\Models\\User', 2, '{\"end_at\": \"2026-02-17T02:00:00.000000Z\", \"term_id\": 1, \"group_id\": 1, \"start_at\": \"2026-02-17T01:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-17 20:50:58', '2026-02-17 20:50:58'),
(28, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 28, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\"]}', NULL, '2026-02-17 20:52:29', '2026-02-17 20:52:29'),
(29, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 28, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-17T02:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-17T01:00:00.000000Z\", \"panelists\": [\"Panelist 1 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-17 20:52:29', '2026-02-17 20:52:29'),
(30, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 29, 'Bocum\\Models\\User', 3, '{\"end_at\": \"2026-02-17T02:30:00.000000Z\", \"term_id\": 1, \"group_id\": 2, \"start_at\": \"2026-02-17T02:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-17 21:02:44', '2026-02-17 21:02:44'),
(31, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 29, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\"]}', NULL, '2026-02-17 21:03:10', '2026-02-17 21:03:10'),
(32, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 29, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-17T02:30:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-17T02:00:00.000000Z\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-17 21:03:10', '2026-02-17 21:03:10'),
(33, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 28, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\"]}', NULL, '2026-02-17 21:05:33', '2026-02-17 21:05:33'),
(34, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 28, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-18T02:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-18T01:00:00.000000Z\", \"panelists\": [\"Panelist 1 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-17 21:05:33', '2026-02-17 21:05:33'),
(35, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 28, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\"]}', NULL, '2026-02-17 21:05:49', '2026-02-17 21:05:49'),
(36, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 28, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-17T02:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-17T01:00:00.000000Z\", \"panelists\": [\"Panelist 1 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-17 21:05:49', '2026-02-17 21:05:49'),
(37, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 30, 'Bocum\\Models\\User', 2, '{\"end_at\": \"2026-02-23T02:00:00.000000Z\", \"term_id\": 1, \"group_id\": 1, \"start_at\": \"2026-02-23T01:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-20 12:53:20', '2026-02-20 12:53:20'),
(38, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 30, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"]}', NULL, '2026-02-20 12:54:54', '2026-02-20 12:54:54'),
(39, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 30, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-23T02:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-23T01:00:00.000000Z\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-20 12:54:54', '2026-02-20 12:54:54'),
(40, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 31, 'Bocum\\Models\\User', 3, '{\"end_at\": \"2026-02-23T03:00:00.000000Z\", \"term_id\": 1, \"group_id\": 2, \"start_at\": \"2026-02-23T02:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-20 12:56:03', '2026-02-20 12:56:03'),
(41, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 31, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"]}', NULL, '2026-02-20 12:57:03', '2026-02-20 12:57:03'),
(42, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 31, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-23T03:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-23T02:00:00.000000Z\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-20 12:57:03', '2026-02-20 12:57:03'),
(43, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 32, 'Bocum\\Models\\User', 4, '{\"end_at\": \"2026-02-23T14:00:00.000000Z\", \"term_id\": 1, \"group_id\": 3, \"start_at\": \"2026-02-23T05:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-02-20 12:59:43', '2026-02-20 12:59:43'),
(44, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 32, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 3 (BSCS)\"]}', NULL, '2026-02-20 13:00:56', '2026-02-20 13:00:56'),
(45, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 32, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-23T14:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-23T05:00:00.000000Z\", \"panelists\": [\"Panelist 3 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-20 13:00:56', '2026-02-20 13:00:56'),
(46, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 32, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 3 (BSCS)\"]}', NULL, '2026-02-20 13:01:41', '2026-02-20 13:01:41'),
(47, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 32, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-23T06:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-23T05:00:00.000000Z\", \"panelists\": [\"Panelist 3 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-20 13:01:41', '2026-02-20 13:01:41'),
(48, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 30, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"]}', NULL, '2026-02-20 13:02:22', '2026-02-20 13:02:22'),
(49, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 30, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-02-24T02:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-02-24T01:00:00.000000Z\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-02-20 13:02:22', '2026-02-20 13:02:22'),
(50, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 30, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Panelist 1 (BSCS)\", \"Panelist 2 (BSCS)\", \"Panelist 3 (BSCS)\"]}', NULL, '2026-02-20 13:02:28', '2026-02-20 13:02:28'),
(51, 'defense', 'defense.cancelled', 'Bocum\\Models\\Defense', NULL, 30, 'Bocum\\Models\\User', 11, '{\"status_to\": \"cancelled\", \"status_from\": \"approved\"}', NULL, '2026-02-20 13:02:28', '2026-02-20 13:02:28'),
(52, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 33, 'Bocum\\Models\\User', 2, '{\"end_at\": \"2026-03-01T02:00:00.000000Z\", \"term_id\": 1, \"group_id\": 1, \"start_at\": \"2026-03-01T01:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-03-01 15:17:51', '2026-03-01 15:17:51'),
(53, 'defense', 'defense.proposed', 'Bocum\\Models\\Defense', NULL, 34, 'Bocum\\Models\\User', 52, '{\"end_at\": \"2026-03-01T03:00:00.000000Z\", \"term_id\": 2, \"group_id\": 16, \"start_at\": \"2026-03-01T02:00:00.000000Z\", \"status_to\": \"pending\", \"status_from\": null}', NULL, '2026-03-01 15:42:49', '2026-03-01 15:42:49'),
(54, 'defense', 'defense.panelists_assigned', 'Bocum\\Models\\Defense', NULL, 34, 'Bocum\\Models\\User', 11, '{\"action\": \"panelists.assigned\", \"panelists\": [\"Adviser 2 (BSCS)\", \"Panelist 3 (BSCS)\"]}', NULL, '2026-03-01 16:16:55', '2026-03-01 16:16:55'),
(55, 'defense', 'defense.approved', 'Bocum\\Models\\Defense', NULL, 34, 'Bocum\\Models\\User', 11, '{\"end_at\": \"2026-03-01T03:00:00.000000Z\", \"room_id\": 1, \"start_at\": \"2026-03-01T02:00:00.000000Z\", \"panelists\": [\"Adviser 2 (BSCS)\", \"Panelist 3 (BSCS)\"], \"status_to\": \"approved\", \"status_from\": \"pending\"}', NULL, '2026-03-01 16:16:55', '2026-03-01 16:16:55');

INSERT INTO `defense_panelist` (`id`, `defense_id`, `panelist_id`, `created_at`, `updated_at`) VALUES
(1, 16, 8, '2026-02-04 10:51:38', '2026-02-04 10:51:38'),
(2, 16, 9, '2026-02-04 10:51:38', '2026-02-04 10:51:38'),
(3, 16, 10, '2026-02-04 10:51:38', '2026-02-04 10:51:38'),
(4, 18, 8, '2026-02-04 11:37:22', '2026-02-04 11:37:22'),
(5, 18, 9, '2026-02-04 11:37:22', '2026-02-04 11:37:22'),
(6, 18, 10, '2026-02-04 11:37:22', '2026-02-04 11:37:22'),
(7, 17, 8, '2026-02-08 14:15:23', '2026-02-08 14:15:23'),
(8, 17, 9, '2026-02-08 14:15:23', '2026-02-08 14:15:23'),
(9, 17, 10, '2026-02-08 14:15:23', '2026-02-08 14:15:23'),
(10, 23, 8, '2026-02-10 20:48:52', '2026-02-10 20:48:52'),
(11, 25, 4, '2026-02-10 21:03:17', '2026-02-10 21:03:17'),
(12, 26, 8, '2026-02-10 21:09:45', '2026-02-10 21:09:45'),
(13, 28, 8, '2026-02-17 20:52:29', '2026-02-17 20:52:29'),
(14, 29, 8, '2026-02-17 21:03:10', '2026-02-17 21:03:10'),
(15, 29, 9, '2026-02-17 21:03:10', '2026-02-17 21:03:10'),
(16, 30, 8, '2026-02-20 12:54:54', '2026-02-20 12:54:54'),
(17, 30, 9, '2026-02-20 12:54:54', '2026-02-20 12:54:54'),
(18, 30, 10, '2026-02-20 12:54:54', '2026-02-20 12:54:54'),
(19, 31, 8, '2026-02-20 12:57:03', '2026-02-20 12:57:03'),
(20, 31, 9, '2026-02-20 12:57:03', '2026-02-20 12:57:03'),
(21, 31, 10, '2026-02-20 12:57:03', '2026-02-20 12:57:03'),
(22, 32, 10, '2026-02-20 13:00:56', '2026-02-20 13:00:56'),
(23, 34, 10, '2026-03-01 16:16:55', '2026-03-01 16:16:55'),
(24, 34, 3, '2026-03-01 16:16:55', '2026-03-01 16:16:55');

INSERT INTO `defenses` (`id`, `room_id`, `group_id`, `adviser_id`, `proposed_by_id`, `approved_by_id`, `title`, `start_at`, `end_at`, `status`, `notes`, `rejection_note`, `created_at`, `updated_at`) VALUES
(1, NULL, 1, 2, 2, NULL, 'AI-Powered Student Performance Analytics System', '2025-10-29 15:00:00', '2025-10-29 16:30:00', 'pending', 'Good day, my preferred schedule is Wednesday, October 29, 2025 from 3:00 PM to 4:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(2, NULL, 2, 3, 3, NULL, 'Blockchain-Based Academic Records Management', '2025-10-31 09:30:00', '2025-10-31 11:00:00', 'pending', 'Good day, my preferred schedule is Friday, October 31, 2025 from 9:30 AM to 11:00 AM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(3, NULL, 3, 4, 4, NULL, 'Mobile Learning Platform with Gamification', '2025-11-02 12:30:00', '2025-11-02 14:00:00', 'pending', 'Good day, my preferred schedule is Sunday, November 2, 2025 from 12:30 PM to 2:00 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(4, NULL, 4, 12, 12, NULL, 'Digital Classroom Management System for Elementary Education', '2025-10-29 11:00:00', '2025-10-29 12:30:00', 'pending', 'Good day, my preferred schedule is Wednesday, October 29, 2025 from 11:00 AM to 12:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(5, NULL, 5, 13, 13, NULL, 'Interactive Learning Modules for Mathematics', '2025-10-31 12:30:00', '2025-10-31 14:00:00', 'pending', 'Good day, my preferred schedule is Friday, October 31, 2025 from 12:30 PM to 2:00 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(6, NULL, 6, 14, 14, NULL, 'Student Assessment and Progress Tracking Platform', '2025-11-02 14:00:00', '2025-11-02 15:30:00', 'pending', 'Good day, my preferred schedule is Sunday, November 2, 2025 from 2:00 PM to 3:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(7, NULL, 7, 22, 22, NULL, 'Hotel Reservation and Management System', '2025-10-29 09:30:00', '2025-10-29 11:00:00', 'pending', 'Good day, my preferred schedule is Wednesday, October 29, 2025 from 9:30 AM to 11:00 AM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(8, NULL, 8, 23, 23, NULL, 'Tourism Destination Recommendation Platform', '2025-10-31 15:00:00', '2025-10-31 16:30:00', 'pending', 'Good day, my preferred schedule is Friday, October 31, 2025 from 3:00 PM to 4:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(9, NULL, 9, 24, 24, NULL, 'Restaurant Point of Sale and Inventory System', '2025-11-02 14:30:00', '2025-11-02 16:00:00', 'pending', 'Good day, my preferred schedule is Sunday, November 2, 2025 from 2:30 PM to 4:00 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:08', '2025-10-23 20:16:08'),
(10, NULL, 10, 32, 32, NULL, 'Business Intelligence Dashboard for SMEs', '2025-10-29 12:00:00', '2025-10-29 13:30:00', 'pending', 'Good day, my preferred schedule is Wednesday, October 29, 2025 from 12:00 PM to 1:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:09', '2025-10-23 20:16:09'),
(11, NULL, 11, 33, 33, NULL, 'Customer Relationship Management System', '2025-10-31 13:30:00', '2025-10-31 15:00:00', 'pending', 'Good day, my preferred schedule is Friday, October 31, 2025 from 1:30 PM to 3:00 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(12, NULL, 12, 34, 34, NULL, 'Supply Chain Management and Analytics Platform', '2025-11-02 15:30:00', '2025-11-02 17:00:00', 'pending', 'Good day, my preferred schedule is Sunday, November 2, 2025 from 3:30 PM to 5:00 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(13, NULL, 13, 42, 42, NULL, 'Laboratory Information Management System', '2025-10-29 15:30:00', '2025-10-29 17:00:00', 'pending', 'Good day, my preferred schedule is Wednesday, October 29, 2025 from 3:30 PM to 5:00 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(14, NULL, 14, 43, 43, NULL, 'Research Data Collection and Analysis Platform', '2025-10-31 12:00:00', '2025-10-31 13:30:00', 'pending', 'Good day, my preferred schedule is Friday, October 31, 2025 from 12:00 PM to 1:30 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(15, NULL, 15, 44, 44, NULL, 'Academic Publication Management System', '2025-11-02 13:30:00', '2025-11-02 15:00:00', 'pending', 'Good day, my preferred schedule is Sunday, November 2, 2025 from 1:30 PM to 3:00 PM. If this doesn\'t work, please let me know. Alternative schedules would be the following week or the same time on different days.', NULL, '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(16, 1, 1, 2, 2, 11, 'thesis #1', '2026-02-04 11:00:00', '2026-02-04 12:00:00', 'approved', 'notes #1', NULL, '2026-02-04 10:48:20', '2026-02-04 10:51:38'),
(17, 1, 2, 3, 3, 11, 'thesis #1', '2026-02-09 10:00:00', '2026-02-09 10:30:00', 'approved', 'notes #1', NULL, '2026-02-04 10:52:50', '2026-02-08 14:15:23'),
(18, 1, 1, 2, 2, 11, 'title #1', '2026-02-05 09:00:00', '2026-02-05 10:00:00', 'approved', 'notes #1', NULL, '2026-02-04 11:37:00', '2026-02-04 11:37:22'),
(22, NULL, 1, 2, 2, NULL, 'thesis #4', '2026-02-08 09:00:00', '2026-02-08 09:30:00', 'pending', NULL, NULL, '2026-02-08 12:25:57', '2026-02-08 12:25:57'),
(23, 1, 1, 2, 2, 11, 'for today\'s thesis #1', '2026-02-11 09:00:00', '2026-02-11 10:00:00', 'approved', 'for today\'s notes #1', NULL, '2026-02-10 20:46:23', '2026-02-10 20:48:52'),
(24, NULL, 2, 3, 3, NULL, 'for today\'s defense #2', '2026-02-10 09:00:00', '2026-02-10 10:00:00', 'pending', 'notes #2', NULL, '2026-02-10 20:51:17', '2026-02-10 20:51:17'),
(25, 1, 1, 2, 2, 11, 'thesis #3', '2026-02-12 08:00:00', '2026-02-12 09:00:00', 'approved', 'thesis #3', NULL, '2026-02-10 20:52:00', '2026-02-10 21:34:27'),
(26, 1, 2, 3, 3, 11, 'etw', '2026-02-12 10:00:00', '2026-02-12 11:00:00', 'approved', 'thesis #1', NULL, '2026-02-10 21:03:45', '2026-02-10 21:09:45'),
(27, NULL, 1, 2, 2, NULL, 'thesis #6', '2026-02-13 09:00:00', '2026-02-13 10:00:00', 'pending', 'thesis #6', NULL, '2026-02-10 21:11:28', '2026-02-10 21:11:28'),
(28, 1, 1, 2, 2, 11, 'Adviser 1 - Defense', '2026-02-17 09:00:00', '2026-02-17 10:00:00', 'approved', 'Adviser 1', NULL, '2026-02-17 20:50:58', '2026-02-17 21:05:49'),
(29, 1, 2, 3, 3, 11, 'defense 2', '2026-02-17 10:00:00', '2026-02-17 10:30:00', 'approved', 'hello', NULL, '2026-02-17 21:02:44', '2026-02-17 21:03:10'),
(30, 1, 1, 2, 2, 11, 'defense #43', '2026-02-24 09:00:00', '2026-02-24 10:00:00', 'cancelled', 'notes #4', NULL, '2026-02-20 12:53:20', '2026-02-20 13:02:28'),
(31, 1, 2, 3, 3, 11, 'defense #45', '2026-02-23 10:00:00', '2026-02-23 11:00:00', 'approved', 'notes #5', NULL, '2026-02-20 12:56:03', '2026-02-20 12:57:03'),
(32, 1, 3, 4, 4, 11, 'defense #56', '2026-02-23 13:00:00', '2026-02-23 14:00:00', 'approved', 'notes # 6', NULL, '2026-02-20 12:59:43', '2026-02-20 13:01:41'),
(33, NULL, 1, 2, 2, NULL, 'thesis #1', '2026-03-01 09:00:00', '2026-03-01 10:00:00', 'pending', NULL, NULL, '2026-03-01 15:17:51', '2026-03-01 15:17:51'),
(34, 1, 16, 52, 52, 11, 'thesis #5', '2026-03-01 10:00:00', '2026-03-01 11:00:00', 'approved', NULL, NULL, '2026-03-01 15:42:49', '2026-03-01 16:16:55');

INSERT INTO `departments` (`id`, `code`, `name`, `created_at`, `updated_at`) VALUES
(1, 'BSCS', 'Computer Studies', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(2, 'BSE', 'Education', '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(3, 'BSHTM', 'Hospitality and Tourism Management', '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(4, 'BSM', 'Business and Management', '2025-10-23 20:16:09', '2025-10-23 20:16:09'),
(5, 'BSAS', 'Arts and Sciences', '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(7, 'fsdfs', 'fsdlfkjsd', '2026-03-01 16:31:02', '2026-03-01 16:31:02'),
(8, 'BSIT', 'Composer Studies', '2026-03-01 16:40:15', '2026-03-01 16:40:15'),
(9, 'fdffd', 'fwdffds', '2026-03-01 16:45:48', '2026-03-01 16:45:48');

INSERT INTO `group_members` (`id`, `group_id`, `student_name`, `email`, `created_at`, `updated_at`) VALUES
(4, 2, 'Manuel Domingo', 'manuel.domingo.ofpf.2@student.cct.edu.ph', '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(5, 2, 'Eduardo Ramos', 'eduardo.ramos.ofpf.2@student.cct.edu.ph', '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(6, 2, 'Gabriela Jimenez', 'gabriela.jimenez.ofpf.2@student.cct.edu.ph', '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(7, 3, 'Gabriel Diaz', 'gabriel.diaz.ofpf.3@student.cct.edu.ph', '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(8, 3, 'Lucia Navarro', 'lucia.navarro.ofpf.3@student.cct.edu.ph', '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(9, 3, 'Rosa Castro', 'rosa.castro.ofpf.3@student.cct.edu.ph', '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(10, 4, 'Ana Valdez', 'ana.valdez.ofr.4@student.cct.edu.ph', '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(11, 4, 'Ramon Salazar', 'ramon.salazar.ofr.4@student.cct.edu.ph', '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(12, 4, 'Gabriela Alvarez', 'gabriela.alvarez.ofr.4@student.cct.edu.ph', '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(13, 5, 'Carmen Gonzales', 'carmen.gonzales.ofr.5@student.cct.edu.ph', '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(14, 5, 'Elena Bautista', 'elena.bautista.ofr.5@student.cct.edu.ph', '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(15, 5, 'Lucia Flores', 'lucia.flores.ofr.5@student.cct.edu.ph', '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(16, 6, 'Fernando Santiago', 'fernando.santiago.ofr.6@student.cct.edu.ph', '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(17, 6, 'Roberto Diaz', 'roberto.diaz.ofr.6@student.cct.edu.ph', '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(18, 6, 'Valentina Santos', 'valentina.santos.ofr.6@student.cct.edu.ph', '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(19, 7, 'Camila Santos', 'camila.santos.ofugz.7@student.cct.edu.ph', '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(20, 7, 'Natalia Rivera', 'natalia.rivera.ofugz.7@student.cct.edu.ph', '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(21, 7, 'Maria Castro', 'maria.castro.ofugz.7@student.cct.edu.ph', '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(22, 8, 'Jose Garcia', 'jose.garcia.ofugz.8@student.cct.edu.ph', '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(23, 8, 'Angelica Mendoza', 'angelica.mendoza.ofugz.8@student.cct.edu.ph', '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(24, 8, 'Patricia Pascual', 'patricia.pascual.ofugz.8@student.cct.edu.ph', '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(25, 9, 'Andres Villanueva', 'andres.villanueva.ofugz.9@student.cct.edu.ph', '2025-10-23 20:16:08', '2025-10-23 20:16:08'),
(26, 9, 'Camila Flores', 'camila.flores.ofugz.9@student.cct.edu.ph', '2025-10-23 20:16:08', '2025-10-23 20:16:08'),
(27, 9, 'Victoria Aguilar', 'victoria.aguilar.ofugz.9@student.cct.edu.ph', '2025-10-23 20:16:08', '2025-10-23 20:16:08'),
(28, 10, 'Manuel Torres', 'manuel.torres.ofz.10@student.cct.edu.ph', '2025-10-23 20:16:09', '2025-10-23 20:16:09'),
(29, 10, 'Lucia Santiago', 'lucia.santiago.ofz.10@student.cct.edu.ph', '2025-10-23 20:16:09', '2025-10-23 20:16:09'),
(30, 10, 'Ana Hernandez', 'ana.hernandez.ofz.10@student.cct.edu.ph', '2025-10-23 20:16:09', '2025-10-23 20:16:09'),
(31, 11, 'Miguel Castro', 'miguel.castro.ofz.11@student.cct.edu.ph', '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(32, 11, 'Eduardo Castillo', 'eduardo.castillo.ofz.11@student.cct.edu.ph', '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(33, 11, 'Pedro Jimenez', 'pedro.jimenez.ofz.11@student.cct.edu.ph', '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(34, 12, 'Diego Aguilar', 'diego.aguilar.ofz.12@student.cct.edu.ph', '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(35, 12, 'Patricia Torres', 'patricia.torres.ofz.12@student.cct.edu.ph', '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(36, 12, 'Camila Rojas', 'camila.rojas.ofz.12@student.cct.edu.ph', '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(37, 13, 'Francisco Perez', 'francisco.perez.ofnf.13@student.cct.edu.ph', '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(38, 13, 'Cristina Morales', 'cristina.morales.ofnf.13@student.cct.edu.ph', '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(39, 13, 'Juan Ramos', 'juan.ramos.ofnf.13@student.cct.edu.ph', '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(40, 14, 'Valentina Rojas', 'valentina.rojas.ofnf.14@student.cct.edu.ph', '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(41, 14, 'Luis Castro', 'luis.castro.ofnf.14@student.cct.edu.ph', '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(42, 14, 'Antonio Aquino', 'antonio.aquino.ofnf.14@student.cct.edu.ph', '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(43, 15, 'Pedro Pascual', 'pedro.pascual.ofnf.15@student.cct.edu.ph', '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(44, 15, 'Rafael Santos', 'rafael.santos.ofnf.15@student.cct.edu.ph', '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(45, 15, 'Lucia Castro', 'lucia.castro.ofnf.15@student.cct.edu.ph', '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(50, 16, 'PATRICK', 'member@example.com', '2026-03-01 15:40:58', '2026-03-01 15:40:58'),
(54, 1, 'Juan Morales', 'juan.morales.ofpf.1@student.cct.edu.ph', '2026-03-01 16:18:50', '2026-03-01 16:18:50'),
(55, 1, 'Angelica Salazar', 'angelica.salazar.ofpf.1@student.cct.edu.ph', '2026-03-01 16:18:50', '2026-03-01 16:18:50'),
(56, 1, 'Patricia Mercado', 'patricia.mercado.ofpf.1@student.cct.edu.ph', '2026-03-01 16:18:50', '2026-03-01 16:18:50'),
(57, 17, 'test', 'test@email.com', '2026-03-01 16:31:32', '2026-03-01 16:31:32');

INSERT INTO `groups` (`id`, `department_id`, `term_id`, `group_code`, `course_code`, `adviser_id`, `critic_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'BSCS01-THESIS-2025', 'CS101', 2, NULL, '2025-10-23 20:16:02', '2026-02-11 19:44:23'),
(2, 1, 1, 'BSCS02-THESIS-2025', NULL, 3, NULL, '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(3, 1, 1, 'BSCS03-THESIS-2025', NULL, 4, NULL, '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(4, 2, 1, 'BSE01-THESIS-2025', NULL, 12, NULL, '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(5, 2, 1, 'BSE02-THESIS-2025', NULL, 13, NULL, '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(6, 2, 1, 'BSE03-THESIS-2025', NULL, 14, NULL, '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(7, 3, 1, 'BSHTM01-THESIS-2025', NULL, 22, NULL, '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(8, 3, 1, 'BSHTM02-THESIS-2025', NULL, 23, NULL, '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(9, 3, 1, 'BSHTM03-THESIS-2025', NULL, 24, NULL, '2025-10-23 20:16:08', '2025-10-23 20:16:08'),
(10, 4, 1, 'BSM01-THESIS-2025', NULL, 32, NULL, '2025-10-23 20:16:09', '2025-10-23 20:16:09'),
(11, 4, 1, 'BSM02-THESIS-2025', NULL, 33, NULL, '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(12, 4, 1, 'BSM03-THESIS-2025', NULL, 34, NULL, '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(13, 5, 1, 'BSAS01-THESIS-2025', NULL, 42, NULL, '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(14, 5, 1, 'BSAS02-THESIS-2025', NULL, 43, NULL, '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(15, 5, 1, 'BSAS03-THESIS-2025', NULL, 44, NULL, '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(16, 1, 2, 'BSCS07-THESIS-2026', 'BSCS07', 52, 3, '2026-03-01 15:40:46', '2026-03-01 15:40:58'),
(17, 1, 2, 'test1', 'test2', 2, 4, '2026-03-01 16:31:32', '2026-03-01 16:31:32');

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(1, 'default', '{\"uuid\":\"48bbb175-d716-49b2-8ca8-15d59300c7fc\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:16;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770173300, 1770173300),
(2, 'default', '{\"uuid\":\"03d64fdb-4389-4fe2-a901-8f03df6e8fce\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:16;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:7:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser1.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist2.bscs@cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist3.bscs@cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"juan.morales.ofpf.1@student.cct.edu.ph\\\";}i:5;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"angelica.salazar.ofpf.1@student.cct.edu.ph\\\";}i:6;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"patricia.mercado.ofpf.1@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770173498, 1770173498),
(3, 'default', '{\"uuid\":\"5dd33d39-a2dc-40b2-bfe1-5d30bfdaff88\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:17;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770173570, 1770173570),
(4, 'default', '{\"uuid\":\"9efb8a31-d33d-4b9b-9bb8-4d4a8fc28312\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:18;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770176220, 1770176220),
(5, 'default', '{\"uuid\":\"6957a04e-4bbd-4c7f-8e99-8d4563472237\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:18;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:7:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser1.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist2.bscs@cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist3.bscs@cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"juan.morales.ofpf.1@student.cct.edu.ph\\\";}i:5;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"angelica.salazar.ofpf.1@student.cct.edu.ph\\\";}i:6;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"patricia.mercado.ofpf.1@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770176242, 1770176242),
(6, 'default', '{\"uuid\":\"85e52e88-1b1b-47ef-9a03-6d9b5b7dff97\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:19;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770524164, 1770524164),
(7, 'default', '{\"uuid\":\"44c9d811-df29-4ef5-8eaa-a41ebe063c98\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:20;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770524228, 1770524228),
(8, 'default', '{\"uuid\":\"0a14414f-310e-4722-bdc0-b1c6c554895e\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:21;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770524408, 1770524408),
(9, 'default', '{\"uuid\":\"afbb19d5-7035-45ae-92d6-3948ed6d261f\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:22;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770524757, 1770524757),
(10, 'default', '{\"uuid\":\"030d02d5-46d4-4cf5-8c94-c66e81059038\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:17;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:7:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser2.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist2.bscs@cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist3.bscs@cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:40:\\\"manuel.domingo.ofpf.2@student.cct.edu.ph\\\";}i:5;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:39:\\\"eduardo.ramos.ofpf.2@student.cct.edu.ph\\\";}i:6;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"gabriela.jimenez.ofpf.2@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770531323, 1770531323),
(11, 'default', '{\"uuid\":\"01cdd95c-9e15-4ce3-b6ca-268519f8dee4\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:23;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770727583, 1770727583),
(12, 'default', '{\"uuid\":\"206c091e-4bcd-4238-bbca-0bf5f1189efa\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:23;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:5:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser1.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"juan.morales.ofpf.1@student.cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"angelica.salazar.ofpf.1@student.cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"patricia.mercado.ofpf.1@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770727732, 1770727732),
(13, 'default', '{\"uuid\":\"b1ca6fcb-ec08-438a-bde0-33f0fe3d99d0\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:24;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770727877, 1770727877),
(14, 'default', '{\"uuid\":\"2065f740-4d80-40da-9240-8a587b7fffd5\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:25;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770727920, 1770727920),
(15, 'default', '{\"uuid\":\"55ac9649-cca4-42ae-a8d4-79680b65eae0\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:25;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:5:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser1.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser3.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"juan.morales.ofpf.1@student.cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"angelica.salazar.ofpf.1@student.cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"patricia.mercado.ofpf.1@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770728597, 1770728597),
(16, 'default', '{\"uuid\":\"70ec6127-7294-4bbf-a84d-c1fb68d713f9\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:26;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770728625, 1770728625),
(17, 'default', '{\"uuid\":\"e0a5af47-bf8e-4164-a235-d2349d0217e5\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:26;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:5:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser2.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:40:\\\"manuel.domingo.ofpf.2@student.cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:39:\\\"eduardo.ramos.ofpf.2@student.cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"gabriela.jimenez.ofpf.2@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770728986, 1770728986),
(18, 'default', '{\"uuid\":\"84f3abfd-ecbd-4812-8085-f7d2bf7229ba\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:27;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770729088, 1770729088),
(19, 'default', '{\"uuid\":\"1a5d02e7-3898-4c2e-a9d9-f781b4c857a9\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:25;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:5:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser1.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser3.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"juan.morales.ofpf.1@student.cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"angelica.salazar.ofpf.1@student.cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"patricia.mercado.ofpf.1@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1770730467, 1770730467),
(20, 'default', '{\"uuid\":\"07804672-29ec-4728-b296-164194d5950c\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:28;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771332658, 1771332658),
(21, 'default', '{\"uuid\":\"9121595e-4023-4a19-9dc4-54d945d41ae8\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:28;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:5:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser1.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"juan.morales.ofpf.1@student.cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"angelica.salazar.ofpf.1@student.cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"patricia.mercado.ofpf.1@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771332749, 1771332749),
(22, 'default', '{\"uuid\":\"3dcfc1f4-bcb7-4f8e-a10f-7c9a9880f759\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:29;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771333364, 1771333364),
(23, 'default', '{\"uuid\":\"fdc415d9-3f5a-4069-83f5-fcae046e2e1c\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:29;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:6:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser2.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist2.bscs@cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:40:\\\"manuel.domingo.ofpf.2@student.cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:39:\\\"eduardo.ramos.ofpf.2@student.cct.edu.ph\\\";}i:5;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"gabriela.jimenez.ofpf.2@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771333390, 1771333390),
(24, 'default', '{\"uuid\":\"d1ffb9ca-7eb5-42f3-8592-dda940a3c23c\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:28;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:5:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser1.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"juan.morales.ofpf.1@student.cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"angelica.salazar.ofpf.1@student.cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"patricia.mercado.ofpf.1@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771333533, 1771333533),
(25, 'default', '{\"uuid\":\"87bde52b-aa7d-4122-bb9b-742f9cac6a31\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:28;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:5:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser1.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"juan.morales.ofpf.1@student.cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"angelica.salazar.ofpf.1@student.cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"patricia.mercado.ofpf.1@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771333549, 1771333549),
(26, 'default', '{\"uuid\":\"26975b4f-e710-4afa-8116-e43b503b0298\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:30;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771563200, 1771563200),
(27, 'default', '{\"uuid\":\"a97bcb66-e876-4cb0-9aa6-961e6ab915c4\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:30;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:7:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser1.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist2.bscs@cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist3.bscs@cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"juan.morales.ofpf.1@student.cct.edu.ph\\\";}i:5;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"angelica.salazar.ofpf.1@student.cct.edu.ph\\\";}i:6;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"patricia.mercado.ofpf.1@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771563294, 1771563294),
(28, 'default', '{\"uuid\":\"69462711-ef05-4d00-9141-6b437854d7ae\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:31;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771563363, 1771563363),
(29, 'default', '{\"uuid\":\"9d267ca7-e6c4-4853-9c07-df5d9fdf8a28\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:31;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:7:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser2.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist2.bscs@cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist3.bscs@cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:40:\\\"manuel.domingo.ofpf.2@student.cct.edu.ph\\\";}i:5;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:39:\\\"eduardo.ramos.ofpf.2@student.cct.edu.ph\\\";}i:6;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"gabriela.jimenez.ofpf.2@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771563423, 1771563423),
(30, 'default', '{\"uuid\":\"ce4b318a-456c-4a98-b2d8-34616082950c\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:32;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771563583, 1771563583),
(31, 'default', '{\"uuid\":\"9df13adf-9227-4416-9002-96453d511256\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:32;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:5:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser3.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist3.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"gabriel.diaz.ofpf.3@student.cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:39:\\\"lucia.navarro.ofpf.3@student.cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:37:\\\"rosa.castro.ofpf.3@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771563656, 1771563656),
(32, 'default', '{\"uuid\":\"c21ba732-06d3-402f-af15-aa2ad438363d\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:32;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:5:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser3.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist3.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"gabriel.diaz.ofpf.3@student.cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:39:\\\"lucia.navarro.ofpf.3@student.cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:37:\\\"rosa.castro.ofpf.3@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771563701, 1771563701),
(33, 'default', '{\"uuid\":\"5f37b067-99c2-4e54-bcf6-228670cff433\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:30;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:7:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser1.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist2.bscs@cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist3.bscs@cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"juan.morales.ofpf.1@student.cct.edu.ph\\\";}i:5;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"angelica.salazar.ofpf.1@student.cct.edu.ph\\\";}i:6;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"patricia.mercado.ofpf.1@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771563742, 1771563742),
(34, 'default', '{\"uuid\":\"6e0a4700-fabd-4ae7-b0f1-bee176727bb6\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleCancelled\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:35:\\\"Bocum\\\\Mail\\\\DefenseScheduleCancelled\\\":3:{s:44:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleCancelled\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:30;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:7:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser1.bscs@cct.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist1.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist2.bscs@cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist3.bscs@cct.edu.ph\\\";}i:4;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:38:\\\"juan.morales.ofpf.1@student.cct.edu.ph\\\";}i:5;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"angelica.salazar.ofpf.1@student.cct.edu.ph\\\";}i:6;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:42:\\\"patricia.mercado.ofpf.1@student.cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1771563748, 1771563748),
(35, 'default', '{\"uuid\":\"8a3d5ea1-7546-40ed-800f-b678500b58ae\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:33;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1772349471, 1772349471),
(36, 'default', '{\"uuid\":\"41df0e82-a440-4c89-b9a8-1229a8394d20\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseProposalMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:30:\\\"Bocum\\\\Mail\\\\DefenseProposalMail\\\":4:{s:39:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:34;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:36:\\\"\\u0000Bocum\\\\Mail\\\\DefenseProposalMail\\u0000user\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"Bocum\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:52;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:27:\\\"coordinator.bscs@cct.edu.ph\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1772350969, 1772350969),
(37, 'default', '{\"uuid\":\"be0b6734-1c13-4c3b-a4c3-848f38efea42\",\"displayName\":\"Bocum\\\\Mail\\\\DefenseScheduleApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:34:\\\"Bocum\\\\Mail\\\\DefenseScheduleApproved\\\":3:{s:43:\\\"\\u0000Bocum\\\\Mail\\\\DefenseScheduleApproved\\u0000defense\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:20:\\\"Bocum\\\\Models\\\\Defense\\\";s:2:\\\"id\\\";i:34;s:9:\\\"relations\\\";a:4:{i:0;s:7:\\\"adviser\\\";i:1;s:9:\\\"panelists\\\";i:2;s:5:\\\"group\\\";i:3;s:13:\\\"group.members\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:4:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:20:\\\"adviser7@bscs.edu.ph\\\";}i:1;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"adviser2.bscs@cct.edu.ph\\\";}i:2;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:25:\\\"panelist3.bscs@cct.edu.ph\\\";}i:3;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:18:\\\"member@example.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1772353015, 1772353015);

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
(15, '2025_10_06_135652_add_event_column_to_activity_log_table', 1),
(16, '2025_10_06_135653_add_batch_uuid_column_to_activity_log_table', 1),
(17, '2026_02_11_194023_add_course_code_to_groups_table', 2);

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
(1, 'manage defenses', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(2, 'view defenses', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(3, 'create defenses', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(4, 'edit defenses', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(5, 'delete defenses', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(6, 'manage schedule', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(7, 'view calendar', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(8, 'manage terms', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(9, 'manage rooms', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(10, 'manage coordinators', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02');

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
(1, 'coordinator', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(2, 'admin', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(3, 'adviser', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(4, 'critic', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(5, 'panelist', 'web', '2025-10-23 20:16:02', '2025-10-23 20:16:02');

INSERT INTO `rooms` (`id`, `room_number`, `building`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'CS-101', 'Main Building', 1, '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(2, 'CS-102', 'Main Building', 1, '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(3, 'CS-201', 'Main Building', 1, '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(4, 'CS-202', 'Main Building', 1, '2025-10-23 20:16:02', '2025-10-23 20:16:02');

INSERT INTO `terms` (`id`, `school_year`, `semester`, `is_current`, `created_at`, `updated_at`) VALUES
(1, '2025-2026', '1st Semester', 0, '2025-10-23 20:16:02', '2026-02-20 13:11:40'),
(2, '2026-2027', '1st semester', 1, '2026-02-20 13:11:40', '2026-02-20 13:11:40');

INSERT INTO `users` (`id`, `department_id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Admin', 'admin@cct.edu.ph', '2025-10-23 20:16:02', '$2y$12$ZOV8LB9ywzUfYnFiHQuHPukQxwyoe5bCW0mbJvZ3ZQNsejZzgDMQC', NULL, '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(2, 1, 'Adviser 1 (BSCS)', 'adviser1.bscs@cct.edu.ph', NULL, '$2y$12$P7Mc6pmoReuDhHXo2YwQUuzphMsgmslDDprPpEzgOnn83VaTfW3gq', '5gt2pkLyb1CuXmtWy7inu9JFO6BuLYztiDbQ5F5xrs8GgZSwtRB5SrfE37ou', '2025-10-23 20:16:02', '2025-10-23 20:16:02'),
(3, 1, 'Adviser 2 (BSCS)', 'adviser2.bscs@cct.edu.ph', NULL, '$2y$12$ylwGAiZSBYbOTCWEiFHjiOpI96s5Un8wVWdvhFxVQSV1gUZifnx0G', NULL, '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(4, 1, 'Adviser 3 (BSCS)', 'adviser3.bscs@cct.edu.ph', NULL, '$2y$12$/MZcq7lA9EQPUVkq761zm.LkMcoEK5v1HjEJNIHArCaBGdjMqpWJC', NULL, '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(5, 1, 'Critic 1 (BSCS)', 'critic1.bscs@cct.edu.ph', NULL, '$2y$12$9EfAQ42LPz7O00v9tM2xFOtNIAq1bk7eJYS58bsJ4tc3eFf/vkx72', NULL, '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(6, 1, 'Critic 2 (BSCS)', 'critic2.bscs@cct.edu.ph', NULL, '$2y$12$vNcv6fJ95yDJWD6P5Iid6eCW7fDPMGQewTqYn9Qzw1JVzTT6wuuKa', NULL, '2025-10-23 20:16:03', '2025-10-23 20:16:03'),
(7, 1, 'Critic 3 (BSCS)', 'critic3.bscs@cct.edu.ph', NULL, '$2y$12$7oX6uU37ViKzeGfEm6Bgmuy6gQgU/q9pyhIraUgd1Asmeb9N9lJny', NULL, '2025-10-23 20:16:04', '2025-10-23 20:16:04'),
(8, 1, 'Panelist 1 (BSCS)', 'panelist1.bscs@cct.edu.ph', NULL, '$2y$12$2HmG2xL1a8r4wNBY2kHLgOm7w8g/RK0tLg7zkGMg/XUr4RVjQxmAa', NULL, '2025-10-23 20:16:04', '2025-10-23 20:16:04'),
(9, 1, 'Panelist 2 (BSCS)', 'panelist2.bscs@cct.edu.ph', NULL, '$2y$12$I5UGt5DSHkVAGT3NqPMz9esp2QsFoBmh2hmR5CSGLz7.YWZ/0nG7S', NULL, '2025-10-23 20:16:04', '2025-10-23 20:16:04'),
(10, 1, 'Panelist 3 (BSCS)', 'panelist3.bscs@cct.edu.ph', NULL, '$2y$12$dePSZBP5L/ody5AoQrVWRepcMFMtF/hWn85FdmxTgcLxPOk12oOBK', NULL, '2025-10-23 20:16:04', '2025-10-23 20:16:04'),
(11, 1, 'Coordinator (BSCS)', 'coordinator.bscs@cct.edu.ph', NULL, '$2y$12$K8hqXEu7s5u8xfMK5c/H5OylJQo7uGy268kWAftkzGhxCTpG46Nqu', NULL, '2025-10-23 20:16:04', '2025-10-23 20:16:04'),
(12, 2, 'Adviser 1 (BSE)', 'adviser1.bse@cct.edu.ph', NULL, '$2y$12$7Ar4OuuY73gbv71R.GZtN.qaoFqTE3qsyyKqnRW3vLFVJkVi15Tuq', NULL, '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(13, 2, 'Adviser 2 (BSE)', 'adviser2.bse@cct.edu.ph', NULL, '$2y$12$9SK56Vl9xQZNv693gl02ouszPhZpg1KR0nuIANX3sMTr7/utQNw2i', NULL, '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(14, 2, 'Adviser 3 (BSE)', 'adviser3.bse@cct.edu.ph', NULL, '$2y$12$0kWf.O0/vzX/iEq5b9div.4n70l9hSjCb7dY9iNOw.d2rGtMwzBx6', NULL, '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(15, 2, 'Critic 1 (BSE)', 'critic1.bse@cct.edu.ph', NULL, '$2y$12$uN1urUE3.beho8D8OUBjVejqVGwJfFQgsvd4A7CC28pfjqTO4imb6', NULL, '2025-10-23 20:16:05', '2025-10-23 20:16:05'),
(16, 2, 'Critic 2 (BSE)', 'critic2.bse@cct.edu.ph', NULL, '$2y$12$g4zYUfsDITCbMHd7UVQMIeEwGd63/NV8K3VKosO8tXt0uAcDm7mLq', NULL, '2025-10-23 20:16:06', '2025-10-23 20:16:06'),
(17, 2, 'Critic 3 (BSE)', 'critic3.bse@cct.edu.ph', NULL, '$2y$12$LCvgLdC1gTylq0rNYIe74OAuPahspYhAgUm8w0.IDXlOS5a5o7xnu', NULL, '2025-10-23 20:16:06', '2025-10-23 20:16:06'),
(18, 2, 'Panelist 1 (BSE)', 'panelist1.bse@cct.edu.ph', NULL, '$2y$12$OHw4pEJHjsCgMaju0HRUS.SWr4ccApzFWSOpA00OM/hrt1t9BrUNe', NULL, '2025-10-23 20:16:06', '2025-10-23 20:16:06'),
(19, 2, 'Panelist 2 (BSE)', 'panelist2.bse@cct.edu.ph', NULL, '$2y$12$qm7eHglAwVPkU0.qiTfLW.CBL7SHAc3b5jDWrl5foQWKwqgBFtKq6', NULL, '2025-10-23 20:16:06', '2025-10-23 20:16:06'),
(20, 2, 'Panelist 3 (BSE)', 'panelist3.bse@cct.edu.ph', NULL, '$2y$12$YC6x0rXGQpJZCCBlr460k.LAdK/Q6/jbETgFkduhxUSyqwscBV..S', NULL, '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(21, 2, 'Coordinator (BSE)', 'coordinator.bse@cct.edu.ph', NULL, '$2y$12$hVlF/Ibgs0NIrEHzoATPwOmwvnaPjZcR8EXWVM7Gt.6iTOIx2VJa6', NULL, '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(22, 3, 'Adviser 1 (BSHTM)', 'adviser1.bshtm@cct.edu.ph', NULL, '$2y$12$o/2Z3EkVIxZvethknFao5eo3mNQCN7LdIS5XX.RrMZb7eSn2Ry4Ea', NULL, '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(23, 3, 'Adviser 2 (BSHTM)', 'adviser2.bshtm@cct.edu.ph', NULL, '$2y$12$pBr8Caw8dUUB3im/iX3AEe4w5PS4rU5B.KqPm4gCoGmVTPYE7kfz6', NULL, '2025-10-23 20:16:07', '2025-10-23 20:16:07'),
(24, 3, 'Adviser 3 (BSHTM)', 'adviser3.bshtm@cct.edu.ph', NULL, '$2y$12$wkP8mSGj0fOKcC7Iu0ifgelAgcTQiK/TLwKa0CyBEMzD8.h5R4h4C', NULL, '2025-10-23 20:16:08', '2025-10-23 20:16:08'),
(25, 3, 'Critic 1 (BSHTM)', 'critic1.bshtm@cct.edu.ph', NULL, '$2y$12$.zd7bN7.gnJNCIAD5uQ/AObgTp.QcGo70KvM456QZGg9ZfNLUwnpu', NULL, '2025-10-23 20:16:08', '2025-10-23 20:16:08'),
(26, 3, 'Critic 2 (BSHTM)', 'critic2.bshtm@cct.edu.ph', NULL, '$2y$12$OiLzunq1q6TPFQQ68g4jD.97/Ix636vPxljAoHoIMblbnLuurHopy', NULL, '2025-10-23 20:16:08', '2025-10-23 20:16:08'),
(27, 3, 'Critic 3 (BSHTM)', 'critic3.bshtm@cct.edu.ph', NULL, '$2y$12$zePH7AsjcEapa3zuqt6/S.IB8mOmkCsNJN9pB4GVVQppENemytgmO', NULL, '2025-10-23 20:16:08', '2025-10-23 20:16:08'),
(28, 3, 'Panelist 1 (BSHTM)', 'panelist1.bshtm@cct.edu.ph', NULL, '$2y$12$BfedYUTEaBdLThovXyoi7eX5PU5hhUDhWCygOmChkLJB0V2gXY5jW', NULL, '2025-10-23 20:16:08', '2025-10-23 20:16:08'),
(29, 3, 'Panelist 2 (BSHTM)', 'panelist2.bshtm@cct.edu.ph', NULL, '$2y$12$NfGjIfkgrEAqevkBbN4JPupRy9YygpB1uc6l7F3UNuS5wcj5wChB2', NULL, '2025-10-23 20:16:09', '2025-10-23 20:16:09'),
(30, 3, 'Panelist 3 (BSHTM)', 'panelist3.bshtm@cct.edu.ph', NULL, '$2y$12$Yj.GJCvdvU5z6zeLlL..ne0sf0a4nKrya/vz38AhtkzDcynsrgauG', NULL, '2025-10-23 20:16:09', '2025-10-23 20:16:09'),
(31, 3, 'Coordinator (BSHTM)', 'coordinator.bshtm@cct.edu.ph', NULL, '$2y$12$pp4qC.W.8KXIQMP2.S7OJOFu1FbO5A9I1szhgs7zAkIdILeUbfcdu', NULL, '2025-10-23 20:16:09', '2025-10-23 20:16:09'),
(32, 4, 'Adviser 1 (BSM)', 'adviser1.bsm@cct.edu.ph', NULL, '$2y$12$TKPxWEmr8pPNPsUv2gNfoOPlJ3p9osgE72KIHQZ187JU0mz8WV2Na', NULL, '2025-10-23 20:16:09', '2025-10-23 20:16:09'),
(33, 4, 'Adviser 2 (BSM)', 'adviser2.bsm@cct.edu.ph', NULL, '$2y$12$2/hsrPdxHlXc39xsjBVme.SDaud5Rb9Kd9duzRRPcq7aIR4G71p3e', NULL, '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(34, 4, 'Adviser 3 (BSM)', 'adviser3.bsm@cct.edu.ph', NULL, '$2y$12$0UPlYOzHwGb3Z7jMX..TDOxwG4mwUv5ly82hJEpb8na4aOp5El3hm', NULL, '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(35, 4, 'Critic 1 (BSM)', 'critic1.bsm@cct.edu.ph', NULL, '$2y$12$IrWet22BgCHPWc1YbJuZ2.P4/9MKXU9Cwi64JLTaAty0iKVD4eSVW', NULL, '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(36, 4, 'Critic 2 (BSM)', 'critic2.bsm@cct.edu.ph', NULL, '$2y$12$WvXrTElGGOwjIhZI5S4AHufmPbu4uQQZ7M4GexgL796006vMTy8KS', NULL, '2025-10-23 20:16:10', '2025-10-23 20:16:10'),
(37, 4, 'Critic 3 (BSM)', 'critic3.bsm@cct.edu.ph', NULL, '$2y$12$IeIjsjn5zSlFjW/e3mAzTeH7r.upPJKXtfSXZ.gs0kmh3Nfs8tH0e', NULL, '2025-10-23 20:16:11', '2025-10-23 20:16:11'),
(38, 4, 'Panelist 1 (BSM)', 'panelist1.bsm@cct.edu.ph', NULL, '$2y$12$CjxoXJG/Xsr571DwY2va7.h7IjZU5da/nm29.U.Yu3AAmsofIxIIa', NULL, '2025-10-23 20:16:11', '2025-10-23 20:16:11'),
(39, 4, 'Panelist 2 (BSM)', 'panelist2.bsm@cct.edu.ph', NULL, '$2y$12$GyEqX5sdueNrsAsWsZ0o.OoZH7Q02wTw20.dM8rbgF2n5B/CJjwCG', NULL, '2025-10-23 20:16:11', '2025-10-23 20:16:11'),
(40, 4, 'Panelist 3 (BSM)', 'panelist3.bsm@cct.edu.ph', NULL, '$2y$12$61xkBkUKZJe423Novt/uze3BE1wp3GPeC6/QF3HOLFsTi6UjRfejO', NULL, '2025-10-23 20:16:11', '2025-10-23 20:16:11'),
(41, 4, 'Coordinator (BSM)', 'coordinator.bsm@cct.edu.ph', NULL, '$2y$12$iQRbmOGlgOOjKAu3.iOc9u0x6IqMB/xPi3hFhdxFTJppnDkBTaJWS', NULL, '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(42, 5, 'Adviser 1 (BSAS)', 'adviser1.bsas@cct.edu.ph', NULL, '$2y$12$WDtgsDVVvOXGwivcFz9iCOI1VDibyTKCVBKqLLdAuPm0sTrhFqzz.', NULL, '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(43, 5, 'Adviser 2 (BSAS)', 'adviser2.bsas@cct.edu.ph', NULL, '$2y$12$OvN0Hd4jV1OjYKwFQGBhou1/LRcuSgrg8w7T8pt8iv6BsnrQME4au', NULL, '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(44, 5, 'Adviser 3 (BSAS)', 'adviser3.bsas@cct.edu.ph', NULL, '$2y$12$LZpT25ffNjnwry5XFCT44.N2aNd3X0pvMVCJT2JnP9dRSE9fC3vIi', NULL, '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(45, 5, 'Critic 1 (BSAS)', 'critic1.bsas@cct.edu.ph', NULL, '$2y$12$LtlYmVPR4W77SKPXQ7/tu..X1a5EqQqfDM9t.zNSiHsMj9ADM0DOO', NULL, '2025-10-23 20:16:12', '2025-10-23 20:16:12'),
(46, 5, 'Critic 2 (BSAS)', 'critic2.bsas@cct.edu.ph', NULL, '$2y$12$Q2RKaP.FIRBwEKOvcp0w3uZ28jq0x3XtZEpFcdlApfiQ93UooKyRy', NULL, '2025-10-23 20:16:13', '2025-10-23 20:16:13'),
(47, 5, 'Critic 3 (BSAS)', 'critic3.bsas@cct.edu.ph', NULL, '$2y$12$cDqz60G9SSHAFFSnfR6OTOCOmWfLCFyhmYMcyPwFSuvvOj2VABgZi', NULL, '2025-10-23 20:16:13', '2025-10-23 20:16:13'),
(48, 5, 'Panelist 1 (BSAS)', 'panelist1.bsas@cct.edu.ph', NULL, '$2y$12$4R7bRmyYFlEdK4iYQqqnGex6EsaB60oYRwnw8.pBTvJvmW0blgnGO', NULL, '2025-10-23 20:16:13', '2025-10-23 20:16:13'),
(49, 5, 'Panelist 2 (BSAS)', 'panelist2.bsas@cct.edu.ph', NULL, '$2y$12$.Bevejcjm5Mmh0t8nKWK9eG8d6SdtNSITmcaXZ7GCoZVmxAT/ALUq', NULL, '2025-10-23 20:16:13', '2025-10-23 20:16:13'),
(50, 5, 'Panelist 3 (BSAS)', 'panelist3.bsas@cct.edu.ph', NULL, '$2y$12$W7Phbs14TdTuGjV1d2EPXODTpMDNvRShwd7RIDbu9zJkJsrtYio4y', NULL, '2025-10-23 20:16:14', '2025-10-23 20:16:14'),
(51, 5, 'Coordinator (BSAS)', 'coordinator.bsas@cct.edu.ph', NULL, '$2y$12$mDcdw1/y1jeZjoSyaLGXFuL9ZFFAduhXvM.x05fVFzhlb6ILvFcOS', NULL, '2025-10-23 20:16:14', '2025-10-23 20:16:14'),
(52, 1, 'adviser 3 (BSIT)', 'adviser7@bscs.edu.ph', NULL, '$2y$12$n/licF3VDdErj4BM.paqJueDz8mzRkFI8H8OjuktFPRMAPrpIgmBu', NULL, '2026-03-01 15:39:28', '2026-03-01 15:39:28');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
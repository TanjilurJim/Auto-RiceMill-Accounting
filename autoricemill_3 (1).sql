-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 06, 2025 at 05:45 AM
-- Server version: 8.0.38
-- PHP Version: 8.3.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `autoricemill_3`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_groups`
--

CREATE TABLE `account_groups` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `nature_id` bigint UNSIGNED DEFAULT NULL,
  `group_under_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account_groups`
--

INSERT INTO `account_groups` (`id`, `name`, `description`, `created_by`, `created_at`, `updated_at`, `deleted_at`, `nature_id`, `group_under_id`) VALUES
(1, 'Fixed Assets', 'Description', 2, '2025-03-18 00:38:01', '2025-03-19 00:10:34', NULL, 1, NULL),
(2, 'Satyajit GoC', NULL, 2, '2025-03-18 00:41:16', '2025-03-18 01:13:32', '2025-03-18 01:13:32', 1, 1),
(3, 'Current Assets', NULL, 6, '2025-03-18 01:01:41', '2025-03-19 00:11:12', NULL, 1, NULL),
(4, 'Sundry Debtors', NULL, 1, '2025-03-18 01:07:48', '2025-03-19 00:11:55', NULL, 1, 2),
(5, 'test55', NULL, 1, '2025-03-19 00:18:07', '2025-03-19 00:18:07', NULL, 1, 24);

-- --------------------------------------------------------

--
-- Table structure for table `account_ledgers`
--

CREATE TABLE `account_ledgers` (
  `id` bigint UNSIGNED NOT NULL,
  `reference_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_ledger_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opening_balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `closing_balance` decimal(12,2) DEFAULT NULL,
  `debit_credit` enum('debit','credit') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `account_group_id` bigint UNSIGNED DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `for_transition_mode` tinyint(1) NOT NULL DEFAULT '0',
  `mark_for_user` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `group_under_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account_ledgers`
--

INSERT INTO `account_ledgers` (`id`, `reference_number`, `account_ledger_name`, `phone_number`, `email`, `opening_balance`, `closing_balance`, `debit_credit`, `status`, `account_group_id`, `address`, `for_transition_mode`, `mark_for_user`, `created_by`, `created_at`, `updated_at`, `deleted_at`, `group_under_id`) VALUES
(1, 'RL8ORBPER9PX', 'Ali Traders (Abu Taher)', '01309655677', 'j.jayesha001@gmail.com', 100.00, 70.00, 'credit', 'active', NULL, NULL, 1, 1, 1, '2025-03-18 02:49:44', '2025-04-03 12:38:12', NULL, 21),
(2, '	RL8ORBPER10PX', 'Arif Enterprise', '01309655677', 'j.jayesha001@gmail.com', 100.00, NULL, 'debit', 'active', 1, NULL, 1, 1, 1, '2025-03-18 02:51:12', '2025-03-22 03:47:58', NULL, NULL),
(3, '	RL9ORBPER9PX', 'Abdullah Enterprise', '01309655677', 'j.jayesha001@gmail.com', 100.00, NULL, 'credit', 'active', 3, 'afsdaf', 1, 1, 1, '2025-03-18 21:59:43', '2025-03-22 03:48:16', NULL, NULL),
(4, NULL, 'Ma Babar Dua Traders (Altaf Hossen)', '01309655677', 'j.jayesha001@gmail.com', 470200.00, 470150.00, 'debit', 'active', NULL, NULL, 1, 1, 1, '2025-03-19 00:25:59', '2025-03-25 23:05:33', NULL, 21),
(5, 'RLH55ZPVGSDG', 'Elham Auto test Ledger', '01309655677', 'j.jayesha001@gmail.com', 101.00, NULL, 'debit', 'active', NULL, NULL, 1, 1, 2, '2025-03-20 02:15:50', '2025-03-24 23:07:30', NULL, 2),
(6, NULL, 'bazar cost', '01309655677', 'j.jayesha001@gmail.com', 1000.00, NULL, 'debit', 'active', NULL, NULL, 1, 1, 6, '2025-03-20 03:41:59', '2025-03-20 03:41:59', NULL, 9),
(7, NULL, 'Urmi Traders (Anowar Mia)', '01898440581', NULL, 1306135.00, NULL, 'debit', 'active', NULL, NULL, 1, 1, 1, '2025-03-22 03:37:56', '2025-03-22 03:37:56', NULL, 21),
(8, 'RL8ORBPER9PV', 'Awolia Traders', '01309655677', 'tanjilurrahman21@gmail.com', 1588.00, 1568.00, 'credit', 'active', NULL, 'afsdaf', 1, 1, 1, '2025-03-24 21:58:25', '2025-03-25 22:48:36', NULL, 20),
(9, 'RLH55ZPVGSCG', 'Elham Auto test Ledger 2', '01924488203', 'tanjilurrahman21@gmail.com', 500.00, NULL, 'debit', 'active', NULL, 'asdf', 1, 1, 2, '2025-03-24 23:07:55', '2025-03-24 23:07:55', NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel_cache_spatie.permission.cache', 'a:3:{s:5:\"alias\";a:5:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"f\";s:11:\"description\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:6:{i:0;a:5:{s:1:\"a\";i:3;s:1:\"b\";s:12:\"assign-roles\";s:1:\"c\";s:3:\"web\";s:1:\"f\";s:21:\"Assign roles to users\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:1;a:5:{s:1:\"a\";i:4;s:1:\"b\";s:12:\"manage-roles\";s:1:\"c\";s:3:\"web\";s:1:\"f\";s:19:\"Full CRUD for roles\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:2;a:5:{s:1:\"a\";i:5;s:1:\"b\";s:18:\"manage-permissions\";s:1:\"c\";s:3:\"web\";s:1:\"f\";s:25:\"Full CRUD for permissions\";s:1:\"r\";a:1:{i:0;i:1;}}i:3;a:5:{s:1:\"a\";i:6;s:1:\"b\";s:14:\"view-dashboard\";s:1:\"c\";s:3:\"web\";s:1:\"f\";s:28:\"Access to the dashboard page\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:4;a:5:{s:1:\"a\";i:7;s:1:\"b\";s:12:\"manage-users\";s:1:\"c\";s:3:\"web\";s:1:\"f\";s:32:\"View, create, edit, delete users\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:5;a:5:{s:1:\"a\";i:8;s:1:\"b\";s:5:\"dummy\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:2;}}}s:5:\"roles\";a:3:{i:0;a:3:{s:1:\"a\";i:1;s:1:\"b\";s:5:\"admin\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:7:\"manager\";s:1:\"c\";s:3:\"web\";}i:2;a:3:{s:1:\"a\";i:3;s:1:\"b\";s:6:\"Editor\";s:1:\"c\";s:3:\"web\";}}}', 1743788318);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Reject Inventory', 1, NULL, '2025-03-20 02:18:07', '2025-03-20 02:18:07'),
(2, 'By products', 1, NULL, '2025-03-20 02:18:11', '2025-03-20 02:18:11'),
(3, 'Spare parts', 1, NULL, '2025-03-20 02:18:13', '2025-03-20 02:18:13'),
(4, 'Bag', 1, NULL, '2025-03-20 02:18:15', '2025-03-20 02:18:15'),
(5, 'Paddy', 1, NULL, '2025-03-20 02:18:17', '2025-03-20 02:18:17'),
(6, 'Rice', 1, NULL, '2025-03-20 02:18:18', '2025-03-20 02:18:24'),
(7, 'batla house', 6, NULL, '2025-03-20 03:46:20', '2025-03-20 03:46:20');

-- --------------------------------------------------------

--
-- Table structure for table `company_settings`
--

CREATE TABLE `company_settings` (
  `id` bigint UNSIGNED NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mailing_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `financial_year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `logo_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `financial_year_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company_settings`
--

INSERT INTO `company_settings` (`id`, `created_by`, `company_name`, `mailing_name`, `country`, `email`, `website`, `financial_year`, `mobile`, `address`, `description`, `logo_path`, `created_at`, `updated_at`, `financial_year_id`) VALUES
(1, 2, 'Elham Auto', 'Elham', 'Bangladesh', 'elhamauto@gmail.com', NULL, NULL, '01521584092', NULL, NULL, NULL, '2025-03-26 00:40:41', '2025-03-26 01:14:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `financial_years`
--

CREATE TABLE `financial_years` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_closed` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `financial_years`
--

INSERT INTO `financial_years` (`id`, `title`, `start_date`, `end_date`, `is_closed`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '2024-2025', '2025-04-14', '2025-04-14', 0, 1, '2025-03-26 02:32:32', '2025-03-26 02:34:07');

-- --------------------------------------------------------

--
-- Table structure for table `godowns`
--

CREATE TABLE `godowns` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `godown_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `godowns`
--

INSERT INTO `godowns` (`id`, `name`, `godown_code`, `address`, `created_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Malibagh', 'GD-829-1', NULL, 1, NULL, '2025-03-20 02:16:46', '2025-03-20 02:16:46'),
(2, 'Arnob Godown', 'GD-964-2', 'Godown for Arnob', 6, NULL, '2025-03-20 02:27:46', '2025-03-20 02:27:46'),
(3, 'elham godown', 'GD-119-3', NULL, 2, NULL, '2025-03-20 02:32:47', '2025-03-20 02:32:47');

-- --------------------------------------------------------

--
-- Table structure for table `group_unders`
--

CREATE TABLE `group_unders` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `group_unders`
--

INSERT INTO `group_unders` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Fixed Assets', NULL, NULL),
(2, 'Current Assets', NULL, NULL),
(3, 'Misc. Expenses (Asset)', NULL, NULL),
(4, 'Capital Account', NULL, NULL),
(5, 'Loans (Liability)', NULL, NULL),
(6, 'Current Liabilities', NULL, NULL),
(7, 'Sundry Debtors', NULL, NULL),
(8, 'Sundry Creditors', NULL, NULL),
(9, 'Direct Expenses', NULL, NULL),
(10, 'Direct Income', NULL, NULL),
(11, 'Indirect Expenses', NULL, NULL),
(12, 'Indirect Income', NULL, NULL),
(13, 'Vehicles & Transportation', NULL, NULL),
(14, 'Machinery & Tools', NULL, NULL),
(15, 'Deposit (Assets)', NULL, NULL),
(16, 'Loan & Advance (Asset)', NULL, NULL),
(17, 'Cash-in-Hand', NULL, NULL),
(18, 'Bank Account', NULL, NULL),
(19, 'Secured Loans', NULL, NULL),
(20, 'Supplier Summary', NULL, NULL),
(21, 'Customer Summary', NULL, NULL),
(22, 'Wastage Party', NULL, NULL),
(23, 'Transportation', NULL, NULL),
(24, 'Land & Land Development', NULL, NULL),
(25, 'Long Term Loan', NULL, NULL),
(26, 'Non Current Liabilities', NULL, NULL),
(27, 'Inter Company Transaction', NULL, NULL),
(28, 'Advance Deposit and Pre-Payment', NULL, NULL),
(29, 'Short Term Loan', NULL, NULL),
(30, 'Selling & Distribution Exp', NULL, NULL),
(31, 'Administrative Overhead', NULL, NULL),
(32, 'Non Operating Income', NULL, NULL),
(33, 'Financial Expenses', NULL, NULL),
(34, 'ERT', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` bigint UNSIGNED NOT NULL,
  `item_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `unit_id` bigint UNSIGNED NOT NULL,
  `godown_id` bigint UNSIGNED NOT NULL,
  `purchase_price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `sale_price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `previous_stock` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_previous_stock_value` decimal(15,2) NOT NULL DEFAULT '0.00',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by` bigint UNSIGNED NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `item_name`, `item_code`, `category_id`, `unit_id`, `godown_id`, `purchase_price`, `sale_price`, `previous_stock`, `total_previous_stock_value`, `description`, `created_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'TDS Meter', 'ITM0001', 3, 3, 1, 0.00, 0.00, 0.00, 0.00, NULL, 1, NULL, '2025-03-20 02:23:33', '2025-03-24 03:11:30'),
(2, 'elham', 'ITM0002', 1, 1, 1, 0.00, 0.00, 2.00, 0.00, NULL, 2, NULL, '2025-03-20 02:24:25', '2025-03-23 22:02:30'),
(3, 'arnob', 'ITM0003', 1, 1, 1, 0.00, 0.00, 0.00, 0.00, NULL, 6, NULL, '2025-03-20 02:24:49', '2025-03-20 02:24:49'),
(4, 'Ph Meter', 'ITM0004', 2, 3, 2, 0.00, 0.00, 0.00, 0.00, NULL, 6, NULL, '2025-03-20 02:31:15', '2025-03-24 03:14:18'),
(5, 'elham 222', 'ITM0005', 1, 2, 3, 0.00, 0.00, 0.00, 0.00, NULL, 2, NULL, '2025-03-20 02:35:36', '2025-03-20 02:36:26'),
(6, '49 paddy', 'ITM0006', 5, 3, 1, 36.50, 0.00, 5000.00, 0.00, NULL, 1, NULL, '2025-03-21 23:33:34', '2025-03-21 23:33:34'),
(7, 'Paddy BR-22', 'ITM0007', 5, 1, 1, 11.00, 10.00, 500.00, 0.00, NULL, 1, NULL, '2025-03-22 03:42:07', '2025-03-22 03:42:07');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_03_16_082249_create_permission_tables', 2),
(5, '2025_03_17_041117_add_phone_address_status_to_users_table', 3),
(6, '2025_03_17_045019_add_soft_deletes_to_users_table', 4),
(7, '2025_03_17_062013_add_description_to_permissions_table', 5),
(8, '2025_03_17_070156_add_created_by_to_users_table', 6),
(9, '2025_03_18_042604_create_account_groups_table', 7),
(10, '2025_03_18_044255_add_deleted_at_to_account_groups_table', 8),
(11, '2025_03_18_055902_create_natures_table', 9),
(12, '2025_03_18_062046_create_group_unders_table', 10),
(13, '2025_03_18_062730_update_account_groups_with_foreign_keys', 11),
(14, '2025_03_18_072701_create_account_ledgers_table', 12),
(15, '2025_03_18_082219_add_group_under_id_to_account_ledgers_table', 13),
(16, '2025_03_18_082746_make_group_under_id_nullable_in_account_ledgers', 14),
(23, '2025_03_18_084403_add_group_under_id_to_account_ledgers_table', 15),
(24, '2025_03_19_035741_create_salesmen_table', 15),
(25, '2025_03_19_075519_create_godowns_table', 15),
(26, '2025_03_20_050656_create_units_table', 15),
(27, '2025_03_20_055436_create_categories_table', 15),
(28, '2025_03_20_063627_create_items_table', 15),
(29, '2025_03_22_040133_create_purchases_table', 16),
(30, '2025_03_23_035427_create_purchase_returns_table', 17),
(31, '2025_03_23_035457_create_purchase_return_items_table', 17),
(32, '2025_03_23_053822_create_sales_table', 18),
(33, '2025_03_23_053915_create_sale_items_table', 18),
(34, '2025_03_23_085647_sales_returns', 19),
(35, '2025_03_23_090142_add_godown_phone_address_salesman_to_sales_returns', 20),
(36, '2025_03_23_090351_sales_return_items', 21),
(37, '2025_03_24_051247_create_sales_orders_table', 22),
(38, '2025_03_24_051519_create_sales_order_items_table', 23),
(39, '2025_03_25_032951_add_reference_number_to_account_ledgers_table', 24),
(40, '2025_03_25_080600_create_received_modes_table', 25),
(41, '2025_03_26_041411_create_received_adds_table', 26),
(42, '2025_03_26_043643_add_closing_balance_to_account_ledgers_table', 27),
(43, '2025_03_26_061543_create_company_settings_table', 28),
(44, '2025_03_26_072454_create_financial_years_table', 29),
(45, '2025_03_26_072940_add_financial_year_id_to_comapny_settings_table', 30),
(46, '2025_04_03_181621_create_payment_adds_table', 31);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_permissions`
--

INSERT INTO `model_has_permissions` (`permission_id`, `model_type`, `model_id`) VALUES
(7, 'App\\Models\\User', 1);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(2, 'App\\Models\\User', 2),
(2, 'App\\Models\\User', 4),
(2, 'App\\Models\\User', 6),
(2, 'App\\Models\\User', 9);

-- --------------------------------------------------------

--
-- Table structure for table `natures`
--

CREATE TABLE `natures` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `natures`
--

INSERT INTO `natures` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Assets', NULL, NULL),
(2, 'Liabilities', NULL, NULL),
(3, 'Income', NULL, NULL),
(4, 'Expenses', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_adds`
--

CREATE TABLE `payment_adds` (
  `id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `voucher_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_mode_id` bigint UNSIGNED NOT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `send_sms` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_adds`
--

INSERT INTO `payment_adds` (`id`, `date`, `voucher_no`, `payment_mode_id`, `account_ledger_id`, `amount`, `description`, `send_sms`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '2025-04-03', 'PMT-20250403-971', 1, 1, 20.00, 'okay', 0, 1, '2025-04-03 12:38:12', '2025-04-03 12:38:12');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`, `description`) VALUES
(3, 'assign-roles', 'web', '2025-03-16 23:55:41', '2025-03-17 00:26:51', 'Assign roles to users'),
(4, 'manage-roles', 'web', '2025-03-16 23:55:53', '2025-03-17 00:27:01', 'Full CRUD for roles'),
(5, 'manage-permissions', 'web', '2025-03-16 23:56:08', '2025-03-17 00:27:12', 'Full CRUD for permissions'),
(6, 'view-dashboard', 'web', '2025-03-16 23:56:32', '2025-03-17 00:27:21', 'Access to the dashboard page'),
(7, 'manage-users', 'web', '2025-03-17 03:54:04', '2025-03-17 03:57:31', 'View, create, edit, delete users'),
(8, 'dummy', 'web', '2025-03-17 21:27:58', '2025-03-17 21:27:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `voucher_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `godown_id` bigint UNSIGNED NOT NULL,
  `salesman_id` bigint UNSIGNED NOT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_qty` decimal(15,2) NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `total_discount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `grand_total` decimal(15,2) NOT NULL,
  `shipping_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `delivered_to` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by` bigint UNSIGNED NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `date`, `voucher_no`, `godown_id`, `salesman_id`, `account_ledger_id`, `phone`, `address`, `total_qty`, `total_price`, `total_discount`, `grand_total`, `shipping_details`, `delivered_to`, `created_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, '2025-03-22', '1', 1, 2, 2, '0111111111', 'asdf', 1.00, 50.00, 0.00, 50.00, NULL, NULL, 1, '2025-03-21 23:34:15', '2025-03-21 22:49:20', '2025-03-21 23:34:15'),
(2, '2025-03-22', '3', 1, 2, 1, '01309655677', 'afsdaf', 3.00, 19.00, 2.00, 19.00, NULL, NULL, 1, '2025-03-22 03:34:56', '2025-03-21 23:23:58', '2025-03-22 03:34:56'),
(3, '2025-03-22', '111', 1, 2, 4, '01309655677', 'afsdaf', 2.00, 18.00, 2.00, 18.00, NULL, NULL, 1, '2025-03-22 03:34:59', '2025-03-21 23:34:09', '2025-03-22 03:34:59'),
(4, '2025-03-22', '9', 2, 1, 6, '015265489', 'dhaka', 100.00, 540.00, 10.00, 540.00, NULL, NULL, 1, '2025-03-22 03:35:03', '2025-03-21 23:42:18', '2025-03-22 03:35:03'),
(5, '2025-03-22', '7', 1, 1, 6, '015265489', 'dhaka', 4.00, 700.00, 0.00, 700.00, NULL, NULL, 1, NULL, '2025-03-21 23:58:41', '2025-03-21 23:58:41'),
(6, '2025-03-22', '101', 2, 1, 6, '01924488203', 'asdf', 6.00, 85.00, 5.00, 85.00, NULL, NULL, 1, NULL, '2025-03-22 00:43:53', '2025-03-22 00:43:53'),
(7, '2025-03-22', '66', 3, 1, 6, '01924488203', 'asdf', 6.00, 52.00, 10.00, 52.00, NULL, NULL, 1, '2025-03-22 03:34:52', '2025-03-22 00:56:07', '2025-03-22 03:34:52'),
(8, '2025-03-20', '32', 1, 2, 2, '015265489', 'dhaka', 22.00, 483.00, 1.00, 483.00, 'azimpur', 'dhaka', 1, '2025-03-22 03:34:49', '2025-03-22 01:03:31', '2025-03-22 03:34:49'),
(9, '2025-03-22', 'PUR-20250322-0009', 2, 2, 6, NULL, NULL, 100.00, 1000.00, 0.00, 1000.00, NULL, NULL, 1, NULL, '2025-03-22 01:16:57', '2025-03-22 03:15:30'),
(10, '2025-03-22', 'PUR-20250322-0010', 2, 1, 6, '01521584092', 'Dhaka', 109.00, 4332.75, 0.00, 4332.75, 'Azimpur', 'Tanjilur Rahman', 1, NULL, '2025-03-22 03:18:01', '2025-03-22 03:18:01'),
(11, '2025-03-22', 'PUR-20250322-0011', 1, 1, 7, '01521584092', 'Dhaka', 2.00, 20.00, 0.00, 20.00, 'Azimpur', 'Tanjilur Rahman', 1, NULL, '2025-03-22 03:42:50', '2025-03-22 03:42:50'),
(12, '2025-03-24', 'PUR-20250324-5130', 3, 3, 5, '01924488203', 'asdf', 2.00, 40.00, 0.00, 40.00, 'nai', 'nai', 2, NULL, '2025-03-24 02:57:34', '2025-03-24 02:57:34');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_items`
--

CREATE TABLE `purchase_items` (
  `id` bigint UNSIGNED NOT NULL,
  `purchase_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `qty` decimal(15,2) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `discount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_type` enum('bdt','percent') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'bdt',
  `subtotal` decimal(15,2) NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_items`
--

INSERT INTO `purchase_items` (`id`, `purchase_id`, `product_id`, `qty`, `price`, `discount`, `discount_type`, `subtotal`, `note`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 2.00, 10.00, 2.00, 'bdt', 18.00, NULL, '2025-03-21 23:23:58', '2025-03-21 23:23:58'),
(2, 2, 1, 1.00, 1.00, 0.00, 'bdt', 1.00, NULL, '2025-03-21 23:23:58', '2025-03-21 23:23:58'),
(3, 3, 6, 2.00, 10.00, 2.00, 'bdt', 18.00, NULL, '2025-03-21 23:34:09', '2025-03-21 23:34:09'),
(4, 4, 5, 100.00, 6.00, 10.00, 'percent', 540.00, NULL, '2025-03-21 23:42:18', '2025-03-21 23:42:18'),
(5, 5, 6, 3.00, 200.00, 0.00, 'bdt', 600.00, NULL, '2025-03-21 23:58:41', '2025-03-21 23:58:41'),
(6, 5, 5, 1.00, 100.00, 0.00, 'bdt', 100.00, NULL, '2025-03-21 23:58:41', '2025-03-21 23:58:41'),
(7, 6, 6, 2.00, 25.00, 5.00, 'bdt', 45.00, NULL, '2025-03-22 00:43:53', '2025-03-22 00:43:53'),
(8, 6, 5, 4.00, 10.00, 0.00, 'bdt', 40.00, NULL, '2025-03-22 00:43:53', '2025-03-22 00:43:53'),
(9, 7, 6, 5.00, 10.00, 5.00, 'bdt', 45.00, NULL, '2025-03-22 00:56:07', '2025-03-22 00:56:07'),
(10, 7, 3, 1.00, 12.00, 5.00, 'bdt', 7.00, NULL, '2025-03-22 00:56:07', '2025-03-22 00:56:07'),
(16, 8, 6, 22.00, 22.00, 1.00, 'bdt', 483.00, NULL, '2025-03-22 03:00:11', '2025-03-22 03:00:11'),
(23, 9, 2, 100.00, 10.00, 0.00, 'bdt', 1000.00, NULL, '2025-03-22 03:15:31', '2025-03-22 03:15:31'),
(24, 10, 6, 109.00, 39.75, 0.00, 'bdt', 4332.75, NULL, '2025-03-22 03:18:01', '2025-03-22 03:18:01'),
(25, 11, 7, 2.00, 10.00, 0.00, 'bdt', 20.00, NULL, '2025-03-22 03:42:50', '2025-03-22 03:42:50'),
(26, 12, 5, 2.00, 20.00, 0.00, 'bdt', 40.00, NULL, '2025-03-24 02:57:34', '2025-03-24 02:57:34');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_returns`
--

CREATE TABLE `purchase_returns` (
  `id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `return_voucher_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `godown_id` bigint UNSIGNED NOT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `total_qty` decimal(15,2) NOT NULL,
  `grand_total` decimal(15,2) NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_returns`
--

INSERT INTO `purchase_returns` (`id`, `date`, `return_voucher_no`, `godown_id`, `account_ledger_id`, `reason`, `total_qty`, `grand_total`, `created_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, '2025-03-23', 'RET-20250323-2392', 1, 1, 'Unknown', 100.00, 450.00, 1, NULL, '2025-03-22 22:24:07', '2025-03-22 22:25:16'),
(2, '2025-03-23', 'RET-20250323-3170', 1, 2, 'No reason', 10.00, 200.00, 1, NULL, '2025-03-22 22:34:25', '2025-03-22 22:34:25'),
(3, '2025-03-23', 'RET-20250323-7192', 1, 2, 'blablabal', 1.00, 1.00, 1, '2025-03-22 22:44:30', '2025-03-22 22:43:02', '2025-03-22 22:44:30'),
(4, '2025-03-23', 'RET-20250323-6433', 1, 3, '12', 1.00, 1.00, 1, NULL, '2025-03-22 22:44:48', '2025-03-22 22:44:48'),
(5, '2025-03-23', 'RET-20250323-7276', 1, 1, NULL, 1.00, 1.00, 1, NULL, '2025-03-22 22:49:13', '2025-03-22 22:49:13');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_return_items`
--

CREATE TABLE `purchase_return_items` (
  `id` bigint UNSIGNED NOT NULL,
  `purchase_return_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `qty` decimal(15,2) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_return_items`
--

INSERT INTO `purchase_return_items` (`id`, `purchase_return_id`, `product_id`, `qty`, `price`, `subtotal`, `created_at`, `updated_at`) VALUES
(2, 1, 6, 100.00, 4.50, 450.00, '2025-03-22 22:25:16', '2025-03-22 22:25:16'),
(3, 2, 6, 10.00, 20.00, 200.00, '2025-03-22 22:34:25', '2025-03-22 22:34:25'),
(4, 3, 6, 1.00, 1.00, 1.00, '2025-03-22 22:43:02', '2025-03-22 22:43:02'),
(5, 4, 6, 1.00, 1.00, 1.00, '2025-03-22 22:44:48', '2025-03-22 22:44:48'),
(6, 5, 6, 1.00, 1.00, 1.00, '2025-03-22 22:49:13', '2025-03-22 22:49:13');

-- --------------------------------------------------------

--
-- Table structure for table `received_adds`
--

CREATE TABLE `received_adds` (
  `id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `voucher_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `received_mode_id` bigint UNSIGNED NOT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `send_sms` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `received_adds`
--

INSERT INTO `received_adds` (`id`, `date`, `voucher_no`, `received_mode_id`, `account_ledger_id`, `amount`, `description`, `send_sms`, `created_at`, `updated_at`) VALUES
(1, '2025-03-26', 'RV-907974', 1, 8, 21.00, NULL, 0, '2025-03-25 22:48:36', '2025-03-25 23:46:32'),
(2, '2025-03-26', 'RV-143630', 1, 1, 50.00, 'Bhalo', 0, '2025-03-25 23:02:20', '2025-03-25 23:02:20');

-- --------------------------------------------------------

--
-- Table structure for table `received_modes`
--

CREATE TABLE `received_modes` (
  `id` bigint UNSIGNED NOT NULL,
  `mode_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `opening_balance` decimal(15,2) DEFAULT '0.00',
  `closing_balance` decimal(15,2) DEFAULT '0.00',
  `phone_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `received_modes`
--

INSERT INTO `received_modes` (`id`, `mode_name`, `opening_balance`, `closing_balance`, `phone_number`, `created_at`, `updated_at`) VALUES
(1, 'Cash', 1010.00, NULL, NULL, '2025-03-25 21:33:46', '2025-03-25 21:49:37');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'web', '2025-03-16 03:47:51', '2025-03-16 03:48:40'),
(2, 'manager', 'web', '2025-03-16 03:55:55', '2025-03-16 23:57:19'),
(3, 'Editor', 'web', '2025-03-16 23:57:49', '2025-03-16 23:57:49');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(3, 2),
(4, 2),
(6, 2),
(7, 2),
(8, 2),
(6, 3);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `voucher_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `godown_id` bigint UNSIGNED NOT NULL,
  `salesman_id` bigint UNSIGNED NOT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_qty` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_discount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `grand_total` decimal(15,2) NOT NULL DEFAULT '0.00',
  `other_expense_ledger_id` bigint UNSIGNED DEFAULT NULL,
  `other_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `shipping_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `delivered_to` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `truck_rent` decimal(15,2) DEFAULT NULL,
  `rent_advance` decimal(15,2) DEFAULT NULL,
  `net_rent` decimal(15,2) DEFAULT NULL,
  `truck_driver_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driver_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driver_mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receive_mode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receive_amount` decimal(15,2) DEFAULT NULL,
  `total_due` decimal(15,2) DEFAULT NULL,
  `closing_balance` decimal(15,2) DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `date`, `voucher_no`, `godown_id`, `salesman_id`, `account_ledger_id`, `phone`, `address`, `total_qty`, `total_discount`, `grand_total`, `other_expense_ledger_id`, `other_amount`, `shipping_details`, `delivered_to`, `truck_rent`, `rent_advance`, `net_rent`, `truck_driver_name`, `driver_address`, `driver_mobile`, `receive_mode`, `receive_amount`, `total_due`, `closing_balance`, `created_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, '2025-03-23', 'SAL-20250323-6643', 1, 2, 1, '01924488203', 'asdf', 1.00, 1.00, 19.00, NULL, 0.00, NULL, NULL, 500.00, 100.00, NULL, 'Tawhid', 'ashulia birulia', '01898440582', NULL, NULL, NULL, NULL, 1, NULL, '2025-03-23 00:07:10', '2025-03-23 00:44:33'),
(2, '2025-03-23', 'SAL-20250323-4787', 1, 2, 1, NULL, NULL, 2.00, 0.00, 40.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-03-23 00:53:37', '2025-03-23 00:53:37'),
(3, '2025-03-24', 'SAL-20250324-1711', 3, 3, 5, '01924488203', 'asdf', 1.00, 0.00, 10.00, NULL, 0.00, 'nai', 'nai', 50.00, 10.00, 20.00, 'jalil', 'dhaka', '015265489', NULL, NULL, NULL, NULL, 2, NULL, '2025-03-23 22:03:22', '2025-03-23 22:03:22');

-- --------------------------------------------------------

--
-- Table structure for table `salesmen`
--

CREATE TABLE `salesmen` (
  `id` bigint UNSIGNED NOT NULL,
  `salesman_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salesmen`
--

INSERT INTO `salesmen` (`id`, `salesman_code`, `name`, `phone_number`, `email`, `address`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'SM-0001', 'jim', '015265489', 'jim@jim.com', 'dhaka', 6, '2025-03-20 03:43:45', '2025-03-20 03:43:45', NULL),
(2, 'SM-0002', 'admin salesman', '0111111111', NULL, NULL, 1, '2025-03-21 22:31:00', '2025-03-21 22:31:00', NULL),
(3, 'SM-0003', 'Elham\'s Salesman', '01521584092', NULL, NULL, 2, '2025-03-23 21:46:47', '2025-03-23 21:46:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sales_orders`
--

CREATE TABLE `sales_orders` (
  `id` bigint UNSIGNED NOT NULL,
  `voucher_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `salesman_id` bigint UNSIGNED DEFAULT NULL,
  `shipping_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `delivered_to` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_qty` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_orders`
--

INSERT INTO `sales_orders` (`id`, `voucher_no`, `date`, `account_ledger_id`, `salesman_id`, `shipping_details`, `delivered_to`, `total_qty`, `total_amount`, `created_at`, `updated_at`) VALUES
(1, 'SO-00001', '2025-03-24', 5, 3, NULL, NULL, 1.00, 19.00, '2025-03-24 02:00:07', '2025-03-24 02:00:07'),
(3, 'SO-00003', '2025-03-24', 5, 3, 'nai', 'nai', 1.00, 1.00, '2025-03-24 02:45:33', '2025-03-24 02:45:33'),
(4, 'SO-00004', '2025-03-24', 5, 3, NULL, NULL, 11.00, 250.00, '2025-03-24 02:56:59', '2025-03-24 02:56:59');

-- --------------------------------------------------------

--
-- Table structure for table `sales_order_items`
--

CREATE TABLE `sales_order_items` (
  `id` bigint UNSIGNED NOT NULL,
  `sales_order_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_id` bigint UNSIGNED NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `discount_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_value` decimal(10,2) NOT NULL DEFAULT '0.00',
  `subtotal` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_order_items`
--

INSERT INTO `sales_order_items` (`id`, `sales_order_id`, `product_id`, `quantity`, `unit_id`, `rate`, `discount_type`, `discount_value`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 1.00, 1, 20.00, 'flat', 1.00, 19.00, '2025-03-24 02:00:07', '2025-03-24 02:00:07'),
(2, 3, 2, 1.00, 12, 1.00, 'flat', 0.00, 1.00, '2025-03-24 02:45:33', '2025-03-24 02:45:33'),
(3, 4, 2, 1.00, 1, 50.00, 'flat', 0.00, 50.00, '2025-03-24 02:56:59', '2025-03-24 02:56:59'),
(4, 4, 5, 10.00, 2, 20.00, 'flat', 0.00, 200.00, '2025-03-24 02:56:59', '2025-03-24 02:56:59');

-- --------------------------------------------------------

--
-- Table structure for table `sales_returns`
--

CREATE TABLE `sales_returns` (
  `id` bigint UNSIGNED NOT NULL,
  `sale_id` bigint UNSIGNED DEFAULT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `voucher_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `return_date` date NOT NULL,
  `total_qty` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_return_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `godown_id` bigint UNSIGNED NOT NULL,
  `salesman_id` bigint UNSIGNED NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_returns`
--

INSERT INTO `sales_returns` (`id`, `sale_id`, `account_ledger_id`, `voucher_no`, `return_date`, `total_qty`, `total_return_amount`, `reason`, `created_by`, `created_at`, `updated_at`, `godown_id`, `salesman_id`, `phone`, `address`) VALUES
(1, NULL, 5, 'RET-20250324-0001', '2025-03-24', 12.00, 55.00, NULL, 2, '2025-03-23 21:56:33', '2025-03-25 03:41:27', 3, 3, '01924488203', 'asdf'),
(3, 3, 5, 'RET-20250324-0002', '2025-03-24', 1.00, 2.00, 'ase', 2, '2025-03-23 22:10:21', '2025-03-23 22:17:43', 3, 3, '01924488203', 'asdf');

-- --------------------------------------------------------

--
-- Table structure for table `sales_return_items`
--

CREATE TABLE `sales_return_items` (
  `id` bigint UNSIGNED NOT NULL,
  `sales_return_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `qty` decimal(15,2) NOT NULL,
  `main_price` decimal(15,2) NOT NULL,
  `return_amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_return_items`
--

INSERT INTO `sales_return_items` (`id`, `sales_return_id`, `product_id`, `qty`, `main_price`, `return_amount`, `created_at`, `updated_at`) VALUES
(5, 3, 2, 1.00, 2.00, 2.00, '2025-03-23 22:17:43', '2025-03-23 22:17:43'),
(6, 1, 2, 10.00, 2.00, 15.00, '2025-03-25 03:41:27', '2025-03-25 03:41:27'),
(7, 1, 5, 2.00, 20.00, 40.00, '2025-03-25 03:41:27', '2025-03-25 03:41:27');

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `id` bigint UNSIGNED NOT NULL,
  `sale_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `qty` decimal(15,2) NOT NULL,
  `main_price` decimal(15,2) NOT NULL,
  `discount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_type` enum('bdt','percent') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'bdt',
  `subtotal` decimal(15,2) NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `product_id`, `qty`, `main_price`, `discount`, `discount_type`, `subtotal`, `note`, `created_at`, `updated_at`) VALUES
(3, 1, 7, 1.00, 20.00, 1.00, 'bdt', 19.00, NULL, '2025-03-23 00:44:33', '2025-03-23 00:44:33'),
(4, 2, 7, 2.00, 20.00, 0.00, 'bdt', 40.00, NULL, '2025-03-23 00:53:37', '2025-03-23 00:53:37'),
(5, 3, 2, 1.00, 10.00, 0.00, 'bdt', 10.00, NULL, '2025-03-23 22:03:22', '2025-03-23 22:03:22');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('PXghFzbgV6SE52TMfTbRDbXLKaggHV7NLKUizy9u', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiVHRvMk9mTng1Rk9OWlhMRUczeEhBMGFGSm9VbTc4NTFqb3ZsQkNEayI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9hdXRvcmljZW1pbGxfMy50ZXN0L3BheW1lbnQtYWRkL2NyZWF0ZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1743705501);

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `name`, `created_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Kg', 1, NULL, '2025-03-20 02:17:12', '2025-03-20 02:17:12'),
(2, 'Bag', 1, NULL, '2025-03-20 02:17:17', '2025-03-20 02:17:17'),
(3, 'Pcs', 1, NULL, '2025-03-20 02:17:22', '2025-03-20 02:17:22'),
(4, 'Mon', 1, NULL, '2025-03-20 02:17:24', '2025-03-20 02:17:24'),
(5, 'Nos', 1, NULL, '2025-03-20 02:17:26', '2025-03-20 02:17:26'),
(6, 'Box', 1, NULL, '2025-03-20 02:17:28', '2025-03-20 02:17:28'),
(7, 'Pair', 1, NULL, '2025-03-20 02:17:30', '2025-03-20 02:17:30'),
(8, 'Jar', 1, NULL, '2025-03-20 02:17:33', '2025-03-20 02:17:33'),
(9, 'Feet', 1, NULL, '2025-03-20 02:17:35', '2025-03-20 02:17:35'),
(10, 'Meter', 1, NULL, '2025-03-20 02:17:38', '2025-03-20 02:17:38'),
(11, 'Set', 1, NULL, '2025-03-20 02:17:44', '2025-03-20 02:17:44'),
(12, 'Bottle', 1, NULL, '2025-03-20 02:17:47', '2025-03-20 02:17:47'),
(13, 'Ltr', 1, NULL, '2025-03-20 02:17:49', '2025-03-20 02:17:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `phone`, `address`, `status`, `deleted_at`, `created_by`) VALUES
(1, 'Admin', 'admin@gmail.com', NULL, '$2y$12$SyE1mtYKTkjU/FyjVKKyHeFa2Tm91oNttBMZdmTaTrMh9WoZneV2y', '4jmYkY1eZU2cgtm3VIqZnSf3rtAbulTFHqdYxVD9hMldgPXcCozQ8Wwm78Zl', '2025-03-16 02:40:21', '2025-03-17 21:35:03', NULL, NULL, 'active', NULL, NULL),
(2, 'Elham Auto', 'elhamauto@gmail.com', NULL, '$2y$12$lZqY8lKe/c/fAQvp.K0gV.FWzvQLydDtd56qJwUg7LBTsSxHZRI3e', 'vuolt3KflISMgg09FmMV3kpdaxbtwy8jy9LSptv9TcsiaFCaJv3ptErkdhCS', '2025-03-16 21:57:54', '2025-03-17 00:31:39', NULL, NULL, 'active', NULL, NULL),
(3, 'Tawhid', 'fmtawhid@gmail.com', NULL, '$2y$12$Wnvf71QCbbgS0S9OtiiCpusMyst4naLlIEMJIo2rjSIxNrYddWMFu', '977THygaKM4w2K1hDmbTzF1PwuBrOdipeQodHRacJqTdckjzZcXmnvwcET8d', '2025-03-16 23:17:28', '2025-03-18 04:26:19', NULL, NULL, 'active', NULL, NULL),
(4, 'Elham Auto Sister Concern', 'elhamautosister@gmail.com', NULL, '$2y$12$dGVxfzWZpdnf9vdchGf9zupPH/yKqD.jfsDAQmiyfaxO9ExyNF6Bq', NULL, '2025-03-17 01:07:59', '2025-03-17 01:07:59', NULL, NULL, 'active', NULL, NULL),
(5, 'elham auto child', 'elhamautochild@gmail.com', NULL, '$2y$12$ndnb/xpr39EPNhyvmzXSNeoc26gX/m2Z4MgbxuqhsDheyOEFR2I7y', NULL, '2025-03-17 01:11:01', '2025-03-17 01:55:59', NULL, NULL, 'inactive', NULL, 2),
(6, 'Arnob And Alvi Enterprise', 'arnob@gmail.com', NULL, '$2y$12$Lsdid/CMzhDCzBc.Cr1b2ulbzdLC12ZUfMmqyE.of4kT0Nz/TX6tG', 'oR7v0dPE20RRarCnv6JZepUgmauxQXtVX7v8Id2ZTYfjbZiIklGINh9ZXQAi', '2025-03-17 21:17:48', '2025-03-17 21:17:48', NULL, NULL, 'active', NULL, 1),
(7, 'Arnob Sister Concern', 'arnobsister@gmail.com', NULL, '$2y$12$PLM5xK8wL4NRlH3JsFnShuCbA83Vg00EB0noULazTC7BE4OLXq.Ea', NULL, '2025-03-17 21:19:54', '2025-03-17 21:19:54', NULL, NULL, 'active', NULL, 6),
(8, 'Test User', 'test@example.com', '2025-03-18 00:19:48', '$2y$12$kdcVJLeFJ0EhgnY9.ESavuo0Ph1xgQO9Zt0Hl0r4GEwfucpQefXDu', 'E08BuNMh8m', '2025-03-18 00:19:48', '2025-03-18 00:19:48', NULL, NULL, 'active', NULL, NULL),
(9, 'New Test User', 'user@gmail.com', NULL, '$2y$12$Z7wB9OZn1cG4q9dfDlgHdOHkngJVE9mtxix3.JqyymXBVZS6K6EQS', NULL, '2025-03-19 00:14:20', '2025-03-19 00:14:20', NULL, NULL, 'active', NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_groups`
--
ALTER TABLE `account_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_groups_created_by_foreign` (`created_by`),
  ADD KEY `account_groups_nature_id_foreign` (`nature_id`),
  ADD KEY `account_groups_group_under_id_foreign` (`group_under_id`);

--
-- Indexes for table `account_ledgers`
--
ALTER TABLE `account_ledgers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_ledgers_reference_number_unique` (`reference_number`),
  ADD KEY `account_ledgers_account_group_id_foreign` (`account_group_id`),
  ADD KEY `account_ledgers_created_by_foreign` (`created_by`),
  ADD KEY `account_ledgers_group_under_id_foreign` (`group_under_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_settings_created_by_index` (`created_by`),
  ADD KEY `company_settings_financial_year_id_foreign` (`financial_year_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `financial_years`
--
ALTER TABLE `financial_years`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `godowns`
--
ALTER TABLE `godowns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `godowns_godown_code_unique` (`godown_code`);

--
-- Indexes for table `group_unders`
--
ALTER TABLE `group_unders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `items_item_code_unique` (`item_code`),
  ADD KEY `items_category_id_foreign` (`category_id`),
  ADD KEY `items_unit_id_foreign` (`unit_id`),
  ADD KEY `items_godown_id_foreign` (`godown_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `natures`
--
ALTER TABLE `natures`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `natures_name_unique` (`name`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payment_adds`
--
ALTER TABLE `payment_adds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_adds_voucher_no_unique` (`voucher_no`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchases_voucher_no_unique` (`voucher_no`),
  ADD KEY `purchases_godown_id_foreign` (`godown_id`),
  ADD KEY `purchases_salesman_id_foreign` (`salesman_id`),
  ADD KEY `purchases_account_ledger_id_foreign` (`account_ledger_id`);

--
-- Indexes for table `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_items_purchase_id_foreign` (`purchase_id`),
  ADD KEY `purchase_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `purchase_returns`
--
ALTER TABLE `purchase_returns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchase_returns_return_voucher_no_unique` (`return_voucher_no`),
  ADD KEY `purchase_returns_godown_id_foreign` (`godown_id`),
  ADD KEY `purchase_returns_account_ledger_id_foreign` (`account_ledger_id`);

--
-- Indexes for table `purchase_return_items`
--
ALTER TABLE `purchase_return_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_return_items_purchase_return_id_foreign` (`purchase_return_id`),
  ADD KEY `purchase_return_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `received_adds`
--
ALTER TABLE `received_adds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `received_adds_voucher_no_unique` (`voucher_no`),
  ADD KEY `received_adds_received_mode_id_foreign` (`received_mode_id`),
  ADD KEY `received_adds_account_ledger_id_foreign` (`account_ledger_id`);

--
-- Indexes for table `received_modes`
--
ALTER TABLE `received_modes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sales_voucher_no_unique` (`voucher_no`),
  ADD KEY `sales_godown_id_foreign` (`godown_id`),
  ADD KEY `sales_salesman_id_foreign` (`salesman_id`),
  ADD KEY `sales_account_ledger_id_foreign` (`account_ledger_id`),
  ADD KEY `sales_other_expense_ledger_id_foreign` (`other_expense_ledger_id`);

--
-- Indexes for table `salesmen`
--
ALTER TABLE `salesmen`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `salesmen_salesman_code_unique` (`salesman_code`),
  ADD KEY `salesmen_created_by_foreign` (`created_by`);

--
-- Indexes for table `sales_orders`
--
ALTER TABLE `sales_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sales_orders_voucher_no_unique` (`voucher_no`),
  ADD KEY `sales_orders_account_ledger_id_foreign` (`account_ledger_id`),
  ADD KEY `sales_orders_salesman_id_foreign` (`salesman_id`);

--
-- Indexes for table `sales_order_items`
--
ALTER TABLE `sales_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_order_items_sales_order_id_foreign` (`sales_order_id`),
  ADD KEY `sales_order_items_product_id_foreign` (`product_id`),
  ADD KEY `sales_order_items_unit_id_foreign` (`unit_id`);

--
-- Indexes for table `sales_returns`
--
ALTER TABLE `sales_returns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_returns_sale_id_foreign` (`sale_id`),
  ADD KEY `sales_returns_account_ledger_id_foreign` (`account_ledger_id`),
  ADD KEY `sales_returns_godown_id_foreign` (`godown_id`),
  ADD KEY `sales_returns_salesman_id_foreign` (`salesman_id`);

--
-- Indexes for table `sales_return_items`
--
ALTER TABLE `sales_return_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_return_items_sales_return_id_foreign` (`sales_return_id`),
  ADD KEY `sales_return_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_items_sale_id_foreign` (`sale_id`),
  ADD KEY `sale_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_created_by_foreign` (`created_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_groups`
--
ALTER TABLE `account_groups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `account_ledgers`
--
ALTER TABLE `account_ledgers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `company_settings`
--
ALTER TABLE `company_settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `financial_years`
--
ALTER TABLE `financial_years`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `godowns`
--
ALTER TABLE `godowns`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `group_unders`
--
ALTER TABLE `group_unders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `natures`
--
ALTER TABLE `natures`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_adds`
--
ALTER TABLE `payment_adds`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `purchase_items`
--
ALTER TABLE `purchase_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `purchase_returns`
--
ALTER TABLE `purchase_returns`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `purchase_return_items`
--
ALTER TABLE `purchase_return_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `received_adds`
--
ALTER TABLE `received_adds`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `received_modes`
--
ALTER TABLE `received_modes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `salesmen`
--
ALTER TABLE `salesmen`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sales_orders`
--
ALTER TABLE `sales_orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sales_order_items`
--
ALTER TABLE `sales_order_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sales_returns`
--
ALTER TABLE `sales_returns`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sales_return_items`
--
ALTER TABLE `sales_return_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account_groups`
--
ALTER TABLE `account_groups`
  ADD CONSTRAINT `account_groups_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `account_groups_group_under_id_foreign` FOREIGN KEY (`group_under_id`) REFERENCES `group_unders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `account_groups_nature_id_foreign` FOREIGN KEY (`nature_id`) REFERENCES `natures` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `account_ledgers`
--
ALTER TABLE `account_ledgers`
  ADD CONSTRAINT `account_ledgers_account_group_id_foreign` FOREIGN KEY (`account_group_id`) REFERENCES `account_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `account_ledgers_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `account_ledgers_group_under_id_foreign` FOREIGN KEY (`group_under_id`) REFERENCES `group_unders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD CONSTRAINT `company_settings_financial_year_id_foreign` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `items_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `items_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_account_ledger_id_foreign` FOREIGN KEY (`account_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchases_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchases_salesman_id_foreign` FOREIGN KEY (`salesman_id`) REFERENCES `salesmen` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD CONSTRAINT `purchase_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_items_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_returns`
--
ALTER TABLE `purchase_returns`
  ADD CONSTRAINT `purchase_returns_account_ledger_id_foreign` FOREIGN KEY (`account_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_returns_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_return_items`
--
ALTER TABLE `purchase_return_items`
  ADD CONSTRAINT `purchase_return_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_return_items_purchase_return_id_foreign` FOREIGN KEY (`purchase_return_id`) REFERENCES `purchase_returns` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `received_adds`
--
ALTER TABLE `received_adds`
  ADD CONSTRAINT `received_adds_account_ledger_id_foreign` FOREIGN KEY (`account_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `received_adds_received_mode_id_foreign` FOREIGN KEY (`received_mode_id`) REFERENCES `received_modes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_account_ledger_id_foreign` FOREIGN KEY (`account_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_other_expense_ledger_id_foreign` FOREIGN KEY (`other_expense_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_salesman_id_foreign` FOREIGN KEY (`salesman_id`) REFERENCES `salesmen` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `salesmen`
--
ALTER TABLE `salesmen`
  ADD CONSTRAINT `salesmen_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales_orders`
--
ALTER TABLE `sales_orders`
  ADD CONSTRAINT `sales_orders_account_ledger_id_foreign` FOREIGN KEY (`account_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_orders_salesman_id_foreign` FOREIGN KEY (`salesman_id`) REFERENCES `salesmen` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sales_order_items`
--
ALTER TABLE `sales_order_items`
  ADD CONSTRAINT `sales_order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_order_items_sales_order_id_foreign` FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_order_items_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales_returns`
--
ALTER TABLE `sales_returns`
  ADD CONSTRAINT `sales_returns_account_ledger_id_foreign` FOREIGN KEY (`account_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_returns_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_returns_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_returns_salesman_id_foreign` FOREIGN KEY (`salesman_id`) REFERENCES `salesmen` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales_return_items`
--
ALTER TABLE `sales_return_items`
  ADD CONSTRAINT `sales_return_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_return_items_sales_return_id_foreign` FOREIGN KEY (`sales_return_id`) REFERENCES `sales_returns` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sale_items_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

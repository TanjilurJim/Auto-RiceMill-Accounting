-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 23, 2025 at 02:03 PM
-- Server version: 8.0.30
-- PHP Version: 8.3.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `accounting_ricemill`
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
(5, 'test55', NULL, 1, '2025-03-19 00:18:07', '2025-03-19 00:18:07', NULL, 1, 24),
(6, 'Salary Expense', 'Auto-generated group for salary expenses', 1, '2025-04-09 23:04:12', '2025-04-09 23:04:12', NULL, 4, 11),
(7, 'Employee Salary Expense', 'Ledger group for employee salary tracking', 6, '2025-04-13 00:29:56', '2025-04-13 00:29:56', NULL, 4, 11),
(8, 'Employee Liability', 'Employee salary payable accounts', 12, '2025-06-16 05:05:51', '2025-06-16 05:05:51', NULL, 2, 8),
(11, 'Salary Expense', 'Auto group for salary expense', 12, '2025-06-16 06:38:10', '2025-06-16 06:38:10', NULL, 4, 11),
(12, 'Salary Expense', 'Auto group for salary expense', 13, '2025-07-15 00:33:16', '2025-07-15 00:33:16', NULL, 4, 11);

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
  `ledger_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `for_transition_mode` tinyint(1) NOT NULL DEFAULT '0',
  `mark_for_user` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `group_under_id` bigint UNSIGNED DEFAULT NULL,
  `employee_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account_ledgers`
--

INSERT INTO `account_ledgers` (`id`, `reference_number`, `account_ledger_name`, `phone_number`, `email`, `opening_balance`, `closing_balance`, `debit_credit`, `status`, `account_group_id`, `ledger_type`, `address`, `for_transition_mode`, `mark_for_user`, `created_by`, `created_at`, `updated_at`, `deleted_at`, `group_under_id`, `employee_id`) VALUES
(1, 'RL8ORBPER9PX', 'Ali Traders (Abu Taher)', '01309655677', 'j.jayesha001@gmail.com', 100.00, 2740.00, 'credit', 'active', NULL, NULL, NULL, 1, 1, 1, '2025-03-18 02:49:44', '2025-07-17 01:39:02', NULL, 21, NULL),
(2, '	RL8ORBPER10PX', 'Arif Enterprise', '01309655677', 'j.jayesha001@gmail.com', 100.00, -981.00, 'debit', 'active', 1, NULL, NULL, 1, 1, 1, '2025-03-18 02:51:12', '2025-04-30 03:11:57', NULL, NULL, NULL),
(3, '	RL9ORBPER9PX', 'Abdullah Enterprise', '01309655677', 'j.jayesha001@gmail.com', 100.00, 199.00, 'credit', 'active', 3, NULL, 'afsdaf', 1, 1, 1, '2025-03-18 21:59:43', '2025-04-07 01:23:09', NULL, NULL, NULL),
(4, NULL, 'Ma Babar Dua Traders (Altaf Hossen)', '01309655677', 'j.jayesha001@gmail.com', 470200.00, 469183.00, 'debit', 'active', NULL, NULL, NULL, 1, 1, 1, '2025-03-19 00:25:59', '2025-04-07 01:31:34', NULL, 21, NULL),
(5, 'RLH55ZPVGSDG', 'Elham Auto test Ledger', '01309655677', 'j.jayesha001@gmail.com', 101.00, 129.00, 'debit', 'active', NULL, NULL, NULL, 1, 1, 2, '2025-03-20 02:15:50', '2025-04-22 00:10:34', NULL, 2, NULL),
(6, NULL, 'bazar cost', '01309655677', 'j.jayesha001@gmail.com', 1000.00, 1000.00, 'debit', 'active', NULL, NULL, NULL, 1, 1, 6, '2025-03-20 03:41:59', '2025-04-07 00:36:16', NULL, 9, NULL),
(7, NULL, 'Urmi Traders (Anowar Mia)', '01898440581', NULL, 1306135.00, 1306174.00, 'debit', 'active', NULL, NULL, NULL, 1, 1, 1, '2025-03-22 03:37:56', '2025-04-06 01:20:33', NULL, 21, NULL),
(8, 'RL8ORBPER9PV', 'Awolia Traders', '01309655677', 'tanjilurrahman21@gmail.com', 1588.00, 1568.00, 'credit', 'active', NULL, NULL, 'afsdaf', 1, 1, 1, '2025-03-24 21:58:25', '2025-03-25 22:48:36', NULL, 20, NULL),
(9, 'RLH55ZPVGSCG', 'Elham Auto test Ledger 2', '01924488203', 'tanjilurrahman21@gmail.com', 500.00, 69.00, 'debit', 'active', NULL, NULL, 'asdf', 1, 1, 2, '2025-03-24 23:07:55', '2025-04-08 23:26:14', NULL, 2, NULL),
(10, 'RL7Y1TEVGFR9', 'Salary Expense', '0', 'email@gmail.com', 0.00, 0.00, 'debit', 'active', NULL, 'expense', NULL, 1, 1, 6, '2025-04-09 07:17:08', '2025-06-16 06:17:53', NULL, 9, NULL),
(11, 'RL9MFJJ1KAOM', 'Aurnob Enterprise', '013096556772', 'emaiaal@gmail.com', 0.00, NULL, 'debit', 'active', NULL, NULL, 'afsdaf', 1, 1, 6, '2025-04-09 07:55:43', '2025-04-09 07:55:43', NULL, 2, NULL),
(12, 'RLT43WP6E70O', 'random', '01212549583', 'random@gmail.com', 0.00, NULL, 'debit', 'active', NULL, NULL, NULL, 1, 1, 2, '2025-04-12 23:55:09', '2025-04-12 23:55:09', NULL, 22, NULL),
(13, 'RLNWDNAAATP4', 'Arman', '02316', 'armanbhai001@gmail.com', 0.00, -200.00, 'credit', 'active', 7, 'employee', 'Godown for Arnob', 0, 0, 6, '2025-04-13 00:29:56', '2025-06-16 04:35:35', NULL, 11, 6),
(14, 'RLS8ADB5ZE9N', 'Jim a', '02222222', 'jim@jim.com', 0.00, NULL, 'credit', 'active', 7, 'employee', '12asdf', 0, 0, 6, '2025-04-13 01:09:01', '2025-06-16 04:35:35', NULL, 11, 7),
(15, 'RLXL4WACBGTS', 'Shamim', '01236456', 'shamim@gmail.com', 0.00, NULL, 'credit', 'active', 7, 'employee', 'Dinajpur', 0, 0, 10, '2025-04-13 03:05:01', '2025-06-16 04:35:35', NULL, 11, 8),
(16, 'RLUFJYIRMCNA', 'Company Salary Ledger', '0000', NULL, 600000.00, 600000.00, 'debit', 'active', NULL, NULL, NULL, 1, 1, 10, '2025-04-13 03:06:54', '2025-04-13 04:57:00', NULL, 9, NULL),
(17, 'RLAJD2PUDAQP', 'Demo Company Ledger', '01898440581', 'Tawhid@gmail.com', 100065.00, 100225.00, 'debit', 'active', NULL, NULL, 'ashulia birulia\nashulia birulia', 1, 1, 10, '2025-04-13 03:36:20', '2025-04-16 06:10:37', NULL, 9, NULL),
(18, 'RLJAVCUQOZKB', 'bkash', '01898440581', 'Tawhid@gmail.com', 499.00, NULL, 'debit', 'active', NULL, NULL, NULL, 1, 1, 2, '2025-04-13 05:46:01', '2025-04-13 05:46:01', NULL, 18, NULL),
(19, 'RLRLYTXMXDFX', 'asd', '0', NULL, 0.00, 440.00, 'debit', 'active', 1, NULL, NULL, 0, 0, 10, '2025-04-15 03:51:43', '2025-04-16 06:10:37', NULL, NULL, NULL),
(20, 'RLBG1Q21NRPY', 'asdf', '0', NULL, 0.00, -99.00, 'debit', 'active', 1, NULL, NULL, 0, 0, 10, '2025-04-15 04:05:40', '2025-04-16 05:26:47', NULL, NULL, NULL),
(21, 'RLGUF7R5SU4F', 'City Bank For Payment', '00000', NULL, 200.00, -91.00, 'debit', 'active', NULL, NULL, NULL, 1, 1, 10, '2025-04-15 04:52:45', '2025-04-16 04:03:20', NULL, 1, NULL),
(22, 'RLAKOHKJYNVN', 'Bkash Ledger', '9999', 'bkash@gmail.com', 10000000.00, NULL, 'debit', 'active', NULL, NULL, NULL, 1, 1, 10, '2025-04-16 06:07:57', '2025-04-16 06:08:39', NULL, 2, NULL),
(23, 'RLNYUVMKMTOZ', 'bkash ledger', '01333333', '0b@gmail.com', 9999.00, NULL, 'debit', 'active', NULL, NULL, NULL, 1, 1, 11, '2025-04-16 06:22:47', '2025-04-16 06:22:47', NULL, 2, NULL),
(24, 'RLAMMP2CM8UX', 'Company Ledger', '000000000', NULL, 90000.00, NULL, 'debit', 'active', NULL, NULL, NULL, 1, 1, 11, '2025-04-16 06:23:35', '2025-04-16 06:23:35', NULL, 1, NULL),
(25, 'RLKJLT5WDNXU', 'godown ledger', '65454', NULL, 6666.00, NULL, 'debit', 'active', NULL, NULL, NULL, 1, 1, 11, '2025-04-16 06:24:00', '2025-04-16 06:24:00', NULL, 2, NULL),
(26, 'RL0QWV0RDNVS', 'Inventory Ledger', '0', NULL, 0.00, NULL, 'debit', 'active', 1, NULL, NULL, 0, 0, 11, '2025-04-16 06:32:32', '2025-04-16 06:32:32', NULL, NULL, NULL),
(27, 'RLC2GW5D7GNB', 'nagad ledger', '00000', NULL, 99999.00, 118187.12, 'debit', 'active', NULL, 'received_mode', NULL, 1, 1, 12, '2025-04-16 07:30:45', '2025-07-23 04:18:45', NULL, 2, NULL),
(28, 'RLDME8ZFUFBA', 'Company Ledger', '015265489', 'rafu1@gmail.com', 88800.00, 89889.30, 'debit', 'active', NULL, 'expense', 'dhaka', 1, 1, 12, '2025-04-17 00:00:34', '2025-07-15 01:04:20', NULL, 2, NULL),
(29, 'RLSMCY3MZGB4', 'Inventory', '0', NULL, 0.00, 320.00, 'debit', 'active', 3, 'inventory', NULL, 1, 1, 12, '2025-04-17 00:01:49', '2025-07-23 04:21:27', NULL, NULL, NULL),
(30, 'RLN8A5ZDCBTI', 'Rafique Traders (Customer)', '65456', NULL, 0.00, -830.12, 'debit', 'active', NULL, 'sales', NULL, 1, 1, 12, '2025-04-19 00:25:04', '2025-07-23 04:21:27', NULL, 7, NULL),
(31, 'RLHNTUQLLAOX', 'inventory ledger for rafu1', '0', NULL, 0.00, -20413.00, 'debit', 'active', 3, 'inventory', NULL, 1, 1, 12, '2025-04-19 23:47:44', '2025-07-15 07:46:13', NULL, NULL, NULL),
(32, 'RLNLXKUL4JCW', 'Stock Tracking Ledger', '0', NULL, 0.00, NULL, 'debit', 'active', 3, 'cogs', NULL, 1, 1, 12, '2025-04-20 01:20:20', '2025-05-03 07:10:06', NULL, NULL, NULL),
(33, 'RLLP0OYGITDQ', 'cogs ledger', '0', NULL, 0.00, 24839.00, 'debit', 'active', NULL, 'cogs', NULL, 1, 1, 12, '2025-04-20 01:51:02', '2025-07-23 04:21:27', NULL, 9, NULL),
(34, 'RLF3KNXWFBNM', 'inventory ledger for admin', '0', NULL, 0.00, 495.00, 'debit', 'active', 3, NULL, NULL, 0, 0, 1, '2025-04-22 00:01:56', '2025-04-22 00:10:34', NULL, NULL, NULL),
(35, 'RLNBSMFUNXSZ', 'admin ledger', '0', NULL, 0.00, -1.00, 'debit', 'active', 3, NULL, NULL, 0, 0, 1, '2025-04-22 00:05:53', '2025-04-22 00:10:34', NULL, NULL, NULL),
(36, 'RLPPRGHNW8YL', 'Rocket Ledger', '01791557014', 'email@gmail.com', 298.00, 751.00, 'debit', 'active', NULL, 'received_mode', 'address', 1, 1, 12, '2025-04-23 00:04:36', '2025-07-23 04:21:27', NULL, 2, NULL),
(37, 'RL1FBSQHXQFO', 'Supplier Ledger (XYZ Traders)', '01309655677', 'tanjilurrahman21@gmail.com', 500.00, 698.00, 'credit', 'active', NULL, 'purchase', 'Payables', 1, 1, 12, '2025-04-25 23:55:18', '2025-06-14 06:15:47', NULL, 8, NULL),
(38, 'RL7YRQ01A4PA', 'Fresh Supplier Party', '000333222', 'fresh@gmail.com', 10000.00, 10050.00, 'credit', 'active', NULL, NULL, NULL, 1, 1, 12, '2025-04-30 03:28:10', '2025-06-15 06:45:23', NULL, 8, NULL),
(39, 'RLU3TIXRCRUK', 'test customer', '456456', '456@gmail.com', 0.00, -5350.00, 'debit', 'active', NULL, 'sales', NULL, 1, 0, 12, '2025-04-30 03:43:29', '2025-06-14 04:16:08', NULL, 7, NULL),
(40, 'RL4Y1DOARSSB', 'test supplier', '323232', '32@gmail.com', 0.00, NULL, 'credit', 'active', NULL, 'purchase', NULL, 1, 1, 12, '2025-04-30 03:44:24', '2025-05-03 07:11:53', NULL, 8, NULL),
(41, 'RLHPJR5T23YM', 'Sazzad Customer Test', '03123', 'sazzad@customer.com', 0.00, -1602.00, 'debit', 'active', NULL, 'sales', NULL, 1, 0, 12, '2025-04-30 04:28:05', '2025-06-14 06:40:07', NULL, 7, NULL),
(42, 'RLVMLQSM2OFT', 'inventory 2', '0000333', 'inventory2@gmail.com', 0.00, NULL, 'debit', 'active', 1, 'inventory', NULL, 1, 1, 12, '2025-05-03 05:15:35', '2025-05-03 05:45:19', NULL, NULL, NULL),
(43, 'RLOCMSSTDBHS', 'inventory 3', '0', NULL, 0.00, NULL, 'debit', 'active', 3, NULL, NULL, 0, 0, 12, '2025-05-03 06:47:58', '2025-05-03 06:47:58', NULL, NULL, NULL),
(44, 'RLCUGSW93FVJ', 'inventory 4', '0', NULL, 0.00, NULL, 'debit', 'active', 3, 'inventory', NULL, 0, 0, 12, '2025-05-03 06:54:09', '2025-05-03 06:54:09', NULL, NULL, NULL),
(45, 'RLFT6DCRRNJY', 'inventory ledger 5', '0', NULL, 0.00, -800.00, 'debit', 'active', 3, 'inventory', NULL, 0, 0, 12, '2025-05-03 06:58:36', '2025-06-15 01:03:11', NULL, NULL, NULL),
(46, 'RLWOETYSGWCD', 'Crushing Party Ledger', '01898440581', 'Tawhid@gmail.com', 111.00, NULL, 'debit', 'active', NULL, 'income', NULL, 1, 1, 12, '2025-05-05 05:31:03', '2025-05-05 05:31:03', NULL, 12, NULL),
(47, 'RLAF3PLLQ1BY', 'test ledger 33', '01309655677', 'tanjilurrahman21@gmail.com', 0.00, NULL, 'debit', 'active', NULL, 'expense', 'afsdaf', 1, 1, 12, '2025-06-13 23:46:44', '2025-06-15 04:37:51', NULL, 9, NULL),
(48, 'RLTL6NALPJWR', 'Sales Revenue', '01521584092', 'info@aponnbd.com', 0.00, -500.00, 'credit', 'active', NULL, 'sales', 'APONN GROUP, Chandra Mollika,\nPlot - 398, Road - 06, Avenue - 01,\nMirpur DOHS, Dhaka-1216', 1, 1, 12, '2025-06-15 05:14:59', '2025-06-15 05:29:55', NULL, 10, NULL),
(49, 'RLBF4DVQRWUU', 'inventory test ledger', '01309655677', 'tanjilurrahman21@gmail.com', 0.00, 200.00, 'debit', 'active', NULL, 'inventory', 'afsdaf', 0, 0, 12, '2025-06-15 06:42:46', '2025-06-15 06:45:23', NULL, 2, NULL),
(50, 'RLWW5T2NU9BP', 'Abd Masud', '01791557014', 'email@gmail.com', 0.00, NULL, 'credit', 'active', 7, 'employee', 'address', 0, 0, 12, '2025-06-16 03:15:37', '2025-06-16 04:35:35', NULL, 8, 9),
(51, 'RLDWIDZGLQ0F', 'FM Tawhid Islam', '01603047439', 'fmtawhid@gmail.com', 0.00, NULL, 'credit', 'active', 8, 'employee', 'ashulia birulia', 0, 0, 12, '2025-06-16 05:05:51', '2025-06-16 05:05:51', NULL, 8, 10),
(52, 'RLTLUDLINZ5F', 'Riad', '01309655677', 'riadsk@gmail.com', 0.00, NULL, 'credit', 'active', 8, 'employee', 'Pallbi Metro, Mirpur 12, Dhaka - 1212', 0, 0, 12, '2025-06-16 06:31:11', '2025-06-16 06:31:11', NULL, 8, 11),
(53, 'RLRRXUGH7X1Z', 'Salary Expense', '0000000000', 'noreply@example.com', 0.00, NULL, 'debit', 'active', 11, 'expense', NULL, 0, 0, 12, '2025-06-16 06:38:10', '2025-06-16 06:38:10', NULL, 11, NULL),
(54, 'RLIEIS8G72JR', 'Mahin', '01521584092', 'info@aponnbd.com', 0.00, NULL, 'credit', 'active', 8, 'employee', 'APONN GROUP, Chandra Mollika,', 0, 0, 12, '2025-06-16 06:59:05', '2025-06-16 06:59:05', NULL, 8, 12),
(55, 'RLCGRW5YQEGW', 'Sales Income', '0000000000', NULL, 0.00, -5440.00, 'credit', 'active', NULL, 'sales', NULL, 0, 0, 12, '2025-06-21 00:44:46', '2025-07-23 04:21:26', NULL, 10, NULL),
(56, 'RLES9K8IRPWO', 'tawhid crushing party', '01309655677', 'tanjilurrahman21@gmail.com', 0.00, NULL, 'debit', 'active', NULL, 'income', 'afsdaf', 0, 0, 12, '2025-07-07 06:16:06', '2025-07-07 06:16:06', NULL, 35, NULL),
(57, 'RLMLTDMFUACE', 'Masud Bhai Traders', '01521583066', 'abdmasud@rafusoft.com', 0.00, NULL, 'debit', 'active', NULL, 'income', 'Banani', 0, 0, 13, '2025-07-14 01:57:51', '2025-07-14 01:57:51', NULL, 35, NULL),
(58, 'RLALEY44NHTD', 'Salary Expense', '0000000000', 'noreply@example.com', 0.00, NULL, 'debit', 'active', 12, 'expense', NULL, 0, 0, 13, '2025-07-15 00:33:16', '2025-07-15 00:33:16', NULL, 11, NULL),
(59, 'RL0QLKKN60XU', 'Mamun Bhai', '01924488203', 'mamun@gmail.com', 0.00, NULL, 'credit', 'active', 8, 'employee', 'Dhaka', 0, 0, 12, '2025-07-19 01:32:23', '2025-07-19 01:32:23', NULL, 8, 13),
(60, 'RLBOUQWOO94X', 'Company Inventory Ledger', '01309655677', 'tanjilurrahman21@gmail.com', 0.00, -345.00, 'debit', 'active', NULL, 'inventory', 'afsdaf', 0, 0, 15, '2025-07-23 04:24:26', '2025-07-23 07:45:05', NULL, 1, NULL),
(61, 'RLJHEKUROTTR', 'Hand Cash', '01309655677', 'tanjilurrahman21@gmail.com', 100.00, 1223.00, 'debit', 'active', NULL, 'cash_bank', NULL, 0, 0, 15, '2025-07-23 04:25:18', '2025-07-23 07:35:40', NULL, 2, NULL),
(62, 'RLID8XELSD8E', 'COGS', '01309655677', 'tanjilurrahman21@gmail.com', 0.00, 345.00, 'debit', 'active', NULL, 'cogs', 'afsdaf', 0, 0, 15, '2025-07-23 04:25:50', '2025-07-23 07:45:05', NULL, 1, NULL),
(63, 'RLK1BPWYWSAT', 'Customer Ledger', '01309655677', 'tanjilurrahman21@gmail.com', 0.00, 392.00, 'debit', 'active', NULL, 'sales', 'afsdaf', 1, 1, 15, '2025-07-23 04:30:01', '2025-07-23 07:45:05', NULL, 8, NULL),
(64, 'RLF0RFOTGYFS', 'Sales Income', '0000000000', NULL, 0.00, -1515.00, 'credit', 'active', NULL, 'sales', NULL, 0, 0, 15, '2025-07-23 04:35:00', '2025-07-23 07:45:05', NULL, 10, NULL);

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
('laravel_cache_jim3@gmail.com|127.0.0.1', 'i:1;', 1753277619),
('laravel_cache_jim3@gmail.com|127.0.0.1:timer', 'i:1753277619;', 1753277619);
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel_cache_spatie.permission.cache', 'a:3:{s:5:\"alias\";a:5:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"f\";s:11:\"description\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:443:{i:0;a:5:{s:1:\"a\";i:3;s:1:\"b\";s:12:\"assign-roles\";s:1:\"c\";s:3:\"web\";s:1:\"f\";s:21:\"Assign roles to users\";s:1:\"r\";a:2:{i:0;i:2;i:1;i:4;}}i:1;a:5:{s:1:\"a\";i:4;s:1:\"b\";s:12:\"manage-roles\";s:1:\"c\";s:3:\"web\";s:1:\"f\";s:19:\"Full CRUD for roles\";s:1:\"r\";a:2:{i:0;i:2;i:1;i:4;}}i:2;a:5:{s:1:\"a\";i:5;s:1:\"b\";s:18:\"manage-permissions\";s:1:\"c\";s:3:\"web\";s:1:\"f\";s:25:\"Full CRUD for permissions\";s:1:\"r\";a:1:{i:0;i:4;}}i:3;a:5:{s:1:\"a\";i:6;s:1:\"b\";s:14:\"view-dashboard\";s:1:\"c\";s:3:\"web\";s:1:\"f\";s:28:\"Access to the dashboard page\";s:1:\"r\";a:3:{i:0;i:2;i:1;i:3;i:2;i:4;}}i:4;a:5:{s:1:\"a\";i:7;s:1:\"b\";s:12:\"manage-users\";s:1:\"c\";s:3:\"web\";s:1:\"f\";s:32:\"View, create, edit, delete users\";s:1:\"r\";a:2:{i:0;i:2;i:1;i:4;}}i:5;a:5:{s:1:\"a\";i:8;s:1:\"b\";s:5:\"dummy\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:2;}}i:6;a:5:{s:1:\"a\";i:9;s:1:\"b\";s:10:\"users.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:4:{i:0;i:1;i:1;i:5;i:2;i:11;i:3;i:14;}}i:7;a:5:{s:1:\"a\";i:10;s:1:\"b\";s:12:\"users.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:8;a:5:{s:1:\"a\";i:11;s:1:\"b\";s:10:\"users.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:9;a:5:{s:1:\"a\";i:12;s:1:\"b\";s:12:\"users.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:10;a:5:{s:1:\"a\";i:13;s:1:\"b\";s:13:\"users.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:11;a:5:{s:1:\"a\";i:14;s:1:\"b\";s:18:\"users.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:12;a:5:{s:1:\"a\";i:15;s:1:\"b\";s:10:\"roles.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:13;a:5:{s:1:\"a\";i:16;s:1:\"b\";s:12:\"roles.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:14;a:5:{s:1:\"a\";i:17;s:1:\"b\";s:10:\"roles.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:15;a:5:{s:1:\"a\";i:18;s:1:\"b\";s:12:\"roles.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:16;a:5:{s:1:\"a\";i:19;s:1:\"b\";s:16:\"permissions.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:17;a:5:{s:1:\"a\";i:20;s:1:\"b\";s:18:\"permissions.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:18;a:5:{s:1:\"a\";i:21;s:1:\"b\";s:16:\"permissions.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:19;a:5:{s:1:\"a\";i:22;s:1:\"b\";s:18:\"permissions.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:20;a:5:{s:1:\"a\";i:23;s:1:\"b\";s:12:\"users.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:21;a:5:{s:1:\"a\";i:24;s:1:\"b\";s:9:\"users.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:22;a:5:{s:1:\"a\";i:25;s:1:\"b\";s:13:\"roles.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:23;a:5:{s:1:\"a\";i:26;s:1:\"b\";s:18:\"roles.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:24;a:5:{s:1:\"a\";i:27;s:1:\"b\";s:12:\"roles.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:25;a:5:{s:1:\"a\";i:28;s:1:\"b\";s:9:\"roles.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:26;a:5:{s:1:\"a\";i:29;s:1:\"b\";s:19:\"permissions.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:27;a:5:{s:1:\"a\";i:30;s:1:\"b\";s:24:\"permissions.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:28;a:5:{s:1:\"a\";i:31;s:1:\"b\";s:18:\"permissions.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:29;a:5:{s:1:\"a\";i:32;s:1:\"b\";s:15:\"permissions.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:14;}}i:30;a:5:{s:1:\"a\";i:33;s:1:\"b\";s:14:\"Dashboard.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:9;}}i:31;a:5:{s:1:\"a\";i:34;s:1:\"b\";s:16:\"Dashboard.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:2:{i:0;i:1;i:1;i:5;}}i:32;a:5:{s:1:\"a\";i:35;s:1:\"b\";s:14:\"Dashboard.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:33;a:5:{s:1:\"a\";i:36;s:1:\"b\";s:16:\"Dashboard.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:34;a:5:{s:1:\"a\";i:37;s:1:\"b\";s:17:\"Dashboard.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:35;a:5:{s:1:\"a\";i:38;s:1:\"b\";s:22:\"Dashboard.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:36;a:5:{s:1:\"a\";i:39;s:1:\"b\";s:16:\"Dashboard.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:37;a:5:{s:1:\"a\";i:40;s:1:\"b\";s:13:\"Dashboard.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:38;a:5:{s:1:\"a\";i:41;s:1:\"b\";s:16:\"salary-owed.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:39;a:5:{s:1:\"a\";i:42;s:1:\"b\";s:18:\"salary-owed.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:40;a:5:{s:1:\"a\";i:43;s:1:\"b\";s:16:\"salary-owed.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:41;a:5:{s:1:\"a\";i:44;s:1:\"b\";s:18:\"salary-owed.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:42;a:5:{s:1:\"a\";i:45;s:1:\"b\";s:19:\"salary-owed.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:43;a:5:{s:1:\"a\";i:46;s:1:\"b\";s:24:\"salary-owed.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:44;a:5:{s:1:\"a\";i:47;s:1:\"b\";s:18:\"salary-owed.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:45;a:5:{s:1:\"a\";i:48;s:1:\"b\";s:15:\"salary-owed.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:46;a:5:{s:1:\"a\";i:49;s:1:\"b\";s:17:\"salary-slips.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:47;a:5:{s:1:\"a\";i:50;s:1:\"b\";s:19:\"salary-slips.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:48;a:5:{s:1:\"a\";i:51;s:1:\"b\";s:17:\"salary-slips.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:49;a:5:{s:1:\"a\";i:52;s:1:\"b\";s:19:\"salary-slips.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:50;a:5:{s:1:\"a\";i:53;s:1:\"b\";s:20:\"salary-slips.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:51;a:5:{s:1:\"a\";i:54;s:1:\"b\";s:25:\"salary-slips.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:52;a:5:{s:1:\"a\";i:55;s:1:\"b\";s:19:\"salary-slips.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:53;a:5:{s:1:\"a\";i:56;s:1:\"b\";s:16:\"salary-slips.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:54;a:5:{s:1:\"a\";i:57;s:1:\"b\";s:10:\"sales.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:4:{i:0;i:1;i:1;i:10;i:2;i:12;i:3;i:13;}}i:55;a:5:{s:1:\"a\";i:58;s:1:\"b\";s:12:\"sales.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:4:{i:0;i:1;i:1;i:10;i:2;i:12;i:3;i:13;}}i:56;a:5:{s:1:\"a\";i:59;s:1:\"b\";s:10:\"sales.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:4:{i:0;i:1;i:1;i:10;i:2;i:12;i:3;i:13;}}i:57;a:5:{s:1:\"a\";i:60;s:1:\"b\";s:12:\"sales.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:4:{i:0;i:1;i:1;i:10;i:2;i:12;i:3;i:13;}}i:58;a:5:{s:1:\"a\";i:61;s:1:\"b\";s:13:\"sales.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:12;i:2;i:13;}}i:59;a:5:{s:1:\"a\";i:62;s:1:\"b\";s:18:\"sales.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:12;i:2;i:13;}}i:60;a:5:{s:1:\"a\";i:63;s:1:\"b\";s:12:\"sales.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:12;i:2;i:13;}}i:61;a:5:{s:1:\"a\";i:64;s:1:\"b\";s:9:\"sales.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:3:{i:0;i:1;i:1;i:12;i:2;i:13;}}i:62;a:5:{s:1:\"a\";i:65;s:1:\"b\";s:14:\"purchases.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:63;a:5:{s:1:\"a\";i:66;s:1:\"b\";s:16:\"purchases.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:64;a:5:{s:1:\"a\";i:67;s:1:\"b\";s:14:\"purchases.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:65;a:5:{s:1:\"a\";i:68;s:1:\"b\";s:16:\"purchases.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:66;a:5:{s:1:\"a\";i:69;s:1:\"b\";s:17:\"purchases.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:67;a:5:{s:1:\"a\";i:70;s:1:\"b\";s:22:\"purchases.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:68;a:5:{s:1:\"a\";i:71;s:1:\"b\";s:16:\"purchases.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:69;a:5:{s:1:\"a\";i:72;s:1:\"b\";s:13:\"purchases.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:70;a:5:{s:1:\"a\";i:73;s:1:\"b\";s:21:\"purchases-return.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:71;a:5:{s:1:\"a\";i:74;s:1:\"b\";s:23:\"purchases-return.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:72;a:5:{s:1:\"a\";i:75;s:1:\"b\";s:21:\"purchases-return.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:73;a:5:{s:1:\"a\";i:76;s:1:\"b\";s:23:\"purchases-return.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:74;a:5:{s:1:\"a\";i:77;s:1:\"b\";s:24:\"purchases-return.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:75;a:5:{s:1:\"a\";i:78;s:1:\"b\";s:29:\"purchases-return.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:76;a:5:{s:1:\"a\";i:79;s:1:\"b\";s:23:\"purchases-return.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:77;a:5:{s:1:\"a\";i:80;s:1:\"b\";s:20:\"purchases-return.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:78;a:5:{s:1:\"a\";i:81;s:1:\"b\";s:17:\"sales-return.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:79;a:5:{s:1:\"a\";i:82;s:1:\"b\";s:19:\"sales-return.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:80;a:5:{s:1:\"a\";i:83;s:1:\"b\";s:17:\"sales-return.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:81;a:5:{s:1:\"a\";i:84;s:1:\"b\";s:19:\"sales-return.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:82;a:5:{s:1:\"a\";i:85;s:1:\"b\";s:20:\"sales-return.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:83;a:5:{s:1:\"a\";i:86;s:1:\"b\";s:25:\"sales-return.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:84;a:5:{s:1:\"a\";i:87;s:1:\"b\";s:19:\"sales-return.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:85;a:5:{s:1:\"a\";i:88;s:1:\"b\";s:16:\"sales-return.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:86;a:5:{s:1:\"a\";i:89;s:1:\"b\";s:9:\"dues.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:87;a:5:{s:1:\"a\";i:90;s:1:\"b\";s:11:\"dues.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:88;a:5:{s:1:\"a\";i:91;s:1:\"b\";s:9:\"dues.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:89;a:5:{s:1:\"a\";i:92;s:1:\"b\";s:11:\"dues.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:90;a:5:{s:1:\"a\";i:93;s:1:\"b\";s:12:\"dues.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:91;a:5:{s:1:\"a\";i:94;s:1:\"b\";s:17:\"dues.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:92;a:5:{s:1:\"a\";i:95;s:1:\"b\";s:11:\"dues.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:93;a:5:{s:1:\"a\";i:96;s:1:\"b\";s:8:\"dues.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:94;a:5:{s:1:\"a\";i:97;s:1:\"b\";s:9:\"unit.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:95;a:5:{s:1:\"a\";i:98;s:1:\"b\";s:11:\"unit.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:96;a:5:{s:1:\"a\";i:99;s:1:\"b\";s:9:\"unit.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:97;a:5:{s:1:\"a\";i:100;s:1:\"b\";s:11:\"unit.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:98;a:5:{s:1:\"a\";i:101;s:1:\"b\";s:12:\"unit.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:99;a:5:{s:1:\"a\";i:102;s:1:\"b\";s:17:\"unit.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:100;a:5:{s:1:\"a\";i:103;s:1:\"b\";s:11:\"unit.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:101;a:5:{s:1:\"a\";i:104;s:1:\"b\";s:8:\"unit.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:102;a:5:{s:1:\"a\";i:105;s:1:\"b\";s:10:\"items.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:103;a:5:{s:1:\"a\";i:106;s:1:\"b\";s:12:\"items.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:104;a:5:{s:1:\"a\";i:107;s:1:\"b\";s:10:\"items.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:105;a:5:{s:1:\"a\";i:108;s:1:\"b\";s:12:\"items.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:106;a:5:{s:1:\"a\";i:109;s:1:\"b\";s:13:\"items.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:107;a:5:{s:1:\"a\";i:110;s:1:\"b\";s:18:\"items.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:108;a:5:{s:1:\"a\";i:111;s:1:\"b\";s:12:\"items.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:109;a:5:{s:1:\"a\";i:112;s:1:\"b\";s:9:\"items.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:110;a:5:{s:1:\"a\";i:113;s:1:\"b\";s:15:\"categories.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:111;a:5:{s:1:\"a\";i:114;s:1:\"b\";s:17:\"categories.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:112;a:5:{s:1:\"a\";i:115;s:1:\"b\";s:15:\"categories.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:113;a:5:{s:1:\"a\";i:116;s:1:\"b\";s:17:\"categories.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:114;a:5:{s:1:\"a\";i:117;s:1:\"b\";s:18:\"categories.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:115;a:5:{s:1:\"a\";i:118;s:1:\"b\";s:23:\"categories.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:116;a:5:{s:1:\"a\";i:119;s:1:\"b\";s:17:\"categories.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:117;a:5:{s:1:\"a\";i:120;s:1:\"b\";s:14:\"categories.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:118;a:5:{s:1:\"a\";i:121;s:1:\"b\";s:19:\"received-modes.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:119;a:5:{s:1:\"a\";i:122;s:1:\"b\";s:21:\"received-modes.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:120;a:5:{s:1:\"a\";i:123;s:1:\"b\";s:19:\"received-modes.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:121;a:5:{s:1:\"a\";i:124;s:1:\"b\";s:21:\"received-modes.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:122;a:5:{s:1:\"a\";i:125;s:1:\"b\";s:22:\"received-modes.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:123;a:5:{s:1:\"a\";i:126;s:1:\"b\";s:27:\"received-modes.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:124;a:5:{s:1:\"a\";i:127;s:1:\"b\";s:21:\"received-modes.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:125;a:5:{s:1:\"a\";i:128;s:1:\"b\";s:18:\"received-modes.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:126;a:5:{s:1:\"a\";i:129;s:1:\"b\";s:17:\"received-add.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:127;a:5:{s:1:\"a\";i:130;s:1:\"b\";s:19:\"received-add.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:128;a:5:{s:1:\"a\";i:131;s:1:\"b\";s:17:\"received-add.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:129;a:5:{s:1:\"a\";i:132;s:1:\"b\";s:19:\"received-add.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:130;a:5:{s:1:\"a\";i:133;s:1:\"b\";s:20:\"received-add.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:131;a:5:{s:1:\"a\";i:134;s:1:\"b\";s:25:\"received-add.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:132;a:5:{s:1:\"a\";i:135;s:1:\"b\";s:19:\"received-add.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:133;a:5:{s:1:\"a\";i:136;s:1:\"b\";s:16:\"received-add.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:134;a:5:{s:1:\"a\";i:137;s:1:\"b\";s:16:\"payment-add.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:135;a:5:{s:1:\"a\";i:138;s:1:\"b\";s:18:\"payment-add.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:136;a:5:{s:1:\"a\";i:139;s:1:\"b\";s:16:\"payment-add.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:137;a:5:{s:1:\"a\";i:140;s:1:\"b\";s:18:\"payment-add.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:138;a:5:{s:1:\"a\";i:141;s:1:\"b\";s:19:\"payment-add.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:139;a:5:{s:1:\"a\";i:142;s:1:\"b\";s:24:\"payment-add.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:140;a:5:{s:1:\"a\";i:143;s:1:\"b\";s:18:\"payment-add.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:141;a:5:{s:1:\"a\";i:144;s:1:\"b\";s:15:\"payment-add.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:142;a:5:{s:1:\"a\";i:145;s:1:\"b\";s:15:\"contra-add.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:143;a:5:{s:1:\"a\";i:146;s:1:\"b\";s:17:\"contra-add.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:144;a:5:{s:1:\"a\";i:147;s:1:\"b\";s:15:\"contra-add.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:145;a:5:{s:1:\"a\";i:148;s:1:\"b\";s:17:\"contra-add.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:146;a:5:{s:1:\"a\";i:149;s:1:\"b\";s:18:\"contra-add.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:147;a:5:{s:1:\"a\";i:150;s:1:\"b\";s:23:\"contra-add.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:148;a:5:{s:1:\"a\";i:151;s:1:\"b\";s:17:\"contra-add.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:149;a:5:{s:1:\"a\";i:152;s:1:\"b\";s:14:\"contra-add.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:150;a:5:{s:1:\"a\";i:153;s:1:\"b\";s:16:\"journal-add.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:151;a:5:{s:1:\"a\";i:154;s:1:\"b\";s:18:\"journal-add.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:152;a:5:{s:1:\"a\";i:155;s:1:\"b\";s:16:\"journal-add.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:153;a:5:{s:1:\"a\";i:156;s:1:\"b\";s:18:\"journal-add.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:154;a:5:{s:1:\"a\";i:157;s:1:\"b\";s:19:\"journal-add.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:155;a:5:{s:1:\"a\";i:158;s:1:\"b\";s:24:\"journal-add.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:156;a:5:{s:1:\"a\";i:159;s:1:\"b\";s:18:\"journal-add.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:157;a:5:{s:1:\"a\";i:160;s:1:\"b\";s:15:\"journal-add.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:158;a:5:{s:1:\"a\";i:161;s:1:\"b\";s:19:\"stock-transfer.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:159;a:5:{s:1:\"a\";i:162;s:1:\"b\";s:21:\"stock-transfer.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:160;a:5:{s:1:\"a\";i:163;s:1:\"b\";s:19:\"stock-transfer.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:161;a:5:{s:1:\"a\";i:164;s:1:\"b\";s:21:\"stock-transfer.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:162;a:5:{s:1:\"a\";i:165;s:1:\"b\";s:22:\"stock-transfer.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:163;a:5:{s:1:\"a\";i:166;s:1:\"b\";s:27:\"stock-transfer.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:164;a:5:{s:1:\"a\";i:167;s:1:\"b\";s:21:\"stock-transfer.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:165;a:5:{s:1:\"a\";i:168;s:1:\"b\";s:18:\"stock-transfer.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:166;a:5:{s:1:\"a\";i:169;s:1:\"b\";s:17:\"dues-settled.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:167;a:5:{s:1:\"a\";i:170;s:1:\"b\";s:19:\"dues-settled.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:168;a:5:{s:1:\"a\";i:171;s:1:\"b\";s:17:\"dues-settled.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:169;a:5:{s:1:\"a\";i:172;s:1:\"b\";s:19:\"dues-settled.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:170;a:5:{s:1:\"a\";i:173;s:1:\"b\";s:20:\"dues-settled.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:171;a:5:{s:1:\"a\";i:174;s:1:\"b\";s:25:\"dues-settled.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:172;a:5:{s:1:\"a\";i:175;s:1:\"b\";s:19:\"dues-settled.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:173;a:5:{s:1:\"a\";i:176;s:1:\"b\";s:16:\"dues-settled.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:174;a:5:{s:1:\"a\";i:177;s:1:\"b\";s:19:\"account-ledger.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:175;a:5:{s:1:\"a\";i:178;s:1:\"b\";s:21:\"account-ledger.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:176;a:5:{s:1:\"a\";i:179;s:1:\"b\";s:19:\"account-ledger.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:177;a:5:{s:1:\"a\";i:180;s:1:\"b\";s:21:\"account-ledger.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:178;a:5:{s:1:\"a\";i:181;s:1:\"b\";s:22:\"account-ledger.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:179;a:5:{s:1:\"a\";i:182;s:1:\"b\";s:27:\"account-ledger.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:180;a:5:{s:1:\"a\";i:183;s:1:\"b\";s:21:\"account-ledger.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:181;a:5:{s:1:\"a\";i:184;s:1:\"b\";s:18:\"account-ledger.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:182;a:5:{s:1:\"a\";i:185;s:1:\"b\";s:13:\"salesman.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:183;a:5:{s:1:\"a\";i:186;s:1:\"b\";s:15:\"salesman.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:184;a:5:{s:1:\"a\";i:187;s:1:\"b\";s:13:\"salesman.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:185;a:5:{s:1:\"a\";i:188;s:1:\"b\";s:15:\"salesman.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:186;a:5:{s:1:\"a\";i:189;s:1:\"b\";s:16:\"salesman.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:187;a:5:{s:1:\"a\";i:190;s:1:\"b\";s:21:\"salesman.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:188;a:5:{s:1:\"a\";i:191;s:1:\"b\";s:15:\"salesman.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:189;a:5:{s:1:\"a\";i:192;s:1:\"b\";s:12:\"salesman.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:190;a:5:{s:1:\"a\";i:193;s:1:\"b\";s:12:\"godowns.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:191;a:5:{s:1:\"a\";i:194;s:1:\"b\";s:14:\"godowns.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:192;a:5:{s:1:\"a\";i:195;s:1:\"b\";s:12:\"godowns.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:193;a:5:{s:1:\"a\";i:196;s:1:\"b\";s:14:\"godowns.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:194;a:5:{s:1:\"a\";i:197;s:1:\"b\";s:15:\"godowns.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:195;a:5:{s:1:\"a\";i:198;s:1:\"b\";s:20:\"godowns.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:196;a:5:{s:1:\"a\";i:199;s:1:\"b\";s:14:\"godowns.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:197;a:5:{s:1:\"a\";i:200;s:1:\"b\";s:11:\"godowns.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:198;a:5:{s:1:\"a\";i:201;s:1:\"b\";s:19:\"working-orders.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:199;a:5:{s:1:\"a\";i:202;s:1:\"b\";s:21:\"working-orders.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:200;a:5:{s:1:\"a\";i:203;s:1:\"b\";s:19:\"working-orders.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:201;a:5:{s:1:\"a\";i:204;s:1:\"b\";s:21:\"working-orders.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:202;a:5:{s:1:\"a\";i:205;s:1:\"b\";s:22:\"working-orders.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:203;a:5:{s:1:\"a\";i:206;s:1:\"b\";s:27:\"working-orders.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:204;a:5:{s:1:\"a\";i:207;s:1:\"b\";s:21:\"working-orders.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:205;a:5:{s:1:\"a\";i:208;s:1:\"b\";s:18:\"working-orders.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:206;a:5:{s:1:\"a\";i:209;s:1:\"b\";s:22:\"finished-products.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:207;a:5:{s:1:\"a\";i:210;s:1:\"b\";s:24:\"finished-products.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:208;a:5:{s:1:\"a\";i:211;s:1:\"b\";s:22:\"finished-products.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:209;a:5:{s:1:\"a\";i:212;s:1:\"b\";s:24:\"finished-products.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:210;a:5:{s:1:\"a\";i:213;s:1:\"b\";s:25:\"finished-products.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:211;a:5:{s:1:\"a\";i:214;s:1:\"b\";s:30:\"finished-products.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:212;a:5:{s:1:\"a\";i:215;s:1:\"b\";s:24:\"finished-products.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:213;a:5:{s:1:\"a\";i:216;s:1:\"b\";s:21:\"finished-products.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:214;a:5:{s:1:\"a\";i:217;s:1:\"b\";s:16:\"departments.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:215;a:5:{s:1:\"a\";i:218;s:1:\"b\";s:18:\"departments.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:216;a:5:{s:1:\"a\";i:219;s:1:\"b\";s:16:\"departments.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:217;a:5:{s:1:\"a\";i:220;s:1:\"b\";s:18:\"departments.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:218;a:5:{s:1:\"a\";i:221;s:1:\"b\";s:19:\"departments.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:219;a:5:{s:1:\"a\";i:222;s:1:\"b\";s:24:\"departments.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:220;a:5:{s:1:\"a\";i:223;s:1:\"b\";s:18:\"departments.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:221;a:5:{s:1:\"a\";i:224;s:1:\"b\";s:15:\"departments.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:222;a:5:{s:1:\"a\";i:225;s:1:\"b\";s:17:\"designations.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:223;a:5:{s:1:\"a\";i:226;s:1:\"b\";s:19:\"designations.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:224;a:5:{s:1:\"a\";i:227;s:1:\"b\";s:17:\"designations.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:225;a:5:{s:1:\"a\";i:228;s:1:\"b\";s:19:\"designations.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:226;a:5:{s:1:\"a\";i:229;s:1:\"b\";s:20:\"designations.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:227;a:5:{s:1:\"a\";i:230;s:1:\"b\";s:25:\"designations.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:228;a:5:{s:1:\"a\";i:231;s:1:\"b\";s:19:\"designations.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:229;a:5:{s:1:\"a\";i:232;s:1:\"b\";s:16:\"designations.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:230;a:5:{s:1:\"a\";i:233;s:1:\"b\";s:11:\"shifts.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:231;a:5:{s:1:\"a\";i:234;s:1:\"b\";s:13:\"shifts.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:232;a:5:{s:1:\"a\";i:235;s:1:\"b\";s:11:\"shifts.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:233;a:5:{s:1:\"a\";i:236;s:1:\"b\";s:13:\"shifts.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:234;a:5:{s:1:\"a\";i:237;s:1:\"b\";s:14:\"shifts.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:235;a:5:{s:1:\"a\";i:238;s:1:\"b\";s:19:\"shifts.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:236;a:5:{s:1:\"a\";i:239;s:1:\"b\";s:13:\"shifts.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:237;a:5:{s:1:\"a\";i:240;s:1:\"b\";s:10:\"shifts.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:238;a:5:{s:1:\"a\";i:241;s:1:\"b\";s:20:\"salary-payments.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:239;a:5:{s:1:\"a\";i:242;s:1:\"b\";s:22:\"salary-payments.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:240;a:5:{s:1:\"a\";i:243;s:1:\"b\";s:20:\"salary-payments.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:241;a:5:{s:1:\"a\";i:244;s:1:\"b\";s:22:\"salary-payments.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:242;a:5:{s:1:\"a\";i:245;s:1:\"b\";s:23:\"salary-payments.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:243;a:5:{s:1:\"a\";i:246;s:1:\"b\";s:28:\"salary-payments.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:244;a:5:{s:1:\"a\";i:247;s:1:\"b\";s:22:\"salary-payments.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:245;a:5:{s:1:\"a\";i:248;s:1:\"b\";s:19:\"salary-payments.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:246;a:5:{s:1:\"a\";i:249;s:1:\"b\";s:20:\"employee-ledger.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:247;a:5:{s:1:\"a\";i:250;s:1:\"b\";s:22:\"employee-ledger.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:248;a:5:{s:1:\"a\";i:251;s:1:\"b\";s:20:\"employee-ledger.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:249;a:5:{s:1:\"a\";i:252;s:1:\"b\";s:22:\"employee-ledger.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:250;a:5:{s:1:\"a\";i:253;s:1:\"b\";s:23:\"employee-ledger.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:251;a:5:{s:1:\"a\";i:254;s:1:\"b\";s:28:\"employee-ledger.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:252;a:5:{s:1:\"a\";i:255;s:1:\"b\";s:22:\"employee-ledger.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:253;a:5:{s:1:\"a\";i:256;s:1:\"b\";s:19:\"employee-ledger.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:254;a:5:{s:1:\"a\";i:257;s:1:\"b\";s:21:\"employee-reports.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:255;a:5:{s:1:\"a\";i:258;s:1:\"b\";s:23:\"employee-reports.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:256;a:5:{s:1:\"a\";i:259;s:1:\"b\";s:21:\"employee-reports.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:257;a:5:{s:1:\"a\";i:260;s:1:\"b\";s:23:\"employee-reports.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:258;a:5:{s:1:\"a\";i:261;s:1:\"b\";s:24:\"employee-reports.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:259;a:5:{s:1:\"a\";i:262;s:1:\"b\";s:29:\"employee-reports.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:260;a:5:{s:1:\"a\";i:263;s:1:\"b\";s:23:\"employee-reports.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:261;a:5:{s:1:\"a\";i:264;s:1:\"b\";s:20:\"employee-reports.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:262;a:5:{s:1:\"a\";i:265;s:1:\"b\";s:18:\"stock-reports.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:263;a:5:{s:1:\"a\";i:266;s:1:\"b\";s:20:\"stock-reports.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:264;a:5:{s:1:\"a\";i:267;s:1:\"b\";s:18:\"stock-reports.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:265;a:5:{s:1:\"a\";i:268;s:1:\"b\";s:20:\"stock-reports.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:266;a:5:{s:1:\"a\";i:269;s:1:\"b\";s:21:\"stock-reports.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:267;a:5:{s:1:\"a\";i:270;s:1:\"b\";s:26:\"stock-reports.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:268;a:5:{s:1:\"a\";i:271;s:1:\"b\";s:20:\"stock-reports.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:269;a:5:{s:1:\"a\";i:272;s:1:\"b\";s:17:\"stock-reports.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:270;a:5:{s:1:\"a\";i:273;s:1:\"b\";s:12:\"reports.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:271;a:5:{s:1:\"a\";i:274;s:1:\"b\";s:14:\"reports.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:272;a:5:{s:1:\"a\";i:275;s:1:\"b\";s:12:\"reports.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:273;a:5:{s:1:\"a\";i:276;s:1:\"b\";s:14:\"reports.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:274;a:5:{s:1:\"a\";i:277;s:1:\"b\";s:15:\"reports.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:275;a:5:{s:1:\"a\";i:278;s:1:\"b\";s:20:\"reports.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:276;a:5:{s:1:\"a\";i:279;s:1:\"b\";s:14:\"reports.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:277;a:5:{s:1:\"a\";i:280;s:1:\"b\";s:11:\"reports.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:278;a:4:{s:1:\"a\";i:281;s:1:\"b\";s:12:\"daybook.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:279;a:4:{s:1:\"a\";i:282;s:1:\"b\";s:14:\"daybook.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:280;a:4:{s:1:\"a\";i:283;s:1:\"b\";s:12:\"daybook.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:281;a:4:{s:1:\"a\";i:284;s:1:\"b\";s:14:\"daybook.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:282;a:4:{s:1:\"a\";i:285;s:1:\"b\";s:15:\"daybook.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:283;a:4:{s:1:\"a\";i:286;s:1:\"b\";s:20:\"daybook.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:284;a:4:{s:1:\"a\";i:287;s:1:\"b\";s:14:\"daybook.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:285;a:4:{s:1:\"a\";i:288;s:1:\"b\";s:11:\"daybook.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:286;a:4:{s:1:\"a\";i:289;s:1:\"b\";s:16:\"profit-loss.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:287;a:4:{s:1:\"a\";i:290;s:1:\"b\";s:18:\"profit-loss.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:288;a:4:{s:1:\"a\";i:291;s:1:\"b\";s:16:\"profit-loss.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:289;a:4:{s:1:\"a\";i:292;s:1:\"b\";s:18:\"profit-loss.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:290;a:4:{s:1:\"a\";i:293;s:1:\"b\";s:19:\"profit-loss.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:291;a:4:{s:1:\"a\";i:294;s:1:\"b\";s:24:\"profit-loss.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:292;a:4:{s:1:\"a\";i:295;s:1:\"b\";s:18:\"profit-loss.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:293;a:4:{s:1:\"a\";i:296;s:1:\"b\";s:15:\"profit-loss.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:294;a:4:{s:1:\"a\";i:297;s:1:\"b\";s:18:\"balance-sheet.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:295;a:4:{s:1:\"a\";i:298;s:1:\"b\";s:20:\"balance-sheet.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:296;a:4:{s:1:\"a\";i:299;s:1:\"b\";s:18:\"balance-sheet.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:297;a:4:{s:1:\"a\";i:300;s:1:\"b\";s:20:\"balance-sheet.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:298;a:4:{s:1:\"a\";i:301;s:1:\"b\";s:21:\"balance-sheet.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:299;a:4:{s:1:\"a\";i:302;s:1:\"b\";s:26:\"balance-sheet.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:300;a:4:{s:1:\"a\";i:303;s:1:\"b\";s:20:\"balance-sheet.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:301;a:4:{s:1:\"a\";i:304;s:1:\"b\";s:17:\"balance-sheet.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;}i:302;a:5:{s:1:\"a\";i:313;s:1:\"b\";s:25:\"ledger-group-summary.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:303;a:5:{s:1:\"a\";i:314;s:1:\"b\";s:27:\"ledger-group-summary.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:304;a:5:{s:1:\"a\";i:315;s:1:\"b\";s:25:\"ledger-group-summary.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:305;a:5:{s:1:\"a\";i:316;s:1:\"b\";s:27:\"ledger-group-summary.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:306;a:5:{s:1:\"a\";i:317;s:1:\"b\";s:28:\"ledger-group-summary.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:307;a:5:{s:1:\"a\";i:318;s:1:\"b\";s:33:\"ledger-group-summary.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:308;a:5:{s:1:\"a\";i:319;s:1:\"b\";s:27:\"ledger-group-summary.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:309;a:5:{s:1:\"a\";i:320;s:1:\"b\";s:24:\"ledger-group-summary.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:310;a:5:{s:1:\"a\";i:321;s:1:\"b\";s:16:\"sale-report.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:311;a:5:{s:1:\"a\";i:322;s:1:\"b\";s:18:\"sale-report.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:312;a:5:{s:1:\"a\";i:323;s:1:\"b\";s:16:\"sale-report.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:313;a:5:{s:1:\"a\";i:324;s:1:\"b\";s:18:\"sale-report.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:314;a:5:{s:1:\"a\";i:325;s:1:\"b\";s:19:\"sale-report.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:315;a:5:{s:1:\"a\";i:326;s:1:\"b\";s:24:\"sale-report.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:316;a:5:{s:1:\"a\";i:327;s:1:\"b\";s:18:\"sale-report.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:317;a:5:{s:1:\"a\";i:328;s:1:\"b\";s:15:\"sale-report.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:318;a:5:{s:1:\"a\";i:329;s:1:\"b\";s:20:\"purchase-report.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:319;a:5:{s:1:\"a\";i:330;s:1:\"b\";s:22:\"purchase-report.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:320;a:5:{s:1:\"a\";i:331;s:1:\"b\";s:20:\"purchase-report.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:321;a:5:{s:1:\"a\";i:332;s:1:\"b\";s:22:\"purchase-report.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:322;a:5:{s:1:\"a\";i:333;s:1:\"b\";s:23:\"purchase-report.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:323;a:5:{s:1:\"a\";i:334;s:1:\"b\";s:28:\"purchase-report.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:324;a:5:{s:1:\"a\";i:335;s:1:\"b\";s:22:\"purchase-report.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:325;a:5:{s:1:\"a\";i:336;s:1:\"b\";s:19:\"purchase-report.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:326;a:5:{s:1:\"a\";i:337;s:1:\"b\";s:30:\"receivable-payable-report.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:327;a:5:{s:1:\"a\";i:338;s:1:\"b\";s:32:\"receivable-payable-report.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:328;a:5:{s:1:\"a\";i:339;s:1:\"b\";s:30:\"receivable-payable-report.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:329;a:5:{s:1:\"a\";i:340;s:1:\"b\";s:32:\"receivable-payable-report.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:330;a:5:{s:1:\"a\";i:341;s:1:\"b\";s:33:\"receivable-payable-report.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:331;a:5:{s:1:\"a\";i:342;s:1:\"b\";s:38:\"receivable-payable-report.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:332;a:5:{s:1:\"a\";i:343;s:1:\"b\";s:32:\"receivable-payable-report.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:333;a:5:{s:1:\"a\";i:344;s:1:\"b\";s:29:\"receivable-payable-report.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:334;a:5:{s:1:\"a\";i:345;s:1:\"b\";s:27:\"receive-payment-report.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:335;a:5:{s:1:\"a\";i:346;s:1:\"b\";s:29:\"receive-payment-report.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:336;a:5:{s:1:\"a\";i:347;s:1:\"b\";s:27:\"receive-payment-report.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:337;a:5:{s:1:\"a\";i:348;s:1:\"b\";s:29:\"receive-payment-report.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:338;a:5:{s:1:\"a\";i:349;s:1:\"b\";s:30:\"receive-payment-report.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:339;a:5:{s:1:\"a\";i:350;s:1:\"b\";s:35:\"receive-payment-report.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:340;a:5:{s:1:\"a\";i:351;s:1:\"b\";s:29:\"receive-payment-report.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:341;a:5:{s:1:\"a\";i:352;s:1:\"b\";s:26:\"receive-payment-report.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:342;a:5:{s:1:\"a\";i:353;s:1:\"b\";s:26:\"crushing-party-report.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:343;a:5:{s:1:\"a\";i:354;s:1:\"b\";s:28:\"crushing-party-report.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:344;a:5:{s:1:\"a\";i:355;s:1:\"b\";s:26:\"crushing-party-report.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:345;a:5:{s:1:\"a\";i:356;s:1:\"b\";s:28:\"crushing-party-report.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:346;a:5:{s:1:\"a\";i:357;s:1:\"b\";s:29:\"crushing-party-report.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:347;a:5:{s:1:\"a\";i:358;s:1:\"b\";s:34:\"crushing-party-report.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:348;a:5:{s:1:\"a\";i:359;s:1:\"b\";s:28:\"crushing-party-report.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:349;a:5:{s:1:\"a\";i:360;s:1:\"b\";s:25:\"crushing-party-report.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:350;a:5:{s:1:\"a\";i:361;s:1:\"b\";s:25:\"crushing-party-stock.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:351;a:5:{s:1:\"a\";i:362;s:1:\"b\";s:27:\"crushing-party-stock.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:352;a:5:{s:1:\"a\";i:363;s:1:\"b\";s:25:\"crushing-party-stock.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:353;a:5:{s:1:\"a\";i:364;s:1:\"b\";s:27:\"crushing-party-stock.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:354;a:5:{s:1:\"a\";i:365;s:1:\"b\";s:28:\"crushing-party-stock.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:355;a:5:{s:1:\"a\";i:366;s:1:\"b\";s:33:\"crushing-party-stock.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:356;a:5:{s:1:\"a\";i:367;s:1:\"b\";s:27:\"crushing-party-stock.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:357;a:5:{s:1:\"a\";i:368;s:1:\"b\";s:24:\"crushing-party-stock.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:358;a:5:{s:1:\"a\";i:369;s:1:\"b\";s:28:\"crushing-party-withdraw.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:359;a:5:{s:1:\"a\";i:370;s:1:\"b\";s:30:\"crushing-party-withdraw.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:360;a:5:{s:1:\"a\";i:371;s:1:\"b\";s:28:\"crushing-party-withdraw.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:361;a:5:{s:1:\"a\";i:372;s:1:\"b\";s:30:\"crushing-party-withdraw.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:362;a:5:{s:1:\"a\";i:373;s:1:\"b\";s:31:\"crushing-party-withdraw.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:363;a:5:{s:1:\"a\";i:374;s:1:\"b\";s:36:\"crushing-party-withdraw.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:364;a:5:{s:1:\"a\";i:375;s:1:\"b\";s:30:\"crushing-party-withdraw.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:365;a:5:{s:1:\"a\";i:376;s:1:\"b\";s:27:\"crushing-party-withdraw.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:366;a:5:{s:1:\"a\";i:377;s:1:\"b\";s:27:\"crushing-party-convert.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:367;a:5:{s:1:\"a\";i:378;s:1:\"b\";s:29:\"crushing-party-convert.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:368;a:5:{s:1:\"a\";i:379;s:1:\"b\";s:27:\"crushing-party-convert.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:369;a:5:{s:1:\"a\";i:380;s:1:\"b\";s:29:\"crushing-party-convert.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:370;a:5:{s:1:\"a\";i:381;s:1:\"b\";s:30:\"crushing-party-convert.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:371;a:5:{s:1:\"a\";i:382;s:1:\"b\";s:35:\"crushing-party-convert.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:372;a:5:{s:1:\"a\";i:383;s:1:\"b\";s:29:\"crushing-party-convert.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:373;a:5:{s:1:\"a\";i:384;s:1:\"b\";s:26:\"crushing-party-convert.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:374;a:5:{s:1:\"a\";i:385;s:1:\"b\";s:21:\"crushing-daybook.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:375;a:5:{s:1:\"a\";i:386;s:1:\"b\";s:23:\"crushing-daybook.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:376;a:5:{s:1:\"a\";i:387;s:1:\"b\";s:21:\"crushing-daybook.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:377;a:5:{s:1:\"a\";i:388;s:1:\"b\";s:23:\"crushing-daybook.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:378;a:5:{s:1:\"a\";i:389;s:1:\"b\";s:24:\"crushing-daybook.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:379;a:5:{s:1:\"a\";i:390;s:1:\"b\";s:29:\"crushing-daybook.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:380;a:5:{s:1:\"a\";i:391;s:1:\"b\";s:23:\"crushing-daybook.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:381;a:5:{s:1:\"a\";i:392;s:1:\"b\";s:20:\"crushing-daybook.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:382;a:5:{s:1:\"a\";i:393;s:1:\"b\";s:21:\"crushing-voucher.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:2:{i:0;i:1;i:1;i:9;}}i:383;a:5:{s:1:\"a\";i:394;s:1:\"b\";s:23:\"crushing-voucher.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:2:{i:0;i:1;i:1;i:9;}}i:384;a:5:{s:1:\"a\";i:395;s:1:\"b\";s:21:\"crushing-voucher.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:385;a:5:{s:1:\"a\";i:396;s:1:\"b\";s:23:\"crushing-voucher.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:386;a:5:{s:1:\"a\";i:397;s:1:\"b\";s:24:\"crushing-voucher.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:387;a:5:{s:1:\"a\";i:398;s:1:\"b\";s:29:\"crushing-voucher.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:388;a:5:{s:1:\"a\";i:399;s:1:\"b\";s:23:\"crushing-voucher.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:389;a:5:{s:1:\"a\";i:400;s:1:\"b\";s:20:\"crushing-voucher.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:390;a:5:{s:1:\"a\";i:401;s:1:\"b\";s:14:\"employees.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:391;a:5:{s:1:\"a\";i:402;s:1:\"b\";s:16:\"employees.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:392;a:5:{s:1:\"a\";i:403;s:1:\"b\";s:14:\"employees.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:393;a:5:{s:1:\"a\";i:404;s:1:\"b\";s:16:\"employees.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:394;a:5:{s:1:\"a\";i:405;s:1:\"b\";s:17:\"employees.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:395;a:5:{s:1:\"a\";i:406;s:1:\"b\";s:22:\"employees.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:396;a:5:{s:1:\"a\";i:407;s:1:\"b\";s:16:\"employees.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:397;a:5:{s:1:\"a\";i:408;s:1:\"b\";s:13:\"employees.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:398;a:5:{s:1:\"a\";i:409;s:1:\"b\";s:21:\"company-settings.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:399;a:5:{s:1:\"a\";i:410;s:1:\"b\";s:23:\"company-settings.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:400;a:5:{s:1:\"a\";i:411;s:1:\"b\";s:21:\"company-settings.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:401;a:5:{s:1:\"a\";i:412;s:1:\"b\";s:23:\"company-settings.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:402;a:5:{s:1:\"a\";i:413;s:1:\"b\";s:24:\"company-settings.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:403;a:5:{s:1:\"a\";i:414;s:1:\"b\";s:29:\"company-settings.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:404;a:5:{s:1:\"a\";i:415;s:1:\"b\";s:23:\"company-settings.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:405;a:5:{s:1:\"a\";i:416;s:1:\"b\";s:20:\"company-settings.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:406;a:5:{s:1:\"a\";i:417;s:1:\"b\";s:19:\"financial-year.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:407;a:5:{s:1:\"a\";i:418;s:1:\"b\";s:21:\"financial-year.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:408;a:5:{s:1:\"a\";i:419;s:1:\"b\";s:19:\"financial-year.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:409;a:5:{s:1:\"a\";i:420;s:1:\"b\";s:21:\"financial-year.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:410;a:5:{s:1:\"a\";i:421;s:1:\"b\";s:22:\"financial-year.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:411;a:5:{s:1:\"a\";i:422;s:1:\"b\";s:27:\"financial-year.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:412;a:5:{s:1:\"a\";i:423;s:1:\"b\";s:21:\"financial-year.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:413;a:5:{s:1:\"a\";i:424;s:1:\"b\";s:18:\"financial-year.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:414;a:5:{s:1:\"a\";i:425;s:1:\"b\";s:19:\"daybook-report.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:415;a:5:{s:1:\"a\";i:426;s:1:\"b\";s:21:\"daybook-report.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:416;a:5:{s:1:\"a\";i:427;s:1:\"b\";s:19:\"daybook-report.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:417;a:5:{s:1:\"a\";i:428;s:1:\"b\";s:21:\"daybook-report.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:418;a:5:{s:1:\"a\";i:429;s:1:\"b\";s:22:\"daybook-report.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:419;a:5:{s:1:\"a\";i:430;s:1:\"b\";s:27:\"daybook-report.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:420;a:5:{s:1:\"a\";i:431;s:1:\"b\";s:21:\"daybook-report.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:421;a:5:{s:1:\"a\";i:432;s:1:\"b\";s:18:\"daybook-report.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:422;a:5:{s:1:\"a\";i:433;s:1:\"b\";s:23:\"profit-loss-report.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:423;a:5:{s:1:\"a\";i:434;s:1:\"b\";s:25:\"profit-loss-report.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:424;a:5:{s:1:\"a\";i:435;s:1:\"b\";s:23:\"profit-loss-report.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:425;a:5:{s:1:\"a\";i:436;s:1:\"b\";s:25:\"profit-loss-report.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:426;a:5:{s:1:\"a\";i:437;s:1:\"b\";s:26:\"profit-loss-report.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:427;a:5:{s:1:\"a\";i:438;s:1:\"b\";s:31:\"profit-loss-report.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:428;a:5:{s:1:\"a\";i:439;s:1:\"b\";s:25:\"profit-loss-report.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:429;a:5:{s:1:\"a\";i:440;s:1:\"b\";s:22:\"profit-loss-report.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:430;a:5:{s:1:\"a\";i:441;s:1:\"b\";s:25:\"balance-sheet-report.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:431;a:5:{s:1:\"a\";i:442;s:1:\"b\";s:27:\"balance-sheet-report.create\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:432;a:5:{s:1:\"a\";i:443;s:1:\"b\";s:25:\"balance-sheet-report.edit\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:433;a:5:{s:1:\"a\";i:444;s:1:\"b\";s:27:\"balance-sheet-report.delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:434;a:5:{s:1:\"a\";i:445;s:1:\"b\";s:28:\"balance-sheet-report.restore\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:435;a:5:{s:1:\"a\";i:446;s:1:\"b\";s:33:\"balance-sheet-report.force-delete\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:436;a:5:{s:1:\"a\";i:447;s:1:\"b\";s:27:\"balance-sheet-report.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:437;a:5:{s:1:\"a\";i:448;s:1:\"b\";s:24:\"balance-sheet-report.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:438;a:5:{s:1:\"a\";i:449;s:1:\"b\";s:24:\"account-book-report.view\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:439;a:5:{s:1:\"a\";i:455;s:1:\"b\";s:26:\"account-book-report.export\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:440;a:5:{s:1:\"a\";i:456;s:1:\"b\";s:23:\"account-book-report.pdf\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:1;}}i:441;a:5:{s:1:\"a\";i:457;s:1:\"b\";s:17:\"sales.approve-sub\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:12;}}i:442;a:5:{s:1:\"a\";i:458;s:1:\"b\";s:13:\"sales.approve\";s:1:\"c\";s:3:\"web\";s:1:\"f\";N;s:1:\"r\";a:1:{i:0;i:13;}}}s:5:\"roles\";a:11:{i:0;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:7:\"manager\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:4;s:1:\"b\";s:9:\"Demo Role\";s:1:\"c\";s:3:\"web\";}i:2;a:3:{s:1:\"a\";i:3;s:1:\"b\";s:6:\"Editor\";s:1:\"c\";s:3:\"web\";}i:3;a:3:{s:1:\"a\";i:1;s:1:\"b\";s:5:\"admin\";s:1:\"c\";s:3:\"web\";}i:4;a:3:{s:1:\"a\";i:5;s:1:\"b\";s:4:\"test\";s:1:\"c\";s:3:\"web\";}i:5;a:3:{s:1:\"a\";i:11;s:1:\"b\";s:9:\"view role\";s:1:\"c\";s:3:\"web\";}i:6;a:3:{s:1:\"a\";i:14;s:1:\"b\";s:20:\"Role-Permission-User\";s:1:\"c\";s:3:\"web\";}i:7;a:3:{s:1:\"a\";i:9;s:1:\"b\";s:4:\"name\";s:1:\"c\";s:3:\"web\";}i:8;a:3:{s:1:\"a\";i:10;s:1:\"b\";s:15:\"Sales-Executive\";s:1:\"c\";s:3:\"web\";}i:9;a:3:{s:1:\"a\";i:12;s:1:\"b\";s:15:\"Sub-Responsible\";s:1:\"c\";s:3:\"web\";}i:10;a:3:{s:1:\"a\";i:13;s:1:\"b\";s:11:\"Responsible\";s:1:\"c\";s:3:\"web\";}}}', 1753363940);

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
(7, 'batla house', 6, NULL, '2025-03-20 03:46:20', '2025-03-20 03:46:20'),
(9, 'Beverage', 10, NULL, '2025-04-15 01:00:09', '2025-04-15 01:00:09'),
(10, 'Rice', 12, NULL, '2025-04-21 00:57:26', '2025-04-21 00:57:26'),
(11, 'Paddy', 12, NULL, '2025-04-21 00:57:31', '2025-04-21 00:57:31'),
(12, 'Rice', 15, NULL, '2025-07-23 04:26:35', '2025-07-23 04:26:35');

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
  `logo_thumb_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `financial_year_id` bigint UNSIGNED DEFAULT NULL,
  `apply_interest` tinyint(1) NOT NULL DEFAULT '1',
  `interest_basis` enum('due','total') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'due',
  `interest_type` enum('percentage','flat') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percentage',
  `sale_approval_flow` enum('none','sub_only','sub_and_resp') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `interest_flat_per_day` decimal(12,2) NOT NULL DEFAULT '0.00',
  `interest_rate_per_month` decimal(8,4) DEFAULT NULL,
  `interest_rate_per_year` decimal(8,4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company_settings`
--

INSERT INTO `company_settings` (`id`, `created_by`, `company_name`, `mailing_name`, `country`, `email`, `website`, `financial_year`, `mobile`, `address`, `description`, `logo_path`, `logo_thumb_path`, `created_at`, `updated_at`, `financial_year_id`, `apply_interest`, `interest_basis`, `interest_type`, `sale_approval_flow`, `interest_flat_per_day`, `interest_rate_per_month`, `interest_rate_per_year`) VALUES
(1, 2, 'Elham Auto', 'Elham', 'Bangladesh', 'elhamauto@gmail.com', NULL, NULL, '01521584092', NULL, NULL, NULL, NULL, '2025-03-26 00:40:41', '2025-03-26 01:14:04', NULL, 1, 'due', 'percentage', 'none', 0.00, NULL, NULL),
(2, 1, 'Rafusoft', 'S M RAFAET HOSSAIN', 'Bangladesh', 'info@rafusoft.com', 'https://rafusoft.com/', NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-06 00:35:53', '2025-07-16 23:58:36', NULL, 1, 'due', 'flat', 'none', 22.00, NULL, NULL),
(3, 6, 'Arnob And Alvi EnterPrise', 'arnob', 'Bangladesh', 'arnobandalvi@gmail.com', NULL, '2025', '0171215525', 'Pallbi Metro, Mirpur 12, Dhaka - 1212', NULL, NULL, NULL, '2025-04-13 01:51:20', '2025-04-13 02:03:30', 2, 1, 'due', 'percentage', 'none', 0.00, NULL, NULL),
(4, 12, 'Aponn', 'aponn', 'Bangladesh', 'info@aponnbd.com', 'https://aponn.com/', '2024-2025', NULL, 'APONN GROUP, Chandra Mollika,\r\nPlot - 398, Road - 06, Avenue - 01,\r\nMirpur DOHS, Dhaka-1216', NULL, 'logos/6815e9fc7a2be.png', 'logos/pdf_6815e9fda9a92.jpg', '2025-04-20 05:50:18', '2025-07-22 00:49:28', 3, 1, 'total', 'flat', 'sub_and_resp', 22.00, NULL, NULL),
(5, 15, 'TJIT', 'Tanjilur Rahman Jim', 'Bd', 'tjit@gmail.com', 'https://tanjilurjdot.pythonanywhere.com/', NULL, '01521584092', 'Azimpur', NULL, NULL, NULL, '2025-07-23 04:39:53', '2025-07-23 04:39:53', NULL, 0, 'due', 'flat', 'sub_and_resp', 0.00, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contra_adds`
--

CREATE TABLE `contra_adds` (
  `id` bigint UNSIGNED NOT NULL,
  `voucher_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mode_from_id` bigint UNSIGNED NOT NULL,
  `mode_to_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `send_sms` tinyint(1) NOT NULL DEFAULT '0',
  `date` date NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contra_adds`
--

INSERT INTO `contra_adds` (`id`, `voucher_no`, `mode_from_id`, `mode_to_id`, `amount`, `description`, `send_sms`, `date`, `note`, `created_by`, `created_at`, `updated_at`) VALUES
(2, 'CONTRA-20250406-2767', 1, 3, 8.00, 'test', 0, '2025-04-06', NULL, 1, '2025-04-06 05:09:01', '2025-04-06 05:09:01'),
(3, 'CONTRA-20250406-3334', 1, 3, 18.00, NULL, 0, '2025-04-06', NULL, 2, '2025-04-06 06:04:28', '2025-04-06 06:04:28'),
(4, 'CONTRA-20250423-2216', 16, 17, 1.00, NULL, 0, '2025-04-23', NULL, 12, '2025-04-23 00:06:21', '2025-04-23 00:06:21');

-- --------------------------------------------------------

--
-- Table structure for table `contra_add_details`
--

CREATE TABLE `contra_add_details` (
  `id` bigint UNSIGNED NOT NULL,
  `contra_add_id` bigint UNSIGNED NOT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `type` enum('Dr','Cr') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversion_lines`
--

CREATE TABLE `conversion_lines` (
  `id` bigint UNSIGNED NOT NULL,
  `voucher_id` bigint UNSIGNED NOT NULL,
  `party_item_id` bigint UNSIGNED NOT NULL,
  `line_type` enum('consumed','generated') COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty` decimal(16,3) NOT NULL,
  `unit_name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversion_vouchers`
--

CREATE TABLE `conversion_vouchers` (
  `id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `ref_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `party_ledger_id` bigint UNSIGNED NOT NULL,
  `godown_id` bigint UNSIGNED NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `total_consumed_qty` decimal(16,3) NOT NULL DEFAULT '0.000',
  `total_generated_qty` decimal(16,3) NOT NULL DEFAULT '0.000',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `description`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Office', NULL, 2, '2025-04-09 04:24:15', '2025-04-09 04:24:46'),
(2, 'Admin', NULL, 2, '2025-04-09 04:24:36', '2025-04-09 04:24:53'),
(3, 'Admin', 'Administration', 6, '2025-04-10 00:45:31', '2025-04-10 00:45:31'),
(4, 'IT', NULL, 10, '2025-04-13 03:03:21', '2025-04-13 03:03:21'),
(5, 'Developer', NULL, 12, '2025-04-27 01:48:52', '2025-04-27 01:48:52'),
(6, 'Admin', NULL, 12, '2025-06-15 07:32:48', '2025-06-15 07:32:48'),
(7, 'HR', NULL, 12, '2025-06-15 07:32:55', '2025-06-15 07:32:55');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `name`, `description`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'COO', NULL, 2, '2025-04-09 04:25:09', '2025-04-09 04:25:09'),
(2, 'Admin', NULL, 2, '2025-04-09 04:25:20', '2025-04-09 04:25:20'),
(3, 'Officer', NULL, 6, '2025-04-10 00:45:43', '2025-04-10 00:45:43'),
(4, 'Developer', NULL, 10, '2025-04-13 03:03:30', '2025-04-13 03:03:30'),
(5, 'Backend Developer', NULL, 12, '2025-06-15 07:33:17', '2025-06-15 07:33:17');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `present_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permanent_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `joining_date` date NOT NULL,
  `reference_by` bigint UNSIGNED DEFAULT NULL,
  `department_id` bigint UNSIGNED NOT NULL,
  `designation_id` bigint UNSIGNED NOT NULL,
  `shift_id` bigint UNSIGNED NOT NULL,
  `status` enum('Active','Inactive') COLLATE utf8mb4_unicode_ci NOT NULL,
  `advance_amount` decimal(10,2) DEFAULT NULL,
  `bank_account` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `salary_structure_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `mobile`, `email`, `nid`, `present_address`, `permanent_address`, `salary`, `joining_date`, `reference_by`, `department_id`, `designation_id`, `shift_id`, `status`, `advance_amount`, `bank_account`, `created_by`, `created_at`, `updated_at`, `salary_structure_id`) VALUES
(1, 'Tawhid', '01898440581', 'Tawhid@gmail.com', '19101033225566', 'ashulia birulia', 'ashulia birulia', 666.00, '2025-04-09', NULL, 1, 2, 1, 'Inactive', 500.00, NULL, 2, '2025-04-09 04:28:24', '2025-04-09 05:44:10', NULL),
(2, 'Jim', '01309655677', 'tanjilurrahman21@gmail.com', '01', 'afsdaf', 'asdfasd', 10.00, '2025-04-10', NULL, 3, 3, 2, 'Active', 5.00, NULL, 6, '2025-04-10 00:55:18', '2025-04-10 00:55:18', NULL),
(3, 'Masud', '01924488203', 'sazzad@rafusoft.com', '120', 'asdf', 'asdfasd', 400.00, '2025-05-01', NULL, 2, 2, 1, 'Active', 4.00, NULL, 2, '2025-04-11 23:48:53', '2025-04-11 23:48:53', NULL),
(4, 'sazzad', '01924488203', 'sazzad22@rafusoft.com', '2222', 'asdf', '12', 450.00, '2025-03-01', 1, 1, 2, 1, 'Active', NULL, NULL, 2, '2025-04-11 23:54:58', '2025-04-11 23:54:58', NULL),
(5, 'Raiyan', '111111111', 'raiyan@gmail.com', '0102130', 'mirpur 2', 'mirpur 2', 5000.00, '2025-03-01', NULL, 2, 2, 1, 'Active', NULL, NULL, 2, '2025-04-12 23:58:11', '2025-04-12 23:58:11', NULL),
(6, 'Arman', '02316', 'armanbhai001@gmail.com', '2255', 'Godown for Arnob', 'Godown for Arnob', 900.00, '2025-03-01', NULL, 3, 3, 2, 'Active', NULL, NULL, 6, '2025-04-13 00:29:56', '2025-04-13 00:29:56', NULL),
(7, 'Jim a', '02222222', 'jim@jim.com', '010101', '12asdf', '12asdf', 600.00, '2025-04-13', NULL, 3, 3, 2, 'Active', NULL, NULL, 6, '2025-04-13 01:09:01', '2025-04-13 01:09:01', NULL),
(8, 'Shamim', '01236456', 'shamim@gmail.com', '1910', 'Dinajpur', 'dinajpur', 50000.00, '2025-04-13', NULL, 4, 4, 3, 'Active', NULL, NULL, 10, '2025-04-13 03:05:01', '2025-04-13 03:05:01', NULL),
(9, 'Abd Masud', '01791557014', 'email@gmail.com', '01996623252324', 'address', 'Banani', 50000.00, '2025-01-01', NULL, 5, 5, 5, 'Active', NULL, NULL, 12, '2025-06-16 03:15:37', '2025-06-16 03:15:37', NULL),
(10, 'FM Tawhid Islam', '01603047439', 'fmtawhid@gmail.com', '11111111111111', 'ashulia birulia', 'ashulia birulia', 40000.00, '2025-01-16', 9, 5, 5, 5, 'Active', NULL, NULL, 12, '2025-06-16 05:05:51', '2025-06-16 05:05:51', NULL),
(11, 'Riad', '01309655677', 'riadsk@gmail.com', '112233445566778899', 'Pallbi Metro, Mirpur 12, Dhaka - 1212', 'asdfasd', 22000.00, '2025-06-16', 10, 5, 5, 5, 'Active', NULL, NULL, 12, '2025-06-16 06:31:11', '2025-06-16 06:31:11', NULL),
(12, 'Mahin', '01521584092', 'info@aponnbd.com', '4444444444', 'APONN GROUP, Chandra Mollika,', 'Plot - 398, Road - 06, Avenue - 01,', 50000.00, '2025-06-30', NULL, 5, 5, 5, 'Active', NULL, NULL, 12, '2025-06-16 06:59:04', '2025-06-16 06:59:04', NULL),
(13, 'Mamun Bhai', '01924488203', 'mamun@gmail.com', '19101033', 'Dhaka', 'Dhaka', 100.00, '2025-06-01', NULL, 5, 5, 5, 'Active', 0.00, NULL, 12, '2025-07-19 01:32:23', '2025-07-19 01:32:23', NULL);

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
(1, '2024-2025', '2025-04-14', '2025-04-14', 0, 1, '2025-03-26 02:32:32', '2025-03-26 02:34:07'),
(2, '2025', '2025-01-01', '2025-12-31', 0, 6, '2025-04-13 01:51:58', '2025-04-13 01:51:58'),
(3, '2024-2025', '2024-06-20', '2025-06-30', 0, 12, '2025-04-20 05:50:46', '2025-04-20 05:50:46');

-- --------------------------------------------------------

--
-- Table structure for table `finished_products`
--

CREATE TABLE `finished_products` (
  `id` bigint UNSIGNED NOT NULL,
  `working_order_id` bigint UNSIGNED NOT NULL,
  `production_date` date NOT NULL,
  `production_voucher_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `finished_products`
--

INSERT INTO `finished_products` (`id`, `working_order_id`, `production_date`, `production_voucher_no`, `remarks`, `created_by`, `created_at`, `updated_at`) VALUES
(4, 1, '2025-04-09', 'Pro-0001', NULL, 2, '2025-04-09 01:34:18', '2025-04-09 01:34:18'),
(9, 8, '2025-04-27', 'Pro-0001', NULL, 12, '2025-04-27 08:00:57', '2025-04-27 08:00:57'),
(10, 9, '2025-05-04', 'Pro-0002', NULL, 12, '2025-05-04 04:49:51', '2025-05-04 04:49:51');

-- --------------------------------------------------------

--
-- Table structure for table `finished_product_items`
--

CREATE TABLE `finished_product_items` (
  `id` bigint UNSIGNED NOT NULL,
  `finished_product_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `godown_id` bigint UNSIGNED NOT NULL,
  `quantity` decimal(15,2) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `finished_product_items`
--

INSERT INTO `finished_product_items` (`id`, `finished_product_id`, `product_id`, `godown_id`, `quantity`, `unit_price`, `total`, `created_at`, `updated_at`) VALUES
(6, 4, 2, 3, 5.00, 9.00, 45.00, '2025-04-09 03:13:37', '2025-04-09 03:13:37'),
(7, 9, 21, 10, 20.00, 2.00, 40.00, '2025-04-27 08:00:57', '2025-04-27 08:00:57'),
(8, 10, 27, 10, 50.00, 40.00, 2000.00, '2025-05-04 04:49:51', '2025-05-04 04:49:51');

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
(3, 'elham godown', 'GD-119-3', NULL, 2, NULL, '2025-03-20 02:32:47', '2025-03-20 02:32:47'),
(4, 'Mirpur', 'GD-886-4', NULL, 1, NULL, '2025-04-07 05:24:06', '2025-04-07 05:24:06'),
(5, 'Elham Godown 2', 'GD-392-5', NULL, 2, NULL, '2025-04-07 07:38:57', '2025-04-07 07:38:57'),
(6, 'Main Godown', 'GD-501-6', 'Azimpur', 10, NULL, '2025-04-15 00:59:49', '2025-04-15 00:59:49'),
(7, 'Secondary Godown', 'GD-2-7', NULL, 10, NULL, '2025-04-15 06:00:38', '2025-04-15 06:00:38'),
(8, 'Main Godown', 'GD-88-8', NULL, 11, NULL, '2025-04-16 06:21:00', '2025-04-16 06:21:00'),
(9, 'Secondary Godown', 'GD-745-9', NULL, 11, NULL, '2025-04-16 06:21:08', '2025-04-16 06:21:08'),
(10, 'Main Godown', 'GD-512-10', NULL, 12, NULL, '2025-04-16 07:31:18', '2025-04-16 07:31:18'),
(11, 'Uttara', 'GD-959-11', NULL, 12, NULL, '2025-04-16 07:33:27', '2025-04-16 07:33:27'),
(12, 'Admin Godown', 'GD-983-12', NULL, 1, NULL, '2025-04-22 00:00:32', '2025-04-22 00:00:32'),
(13, 'Test Godown', 'GD-883-13', 'Test Godown', 12, NULL, '2025-06-14 00:29:39', '2025-06-14 00:29:39'),
(14, 'Farmgate', 'GD-415-1', NULL, 15, NULL, '2025-07-23 04:26:17', '2025-07-23 04:26:17');

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
(34, 'ERT', NULL, NULL),
(35, 'Crushing Income', NULL, NULL);

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
(1, 'TDS Meter', 'ITM0001', 3, 3, 1, 0.00, 0.00, -2.00, 0.00, NULL, 1, NULL, '2025-03-20 02:23:33', '2025-04-07 06:55:13'),
(2, 'elham', 'ITM0002', 1, 1, 1, 0.00, 0.00, 2.00, 0.00, NULL, 2, NULL, '2025-03-20 02:24:25', '2025-03-23 22:02:30'),
(3, 'arnob', 'ITM0003', 1, 1, 1, 0.00, 0.00, 0.00, 0.00, NULL, 6, NULL, '2025-03-20 02:24:49', '2025-03-20 02:24:49'),
(4, 'Ph Meter', 'ITM0004', 2, 3, 1, 5.00, 0.00, 74.00, 0.00, NULL, 6, NULL, '2025-03-20 02:31:15', '2025-04-07 23:48:22'),
(5, 'elham 222', 'ITM0005', 1, 2, 3, 0.00, 0.00, 0.00, 0.00, NULL, 2, NULL, '2025-03-20 02:35:36', '2025-03-20 02:36:26'),
(6, '49 paddy', 'ITM0006', 5, 3, 1, 36.50, 0.00, 4881.00, 0.00, NULL, 1, NULL, '2025-03-21 23:33:34', '2025-04-07 07:25:51'),
(7, 'Paddy BR-22', 'ITM0007', 5, 1, 1, 11.00, 0.00, 453.00, 0.00, NULL, 1, NULL, '2025-03-22 03:42:07', '2025-04-07 05:30:48'),
(12, '49 paddy', 'ITM0006', 5, 3, 4, 0.00, 0.00, 3.00, 0.00, NULL, 1, NULL, '2025-04-07 06:45:05', '2025-04-07 07:26:59'),
(13, 'TDS Meter', 'ITM0001', 3, 3, 4, 0.00, 0.00, 2.00, 0.00, NULL, 1, NULL, '2025-04-07 06:55:13', '2025-04-07 06:55:13'),
(14, 'Ph Meter', 'ITM0004', 2, 3, 4, 0.00, 0.00, 31.00, 0.00, NULL, 1, NULL, '2025-04-07 06:57:28', '2025-04-07 23:48:22'),
(15, '49 paddy', 'ITM0006', 5, 3, 4, 0.00, 0.00, 5.00, 0.00, NULL, 1, NULL, '2025-04-07 07:25:51', '2025-04-07 07:25:51'),
(16, '49 paddy', 'ITM0006', 5, 3, 1, 0.00, 0.00, 2.00, 0.00, NULL, 1, NULL, '2025-04-07 07:26:59', '2025-04-07 07:26:59'),
(17, 'item-1 for elham', 'ITM0017', 3, 11, 3, 25.00, 50.00, 60.00, 2500.00, NULL, 2, NULL, '2025-04-07 07:40:02', '2025-04-07 07:40:50'),
(18, 'item-1 for elham', 'ITM0017', 3, 11, 5, 0.00, 0.00, 6.00, 0.00, NULL, 2, NULL, '2025-04-07 07:40:50', '2025-04-07 07:40:50'),
(19, 'Kataribhog', 'ITM0019', 9, 1, 6, 10.00, 0.00, 0.00, 0.00, NULL, 10, NULL, '2025-04-15 01:00:47', '2025-04-15 01:00:55'),
(20, 'Amon', 'ITM0020', 5, 2, 8, 580.00, 900.00, 0.00, 0.00, NULL, 11, NULL, '2025-04-16 06:21:49', '2025-04-16 06:21:49'),
(21, 'Shonali', 'ITM0021', 11, 2, 11, 555.00, 600.00, 2.00, 555.00, NULL, 12, NULL, '2025-04-16 07:32:03', '2025-04-21 00:58:10'),
(22, 'Miniket', 'ITM0022', 6, 2, 11, 0.00, 79.00, 90.00, 6300.00, NULL, 12, '2025-04-16 23:56:25', '2025-04-16 23:53:33', '2025-04-16 23:56:25'),
(23, 'Miniket', 'ITM0023', 10, 2, 11, 50.00, 86.00, 0.00, 86.00, NULL, 12, NULL, '2025-04-16 23:56:14', '2025-04-21 00:58:02'),
(24, 'Amon', 'ITM0024', 11, 1, 10, 10.00, 20.00, 11.00, 200.00, NULL, 12, NULL, '2025-04-17 00:14:06', '2025-04-21 00:57:49'),
(25, 'Chinigura', 'ITM0025', 10, 1, 10, 50.00, 100.00, 17.00, 0.00, NULL, 12, NULL, '2025-04-21 02:06:12', '2025-04-21 03:04:09'),
(26, '52 paddy', 'ITM0026', 5, 2, 12, 99.00, 199.00, 0.00, 0.00, NULL, 1, NULL, '2025-04-21 23:58:46', '2025-04-22 00:01:25'),
(27, 'Najirshail', 'ITM0027', 10, 14, 10, 30.00, 50.00, 21.00, 0.00, NULL, 12, NULL, '2025-05-04 04:48:20', '2025-07-17 04:04:48'),
(28, 'Test Item', 'ITM0028', 10, 15, 10, 50.00, 100.00, 0.00, 0.00, NULL, 12, NULL, '2025-06-15 06:36:37', '2025-06-15 06:36:37'),
(29, 'Basmati', 'ITM0029', 10, 15, 10, 55.00, 70.00, 0.00, 0.00, NULL, 12, NULL, '2025-07-07 06:19:00', '2025-07-07 06:19:00'),
(30, '36 Aatop', 'ITM0001', 12, 18, 14, 15.00, 65.00, 50.00, 750.00, NULL, 15, NULL, '2025-07-23 04:27:33', '2025-07-23 04:28:10');

-- --------------------------------------------------------

--
-- Table structure for table `item_stocks`
--

CREATE TABLE `item_stocks` (
  `id` bigint UNSIGNED NOT NULL,
  `item_id` bigint UNSIGNED NOT NULL,
  `godown_id` bigint UNSIGNED NOT NULL,
  `quantity` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Table structure for table `journals`
--

CREATE TABLE `journals` (
  `id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `voucher_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `voucher_type` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `narration` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `journals`
--

INSERT INTO `journals` (`id`, `date`, `voucher_no`, `voucher_type`, `narration`, `created_by`, `created_at`, `updated_at`) VALUES
(5, '2025-04-07', 'JOURNAL-20250407-6354', NULL, NULL, 1, '2025-04-07 00:23:42', '2025-04-07 00:23:42'),
(6, '2025-04-07', 'JOURNAL-20250407-2357', NULL, NULL, 1, '2025-04-07 00:37:35', '2025-04-07 00:37:35'),
(7, '2025-04-07', 'JOURNAL-20250407-6337', NULL, NULL, 1, '2025-04-07 00:43:48', '2025-04-07 00:43:48'),
(8, '2025-04-07', 'JOURNAL-20250407-6488', NULL, NULL, 1, '2025-04-07 00:49:51', '2025-04-07 00:49:51'),
(10, '2025-04-07', 'JOURNAL-20250407-9399', NULL, NULL, 1, '2025-04-07 00:53:08', '2025-04-07 00:53:08'),
(11, '2025-04-09', 'JOURNAL-20250409-7387', NULL, NULL, 2, '2025-04-08 23:26:14', '2025-04-08 23:26:14'),
(14, '2025-04-09', 'JRN-FXPGU5', NULL, 'Salary payment to Employee ID 1', 6, '2025-04-09 07:56:52', '2025-04-09 07:56:52'),
(15, '2025-04-09', 'JRN-UFMZBQ', NULL, 'Salary payment to Employee ID 1', 6, '2025-04-09 07:57:10', '2025-04-09 07:57:10'),
(16, '2025-04-10', 'JRN-ZEVE5B', NULL, 'Salary payment to Employee ID 1', 1, '2025-04-09 23:04:12', '2025-04-09 23:04:12'),
(17, '2025-04-12', 'JRN-UTRMOT', NULL, 'Salary payment to Employee ID 2', 6, '2025-04-11 23:30:40', '2025-04-11 23:30:40'),
(18, '2025-04-12', 'JRN-HTOQDG', NULL, 'Salary payment to Employee ID 2', 6, '2025-04-11 23:41:16', '2025-04-11 23:41:16'),
(19, '2025-04-12', 'JRN-4QWEXB', NULL, 'Salary payment to Employee ID 1', 2, '2025-04-11 23:46:08', '2025-04-11 23:46:08'),
(20, '2025-04-12', 'JRN-M9UPUE', NULL, 'Salary payment to Employee ID 3', 2, '2025-04-11 23:49:35', '2025-04-11 23:49:35'),
(21, '2025-04-12', 'JRN-TSTZQE', NULL, 'Updated salary payment to Employee ID 4', 2, '2025-04-11 23:55:51', '2025-04-12 01:56:59'),
(22, '2025-04-13', 'JRN-7UODL1', NULL, 'Salary payment to Employee ID 5', 2, '2025-04-13 00:14:28', '2025-04-13 00:14:28'),
(23, '2025-04-13', 'JRN-YVEETY', NULL, 'Salary payment to Employee ID 6', 6, '2025-04-13 00:30:35', '2025-04-13 00:30:35'),
(24, '2025-04-13', 'JRN-WQGGTB', NULL, 'Salary payment to Employee ID 7', 6, '2025-04-13 01:09:46', '2025-04-13 01:09:46'),
(25, '2025-04-15', 'PUR-20250415-6157', NULL, 'Auto journal for Purchase', 10, '2025-04-15 04:07:33', '2025-04-15 04:07:33'),
(26, '2025-04-15', 'PUR-20250415-5195', NULL, 'Auto journal for Purchase', 10, '2025-04-15 05:28:05', '2025-04-15 05:28:05'),
(27, '2025-04-15', 'PUR-20250415-6798', NULL, 'Auto journal for Purchase', 10, '2025-04-15 07:23:34', '2025-04-15 07:23:34'),
(28, '2025-04-15', 'PUR-20250415-8941', NULL, 'Auto journal for Purchase', 10, '2025-04-15 07:47:24', '2025-04-15 07:47:24'),
(31, '2025-04-16', 'RET-20250416-4597', NULL, 'Auto Journal for Purchase Return', 10, '2025-04-16 03:54:41', '2025-04-16 03:54:41'),
(32, '2025-04-16', 'RET-20250416-3352', NULL, 'Auto Journal for Purchase Return', 10, '2025-04-16 04:03:20', '2025-04-16 04:03:20'),
(33, '2025-04-16', 'RET-20250416-5213', NULL, 'Auto Journal for Purchase Return', 10, '2025-04-16 05:26:47', '2025-04-16 05:26:47'),
(34, '2025-04-16', 'PUR-20250416-4839', NULL, 'Auto journal for Purchase', 10, '2025-04-16 06:10:37', '2025-04-16 06:10:37'),
(35, '2025-04-17', 'PUR-20250417-3221', NULL, 'Auto journal for Purchase', 12, '2025-04-17 00:02:30', '2025-04-17 00:02:30'),
(36, '2025-04-17', 'RET-20250417-7239', NULL, 'Auto Journal for Purchase Return', 12, '2025-04-17 00:03:40', '2025-04-17 00:03:40'),
(37, '2025-04-17', 'SAL-20250417-6706', NULL, 'Auto journal for Sale', 12, '2025-04-17 05:13:19', '2025-04-17 05:13:19'),
(38, '2025-04-17', 'SAL-20250417-7568', NULL, 'Auto journal for Sale', 12, '2025-04-17 05:20:05', '2025-04-17 05:20:05'),
(39, '2025-04-19', 'SAL-20250419-3714', NULL, 'Auto journal for Sale', 12, '2025-04-19 00:00:30', '2025-04-19 00:00:30'),
(40, '2025-04-19', 'SAL-20250419-8183', NULL, 'Auto journal for Sale', 12, '2025-04-19 00:50:00', '2025-04-19 00:50:00'),
(41, '2025-04-19', 'SAL-20250419-4459', NULL, 'Auto journal for Sale', 12, '2025-04-19 00:58:11', '2025-04-19 00:58:11'),
(44, '2025-04-19', 'SAL-20250419-9692', NULL, 'Updated journal for sale', 12, '2025-04-19 01:38:50', '2025-04-19 01:38:50'),
(45, '2025-04-20', 'SAL-20250420-6009', NULL, 'Auto journal for Sale', 12, '2025-04-19 23:54:59', '2025-04-19 23:54:59'),
(46, '2025-04-20', 'PUR-20250420-5883', NULL, 'Auto journal for Purchase', 12, '2025-04-20 00:00:02', '2025-04-20 00:00:02'),
(47, '2025-04-20', 'SAL-20250420-3435', NULL, 'Auto journal for Sale', 12, '2025-04-20 01:57:49', '2025-04-20 01:57:49'),
(57, '2025-04-20', 'RET-20250420-0004', NULL, 'Sales return journal', 12, '2025-04-20 04:52:00', '2025-04-20 04:52:00'),
(58, '2025-04-21', 'PUR-20250421-1826', NULL, 'Auto journal (edited)', 12, '2025-04-21 02:56:21', '2025-04-21 04:33:02'),
(59, '2025-04-21', 'SAL-20250421-2432', NULL, 'Auto journal for Sale', 12, '2025-04-21 03:00:46', '2025-04-21 03:00:46'),
(60, '2025-04-22', 'PUR-20250422-5444', NULL, 'Auto journal for Purchase', 1, '2025-04-22 00:10:34', '2025-04-22 00:10:34'),
(61, '2025-04-22', 'PUR-20250422-6689', NULL, 'Auto journal for Purchase', 12, '2025-04-22 05:21:17', '2025-04-22 05:21:17'),
(63, '2025-04-23', 'RET-20250423-8269', NULL, 'Auto Journal for Purchase Return', 12, '2025-04-22 23:00:54', '2025-04-22 23:00:54'),
(64, '2025-04-23', 'RV-772547', NULL, 'Received from Company Ledger', 12, '2025-04-22 23:51:09', '2025-04-22 23:51:09'),
(65, '2025-04-23', 'CONTRA-20250423-2216', NULL, 'Contra entry', 12, '2025-04-23 00:06:21', '2025-04-23 00:06:21'),
(66, '2025-04-23', 'PMT-20250423-8305', NULL, 'Payment to Company Ledger', 12, '2025-04-23 00:17:21', '2025-04-23 00:17:21'),
(67, '2025-04-23', 'PMT-20250423-6006', NULL, 'Updated Payment', 1, '2025-04-23 06:16:13', '2025-04-23 06:16:13'),
(68, '2025-04-24', 'SAL-20250424-5684', 'Sale', 'Auto journal for Sale', 12, '2025-04-24 03:58:29', '2025-04-24 03:58:29'),
(69, '2025-04-26', 'PUR-20250426-2809', 'Purchase', 'Auto journal for Purchase', 12, '2025-04-26 00:32:35', '2025-04-26 00:32:35'),
(70, '2025-04-27', 'PUR-20250427-1338', 'Purchase', 'Auto journal for Purchase', 12, '2025-04-27 04:34:51', '2025-04-27 04:34:51'),
(71, '2025-04-30', 'PMT-20250430-6133', 'Payment', 'Payment to Arif Enterprise', 1, '2025-04-30 03:11:57', '2025-04-30 03:11:57'),
(73, '2025-04-01', 'SAL-20250430-7250', NULL, 'Updated journal for sale', 12, '2025-04-30 03:57:38', '2025-04-30 03:57:38'),
(74, '2025-04-30', 'SAL-20250430-7667', 'Sale', 'Auto journal for Sale', 12, '2025-04-30 03:59:19', '2025-04-30 03:59:19'),
(75, '2025-04-30', 'SAL-20250430-4061', 'Sale', 'Auto journal for Sale', 12, '2025-04-30 05:06:31', '2025-04-30 05:06:31'),
(76, '2025-04-30', 'SRL-20250430-0015', 'Sale Return', 'Sales return journal', 12, '2025-04-30 06:29:03', '2025-04-30 06:29:03'),
(77, '2025-05-04', 'SAL-20250504-8019', 'Sale', 'Auto journal for Sale', 12, '2025-05-04 01:49:18', '2025-05-04 01:49:18'),
(78, '2025-06-14', 'PUR-20250614-2598', 'Purchase', 'Auto journal for Purchase', 12, '2025-06-14 01:08:25', '2025-06-14 01:08:25'),
(79, '2025-06-14', 'PUR-20250614-1308', 'Purchase', 'Auto journal for Purchase', 12, '2025-06-14 01:24:09', '2025-06-14 01:24:09'),
(80, '2025-06-14', 'PUR-20250614-3318', 'Purchase', 'Auto journal for Purchase', 12, '2025-06-14 01:57:23', '2025-06-14 01:57:23'),
(81, '2025-06-14', 'SAL-20250614-7797', 'Sale', 'Auto journal for Sale', 12, '2025-06-14 04:16:08', '2025-06-14 04:16:08'),
(82, '2025-06-14', 'PMT-20250614-1696', 'Payment', 'Payment Made to The Supplier', 12, '2025-06-14 06:06:03', '2025-06-14 06:06:03'),
(83, '2025-06-14', 'RV-964141', 'Received', 'Received from Rafique Traders (Customer)', 12, '2025-06-14 06:07:22', '2025-06-14 06:07:22'),
(84, '2025-06-14', 'PMT-20250614-4187', 'Payment', 'Payment to Supplier Ledger (XYZ Traders)', 12, '2025-06-14 06:15:47', '2025-06-14 06:15:47'),
(85, '2025-06-14', 'RV-795495', 'Received', 'Received 500 from customer', 12, '2025-06-14 06:40:07', '2025-06-14 06:40:07'),
(86, '2025-06-15', 'SAL-20250615-5041', 'Sale', 'Auto journal for Sale', 12, '2025-06-15 01:03:11', '2025-06-15 01:03:11'),
(95, '2025-06-15', 'SAL-20250615-1140', 'Sale', 'Auto journal for Sale', 12, '2025-06-15 05:15:39', '2025-06-15 05:15:39'),
(96, '2025-06-15', 'PUR-20250615-2576', 'Purchase', 'Auto journal for Purchase', 12, '2025-06-15 06:45:23', '2025-06-15 06:45:23'),
(97, '2025-06-15', 'SRL-20250615-0016', 'Sale Return', 'Sales return journal', 12, '2025-06-15 07:22:56', '2025-06-15 07:22:56'),
(98, '2025-06-16', 'JRN-F9P26H', NULL, 'Salary payment to Employee ID 9', 12, '2025-06-16 03:17:02', '2025-06-16 03:17:02'),
(99, '2025-06-16', 'JRN-ZOTOOZ', NULL, 'Accrued salaries for Slip #SAL-20250616-5731', 12, '2025-06-16 05:06:30', '2025-06-16 05:06:30'),
(100, '2025-06-16', 'JRN-NHXK4D', NULL, 'Salary payment to Employee ID 10', 12, '2025-06-16 05:17:40', '2025-06-16 05:17:40'),
(101, '2025-06-16', 'JRN-R8YJUZ', NULL, 'Accrued salaries for Slip #SAL-20250616-6959', 12, '2025-06-16 05:22:26', '2025-06-16 05:22:26'),
(102, '2025-06-16', 'JRN-OLS5SP', NULL, 'Accrued salaries for Slip #SAL-20250616-5702', 12, '2025-06-16 05:25:30', '2025-06-16 05:25:30'),
(103, '2025-06-16', 'JRN-M0RFXK', NULL, 'Salary payment to Employee ID 9', 12, '2025-06-16 05:25:47', '2025-06-16 05:25:47'),
(104, '2025-06-16', 'JRN-GT7JHF', NULL, 'Accrued salaries for Slip #SAL-20250616-4031', 12, '2025-06-16 06:38:10', '2025-06-16 06:38:10'),
(105, '2025-06-30', 'JRN-6LYA34', NULL, 'Accrued salaries for Slip #SAL-20250616-4705', 12, '2025-06-16 07:00:00', '2025-06-16 07:00:00'),
(106, '2025-07-01', 'JRN-IKMBG1', NULL, 'Salary payment to Employee ID 12', 12, '2025-06-16 07:04:14', '2025-06-16 07:04:14'),
(114, '2025-06-21', 'SAL-20250621-5408', 'Sale', 'Auto journal for Sale', 12, '2025-06-21 01:13:32', '2025-06-21 01:13:32'),
(115, '2025-06-21', 'SAL-20250621-6543', NULL, 'Updated journal for sale', 12, '2025-06-21 01:13:57', '2025-06-21 01:13:57'),
(117, '2025-06-21', 'RET-20250621-7204', 'Purchase Return', 'Auto Journal for Purchase Return', 12, '2025-06-21 01:26:57', '2025-06-21 01:26:57'),
(118, '2025-06-21', 'RET-20250621-6577', 'Purchase Return', 'Auto Journal for Purchase Return', 12, '2025-06-21 03:32:23', '2025-06-21 03:32:23'),
(119, '2025-06-21', 'SAL-20250621-8874', NULL, 'Updated journal for sale', 12, '2025-06-21 03:35:00', '2025-06-21 03:35:00'),
(120, '2025-07-15', 'JRN-2W7G8P', NULL, 'Accrued salaries for Slip #SAL-20250715-4928', 13, '2025-07-15 00:33:16', '2025-07-15 00:33:16'),
(121, '2025-07-15', 'JRN-E6KR8Q', NULL, 'Accrued salaries for Slip #SAL-20250715-1703', 13, '2025-07-15 00:34:56', '2025-07-15 00:34:56'),
(122, '2025-07-15', 'JRN-12KSLX', NULL, 'Salary payment to Employee ID 9', 13, '2025-07-15 00:35:23', '2025-07-15 00:35:23'),
(123, '2025-07-15', 'JRN-4YOQ6J', NULL, 'Accrued salaries for Slip #SAL-20250715-7174', 12, '2025-07-15 00:42:42', '2025-07-15 00:42:42'),
(124, '2025-07-15', 'JRN-VCB2DX', NULL, 'Salary payment to Employee ID 10', 12, '2025-07-15 00:43:44', '2025-07-15 00:43:44'),
(125, '2025-07-15', 'SAL-20250715-3578', 'Sale', 'Auto journal for Sale', 12, '2025-07-15 01:04:20', '2025-07-15 01:04:20'),
(139, '2025-07-15', 'SAL-20250715-6059', 'Sale', 'Auto journal for Sale', 12, '2025-07-15 07:46:13', '2025-07-15 07:46:13'),
(140, '2025-07-15', 'SAL-20250715-9371', 'Sale', 'Auto journal for Sale', 12, '2025-07-15 07:55:13', '2025-07-15 07:55:13'),
(141, '2025-07-16', 'SAL-20250716-3558', 'Sale', 'Auto journal for Sale', 12, '2025-07-16 01:32:50', '2025-07-16 01:32:50'),
(142, '2025-07-16', 'SAL-20250716-5938', 'Sale', 'Auto journal for Sale', 12, '2025-07-16 01:47:36', '2025-07-16 01:47:36'),
(143, '2025-07-15', 'SAL-20250716-6856', 'Sale', 'Auto journal for Sale', 12, '2025-07-16 04:19:08', '2025-07-16 04:19:08'),
(145, '2025-07-16', 'SAL-20250716-3979', 'Sale', 'Auto journal for Sale', 12, '2025-07-16 04:43:43', '2025-07-16 04:43:43'),
(146, '2025-07-16', 'SAL-20250716-3252', 'Sale', 'Auto journal for Sale', 12, '2025-07-16 04:57:27', '2025-07-16 04:57:27'),
(147, '2025-07-17', 'SIM-TEST', 'Sale', 'Auto journal for Sale', 12, '2025-07-17 01:39:02', '2025-07-17 01:39:02'),
(148, '2025-07-19', 'JRN-5EKPHD', NULL, 'Accrued salaries for Slip #SAL-20250719-6601', 12, '2025-07-19 01:34:06', '2025-07-19 01:34:06'),
(149, '2025-07-19', 'JRN-NZ9K46', NULL, 'Salary payment to Employee ID 13', 12, '2025-07-19 01:35:16', '2025-07-19 01:35:16'),
(150, '2025-07-19', 'JRN-OCFER3', NULL, 'Salary payment to Employee ID 13', 12, '2025-07-19 01:38:48', '2025-07-19 01:38:48'),
(151, '2025-07-20', 'JRN-G6ZWZY', NULL, 'Salary payment to Employee ID 13', 12, '2025-07-20 00:23:59', '2025-07-20 00:23:59'),
(152, '2025-07-23', 'SAL-20250723-3247', 'Sale', 'Auto journal for Sale', 12, '2025-07-23 04:18:45', '2025-07-23 04:18:45'),
(153, '2025-07-23', 'SAL-20250723-2913', 'Sale', 'Auto journal for Sale', 12, '2025-07-23 04:21:26', '2025-07-23 04:21:26'),
(154, '2025-07-23', 'SAL-20250723-5000', 'Sale', 'Auto journal for Sale', 15, '2025-07-23 04:35:00', '2025-07-23 04:35:00'),
(155, '2025-07-23', 'SAL-20250723-4925', 'Sale', 'Auto journal for Sale', 15, '2025-07-23 04:41:14', '2025-07-23 04:41:14'),
(156, '2025-07-23', 'SAL-20250723-6098', 'Sale', 'Auto journal for Sale', 15, '2025-07-23 06:54:56', '2025-07-23 06:54:56'),
(157, '2025-07-23', 'SAL-20250723-9724', 'Sale', 'Auto journal for Sale', 15, '2025-07-23 07:35:40', '2025-07-23 07:35:40'),
(158, '2025-07-23', 'SAL-20250723-5051', 'Sale', 'Auto journal for Sale', 15, '2025-07-23 07:45:05', '2025-07-23 07:45:05');

-- --------------------------------------------------------

--
-- Table structure for table `journal_entries`
--

CREATE TABLE `journal_entries` (
  `id` bigint UNSIGNED NOT NULL,
  `journal_id` bigint UNSIGNED NOT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `type` enum('debit','credit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `journal_entries`
--

INSERT INTO `journal_entries` (`id`, `journal_id`, `account_ledger_id`, `type`, `amount`, `note`, `created_at`, `updated_at`) VALUES
(5, 5, 1, 'debit', 500.00, NULL, '2025-04-07 00:23:42', '2025-04-07 00:23:42'),
(6, 5, 2, 'credit', 500.00, NULL, '2025-04-07 00:23:42', '2025-04-07 00:23:42'),
(9, 7, 1, 'debit', 500.00, NULL, '2025-04-07 00:43:48', '2025-04-07 00:43:48'),
(10, 7, 2, 'credit', 500.00, NULL, '2025-04-07 00:43:48', '2025-04-07 00:43:48'),
(11, 8, 1, 'debit', 500.00, NULL, '2025-04-07 00:49:51', '2025-04-07 00:49:51'),
(12, 8, 2, 'credit', 500.00, NULL, '2025-04-07 00:49:51', '2025-04-07 00:49:51'),
(15, 10, 1, 'debit', 500.00, NULL, '2025-04-07 00:53:08', '2025-04-07 00:53:08'),
(16, 10, 1, 'credit', 500.00, NULL, '2025-04-07 00:53:08', '2025-04-07 00:53:08'),
(17, 6, 1, 'debit', 500.00, 'jim', '2025-04-07 01:31:34', '2025-04-07 01:31:34'),
(18, 6, 4, 'credit', 500.00, 'tawhid', '2025-04-07 01:31:34', '2025-04-07 01:31:34'),
(19, 11, 5, 'debit', 500.00, NULL, '2025-04-08 23:26:14', '2025-04-08 23:26:14'),
(20, 11, 9, 'credit', 500.00, NULL, '2025-04-08 23:26:14', '2025-04-08 23:26:14'),
(24, 14, 10, 'debit', 100.00, 'Salary Paid', '2025-04-09 07:56:52', '2025-04-09 07:56:52'),
(25, 14, 11, 'credit', 100.00, 'Paid via ', '2025-04-09 07:56:52', '2025-04-09 07:56:52'),
(26, 15, 10, 'debit', 100.00, 'Salary Paid', '2025-04-09 07:57:10', '2025-04-09 07:57:10'),
(27, 15, 11, 'credit', 100.00, 'Paid via ', '2025-04-09 07:57:10', '2025-04-09 07:57:10'),
(28, 16, 10, 'debit', 50.00, 'Salary Paid', '2025-04-09 23:04:12', '2025-04-09 23:04:12'),
(29, 16, 11, 'credit', 50.00, 'Paid via ', '2025-04-09 23:04:12', '2025-04-09 23:04:12'),
(30, 17, 10, 'debit', 10.00, 'Salary Paid', '2025-04-11 23:30:40', '2025-04-11 23:30:40'),
(31, 17, 11, 'credit', 10.00, 'Paid via ', '2025-04-11 23:30:40', '2025-04-11 23:30:40'),
(32, 18, 10, 'debit', 10.00, 'Salary Paid', '2025-04-11 23:41:16', '2025-04-11 23:41:16'),
(33, 18, 11, 'credit', 10.00, 'Paid via ', '2025-04-11 23:41:16', '2025-04-11 23:41:16'),
(34, 19, 10, 'debit', 500.00, 'Salary Paid', '2025-04-11 23:46:08', '2025-04-11 23:46:08'),
(35, 19, 5, 'credit', 500.00, 'Paid via ', '2025-04-11 23:46:08', '2025-04-11 23:46:08'),
(36, 20, 10, 'debit', 300.00, 'Salary Paid', '2025-04-11 23:49:35', '2025-04-11 23:49:35'),
(37, 20, 5, 'credit', 300.00, 'Paid via ', '2025-04-11 23:49:35', '2025-04-11 23:49:35'),
(40, 21, 10, 'debit', 360.00, 'Salary Paid (Updated)', '2025-04-12 01:56:59', '2025-04-12 01:56:59'),
(41, 21, 5, 'credit', 360.00, 'Paid via N/A', '2025-04-12 01:56:59', '2025-04-12 01:56:59'),
(42, 22, 10, 'debit', 5000.00, 'Salary Paid', '2025-04-13 00:14:28', '2025-04-13 00:14:28'),
(43, 22, 5, 'credit', 5000.00, 'Paid via ', '2025-04-13 00:14:28', '2025-04-13 00:14:28'),
(44, 23, 10, 'debit', 900.00, 'Salary Paid', '2025-04-13 00:30:35', '2025-04-13 00:30:35'),
(45, 23, 11, 'credit', 900.00, 'Paid via ', '2025-04-13 00:30:35', '2025-04-13 00:30:35'),
(46, 24, 10, 'debit', 600.00, 'Salary Expense', '2025-04-13 01:09:46', '2025-04-13 01:09:46'),
(47, 24, 14, 'credit', 600.00, 'Payable to employee', '2025-04-13 01:09:46', '2025-04-13 01:09:46'),
(48, 25, 19, 'debit', 10.00, 'Inventory received', '2025-04-15 04:07:34', '2025-04-15 04:07:34'),
(49, 25, 17, 'credit', 10.00, 'Payable to Supplier', '2025-04-15 04:07:34', '2025-04-15 04:07:34'),
(50, 26, 19, 'debit', 200.00, 'Inventory received', '2025-04-15 05:28:05', '2025-04-15 05:28:05'),
(51, 26, 17, 'credit', 200.00, 'Payable to Supplier', '2025-04-15 05:28:05', '2025-04-15 05:28:05'),
(52, 26, 21, 'credit', 200.00, 'Payment via City Bank', '2025-04-15 05:28:05', '2025-04-15 05:28:05'),
(53, 26, 17, 'debit', 200.00, 'Partial payment to supplier', '2025-04-15 05:28:05', '2025-04-15 05:28:05'),
(54, 27, 19, 'debit', 50.00, 'Inventory received', '2025-04-15 07:23:34', '2025-04-15 07:23:34'),
(55, 27, 17, 'credit', 50.00, 'Payable to Supplier', '2025-04-15 07:23:34', '2025-04-15 07:23:34'),
(56, 28, 19, 'debit', 50.00, 'Inventory received', '2025-04-15 07:47:24', '2025-04-15 07:47:24'),
(57, 28, 17, 'credit', 50.00, 'Payable to Supplier', '2025-04-15 07:47:24', '2025-04-15 07:47:24'),
(58, 28, 21, 'credit', 40.00, 'Payment via City Bank', '2025-04-15 07:47:24', '2025-04-15 07:47:24'),
(59, 28, 17, 'debit', 40.00, 'Partial payment to supplier', '2025-04-15 07:47:24', '2025-04-15 07:47:24'),
(60, 28, 19, 'debit', 50.00, 'Inventory received (edited)', '2025-04-16 00:08:21', '2025-04-16 00:08:21'),
(61, 28, 17, 'credit', 50.00, 'Payable to supplier (edited)', '2025-04-16 00:08:21', '2025-04-16 00:08:21'),
(62, 28, 21, 'credit', 50.00, 'Payment via City Bank (edited)', '2025-04-16 00:08:21', '2025-04-16 00:08:21'),
(63, 28, 17, 'debit', 50.00, 'Partial payment to supplier (edited)', '2025-04-16 00:08:21', '2025-04-16 00:08:21'),
(64, 31, 17, 'debit', 10.00, 'Reduce supplier payable (return)', '2025-04-16 03:54:41', '2025-04-16 03:54:41'),
(65, 31, 19, 'credit', 10.00, 'Inventory decreased (purchase return)', '2025-04-16 03:54:41', '2025-04-16 03:54:41'),
(66, 32, 17, 'debit', 1.00, 'Reduce supplier payable (return)', '2025-04-16 04:03:20', '2025-04-16 04:03:20'),
(67, 32, 19, 'credit', 1.00, 'Inventory decreased (purchase return)', '2025-04-16 04:03:20', '2025-04-16 04:03:20'),
(68, 32, 21, 'credit', 1.00, 'Refund paid via City Bank For Payment', '2025-04-16 04:03:20', '2025-04-16 04:03:20'),
(69, 32, 17, 'debit', 1.00, 'Refund adjustment to supplier', '2025-04-16 04:03:20', '2025-04-16 04:03:20'),
(70, 33, 17, 'debit', 99.00, 'Reduce supplier payable (return)', '2025-04-16 05:26:47', '2025-04-16 05:26:47'),
(71, 33, 19, 'credit', 99.00, 'Inventory decreased (purchase return)', '2025-04-16 05:26:47', '2025-04-16 05:26:47'),
(72, 33, 20, 'credit', 99.00, 'Refund paid via asdf', '2025-04-16 05:26:47', '2025-04-16 05:26:47'),
(73, 33, 17, 'debit', 99.00, 'Refund adjustment to supplier', '2025-04-16 05:26:47', '2025-04-16 05:26:47'),
(74, 34, 19, 'debit', 200.00, 'Inventory received', '2025-04-16 06:10:37', '2025-04-16 06:10:37'),
(75, 34, 17, 'credit', 200.00, 'Payable to Supplier', '2025-04-16 06:10:37', '2025-04-16 06:10:37'),
(76, 34, 13, 'credit', 200.00, 'Payment via Unknown', '2025-04-16 06:10:37', '2025-04-16 06:10:37'),
(77, 34, 17, 'debit', 200.00, 'Partial payment to supplier', '2025-04-16 06:10:37', '2025-04-16 06:10:37'),
(78, 35, 29, 'debit', 100.00, 'Inventory received', '2025-04-17 00:02:30', '2025-04-17 00:02:30'),
(79, 35, 28, 'credit', 100.00, 'Payable to Supplier', '2025-04-17 00:02:30', '2025-04-17 00:02:30'),
(80, 35, 27, 'credit', 100.00, 'Payment via Nagad', '2025-04-17 00:02:30', '2025-04-17 00:02:30'),
(81, 35, 28, 'debit', 100.00, 'Partial payment to supplier', '2025-04-17 00:02:30', '2025-04-17 00:02:30'),
(82, 36, 28, 'debit', 50.00, 'Reduce supplier payable (return)', '2025-04-17 00:03:40', '2025-04-17 00:03:40'),
(83, 36, 29, 'credit', 50.00, 'Inventory decreased (purchase return)', '2025-04-17 00:03:40', '2025-04-17 00:03:40'),
(84, 36, 27, 'credit', 50.00, 'Refund paid via nagad ledger', '2025-04-17 00:03:40', '2025-04-17 00:03:40'),
(85, 36, 28, 'debit', 50.00, 'Refund adjustment to supplier', '2025-04-17 00:03:40', '2025-04-17 00:03:40'),
(86, 37, 28, 'credit', 36.00, 'Sale to customer', '2025-04-17 05:13:19', '2025-04-17 05:13:19'),
(87, 38, 28, 'credit', 81.70, 'Sale to customer', '2025-04-17 05:20:05', '2025-04-17 05:20:05'),
(88, 39, 28, 'credit', 95.50, 'Sale to customer', '2025-04-19 00:00:30', '2025-04-19 00:00:30'),
(89, 39, 27, 'debit', 95.50, 'Payment received via Nagad', '2025-04-19 00:00:30', '2025-04-19 00:00:30'),
(90, 39, 28, 'debit', 95.50, 'Receivable reduced from customer', '2025-04-19 00:00:30', '2025-04-19 00:00:30'),
(91, 40, 30, 'credit', 195.50, 'Sale to customer', '2025-04-19 00:50:00', '2025-04-19 00:50:00'),
(92, 40, 27, 'debit', 200.00, 'Payment received via Nagad', '2025-04-19 00:50:00', '2025-04-19 00:50:00'),
(93, 40, 30, 'debit', 200.00, 'Receivable reduced from customer', '2025-04-19 00:50:00', '2025-04-19 00:50:00'),
(96, 41, 30, 'credit', 19.00, 'Sale to customer', '2025-04-19 00:58:38', '2025-04-19 00:58:38'),
(97, 41, 27, 'debit', 19.00, 'Payment received via Nagad', '2025-04-19 00:58:38', '2025-04-19 00:58:38'),
(103, 44, 30, 'credit', 100.00, 'Updated sale to customer', '2025-04-19 01:38:50', '2025-04-19 01:38:50'),
(104, 44, 27, 'debit', 100.00, 'Updated payment received via Nagad', '2025-04-19 01:38:50', '2025-04-19 01:38:50'),
(105, 45, 30, 'credit', 20.00, 'Sale to customer', '2025-04-19 23:54:59', '2025-04-19 23:54:59'),
(106, 45, 27, 'debit', 20.00, 'Payment received via Nagad', '2025-04-19 23:54:59', '2025-04-19 23:54:59'),
(107, 45, 31, 'credit', 20.00, 'Inventory sold (COGS)', '2025-04-19 23:54:59', '2025-04-19 23:54:59'),
(108, 46, 29, 'debit', 190.00, 'Inventory received', '2025-04-20 00:00:02', '2025-04-20 00:00:02'),
(109, 46, 28, 'credit', 190.00, 'Payable to Supplier', '2025-04-20 00:00:02', '2025-04-20 00:00:02'),
(110, 46, 27, 'credit', 190.00, 'Payment via Nagad', '2025-04-20 00:00:02', '2025-04-20 00:00:02'),
(111, 46, 28, 'debit', 190.00, 'Partial payment to supplier', '2025-04-20 00:00:02', '2025-04-20 00:00:02'),
(112, 47, 30, 'credit', 30.00, 'Sale to customer', '2025-04-20 01:57:49', '2025-04-20 01:57:49'),
(113, 47, 27, 'debit', 30.00, 'Payment received via Nagad', '2025-04-20 01:57:49', '2025-04-20 01:57:49'),
(114, 47, 29, 'credit', 30.00, 'Inventory sold (COGS)', '2025-04-20 01:57:49', '2025-04-20 01:57:49'),
(115, 47, 33, 'debit', 30.00, 'Cost of Goods Sold', '2025-04-20 01:57:49', '2025-04-20 01:57:49'),
(125, 57, 30, 'credit', 20.00, 'Customer credited for sales return', '2025-04-20 04:52:00', '2025-04-20 04:52:00'),
(126, 57, 29, 'debit', 20.00, 'Inventory returned from customer', '2025-04-20 04:52:00', '2025-04-20 04:52:00'),
(127, 57, 33, 'debit', 20.00, 'Reversing cost of goods sold', '2025-04-20 04:52:00', '2025-04-20 04:52:00'),
(128, 57, 27, 'credit', 20.00, 'Refund to customer (cash/bank)', '2025-04-20 04:52:00', '2025-04-20 04:52:00'),
(137, 59, 30, 'credit', 60.00, 'Sale to customer', '2025-04-21 03:00:46', '2025-04-21 03:00:46'),
(138, 59, 27, 'debit', 60.00, 'Payment received via Nagad', '2025-04-21 03:00:46', '2025-04-21 03:00:46'),
(139, 59, 29, 'credit', 60.00, 'Inventory sold (COGS)', '2025-04-21 03:00:46', '2025-04-21 03:00:46'),
(140, 59, 33, 'debit', 60.00, 'Cost of Goods Sold', '2025-04-21 03:00:46', '2025-04-21 03:00:46'),
(141, 58, 29, 'debit', 200.00, 'Inventory received (edited)', '2025-04-21 04:33:02', '2025-04-21 04:33:02'),
(142, 58, 28, 'credit', 200.00, 'Payable to supplier (edited)', '2025-04-21 04:33:02', '2025-04-21 04:33:02'),
(143, 58, 27, 'credit', 200.00, 'Payment via Nagad (edited)', '2025-04-21 04:33:02', '2025-04-21 04:33:02'),
(144, 58, 28, 'debit', 200.00, 'Partial payment to supplier (edited)', '2025-04-21 04:33:02', '2025-04-21 04:33:02'),
(145, 60, 34, 'debit', 495.00, 'Inventory received', '2025-04-22 00:10:34', '2025-04-22 00:10:34'),
(146, 60, 35, 'credit', 495.00, 'Payable to Supplier', '2025-04-22 00:10:34', '2025-04-22 00:10:34'),
(147, 60, 5, 'credit', 494.00, 'Payment via Cash', '2025-04-22 00:10:34', '2025-04-22 00:10:34'),
(148, 60, 35, 'debit', 494.00, 'Partial payment to supplier', '2025-04-22 00:10:34', '2025-04-22 00:10:34'),
(149, 61, 29, 'debit', 50.00, 'Inventory received', '2025-04-22 05:21:17', '2025-04-22 05:21:17'),
(150, 61, 28, 'credit', 50.00, 'Payable to Supplier', '2025-04-22 05:21:17', '2025-04-22 05:21:17'),
(151, 61, 27, 'credit', 50.00, 'Payment via Nagad', '2025-04-22 05:21:17', '2025-04-22 05:21:17'),
(152, 61, 28, 'debit', 50.00, 'Partial payment to supplier', '2025-04-22 05:21:17', '2025-04-22 05:21:17'),
(159, 64, 27, 'debit', 50.00, 'Received via Nagad', '2025-04-22 23:51:09', '2025-04-22 23:51:09'),
(160, 64, 28, 'credit', 50.00, 'Received from Company Ledger', '2025-04-22 23:51:09', '2025-04-22 23:51:09'),
(161, 65, 36, 'debit', 1.00, 'Received to Rocket', '2025-04-23 00:06:21', '2025-04-23 00:06:21'),
(162, 65, 27, 'credit', 1.00, 'Transferred from Nagad', '2025-04-23 00:06:21', '2025-04-23 00:06:21'),
(163, 66, 28, 'debit', 100.00, 'Payment to Company Ledger', '2025-04-23 00:17:21', '2025-04-23 00:17:21'),
(164, 66, 27, 'credit', 100.00, 'Paid via Nagad', '2025-04-23 00:17:21', '2025-04-23 00:17:21'),
(165, 67, 28, 'debit', 21.00, 'Payment to Company Ledger', '2025-04-23 06:16:13', '2025-04-23 06:16:13'),
(166, 67, 27, 'credit', 21.00, 'Paid via Nagad', '2025-04-23 06:16:13', '2025-04-23 06:16:13'),
(167, 68, 30, 'credit', 99.00, 'Sale to customer', '2025-04-24 03:58:29', '2025-04-24 03:58:29'),
(168, 68, 27, 'debit', 99.00, 'Payment received via Nagad', '2025-04-24 03:58:29', '2025-04-24 03:58:29'),
(169, 68, 29, 'credit', 99.00, 'Inventory sold (COGS)', '2025-04-24 03:58:29', '2025-04-24 03:58:29'),
(170, 68, 33, 'debit', 99.00, 'Cost of Goods Sold', '2025-04-24 03:58:29', '2025-04-24 03:58:29'),
(171, 69, 29, 'debit', 40.00, 'Inventory received', '2025-04-26 00:32:35', '2025-04-26 00:32:35'),
(172, 69, 37, 'credit', 40.00, 'Payable to Supplier', '2025-04-26 00:32:35', '2025-04-26 00:32:35'),
(173, 69, 27, 'credit', 38.00, 'Payment via Nagad', '2025-04-26 00:32:35', '2025-04-26 00:32:35'),
(174, 69, 37, 'debit', 38.00, 'Partial payment to supplier', '2025-04-26 00:32:35', '2025-04-26 00:32:35'),
(175, 70, 29, 'debit', 320.00, 'Inventory received', '2025-04-27 04:34:51', '2025-04-27 04:34:51'),
(176, 70, 37, 'credit', 320.00, 'Payable to Supplier', '2025-04-27 04:34:51', '2025-04-27 04:34:51'),
(177, 70, 27, 'credit', 320.00, 'Payment via Nagad', '2025-04-27 04:34:51', '2025-04-27 04:34:51'),
(178, 70, 37, 'debit', 320.00, 'Partial payment to supplier', '2025-04-27 04:34:51', '2025-04-27 04:34:51'),
(179, 71, 2, 'debit', 199.00, 'Payment to Arif Enterprise', '2025-04-30 03:11:57', '2025-04-30 03:11:57'),
(180, 71, 5, 'credit', 199.00, 'Paid via Cash', '2025-04-30 03:11:57', '2025-04-30 03:11:57'),
(185, 73, 39, 'credit', 20000.00, 'Updated sale to customer', '2025-04-30 03:57:38', '2025-04-30 03:57:38'),
(186, 73, 27, 'debit', 15000.00, 'Updated payment received via Nagad', '2025-04-30 03:57:38', '2025-04-30 03:57:38'),
(187, 73, 39, 'debit', 15000.00, 'Receivable partially settled by customer', '2025-04-30 03:57:38', '2025-04-30 03:57:38'),
(188, 73, 31, 'credit', 20000.00, 'Inventory sold (COGS)', '2025-04-30 03:57:38', '2025-04-30 03:57:38'),
(189, 73, 33, 'debit', 20000.00, 'Cost of Goods Sold', '2025-04-30 03:57:38', '2025-04-30 03:57:38'),
(190, 74, 39, 'credit', 200.00, 'Sale to customer', '2025-04-30 03:59:19', '2025-04-30 03:59:19'),
(191, 74, 27, 'debit', 150.00, 'Payment received via Nagad', '2025-04-30 03:59:19', '2025-04-30 03:59:19'),
(192, 74, 39, 'debit', 150.00, 'Receivable partially settled by customer', '2025-04-30 03:59:19', '2025-04-30 03:59:19'),
(193, 74, 31, 'credit', 200.00, 'Inventory sold (COGS)', '2025-04-30 03:59:19', '2025-04-30 03:59:19'),
(194, 74, 33, 'debit', 200.00, 'Cost of Goods Sold', '2025-04-30 03:59:19', '2025-04-30 03:59:19'),
(195, 75, 41, 'credit', 1000.00, 'Sale to customer', '2025-04-30 05:06:31', '2025-04-30 05:06:31'),
(196, 75, 27, 'debit', 399.00, 'Payment received via Nagad', '2025-04-30 05:06:31', '2025-04-30 05:06:31'),
(197, 75, 41, 'debit', 399.00, 'Receivable partially settled by customer', '2025-04-30 05:06:31', '2025-04-30 05:06:31'),
(198, 75, 31, 'credit', 1000.00, 'Inventory sold (COGS)', '2025-04-30 05:06:31', '2025-04-30 05:06:31'),
(199, 75, 33, 'debit', 1000.00, 'Cost of Goods Sold', '2025-04-30 05:06:31', '2025-04-30 05:06:31'),
(200, 76, 41, 'credit', 500.00, 'Customer credited for sales return', '2025-04-30 06:29:03', '2025-04-30 06:29:03'),
(201, 76, 31, 'debit', 500.00, 'Inventory returned from customer', '2025-04-30 06:29:03', '2025-04-30 06:29:03'),
(202, 76, 33, 'debit', 500.00, 'Reversing cost of goods sold', '2025-04-30 06:29:03', '2025-04-30 06:29:03'),
(203, 76, 27, 'credit', 500.00, 'Refund to customer (cash/bank)', '2025-04-30 06:29:03', '2025-04-30 06:29:03'),
(204, 77, 41, 'credit', 180.00, 'Sale to customer', '2025-05-04 01:49:18', '2025-05-04 01:49:18'),
(205, 77, 27, 'debit', 179.00, 'Payment received via Nagad', '2025-05-04 01:49:18', '2025-05-04 01:49:18'),
(206, 77, 41, 'debit', 179.00, 'Receivable partially settled by customer', '2025-05-04 01:49:18', '2025-05-04 01:49:18'),
(207, 77, 29, 'credit', 180.00, 'Inventory sold (COGS)', '2025-05-04 01:49:18', '2025-05-04 01:49:18'),
(208, 77, 33, 'debit', 180.00, 'Cost of Goods Sold', '2025-05-04 01:49:18', '2025-05-04 01:49:18'),
(209, 78, 31, 'debit', 600.00, 'Inventory received', '2025-06-14 01:08:25', '2025-06-14 01:08:25'),
(210, 78, 38, 'credit', 600.00, 'Payable to Supplier', '2025-06-14 01:08:25', '2025-06-14 01:08:25'),
(211, 78, 27, 'credit', 600.00, 'Payment via Nagad', '2025-06-14 01:08:25', '2025-06-14 01:08:25'),
(212, 78, 38, 'debit', 600.00, 'Partial payment to supplier', '2025-06-14 01:08:25', '2025-06-14 01:08:25'),
(213, 79, 31, 'debit', 9.00, 'Inventory received', '2025-06-14 01:24:09', '2025-06-14 01:24:09'),
(214, 79, 37, 'credit', 9.00, 'Payable to Supplier', '2025-06-14 01:24:09', '2025-06-14 01:24:09'),
(215, 79, 27, 'credit', 9.00, 'Payment via Nagad', '2025-06-14 01:24:09', '2025-06-14 01:24:09'),
(216, 79, 37, 'debit', 9.00, 'Partial payment to supplier', '2025-06-14 01:24:09', '2025-06-14 01:24:09'),
(217, 80, 31, 'debit', 99.00, 'Inventory received', '2025-06-14 01:57:23', '2025-06-14 01:57:23'),
(218, 80, 38, 'credit', 99.00, 'Payable to Supplier', '2025-06-14 01:57:23', '2025-06-14 01:57:23'),
(219, 80, 27, 'credit', 99.00, 'Payment via Nagad', '2025-06-14 01:57:23', '2025-06-14 01:57:23'),
(220, 80, 38, 'debit', 99.00, 'Partial payment to supplier', '2025-06-14 01:57:23', '2025-06-14 01:57:23'),
(221, 80, 31, 'debit', 99.00, 'Inventory received (edited)', '2025-06-14 03:13:44', '2025-06-14 03:13:44'),
(222, 80, 38, 'credit', 99.00, 'Payable to supplier (edited)', '2025-06-14 03:13:44', '2025-06-14 03:13:44'),
(223, 80, 27, 'credit', 99.00, 'Payment via Nagad (edited)', '2025-06-14 03:13:44', '2025-06-14 03:13:44'),
(224, 80, 38, 'debit', 99.00, 'Partial payment to supplier (edited)', '2025-06-14 03:13:44', '2025-06-14 03:13:44'),
(225, 81, 39, 'credit', 300.00, 'Sale to customer', '2025-06-14 04:16:08', '2025-06-14 04:16:08'),
(226, 81, 27, 'debit', 300.00, 'Payment received via Nagad', '2025-06-14 04:16:08', '2025-06-14 04:16:08'),
(227, 81, 45, 'credit', 300.00, 'Inventory sold (COGS)', '2025-06-14 04:16:08', '2025-06-14 04:16:08'),
(228, 81, 33, 'debit', 300.00, 'Cost of Goods Sold', '2025-06-14 04:16:08', '2025-06-14 04:16:08'),
(229, 82, 38, 'debit', 100.00, 'Payment to Fresh Supplier Party', '2025-06-14 06:06:03', '2025-06-14 06:06:03'),
(230, 82, 27, 'credit', 100.00, 'Paid via Nagad', '2025-06-14 06:06:03', '2025-06-14 06:06:03'),
(231, 83, 36, 'debit', 500.00, 'Received via Rocket', '2025-06-14 06:07:22', '2025-06-14 06:07:22'),
(232, 83, 30, 'credit', 500.00, 'Received from Rafique Traders (Customer)', '2025-06-14 06:07:22', '2025-06-14 06:07:22'),
(233, 84, 37, 'debit', 200.00, 'Payment to Supplier Ledger (XYZ Traders)', '2025-06-14 06:15:47', '2025-06-14 06:15:47'),
(234, 84, 36, 'credit', 200.00, 'Paid via Rocket', '2025-06-14 06:15:47', '2025-06-14 06:15:47'),
(235, 85, 27, 'debit', 500.00, 'Received via Nagad', '2025-06-14 06:40:07', '2025-06-14 06:40:07'),
(236, 85, 41, 'credit', 500.00, 'Received from Sazzad Customer Test', '2025-06-14 06:40:07', '2025-06-14 06:40:07'),
(237, 86, 30, 'credit', 500.00, 'Sale to customer', '2025-06-15 01:03:11', '2025-06-15 01:03:11'),
(238, 86, 27, 'debit', 500.00, 'Payment received via Nagad', '2025-06-15 01:03:11', '2025-06-15 01:03:11'),
(239, 86, 45, 'credit', 500.00, 'Inventory sold (COGS)', '2025-06-15 01:03:11', '2025-06-15 01:03:11'),
(240, 86, 33, 'debit', 500.00, 'Cost of Goods Sold', '2025-06-15 01:03:11', '2025-06-15 01:03:11'),
(244, 95, 30, 'debit', 500.00, 'Sale price receivable', '2025-06-15 05:15:39', '2025-06-15 05:15:39'),
(245, 95, 48, 'credit', 500.00, 'Sales revenue', '2025-06-15 05:15:39', '2025-06-15 05:15:39'),
(246, 95, 27, 'debit', 300.00, 'Payment received via Nagad', '2025-06-15 05:15:39', '2025-06-15 05:15:39'),
(247, 95, 30, 'credit', 300.00, 'Receivable settled by customer', '2025-06-15 05:15:39', '2025-06-15 05:15:39'),
(248, 95, 29, 'credit', 400.00, 'Inventory out (at cost)', '2025-06-15 05:15:39', '2025-06-15 05:15:39'),
(249, 95, 33, 'debit', 400.00, 'Cost of Goods Sold', '2025-06-15 05:15:39', '2025-06-15 05:15:39'),
(250, 96, 49, 'debit', 200.00, 'Inventory received', '2025-06-15 06:45:23', '2025-06-15 06:45:23'),
(251, 96, 38, 'credit', 200.00, 'Payable to Supplier', '2025-06-15 06:45:23', '2025-06-15 06:45:23'),
(252, 96, 27, 'credit', 150.00, 'Payment via Nagad', '2025-06-15 06:45:23', '2025-06-15 06:45:23'),
(253, 96, 38, 'debit', 150.00, 'Partial payment to supplier', '2025-06-15 06:45:23', '2025-06-15 06:45:23'),
(254, 97, 30, 'credit', 250.00, 'Customer credited for sales return', '2025-06-15 07:22:56', '2025-06-15 07:22:56'),
(255, 97, 29, 'debit', 250.00, 'Inventory returned from customer', '2025-06-15 07:22:56', '2025-06-15 07:22:56'),
(256, 97, 33, 'debit', 250.00, 'Reversing cost of goods sold', '2025-06-15 07:22:56', '2025-06-15 07:22:56'),
(257, 97, 27, 'credit', 250.00, 'Refund to customer (cash/bank)', '2025-06-15 07:22:56', '2025-06-15 07:22:56'),
(258, 98, 10, 'debit', 50000.00, 'Salary Expense', '2025-06-16 03:17:02', '2025-06-16 03:17:02'),
(259, 98, 50, 'credit', 50000.00, 'Payable to employee', '2025-06-16 03:17:02', '2025-06-16 03:17:02'),
(260, 99, 10, 'debit', 40000.00, 'Accrued salary', '2025-06-16 05:06:30', '2025-06-16 05:06:30'),
(261, 99, 51, 'credit', 40000.00, 'Salary payable', '2025-06-16 05:06:30', '2025-06-16 05:06:30'),
(262, 100, 51, 'debit', 40000.00, 'Salary settlement', '2025-06-16 05:17:40', '2025-06-16 05:17:40'),
(263, 100, 27, 'credit', 40000.00, 'Paid via nagad ledger', '2025-06-16 05:17:40', '2025-06-16 05:17:40'),
(264, 101, 10, 'debit', 50000.00, 'Accrued salary', '2025-06-16 05:22:26', '2025-06-16 05:22:26'),
(265, 101, 50, 'credit', 50000.00, 'Salary payable', '2025-06-16 05:22:26', '2025-06-16 05:22:26'),
(266, 102, 10, 'debit', 50000.00, 'Accrued salary', '2025-06-16 05:25:30', '2025-06-16 05:25:30'),
(267, 102, 50, 'credit', 50000.00, 'Salary payable', '2025-06-16 05:25:30', '2025-06-16 05:25:30'),
(268, 103, 50, 'debit', 50000.00, 'Salary settlement', '2025-06-16 05:25:47', '2025-06-16 05:25:47'),
(269, 103, 27, 'credit', 50000.00, 'Paid via nagad ledger', '2025-06-16 05:25:47', '2025-06-16 05:25:47'),
(270, 104, 53, 'debit', 22000.00, 'Accrued salary', '2025-06-16 06:38:10', '2025-06-16 06:38:10'),
(271, 104, 52, 'credit', 22000.00, 'Salary payable', '2025-06-16 06:38:10', '2025-06-16 06:38:10'),
(272, 105, 53, 'debit', 50000.00, 'Accrued salary', '2025-06-16 07:00:00', '2025-06-16 07:00:00'),
(273, 105, 54, 'credit', 50000.00, 'Salary payable', '2025-06-16 07:00:00', '2025-06-16 07:00:00'),
(274, 106, 54, 'debit', 50000.00, 'Salary settlement', '2025-06-16 07:04:14', '2025-06-16 07:04:14'),
(275, 106, 27, 'credit', 50000.00, 'Paid via nagad ledger', '2025-06-16 07:04:14', '2025-06-16 07:04:14'),
(284, 114, 31, 'debit', 150.00, 'Sale price receivable', '2025-06-21 01:13:32', '2025-06-21 01:13:32'),
(285, 114, 55, 'credit', 150.00, 'Sales revenue', '2025-06-21 01:13:32', '2025-06-21 01:13:32'),
(286, 114, 36, 'debit', 150.00, 'Payment received via Rocket', '2025-06-21 01:13:32', '2025-06-21 01:13:32'),
(287, 114, 31, 'credit', 150.00, 'Receivable settled by customer', '2025-06-21 01:13:32', '2025-06-21 01:13:32'),
(288, 114, 29, 'credit', 30.00, 'Inventory out (at cost)', '2025-06-21 01:13:32', '2025-06-21 01:13:32'),
(289, 114, 33, 'debit', 30.00, 'Cost of Goods Sold', '2025-06-21 01:13:32', '2025-06-21 01:13:32'),
(290, 115, 29, 'debit', 2490.00, 'Sale price receivable', '2025-06-21 01:13:57', '2025-06-21 01:13:57'),
(291, 115, 55, 'credit', 2490.00, 'Sales revenue', '2025-06-21 01:13:57', '2025-06-21 01:13:57'),
(292, 115, 27, 'debit', 2000.00, 'Payment received via Nagad', '2025-06-21 01:13:57', '2025-06-21 01:13:57'),
(293, 115, 29, 'credit', 2000.00, 'Receivable settled', '2025-06-21 01:13:57', '2025-06-21 01:13:57'),
(294, 115, 29, 'credit', 50.00, 'Inventory out (at cost)', '2025-06-21 01:13:57', '2025-06-21 01:13:57'),
(295, 115, 33, 'debit', 50.00, 'Cost of Goods Sold', '2025-06-21 01:13:57', '2025-06-21 01:13:57'),
(321, 117, 27, 'credit', 51.00, 'Refund paid via nagad ledger', '2025-06-21 01:55:35', '2025-06-21 01:55:35'),
(322, 117, 27, 'debit', 51.00, 'Refund adjustment to supplier', '2025-06-21 01:55:35', '2025-06-21 01:55:35'),
(323, 117, 28, 'debit', 52.00, NULL, '2025-06-21 01:55:35', '2025-06-21 01:55:35'),
(328, 118, 27, 'credit', 54.00, 'Refund paid via nagad ledger', '2025-06-21 03:32:42', '2025-06-21 03:32:42'),
(329, 118, 28, 'debit', 54.00, 'Refund adjustment to supplier', '2025-06-21 03:32:42', '2025-06-21 03:32:42'),
(330, 118, 28, 'debit', 54.00, NULL, '2025-06-21 03:32:42', '2025-06-21 03:32:42'),
(331, 118, 29, 'credit', 54.00, NULL, '2025-06-21 03:32:42', '2025-06-21 03:32:42'),
(332, 119, 30, 'debit', 142.00, 'Sale price receivable', '2025-06-21 03:35:00', '2025-06-21 03:35:00'),
(333, 119, 55, 'credit', 142.00, 'Sales revenue', '2025-06-21 03:35:00', '2025-06-21 03:35:00'),
(334, 119, 27, 'debit', 142.00, 'Payment received via Nagad', '2025-06-21 03:35:00', '2025-06-21 03:35:00'),
(335, 119, 30, 'credit', 142.00, 'Receivable settled', '2025-06-21 03:35:00', '2025-06-21 03:35:00'),
(336, 119, 29, 'credit', 150.00, 'Inventory out (at cost)', '2025-06-21 03:35:00', '2025-06-21 03:35:00'),
(337, 119, 33, 'debit', 150.00, 'Cost of Goods Sold', '2025-06-21 03:35:00', '2025-06-21 03:35:00'),
(338, 120, 58, 'debit', 50000.00, 'Accrued salary', '2025-07-15 00:33:16', '2025-07-15 00:33:16'),
(339, 120, 50, 'credit', 50000.00, 'Salary payable', '2025-07-15 00:33:16', '2025-07-15 00:33:16'),
(340, 121, 58, 'debit', 25000.00, 'Accrued salary', '2025-07-15 00:34:56', '2025-07-15 00:34:56'),
(341, 121, 50, 'credit', 25000.00, 'Salary payable', '2025-07-15 00:34:56', '2025-07-15 00:34:56'),
(342, 122, 50, 'debit', 25000.00, 'Salary settlement', '2025-07-15 00:35:23', '2025-07-15 00:35:23'),
(343, 122, 36, 'credit', 25000.00, 'Paid via Rocket Ledger', '2025-07-15 00:35:23', '2025-07-15 00:35:23'),
(344, 123, 53, 'debit', 40000.00, 'Accrued salary', '2025-07-15 00:42:42', '2025-07-15 00:42:42'),
(345, 123, 51, 'credit', 40000.00, 'Salary payable', '2025-07-15 00:42:42', '2025-07-15 00:42:42'),
(346, 124, 51, 'debit', 20000.00, 'Salary settlement', '2025-07-15 00:43:44', '2025-07-15 00:43:44'),
(347, 124, 27, 'credit', 20000.00, 'Paid via nagad ledger', '2025-07-15 00:43:44', '2025-07-15 00:43:44'),
(348, 125, 28, 'debit', 1000.00, 'Sale price receivable', '2025-07-15 01:04:20', '2025-07-15 01:04:20'),
(349, 125, 55, 'credit', 1000.00, 'Sales revenue', '2025-07-15 01:04:20', '2025-07-15 01:04:20'),
(350, 125, 27, 'debit', 600.00, 'Payment received via Nagad', '2025-07-15 01:04:20', '2025-07-15 01:04:20'),
(351, 125, 28, 'credit', 600.00, 'Receivable settled by customer', '2025-07-15 01:04:20', '2025-07-15 01:04:20'),
(352, 125, 29, 'credit', 20.00, 'Inventory out (at cost)', '2025-07-15 01:04:20', '2025-07-15 01:04:20'),
(353, 125, 33, 'debit', 20.00, 'Cost of Goods Sold', '2025-07-15 01:04:20', '2025-07-15 01:04:20'),
(380, 139, 30, 'debit', 500.00, 'Sale price receivable', '2025-07-15 07:46:13', '2025-07-15 07:46:13'),
(381, 139, 55, 'credit', 500.00, 'Sales revenue', '2025-07-15 07:46:13', '2025-07-15 07:46:13'),
(382, 139, 27, 'debit', 50.00, 'Customer payment', '2025-07-15 07:46:13', '2025-07-15 07:46:13'),
(383, 139, 30, 'credit', 50.00, 'Receivable settled', '2025-07-15 07:46:13', '2025-07-15 07:46:13'),
(384, 139, 31, 'credit', 500.00, 'Inventory out (at cost)', '2025-07-15 07:46:13', '2025-07-15 07:46:13'),
(385, 139, 33, 'debit', 500.00, 'Cost of Goods Sold', '2025-07-15 07:46:13', '2025-07-15 07:46:13'),
(386, 140, 30, 'debit', 50.00, 'Sale price receivable', '2025-07-15 07:55:13', '2025-07-15 07:55:13'),
(387, 140, 55, 'credit', 50.00, 'Sales revenue', '2025-07-15 07:55:13', '2025-07-15 07:55:13'),
(388, 140, 27, 'debit', 10.00, 'Customer payment', '2025-07-15 07:55:13', '2025-07-15 07:55:13'),
(389, 140, 30, 'credit', 10.00, 'Receivable settled', '2025-07-15 07:55:13', '2025-07-15 07:55:13'),
(390, 140, 29, 'credit', 50.00, 'Inventory out (at cost)', '2025-07-15 07:55:13', '2025-07-15 07:55:13'),
(391, 140, 33, 'debit', 50.00, 'Cost of Goods Sold', '2025-07-15 07:55:13', '2025-07-15 07:55:13'),
(392, 140, 27, 'debit', 10.00, 'Customer payment', '2025-07-16 01:24:31', '2025-07-16 01:24:31'),
(393, 140, 30, 'credit', 10.00, 'Receivable settled', '2025-07-16 01:24:31', '2025-07-16 01:24:31'),
(394, 141, 30, 'debit', 100.00, 'Sale price receivable', '2025-07-16 01:32:50', '2025-07-16 01:32:50'),
(395, 141, 55, 'credit', 100.00, 'Sales revenue', '2025-07-16 01:32:50', '2025-07-16 01:32:50'),
(396, 141, 29, 'credit', 80.00, 'Inventory out (at cost)', '2025-07-16 01:32:50', '2025-07-16 01:32:50'),
(397, 141, 33, 'debit', 80.00, 'Cost of Goods Sold', '2025-07-16 01:32:50', '2025-07-16 01:32:50'),
(398, 142, 30, 'debit', 99.00, 'Sale price receivable', '2025-07-16 01:47:36', '2025-07-16 01:47:36'),
(399, 142, 55, 'credit', 99.00, 'Sales revenue', '2025-07-16 01:47:36', '2025-07-16 01:47:36'),
(400, 142, 29, 'credit', 50.00, 'Inventory out (at cost)', '2025-07-16 01:47:36', '2025-07-16 01:47:36'),
(401, 142, 33, 'debit', 50.00, 'Cost of Goods Sold', '2025-07-16 01:47:36', '2025-07-16 01:47:36'),
(402, 143, 30, 'debit', 98.00, 'Sale price receivable', '2025-07-16 04:19:08', '2025-07-16 04:19:08'),
(403, 143, 55, 'credit', 98.00, 'Sales revenue', '2025-07-16 04:19:08', '2025-07-16 04:19:08'),
(404, 143, 29, 'credit', 50.00, 'Inventory out (at cost)', '2025-07-16 04:19:08', '2025-07-16 04:19:08'),
(405, 143, 33, 'debit', 50.00, 'Cost of Goods Sold', '2025-07-16 04:19:08', '2025-07-16 04:19:08'),
(408, 145, 30, 'debit', 102.00, 'Sale price receivable', '2025-07-16 04:43:43', '2025-07-16 04:43:43'),
(409, 145, 55, 'credit', 102.00, 'Sales revenue', '2025-07-16 04:43:43', '2025-07-16 04:43:43'),
(410, 145, 29, 'credit', 40.00, 'Inventory out (at cost)', '2025-07-16 04:43:43', '2025-07-16 04:43:43'),
(411, 145, 33, 'debit', 40.00, 'Cost of Goods Sold', '2025-07-16 04:43:43', '2025-07-16 04:43:43'),
(412, 146, 30, 'debit', 109.00, 'Sale price receivable', '2025-07-16 04:57:27', '2025-07-16 04:57:27'),
(413, 146, 55, 'credit', 109.00, 'Sales revenue', '2025-07-16 04:57:27', '2025-07-16 04:57:27'),
(414, 146, 27, 'debit', 1.00, 'Customer payment', '2025-07-16 04:57:27', '2025-07-16 04:57:27'),
(415, 146, 30, 'credit', 1.00, 'Receivable settled', '2025-07-16 04:57:27', '2025-07-16 04:57:27'),
(416, 146, 29, 'credit', 40.00, 'Inventory out (at cost)', '2025-07-16 04:57:27', '2025-07-16 04:57:27'),
(417, 146, 33, 'debit', 40.00, 'Cost of Goods Sold', '2025-07-16 04:57:27', '2025-07-16 04:57:27'),
(418, 146, 27, 'debit', 100.00, 'Customer payment', '2025-07-16 06:14:16', '2025-07-16 06:14:16'),
(419, 146, 30, 'credit', 100.00, 'Receivable settled', '2025-07-16 06:14:16', '2025-07-16 06:14:16'),
(420, 146, 27, 'debit', 8.00, 'Customer payment', '2025-07-16 06:15:49', '2025-07-16 06:15:49'),
(421, 146, 30, 'credit', 8.00, 'Receivable settled', '2025-07-16 06:15:49', '2025-07-16 06:15:49'),
(422, 146, 27, 'debit', 76.62, 'Customer payment', '2025-07-16 06:43:43', '2025-07-16 06:43:43'),
(423, 146, 30, 'credit', 76.62, 'Receivable settled', '2025-07-16 06:43:43', '2025-07-16 06:43:43'),
(424, 147, 27, 'debit', 40.00, 'Customer payment', '2025-07-17 01:39:02', '2025-07-17 01:39:02'),
(425, 147, 1, 'credit', 40.00, 'Receivable settled', '2025-07-17 01:39:02', '2025-07-17 01:39:02'),
(426, 145, 27, 'debit', 20.00, 'Customer payment', '2025-07-17 05:10:33', '2025-07-17 05:10:33'),
(427, 145, 30, 'credit', 20.00, 'Receivable settled', '2025-07-17 05:10:33', '2025-07-17 05:10:33'),
(428, 143, 27, 'debit', 200.00, 'Customer payment', '2025-07-17 07:12:26', '2025-07-17 07:12:26'),
(429, 143, 30, 'credit', 200.00, 'Receivable settled', '2025-07-17 07:12:26', '2025-07-17 07:12:26'),
(430, 148, 53, 'debit', 100.00, 'Accrued salary', '2025-07-19 01:34:06', '2025-07-19 01:34:06'),
(431, 148, 59, 'credit', 100.00, 'Salary payable', '2025-07-19 01:34:06', '2025-07-19 01:34:06'),
(432, 149, 59, 'debit', 20.00, 'Salary settlement', '2025-07-19 01:35:16', '2025-07-19 01:35:16'),
(433, 149, 27, 'credit', 20.00, 'Paid via nagad ledger', '2025-07-19 01:35:16', '2025-07-19 01:35:16'),
(434, 150, 59, 'debit', 21.00, 'Salary settlement', '2025-07-19 01:38:48', '2025-07-19 01:38:48'),
(435, 150, 27, 'credit', 21.00, 'Paid via nagad ledger', '2025-07-19 01:38:48', '2025-07-19 01:38:48'),
(436, 151, 59, 'debit', 25.00, 'Salary settlement', '2025-07-20 00:23:59', '2025-07-20 00:23:59'),
(437, 151, 27, 'credit', 25.00, 'Paid via nagad ledger', '2025-07-20 00:23:59', '2025-07-20 00:23:59'),
(438, 152, 30, 'debit', 500.00, 'Sale price receivable', NULL, NULL),
(439, 152, 55, 'credit', 500.00, 'Sales revenue', NULL, NULL),
(440, 152, 27, 'debit', 500.00, 'Customer payment', '2025-07-23 04:18:45', '2025-07-23 04:18:45'),
(441, 152, 30, 'credit', 500.00, 'Receivable settled', '2025-07-23 04:18:45', '2025-07-23 04:18:45'),
(442, 152, 29, 'credit', 200.00, 'Inventory out (at cost)', NULL, NULL),
(443, 152, 33, 'debit', 200.00, 'Cost of Goods Sold', NULL, NULL),
(444, 153, 30, 'debit', 100.00, 'Sale price receivable', NULL, NULL),
(445, 153, 55, 'credit', 100.00, 'Sales revenue', NULL, NULL),
(446, 153, 36, 'debit', 100.00, 'Customer payment', '2025-07-23 04:21:27', '2025-07-23 04:21:27'),
(447, 153, 30, 'credit', 100.00, 'Receivable settled', '2025-07-23 04:21:27', '2025-07-23 04:21:27'),
(448, 153, 29, 'credit', 40.00, 'Inventory out (at cost)', NULL, NULL),
(449, 153, 33, 'debit', 40.00, 'Cost of Goods Sold', NULL, NULL),
(450, 154, 63, 'debit', 650.00, 'Sale price receivable', NULL, NULL),
(451, 154, 64, 'credit', 650.00, 'Sales revenue', NULL, NULL),
(452, 154, 61, 'debit', 650.00, 'Customer payment', '2025-07-23 04:35:00', '2025-07-23 04:35:00'),
(453, 154, 63, 'credit', 650.00, 'Receivable settled', '2025-07-23 04:35:00', '2025-07-23 04:35:00'),
(454, 154, 60, 'credit', 150.00, 'Inventory out (at cost)', NULL, NULL),
(455, 154, 62, 'debit', 150.00, 'Cost of Goods Sold', NULL, NULL),
(456, 155, 63, 'debit', 345.00, 'Sale price receivable', NULL, NULL),
(457, 155, 64, 'credit', 345.00, 'Sales revenue', NULL, NULL),
(458, 155, 61, 'debit', 343.00, 'Customer payment', '2025-07-23 04:41:14', '2025-07-23 04:41:14'),
(459, 155, 63, 'credit', 343.00, 'Receivable settled', '2025-07-23 04:41:14', '2025-07-23 04:41:14'),
(460, 155, 60, 'credit', 75.00, 'Inventory out (at cost)', NULL, NULL),
(461, 155, 62, 'debit', 75.00, 'Cost of Goods Sold', NULL, NULL),
(462, 156, 63, 'debit', 130.00, 'Sale price receivable', NULL, NULL),
(463, 156, 64, 'credit', 130.00, 'Sales revenue', NULL, NULL),
(464, 156, 60, 'credit', 30.00, 'Inventory out (at cost)', NULL, NULL),
(465, 156, 62, 'debit', 30.00, 'Cost of Goods Sold', NULL, NULL),
(466, 157, 61, 'debit', 130.00, 'Customer payment', '2025-07-23 07:35:40', '2025-07-23 07:35:40'),
(467, 157, 63, 'credit', 130.00, 'Receivable settled', '2025-07-23 07:35:40', '2025-07-23 07:35:40'),
(468, 158, 63, 'debit', 390.00, 'Sale price receivable', NULL, NULL),
(469, 158, 64, 'credit', 390.00, 'Sales revenue', NULL, NULL),
(470, 158, 60, 'credit', 90.00, 'Inventory out (at cost)', NULL, NULL),
(471, 158, 62, 'debit', 90.00, 'Cost of Goods Sold', NULL, NULL);

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
(46, '2025_04_03_181621_create_payment_adds_table', 31),
(47, '2025_04_06_061641_drop_unique_from_voucher_no_on_payment_adds', 32),
(48, '2025_04_06_073555_add_foreign_key_to_payment_mode_id_on_payment_adds_table', 33),
(49, '2025_04_06_095708_create_contra_adds_table', 34),
(50, '2025_04_06_095843_create_contra_add_details_table', 35),
(51, '2025_04_06_105727_add_mode_columns_to_contra_adds_table', 36),
(52, '2025_04_06_105918_add_amount_to_contra_adds_table', 37),
(53, '2025_04_06_110133_add_description_to_contra_adds_table', 38),
(54, '2025_04_06_110401_add_send_sms_to_contra_adds_table', 39),
(55, '2025_04_06_125315_create_journals_table', 40),
(56, '2025_04_06_125403_create_journal_entries_table', 40),
(57, '2025_04_07_074942_create_stock_transfers_table', 41),
(58, '2025_04_07_075106_create_stock_transfer_items_table', 42),
(59, '2025_04_07_115821_create_item_stocks_table', 43),
(60, '2025_04_07_121347_drop_unique_item_code_from_items_table', 44),
(62, '2025_04_08_102252_create_working_orders_table', 45),
(63, '2025_04_08_102334_create_working_order_items_table', 46),
(64, '2025_04_08_114003_create_working_order_extras_table', 47),
(65, '2025_04_09_050314_add_production_columns_to_working_orders_table', 48),
(66, '2025_04_09_061338_create_finished_products_table', 49),
(67, '2025_04_09_061456_create_finished_product_items_table', 50),
(68, '2025_04_06_112046_create_departments_table', 51),
(69, '2025_04_06_115453_create_designations_table', 51),
(70, '2025_04_06_122507_create_shifts_table', 51),
(71, '2025_04_06_124938_create_employees_table', 51),
(72, '2025_04_07_051843_create_salary_slips_table', 51),
(73, '2025_04_07_052046_create_salary_slip_employees_table', 51),
(74, '2025_04_08_072642_create_salary_receives_table', 51),
(75, '2025_04_09_122902_create_salary_strctures_table', 52),
(76, '2025_04_09_122958_add_salary_structure_to_employees_table', 53),
(77, '2025_04_09_123104_update_salary_slips_table', 54),
(78, '2025_04_09_125211_add_salary_slip_employee_to_salary_receives_table', 55),
(79, '2025_04_09_125901_add_journal_to_salary_receives_table', 56),
(80, '2025_04_09_130934_add_ledger_id_to_received_modes_table', 57),
(81, '2025_04_10_052635_add_created_by_to_received_modes_table', 58),
(82, '2025_04_10_055341_add_created_by_to_sales_orders_table', 59),
(83, '2025_04_10_060655_add_created_by_to_received_adds_table', 60),
(84, '2025_04_10_133316_add_created_by_to_salary_receives_table', 61),
(85, '2025_04_10_133555_add_foreign_key_to_salary_receives_created_by', 62),
(86, '2025_04_12_051516_add_paid_amount_to_salary_slip_employees_table', 63),
(87, '2025_04_12_053959_add_status_to_salary_slip_employees_table', 64),
(89, '2025_04_13_113050_add_amount_paid_to_received_modes_table', 65),
(90, '2025_04_13_113403_add_transaction_date_to_received_modes', 66),
(91, '2025_04_15_061242_add_journal_id_to_purchases_table', 67),
(92, '2025_04_15_061901_create_system_ledgers_table', 68),
(93, '2025_04_15_070432_create_stocks_table', 69),
(94, '2025_04_15_070734_add_created_by_to_stocks_table', 70),
(95, '2025_04_15_105521_add_payment_fields_to_purchases_table', 71),
(96, '2025_04_16_071309_add_purchase_return_id_to_received_modes_table', 72),
(97, '2025_04_16_100057_add_journal_id_to_purchase_returns_table', 73),
(98, '2025_04_17_113433_add_sale_id_to_received_modes_table', 74),
(99, '2025_04_17_114335_add_journal_and_received_mode_to_sales_table', 75),
(100, '2025_04_19_055333_add_amount_receive_to_sales_table', 76),
(101, '2025_04_19_055940_rename_amount_receive_column_in_sales_table', 77),
(102, '2025_04_20_051301_add_inventory_ledger_id_to_sales_and_returns', 78),
(103, '2025_04_20_060748_add_cogs_ledger_id_to_sales_and_sales_returns', 79),
(104, '2025_04_20_103358_add_received_mode_to_sales_returns_table', 80),
(105, '2025_04_24_085812_add_voucher_type_to_journals', 81),
(106, '2025_04_26_084615_modify_working_orders_table', 82),
(107, '2025_04_27_135714_add_unique_constraint_to_production_voucher_no', 83),
(108, '2025_05_03_091440_add_logo_thumb_to_company_settings', 84),
(109, '2025_05_03_105816_add_ledger_type_to_account_ledgers_table', 85),
(110, '2025_05_04_103207_add_avg_cost_to_stocks', 86),
(111, '2025_05_05_102437_create_party_job_stocks_and_party_stock_moves', 87),
(112, '2025_05_05_132027_add_rate_and_total_to_party_stock_moves_table', 88),
(113, '2025_05_05_135006_add_unit_to_party_stock_moves_table', 89),
(114, '2025_06_14_075459_add_inventory_ledger_id_to_purchases_table', 90),
(115, '2025_06_21_075018_add_inventory_ledger_id_to_purchase_returns_table', 91),
(116, '2025_07_07_132545_create_party_items_table', 92),
(117, '2025_07_07_132826_add_party_item_id_to_party_job_stocks', 93),
(118, '2025_07_07_133136_rename_item_id_in_party_stock_moves', 94),
(119, '2025_07_08_070519_add_unit_name_to_party_job_stocks', 95),
(120, '2025_07_08_070902_make_item_id_nullable_in_party_job_stocks', 96),
(121, '2025_07_12_070602_alter_move_type_enum_on_party_stock_moves', 97),
(122, '2025_07_12_111129_create_conversion_vouchers_table', 98),
(123, '2025_07_12_111135_create_conversion_lines_table', 98),
(124, '2025_07_12_113231_create_rent_vouchers_table', 99),
(125, '2025_07_12_113232_create_rent_voucher_lines_table', 99),
(126, '2025_07_12_124126_add_received_mode_id_to_rent_vouchers', 100),
(127, '2025_07_13_065222_add_unit_name_to_rent_voucher_lines', 101),
(128, '2025_07_15_092650_create_sale_payments_table', 102),
(129, '2025_07_15_093409_add_interest_columns_to_sales', 102),
(130, '2025_07_16_064140_add_interest_fields_to_company_settings', 103),
(131, '2025_07_16_075434_add_interest_schedule_to_company_settings', 104),
(132, '2025_07_16_091548_add_monthly_rate_to_company_settings', 105),
(133, '2025_07_16_092712_add_yearly_rate_to_company_settings', 106),
(134, '2025_07_19_055606_add_waive_interest_to_sale_payments', 107),
(135, '2025_07_22_060928_add_sale_flow_to_company_settings_table', 108),
(136, '2025_07_22_065628_add_approval_fields_to_sales', 109),
(137, '2025_07_22_065819_create_sale_approvals_table', 110),
(138, '2025_07_23_074851_add_rejection_fields_to_sales_table', 111),
(139, '2025_07_23_134139_add_created_by-to_sale_approvals', 112);

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
(2, 'App\\Models\\User', 9),
(2, 'App\\Models\\User', 10),
(3, 'App\\Models\\User', 10),
(2, 'App\\Models\\User', 11),
(3, 'App\\Models\\User', 11),
(5, 'App\\Models\\User', 12),
(2, 'App\\Models\\User', 13),
(12, 'App\\Models\\User', 13),
(10, 'App\\Models\\User', 14),
(11, 'App\\Models\\User', 14),
(10, 'App\\Models\\User', 15),
(14, 'App\\Models\\User', 15),
(12, 'App\\Models\\User', 16),
(13, 'App\\Models\\User', 16),
(12, 'App\\Models\\User', 17);

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
-- Table structure for table `party_items`
--

CREATE TABLE `party_items` (
  `id` bigint UNSIGNED NOT NULL,
  `party_ledger_id` bigint UNSIGNED NOT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_id` bigint UNSIGNED DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `party_items`
--

INSERT INTO `party_items` (`id`, `party_ledger_id`, `item_name`, `unit_id`, `created_by`, `created_at`, `updated_at`) VALUES
(4, 56, '29 najirshail', NULL, 12, '2025-07-08 01:11:06', '2025-07-08 01:11:06'),
(5, 56, '90 Aatop', NULL, 12, '2025-07-08 01:16:06', '2025-07-08 01:16:06'),
(6, 56, 'najirshail 14', NULL, 13, '2025-07-12 01:08:01', '2025-07-12 01:08:01'),
(7, 56, 'najirshail 15', NULL, 13, '2025-07-12 01:08:01', '2025-07-12 01:08:01'),
(8, 56, 'bran', NULL, 13, '2025-07-12 03:16:33', '2025-07-12 03:16:33'),
(9, 56, 'murir chaal', NULL, 13, '2025-07-12 03:16:33', '2025-07-12 03:16:33'),
(10, 56, 'test', 14, 13, '2025-07-13 02:00:05', '2025-07-13 02:00:05'),
(11, 56, '28', 14, 13, '2025-07-14 01:03:53', '2025-07-14 01:03:53'),
(12, 57, 'masud item', 14, 13, '2025-07-14 01:58:43', '2025-07-14 01:58:43'),
(13, 57, 'masud item 1', NULL, 13, '2025-07-14 02:01:05', '2025-07-14 02:01:05'),
(14, 57, 'masud item 2', NULL, 13, '2025-07-14 02:01:05', '2025-07-14 02:01:05'),
(15, 57, 'shorna 5', 14, 12, '2025-07-19 01:17:22', '2025-07-19 01:17:22');

-- --------------------------------------------------------

--
-- Table structure for table `party_job_stocks`
--

CREATE TABLE `party_job_stocks` (
  `id` bigint UNSIGNED NOT NULL,
  `party_ledger_id` bigint UNSIGNED NOT NULL,
  `party_item_id` bigint UNSIGNED DEFAULT NULL,
  `item_id` bigint UNSIGNED DEFAULT NULL,
  `godown_id` bigint UNSIGNED NOT NULL,
  `qty` decimal(12,3) NOT NULL DEFAULT '0.000',
  `unit_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `party_job_stocks`
--

INSERT INTO `party_job_stocks` (`id`, `party_ledger_id`, `party_item_id`, `item_id`, `godown_id`, `qty`, `unit_name`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 41, NULL, 23, 10, 5.000, NULL, 12, '2025-05-05 23:17:52', '2025-05-05 23:17:52'),
(2, 46, NULL, 23, 11, 50.000, NULL, 12, '2025-05-05 23:29:06', '2025-05-05 23:29:06'),
(3, 41, NULL, 24, 11, 5.000, NULL, 12, '2025-05-06 00:08:27', '2025-05-06 00:08:27'),
(4, 46, NULL, 25, 10, 60.000, NULL, 12, '2025-05-06 00:11:34', '2025-05-06 00:11:34'),
(5, 46, NULL, 27, 10, 70.000, NULL, 12, '2025-05-06 00:11:34', '2025-05-06 00:11:34'),
(6, 41, NULL, 27, 11, 25.000, NULL, 12, '2025-05-06 00:57:51', '2025-05-06 00:57:51'),
(7, 56, NULL, 29, 10, 50.000, NULL, 12, '2025-07-07 06:20:59', '2025-07-07 06:20:59'),
(8, 56, 4, NULL, 10, 48.000, 'Bag', 12, '2025-07-08 01:11:06', '2025-07-12 03:16:33'),
(9, 56, 5, NULL, 10, 50.000, 'KG', 13, '2025-07-08 01:16:07', '2025-07-13 03:25:16'),
(10, 56, 6, NULL, 10, 26.000, 'Bag', 13, '2025-07-12 01:08:01', '2025-07-12 01:08:01'),
(11, 56, 7, NULL, 10, 22.000, 'Bag', 13, '2025-07-12 01:08:01', '2025-07-12 01:08:01'),
(12, 56, 8, NULL, 10, 1.000, 'KG', 13, '2025-07-12 03:16:33', '2025-07-12 03:16:33'),
(13, 56, 9, NULL, 10, 2.000, 'Bag', 13, '2025-07-12 03:16:33', '2025-07-12 03:16:33'),
(14, 56, 10, NULL, 10, 5000.000, 'KG', 13, '2025-07-13 02:00:05', '2025-07-13 02:00:05'),
(15, 56, 11, NULL, 11, 500.000, 'KG', 13, '2025-07-14 01:03:53', '2025-07-14 01:03:53'),
(16, 57, 12, NULL, 11, 35.000, 'KG', 13, '2025-07-14 01:58:43', '2025-07-14 05:40:47'),
(17, 57, 13, NULL, 11, 1.000, 'KG', 13, '2025-07-14 02:01:05', '2025-07-14 02:01:05'),
(18, 57, 14, NULL, 11, 1.000, 'KG', 13, '2025-07-14 02:01:05', '2025-07-14 02:01:05'),
(19, 57, 15, NULL, 10, 50.000, 'KG', 12, '2025-07-19 01:17:22', '2025-07-19 01:17:22');

-- --------------------------------------------------------

--
-- Table structure for table `party_stock_moves`
--

CREATE TABLE `party_stock_moves` (
  `id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `party_ledger_id` bigint UNSIGNED NOT NULL,
  `party_item_id` bigint UNSIGNED NOT NULL,
  `unit_id` bigint UNSIGNED DEFAULT NULL,
  `unit_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `godown_id_from` bigint UNSIGNED DEFAULT NULL,
  `godown_id_to` bigint UNSIGNED DEFAULT NULL,
  `qty` decimal(12,3) NOT NULL,
  `rate` decimal(12,2) DEFAULT NULL,
  `total` decimal(14,2) DEFAULT NULL,
  `move_type` enum('deposit','withdraw','transfer','convert-in','convert-out') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ref_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `party_stock_moves`
--

INSERT INTO `party_stock_moves` (`id`, `date`, `party_ledger_id`, `party_item_id`, `unit_id`, `unit_name`, `godown_id_from`, `godown_id_to`, `qty`, `rate`, `total`, `move_type`, `ref_no`, `remarks`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '2025-05-06', 41, 23, NULL, NULL, NULL, 10, 5.000, NULL, NULL, 'deposit', 'PSD-20250506-1902', NULL, 12, '2025-05-05 23:17:52', '2025-05-05 23:17:52'),
(2, '2025-05-06', 46, 23, NULL, 'Bag', NULL, 11, 50.000, NULL, NULL, 'deposit', 'PSD-20250506-2351', NULL, 12, '2025-05-05 23:29:06', '2025-05-05 23:29:06'),
(3, '2025-05-06', 41, 24, NULL, 'KG', NULL, 11, 5.000, NULL, NULL, 'deposit', 'PSD-20250506-9639', NULL, 12, '2025-05-06 00:08:27', '2025-05-06 00:08:27'),
(4, '2025-05-06', 46, 25, NULL, 'Bag', NULL, 10, 60.000, NULL, 0.00, 'deposit', 'PSD-20250506-2367', NULL, 12, '2025-05-06 00:11:34', '2025-05-06 00:11:34'),
(5, '2025-05-06', 46, 27, NULL, 'KG', NULL, 10, 70.000, NULL, 0.00, 'deposit', 'PSD-20250506-2367', NULL, 12, '2025-05-06 00:11:34', '2025-05-06 00:11:34'),
(6, '2025-05-06', 41, 27, NULL, 'KG', NULL, 11, 25.000, 50.00, 1250.00, 'deposit', 'PSD-20250506-8513', NULL, 12, '2025-05-06 00:57:51', '2025-05-06 00:57:51'),
(7, '2025-07-07', 56, 29, NULL, 'Bag', NULL, 10, 50.000, 55.00, 2750.00, 'deposit', 'PSD-20250707-8240', 'মন্তব্য nei', 12, '2025-07-07 06:20:59', '2025-07-07 06:20:59'),
(10, '2025-07-08', 56, 4, NULL, 'Bag', NULL, 10, 100.000, 700.00, 70000.00, 'deposit', 'PSD-20250708-2146', 'party stock received', 12, '2025-07-08 01:11:06', '2025-07-08 01:11:06'),
(11, '2025-07-08', 56, 4, NULL, 'Bag', NULL, 10, 5.000, 700.00, 3500.00, 'deposit', 'PSD-20250708-9491', NULL, 12, '2025-07-08 01:16:06', '2025-07-08 01:16:06'),
(12, '2025-07-08', 56, 5, NULL, 'KG', NULL, 10, 4.000, 95.00, 380.00, 'deposit', 'PSD-20250708-9491', NULL, 12, '2025-07-08 01:16:07', '2025-07-08 01:16:07'),
(13, '2025-07-09', 56, 4, NULL, 'Bag', 10, NULL, -1.000, 700.00, -700.00, 'withdraw', NULL, NULL, 12, '2025-07-09 00:05:28', '2025-07-09 00:05:28'),
(14, '2025-07-09', 56, 4, NULL, 'Bag', 10, NULL, -1.000, 700.00, -700.00, 'withdraw', NULL, NULL, 12, '2025-07-09 00:09:31', '2025-07-09 00:09:31'),
(15, '2025-07-09', 56, 4, NULL, 'Bag', 10, NULL, -1.000, 700.00, -700.00, 'withdraw', NULL, NULL, 12, '2025-07-09 00:09:40', '2025-07-09 00:09:40'),
(16, '2025-07-09', 56, 4, NULL, 'Bag', 10, NULL, -1.000, 700.00, -700.00, 'withdraw', NULL, NULL, 12, '2025-07-09 00:17:59', '2025-07-09 00:17:59'),
(17, '2025-07-09', 56, 4, NULL, 'Bag', 10, NULL, -1.000, 700.00, -700.00, 'withdraw', 'PWD-20250709-8446', NULL, 12, '2025-07-09 00:39:14', '2025-07-09 00:39:14'),
(18, '2025-07-12', 56, 4, NULL, 'Bag', 10, NULL, -50.000, NULL, 0.00, 'convert-out', 'CONV-20250712-5551', NULL, 13, '2025-07-12 01:08:01', '2025-07-12 01:08:01'),
(19, '2025-07-12', 56, 6, NULL, 'Bag', NULL, 10, 26.000, NULL, 0.00, 'convert-in', 'CONV-20250712-5551', NULL, 13, '2025-07-12 01:08:01', '2025-07-12 01:08:01'),
(20, '2025-07-12', 56, 7, NULL, 'Bag', NULL, 10, 22.000, NULL, 0.00, 'convert-in', 'CONV-20250712-5551', NULL, 13, '2025-07-12 01:08:01', '2025-07-12 01:08:01'),
(21, '2025-07-12', 56, 5, NULL, 'KG', 10, NULL, -4.000, NULL, 0.00, 'convert-out', 'CONV-20250712-6212', NULL, 13, '2025-07-12 03:16:33', '2025-07-12 03:16:33'),
(22, '2025-07-12', 56, 4, NULL, 'Bag', 10, NULL, -2.000, NULL, 0.00, 'convert-out', 'CONV-20250712-6212', NULL, 13, '2025-07-12 03:16:33', '2025-07-12 03:16:33'),
(23, '2025-07-12', 56, 8, NULL, 'KG', NULL, 10, 1.000, NULL, 0.00, 'convert-in', 'CONV-20250712-6212', NULL, 13, '2025-07-12 03:16:33', '2025-07-12 03:16:33'),
(24, '2025-07-12', 56, 9, NULL, 'Bag', NULL, 10, 2.000, NULL, 0.00, 'convert-in', 'CONV-20250712-6212', NULL, 13, '2025-07-12 03:16:33', '2025-07-12 03:16:33'),
(25, '2025-07-13', 56, 10, NULL, 'KG', NULL, 10, 5000.000, 16.00, 80000.00, 'deposit', 'PSD-20250713-8198', 'montobbo', 13, '2025-07-13 02:00:05', '2025-07-13 02:00:05'),
(26, '2025-07-13', 56, 5, NULL, 'KG', NULL, 10, 50.000, 12.00, 600.00, 'deposit', 'PSD-20250713-2343', NULL, 13, '2025-07-13 03:25:16', '2025-07-13 03:25:16'),
(27, '2025-07-14', 56, 11, NULL, 'KG', NULL, 11, 500.000, 70.00, 35000.00, 'deposit', 'PSD-20250714-8116', NULL, 13, '2025-07-14 01:03:53', '2025-07-14 01:03:53'),
(28, '2025-07-14', 57, 12, NULL, 'KG', NULL, 11, 33.000, 20.00, 660.00, 'deposit', 'PSD-20250714-2660', 'testing purpose', 13, '2025-07-14 01:58:43', '2025-07-14 01:58:43'),
(29, '2025-07-14', 57, 12, NULL, 'KG', 11, NULL, -1.000, 20.00, -20.00, 'withdraw', 'PWD-20250714-1776', NULL, 13, '2025-07-14 01:59:35', '2025-07-14 01:59:35'),
(30, '2025-07-14', 57, 12, NULL, 'KG', 11, NULL, -2.000, NULL, 0.00, 'convert-out', 'CONV-20250714-4671', NULL, 13, '2025-07-14 02:01:05', '2025-07-14 02:01:05'),
(31, '2025-07-14', 57, 13, NULL, 'KG', NULL, 11, 1.000, NULL, 0.00, 'convert-in', 'CONV-20250714-4671', NULL, 13, '2025-07-14 02:01:05', '2025-07-14 02:01:05'),
(32, '2025-07-14', 57, 14, NULL, 'KG', NULL, 11, 1.000, NULL, 0.00, 'convert-in', 'CONV-20250714-4671', NULL, 13, '2025-07-14 02:01:05', '2025-07-14 02:01:05'),
(33, '2025-07-14', 57, 12, NULL, 'KG', NULL, 11, 5.000, 20.00, 100.00, 'deposit', 'PSD-20250714-5653', NULL, 13, '2025-07-14 05:40:47', '2025-07-14 05:40:47'),
(34, '2025-07-19', 57, 15, NULL, 'KG', NULL, 10, 50.000, 90.00, 4500.00, 'deposit', 'PSD-20250719-8424', 'montobbo', 12, '2025-07-19 01:17:22', '2025-07-19 01:17:22');

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
  `voucher_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_mode_id` bigint UNSIGNED NOT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `send_sms` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_adds`
--

INSERT INTO `payment_adds` (`id`, `date`, `voucher_no`, `payment_mode_id`, `account_ledger_id`, `amount`, `description`, `send_sms`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '2025-04-03', 'PMT-20250403-971', 1, 1, 20.00, 'okay', 0, 1, '2025-04-03 12:38:12', '2025-04-03 12:38:12'),
(2, '2025-04-06', 'PMT-20250406-4536', 1, 1, 100.00, NULL, 0, 1, '2025-04-06 00:13:42', '2025-04-06 00:13:42'),
(4, '2025-04-06', 'PMT-20250406-4049', 1, 1, 100.00, NULL, 0, 1, '2025-04-06 00:19:26', '2025-04-06 00:19:26'),
(5, '2025-04-06', 'PMT-20250406-4049', 1, 2, 200.00, NULL, 0, 1, '2025-04-06 00:19:26', '2025-04-06 00:19:26'),
(6, '2025-04-06', 'PMT-20250406-9622', 1, 1, 10.00, NULL, 0, 1, '2025-04-06 00:20:12', '2025-04-06 00:20:12'),
(7, '2025-04-06', 'PMT-20250406-9622', 1, 2, 20.00, NULL, 0, 1, '2025-04-06 00:20:12', '2025-04-06 00:20:12'),
(9, '2025-04-06', 'PMT-20250406-3957', 3, 9, 40.00, NULL, 0, 1, '2025-04-06 01:20:07', '2025-04-06 01:20:07'),
(10, '2025-04-06', 'PMT-20250406-189', 1, 9, 29.00, NULL, 0, 1, '2025-04-06 01:20:33', '2025-04-06 01:20:33'),
(11, '2025-04-06', 'PMT-20250406-189', 3, 7, 39.00, NULL, 0, 1, '2025-04-06 01:20:33', '2025-04-06 01:20:33'),
(12, '2025-04-06', 'PMT-20250406-4311', 1, 3, 99.00, NULL, 0, 1, '2025-04-06 01:38:25', '2025-04-06 01:38:25'),
(13, '2025-04-06', 'PMT-20250406-4436', 3, 4, 33.00, 'Eita Description', 0, 1, '2025-04-06 01:46:51', '2025-04-06 01:46:51'),
(14, '2025-04-06', 'PMT-20250406-9590', 1, 5, 22.00, NULL, 0, 2, '2025-04-06 03:29:45', '2025-04-06 03:29:45'),
(15, '2025-04-13', 'PMT-20250413-1730', 8, 16, 10.00, NULL, 0, 10, '2025-04-13 03:09:26', '2025-04-13 03:09:26'),
(16, '2025-04-13', 'PMT-20250413-323', 8, 16, 10.00, NULL, 0, 10, '2025-04-13 03:25:53', '2025-04-13 03:25:53'),
(18, '2025-04-23', 'PMT-20250423-8305', 16, 28, 100.00, NULL, 0, 12, '2025-04-23 00:17:21', '2025-04-23 00:17:21'),
(19, '2025-04-23', 'PMT-20250423-6006', 16, 28, 21.00, NULL, 0, 1, '2025-04-23 06:16:13', '2025-04-23 06:16:13'),
(20, '2025-04-30', 'PMT-20250430-6133', 1, 2, 199.00, NULL, 0, 1, '2025-04-30 03:11:57', '2025-04-30 03:11:57'),
(21, '2025-06-14', 'PMT-20250614-1696', 16, 38, 100.00, 'Payment Made to The Supplier', 0, 12, '2025-06-14 06:06:03', '2025-06-14 06:06:03'),
(22, '2025-06-14', 'PMT-20250614-4187', 17, 37, 200.00, NULL, 0, 12, '2025-06-14 06:15:47', '2025-06-14 06:15:47');

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
(8, 'dummy', 'web', '2025-03-17 21:27:58', '2025-03-17 21:27:58', NULL),
(9, 'users.view', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(10, 'users.create', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(11, 'users.edit', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(12, 'users.delete', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(13, 'users.restore', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(14, 'users.force-delete', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(15, 'roles.view', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(16, 'roles.create', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(17, 'roles.edit', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(18, 'roles.delete', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(19, 'permissions.view', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(20, 'permissions.create', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(21, 'permissions.edit', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(22, 'permissions.delete', 'web', '2025-07-21 00:51:34', '2025-07-21 00:51:34', NULL),
(23, 'users.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(24, 'users.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(25, 'roles.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(26, 'roles.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(27, 'roles.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(28, 'roles.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(29, 'permissions.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(30, 'permissions.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(31, 'permissions.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(32, 'permissions.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(33, 'Dashboard.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(34, 'Dashboard.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(35, 'Dashboard.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(36, 'Dashboard.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(37, 'Dashboard.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(38, 'Dashboard.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(39, 'Dashboard.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(40, 'Dashboard.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(41, 'salary-owed.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(42, 'salary-owed.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(43, 'salary-owed.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(44, 'salary-owed.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(45, 'salary-owed.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(46, 'salary-owed.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(47, 'salary-owed.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(48, 'salary-owed.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(49, 'salary-slips.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(50, 'salary-slips.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(51, 'salary-slips.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(52, 'salary-slips.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(53, 'salary-slips.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(54, 'salary-slips.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(55, 'salary-slips.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(56, 'salary-slips.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(57, 'sales.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(58, 'sales.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(59, 'sales.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(60, 'sales.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(61, 'sales.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(62, 'sales.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(63, 'sales.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(64, 'sales.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(65, 'purchases.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(66, 'purchases.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(67, 'purchases.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(68, 'purchases.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(69, 'purchases.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(70, 'purchases.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(71, 'purchases.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(72, 'purchases.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(73, 'purchases-return.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(74, 'purchases-return.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(75, 'purchases-return.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(76, 'purchases-return.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(77, 'purchases-return.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(78, 'purchases-return.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(79, 'purchases-return.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(80, 'purchases-return.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(81, 'sales-return.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(82, 'sales-return.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(83, 'sales-return.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(84, 'sales-return.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(85, 'sales-return.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(86, 'sales-return.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(87, 'sales-return.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(88, 'sales-return.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(89, 'dues.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(90, 'dues.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(91, 'dues.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(92, 'dues.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(93, 'dues.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(94, 'dues.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(95, 'dues.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(96, 'dues.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(97, 'unit.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(98, 'unit.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(99, 'unit.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(100, 'unit.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(101, 'unit.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(102, 'unit.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(103, 'unit.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(104, 'unit.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(105, 'items.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(106, 'items.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(107, 'items.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(108, 'items.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(109, 'items.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(110, 'items.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(111, 'items.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(112, 'items.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(113, 'categories.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(114, 'categories.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(115, 'categories.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(116, 'categories.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(117, 'categories.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(118, 'categories.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(119, 'categories.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(120, 'categories.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(121, 'received-modes.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(122, 'received-modes.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(123, 'received-modes.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(124, 'received-modes.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(125, 'received-modes.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(126, 'received-modes.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(127, 'received-modes.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(128, 'received-modes.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(129, 'received-add.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(130, 'received-add.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(131, 'received-add.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(132, 'received-add.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(133, 'received-add.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(134, 'received-add.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(135, 'received-add.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(136, 'received-add.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(137, 'payment-add.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(138, 'payment-add.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(139, 'payment-add.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(140, 'payment-add.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(141, 'payment-add.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(142, 'payment-add.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(143, 'payment-add.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(144, 'payment-add.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(145, 'contra-add.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(146, 'contra-add.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(147, 'contra-add.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(148, 'contra-add.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(149, 'contra-add.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(150, 'contra-add.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(151, 'contra-add.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(152, 'contra-add.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(153, 'journal-add.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(154, 'journal-add.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(155, 'journal-add.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(156, 'journal-add.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(157, 'journal-add.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(158, 'journal-add.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(159, 'journal-add.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(160, 'journal-add.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(161, 'stock-transfer.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(162, 'stock-transfer.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(163, 'stock-transfer.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(164, 'stock-transfer.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(165, 'stock-transfer.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(166, 'stock-transfer.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(167, 'stock-transfer.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(168, 'stock-transfer.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(169, 'dues-settled.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(170, 'dues-settled.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(171, 'dues-settled.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(172, 'dues-settled.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(173, 'dues-settled.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(174, 'dues-settled.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(175, 'dues-settled.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(176, 'dues-settled.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(177, 'account-ledger.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(178, 'account-ledger.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(179, 'account-ledger.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(180, 'account-ledger.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(181, 'account-ledger.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(182, 'account-ledger.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(183, 'account-ledger.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(184, 'account-ledger.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(185, 'salesman.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(186, 'salesman.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(187, 'salesman.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(188, 'salesman.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(189, 'salesman.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(190, 'salesman.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(191, 'salesman.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(192, 'salesman.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(193, 'godowns.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(194, 'godowns.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(195, 'godowns.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(196, 'godowns.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(197, 'godowns.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(198, 'godowns.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(199, 'godowns.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(200, 'godowns.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(201, 'working-orders.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(202, 'working-orders.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(203, 'working-orders.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(204, 'working-orders.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(205, 'working-orders.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(206, 'working-orders.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(207, 'working-orders.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(208, 'working-orders.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(209, 'finished-products.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(210, 'finished-products.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(211, 'finished-products.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(212, 'finished-products.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(213, 'finished-products.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(214, 'finished-products.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(215, 'finished-products.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(216, 'finished-products.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(217, 'departments.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(218, 'departments.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(219, 'departments.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(220, 'departments.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(221, 'departments.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(222, 'departments.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(223, 'departments.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(224, 'departments.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(225, 'designations.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(226, 'designations.create', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(227, 'designations.edit', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(228, 'designations.delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(229, 'designations.restore', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(230, 'designations.force-delete', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(231, 'designations.export', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(232, 'designations.pdf', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(233, 'shifts.view', 'web', '2025-07-21 04:45:38', '2025-07-21 04:45:38', NULL),
(234, 'shifts.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(235, 'shifts.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(236, 'shifts.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(237, 'shifts.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(238, 'shifts.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(239, 'shifts.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(240, 'shifts.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(241, 'salary-payments.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(242, 'salary-payments.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(243, 'salary-payments.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(244, 'salary-payments.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(245, 'salary-payments.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(246, 'salary-payments.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(247, 'salary-payments.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(248, 'salary-payments.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(249, 'employee-ledger.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(250, 'employee-ledger.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(251, 'employee-ledger.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(252, 'employee-ledger.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(253, 'employee-ledger.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(254, 'employee-ledger.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(255, 'employee-ledger.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(256, 'employee-ledger.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(257, 'employee-reports.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(258, 'employee-reports.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(259, 'employee-reports.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(260, 'employee-reports.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(261, 'employee-reports.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(262, 'employee-reports.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(263, 'employee-reports.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(264, 'employee-reports.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(265, 'stock-reports.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(266, 'stock-reports.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(267, 'stock-reports.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(268, 'stock-reports.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(269, 'stock-reports.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(270, 'stock-reports.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(271, 'stock-reports.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(272, 'stock-reports.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(273, 'reports.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(274, 'reports.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(275, 'reports.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(276, 'reports.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(277, 'reports.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(278, 'reports.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(279, 'reports.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(280, 'reports.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(281, 'daybook.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(282, 'daybook.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(283, 'daybook.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(284, 'daybook.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(285, 'daybook.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(286, 'daybook.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(287, 'daybook.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(288, 'daybook.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(289, 'profit-loss.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(290, 'profit-loss.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(291, 'profit-loss.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(292, 'profit-loss.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(293, 'profit-loss.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(294, 'profit-loss.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(295, 'profit-loss.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(296, 'profit-loss.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(297, 'balance-sheet.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(298, 'balance-sheet.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(299, 'balance-sheet.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(300, 'balance-sheet.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(301, 'balance-sheet.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(302, 'balance-sheet.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(303, 'balance-sheet.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(304, 'balance-sheet.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(313, 'ledger-group-summary.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(314, 'ledger-group-summary.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(315, 'ledger-group-summary.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(316, 'ledger-group-summary.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(317, 'ledger-group-summary.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(318, 'ledger-group-summary.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(319, 'ledger-group-summary.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(320, 'ledger-group-summary.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(321, 'sale-report.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(322, 'sale-report.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(323, 'sale-report.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(324, 'sale-report.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(325, 'sale-report.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(326, 'sale-report.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(327, 'sale-report.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(328, 'sale-report.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(329, 'purchase-report.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(330, 'purchase-report.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(331, 'purchase-report.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(332, 'purchase-report.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(333, 'purchase-report.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(334, 'purchase-report.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(335, 'purchase-report.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(336, 'purchase-report.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(337, 'receivable-payable-report.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(338, 'receivable-payable-report.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(339, 'receivable-payable-report.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(340, 'receivable-payable-report.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(341, 'receivable-payable-report.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(342, 'receivable-payable-report.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(343, 'receivable-payable-report.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(344, 'receivable-payable-report.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(345, 'receive-payment-report.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(346, 'receive-payment-report.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(347, 'receive-payment-report.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(348, 'receive-payment-report.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(349, 'receive-payment-report.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(350, 'receive-payment-report.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(351, 'receive-payment-report.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(352, 'receive-payment-report.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(353, 'crushing-party-report.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(354, 'crushing-party-report.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(355, 'crushing-party-report.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(356, 'crushing-party-report.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(357, 'crushing-party-report.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(358, 'crushing-party-report.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(359, 'crushing-party-report.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(360, 'crushing-party-report.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(361, 'crushing-party-stock.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(362, 'crushing-party-stock.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(363, 'crushing-party-stock.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(364, 'crushing-party-stock.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(365, 'crushing-party-stock.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(366, 'crushing-party-stock.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(367, 'crushing-party-stock.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(368, 'crushing-party-stock.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(369, 'crushing-party-withdraw.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(370, 'crushing-party-withdraw.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(371, 'crushing-party-withdraw.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(372, 'crushing-party-withdraw.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(373, 'crushing-party-withdraw.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(374, 'crushing-party-withdraw.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(375, 'crushing-party-withdraw.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(376, 'crushing-party-withdraw.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(377, 'crushing-party-convert.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(378, 'crushing-party-convert.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(379, 'crushing-party-convert.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(380, 'crushing-party-convert.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(381, 'crushing-party-convert.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(382, 'crushing-party-convert.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(383, 'crushing-party-convert.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(384, 'crushing-party-convert.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(385, 'crushing-daybook.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(386, 'crushing-daybook.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(387, 'crushing-daybook.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(388, 'crushing-daybook.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(389, 'crushing-daybook.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(390, 'crushing-daybook.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(391, 'crushing-daybook.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(392, 'crushing-daybook.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(393, 'crushing-voucher.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(394, 'crushing-voucher.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(395, 'crushing-voucher.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(396, 'crushing-voucher.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(397, 'crushing-voucher.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(398, 'crushing-voucher.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(399, 'crushing-voucher.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(400, 'crushing-voucher.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(401, 'employees.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(402, 'employees.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(403, 'employees.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(404, 'employees.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(405, 'employees.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(406, 'employees.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(407, 'employees.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(408, 'employees.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(409, 'company-settings.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(410, 'company-settings.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(411, 'company-settings.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(412, 'company-settings.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(413, 'company-settings.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(414, 'company-settings.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(415, 'company-settings.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(416, 'company-settings.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(417, 'financial-year.view', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(418, 'financial-year.create', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(419, 'financial-year.edit', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(420, 'financial-year.delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(421, 'financial-year.restore', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(422, 'financial-year.force-delete', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(423, 'financial-year.export', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(424, 'financial-year.pdf', 'web', '2025-07-21 04:45:39', '2025-07-21 04:45:39', NULL),
(425, 'daybook-report.view', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(426, 'daybook-report.create', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(427, 'daybook-report.edit', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(428, 'daybook-report.delete', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(429, 'daybook-report.restore', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(430, 'daybook-report.force-delete', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(431, 'daybook-report.export', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(432, 'daybook-report.pdf', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(433, 'profit-loss-report.view', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(434, 'profit-loss-report.create', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(435, 'profit-loss-report.edit', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(436, 'profit-loss-report.delete', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(437, 'profit-loss-report.restore', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(438, 'profit-loss-report.force-delete', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(439, 'profit-loss-report.export', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(440, 'profit-loss-report.pdf', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(441, 'balance-sheet-report.view', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(442, 'balance-sheet-report.create', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(443, 'balance-sheet-report.edit', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(444, 'balance-sheet-report.delete', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(445, 'balance-sheet-report.restore', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(446, 'balance-sheet-report.force-delete', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(447, 'balance-sheet-report.export', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(448, 'balance-sheet-report.pdf', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(449, 'account-book-report.view', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(455, 'account-book-report.export', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(456, 'account-book-report.pdf', 'web', '2025-07-21 05:29:29', '2025-07-21 05:29:29', NULL),
(457, 'sales.approve-sub', 'web', '2025-07-22 01:28:09', '2025-07-22 01:28:09', NULL),
(458, 'sales.approve', 'web', '2025-07-22 01:28:09', '2025-07-22 01:28:09', NULL);

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
  `inventory_ledger_id` bigint UNSIGNED DEFAULT NULL,
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
  `updated_at` timestamp NULL DEFAULT NULL,
  `journal_id` bigint UNSIGNED DEFAULT NULL,
  `received_mode_id` bigint UNSIGNED DEFAULT NULL,
  `amount_paid` decimal(15,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `date`, `voucher_no`, `godown_id`, `salesman_id`, `account_ledger_id`, `inventory_ledger_id`, `phone`, `address`, `total_qty`, `total_price`, `total_discount`, `grand_total`, `shipping_details`, `delivered_to`, `created_by`, `deleted_at`, `created_at`, `updated_at`, `journal_id`, `received_mode_id`, `amount_paid`) VALUES
(1, '2025-03-22', '1', 1, 2, 2, NULL, '0111111111', 'asdf', 1.00, 50.00, 0.00, 50.00, NULL, NULL, 1, '2025-03-21 23:34:15', '2025-03-21 22:49:20', '2025-03-21 23:34:15', NULL, NULL, 0.00),
(2, '2025-03-22', '3', 1, 2, 1, NULL, '01309655677', 'afsdaf', 3.00, 19.00, 2.00, 19.00, NULL, NULL, 1, '2025-03-22 03:34:56', '2025-03-21 23:23:58', '2025-03-22 03:34:56', NULL, NULL, 0.00),
(3, '2025-03-22', '111', 1, 2, 4, NULL, '01309655677', 'afsdaf', 2.00, 18.00, 2.00, 18.00, NULL, NULL, 1, '2025-03-22 03:34:59', '2025-03-21 23:34:09', '2025-03-22 03:34:59', NULL, NULL, 0.00),
(4, '2025-03-22', '9', 2, 1, 6, NULL, '015265489', 'dhaka', 100.00, 540.00, 10.00, 540.00, NULL, NULL, 1, '2025-03-22 03:35:03', '2025-03-21 23:42:18', '2025-03-22 03:35:03', NULL, NULL, 0.00),
(5, '2025-03-22', '7', 1, 1, 6, NULL, '015265489', 'dhaka', 4.00, 700.00, 0.00, 700.00, NULL, NULL, 1, NULL, '2025-03-21 23:58:41', '2025-03-21 23:58:41', NULL, NULL, 0.00),
(6, '2025-03-22', '101', 2, 1, 6, NULL, '01924488203', 'asdf', 6.00, 85.00, 5.00, 85.00, NULL, NULL, 1, NULL, '2025-03-22 00:43:53', '2025-03-22 00:43:53', NULL, NULL, 0.00),
(7, '2025-03-22', '66', 3, 1, 6, NULL, '01924488203', 'asdf', 6.00, 52.00, 10.00, 52.00, NULL, NULL, 1, '2025-03-22 03:34:52', '2025-03-22 00:56:07', '2025-03-22 03:34:52', NULL, NULL, 0.00),
(8, '2025-03-20', '32', 1, 2, 2, NULL, '015265489', 'dhaka', 22.00, 483.00, 1.00, 483.00, 'azimpur', 'dhaka', 1, '2025-03-22 03:34:49', '2025-03-22 01:03:31', '2025-03-22 03:34:49', NULL, NULL, 0.00),
(9, '2025-03-22', 'PUR-20250322-0009', 2, 2, 6, NULL, NULL, NULL, 100.00, 1000.00, 0.00, 1000.00, NULL, NULL, 1, NULL, '2025-03-22 01:16:57', '2025-03-22 03:15:30', NULL, NULL, 0.00),
(10, '2025-03-22', 'PUR-20250322-0010', 2, 1, 6, NULL, '01521584092', 'Dhaka', 109.00, 4332.75, 0.00, 4332.75, 'Azimpur', 'Tanjilur Rahman', 1, NULL, '2025-03-22 03:18:01', '2025-03-22 03:18:01', NULL, NULL, 0.00),
(11, '2025-03-22', 'PUR-20250322-0011', 1, 1, 7, NULL, '01521584092', 'Dhaka', 2.00, 20.00, 0.00, 20.00, 'Azimpur', 'Tanjilur Rahman', 1, NULL, '2025-03-22 03:42:50', '2025-03-22 03:42:50', NULL, NULL, 0.00),
(12, '2025-03-24', 'PUR-20250324-5130', 3, 3, 5, NULL, '01924488203', 'asdf', 2.00, 40.00, 0.00, 40.00, 'nai', 'nai', 2, NULL, '2025-03-24 02:57:34', '2025-03-24 02:57:34', NULL, NULL, 0.00),
(13, '2025-04-15', 'PUR-20250415-6157', 6, 4, 17, NULL, NULL, NULL, 1.00, 10.00, 0.00, 10.00, NULL, NULL, 10, NULL, '2025-04-15 04:07:33', '2025-04-15 04:07:33', NULL, NULL, 0.00),
(14, '2025-04-15', 'PUR-20250415-5195', 6, 4, 17, NULL, '01898440581', 'ashulia birulia', 20.00, 200.00, 0.00, 200.00, NULL, NULL, 10, NULL, '2025-04-15 05:28:05', '2025-04-15 05:28:05', NULL, 8, 200.00),
(15, '2025-04-15', 'PUR-20250415-6798', 6, 4, 17, NULL, NULL, NULL, 5.00, 50.00, 0.00, 50.00, NULL, NULL, 10, NULL, '2025-04-15 07:23:33', '2025-04-15 07:23:33', NULL, NULL, 0.00),
(16, '2025-04-15', 'PUR-20250415-8941', 6, 4, 17, NULL, NULL, NULL, 5.00, 50.00, 0.00, 50.00, NULL, NULL, 10, NULL, '2025-04-15 07:47:24', '2025-04-16 00:08:21', 28, 8, 50.00),
(17, '2025-04-16', 'PUR-20250416-4839', 6, 4, 17, NULL, NULL, NULL, 20.00, 200.00, 0.00, 200.00, NULL, NULL, 10, NULL, '2025-04-16 06:10:37', '2025-04-16 06:10:37', NULL, 13, 200.00),
(18, '2025-04-17', 'PUR-20250417-3221', 11, 6, 28, NULL, NULL, NULL, 2.00, 100.00, 0.00, 100.00, NULL, NULL, 12, NULL, '2025-04-17 00:02:30', '2025-04-17 00:02:30', NULL, 16, 100.00),
(19, '2025-04-20', 'PUR-20250420-5883', 10, 6, 28, NULL, NULL, NULL, 10.00, 190.00, 0.00, 190.00, NULL, NULL, 12, NULL, '2025-04-20 00:00:02', '2025-04-20 00:00:02', NULL, 16, 190.00),
(20, '2025-04-21', 'PUR-20250421-1826', 10, 6, 28, NULL, NULL, NULL, 20.00, 200.00, 0.00, 200.00, NULL, NULL, 12, NULL, '2025-04-21 02:56:20', '2025-04-21 04:33:02', 58, 16, 200.00),
(21, '2025-04-22', 'PUR-20250422-5444', 12, 2, 35, NULL, NULL, NULL, 5.00, 495.00, 0.00, 495.00, NULL, NULL, 1, NULL, '2025-04-22 00:10:34', '2025-04-22 00:10:34', NULL, 1, 494.00),
(22, '2025-04-22', 'PUR-20250422-6689', 10, 6, 28, NULL, NULL, NULL, 5.00, 50.00, 0.00, 50.00, NULL, NULL, 12, NULL, '2025-04-22 05:21:17', '2025-04-22 05:21:17', NULL, 16, 50.00),
(23, '2025-04-26', 'PUR-20250426-2809', 10, 6, 37, NULL, NULL, NULL, 2.00, 40.00, 0.00, 40.00, NULL, NULL, 12, NULL, '2025-04-26 00:32:35', '2025-04-26 00:32:35', NULL, 16, 38.00),
(24, '2025-04-27', 'PUR-20250427-1338', 10, 6, 37, NULL, NULL, NULL, 32.00, 320.00, 0.00, 320.00, NULL, NULL, 12, NULL, '2025-04-27 04:34:51', '2025-04-27 04:34:51', NULL, 16, 320.00),
(25, '2025-06-14', 'PUR-20250614-2598', 10, 6, 38, NULL, '01521584092', 'APONN GROUP, Chandra Mollika,', 7.00, 600.00, 0.00, 600.00, 'Azimpur', 'Mr. Tawhid', 12, NULL, '2025-06-14 01:08:25', '2025-06-14 01:08:25', NULL, 16, 600.00),
(26, '2025-06-14', 'PUR-20250614-1308', 10, 6, 37, NULL, '01309655677', 'Pallbi Metro, Mirpur 12, Dhaka - 1212', 1.00, 9.00, 1.00, 9.00, 'asdf', 'asdf', 12, NULL, '2025-06-14 01:24:09', '2025-06-14 01:24:09', NULL, 16, 9.00),
(27, '2025-06-14', 'PUR-20250614-3318', 10, 6, 38, 31, '01309655677', 'Pallbi Metro, Mirpur 12, Dhaka - 1212', 1.00, 99.00, 1.00, 99.00, 'asdf', 'asdf', 12, NULL, '2025-06-14 01:57:23', '2025-06-14 03:13:44', 80, 16, 99.00),
(28, '2025-06-15', 'PUR-20250615-2576', 10, 6, 38, 49, '01603047439', 'ashulia birulia', 2.00, 200.00, 0.00, 200.00, NULL, NULL, 12, NULL, '2025-06-15 06:45:23', '2025-06-15 06:45:23', NULL, 16, 150.00);

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
(26, 12, 5, 2.00, 20.00, 0.00, 'bdt', 40.00, NULL, '2025-03-24 02:57:34', '2025-03-24 02:57:34'),
(27, 13, 19, 1.00, 10.00, 0.00, 'bdt', 10.00, NULL, '2025-04-15 04:07:33', '2025-04-15 04:07:33'),
(28, 14, 19, 20.00, 10.00, 0.00, 'bdt', 200.00, NULL, '2025-04-15 05:28:05', '2025-04-15 05:28:05'),
(29, 15, 19, 5.00, 10.00, 0.00, 'bdt', 50.00, NULL, '2025-04-15 07:23:33', '2025-04-15 07:23:33'),
(31, 16, 19, 5.00, 10.00, 0.00, 'bdt', 50.00, NULL, '2025-04-16 00:08:21', '2025-04-16 00:08:21'),
(32, 17, 19, 20.00, 10.00, 0.00, 'bdt', 200.00, NULL, '2025-04-16 06:10:37', '2025-04-16 06:10:37'),
(33, 18, 21, 2.00, 50.00, 0.00, 'bdt', 100.00, NULL, '2025-04-17 00:02:30', '2025-04-17 00:02:30'),
(34, 19, 24, 10.00, 19.00, 0.00, 'bdt', 190.00, NULL, '2025-04-20 00:00:02', '2025-04-20 00:00:02'),
(37, 20, 25, 20.00, 10.00, 0.00, 'bdt', 200.00, NULL, '2025-04-21 04:33:02', '2025-04-21 04:33:02'),
(38, 21, 26, 5.00, 99.00, 0.00, 'bdt', 495.00, NULL, '2025-04-22 00:10:34', '2025-04-22 00:10:34'),
(39, 22, 24, 5.00, 10.00, 0.00, 'bdt', 50.00, NULL, '2025-04-22 05:21:17', '2025-04-22 05:21:17'),
(40, 23, 24, 2.00, 20.00, 0.00, 'bdt', 40.00, NULL, '2025-04-26 00:32:35', '2025-04-26 00:32:35'),
(41, 24, 24, 20.00, 10.00, 0.00, 'bdt', 200.00, NULL, '2025-04-27 04:34:51', '2025-04-27 04:34:51'),
(42, 24, 25, 12.00, 10.00, 0.00, 'bdt', 120.00, NULL, '2025-04-27 04:34:51', '2025-04-27 04:34:51'),
(43, 25, 24, 2.00, 50.00, 0.00, 'bdt', 100.00, NULL, '2025-06-14 01:08:25', '2025-06-14 01:08:25'),
(44, 25, 25, 5.00, 100.00, 0.00, 'bdt', 500.00, NULL, '2025-06-14 01:08:25', '2025-06-14 01:08:25'),
(45, 26, 24, 1.00, 10.00, 1.00, 'bdt', 9.00, NULL, '2025-06-14 01:24:09', '2025-06-14 01:24:09'),
(47, 27, 24, 1.00, 100.00, 1.00, 'bdt', 99.00, NULL, '2025-06-14 03:13:44', '2025-06-14 03:13:44'),
(48, 28, 24, 2.00, 100.00, 0.00, 'bdt', 200.00, NULL, '2025-06-15 06:45:23', '2025-06-15 06:45:23');

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
  `inventory_ledger_id` bigint UNSIGNED DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `journal_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_returns`
--

INSERT INTO `purchase_returns` (`id`, `date`, `return_voucher_no`, `godown_id`, `account_ledger_id`, `reason`, `total_qty`, `grand_total`, `inventory_ledger_id`, `created_by`, `deleted_at`, `created_at`, `updated_at`, `journal_id`) VALUES
(1, '2025-03-23', 'RET-20250323-2392', 1, 1, 'Unknown', 100.00, 450.00, NULL, 1, NULL, '2025-03-22 22:24:07', '2025-03-22 22:25:16', NULL),
(2, '2025-03-23', 'RET-20250323-3170', 1, 2, 'No reason', 10.00, 200.00, NULL, 1, NULL, '2025-03-22 22:34:25', '2025-03-22 22:34:25', NULL),
(3, '2025-03-23', 'RET-20250323-7192', 1, 2, 'blablabal', 1.00, 1.00, NULL, 1, '2025-03-22 22:44:30', '2025-03-22 22:43:02', '2025-03-22 22:44:30', NULL),
(4, '2025-03-23', 'RET-20250323-6433', 1, 3, '12', 1.00, 1.00, NULL, 1, NULL, '2025-03-22 22:44:48', '2025-03-22 22:44:48', NULL),
(5, '2025-03-23', 'RET-20250323-7276', 1, 1, NULL, 1.00, 1.00, NULL, 1, NULL, '2025-03-22 22:49:13', '2025-03-22 22:49:13', NULL),
(6, '2025-04-16', 'RET-20250416-9556', 6, 17, NULL, 5.00, 50.00, NULL, 10, NULL, '2025-04-16 01:51:07', '2025-04-16 01:51:07', NULL),
(7, '2025-04-16', 'RET-20250416-2425', 6, 17, NULL, 5.00, 50.00, NULL, 10, NULL, '2025-04-16 01:54:37', '2025-04-16 01:54:37', NULL),
(8, '2025-04-16', 'RET-20250416-4597', 6, 17, NULL, 1.00, 10.00, NULL, 10, NULL, '2025-04-16 03:54:41', '2025-04-16 03:54:41', NULL),
(9, '2025-04-16', 'RET-20250416-3352', 6, 17, NULL, 1.00, 1.00, NULL, 10, NULL, '2025-04-16 04:03:20', '2025-04-16 04:03:20', 32),
(10, '2025-04-16', 'RET-20250416-5213', 6, 17, NULL, 1.00, 99.00, NULL, 10, NULL, '2025-04-16 05:26:47', '2025-04-16 05:26:47', 33),
(11, '2025-04-17', 'RET-20250417-7239', 11, 28, NULL, 1.00, 50.00, NULL, 12, NULL, '2025-04-17 00:03:40', '2025-04-17 00:03:40', 36),
(12, '2025-04-23', 'RET-20250423-8269', 10, 28, NULL, 2.00, 10.00, NULL, 12, NULL, '2025-04-22 23:00:54', '2025-04-22 23:00:54', 63),
(13, '2025-06-21', 'RET-20250621-7204', 10, 28, 'emni', 1.00, 52.00, NULL, 12, NULL, '2025-06-21 01:26:57', '2025-06-21 01:55:35', 117),
(14, '2025-06-21', 'RET-20250621-6577', 10, 28, 'testing purpose', 3.00, 54.00, 29, 12, NULL, '2025-06-21 03:32:23', '2025-06-21 03:32:42', 118);

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
(6, 5, 6, 1.00, 1.00, 1.00, '2025-03-22 22:49:13', '2025-03-22 22:49:13'),
(7, 6, 19, 5.00, 10.00, 50.00, '2025-04-16 01:51:07', '2025-04-16 01:51:07'),
(8, 7, 19, 5.00, 10.00, 50.00, '2025-04-16 01:54:37', '2025-04-16 01:54:37'),
(9, 8, 19, 1.00, 10.00, 10.00, '2025-04-16 03:54:41', '2025-04-16 03:54:41'),
(10, 9, 19, 1.00, 1.00, 1.00, '2025-04-16 04:03:20', '2025-04-16 04:03:20'),
(11, 10, 19, 1.00, 99.00, 99.00, '2025-04-16 05:26:47', '2025-04-16 05:26:47'),
(12, 11, 23, 1.00, 50.00, 50.00, '2025-04-17 00:03:40', '2025-04-17 00:03:40'),
(13, 12, 23, 2.00, 5.00, 10.00, '2025-04-22 23:00:54', '2025-04-22 23:00:54'),
(20, 13, 21, 1.00, 52.00, 52.00, '2025-06-21 01:55:35', '2025-06-21 01:55:35'),
(22, 14, 24, 3.00, 18.00, 54.00, '2025-06-21 03:32:42', '2025-06-21 03:32:42');

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
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `received_adds`
--

INSERT INTO `received_adds` (`id`, `date`, `voucher_no`, `received_mode_id`, `account_ledger_id`, `amount`, `description`, `send_sms`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '2025-03-26', 'RV-907974', 1, 8, 21.00, NULL, 0, NULL, '2025-03-25 22:48:36', '2025-03-25 23:46:32'),
(2, '2025-03-26', 'RV-143630', 1, 1, 50.00, 'Bhalo', 0, NULL, '2025-03-25 23:02:20', '2025-03-25 23:02:20'),
(4, '2025-04-13', 'RV-728626', 8, 16, 10.00, NULL, 0, 10, '2025-04-13 03:13:32', '2025-04-13 03:13:32'),
(5, '2025-04-13', 'RV-434723', 8, 16, 10.00, 'dekhi', 0, 1, '2025-04-13 04:57:00', '2025-04-13 04:57:00'),
(6, '2025-04-23', 'RV-772547', 16, 28, 50.00, NULL, 0, 12, '2025-04-22 23:51:09', '2025-04-22 23:51:09'),
(7, '2025-06-14', 'RV-964141', 17, 30, 500.00, NULL, 0, 12, '2025-06-14 06:07:22', '2025-06-14 06:07:22'),
(8, '2025-06-14', 'RV-795495', 16, 41, 500.00, 'Received 500 from customer', 0, 12, '2025-06-14 06:40:07', '2025-06-14 06:40:07');

-- --------------------------------------------------------

--
-- Table structure for table `received_modes`
--

CREATE TABLE `received_modes` (
  `id` bigint UNSIGNED NOT NULL,
  `mode_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `ledger_id` bigint UNSIGNED DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `amount_received` decimal(15,2) DEFAULT NULL,
  `amount_paid` decimal(15,2) DEFAULT '0.00',
  `transaction_date` timestamp NULL DEFAULT NULL,
  `purchase_return_id` bigint UNSIGNED DEFAULT NULL,
  `sale_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `received_modes`
--

INSERT INTO `received_modes` (`id`, `mode_name`, `phone_number`, `created_at`, `updated_at`, `ledger_id`, `created_by`, `amount_received`, `amount_paid`, `transaction_date`, `purchase_return_id`, `sale_id`) VALUES
(1, 'Cash', NULL, '2025-03-25 21:33:46', '2025-04-09 23:16:54', 5, NULL, 0.00, 0.00, NULL, NULL, NULL),
(3, 'Bank', '01912199825', '2025-04-06 01:17:30', '2025-04-09 23:17:09', 5, NULL, 0.00, 0.00, NULL, NULL, NULL),
(4, 'bKash', '013131665432', '2025-04-09 07:37:01', '2025-04-09 07:37:01', 10, NULL, 0.00, 0.00, NULL, NULL, NULL),
(5, 'nagad', NULL, '2025-04-09 07:56:14', '2025-04-09 07:56:14', 11, NULL, 0.00, 0.00, NULL, NULL, NULL),
(6, 'Dhaka Bank', '0177777777', '2025-04-09 23:29:20', '2025-04-09 23:29:20', 5, 2, 0.00, 0.00, NULL, NULL, NULL),
(7, 'Arnob Bank', NULL, '2025-04-10 00:20:58', '2025-04-10 00:20:58', 11, 6, 0.00, 0.00, NULL, NULL, NULL),
(8, 'City Bank', NULL, '2025-04-13 03:08:04', '2025-04-15 04:53:00', 21, 10, 0.00, 0.00, NULL, NULL, NULL),
(9, 'Bkash', NULL, '2025-04-13 05:52:36', '2025-04-13 05:52:36', 18, 2, NULL, NULL, '2025-04-12 18:00:00', NULL, NULL),
(10, 'City Bank', '00001', '2025-04-16 04:03:20', '2025-04-16 04:03:20', 21, 10, NULL, 0.00, NULL, NULL, NULL),
(11, 'Dhaka Bank', NULL, '2025-04-16 05:26:02', '2025-04-16 05:26:02', 20, 10, NULL, 0.00, NULL, NULL, NULL),
(12, 'Dhaka Bank', NULL, '2025-04-16 05:26:47', '2025-04-16 05:26:47', 20, 10, NULL, 0.00, NULL, NULL, NULL),
(13, 'Bkash', NULL, '2025-04-16 06:09:32', '2025-04-16 06:09:32', 22, 10, NULL, 0.00, NULL, NULL, NULL),
(14, 'Unknown', NULL, '2025-04-16 06:10:37', '2025-04-16 06:10:37', 13, 10, NULL, 0.00, NULL, NULL, NULL),
(15, 'Bkash', NULL, '2025-04-16 06:23:08', '2025-04-16 06:23:08', 23, 11, NULL, 0.00, NULL, NULL, NULL),
(16, 'Nagad', NULL, '2025-04-17 00:00:00', '2025-07-16 04:57:27', 27, 12, 1.00, 0.00, '2025-07-15 18:00:00', NULL, 58),
(17, 'Rocket', NULL, '2025-04-23 00:05:39', '2025-06-21 01:13:32', 36, 12, 150.00, 0.00, '2025-06-20 18:00:00', NULL, 35),
(18, 'Cash', NULL, '2025-07-23 04:28:31', '2025-07-23 04:28:31', 61, 15, NULL, 0.00, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rent_vouchers`
--

CREATE TABLE `rent_vouchers` (
  `id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `vch_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `party_ledger_id` bigint UNSIGNED NOT NULL,
  `grand_total` decimal(16,2) NOT NULL DEFAULT '0.00',
  `previous_balance` decimal(16,2) NOT NULL DEFAULT '0.00',
  `received_mode_id` bigint UNSIGNED DEFAULT NULL,
  `received_amount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `balance` decimal(16,2) NOT NULL DEFAULT '0.00',
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rent_vouchers`
--

INSERT INTO `rent_vouchers` (`id`, `date`, `vch_no`, `party_ledger_id`, `grand_total`, `previous_balance`, `received_mode_id`, `received_amount`, `balance`, `remarks`, `created_by`, `created_at`, `updated_at`) VALUES
(3, '2025-07-13', 'RV-20250713-8869', 56, 2520.00, 0.00, 16, 2520.00, 0.00, NULL, 13, '2025-07-13 03:51:13', '2025-07-13 03:51:13'),
(4, '2025-07-12', 'RV-20250713-2989', 56, 200.00, 0.00, 16, 100.00, 100.00, '100 due', 13, '2025-07-13 07:13:53', '2025-07-13 07:13:53');

-- --------------------------------------------------------

--
-- Table structure for table `rent_voucher_lines`
--

CREATE TABLE `rent_voucher_lines` (
  `id` bigint UNSIGNED NOT NULL,
  `voucher_id` bigint UNSIGNED NOT NULL,
  `party_item_id` bigint UNSIGNED NOT NULL,
  `unit_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty` decimal(16,3) NOT NULL,
  `mon` decimal(16,3) DEFAULT NULL,
  `rate` decimal(16,2) NOT NULL,
  `amount` decimal(16,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rent_voucher_lines`
--

INSERT INTO `rent_voucher_lines` (`id`, `voucher_id`, `party_item_id`, `unit_name`, `qty`, `mon`, `rate`, `amount`, `created_at`, `updated_at`) VALUES
(1, 3, 4, 'Bag', 50.000, NULL, 50.00, 2500.00, '2025-07-13 03:51:13', '2025-07-13 03:51:13'),
(2, 3, 10, 'KG', 1.000, NULL, 20.00, 20.00, '2025-07-13 03:51:13', '2025-07-13 03:51:13'),
(3, 4, 5, 'KG', 2.000, NULL, 100.00, 200.00, '2025-07-13 07:13:53', '2025-07-13 07:13:53');

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
(3, 'Editor', 'web', '2025-03-16 23:57:49', '2025-03-16 23:57:49'),
(4, 'Demo Role', 'web', '2025-04-13 03:02:43', '2025-04-13 03:02:43'),
(5, 'test', 'web', '2025-07-21 03:46:53', '2025-07-21 03:46:53'),
(6, 'test contra item role', 'web', '2025-07-21 05:39:31', '2025-07-21 05:39:31'),
(8, 'abc', 'web', '2025-07-21 05:46:48', '2025-07-21 05:46:48'),
(9, 'name', 'web', '2025-07-21 06:03:00', '2025-07-21 06:03:00'),
(10, 'Sales-Executive', 'web', '2025-07-21 06:55:22', '2025-07-21 06:55:22'),
(11, 'view role', 'web', '2025-07-21 06:59:57', '2025-07-21 06:59:57'),
(12, 'Sub-Responsible', 'web', '2025-07-22 01:31:55', '2025-07-22 01:31:55'),
(13, 'Responsible', 'web', '2025-07-22 01:32:20', '2025-07-22 01:32:20'),
(14, 'Role-Permission-User', 'web', '2025-07-23 05:41:30', '2025-07-23 05:41:30');

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
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(32, 1),
(33, 1),
(34, 1),
(35, 1),
(36, 1),
(37, 1),
(38, 1),
(39, 1),
(40, 1),
(41, 1),
(42, 1),
(43, 1),
(44, 1),
(45, 1),
(46, 1),
(47, 1),
(48, 1),
(49, 1),
(50, 1),
(51, 1),
(52, 1),
(53, 1),
(54, 1),
(55, 1),
(56, 1),
(57, 1),
(58, 1),
(59, 1),
(60, 1),
(61, 1),
(62, 1),
(63, 1),
(64, 1),
(65, 1),
(66, 1),
(67, 1),
(68, 1),
(69, 1),
(70, 1),
(71, 1),
(72, 1),
(73, 1),
(74, 1),
(75, 1),
(76, 1),
(77, 1),
(78, 1),
(79, 1),
(80, 1),
(81, 1),
(82, 1),
(83, 1),
(84, 1),
(85, 1),
(86, 1),
(87, 1),
(88, 1),
(89, 1),
(90, 1),
(91, 1),
(92, 1),
(93, 1),
(94, 1),
(95, 1),
(96, 1),
(97, 1),
(98, 1),
(99, 1),
(100, 1),
(101, 1),
(102, 1),
(103, 1),
(104, 1),
(105, 1),
(106, 1),
(107, 1),
(108, 1),
(109, 1),
(110, 1),
(111, 1),
(112, 1),
(113, 1),
(114, 1),
(115, 1),
(116, 1),
(117, 1),
(118, 1),
(119, 1),
(120, 1),
(121, 1),
(122, 1),
(123, 1),
(124, 1),
(125, 1),
(126, 1),
(127, 1),
(128, 1),
(129, 1),
(130, 1),
(131, 1),
(132, 1),
(133, 1),
(134, 1),
(135, 1),
(136, 1),
(137, 1),
(138, 1),
(139, 1),
(140, 1),
(141, 1),
(142, 1),
(143, 1),
(144, 1),
(145, 1),
(146, 1),
(147, 1),
(148, 1),
(149, 1),
(150, 1),
(151, 1),
(152, 1),
(153, 1),
(154, 1),
(155, 1),
(156, 1),
(157, 1),
(158, 1),
(159, 1),
(160, 1),
(161, 1),
(162, 1),
(163, 1),
(164, 1),
(165, 1),
(166, 1),
(167, 1),
(168, 1),
(169, 1),
(170, 1),
(171, 1),
(172, 1),
(173, 1),
(174, 1),
(175, 1),
(176, 1),
(177, 1),
(178, 1),
(179, 1),
(180, 1),
(181, 1),
(182, 1),
(183, 1),
(184, 1),
(185, 1),
(186, 1),
(187, 1),
(188, 1),
(189, 1),
(190, 1),
(191, 1),
(192, 1),
(193, 1),
(194, 1),
(195, 1),
(196, 1),
(197, 1),
(198, 1),
(199, 1),
(200, 1),
(201, 1),
(202, 1),
(203, 1),
(204, 1),
(205, 1),
(206, 1),
(207, 1),
(208, 1),
(209, 1),
(210, 1),
(211, 1),
(212, 1),
(213, 1),
(214, 1),
(215, 1),
(216, 1),
(217, 1),
(218, 1),
(219, 1),
(220, 1),
(221, 1),
(222, 1),
(223, 1),
(224, 1),
(225, 1),
(226, 1),
(227, 1),
(228, 1),
(229, 1),
(230, 1),
(231, 1),
(232, 1),
(233, 1),
(234, 1),
(235, 1),
(236, 1),
(237, 1),
(238, 1),
(239, 1),
(240, 1),
(241, 1),
(242, 1),
(243, 1),
(244, 1),
(245, 1),
(246, 1),
(247, 1),
(248, 1),
(249, 1),
(250, 1),
(251, 1),
(252, 1),
(253, 1),
(254, 1),
(255, 1),
(256, 1),
(257, 1),
(258, 1),
(259, 1),
(260, 1),
(261, 1),
(262, 1),
(263, 1),
(264, 1),
(265, 1),
(266, 1),
(267, 1),
(268, 1),
(269, 1),
(270, 1),
(271, 1),
(272, 1),
(273, 1),
(274, 1),
(275, 1),
(276, 1),
(277, 1),
(278, 1),
(279, 1),
(280, 1),
(313, 1),
(314, 1),
(315, 1),
(316, 1),
(317, 1),
(318, 1),
(319, 1),
(320, 1),
(321, 1),
(322, 1),
(323, 1),
(324, 1),
(325, 1),
(326, 1),
(327, 1),
(328, 1),
(329, 1),
(330, 1),
(331, 1),
(332, 1),
(333, 1),
(334, 1),
(335, 1),
(336, 1),
(337, 1),
(338, 1),
(339, 1),
(340, 1),
(341, 1),
(342, 1),
(343, 1),
(344, 1),
(345, 1),
(346, 1),
(347, 1),
(348, 1),
(349, 1),
(350, 1),
(351, 1),
(352, 1),
(353, 1),
(354, 1),
(355, 1),
(356, 1),
(357, 1),
(358, 1),
(359, 1),
(360, 1),
(361, 1),
(362, 1),
(363, 1),
(364, 1),
(365, 1),
(366, 1),
(367, 1),
(368, 1),
(369, 1),
(370, 1),
(371, 1),
(372, 1),
(373, 1),
(374, 1),
(375, 1),
(376, 1),
(377, 1),
(378, 1),
(379, 1),
(380, 1),
(381, 1),
(382, 1),
(383, 1),
(384, 1),
(385, 1),
(386, 1),
(387, 1),
(388, 1),
(389, 1),
(390, 1),
(391, 1),
(392, 1),
(393, 1),
(394, 1),
(395, 1),
(396, 1),
(397, 1),
(398, 1),
(399, 1),
(400, 1),
(401, 1),
(402, 1),
(403, 1),
(404, 1),
(405, 1),
(406, 1),
(407, 1),
(408, 1),
(409, 1),
(410, 1),
(411, 1),
(412, 1),
(413, 1),
(414, 1),
(415, 1),
(416, 1),
(417, 1),
(418, 1),
(419, 1),
(420, 1),
(421, 1),
(422, 1),
(423, 1),
(424, 1),
(425, 1),
(426, 1),
(427, 1),
(428, 1),
(429, 1),
(430, 1),
(431, 1),
(432, 1),
(433, 1),
(434, 1),
(435, 1),
(436, 1),
(437, 1),
(438, 1),
(439, 1),
(440, 1),
(441, 1),
(442, 1),
(443, 1),
(444, 1),
(445, 1),
(446, 1),
(447, 1),
(448, 1),
(449, 1),
(455, 1),
(456, 1),
(3, 2),
(4, 2),
(6, 2),
(7, 2),
(8, 2),
(6, 3),
(3, 4),
(4, 4),
(5, 4),
(6, 4),
(7, 4),
(9, 5),
(10, 5),
(11, 5),
(12, 5),
(13, 5),
(14, 5),
(15, 5),
(16, 5),
(17, 5),
(18, 5),
(19, 5),
(20, 5),
(21, 5),
(22, 5),
(23, 5),
(24, 5),
(25, 5),
(26, 5),
(27, 5),
(28, 5),
(29, 5),
(30, 5),
(31, 5),
(32, 5),
(33, 5),
(34, 5),
(33, 9),
(393, 9),
(394, 9),
(57, 10),
(58, 10),
(59, 10),
(60, 10),
(9, 11),
(57, 12),
(58, 12),
(59, 12),
(60, 12),
(61, 12),
(62, 12),
(63, 12),
(64, 12),
(457, 12),
(57, 13),
(58, 13),
(59, 13),
(60, 13),
(61, 13),
(62, 13),
(63, 13),
(64, 13),
(458, 13),
(9, 14),
(10, 14),
(11, 14),
(12, 14),
(13, 14),
(14, 14),
(15, 14),
(16, 14),
(17, 14),
(18, 14),
(19, 14),
(20, 14),
(21, 14),
(22, 14),
(23, 14),
(24, 14),
(25, 14),
(26, 14),
(27, 14),
(28, 14),
(29, 14),
(30, 14),
(31, 14),
(32, 14);

-- --------------------------------------------------------

--
-- Table structure for table `salary_receives`
--

CREATE TABLE `salary_receives` (
  `id` bigint UNSIGNED NOT NULL,
  `vch_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `employee_id` bigint UNSIGNED NOT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `received_by` bigint UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `salary_slip_employee_id` bigint UNSIGNED DEFAULT NULL,
  `journal_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salary_receives`
--

INSERT INTO `salary_receives` (`id`, `vch_no`, `date`, `employee_id`, `created_by`, `received_by`, `amount`, `description`, `created_at`, `updated_at`, `salary_slip_employee_id`, `journal_id`) VALUES
(1, 'SR-20250409-4723', '2025-04-09', 1, 1, 1, 100.00, NULL, '2025-04-09 04:41:17', '2025-04-10 07:35:00', NULL, NULL),
(2, 'SR-20250409-7571', '2025-04-09', 1, 1, 4, 20.00, NULL, '2025-04-09 07:48:45', '2025-04-10 07:35:00', NULL, NULL),
(4, 'SR-20250409-1527', '2025-04-09', 1, 1, 5, 100.00, NULL, '2025-04-09 07:56:52', '2025-04-10 07:35:00', NULL, 14),
(5, 'SR-20250409-4946', '2025-04-09', 1, 1, 5, 100.00, NULL, '2025-04-09 07:57:10', '2025-04-10 07:35:00', NULL, 15),
(6, 'SR-20250410-9180', '2025-04-10', 1, 1, 5, 50.00, NULL, '2025-04-09 23:04:12', '2025-04-10 07:35:00', NULL, 16),
(7, 'SR-20250412-4566', '2025-04-12', 2, 6, 7, 10.00, 'Paid', '2025-04-11 23:30:40', '2025-04-11 23:30:40', NULL, 17),
(8, 'SR-20250412-8282', '2025-04-12', 2, 6, 7, 10.00, NULL, '2025-04-11 23:41:16', '2025-04-11 23:41:16', 4, 18),
(9, 'SR-20250412-2613', '2025-04-12', 1, 2, 6, 500.00, NULL, '2025-04-11 23:46:08', '2025-04-11 23:46:08', 1, 19),
(10, 'SR-20250412-5056', '2025-04-12', 3, 2, 6, 300.00, NULL, '2025-04-11 23:49:35', '2025-04-11 23:49:35', 5, 20),
(11, 'SR-20250412-3071', '2025-04-12', 4, 2, 6, 360.00, NULL, '2025-04-11 23:55:51', '2025-04-12 01:56:59', 6, 21),
(12, 'SR-20250413-3977', '2025-04-13', 5, 2, 6, 5000.00, NULL, '2025-04-13 00:14:28', '2025-04-13 00:14:28', 7, 22),
(13, 'SR-20250413-8035', '2025-04-13', 6, 6, 7, 900.00, NULL, '2025-04-13 00:30:35', '2025-04-13 00:30:35', 8, 23),
(14, 'SR-20250413-4811', '2025-04-13', 7, 6, 7, 600.00, NULL, '2025-04-13 01:09:46', '2025-04-13 01:09:46', 9, 24),
(15, 'SR-20250616-2024', '2025-06-16', 9, 12, 17, 50000.00, NULL, '2025-06-16 03:17:02', '2025-06-16 03:17:02', 11, 98),
(16, 'SR-20250616-7232', '2025-06-16', 10, 12, 16, 40000.00, NULL, '2025-06-16 05:17:40', '2025-06-16 05:17:40', 12, 100),
(17, 'SR-20250616-7811', '2025-06-16', 9, 12, 16, 50000.00, NULL, '2025-06-16 05:25:47', '2025-06-16 05:25:47', 14, 103),
(18, 'SR-20250616-6734', '2025-07-01', 12, 12, 16, 50000.00, NULL, '2025-06-16 07:04:14', '2025-06-16 07:04:14', 19, 106),
(19, 'SR-20250715-1040', '2025-07-15', 9, 13, 17, 25000.00, 'asdaf', '2025-07-15 00:35:23', '2025-07-15 00:35:23', 21, 122),
(20, 'SR-20250715-3938', '2025-07-15', 10, 12, 16, 20000.00, NULL, '2025-07-15 00:43:44', '2025-07-15 00:43:44', 22, 124),
(21, 'SR-20250719-8906', '2025-07-19', 13, 12, 16, 20.00, 'Paying partial Salary to Mamun for June', '2025-07-19 01:35:16', '2025-07-19 01:35:16', 23, 149),
(22, 'SR-20250719-9591', '2025-07-19', 13, 12, 16, 21.00, NULL, '2025-07-19 01:38:48', '2025-07-19 01:38:48', 23, 150),
(23, 'SR-20072025-5358', '2025-07-20', 13, 12, 16, 25.00, NULL, '2025-07-20 00:23:59', '2025-07-20 00:23:59', 23, 151);

-- --------------------------------------------------------

--
-- Table structure for table `salary_slips`
--

CREATE TABLE `salary_slips` (
  `id` bigint UNSIGNED NOT NULL,
  `voucher_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `month` tinyint UNSIGNED NOT NULL,
  `year` year NOT NULL,
  `is_posted_to_accounts` tinyint(1) NOT NULL DEFAULT '0',
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salary_slips`
--

INSERT INTO `salary_slips` (`id`, `voucher_number`, `date`, `month`, `year`, `is_posted_to_accounts`, `note`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'SAL-20250409-3553', '2025-04-09', 0, '0000', 0, NULL, 2, '2025-04-09 04:51:58', '2025-04-09 04:51:58'),
(4, 'SAL-20250410-4260', '2025-04-10', 3, '2025', 0, NULL, 6, '2025-04-10 06:05:26', '2025-04-10 06:05:26'),
(5, 'SAL-20250412-4496', '2025-04-12', 4, '2025', 0, NULL, 2, '2025-04-11 23:49:15', '2025-04-11 23:49:15'),
(6, 'SAL-20250412-3317', '2025-04-12', 3, '2025', 0, NULL, 2, '2025-04-11 23:55:22', '2025-04-11 23:55:22'),
(7, 'SAL-20250413-3553', '2025-04-13', 3, '2025', 0, NULL, 2, '2025-04-12 23:59:59', '2025-04-12 23:59:59'),
(8, 'SAL-20250413-1002', '2025-04-13', 3, '2025', 0, NULL, 6, '2025-04-13 00:30:16', '2025-04-13 00:30:16'),
(9, 'SAL-20250413-5954', '2025-04-13', 4, '2025', 0, NULL, 6, '2025-04-13 01:09:23', '2025-04-13 01:09:23'),
(10, 'SAL-20250413-1779', '2025-04-13', 4, '2025', 0, NULL, 10, '2025-04-13 03:05:19', '2025-04-13 03:05:19'),
(11, 'SAL-20250616-5571', '2025-06-16', 1, '2025', 0, NULL, 12, '2025-06-16 03:16:23', '2025-06-16 03:16:23'),
(12, 'SAL-20250616-5731', '2025-06-16', 1, '2025', 0, NULL, 12, '2025-06-16 05:06:30', '2025-06-16 05:06:30'),
(14, 'SAL-20250616-5702', '2025-06-16', 6, '2025', 0, NULL, 12, '2025-06-16 05:25:30', '2025-06-16 05:25:30'),
(18, 'SAL-20250616-4031', '2025-06-16', 6, '2025', 0, NULL, 12, '2025-06-16 06:38:10', '2025-06-16 06:38:10'),
(19, 'SAL-20250616-4705', '2025-06-30', 6, '2025', 0, NULL, 12, '2025-06-16 07:00:00', '2025-06-16 07:00:00'),
(20, 'SAL-20250715-4928', '2025-07-15', 7, '2025', 0, NULL, 13, '2025-07-15 00:33:16', '2025-07-15 00:33:16'),
(21, 'SAL-20250715-1703', '2025-07-15', 7, '2025', 0, NULL, 13, '2025-07-15 00:34:56', '2025-07-15 00:34:56'),
(22, 'SAL-20250715-7174', '2025-07-15', 7, '2025', 0, NULL, 12, '2025-07-15 00:42:42', '2025-07-15 00:42:42'),
(23, 'SAL-20250719-6601', '2025-07-19', 6, '2025', 0, NULL, 12, '2025-07-19 01:34:06', '2025-07-19 01:34:06');

-- --------------------------------------------------------

--
-- Table structure for table `salary_slip_employees`
--

CREATE TABLE `salary_slip_employees` (
  `id` bigint UNSIGNED NOT NULL,
  `salary_slip_id` bigint UNSIGNED NOT NULL,
  `employee_id` bigint UNSIGNED NOT NULL,
  `basic_salary` decimal(15,2) NOT NULL,
  `additional_amount` decimal(15,2) NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `paid_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Unpaid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salary_slip_employees`
--

INSERT INTO `salary_slip_employees` (`id`, `salary_slip_id`, `employee_id`, `basic_salary`, `additional_amount`, `total_amount`, `created_at`, `updated_at`, `paid_amount`, `status`) VALUES
(1, 1, 1, 500.00, 166.00, 666.00, '2025-04-09 04:51:58', '2025-04-11 23:46:08', 500.00, 'Paid'),
(4, 4, 2, 10.00, 2.00, 12.00, '2025-04-10 06:05:26', '2025-04-11 23:41:16', 10.00, 'Paid'),
(5, 5, 3, 400.00, 0.00, 400.00, '2025-04-11 23:49:15', '2025-04-11 23:49:35', 300.00, 'Paid'),
(6, 6, 4, 450.00, 0.00, 450.00, '2025-04-11 23:55:22', '2025-04-12 01:56:59', 360.00, 'Partially Paid'),
(7, 7, 5, 5000.00, 0.00, 5000.00, '2025-04-12 23:59:59', '2025-04-13 00:14:28', 5000.00, 'Paid'),
(8, 8, 6, 900.00, 0.00, 900.00, '2025-04-13 00:30:17', '2025-04-13 00:30:35', 900.00, 'Paid'),
(9, 9, 7, 600.00, 0.00, 600.00, '2025-04-13 01:09:23', '2025-04-13 01:09:46', 600.00, 'Paid'),
(10, 10, 8, 50000.00, 0.00, 50000.00, '2025-04-13 03:05:19', '2025-04-13 03:05:19', 0.00, 'Unpaid'),
(11, 11, 9, 50000.00, 0.00, 50000.00, '2025-06-16 03:16:23', '2025-06-16 03:17:02', 50000.00, 'Paid'),
(12, 12, 10, 40000.00, 0.00, 40000.00, '2025-06-16 05:06:30', '2025-06-16 05:17:40', 40000.00, 'Paid'),
(14, 14, 9, 50000.00, 0.00, 50000.00, '2025-06-16 05:25:30', '2025-06-16 05:25:47', 50000.00, 'Paid'),
(18, 18, 11, 22000.00, 0.00, 22000.00, '2025-06-16 06:38:10', '2025-06-16 06:38:10', 0.00, 'Unpaid'),
(19, 19, 12, 50000.00, 0.00, 50000.00, '2025-06-16 07:00:00', '2025-06-16 07:04:14', 50000.00, 'Paid'),
(20, 20, 9, 50000.00, 0.00, 50000.00, '2025-07-15 00:33:16', '2025-07-15 00:33:16', 0.00, 'Unpaid'),
(21, 21, 9, 25000.00, 0.00, 25000.00, '2025-07-15 00:34:56', '2025-07-15 00:35:23', 25000.00, 'Paid'),
(22, 22, 10, 40000.00, 0.00, 40000.00, '2025-07-15 00:42:42', '2025-07-15 00:43:44', 20000.00, 'Partially Paid'),
(23, 23, 13, 100.00, 0.00, 100.00, '2025-07-19 01:34:06', '2025-07-20 00:23:59', 66.00, 'Partially Paid');

-- --------------------------------------------------------

--
-- Table structure for table `salary_structures`
--

CREATE TABLE `salary_structures` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `basic_salary` decimal(10,2) NOT NULL,
  `house_rent` decimal(10,2) NOT NULL DEFAULT '0.00',
  `medical` decimal(10,2) NOT NULL DEFAULT '0.00',
  `transport` decimal(10,2) NOT NULL DEFAULT '0.00',
  `bonus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `voucher_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `journal_id` bigint UNSIGNED DEFAULT NULL,
  `godown_id` bigint UNSIGNED NOT NULL,
  `salesman_id` bigint UNSIGNED NOT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `inventory_ledger_id` bigint UNSIGNED DEFAULT NULL,
  `cogs_ledger_id` bigint UNSIGNED DEFAULT NULL,
  `received_mode_id` bigint UNSIGNED DEFAULT NULL,
  `amount_received` decimal(18,2) DEFAULT '0.00',
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
  `updated_at` timestamp NULL DEFAULT NULL,
  `interest_applicable` tinyint(1) NOT NULL DEFAULT '1',
  `interest_basis` enum('due','total') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_interest_date` date DEFAULT NULL,
  `status` enum('draft','pending_sub','pending_resp','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `sub_responsible_id` bigint UNSIGNED DEFAULT NULL,
  `responsible_id` bigint UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  `rejected_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `date`, `voucher_no`, `journal_id`, `godown_id`, `salesman_id`, `account_ledger_id`, `inventory_ledger_id`, `cogs_ledger_id`, `received_mode_id`, `amount_received`, `phone`, `address`, `total_qty`, `total_discount`, `grand_total`, `other_expense_ledger_id`, `other_amount`, `shipping_details`, `delivered_to`, `truck_rent`, `rent_advance`, `net_rent`, `truck_driver_name`, `driver_address`, `driver_mobile`, `receive_mode`, `receive_amount`, `total_due`, `closing_balance`, `created_by`, `deleted_at`, `created_at`, `updated_at`, `interest_applicable`, `interest_basis`, `last_interest_date`, `status`, `sub_responsible_id`, `responsible_id`, `approved_at`, `rejected_at`, `rejected_by`) VALUES
(1, '2025-03-23', 'SAL-20250323-6643', NULL, 1, 2, 1, NULL, NULL, NULL, 0.00, '01924488203', 'asdf', 1.00, 1.00, 19.00, NULL, 0.00, NULL, NULL, 500.00, 100.00, NULL, 'Tawhid', 'ashulia birulia', '01898440582', NULL, NULL, NULL, NULL, 1, NULL, '2025-03-23 00:07:10', '2025-03-23 00:44:33', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(2, '2025-03-23', 'SAL-20250323-4787', NULL, 1, 2, 1, NULL, NULL, NULL, 0.00, NULL, NULL, 2.00, 0.00, 40.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-03-23 00:53:37', '2025-03-23 00:53:37', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(3, '2025-03-24', 'SAL-20250324-1711', NULL, 3, 3, 5, NULL, NULL, NULL, 0.00, '01924488203', 'asdf', 1.00, 0.00, 10.00, NULL, 0.00, 'nai', 'nai', 50.00, 10.00, 20.00, 'jalil', 'dhaka', '015265489', NULL, NULL, NULL, NULL, 2, NULL, '2025-03-23 22:03:22', '2025-03-23 22:03:22', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(4, '2025-04-17', 'SAL-20250417-6706', NULL, 10, 6, 28, NULL, NULL, NULL, 0.00, NULL, NULL, 2.00, 10.00, 36.00, NULL, 0.00, 'Ship to Barishal', 'Tawhid Rafusoft', 600.00, 200.00, NULL, 'Shotto', 'Dhaka', '01917', NULL, NULL, 0.00, NULL, 12, NULL, '2025-04-17 05:13:19', '2025-04-17 05:13:19', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(5, '2025-04-17', 'SAL-20250417-7568', NULL, 11, 6, 28, NULL, NULL, NULL, 0.00, NULL, NULL, 1.00, 5.00, 81.70, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 12, NULL, '2025-04-17 05:20:05', '2025-04-17 05:20:05', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(6, '2025-04-19', 'SAL-20250419-3714', 39, 10, 6, 28, NULL, NULL, 16, 95.50, NULL, NULL, 2.00, 4.50, 95.50, NULL, 0.00, 'Ship to shewrapara', 'Satya', 500.00, 300.00, NULL, 'Aslam', 'Dhaka', '0313', NULL, NULL, 0.00, 99944.50, 12, NULL, '2025-04-19 00:00:29', '2025-04-19 00:00:30', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(7, '2025-04-19', 'SAL-20250419-8183', 40, 10, 6, 30, NULL, NULL, 16, 200.00, NULL, NULL, 2.00, 4.50, 195.50, NULL, 0.00, 'shewrapara', 'shott0', 600.00, 200.00, NULL, 'aslam', 'dhaka', '164', NULL, NULL, 0.00, 100144.50, 12, NULL, '2025-04-19 00:50:00', '2025-04-19 00:50:00', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(8, '2025-04-19', 'SAL-20250419-4459', 41, 11, 6, 30, NULL, NULL, 16, 20.00, NULL, NULL, 1.00, 0.00, 19.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 100164.50, 12, NULL, '2025-04-19 00:58:11', '2025-04-19 00:58:11', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(9, '2025-04-19', 'SAL-20250419-9692', 44, 10, 6, 30, NULL, NULL, 16, 100.00, NULL, NULL, 1.00, 0.00, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 100282.50, 12, NULL, '2025-04-19 01:22:13', '2025-04-19 01:38:50', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(10, '2025-04-20', 'SAL-20250420-6009', 45, 10, 6, 30, 31, NULL, 16, 20.00, NULL, NULL, 2.00, 0.00, 20.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 100303.50, 12, NULL, '2025-04-19 23:54:59', '2025-04-19 23:54:59', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(11, '2025-04-20', 'SAL-20250420-3435', 47, 10, 6, 30, 29, 33, 16, 30.00, NULL, NULL, 3.00, 0.00, 30.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 100143.50, 12, NULL, '2025-04-20 01:57:49', '2025-04-20 01:57:49', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(12, '2025-04-21', 'SAL-20250421-2432', 59, 10, 6, 30, 29, 33, 16, 60.00, NULL, NULL, 3.00, 0.00, 60.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 99785.50, 12, NULL, '2025-04-21 03:00:46', '2025-04-21 03:00:46', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(13, '2025-04-24', 'SAL-20250424-5684', 68, 10, 6, 30, 29, 33, 16, 99.00, NULL, NULL, 1.00, 0.00, 99.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 99673.50, 12, NULL, '2025-04-24 03:58:29', '2025-04-24 03:58:29', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(14, '2025-04-01', 'SAL-20250430-7250', 73, 10, 6, 39, 31, 33, 16, 15000.00, NULL, NULL, 20.00, 0.00, 20000.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 20000.00, 12, NULL, '2025-04-30 03:56:38', '2025-04-30 03:57:38', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(15, '2025-04-30', 'SAL-20250430-7667', 74, 10, 6, 39, 31, 33, 16, 150.00, NULL, NULL, 2.00, 0.00, 200.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 150.00, 12, NULL, '2025-04-30 03:59:19', '2025-04-30 03:59:19', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(16, '2025-04-30', 'SAL-20250430-4061', 75, 10, 6, 41, 31, 33, 16, 399.00, NULL, NULL, 2.00, 0.00, 1000.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 601.00, 114864.50, 12, NULL, '2025-04-30 05:06:31', '2025-07-17 18:00:00', 1, NULL, '2025-07-18', 'draft', NULL, NULL, NULL, NULL, NULL),
(17, '2025-05-04', 'SAL-20250504-8019', 77, 10, 6, 41, 29, 33, 16, 179.00, NULL, NULL, 2.00, 0.00, 180.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 114543.50, 12, NULL, '2025-05-04 01:49:18', '2025-07-17 18:00:00', 1, NULL, '2025-07-18', 'draft', NULL, NULL, NULL, NULL, NULL),
(18, '2025-06-14', 'SAL-20250614-7797', 81, 10, 6, 39, 45, 33, 16, 300.00, '01309655677', 'Pallbi Metro, Mirpur 12, Dhaka - 1212', 15.00, 0.00, 300.00, NULL, 0.00, 'Azimpur', 'Tanjilur Rahman Jim', 500.00, 200.00, 500.00, 'abd', 'murshidabad', '01603047439', NULL, NULL, 0.00, 114036.50, 12, NULL, '2025-06-14 04:16:08', '2025-06-14 04:16:08', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(19, '2025-06-15', 'SAL-20250615-5041', 86, 10, 6, 30, 45, 33, 16, 500.00, '01521584092', 'APONN GROUP, Chandra Mollika,', 10.00, 0.00, 500.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 115036.50, 12, NULL, '2025-06-15 01:03:10', '2025-06-15 01:03:11', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(28, '2025-06-15', 'SAL-20250615-1140', 95, 10, 6, 30, 29, 33, 16, 300.00, '01521584092', 'APONN GROUP, Chandra Mollika,', 10.00, 0.00, 500.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 200.00, 115336.50, 12, NULL, '2025-06-15 05:15:39', '2025-07-17 18:00:00', 1, NULL, '2025-07-18', 'draft', NULL, NULL, NULL, NULL, NULL),
(34, '2025-06-21', 'SAL-20250621-6543', 115, 10, 6, 29, 29, 33, 16, 2000.00, '01309655677', 'afsdaf', 5.00, 10.00, 2490.00, NULL, 0.00, 'Rangpur', 'Rangpuria', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 490.00, 2000.00, 12, NULL, '2025-06-21 00:44:46', '2025-07-17 18:00:00', 1, NULL, '2025-07-18', 'draft', NULL, NULL, NULL, NULL, NULL),
(35, '2025-06-21', 'SAL-20250621-5408', 114, 10, 6, 31, 29, 33, 17, 150.00, '01309655677', 'afsdaf', 3.00, 0.00, 150.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 651.00, 12, NULL, '2025-06-21 01:13:32', '2025-06-21 01:13:32', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(36, '2025-06-21', 'SAL-20250621-8874', 119, 10, 6, 30, 29, 33, 16, 142.00, '01309655677', 'afsdaf', 3.00, 5.00, 142.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 117081.50, 12, NULL, '2025-06-21 01:14:42', '2025-06-21 03:35:00', 1, NULL, NULL, 'draft', NULL, NULL, NULL, NULL, NULL),
(37, '2025-07-15', 'SAL-20250715-3578', 125, 10, 6, 28, 29, 33, 16, 600.00, '01309655677', 'afsdaf', 2.00, 0.00, 1000.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 400.00, 117171.50, 12, NULL, '2025-07-15 01:04:20', '2025-07-17 18:00:00', 1, NULL, '2025-07-18', 'draft', NULL, NULL, NULL, NULL, NULL),
(51, '2025-07-15', 'SAL-20250715-6059', 139, 10, 6, 30, 31, 33, NULL, 0.00, '01521583066', 'Banani', 10.00, 0.00, 500.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 400.00, NULL, 12, NULL, '2025-07-15 07:46:13', '2025-07-17 18:00:00', 1, NULL, '2025-07-18', 'draft', NULL, NULL, NULL, NULL, NULL),
(52, '2025-07-15', 'SAL-20250715-9371', 140, 10, 6, 30, 29, 33, NULL, 0.00, '01521583066', 'Banani', 1.00, 0.00, 50.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 20.00, NULL, 12, NULL, '2025-07-15 07:55:13', '2025-07-17 18:00:00', 1, NULL, '2025-07-18', 'draft', NULL, NULL, NULL, NULL, NULL),
(53, '2025-07-16', 'SAL-20250716-3558', 141, 10, 6, 30, 29, 33, NULL, 0.00, '01521583066', 'Banani', 2.00, 0.00, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 100.00, NULL, 12, NULL, '2025-07-16 01:32:50', '2025-07-17 18:00:00', 1, NULL, '2025-07-18', 'draft', NULL, NULL, NULL, NULL, NULL),
(54, '2025-07-16', 'SAL-20250716-5938', 142, 10, 6, 30, 29, 33, NULL, 0.00, '01309655677', 'afsdaf', 1.00, 0.00, 99.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, 'afsdaf', '01309655677', NULL, NULL, 99.00, NULL, 12, NULL, '2025-07-16 01:47:36', '2025-07-17 18:00:00', 1, NULL, '2025-07-18', 'draft', NULL, NULL, NULL, NULL, NULL),
(55, '2025-07-15', 'SAL-20250716-6856', 143, 10, 6, 30, 29, 33, NULL, 0.00, '01309655677', 'afsdaf', 1.00, 0.00, 98.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, 'afsdaf', '01309655677', NULL, NULL, 46.27, NULL, 12, NULL, '2025-07-16 04:19:08', '2025-07-17 07:12:26', 1, 'total', '2025-07-18', 'draft', NULL, NULL, NULL, NULL, NULL),
(57, '2025-07-16', 'SAL-20250716-3979', 145, 10, 6, 30, 29, 33, NULL, 0.00, '01309655677', 'afsdaf', 1.00, 0.00, 102.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, 'afsdaf', '01309655677', NULL, NULL, 208.27, NULL, 12, NULL, '2025-07-16 04:43:43', '2025-07-17 05:10:33', 1, 'total', '2025-07-18', 'draft', NULL, NULL, NULL, NULL, NULL),
(58, '2025-07-16', 'SAL-20250716-3252', 146, 10, 6, 30, 29, 33, NULL, 0.00, '01924488203', 'asdf', 1.00, 0.00, 109.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, NULL, 12, NULL, '2025-07-16 04:57:27', '2025-07-16 06:43:43', 1, 'total', '2025-07-16', 'draft', NULL, NULL, NULL, NULL, NULL),
(59, '2025-07-16', 'SIM-001', NULL, 1, 1, 1, NULL, NULL, NULL, 0.00, NULL, NULL, 0.00, 0.00, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 100.00, NULL, 12, NULL, '2025-07-17 00:05:34', '2025-07-17 18:00:00', 1, 'total', '2025-07-18', 'draft', NULL, NULL, NULL, NULL, NULL),
(60, '2025-07-16', 'SIM-TEST', 147, 1, 1, 1, NULL, NULL, NULL, 0.00, NULL, NULL, 0.00, 0.00, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 82.00, NULL, 12, NULL, '2025-07-17 01:06:51', '2025-07-17 01:39:02', 1, 'total', '2025-07-17', 'draft', NULL, NULL, NULL, NULL, NULL),
(61, '2025-07-23', 'SAL-20250723-3247', 152, 10, 6, 30, 29, 33, NULL, 0.00, '01924488203', 'asdf', 5.00, 0.00, 500.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, NULL, 12, NULL, '2025-07-23 04:18:45', '2025-07-23 04:18:45', 1, 'total', NULL, 'approved', NULL, NULL, '2025-07-23 04:18:45', NULL, NULL),
(62, '2025-07-23', 'SAL-20250723-2913', 153, 10, 6, 30, 29, 33, NULL, 0.00, '01924488203', 'asdf', 1.00, 0.00, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, NULL, 12, NULL, '2025-07-23 04:21:26', '2025-07-23 04:21:27', 1, 'total', NULL, 'approved', NULL, NULL, '2025-07-23 04:21:27', NULL, NULL),
(63, '2025-07-23', 'SAL-20250723-5000', 154, 14, 7, 63, 60, 62, NULL, 0.00, '01521584092', 'APONN GROUP, Chandra Mollika,', 10.00, 0.00, 650.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, NULL, 15, NULL, '2025-07-23 04:35:00', '2025-07-23 04:35:00', 1, 'due', NULL, 'approved', NULL, NULL, '2025-07-23 04:35:00', NULL, NULL),
(64, '2025-07-23', 'SAL-20250723-4925', 155, 14, 7, 63, 60, 62, NULL, 0.00, '01309655677', 'afsdaf', 5.00, 0.00, 345.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, 'afsdaf', '01309655677', NULL, NULL, 2.00, NULL, 15, NULL, '2025-07-23 04:41:14', '2025-07-23 04:41:14', 0, 'due', NULL, 'approved', NULL, NULL, '2025-07-23 04:41:14', NULL, NULL),
(65, '2025-07-23', 'SAL-20250723-1479', NULL, 14, 7, 63, 60, 62, NULL, 0.00, '01924488203', 'asdf', 2.00, 0.00, 138.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 138.00, NULL, 15, NULL, '2025-07-23 05:39:02', '2025-07-23 05:39:02', 0, 'due', NULL, 'pending_sub', NULL, NULL, NULL, NULL, NULL),
(66, '2025-07-23', 'SAL-20250723-6098', 156, 14, 7, 63, 60, 62, NULL, 0.00, '0000000111', 'asdfasdfasd', 2.00, 0.00, 130.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 130.00, NULL, 15, NULL, '2025-07-23 06:45:53', '2025-07-23 06:54:56', 0, 'due', NULL, 'approved', 16, 16, '2025-07-23 06:54:56', NULL, NULL),
(67, '2025-07-23', 'SAL-20250723-4950', NULL, 14, 7, 63, 60, 62, NULL, 0.00, '01101010', 'asdfasdafqrft', 3.00, 0.00, 195.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 195.00, NULL, 15, NULL, '2025-07-23 07:26:53', '2025-07-23 07:26:53', 0, 'due', NULL, 'pending_sub', NULL, 16, NULL, NULL, NULL),
(68, '2025-07-23', 'SAL-20250723-9724', 157, 14, 7, 63, 60, 62, NULL, 0.00, '01521584092', 'asdfasd', 2.00, 0.00, 130.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, NULL, 15, NULL, '2025-07-23 07:34:51', '2025-07-23 07:35:40', 0, 'due', NULL, 'pending_sub', 16, 16, NULL, NULL, NULL),
(69, '2025-07-23', 'SAL-20250723-5051', 158, 14, 7, 63, 60, 62, NULL, 0.00, '01521584092', 'asdfasd', 6.00, 0.00, 390.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 390.00, NULL, 15, NULL, '2025-07-23 07:36:27', '2025-07-23 07:45:05', 0, 'due', NULL, 'approved', 16, 16, '2025-07-23 07:45:05', NULL, NULL);

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
(3, 'SM-0003', 'Elham\'s Salesman', '01521584092', NULL, NULL, 2, '2025-03-23 21:46:47', '2025-03-23 21:46:47', NULL),
(4, 'SM-0004', 'Tawhid', '02222222', 'jim@jim.com', '12asdf\n12asdf', 10, '2025-04-15 04:06:48', '2025-04-15 04:06:48', NULL),
(5, 'SM-0005', 'Mitthajit', '03101651', NULL, NULL, 11, '2025-04-16 06:24:37', '2025-04-16 06:24:37', NULL),
(6, 'SM-0006', 'HHH', '66', NULL, NULL, 12, '2025-04-16 07:31:02', '2025-04-16 07:31:02', NULL),
(7, 'SM-0007', 'Jim1', '01512165130', NULL, NULL, 15, '2025-07-23 04:29:13', '2025-07-23 04:29:13', NULL);

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
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_orders`
--

INSERT INTO `sales_orders` (`id`, `voucher_no`, `date`, `account_ledger_id`, `salesman_id`, `shipping_details`, `delivered_to`, `total_qty`, `total_amount`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'SO-00001', '2025-03-24', 5, 3, NULL, NULL, 1.00, 19.00, '2025-03-24 02:00:07', '2025-03-24 02:00:07', NULL),
(3, 'SO-00003', '2025-03-24', 5, 3, 'nai', 'nai', 1.00, 1.00, '2025-03-24 02:45:33', '2025-03-24 02:45:33', NULL),
(4, 'SO-00004', '2025-03-24', 5, 3, NULL, NULL, 11.00, 250.00, '2025-03-24 02:56:59', '2025-03-24 02:56:59', NULL),
(5, 'SO-00005', '2025-04-16', 8, 2, NULL, NULL, 1.00, 7.00, '2025-04-16 04:32:39', '2025-04-16 04:32:39', 1),
(6, 'SO-00006', '2025-06-14', 28, 6, 'Azimpur', 'Azimpur', 10.00, 750.00, '2025-06-14 05:33:36', '2025-06-14 05:33:36', 12);

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
(4, 4, 5, 10.00, 2, 20.00, 'flat', 0.00, 200.00, '2025-03-24 02:56:59', '2025-03-24 02:56:59'),
(5, 5, 7, 1.00, 1, 7.00, 'flat', 0.00, 7.00, '2025-04-16 04:32:39', '2025-04-16 04:32:39'),
(6, 6, 24, 5.00, 14, 50.00, 'flat', 0.00, 250.00, '2025-06-14 05:33:36', '2025-06-14 05:33:36'),
(7, 6, 27, 5.00, 14, 100.00, 'flat', 0.00, 500.00, '2025-06-14 05:33:36', '2025-06-14 05:33:36');

-- --------------------------------------------------------

--
-- Table structure for table `sales_returns`
--

CREATE TABLE `sales_returns` (
  `id` bigint UNSIGNED NOT NULL,
  `sale_id` bigint UNSIGNED DEFAULT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `inventory_ledger_id` bigint UNSIGNED DEFAULT NULL,
  `cogs_ledger_id` bigint UNSIGNED DEFAULT NULL,
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
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `received_mode_id` bigint UNSIGNED DEFAULT NULL,
  `amount_received` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_returns`
--

INSERT INTO `sales_returns` (`id`, `sale_id`, `account_ledger_id`, `inventory_ledger_id`, `cogs_ledger_id`, `voucher_no`, `return_date`, `total_qty`, `total_return_amount`, `reason`, `created_by`, `created_at`, `updated_at`, `godown_id`, `salesman_id`, `phone`, `address`, `received_mode_id`, `amount_received`) VALUES
(1, NULL, 5, NULL, NULL, 'SRL-20250324-0001', '2025-03-24', 12.00, 55.00, NULL, 2, '2025-03-23 21:56:33', '2025-03-25 03:41:27', 3, 3, '01924488203', 'asdf', NULL, NULL),
(3, 3, 5, NULL, NULL, 'SRL-20250324-0002', '2025-03-24', 1.00, 2.00, 'ase', 2, '2025-03-23 22:10:21', '2025-03-23 22:17:43', 3, 3, '01924488203', 'asdf', NULL, NULL),
(14, 11, 30, 29, 33, 'SRL-20250420-0004', '2025-04-20', 1.00, 10.00, NULL, 12, '2025-04-20 04:52:00', '2025-04-20 04:54:16', 10, 6, NULL, NULL, NULL, NULL),
(15, 16, 41, 31, 33, 'SRL-20250430-0015', '2025-04-30', 1.00, 500.00, NULL, 12, '2025-04-30 06:29:03', '2025-04-30 06:29:03', 10, 6, NULL, NULL, NULL, NULL),
(16, 28, 30, 29, 33, 'SRL-20250615-0016', '2025-06-15', 5.00, 250.00, NULL, 12, '2025-06-15 07:22:55', '2025-06-15 07:22:55', 10, 6, '01521584092', 'APONN GROUP, Chandra Mollika,', NULL, NULL);

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
(7, 1, 5, 2.00, 20.00, 40.00, '2025-03-25 03:41:27', '2025-03-25 03:41:27'),
(19, 14, 24, 1.00, 10.00, 10.00, '2025-04-20 04:54:16', '2025-04-20 04:54:16'),
(20, 15, 24, 1.00, 500.00, 500.00, '2025-04-30 06:29:03', '2025-04-30 06:29:03'),
(21, 16, 27, 5.00, 50.00, 250.00, '2025-06-15 07:22:56', '2025-06-15 07:22:56');

-- --------------------------------------------------------

--
-- Table structure for table `sale_approvals`
--

CREATE TABLE `sale_approvals` (
  `id` bigint UNSIGNED NOT NULL,
  `sale_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `action` enum('approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sale_approvals`
--

INSERT INTO `sale_approvals` (`id`, `sale_id`, `user_id`, `created_by`, `action`, `note`, `created_at`, `updated_at`) VALUES
(1, 66, 16, NULL, 'approved', 'Approved by Sub-Responsible', '2025-07-23 06:54:18', '2025-07-23 06:54:18'),
(2, 66, 16, NULL, 'approved', 'Approved by Responsible', '2025-07-23 06:54:56', '2025-07-23 06:54:56'),
(3, 69, 16, 16, 'approved', 'Approved by Sub-Responsible', '2025-07-23 07:44:28', '2025-07-23 07:44:28'),
(4, 69, 16, 16, 'approved', 'Approved by Responsible', '2025-07-23 07:45:05', '2025-07-23 07:45:05');

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
(5, 3, 2, 1.00, 10.00, 0.00, 'bdt', 10.00, NULL, '2025-03-23 22:03:22', '2025-03-23 22:03:22'),
(6, 4, 24, 2.00, 20.00, 10.00, 'percent', 36.00, NULL, '2025-04-17 05:13:19', '2025-04-17 05:13:19'),
(7, 5, 23, 1.00, 86.00, 5.00, 'percent', 81.70, NULL, '2025-04-17 05:20:05', '2025-04-17 05:20:05'),
(8, 6, 24, 2.00, 50.00, 4.50, 'percent', 95.50, NULL, '2025-04-19 00:00:29', '2025-04-19 00:00:29'),
(9, 7, 24, 2.00, 100.00, 4.50, 'bdt', 195.50, NULL, '2025-04-19 00:50:00', '2025-04-19 00:50:00'),
(10, 8, 21, 1.00, 19.00, 0.00, 'bdt', 19.00, NULL, '2025-04-19 00:58:11', '2025-04-19 00:58:11'),
(13, 9, 24, 1.00, 100.00, 0.00, 'bdt', 100.00, NULL, '2025-04-19 01:38:50', '2025-04-19 01:38:50'),
(14, 10, 24, 2.00, 10.00, 0.00, 'bdt', 20.00, NULL, '2025-04-19 23:54:59', '2025-04-19 23:54:59'),
(15, 11, 24, 3.00, 10.00, 0.00, 'bdt', 30.00, NULL, '2025-04-20 01:57:49', '2025-04-20 01:57:49'),
(16, 12, 25, 3.00, 20.00, 0.00, 'bdt', 60.00, NULL, '2025-04-21 03:00:46', '2025-04-21 03:00:46'),
(17, 13, 24, 1.00, 99.00, 0.00, 'bdt', 99.00, NULL, '2025-04-24 03:58:29', '2025-04-24 03:58:29'),
(19, 14, 24, 20.00, 1000.00, 0.00, 'bdt', 20000.00, NULL, '2025-04-30 03:57:38', '2025-04-30 03:57:38'),
(20, 15, 24, 2.00, 100.00, 0.00, 'bdt', 200.00, NULL, '2025-04-30 03:59:19', '2025-04-30 03:59:19'),
(21, 16, 24, 2.00, 500.00, 0.00, 'bdt', 1000.00, NULL, '2025-04-30 05:06:31', '2025-04-30 05:06:31'),
(22, 17, 25, 2.00, 90.00, 0.00, 'bdt', 180.00, NULL, '2025-05-04 01:49:18', '2025-05-04 01:49:18'),
(23, 18, 25, 5.00, 50.00, 0.00, 'bdt', 250.00, NULL, '2025-06-14 04:16:08', '2025-06-14 04:16:08'),
(24, 18, 27, 10.00, 5.00, 0.00, 'bdt', 50.00, NULL, '2025-06-14 04:16:08', '2025-06-14 04:16:08'),
(25, 19, 27, 10.00, 50.00, 0.00, 'bdt', 500.00, NULL, '2025-06-15 01:03:11', '2025-06-15 01:03:11'),
(34, 28, 27, 10.00, 50.00, 0.00, 'bdt', 500.00, NULL, '2025-06-15 05:15:39', '2025-06-15 05:15:39'),
(43, 35, 24, 3.00, 50.00, 0.00, 'bdt', 150.00, NULL, '2025-06-21 01:13:32', '2025-06-21 01:13:32'),
(44, 34, 24, 5.00, 500.00, 10.00, 'bdt', 2490.00, NULL, '2025-06-21 01:13:57', '2025-06-21 01:13:57'),
(46, 36, 25, 3.00, 49.00, 5.00, 'bdt', 142.00, NULL, '2025-06-21 03:35:00', '2025-06-21 03:35:00'),
(47, 37, 24, 2.00, 500.00, 0.00, 'bdt', 1000.00, NULL, '2025-07-15 01:04:20', '2025-07-15 01:04:20'),
(65, 51, 25, 10.00, 50.00, 0.00, 'bdt', 500.00, NULL, '2025-07-15 07:46:13', '2025-07-15 07:46:13'),
(66, 52, 25, 1.00, 50.00, 0.00, 'bdt', 50.00, NULL, '2025-07-15 07:55:13', '2025-07-15 07:55:13'),
(67, 53, 27, 2.00, 50.00, 0.00, 'bdt', 100.00, NULL, '2025-07-16 01:32:50', '2025-07-16 01:32:50'),
(68, 54, 25, 1.00, 99.00, 0.00, 'bdt', 99.00, NULL, '2025-07-16 01:47:36', '2025-07-16 01:47:36'),
(69, 55, 25, 1.00, 98.00, 0.00, 'bdt', 98.00, NULL, '2025-07-16 04:19:08', '2025-07-16 04:19:08'),
(71, 57, 27, 1.00, 102.00, 0.00, 'bdt', 102.00, NULL, '2025-07-16 04:43:43', '2025-07-16 04:43:43'),
(72, 58, 27, 1.00, 109.00, 0.00, 'bdt', 109.00, NULL, '2025-07-16 04:57:27', '2025-07-16 04:57:27'),
(73, 61, 27, 5.00, 100.00, 0.00, 'bdt', 500.00, NULL, '2025-07-23 04:18:45', '2025-07-23 04:18:45'),
(74, 62, 27, 1.00, 100.00, 0.00, 'bdt', 100.00, NULL, '2025-07-23 04:21:26', '2025-07-23 04:21:26'),
(75, 63, 30, 10.00, 65.00, 0.00, 'bdt', 650.00, NULL, '2025-07-23 04:35:00', '2025-07-23 04:35:00'),
(76, 64, 30, 5.00, 69.00, 0.00, 'bdt', 345.00, NULL, '2025-07-23 04:41:14', '2025-07-23 04:41:14'),
(77, 65, 30, 2.00, 69.00, 0.00, 'bdt', 138.00, NULL, '2025-07-23 05:39:02', '2025-07-23 05:39:02'),
(78, 66, 30, 2.00, 65.00, 0.00, 'bdt', 130.00, NULL, '2025-07-23 06:45:53', '2025-07-23 06:45:53'),
(79, 67, 30, 3.00, 65.00, 0.00, 'bdt', 195.00, NULL, '2025-07-23 07:26:53', '2025-07-23 07:26:53'),
(80, 68, 30, 2.00, 65.00, 0.00, 'bdt', 130.00, NULL, '2025-07-23 07:34:51', '2025-07-23 07:34:51'),
(82, 69, 30, 6.00, 65.00, 0.00, 'bdt', 390.00, NULL, '2025-07-23 07:36:27', '2025-07-23 07:36:27');

-- --------------------------------------------------------

--
-- Table structure for table `sale_payments`
--

CREATE TABLE `sale_payments` (
  `id` bigint UNSIGNED NOT NULL,
  `sale_id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `interest_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `waive_interest` tinyint(1) NOT NULL DEFAULT '0',
  `received_mode_id` bigint UNSIGNED DEFAULT NULL,
  `account_ledger_id` bigint UNSIGNED DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sale_payments`
--

INSERT INTO `sale_payments` (`id`, `sale_id`, `date`, `amount`, `interest_amount`, `waive_interest`, `received_mode_id`, `account_ledger_id`, `note`, `created_by`, `created_at`, `updated_at`) VALUES
(9, 51, '2025-07-15', 50.00, 0.00, 0, 16, 27, 'Initial payment on invoice creation', 12, '2025-07-15 07:46:13', '2025-07-15 07:46:13'),
(10, 52, '2025-07-15', 10.00, 0.00, 0, 16, 27, 'Initial payment on invoice creation', 12, '2025-07-15 07:55:13', '2025-07-15 07:55:13'),
(11, 52, '2025-07-16', 10.00, 0.00, 0, 16, 27, NULL, 12, '2025-07-16 01:24:31', '2025-07-16 01:24:31'),
(12, 58, '2025-07-16', 1.00, 0.00, 0, 16, 27, 'Initial payment on invoice creation', 12, '2025-07-16 04:57:27', '2025-07-16 04:57:27'),
(13, 16, '2025-07-16', 0.00, 1704.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:27:50', '2025-07-16 05:27:50'),
(14, 17, '2025-07-16', 0.00, 1616.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:27:50', '2025-07-16 05:27:50'),
(15, 28, '2025-07-16', 0.00, 692.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:27:50', '2025-07-16 05:27:50'),
(16, 34, '2025-07-16', 0.00, 560.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:27:50', '2025-07-16 05:27:50'),
(17, 37, '2025-07-16', 0.00, 32.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:27:50', '2025-07-16 05:27:50'),
(18, 51, '2025-07-16', 0.00, 32.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:27:50', '2025-07-16 05:27:50'),
(19, 52, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:27:50', '2025-07-16 05:27:50'),
(20, 53, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:27:50', '2025-07-16 05:27:50'),
(21, 54, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:27:50', '2025-07-16 05:27:50'),
(22, 55, '2025-07-16', 0.00, 32.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:27:50', '2025-07-16 05:27:50'),
(23, 57, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:27:50', '2025-07-16 05:27:50'),
(24, 58, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:27:50', '2025-07-16 05:27:50'),
(25, 16, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:28:11', '2025-07-16 05:28:11'),
(26, 17, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:28:11', '2025-07-16 05:28:11'),
(27, 28, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:28:11', '2025-07-16 05:28:11'),
(28, 34, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:28:11', '2025-07-16 05:28:11'),
(29, 37, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:28:11', '2025-07-16 05:28:11'),
(30, 51, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:28:11', '2025-07-16 05:28:11'),
(31, 52, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:28:11', '2025-07-16 05:28:11'),
(32, 53, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:28:11', '2025-07-16 05:28:11'),
(33, 54, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:28:11', '2025-07-16 05:28:11'),
(34, 55, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:28:11', '2025-07-16 05:28:11'),
(35, 57, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:28:11', '2025-07-16 05:28:11'),
(36, 58, '2025-07-16', 0.00, 10.51, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:28:11', '2025-07-16 05:28:11'),
(37, 16, '2025-07-16', 0.00, 10.81, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:47:22', '2025-07-16 05:47:22'),
(38, 17, '2025-07-16', 0.00, 10.81, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:47:22', '2025-07-16 05:47:22'),
(39, 28, '2025-07-16', 0.00, 10.81, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:47:22', '2025-07-16 05:47:22'),
(40, 34, '2025-07-16', 0.00, 10.81, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:47:22', '2025-07-16 05:47:22'),
(41, 37, '2025-07-16', 0.00, 10.81, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:47:22', '2025-07-16 05:47:22'),
(42, 51, '2025-07-16', 0.00, 10.81, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:47:22', '2025-07-16 05:47:22'),
(43, 52, '2025-07-16', 0.00, 10.81, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:47:22', '2025-07-16 05:47:22'),
(44, 53, '2025-07-16', 0.00, 10.81, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:47:22', '2025-07-16 05:47:22'),
(45, 54, '2025-07-16', 0.00, 10.81, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:47:22', '2025-07-16 05:47:22'),
(46, 55, '2025-07-16', 0.00, 10.81, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:47:22', '2025-07-16 05:47:22'),
(47, 57, '2025-07-16', 0.00, 10.81, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:47:22', '2025-07-16 05:47:22'),
(48, 58, '2025-07-16', 0.00, 10.81, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 05:47:22', '2025-07-16 05:47:22'),
(49, 16, '2025-07-16', 0.00, 11.12, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 06:07:45', '2025-07-16 06:07:45'),
(50, 17, '2025-07-16', 0.00, 11.12, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 06:07:45', '2025-07-16 06:07:45'),
(51, 28, '2025-07-16', 0.00, 11.12, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 06:07:45', '2025-07-16 06:07:45'),
(52, 34, '2025-07-16', 0.00, 11.12, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 06:07:45', '2025-07-16 06:07:45'),
(53, 37, '2025-07-16', 0.00, 11.12, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 06:07:45', '2025-07-16 06:07:45'),
(54, 51, '2025-07-16', 0.00, 11.12, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 06:07:45', '2025-07-16 06:07:45'),
(55, 52, '2025-07-16', 0.00, 11.12, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 06:07:45', '2025-07-16 06:07:45'),
(56, 53, '2025-07-16', 0.00, 11.12, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 06:07:45', '2025-07-16 06:07:45'),
(57, 54, '2025-07-16', 0.00, 11.12, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 06:07:45', '2025-07-16 06:07:45'),
(58, 55, '2025-07-16', 0.00, 11.12, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 06:07:45', '2025-07-16 06:07:45'),
(59, 57, '2025-07-16', 0.00, 11.12, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 06:07:45', '2025-07-16 06:07:45'),
(60, 58, '2025-07-16', 0.00, 11.12, 0, NULL, NULL, 'Daily finance charge', 1, '2025-07-16 06:07:45', '2025-07-16 06:07:45'),
(61, 16, '2025-07-16', 0.00, 11.20, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:13:08', '2025-07-16 06:13:08'),
(62, 17, '2025-07-16', 0.00, 11.20, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:13:08', '2025-07-16 06:13:08'),
(63, 28, '2025-07-16', 0.00, 11.20, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:13:08', '2025-07-16 06:13:08'),
(64, 34, '2025-07-16', 0.00, 11.20, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:13:08', '2025-07-16 06:13:08'),
(65, 37, '2025-07-16', 0.00, 11.20, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:13:08', '2025-07-16 06:13:08'),
(66, 51, '2025-07-16', 0.00, 11.20, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:13:08', '2025-07-16 06:13:08'),
(67, 52, '2025-07-16', 0.00, 11.20, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:13:08', '2025-07-16 06:13:08'),
(68, 53, '2025-07-16', 0.00, 11.20, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:13:08', '2025-07-16 06:13:08'),
(69, 54, '2025-07-16', 0.00, 11.20, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:13:08', '2025-07-16 06:13:08'),
(70, 55, '2025-07-16', 0.00, 11.20, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:13:08', '2025-07-16 06:13:08'),
(71, 57, '2025-07-16', 0.00, 11.20, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:13:08', '2025-07-16 06:13:08'),
(72, 58, '2025-07-16', 0.00, 11.20, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:13:08', '2025-07-16 06:13:08'),
(73, 58, '2025-07-16', 100.00, 0.00, 0, 16, 27, NULL, 12, '2025-07-16 06:14:16', '2025-07-16 06:14:16'),
(74, 16, '2025-07-16', 0.00, 11.22, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:14:41', '2025-07-16 06:14:41'),
(75, 17, '2025-07-16', 0.00, 11.22, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:14:41', '2025-07-16 06:14:41'),
(76, 28, '2025-07-16', 0.00, 11.22, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:14:41', '2025-07-16 06:14:41'),
(77, 34, '2025-07-16', 0.00, 11.22, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:14:41', '2025-07-16 06:14:41'),
(78, 37, '2025-07-16', 0.00, 11.22, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:14:41', '2025-07-16 06:14:41'),
(79, 51, '2025-07-16', 0.00, 11.22, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:14:41', '2025-07-16 06:14:41'),
(80, 52, '2025-07-16', 0.00, 11.22, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:14:41', '2025-07-16 06:14:41'),
(81, 53, '2025-07-16', 0.00, 11.22, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:14:41', '2025-07-16 06:14:41'),
(82, 54, '2025-07-16', 0.00, 11.22, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:14:41', '2025-07-16 06:14:41'),
(83, 55, '2025-07-16', 0.00, 11.22, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:14:41', '2025-07-16 06:14:41'),
(84, 57, '2025-07-16', 0.00, 11.22, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:14:41', '2025-07-16 06:14:41'),
(85, 58, '2025-07-16', 0.00, 11.22, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:14:41', '2025-07-16 06:14:41'),
(86, 58, '2025-07-16', 8.00, 0.00, 0, 16, 27, NULL, 12, '2025-07-16 06:15:49', '2025-07-16 06:15:49'),
(87, 16, '2025-07-16', 0.00, 11.25, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:16:13', '2025-07-16 06:16:13'),
(88, 17, '2025-07-16', 0.00, 11.25, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:16:13', '2025-07-16 06:16:13'),
(89, 28, '2025-07-16', 0.00, 11.25, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:16:13', '2025-07-16 06:16:13'),
(90, 34, '2025-07-16', 0.00, 11.25, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:16:13', '2025-07-16 06:16:13'),
(91, 37, '2025-07-16', 0.00, 11.25, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:16:13', '2025-07-16 06:16:13'),
(92, 51, '2025-07-16', 0.00, 11.25, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:16:13', '2025-07-16 06:16:13'),
(93, 52, '2025-07-16', 0.00, 11.25, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:16:13', '2025-07-16 06:16:13'),
(94, 53, '2025-07-16', 0.00, 11.25, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:16:13', '2025-07-16 06:16:13'),
(95, 54, '2025-07-16', 0.00, 11.25, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:16:13', '2025-07-16 06:16:13'),
(96, 55, '2025-07-16', 0.00, 11.25, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:16:13', '2025-07-16 06:16:13'),
(97, 57, '2025-07-16', 0.00, 11.25, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:16:13', '2025-07-16 06:16:13'),
(98, 58, '2025-07-16', 0.00, 11.25, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-16 06:16:13', '2025-07-16 06:16:13'),
(99, 58, '2025-07-16', 76.62, 0.00, 0, 16, 27, NULL, 12, '2025-07-16 06:43:43', '2025-07-16 06:43:43'),
(100, 16, '2025-07-17', 0.00, 27.65, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 00:09:54', '2025-07-17 00:09:54'),
(101, 17, '2025-07-17', 0.00, 27.65, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 00:09:54', '2025-07-17 00:09:54'),
(102, 28, '2025-07-17', 0.00, 27.65, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 00:09:54', '2025-07-17 00:09:54'),
(103, 34, '2025-07-17', 0.00, 27.65, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 00:09:54', '2025-07-17 00:09:54'),
(104, 37, '2025-07-17', 0.00, 27.65, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 00:09:54', '2025-07-17 00:09:54'),
(105, 51, '2025-07-17', 0.00, 27.65, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 00:09:54', '2025-07-17 00:09:54'),
(106, 52, '2025-07-17', 0.00, 27.65, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 00:09:54', '2025-07-17 00:09:54'),
(107, 53, '2025-07-17', 0.00, 27.65, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 00:09:54', '2025-07-17 00:09:54'),
(108, 54, '2025-07-17', 0.00, 27.65, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 00:09:54', '2025-07-17 00:09:54'),
(109, 55, '2025-07-17', 0.00, 27.65, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 00:09:54', '2025-07-17 00:09:54'),
(110, 57, '2025-07-17', 0.00, 27.65, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 00:09:54', '2025-07-17 00:09:54'),
(111, 59, '2025-07-17', 0.00, 27.65, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 00:09:54', '2025-07-17 00:09:54'),
(112, 16, '2025-07-18', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 18:00:00', '2025-07-17 18:00:00'),
(113, 17, '2025-07-18', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 18:00:00', '2025-07-17 18:00:00'),
(114, 28, '2025-07-18', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 18:00:00', '2025-07-17 18:00:00'),
(115, 34, '2025-07-18', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 18:00:00', '2025-07-17 18:00:00'),
(116, 37, '2025-07-18', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 18:00:00', '2025-07-17 18:00:00'),
(117, 51, '2025-07-18', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 18:00:00', '2025-07-17 18:00:00'),
(118, 52, '2025-07-18', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 18:00:00', '2025-07-17 18:00:00'),
(119, 53, '2025-07-18', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 18:00:00', '2025-07-17 18:00:00'),
(120, 54, '2025-07-18', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 18:00:00', '2025-07-17 18:00:00'),
(121, 55, '2025-07-18', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 18:00:00', '2025-07-17 18:00:00'),
(122, 57, '2025-07-18', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 18:00:00', '2025-07-17 18:00:00'),
(123, 59, '2025-07-18', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 18:00:00', '2025-07-17 18:00:00'),
(124, 60, '2025-07-17', 0.00, 22.00, 0, NULL, NULL, 'Daily finance charge', 12, '2025-07-17 01:07:22', '2025-07-17 01:07:22'),
(125, 60, '2025-07-17', 40.00, 0.00, 0, 16, 27, NULL, 12, '2025-07-17 01:39:02', '2025-07-17 01:39:02'),
(126, 57, '2025-07-17', 20.00, 0.00, 0, 16, 27, 'partial payment', 12, '2025-07-17 05:10:33', '2025-07-17 05:10:33'),
(127, 55, '2025-07-17', 200.00, 0.00, 0, 16, 27, 'partial payment', 12, '2025-07-17 07:12:26', '2025-07-17 07:12:26'),
(128, 61, '2025-07-23', 500.00, 0.00, 0, 16, 27, 'Initial payment on invoice approval', 12, '2025-07-23 04:18:45', '2025-07-23 04:18:45'),
(129, 62, '2025-07-23', 100.00, 0.00, 0, 17, 36, 'Initial payment on invoice approval', 12, '2025-07-23 04:21:26', '2025-07-23 04:21:26'),
(130, 63, '2025-07-23', 650.00, 0.00, 0, 18, 61, 'Initial payment on invoice approval', 15, '2025-07-23 04:35:00', '2025-07-23 04:35:00'),
(131, 64, '2025-07-23', 343.00, 0.00, 0, 18, 61, 'Initial payment on invoice approval', 15, '2025-07-23 04:41:14', '2025-07-23 04:41:14'),
(132, 68, '2025-07-23', 130.00, 0.00, 0, 18, 61, NULL, 15, '2025-07-23 07:35:40', '2025-07-23 07:35:40');

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
('cDj81dtztSw8m9PzvruKyco2E556AaQmjDWQxQ1H', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYUFyT3FMZ3Z1OU1ZWmpnNFdEMXZBd3FCclBCRm9RdTdaTFhERDFKTSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1753277811),
('fgjbrNbnFBmek3daB5tytcRw8ehbSb7SepnR5UVi', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZ2RDcE96QnF5Sk5aM2ZvSFlyQ0tvalVkNms0aWZvNXBNV1BRdWxMQyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1753277811),
('g09WEhGpAtevYE5TVmHQsGUIh5ZmdNtfO6rSy3Kq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUXhTQzNHVGk2SXVCMGFVWlRna3pjRGVGaWF5WWRIb20zSmt2YlFtZCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1753277819),
('kJ6yh9KNyu2eG4aLZcDEwFahdm3xlvpwdgTjdSAe', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieFNOSUNsWkliS1A1NlBTTGh0Q0xkNGtla2t2d05jaWp3SGJCWjFSaiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1753277547),
('LxcvnzRi6uDlpuSTfU2OfHaTTfU8VDOgN5ikdaKK', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQ2tTQktyY0VYSjBCWEpzaFo3SzZxZVNpNWplUWcyUTV0ejhTQTBFayI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1753277826),
('Ry5575ibS8Vb5x7ZLGV4EIx8PmXcBQ1F1VyAA4zU', 15, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiZGMzeEt0ZUdPbmNtWW85VWc3MUQ0Q200ZUZpQ3JaM3V4YUhBR2J3YyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjg6Imh0dHA6Ly9hY2NvdW50aW5nLnRlc3QvdXNlcnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxNTt9', 1753279386),
('vqIhrjd7L3llRmISe8dwrN8v0yXNa871oi0Mb8id', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiazFFbTkyWVRBYUdGUGt0ckdZUVdRYVFlNUxmUGdsVEFGNmdTZ3d3ZSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1753277818),
('W7yWckCkkDA0vL1xJHq1U72L0NS68RZ5nJNLBh58', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidnNESFFGTkpQTFhQbHJXOTVQZ2V6MDQzbnJ1dEN5VHd6Y3pNaG5mRCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1753277547),
('ymjzxZW8vCv4TkfHhJv2KeOh60rV84QPtHacyQjl', 16, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiMGZKY0V4bU1SSGhsb1hSR00yVFFVajFGSUJJcFpwa3dBRGc4VmdBMCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjI4OiJodHRwOi8vYWNjb3VudGluZy50ZXN0L3NhbGVzIjt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTY7fQ==', 1753279407);

-- --------------------------------------------------------

--
-- Table structure for table `shifts`
--

CREATE TABLE `shifts` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shifts`
--

INSERT INTO `shifts` (`id`, `name`, `start_time`, `end_time`, `description`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Shift-1', '08:00:00', '14:00:00', NULL, 2, '2025-04-09 04:26:34', '2025-04-09 04:26:34', NULL),
(2, 'Regular', '09:00:00', '17:00:00', NULL, 6, '2025-04-10 00:46:11', '2025-04-10 00:46:11', NULL),
(3, 'Regular', '11:00:00', '20:00:00', NULL, 10, '2025-04-13 03:04:03', '2025-04-13 03:04:03', NULL),
(5, 'Regular', '10:00:00', '18:00:00', NULL, 12, '2025-06-16 03:14:30', '2025-06-16 03:14:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `id` bigint UNSIGNED NOT NULL,
  `godown_id` bigint UNSIGNED NOT NULL,
  `item_id` bigint UNSIGNED NOT NULL,
  `qty` decimal(14,2) NOT NULL DEFAULT '0.00',
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `avg_cost` decimal(15,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`id`, `godown_id`, `item_id`, `qty`, `created_by`, `created_at`, `updated_at`, `avg_cost`) VALUES
(1, 6, 19, 22.00, 10, '2025-04-15 04:07:33', '2025-04-16 06:10:37', 0.00),
(2, 7, 19, 16.00, 10, '2025-04-15 06:01:23', '2025-04-15 06:31:07', 0.00),
(3, 11, 21, 2.00, 12, '2025-04-16 23:44:46', '2025-04-19 00:58:11', 0.00),
(4, 11, 23, 0.00, 12, '2025-04-16 23:56:14', '2025-04-17 05:20:05', 0.00),
(5, 10, 24, 2.00, 12, '2025-04-17 00:14:06', '2025-07-15 01:04:20', 0.00),
(6, 10, 25, 11.00, 12, '2025-04-21 02:06:12', '2025-07-16 04:19:08', 0.00),
(7, 4, 26, 0.00, 1, '2025-04-21 23:58:46', '2025-04-21 23:58:46', 0.00),
(8, 12, 26, 5.00, 1, '2025-04-22 00:00:52', '2025-04-22 00:10:34', 0.00),
(9, 11, 24, 5.00, 12, '2025-04-26 00:04:47', '2025-04-26 00:04:47', 0.00),
(10, 10, 27, 15.00, 12, '2025-05-04 04:48:20', '2025-07-23 04:21:26', 40.00),
(11, 10, 28, 0.00, 12, '2025-06-15 06:36:37', '2025-06-15 06:36:37', 0.00),
(12, 10, 21, -1.00, 12, '2025-06-21 01:38:40', '2025-06-21 01:55:35', 0.00),
(13, 10, 29, 0.00, 12, '2025-07-07 06:19:01', '2025-07-07 06:19:01', 0.00),
(14, 14, 30, 27.00, 15, '2025-07-23 04:27:33', '2025-07-23 07:45:05', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `stock_transfers`
--

CREATE TABLE `stock_transfers` (
  `id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `voucher_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_godown_id` bigint UNSIGNED NOT NULL,
  `to_godown_id` bigint UNSIGNED NOT NULL,
  `total_quantity` decimal(15,2) NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock_transfers`
--

INSERT INTO `stock_transfers` (`id`, `date`, `voucher_no`, `reference_no`, `from_godown_id`, `to_godown_id`, `total_quantity`, `total_amount`, `note`, `created_at`, `updated_at`, `created_by`) VALUES
(1, '2025-04-07', 'ST-1744019009279', 'REF-009279', 1, 2, 2.00, 39.94, NULL, '2025-04-07 03:44:26', '2025-04-07 03:44:26', 0),
(2, '2025-04-07', 'ST-1744019618499', 'REF-618499', 1, 1, 2.00, 1.98, NULL, '2025-04-07 03:53:50', '2025-04-07 03:53:50', NULL),
(3, '2025-04-07', 'ST-1744022397002', 'REF-397002', 1, 2, 5.00, 5.00, NULL, '2025-04-07 04:40:24', '2025-04-07 04:40:24', NULL),
(7, '2025-04-07', 'ST-1744028275472', 'REF-275472', 1, 4, 50.00, 249.00, NULL, '2025-04-07 06:18:13', '2025-04-07 06:18:13', 1),
(8, '2025-04-07', 'ST-1744029248216', 'REF-248216', 1, 4, 54.00, 54.00, NULL, '2025-04-07 06:34:18', '2025-04-07 06:34:18', 1),
(9, '2025-04-07', 'ST-1744029891679', 'REF-891679', 1, 4, 5.00, 100.00, NULL, '2025-04-07 06:45:05', '2025-04-07 06:45:05', 1),
(10, '2025-04-07', 'ST-1744030477957', 'REF-477957', 1, 4, 2.00, 20.00, NULL, '2025-04-07 06:55:13', '2025-04-07 06:55:13', 1),
(11, '2025-04-07', 'ST-1744030571863', 'REF-571863', 4, 1, 5.00, 24.90, NULL, '2025-04-07 06:56:35', '2025-04-07 06:56:35', 1),
(12, '2025-04-07', 'ST-1744030622728', 'REF-622728', 1, 4, 20.00, 20.00, NULL, '2025-04-07 06:57:28', '2025-04-07 06:57:28', 1),
(13, '2025-04-07', 'ST-1744032306997', 'REF-306997', 1, 4, 5.00, 50.00, NULL, '2025-04-07 07:25:51', '2025-04-07 07:25:51', 1),
(14, '2025-04-07', 'ST-1744032386446', 'REF-386446', 4, 1, 2.00, 20.00, NULL, '2025-04-07 07:26:59', '2025-04-07 07:26:59', 1),
(15, '2025-04-07', 'ST-1744032986373', 'REF-986373', 1, 4, 11.00, 55.00, NULL, '2025-04-07 07:36:58', '2025-04-07 23:48:22', 1),
(16, '2025-04-07', 'ST-1744033219306', 'REF-219306', 3, 5, 6.00, 29.94, NULL, '2025-04-07 07:40:50', '2025-04-07 07:40:50', 2),
(17, '2025-04-15', 'ST-20250415-0017', NULL, 6, 7, 11.00, 55.00, NULL, '2025-04-15 06:01:23', '2025-04-15 06:31:07', 10),
(18, '2025-04-15', 'ST-20250415-0018', NULL, 6, 7, 5.00, 50.00, NULL, '2025-04-15 06:18:47', '2025-04-15 06:18:47', 10),
(19, '2025-04-26', 'ST-20250426-0019', NULL, 10, 11, 5.00, 50.00, NULL, '2025-04-26 00:04:47', '2025-04-26 00:04:47', 12);

-- --------------------------------------------------------

--
-- Table structure for table `stock_transfer_items`
--

CREATE TABLE `stock_transfer_items` (
  `id` bigint UNSIGNED NOT NULL,
  `stock_transfer_id` bigint UNSIGNED NOT NULL,
  `item_id` bigint UNSIGNED NOT NULL,
  `quantity` decimal(15,2) NOT NULL,
  `rate` decimal(15,2) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock_transfer_items`
--

INSERT INTO `stock_transfer_items` (`id`, `stock_transfer_id`, `item_id`, `quantity`, `rate`, `amount`, `created_at`, `updated_at`) VALUES
(1, 1, 7, 2.00, 19.97, 39.94, '2025-04-07 03:44:26', '2025-04-07 03:44:26'),
(2, 2, 1, 2.00, 0.99, 1.98, '2025-04-07 03:53:50', '2025-04-07 03:53:50'),
(3, 3, 7, 5.00, 1.00, 5.00, '2025-04-07 04:40:24', '2025-04-07 04:40:24'),
(7, 7, 6, 50.00, 4.98, 249.00, '2025-04-07 06:18:13', '2025-04-07 06:18:13'),
(8, 8, 6, 54.00, 1.00, 54.00, '2025-04-07 06:34:18', '2025-04-07 06:34:18'),
(9, 9, 6, 5.00, 20.00, 100.00, '2025-04-07 06:45:05', '2025-04-07 06:45:05'),
(10, 10, 1, 2.00, 10.00, 20.00, '2025-04-07 06:55:13', '2025-04-07 06:55:13'),
(11, 11, 4, 5.00, 4.98, 24.90, '2025-04-07 06:56:35', '2025-04-07 06:56:35'),
(12, 12, 4, 20.00, 1.00, 20.00, '2025-04-07 06:57:28', '2025-04-07 06:57:28'),
(13, 13, 6, 5.00, 10.00, 50.00, '2025-04-07 07:25:51', '2025-04-07 07:25:51'),
(14, 14, 12, 2.00, 10.00, 20.00, '2025-04-07 07:26:59', '2025-04-07 07:26:59'),
(16, 16, 17, 6.00, 4.99, 29.94, '2025-04-07 07:40:50', '2025-04-07 07:40:50'),
(18, 15, 4, 11.00, 5.00, 55.00, '2025-04-07 23:48:22', '2025-04-07 23:48:22'),
(20, 18, 19, 5.00, 10.00, 50.00, '2025-04-15 06:18:47', '2025-04-15 06:18:47'),
(21, 17, 19, 11.00, 5.00, 55.00, '2025-04-15 06:31:07', '2025-04-15 06:31:07'),
(22, 19, 24, 5.00, 10.00, 50.00, '2025-04-26 00:04:47', '2025-04-26 00:04:47');

-- --------------------------------------------------------

--
-- Table structure for table `system_ledgers`
--

CREATE TABLE `system_ledgers` (
  `id` bigint UNSIGNED NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_ledger_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(13, 'Ltr', 1, NULL, '2025-03-20 02:17:49', '2025-03-20 02:17:49'),
(14, 'KG', 12, NULL, '2025-05-05 07:43:55', '2025-05-05 07:43:55'),
(15, 'Bag', 12, NULL, '2025-05-05 07:44:01', '2025-05-05 07:44:01'),
(16, 'Piece', 12, NULL, '2025-06-14 00:30:14', '2025-06-14 00:30:14'),
(17, 'Litre', 12, NULL, '2025-06-14 00:30:18', '2025-06-14 00:30:18'),
(18, 'Bosta', 15, NULL, '2025-07-23 04:26:25', '2025-07-23 04:26:25');

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
(1, 'Admin', 'admin@gmail.com', NULL, '$2y$12$SyE1mtYKTkjU/FyjVKKyHeFa2Tm91oNttBMZdmTaTrMh9WoZneV2y', 'dmRjytmc0wZQg2qnBHsFdkwG2ySahthF3Tx70TCZuIPNp2kwEfk3X617I3ta', '2025-03-16 02:40:21', '2025-03-17 21:35:03', NULL, NULL, 'active', NULL, NULL),
(2, 'Elham Auto', 'elhamauto@gmail.com', NULL, '$2y$12$lZqY8lKe/c/fAQvp.K0gV.FWzvQLydDtd56qJwUg7LBTsSxHZRI3e', 'ZJQTMv5p0zSCYCg4vGCYMR21nbH8CkJFHCbNXblIPJJcbfJvMmu0kFtxuDm9', '2025-03-16 21:57:54', '2025-03-17 00:31:39', NULL, NULL, 'active', NULL, NULL),
(3, 'Tawhid', 'fmtawhid@gmail.com', NULL, '$2y$12$Wnvf71QCbbgS0S9OtiiCpusMyst4naLlIEMJIo2rjSIxNrYddWMFu', '977THygaKM4w2K1hDmbTzF1PwuBrOdipeQodHRacJqTdckjzZcXmnvwcET8d', '2025-03-16 23:17:28', '2025-03-18 04:26:19', NULL, NULL, 'active', NULL, NULL),
(4, 'Elham Auto Sister Concern', 'elhamautosister@gmail.com', NULL, '$2y$12$dGVxfzWZpdnf9vdchGf9zupPH/yKqD.jfsDAQmiyfaxO9ExyNF6Bq', NULL, '2025-03-17 01:07:59', '2025-03-17 01:07:59', NULL, NULL, 'active', NULL, NULL),
(5, 'elham auto child', 'elhamautochild@gmail.com', NULL, '$2y$12$ndnb/xpr39EPNhyvmzXSNeoc26gX/m2Z4MgbxuqhsDheyOEFR2I7y', NULL, '2025-03-17 01:11:01', '2025-03-17 01:55:59', NULL, NULL, 'inactive', NULL, 2),
(6, 'Arnob And Alvi Enterprise', 'arnob@gmail.com', NULL, '$2y$12$Lsdid/CMzhDCzBc.Cr1b2ulbzdLC12ZUfMmqyE.of4kT0Nz/TX6tG', 'X4Gz4R6oNqRlqYdT7Qh5FOkQd1NHmhKLATNS1sneZ1kp0eJrHtOWXcH0D92Z', '2025-03-17 21:17:48', '2025-03-17 21:17:48', NULL, NULL, 'active', NULL, 1),
(7, 'Arnob Sister Concern', 'arnobsister@gmail.com', NULL, '$2y$12$PLM5xK8wL4NRlH3JsFnShuCbA83Vg00EB0noULazTC7BE4OLXq.Ea', NULL, '2025-03-17 21:19:54', '2025-03-17 21:19:54', NULL, NULL, 'active', NULL, 6),
(8, 'Test User', 'test@example.com', '2025-03-18 00:19:48', '$2y$12$kdcVJLeFJ0EhgnY9.ESavuo0Ph1xgQO9Zt0Hl0r4GEwfucpQefXDu', 'E08BuNMh8m', '2025-03-18 00:19:48', '2025-04-16 06:18:31', NULL, NULL, 'active', '2025-04-16 06:18:31', NULL),
(9, 'New Test User', 'user@gmail.com', NULL, '$2y$12$Z7wB9OZn1cG4q9dfDlgHdOHkngJVE9mtxix3.JqyymXBVZS6K6EQS', NULL, '2025-03-19 00:14:20', '2025-03-19 00:14:20', NULL, NULL, 'active', NULL, 1),
(10, 'Demo Company', 'demo@gmail.com', NULL, '$2y$12$4FeSX7XuIbNphIw8FVLrs.ByU7B4XvlN.s/AjTKlCNmBsB4IZrVNW', 'MPraL4vEladhxTw9MiQl6dhCqoGMNkYVS2hOkxYd3YKfqyFz6G7glCTkek7T', '2025-04-13 03:00:32', '2025-04-13 03:00:32', NULL, NULL, 'active', NULL, NULL),
(11, 'rafu', 'rafu@gmail.com', NULL, '$2y$12$shRl.sO9Dht6zbShSd5Jc.1cj10aHjNPkY7qQ8w5ZJGYqHL9L7Xt2', NULL, '2025-04-16 06:17:26', '2025-04-16 07:29:26', NULL, NULL, 'active', '2025-04-16 07:29:26', NULL),
(12, 'rafu1', 'rafu1@gmail.com', NULL, '$2y$12$JN2L4wzS9URvoWD1Y2CiG.RojdtT82ock1cJy08OjXwlFmJuWqfHC', 'vDi4Spxi1chksSqzXxOIzi6tkJNyJUPvVGInvvjQ9nQLmbBC9oMXGrlO6Jqv', '2025-04-16 07:30:11', '2025-04-16 07:30:11', NULL, NULL, 'active', NULL, 1),
(13, 'rafu2', 'rafu2@gmail.com', NULL, '$2y$12$M/rQl33pdE3oJz/Z9UMJnevveRqEK8oWZJSjHTh.fNg63kBMS.4ay', '23XOj7gLgD4GYP50reJ0f1IE6mnYZI3yV4UlFySnSsYHkrwBmYCEzrjuJM08', '2025-07-09 01:36:00', '2025-07-09 01:36:00', NULL, NULL, 'active', NULL, 12),
(14, 'Fuad', 'fuad@gmail.com', NULL, '$2y$12$1QlAPlua6ZkscZiltEiaKOaHcnFG07aQqKRQQVuXUjai0kplP/xly', NULL, '2025-07-21 06:55:59', '2025-07-21 06:55:59', NULL, NULL, 'active', NULL, 1),
(15, 'jim', 'jim@example.com', NULL, '$2y$12$7i7IsyHSNkrQxzFfjnJRE.5MWq7eaui7Bv4kstEMOLNNyXOSnl2.C', NULL, '2025-07-23 04:22:51', '2025-07-23 04:22:51', NULL, NULL, 'active', NULL, 1),
(16, 'Jim2', 'jim2@gmail.com', NULL, '$2y$12$WuGCr0ipJLKKfn/h2wR3O.VpZOXBSF.vvfxF0eZSuG5FvpN4MrCAq', NULL, '2025-07-23 05:42:28', '2025-07-23 05:42:28', NULL, NULL, 'active', NULL, 15),
(17, 'jim3', 'jim3@example.com', NULL, '$2y$12$Iw6cJe5MHBevnFwDMVK3K.H6wB3iXxdG5hJ7Q76zNq93P67tGwaSy', NULL, '2025-07-23 07:31:37', '2025-07-23 07:31:37', NULL, NULL, 'active', NULL, 15);

-- --------------------------------------------------------

--
-- Table structure for table `working_orders`
--

CREATE TABLE `working_orders` (
  `id` bigint UNSIGNED NOT NULL,
  `tenant_id` bigint UNSIGNED DEFAULT NULL,
  `date` date NOT NULL,
  `voucher_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `production_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_started',
  `production_voucher_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `working_orders`
--

INSERT INTO `working_orders` (`id`, `tenant_id`, `date`, `voucher_no`, `reference_no`, `total_amount`, `production_status`, `production_voucher_no`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, '2025-04-08', 'WO-0001', '1', 60.00, 'completed', 'Pro-0001', 2, '2025-04-08 05:12:33', '2025-04-09 01:34:18', NULL),
(2, NULL, '2025-04-08', 'WO-0002', '2', 120.00, 'not_started', NULL, 2, '2025-04-08 05:13:52', '2025-04-08 05:13:52', NULL),
(3, NULL, '2025-04-08', 'WO-0003', NULL, 150.00, 'completed', NULL, 2, '2025-04-08 05:44:36', '2025-04-09 01:30:28', NULL),
(4, NULL, '2025-04-08', 'WO-0004', NULL, 21.00, 'not_started', NULL, 2, '2025-04-08 05:45:41', '2025-04-08 07:53:04', NULL),
(5, NULL, '2025-04-26', 'WO-0001', NULL, 131.00, 'not_started', NULL, 12, '2025-04-26 03:03:19', '2025-04-26 03:03:19', NULL),
(6, 12, '2025-04-26', 'WO-0002', NULL, 141.00, 'not_started', NULL, 12, '2025-04-26 03:04:46', '2025-04-26 03:04:47', NULL),
(7, 12, '2025-04-27', 'WO-0003', NULL, 470.00, 'not_started', NULL, 12, '2025-04-27 07:32:59', '2025-04-27 07:32:59', NULL),
(8, 12, '2025-04-27', 'WO-0004', NULL, 40.00, 'completed', 'Pro-0001', 12, '2025-04-27 07:33:20', '2025-04-27 08:00:57', NULL),
(9, 12, '2025-05-04', 'WO-0005', NULL, 2000.00, 'completed', 'Pro-0002', 12, '2025-05-04 04:49:05', '2025-05-04 04:49:51', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `working_order_extras`
--

CREATE TABLE `working_order_extras` (
  `id` bigint UNSIGNED NOT NULL,
  `working_order_id` bigint UNSIGNED DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` decimal(15,2) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `total` decimal(15,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `working_order_extras`
--

INSERT INTO `working_order_extras` (`id`, `working_order_id`, `title`, `quantity`, `price`, `total`, `created_at`, `updated_at`) VALUES
(1, 3, 'Eita Title', 2.00, 50.00, 100.00, '2025-04-08 05:44:36', '2025-04-08 05:44:36'),
(3, 4, 'Coffee Name Espresso Delita', 1.00, 11.00, 11.00, '2025-04-08 07:53:04', '2025-04-08 07:53:04'),
(4, 5, 'Expresso', 21.00, 1.00, 21.00, '2025-04-26 03:03:19', '2025-04-26 03:03:19'),
(5, 6, 'abcd', 21.00, 1.00, 21.00, '2025-04-26 03:04:46', '2025-04-26 03:04:46'),
(6, 7, 'Expresso', 21.00, 20.00, 420.00, '2025-04-27 07:32:59', '2025-04-27 07:32:59'),
(7, 8, NULL, NULL, NULL, 0.00, '2025-04-27 07:33:20', '2025-04-27 07:33:20'),
(8, 9, NULL, NULL, NULL, 0.00, '2025-05-04 04:49:05', '2025-05-04 04:49:05');

-- --------------------------------------------------------

--
-- Table structure for table `working_order_items`
--

CREATE TABLE `working_order_items` (
  `id` bigint UNSIGNED NOT NULL,
  `working_order_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `godown_id` bigint UNSIGNED NOT NULL,
  `quantity` decimal(15,2) NOT NULL,
  `purchase_price` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `working_order_items`
--

INSERT INTO `working_order_items` (`id`, `working_order_id`, `product_id`, `godown_id`, `quantity`, `purchase_price`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 3, 2.00, 5.00, 10.00, '2025-04-08 05:12:33', '2025-04-08 05:12:33'),
(2, 1, 17, 3, 5.00, 10.00, 50.00, '2025-04-08 05:12:33', '2025-04-08 05:12:33'),
(3, 2, 2, 3, 2.00, 10.00, 20.00, '2025-04-08 05:13:52', '2025-04-08 05:13:52'),
(4, 2, 17, 5, 5.00, 20.00, 100.00, '2025-04-08 05:13:52', '2025-04-08 05:13:52'),
(5, 3, 2, 3, 1.00, 50.00, 50.00, '2025-04-08 05:44:36', '2025-04-08 05:44:36'),
(7, 4, 2, 3, 1.00, 10.00, 10.00, '2025-04-08 07:53:04', '2025-04-08 07:53:04'),
(8, 5, 21, 10, 11.00, 10.00, 110.00, '2025-04-26 03:03:19', '2025-04-26 03:03:19'),
(9, 6, 21, 10, 12.00, 10.00, 120.00, '2025-04-26 03:04:46', '2025-04-26 03:04:46'),
(10, 7, 23, 10, 10.00, 5.00, 50.00, '2025-04-27 07:32:59', '2025-04-27 07:32:59'),
(11, 8, 21, 10, 20.00, 2.00, 40.00, '2025-04-27 07:33:20', '2025-04-27 07:33:20'),
(12, 9, 27, 10, 50.00, 40.00, 2000.00, '2025-05-04 04:49:05', '2025-05-04 04:49:05');

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
  ADD KEY `account_ledgers_group_under_id_foreign` (`group_under_id`),
  ADD KEY `account_ledgers_employee_id_foreign` (`employee_id`);

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
-- Indexes for table `contra_adds`
--
ALTER TABLE `contra_adds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contra_adds_created_by_foreign` (`created_by`),
  ADD KEY `contra_adds_voucher_no_index` (`voucher_no`),
  ADD KEY `contra_adds_mode_from_id_foreign` (`mode_from_id`),
  ADD KEY `contra_adds_mode_to_id_foreign` (`mode_to_id`);

--
-- Indexes for table `contra_add_details`
--
ALTER TABLE `contra_add_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contra_add_details_contra_add_id_foreign` (`contra_add_id`),
  ADD KEY `contra_add_details_account_ledger_id_foreign` (`account_ledger_id`);

--
-- Indexes for table `conversion_lines`
--
ALTER TABLE `conversion_lines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversion_lines_voucher_id_foreign` (`voucher_id`),
  ADD KEY `conversion_lines_party_item_id_foreign` (`party_item_id`);

--
-- Indexes for table `conversion_vouchers`
--
ALTER TABLE `conversion_vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conversion_vouchers_ref_no_unique` (`ref_no`),
  ADD KEY `conversion_vouchers_party_ledger_id_foreign` (`party_ledger_id`),
  ADD KEY `conversion_vouchers_godown_id_foreign` (`godown_id`),
  ADD KEY `conversion_vouchers_created_by_foreign` (`created_by`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `departments_created_by_foreign` (`created_by`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `designations_created_by_foreign` (`created_by`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_email_unique` (`email`),
  ADD UNIQUE KEY `employees_nid_unique` (`nid`),
  ADD KEY `employees_reference_by_foreign` (`reference_by`),
  ADD KEY `employees_department_id_foreign` (`department_id`),
  ADD KEY `employees_designation_id_foreign` (`designation_id`),
  ADD KEY `employees_shift_id_foreign` (`shift_id`),
  ADD KEY `employees_created_by_foreign` (`created_by`),
  ADD KEY `employees_salary_structure_id_foreign` (`salary_structure_id`);

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
-- Indexes for table `finished_products`
--
ALTER TABLE `finished_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `finished_products_production_voucher_no_created_by_unique` (`production_voucher_no`,`created_by`),
  ADD KEY `finished_products_working_order_id_foreign` (`working_order_id`),
  ADD KEY `finished_products_created_by_foreign` (`created_by`);

--
-- Indexes for table `finished_product_items`
--
ALTER TABLE `finished_product_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `finished_product_items_finished_product_id_foreign` (`finished_product_id`),
  ADD KEY `finished_product_items_product_id_foreign` (`product_id`),
  ADD KEY `finished_product_items_godown_id_foreign` (`godown_id`);

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
  ADD KEY `items_category_id_foreign` (`category_id`),
  ADD KEY `items_unit_id_foreign` (`unit_id`),
  ADD KEY `items_godown_id_foreign` (`godown_id`);

--
-- Indexes for table `item_stocks`
--
ALTER TABLE `item_stocks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_stocks_item_id_godown_id_unique` (`item_id`,`godown_id`),
  ADD KEY `item_stocks_godown_id_foreign` (`godown_id`);

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
-- Indexes for table `journals`
--
ALTER TABLE `journals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `journals_voucher_no_unique` (`voucher_no`),
  ADD KEY `journals_voucher_type_index` (`voucher_type`);

--
-- Indexes for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `journal_entries_journal_id_foreign` (`journal_id`),
  ADD KEY `journal_entries_account_ledger_id_foreign` (`account_ledger_id`);

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
-- Indexes for table `party_items`
--
ALTER TABLE `party_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `party_items_party_ledger_id_item_name_unique` (`party_ledger_id`,`item_name`),
  ADD KEY `party_items_unit_id_foreign` (`unit_id`),
  ADD KEY `party_items_created_by_foreign` (`created_by`);

--
-- Indexes for table `party_job_stocks`
--
ALTER TABLE `party_job_stocks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_party_stock` (`party_ledger_id`,`item_id`,`godown_id`),
  ADD KEY `party_job_stocks_party_item_id_foreign` (`party_item_id`);

--
-- Indexes for table `party_stock_moves`
--
ALTER TABLE `party_stock_moves`
  ADD PRIMARY KEY (`id`);

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
  ADD KEY `payment_adds_voucher_no_index` (`voucher_no`),
  ADD KEY `payment_adds_payment_mode_id_foreign` (`payment_mode_id`);

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
  ADD KEY `purchases_account_ledger_id_foreign` (`account_ledger_id`),
  ADD KEY `purchases_journal_id_foreign` (`journal_id`),
  ADD KEY `purchases_received_mode_id_foreign` (`received_mode_id`),
  ADD KEY `purchases_inventory_ledger_id_foreign` (`inventory_ledger_id`);

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
  ADD KEY `purchase_returns_account_ledger_id_foreign` (`account_ledger_id`),
  ADD KEY `purchase_returns_journal_id_foreign` (`journal_id`);

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
  ADD KEY `received_adds_account_ledger_id_foreign` (`account_ledger_id`),
  ADD KEY `received_adds_created_by_foreign` (`created_by`);

--
-- Indexes for table `received_modes`
--
ALTER TABLE `received_modes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `received_modes_ledger_id_foreign` (`ledger_id`),
  ADD KEY `received_modes_created_by_foreign` (`created_by`),
  ADD KEY `received_modes_purchase_return_id_foreign` (`purchase_return_id`),
  ADD KEY `received_modes_sale_id_foreign` (`sale_id`);

--
-- Indexes for table `rent_vouchers`
--
ALTER TABLE `rent_vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rent_vouchers_vch_no_unique` (`vch_no`),
  ADD KEY `rent_vouchers_party_ledger_id_foreign` (`party_ledger_id`),
  ADD KEY `rent_vouchers_created_by_foreign` (`created_by`),
  ADD KEY `rent_vouchers_received_mode_id_foreign` (`received_mode_id`);

--
-- Indexes for table `rent_voucher_lines`
--
ALTER TABLE `rent_voucher_lines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rent_voucher_lines_voucher_id_foreign` (`voucher_id`),
  ADD KEY `rent_voucher_lines_party_item_id_foreign` (`party_item_id`);

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
-- Indexes for table `salary_receives`
--
ALTER TABLE `salary_receives`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `salary_receives_vch_no_unique` (`vch_no`),
  ADD KEY `salary_receives_employee_id_foreign` (`employee_id`),
  ADD KEY `salary_receives_received_by_foreign` (`received_by`),
  ADD KEY `salary_receives_salary_slip_employee_id_foreign` (`salary_slip_employee_id`),
  ADD KEY `salary_receives_journal_id_foreign` (`journal_id`),
  ADD KEY `salary_receives_created_by_foreign` (`created_by`);

--
-- Indexes for table `salary_slips`
--
ALTER TABLE `salary_slips`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `salary_slips_voucher_number_unique` (`voucher_number`),
  ADD KEY `salary_slips_created_by_foreign` (`created_by`);

--
-- Indexes for table `salary_slip_employees`
--
ALTER TABLE `salary_slip_employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `salary_slip_employees_salary_slip_id_foreign` (`salary_slip_id`),
  ADD KEY `salary_slip_employees_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `salary_structures`
--
ALTER TABLE `salary_structures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sales_voucher_no_unique` (`voucher_no`),
  ADD KEY `sales_godown_id_foreign` (`godown_id`),
  ADD KEY `sales_salesman_id_foreign` (`salesman_id`),
  ADD KEY `sales_account_ledger_id_foreign` (`account_ledger_id`),
  ADD KEY `sales_other_expense_ledger_id_foreign` (`other_expense_ledger_id`),
  ADD KEY `sales_journal_id_foreign` (`journal_id`),
  ADD KEY `sales_received_mode_id_foreign` (`received_mode_id`),
  ADD KEY `sales_cogs_ledger_id_foreign` (`cogs_ledger_id`),
  ADD KEY `sales_sub_responsible_id_foreign` (`sub_responsible_id`),
  ADD KEY `sales_responsible_id_foreign` (`responsible_id`),
  ADD KEY `sales_approved_at_index` (`approved_at`),
  ADD KEY `sales_rejected_by_foreign` (`rejected_by`);

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
  ADD KEY `sales_orders_salesman_id_foreign` (`salesman_id`),
  ADD KEY `sales_orders_created_by_foreign` (`created_by`);

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
  ADD KEY `sales_returns_salesman_id_foreign` (`salesman_id`),
  ADD KEY `sales_returns_cogs_ledger_id_foreign` (`cogs_ledger_id`),
  ADD KEY `sales_returns_received_mode_id_foreign` (`received_mode_id`);

--
-- Indexes for table `sales_return_items`
--
ALTER TABLE `sales_return_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_return_items_sales_return_id_foreign` (`sales_return_id`),
  ADD KEY `sales_return_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `sale_approvals`
--
ALTER TABLE `sale_approvals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_approvals_sale_id_foreign` (`sale_id`),
  ADD KEY `sale_approvals_user_id_foreign` (`user_id`),
  ADD KEY `sale_approvals_created_by_foreign` (`created_by`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_items_sale_id_foreign` (`sale_id`),
  ADD KEY `sale_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `sale_payments`
--
ALTER TABLE `sale_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_payments_sale_id_foreign` (`sale_id`),
  ADD KEY `sale_payments_created_by_foreign` (`created_by`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shifts_created_by_foreign` (`created_by`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stocks_godown_id_foreign` (`godown_id`),
  ADD KEY `stocks_item_id_foreign` (`item_id`),
  ADD KEY `stocks_created_by_foreign` (`created_by`);

--
-- Indexes for table `stock_transfers`
--
ALTER TABLE `stock_transfers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stock_transfers_voucher_no_unique` (`voucher_no`),
  ADD KEY `stock_transfers_from_godown_id_foreign` (`from_godown_id`),
  ADD KEY `stock_transfers_to_godown_id_foreign` (`to_godown_id`);

--
-- Indexes for table `stock_transfer_items`
--
ALTER TABLE `stock_transfer_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stock_transfer_items_stock_transfer_id_foreign` (`stock_transfer_id`),
  ADD KEY `stock_transfer_items_item_id_foreign` (`item_id`);

--
-- Indexes for table `system_ledgers`
--
ALTER TABLE `system_ledgers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `system_ledgers_key_unique` (`key`),
  ADD KEY `system_ledgers_account_ledger_id_foreign` (`account_ledger_id`);

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
-- Indexes for table `working_orders`
--
ALTER TABLE `working_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `working_orders_created_by_voucher_no_unique` (`created_by`,`voucher_no`),
  ADD KEY `working_orders_date_index` (`date`);

--
-- Indexes for table `working_order_extras`
--
ALTER TABLE `working_order_extras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `working_order_extras_working_order_id_foreign` (`working_order_id`);

--
-- Indexes for table `working_order_items`
--
ALTER TABLE `working_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `working_order_items_working_order_id_foreign` (`working_order_id`),
  ADD KEY `working_order_items_product_id_foreign` (`product_id`),
  ADD KEY `working_order_items_godown_id_foreign` (`godown_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_groups`
--
ALTER TABLE `account_groups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `account_ledgers`
--
ALTER TABLE `account_ledgers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `company_settings`
--
ALTER TABLE `company_settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contra_adds`
--
ALTER TABLE `contra_adds`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `contra_add_details`
--
ALTER TABLE `contra_add_details`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversion_lines`
--
ALTER TABLE `conversion_lines`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversion_vouchers`
--
ALTER TABLE `conversion_vouchers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `financial_years`
--
ALTER TABLE `financial_years`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `finished_products`
--
ALTER TABLE `finished_products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `finished_product_items`
--
ALTER TABLE `finished_product_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `godowns`
--
ALTER TABLE `godowns`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `group_unders`
--
ALTER TABLE `group_unders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `item_stocks`
--
ALTER TABLE `item_stocks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `journals`
--
ALTER TABLE `journals`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=159;

--
-- AUTO_INCREMENT for table `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=472;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT for table `natures`
--
ALTER TABLE `natures`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `party_items`
--
ALTER TABLE `party_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `party_job_stocks`
--
ALTER TABLE `party_job_stocks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `party_stock_moves`
--
ALTER TABLE `party_stock_moves`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `payment_adds`
--
ALTER TABLE `payment_adds`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=459;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `purchase_items`
--
ALTER TABLE `purchase_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `purchase_returns`
--
ALTER TABLE `purchase_returns`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `purchase_return_items`
--
ALTER TABLE `purchase_return_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `received_adds`
--
ALTER TABLE `received_adds`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `received_modes`
--
ALTER TABLE `received_modes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `rent_vouchers`
--
ALTER TABLE `rent_vouchers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `rent_voucher_lines`
--
ALTER TABLE `rent_voucher_lines`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `salary_receives`
--
ALTER TABLE `salary_receives`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `salary_slips`
--
ALTER TABLE `salary_slips`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `salary_slip_employees`
--
ALTER TABLE `salary_slip_employees`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `salary_structures`
--
ALTER TABLE `salary_structures`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `salesmen`
--
ALTER TABLE `salesmen`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sales_orders`
--
ALTER TABLE `sales_orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sales_order_items`
--
ALTER TABLE `sales_order_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sales_returns`
--
ALTER TABLE `sales_returns`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `sales_return_items`
--
ALTER TABLE `sales_return_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `sale_approvals`
--
ALTER TABLE `sale_approvals`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `sale_payments`
--
ALTER TABLE `sale_payments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `shifts`
--
ALTER TABLE `shifts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `stock_transfers`
--
ALTER TABLE `stock_transfers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `stock_transfer_items`
--
ALTER TABLE `stock_transfer_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `system_ledgers`
--
ALTER TABLE `system_ledgers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `working_orders`
--
ALTER TABLE `working_orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `working_order_extras`
--
ALTER TABLE `working_order_extras`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `working_order_items`
--
ALTER TABLE `working_order_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  ADD CONSTRAINT `account_ledgers_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `account_ledgers_group_under_id_foreign` FOREIGN KEY (`group_under_id`) REFERENCES `group_unders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD CONSTRAINT `company_settings_financial_year_id_foreign` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contra_adds`
--
ALTER TABLE `contra_adds`
  ADD CONSTRAINT `contra_adds_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contra_adds_mode_from_id_foreign` FOREIGN KEY (`mode_from_id`) REFERENCES `received_modes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contra_adds_mode_to_id_foreign` FOREIGN KEY (`mode_to_id`) REFERENCES `received_modes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contra_add_details`
--
ALTER TABLE `contra_add_details`
  ADD CONSTRAINT `contra_add_details_account_ledger_id_foreign` FOREIGN KEY (`account_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contra_add_details_contra_add_id_foreign` FOREIGN KEY (`contra_add_id`) REFERENCES `contra_adds` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `conversion_lines`
--
ALTER TABLE `conversion_lines`
  ADD CONSTRAINT `conversion_lines_party_item_id_foreign` FOREIGN KEY (`party_item_id`) REFERENCES `party_items` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `conversion_lines_voucher_id_foreign` FOREIGN KEY (`voucher_id`) REFERENCES `conversion_vouchers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `conversion_vouchers`
--
ALTER TABLE `conversion_vouchers`
  ADD CONSTRAINT `conversion_vouchers_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `conversion_vouchers_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `conversion_vouchers_party_ledger_id_foreign` FOREIGN KEY (`party_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `designations`
--
ALTER TABLE `designations`
  ADD CONSTRAINT `designations_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employees_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employees_designation_id_foreign` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employees_reference_by_foreign` FOREIGN KEY (`reference_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employees_salary_structure_id_foreign` FOREIGN KEY (`salary_structure_id`) REFERENCES `salary_structures` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employees_shift_id_foreign` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `finished_products`
--
ALTER TABLE `finished_products`
  ADD CONSTRAINT `finished_products_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `finished_products_working_order_id_foreign` FOREIGN KEY (`working_order_id`) REFERENCES `working_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `finished_product_items`
--
ALTER TABLE `finished_product_items`
  ADD CONSTRAINT `finished_product_items_finished_product_id_foreign` FOREIGN KEY (`finished_product_id`) REFERENCES `finished_products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `finished_product_items_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`),
  ADD CONSTRAINT `finished_product_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `items` (`id`);

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `items_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `items_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `item_stocks`
--
ALTER TABLE `item_stocks`
  ADD CONSTRAINT `item_stocks_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `item_stocks_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD CONSTRAINT `journal_entries_account_ledger_id_foreign` FOREIGN KEY (`account_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `journal_entries_journal_id_foreign` FOREIGN KEY (`journal_id`) REFERENCES `journals` (`id`) ON DELETE CASCADE;

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
-- Constraints for table `party_items`
--
ALTER TABLE `party_items`
  ADD CONSTRAINT `party_items_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `party_items_party_ledger_id_foreign` FOREIGN KEY (`party_ledger_id`) REFERENCES `account_ledgers` (`id`),
  ADD CONSTRAINT `party_items_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`);

--
-- Constraints for table `party_job_stocks`
--
ALTER TABLE `party_job_stocks`
  ADD CONSTRAINT `party_job_stocks_party_item_id_foreign` FOREIGN KEY (`party_item_id`) REFERENCES `party_items` (`id`);

--
-- Constraints for table `payment_adds`
--
ALTER TABLE `payment_adds`
  ADD CONSTRAINT `payment_adds_payment_mode_id_foreign` FOREIGN KEY (`payment_mode_id`) REFERENCES `received_modes` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_account_ledger_id_foreign` FOREIGN KEY (`account_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchases_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchases_inventory_ledger_id_foreign` FOREIGN KEY (`inventory_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `purchases_journal_id_foreign` FOREIGN KEY (`journal_id`) REFERENCES `journals` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchases_received_mode_id_foreign` FOREIGN KEY (`received_mode_id`) REFERENCES `received_modes` (`id`),
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
  ADD CONSTRAINT `purchase_returns_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_returns_journal_id_foreign` FOREIGN KEY (`journal_id`) REFERENCES `journals` (`id`) ON DELETE SET NULL;

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
  ADD CONSTRAINT `received_adds_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `received_adds_received_mode_id_foreign` FOREIGN KEY (`received_mode_id`) REFERENCES `received_modes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `received_modes`
--
ALTER TABLE `received_modes`
  ADD CONSTRAINT `received_modes_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `received_modes_ledger_id_foreign` FOREIGN KEY (`ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `received_modes_purchase_return_id_foreign` FOREIGN KEY (`purchase_return_id`) REFERENCES `purchase_returns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `received_modes_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `rent_vouchers`
--
ALTER TABLE `rent_vouchers`
  ADD CONSTRAINT `rent_vouchers_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `rent_vouchers_party_ledger_id_foreign` FOREIGN KEY (`party_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `rent_vouchers_received_mode_id_foreign` FOREIGN KEY (`received_mode_id`) REFERENCES `received_modes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `rent_voucher_lines`
--
ALTER TABLE `rent_voucher_lines`
  ADD CONSTRAINT `rent_voucher_lines_party_item_id_foreign` FOREIGN KEY (`party_item_id`) REFERENCES `party_items` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `rent_voucher_lines_voucher_id_foreign` FOREIGN KEY (`voucher_id`) REFERENCES `rent_vouchers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `salary_receives`
--
ALTER TABLE `salary_receives`
  ADD CONSTRAINT `salary_receives_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `salary_receives_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `salary_receives_journal_id_foreign` FOREIGN KEY (`journal_id`) REFERENCES `journals` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `salary_receives_received_by_foreign` FOREIGN KEY (`received_by`) REFERENCES `received_modes` (`id`),
  ADD CONSTRAINT `salary_receives_salary_slip_employee_id_foreign` FOREIGN KEY (`salary_slip_employee_id`) REFERENCES `salary_slip_employees` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `salary_slips`
--
ALTER TABLE `salary_slips`
  ADD CONSTRAINT `salary_slips_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `salary_slip_employees`
--
ALTER TABLE `salary_slip_employees`
  ADD CONSTRAINT `salary_slip_employees_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `salary_slip_employees_salary_slip_id_foreign` FOREIGN KEY (`salary_slip_id`) REFERENCES `salary_slips` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_account_ledger_id_foreign` FOREIGN KEY (`account_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_cogs_ledger_id_foreign` FOREIGN KEY (`cogs_ledger_id`) REFERENCES `account_ledgers` (`id`),
  ADD CONSTRAINT `sales_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_journal_id_foreign` FOREIGN KEY (`journal_id`) REFERENCES `journals` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sales_other_expense_ledger_id_foreign` FOREIGN KEY (`other_expense_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_received_mode_id_foreign` FOREIGN KEY (`received_mode_id`) REFERENCES `received_modes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sales_rejected_by_foreign` FOREIGN KEY (`rejected_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sales_responsible_id_foreign` FOREIGN KEY (`responsible_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sales_salesman_id_foreign` FOREIGN KEY (`salesman_id`) REFERENCES `salesmen` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_sub_responsible_id_foreign` FOREIGN KEY (`sub_responsible_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

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
  ADD CONSTRAINT `sales_orders_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
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
  ADD CONSTRAINT `sales_returns_cogs_ledger_id_foreign` FOREIGN KEY (`cogs_ledger_id`) REFERENCES `account_ledgers` (`id`),
  ADD CONSTRAINT `sales_returns_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_returns_received_mode_id_foreign` FOREIGN KEY (`received_mode_id`) REFERENCES `received_modes` (`id`),
  ADD CONSTRAINT `sales_returns_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_returns_salesman_id_foreign` FOREIGN KEY (`salesman_id`) REFERENCES `salesmen` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales_return_items`
--
ALTER TABLE `sales_return_items`
  ADD CONSTRAINT `sales_return_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_return_items_sales_return_id_foreign` FOREIGN KEY (`sales_return_id`) REFERENCES `sales_returns` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sale_approvals`
--
ALTER TABLE `sale_approvals`
  ADD CONSTRAINT `sale_approvals_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sale_approvals_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sale_approvals_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sale_items_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sale_payments`
--
ALTER TABLE `sale_payments`
  ADD CONSTRAINT `sale_payments_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `sale_payments_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shifts`
--
ALTER TABLE `shifts`
  ADD CONSTRAINT `shifts_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `stocks_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stocks_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stocks_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_transfers`
--
ALTER TABLE `stock_transfers`
  ADD CONSTRAINT `stock_transfers_from_godown_id_foreign` FOREIGN KEY (`from_godown_id`) REFERENCES `godowns` (`id`),
  ADD CONSTRAINT `stock_transfers_to_godown_id_foreign` FOREIGN KEY (`to_godown_id`) REFERENCES `godowns` (`id`);

--
-- Constraints for table `stock_transfer_items`
--
ALTER TABLE `stock_transfer_items`
  ADD CONSTRAINT `stock_transfer_items_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  ADD CONSTRAINT `stock_transfer_items_stock_transfer_id_foreign` FOREIGN KEY (`stock_transfer_id`) REFERENCES `stock_transfers` (`id`);

--
-- Constraints for table `system_ledgers`
--
ALTER TABLE `system_ledgers`
  ADD CONSTRAINT `system_ledgers_account_ledger_id_foreign` FOREIGN KEY (`account_ledger_id`) REFERENCES `account_ledgers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `working_orders`
--
ALTER TABLE `working_orders`
  ADD CONSTRAINT `working_orders_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `working_order_extras`
--
ALTER TABLE `working_order_extras`
  ADD CONSTRAINT `working_order_extras_working_order_id_foreign` FOREIGN KEY (`working_order_id`) REFERENCES `working_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `working_order_items`
--
ALTER TABLE `working_order_items`
  ADD CONSTRAINT `working_order_items_godown_id_foreign` FOREIGN KEY (`godown_id`) REFERENCES `godowns` (`id`),
  ADD CONSTRAINT `working_order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `items` (`id`),
  ADD CONSTRAINT `working_order_items_working_order_id_foreign` FOREIGN KEY (`working_order_id`) REFERENCES `working_orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

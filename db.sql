-- ========================================================
-- SHOE STORE E-COMMERCE DATABASE
-- Revised from the previous e-commerce schema
-- MySQL 8.0+
-- Revision date: 27 July 2026
--
-- Product revisions:
--   products: removed product_line and style_name
--   product_variants: removed barcode, variant_name, package_type
--   variants are identified by colour + shoe size
-- ========================================================

-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Database schema for shoe-store e-commerce
CREATE DATABASE IF NOT EXISTS `shoe_store` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `shoe_store`;

-- Dumping structure for table shoe_store.admin_activity_logs
CREATE TABLE IF NOT EXISTS `admin_activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `action` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `admin_activity_logs_user_id_foreign` (`user_id`),
  KEY `admin_activity_logs_module_created_at_index` (`module`,`created_at`),
  KEY `admin_activity_logs_reference_type_reference_id_index` (`reference_type`,`reference_id`),
  CONSTRAINT `admin_activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.banners
CREATE TABLE IF NOT EXISTS `banners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_desktop_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_mobile_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `button_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `button_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `placement` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'homepage',
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `banners_placement_is_active_sort_order_index` (`placement`,`is_active`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.biteship_webhook_logs
CREATE TABLE IF NOT EXISTS `biteship_webhook_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `event_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `biteship_order_id` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `biteship_tracking_id` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `waybill_id` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload_hash` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` json NOT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `biteship_webhook_logs_payload_hash_unique` (`payload_hash`),
  KEY `biteship_webhook_logs_event_type_index` (`event_type`),
  KEY `biteship_webhook_logs_biteship_order_id_index` (`biteship_order_id`),
  KEY `biteship_webhook_logs_biteship_tracking_id_index` (`biteship_tracking_id`),
  KEY `biteship_webhook_logs_waybill_id_index` (`waybill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.carts
CREATE TABLE IF NOT EXISTS `carts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `carts_user_id_unique` (`user_id`),
  CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.cart_items
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `product_variant_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `product_name_snapshot` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_sku_snapshot` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_sku_snapshot` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_name_snapshot` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size_snapshot` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_snapshot` decimal(15,2) NOT NULL,
  `image_url_snapshot` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_items_cart_id_product_variant_id_unique` (`cart_id`,`product_variant_id`),
  KEY `cart_items_cart_id_index` (`cart_id`),
  KEY `cart_items_product_id_index` (`product_id`),
  KEY `cart_items_product_variant_id_index` (`product_variant_id`),
  CONSTRAINT `cart_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_product_variant_id_foreign` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_quantity_positive` CHECK (`quantity` > 0),
  CONSTRAINT `cart_items_price_non_negative` CHECK (`price_snapshot` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` bigint unsigned DEFAULT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_parent_id_index` (`parent_id`),
  KEY `categories_slug_index` (`slug`),
  KEY `categories_is_active_index` (`is_active`),
  CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.collections
CREATE TABLE IF NOT EXISTS `collections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `banner_desktop_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner_mobile_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `collections_slug_unique` (`slug`),
  KEY `collections_slug_index` (`slug`),
  KEY `collections_is_featured_index` (`is_featured`),
  KEY `collections_is_active_index` (`is_active`),
  KEY `collections_starts_at_index` (`starts_at`),
  KEY `collections_ends_at_index` (`ends_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.customer_addresses
CREATE TABLE IF NOT EXISTS `customer_addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `recipient_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subdistrict` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `biteship_area_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `full_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_addresses_user_id_is_default_index` (`user_id`,`is_default`),
  KEY `customer_addresses_biteship_area_id_index` (`biteship_area_id`),
  CONSTRAINT `customer_addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
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


-- Dumping structure for table shoe_store.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
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


-- Dumping structure for table shoe_store.job_batches
CREATE TABLE IF NOT EXISTS `job_batches` (
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


-- Dumping structure for table shoe_store.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_is_read_index` (`user_id`,`is_read`),
  KEY `notifications_reference_type_reference_id_index` (`reference_type`,`reference_id`),
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `customer_address_id` bigint unsigned DEFAULT NULL,
  `order_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checkout_idempotency_key` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `shipping_cost` decimal(15,2) NOT NULL DEFAULT '0.00',
  `insurance_cost` decimal(15,2) NOT NULL DEFAULT '0.00',
  `service_fee` decimal(15,2) NOT NULL DEFAULT '0.00',
  `grand_total` decimal(15,2) NOT NULL DEFAULT '0.00',
  `voucher_id` bigint unsigned DEFAULT NULL,
  `voucher_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `order_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending_payment',
  `shipping_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_created',
  `source_channel` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'website',
  `terms_agreed` tinyint(1) NOT NULL DEFAULT '0',
  `terms_agreed_at` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `paid_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `expired_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `stock_reserved_at` timestamp NULL DEFAULT NULL,
  `stock_released_at` timestamp NULL DEFAULT NULL,
  `stock_finalized_at` timestamp NULL DEFAULT NULL,
  `voucher_released_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`),
  UNIQUE KEY `orders_user_id_checkout_idempotency_key_unique` (`user_id`,`checkout_idempotency_key`),
  KEY `orders_customer_address_id_foreign` (`customer_address_id`),
  KEY `orders_voucher_id_foreign` (`voucher_id`),
  KEY `orders_order_number_index` (`order_number`),
  KEY `orders_payment_status_index` (`payment_status`),
  KEY `orders_order_status_index` (`order_status`),
  KEY `orders_shipping_status_index` (`shipping_status`),
  KEY `orders_source_channel_index` (`source_channel`),
  CONSTRAINT `orders_customer_address_id_foreign` FOREIGN KEY (`customer_address_id`) REFERENCES `customer_addresses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `orders_voucher_id_foreign` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_order_status_allowed` CHECK ((`order_status` in (_utf8mb4'pending_payment',_utf8mb4'paid',_utf8mb4'processing',_utf8mb4'ready_to_ship',_utf8mb4'shipment_created',_utf8mb4'shipped',_utf8mb4'delivered',_utf8mb4'completed',_utf8mb4'cancelled',_utf8mb4'payment_failed',_utf8mb4'payment_expired',_utf8mb4'shipment_failed',_utf8mb4'shipment_problem',_utf8mb4'lost',_utf8mb4'returned',_utf8mb4'refunded'))),
  CONSTRAINT `orders_payment_status_allowed` CHECK ((`payment_status` in (_utf8mb4'pending',_utf8mb4'paid',_utf8mb4'manual_review',_utf8mb4'failed',_utf8mb4'cancelled',_utf8mb4'expired',_utf8mb4'refunded',_utf8mb4'partially_refunded'))),
  CONSTRAINT `orders_shipping_status_allowed` CHECK ((`shipping_status` in (_utf8mb4'not_created',_utf8mb4'creating',_utf8mb4'confirmed',_utf8mb4'allocated',_utf8mb4'picked',_utf8mb4'in_transit',_utf8mb4'delivered',_utf8mb4'cancelled',_utf8mb4'failed',_utf8mb4'problem',_utf8mb4'lost',_utf8mb4'returned')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.order_addresses
CREATE TABLE IF NOT EXISTS `order_addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `recipient_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subdistrict` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `biteship_area_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `full_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_addresses_order_id_unique` (`order_id`),
  CONSTRAINT `order_addresses_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `product_variant_id` bigint unsigned DEFAULT NULL,
  `product_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_sku` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `weight` int NOT NULL DEFAULT '0',
  `length` int DEFAULT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `product_image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_index` (`order_id`),
  KEY `order_items_product_id_index` (`product_id`),
  KEY `order_items_product_variant_id_index` (`product_variant_id`),
  KEY `order_items_variant_sku_index` (`variant_sku`),
  KEY `order_items_color_name_index` (`color_name`),
  KEY `order_items_size_index` (`size`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL,
  CONSTRAINT `order_items_product_variant_id_foreign` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL,
  CONSTRAINT `order_items_price_non_negative` CHECK (`price` >= 0),
  CONSTRAINT `order_items_quantity_positive` CHECK (`quantity` > 0),
  CONSTRAINT `order_items_subtotal_non_negative` CHECK (`subtotal` >= 0),
  CONSTRAINT `order_items_weight_non_negative` CHECK (`weight` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.pages
CREATE TABLE IF NOT EXISTS `pages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pages_slug_unique` (`slug`),
  KEY `pages_slug_index` (`slug`),
  KEY `pages_type_index` (`type`),
  KEY `pages_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `payment_provider` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'midtrans',
  `payment_method` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `midtrans_order_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `midtrans_transaction_id` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `midtrans_snap_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `midtrans_redirect_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fraud_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gross_amount` decimal(15,2) NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IDR',
  `paid_at` timestamp NULL DEFAULT NULL,
  `expired_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `last_synced_at` timestamp NULL DEFAULT NULL,
  `failure_reason` text COLLATE utf8mb4_unicode_ci,
  `raw_response` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_order_id_unique` (`order_id`),
  UNIQUE KEY `payments_midtrans_order_id_unique` (`midtrans_order_id`),
  KEY `payments_order_id_transaction_status_index` (`order_id`,`transaction_status`),
  KEY `payments_midtrans_transaction_id_index` (`midtrans_transaction_id`),
  KEY `payments_transaction_status_created_at_index` (`transaction_status`,`created_at`),
  KEY `payments_last_synced_at_index` (`last_synced_at`),
  KEY `payments_expires_at_index` (`expires_at`),
  CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_transaction_status_allowed` CHECK (((`transaction_status` is null) or (`transaction_status` in (_utf8mb4'pending',_utf8mb4'capture',_utf8mb4'settlement',_utf8mb4'deny',_utf8mb4'cancel',_utf8mb4'expire',_utf8mb4'failure',_utf8mb4'refund',_utf8mb4'partial_refund',_utf8mb4'authorize',_utf8mb4'manual_review',_utf8mb4'snap_failed'))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.payment_logs
CREATE TABLE IF NOT EXISTS `payment_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `payment_id` bigint unsigned DEFAULT NULL,
  `order_id` bigint unsigned DEFAULT NULL,
  `provider` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'midtrans',
  `event_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload_hash` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` json NOT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_logs_payload_hash_unique` (`payload_hash`),
  KEY `payment_logs_payment_id_foreign` (`payment_id`),
  KEY `payment_logs_provider_event_type_index` (`provider`,`event_type`),
  KEY `payment_logs_order_id_created_at_index` (`order_id`,`created_at`),
  CONSTRAINT `payment_logs_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `payment_logs_payment_id_foreign` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `regular_price` decimal(15,2) NOT NULL,
  `sale_price` decimal(15,2) DEFAULT NULL,
  `short_description` text COLLATE utf8mb4_unicode_ci,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `stock_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'in_stock',
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `weight` int NOT NULL DEFAULT '0' COMMENT 'Default weight in grams',
  `length` int DEFAULT NULL COMMENT 'Default package length in centimetres',
  `width` int DEFAULT NULL COMMENT 'Default package width in centimetres',
  `height` int DEFAULT NULL COMMENT 'Default package height in centimetres',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `is_new_arrival` tinyint(1) NOT NULL DEFAULT '0',
  `is_best_seller` tinyint(1) NOT NULL DEFAULT '0',
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` text COLLATE utf8mb4_unicode_ci,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  UNIQUE KEY `products_sku_unique` (`sku`),
  KEY `products_category_id_index` (`category_id`),
  KEY `products_sku_index` (`sku`),
  KEY `products_brand_name_index` (`brand_name`),
  KEY `products_stock_status_index` (`stock_status`),
  KEY `products_status_index` (`status`),
  KEY `products_is_featured_index` (`is_featured`),
  KEY `products_is_new_arrival_index` (`is_new_arrival`),
  KEY `products_is_best_seller_index` (`is_best_seller`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_regular_price_positive` CHECK (`regular_price` > 0),
  CONSTRAINT `products_sale_price_valid` CHECK (`sale_price` IS NULL OR (`sale_price` >= 0 AND `sale_price` <= `regular_price`)),
  CONSTRAINT `products_weight_non_negative` CHECK (`weight` >= 0),
  CONSTRAINT `products_stock_status_allowed` CHECK (`stock_status` IN ('in_stock','low_stock','out_of_stock')),
  CONSTRAINT `products_status_allowed` CHECK (`status` IN ('draft','published','archived'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.product_collections
CREATE TABLE IF NOT EXISTS `product_collections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `collection_id` bigint unsigned NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_collections_product_id_collection_id_unique` (`product_id`,`collection_id`),
  KEY `product_collections_product_id_index` (`product_id`),
  KEY `product_collections_collection_id_index` (`collection_id`),
  CONSTRAINT `product_collections_collection_id_foreign` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_collections_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.product_images
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Optional colourway association',
  `sort_order` int NOT NULL DEFAULT '0',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_is_primary_index` (`product_id`,`is_primary`),
  KEY `product_images_product_id_sort_order_index` (`product_id`,`sort_order`),
  KEY `product_images_product_id_color_name_index` (`product_id`,`color_name`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.product_reviews
CREATE TABLE IF NOT EXISTS `product_reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `order_item_id` bigint unsigned DEFAULT NULL,
  `product_id` bigint unsigned NOT NULL,
  `rating` int NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_reviews_product_id_index` (`product_id`),
  KEY `product_reviews_user_id_index` (`user_id`),
  KEY `product_reviews_order_item_id_index` (`order_item_id`),
  KEY `product_reviews_is_visible_index` (`is_visible`),
  CONSTRAINT `product_reviews_order_item_id_foreign` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE SET NULL,
  CONSTRAINT `product_reviews_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.product_variants
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_hex` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `regular_price` decimal(15,2) DEFAULT NULL,
  `sale_price` decimal(15,2) DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `reserved_stock` int NOT NULL DEFAULT '0',
  `weight` int DEFAULT NULL COMMENT 'Variant weight in grams; falls back to products.weight when NULL',
  `length` int DEFAULT NULL COMMENT 'Variant package length in centimetres',
  `width` int DEFAULT NULL COMMENT 'Variant package width in centimetres',
  `height` int DEFAULT NULL COMMENT 'Variant package height in centimetres',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_variants_sku_unique` (`sku`),
  UNIQUE KEY `product_variants_product_color_size_unique` (`product_id`,`color_name`,`size`),
  KEY `product_variants_product_id_index` (`product_id`),
  KEY `product_variants_sku_index` (`sku`),
  KEY `product_variants_color_name_index` (`color_name`),
  KEY `product_variants_size_index` (`size`),
  KEY `product_variants_is_active_index` (`is_active`),
  CONSTRAINT `product_variants_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_variants_stock_non_negative` CHECK (`stock` >= 0),
  CONSTRAINT `product_variants_reserved_stock_non_negative` CHECK (`reserved_stock` >= 0),
  CONSTRAINT `product_variants_reserved_stock_lte_stock` CHECK (`reserved_stock` <= `stock`),
  CONSTRAINT `product_variants_regular_price_valid` CHECK (`regular_price` IS NULL OR `regular_price` > 0),
  CONSTRAINT `product_variants_sale_price_valid` CHECK (`sale_price` IS NULL OR (`sale_price` >= 0 AND (`regular_price` IS NULL OR `sale_price` <= `regular_price`)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
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


-- Dumping structure for table shoe_store.shipments
CREATE TABLE IF NOT EXISTS `shipments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `shipping_provider` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'biteship',
  `biteship_order_id` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `biteship_tracking_id` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `waybill_id` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `courier_company` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courier_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courier_service_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delivery_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'now',
  `shipping_cost` decimal(15,2) NOT NULL DEFAULT '0.00',
  `insurance_cost` decimal(15,2) NOT NULL DEFAULT '0.00',
  `estimated_delivery` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_created',
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `creating_at` timestamp NULL DEFAULT NULL,
  `last_synced_at` timestamp NULL DEFAULT NULL,
  `failed_reason` text COLLATE utf8mb4_unicode_ci,
  `raw_rate_response` json DEFAULT NULL,
  `raw_order_response` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shipments_order_id_unique` (`order_id`),
  UNIQUE KEY `shipments_biteship_order_id_unique` (`biteship_order_id`),
  KEY `shipments_biteship_order_id_index` (`biteship_order_id`),
  KEY `shipments_biteship_tracking_id_index` (`biteship_tracking_id`),
  KEY `shipments_waybill_id_index` (`waybill_id`),
  KEY `shipments_shipping_status_index` (`shipping_status`),
  CONSTRAINT `shipments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shipments_shipping_status_allowed` CHECK ((`shipping_status` in (_utf8mb4'not_created',_utf8mb4'creating',_utf8mb4'confirmed',_utf8mb4'allocated',_utf8mb4'picked',_utf8mb4'in_transit',_utf8mb4'delivered',_utf8mb4'cancelled',_utf8mb4'failed',_utf8mb4'problem',_utf8mb4'lost',_utf8mb4'returned')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.shipment_trackings
CREATE TABLE IF NOT EXISTS `shipment_trackings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `shipment_id` bigint unsigned NOT NULL,
  `status` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `happened_at` timestamp NULL DEFAULT NULL,
  `provider_happened_at` timestamp NULL DEFAULT NULL,
  `payload_hash` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `raw_payload` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shipment_trackings_payload_hash_unique` (`payload_hash`),
  KEY `shipment_trackings_shipment_id_happened_at_index` (`shipment_id`,`happened_at`),
  KEY `shipment_trackings_shipment_id_provider_happened_at_index` (`shipment_id`,`provider_happened_at`),
  CONSTRAINT `shipment_trackings_shipment_id_foreign` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.site_settings
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'string',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.stock_logs
CREATE TABLE IF NOT EXISTS `stock_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_variant_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `stock_before` int NOT NULL,
  `stock_after` int NOT NULL,
  `reference_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_logs_product_variant_id_index` (`product_variant_id`),
  KEY `stock_logs_user_id_index` (`user_id`),
  KEY `stock_logs_type_index` (`type`),
  KEY `stock_logs_reference_type_index` (`reference_type`),
  KEY `stock_logs_reference_id_index` (`reference_id`),
  CONSTRAINT `stock_logs_product_variant_id_foreign` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `stock_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_google_id_unique` (`google_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.vouchers
CREATE TABLE IF NOT EXISTS `vouchers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `discount_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(15,2) NOT NULL,
  `max_discount` decimal(15,2) DEFAULT NULL,
  `min_order_amount` decimal(15,2) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `used_count` int NOT NULL DEFAULT '0',
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vouchers_code_unique` (`code`),
  KEY `vouchers_is_active_starts_at_ends_at_index` (`is_active`,`starts_at`,`ends_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.voucher_categories
CREATE TABLE IF NOT EXISTS `voucher_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `voucher_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `voucher_categories_voucher_id_category_id_unique` (`voucher_id`,`category_id`),
  KEY `voucher_categories_category_id_foreign` (`category_id`),
  CONSTRAINT `voucher_categories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `voucher_categories_voucher_id_foreign` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.voucher_products
CREATE TABLE IF NOT EXISTS `voucher_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `voucher_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `voucher_products_voucher_id_product_id_unique` (`voucher_id`,`product_id`),
  KEY `voucher_products_product_id_foreign` (`product_id`),
  CONSTRAINT `voucher_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `voucher_products_voucher_id_foreign` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dumping structure for table shoe_store.wishlists
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wishlists_user_id_product_id_unique` (`user_id`,`product_id`),
  KEY `wishlists_product_id_foreign` (`product_id`),
  CONSTRAINT `wishlists_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlists_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- OPTIONAL STARTER DATA FOR SHOE STORE
-- Remove this section when the application uses dedicated Laravel seeders.
-- --------------------------------------------------------

INSERT INTO `categories`
  (`id`, `parent_id`, `name`, `slug`, `description`, `image_url`, `sort_order`, `is_active`, `deleted_at`, `created_at`, `updated_at`)
VALUES
  (1, NULL, 'Sneakers', 'sneakers', 'Sneakers untuk aktivitas harian dan gaya kasual.', NULL, 10, 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, NULL, 'Running', 'running', 'Sepatu lari untuk latihan harian, tempo, dan jarak jauh.', NULL, 20, 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, NULL, 'Basketball', 'basketball', 'Sepatu basket dengan dukungan, grip, dan stabilitas.', NULL, 30, 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, NULL, 'Training', 'training', 'Sepatu training untuk gym dan latihan serbaguna.', NULL, 40, 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, NULL, 'Lifestyle', 'lifestyle', 'Sepatu lifestyle untuk penggunaan sehari-hari.', NULL, 50, 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, NULL, 'Kids', 'kids', 'Koleksi sepatu untuk anak-anak.', NULL, 60, 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO `collections`
  (`id`, `name`, `slug`, `description`, `banner_desktop_url`, `banner_mobile_url`, `sort_order`, `is_featured`, `is_active`, `starts_at`, `ends_at`, `deleted_at`, `created_at`, `updated_at`)
VALUES
  (1, 'New Release', 'new-release', 'Model sepatu terbaru.', NULL, NULL, 10, 1, 1, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'Best Seller', 'best-seller', 'Model sepatu yang paling banyak dibeli.', NULL, NULL, 20, 1, 1, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'Running Essentials', 'running-essentials', 'Pilihan sepatu untuk kebutuhan lari.', NULL, NULL, 30, 1, 1, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 'Basketball Collection', 'basketball-collection', 'Pilihan sepatu untuk permainan basket.', NULL, NULL, 40, 1, 1, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 'Sale', 'sale', 'Produk dengan harga promosi.', NULL, NULL, 50, 1, 1, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO `products`
  (`id`, `category_id`, `name`, `slug`, `sku`, `brand_name`, `regular_price`, `sale_price`, `short_description`, `description`, `stock_status`, `status`, `weight`, `length`, `width`, `height`, `is_featured`, `is_new_arrival`, `is_best_seller`, `meta_title`, `meta_description`, `deleted_at`, `created_at`, `updated_at`)
VALUES
  (1, 1, 'Urban Pace One', 'urban-pace-one', 'SHOE-UP1', 'StrideLab', 1299000.00, NULL, 'Sneakers ringan untuk aktivitas harian.', '<p>Urban Pace One menghadirkan kenyamanan harian dengan upper breathable dan outsole fleksibel.</p>', 'in_stock', 'published', 900, 35, 24, 13, 1, 1, 1, 'Urban Pace One | Shoe Store', 'Sneakers ringan untuk gaya dan aktivitas sehari-hari.', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 2, 'AeroRun Flow', 'aerorun-flow', 'SHOE-ARF', 'Velocity', 1599000.00, 1399000.00, 'Running shoes dengan cushioning responsif.', '<p>AeroRun Flow cocok untuk latihan harian dengan bantalan responsif dan upper mesh yang ringan.</p>', 'in_stock', 'published', 820, 34, 23, 12, 1, 1, 0, 'AeroRun Flow | Shoe Store', 'Sepatu lari harian dengan cushioning responsif.', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 3, 'Court Elevate Pro', 'court-elevate-pro', 'SHOE-CEP', 'PeakMotion', 1899000.00, NULL, 'Basketball shoes dengan grip dan stabilitas tinggi.', '<p>Court Elevate Pro dirancang untuk perubahan arah cepat, dukungan lateral, dan traksi lapangan.</p>', 'in_stock', 'published', 1050, 36, 25, 14, 1, 0, 1, 'Court Elevate Pro | Shoe Store', 'Sepatu basket dengan traksi dan stabilitas tinggi.', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO `product_variants`
  (`id`, `product_id`, `sku`, `color_name`, `color_hex`, `size`, `regular_price`, `sale_price`, `stock`, `reserved_stock`, `weight`, `length`, `width`, `height`, `image_url`, `is_active`, `deleted_at`, `created_at`, `updated_at`)
VALUES
  (1, 1, 'SHOE-UP1-BLK-40', 'Black', '#111111', 'EU 40', NULL, NULL, 12, 0, NULL, NULL, NULL, NULL, '/storage/products/urban-pace-one/black.webp', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 'SHOE-UP1-BLK-41', 'Black', '#111111', 'EU 41', NULL, NULL, 15, 0, NULL, NULL, NULL, NULL, '/storage/products/urban-pace-one/black.webp', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, 'SHOE-UP1-WHT-40', 'White', '#FFFFFF', 'EU 40', NULL, NULL, 10, 0, NULL, NULL, NULL, NULL, '/storage/products/urban-pace-one/white.webp', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 1, 'SHOE-UP1-WHT-41', 'White', '#FFFFFF', 'EU 41', NULL, NULL, 8, 0, NULL, NULL, NULL, NULL, '/storage/products/urban-pace-one/white.webp', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 2, 'SHOE-ARF-BLU-40', 'Blue', '#3155A4', 'EU 40', NULL, NULL, 9, 0, NULL, NULL, NULL, NULL, '/storage/products/aerorun-flow/blue.webp', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 2, 'SHOE-ARF-BLU-41', 'Blue', '#3155A4', 'EU 41', NULL, NULL, 11, 0, NULL, NULL, NULL, NULL, '/storage/products/aerorun-flow/blue.webp', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, 2, 'SHOE-ARF-PUR-40', 'Purple', '#6A45A5', 'EU 40', NULL, NULL, 7, 0, NULL, NULL, NULL, NULL, '/storage/products/aerorun-flow/purple.webp', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, 2, 'SHOE-ARF-PUR-41', 'Purple', '#6A45A5', 'EU 41', NULL, NULL, 6, 0, NULL, NULL, NULL, NULL, '/storage/products/aerorun-flow/purple.webp', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (9, 3, 'SHOE-CEP-RED-42', 'Red', '#B4252B', 'EU 42', NULL, NULL, 6, 0, NULL, NULL, NULL, NULL, '/storage/products/court-elevate-pro/red.webp', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (10, 3, 'SHOE-CEP-RED-43', 'Red', '#B4252B', 'EU 43', NULL, NULL, 7, 0, NULL, NULL, NULL, NULL, '/storage/products/court-elevate-pro/red.webp', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (11, 3, 'SHOE-CEP-BLK-42', 'Black', '#111111', 'EU 42', NULL, NULL, 8, 0, NULL, NULL, NULL, NULL, '/storage/products/court-elevate-pro/black.webp', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (12, 3, 'SHOE-CEP-BLK-43', 'Black', '#111111', 'EU 43', NULL, NULL, 5, 0, NULL, NULL, NULL, NULL, '/storage/products/court-elevate-pro/black.webp', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO `product_images`
  (`id`, `product_id`, `image_url`, `alt_text`, `color_name`, `sort_order`, `is_primary`, `deleted_at`, `created_at`, `updated_at`)
VALUES
  (1, 1, '/storage/products/urban-pace-one/black.webp', 'Urban Pace One warna Black', 'Black', 0, 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, '/storage/products/urban-pace-one/white.webp', 'Urban Pace One warna White', 'White', 1, 0, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 2, '/storage/products/aerorun-flow/blue.webp', 'AeroRun Flow warna Blue', 'Blue', 0, 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 2, '/storage/products/aerorun-flow/purple.webp', 'AeroRun Flow warna Purple', 'Purple', 1, 0, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 3, '/storage/products/court-elevate-pro/red.webp', 'Court Elevate Pro warna Red', 'Red', 0, 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 3, '/storage/products/court-elevate-pro/black.webp', 'Court Elevate Pro warna Black', 'Black', 1, 0, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO `product_collections`
  (`id`, `product_id`, `collection_id`, `sort_order`, `created_at`, `updated_at`)
VALUES
  (1, 1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 2, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 2, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 2, 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 3, 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, 3, 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO `pages`
  (`id`, `title`, `slug`, `content`, `type`, `meta_title`, `meta_description`, `is_active`, `created_at`, `updated_at`)
VALUES
  (1, 'Panduan Ukuran', 'size-guide', '<h2>Cara Mengukur Kaki</h2><ol><li>Letakkan kaki di atas kertas.</li><li>Tandai ujung tumit dan jari terpanjang.</li><li>Ukur jarak dalam sentimeter.</li><li>Cocokkan hasil dengan tabel ukuran merek terkait.</li></ol><p>Ukuran dapat berbeda antar-merek. Periksa panduan pada halaman produk sebelum membeli.</p>', 'size_guide', 'Panduan Ukuran Sepatu', 'Panduan memilih ukuran sepatu berdasarkan panjang kaki.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'Kebijakan Pengiriman', 'shipping-policy', '<p>Pesanan diproses setelah pembayaran dikonfirmasi. Biaya dan estimasi pengiriman dihitung saat checkout.</p>', 'policy', 'Kebijakan Pengiriman', 'Informasi pengiriman pesanan sepatu.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'Kebijakan Penukaran', 'exchange-policy', '<p>Pengajuan penukaran ukuran mengikuti syarat kondisi produk, batas waktu pengajuan, dan ketersediaan stok.</p>', 'policy', 'Kebijakan Penukaran Sepatu', 'Syarat pengajuan penukaran ukuran sepatu.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO `site_settings`
  (`id`, `key`, `value`, `type`, `created_at`, `updated_at`)
VALUES
  (1, 'store_name', 'Shoe Store', 'string', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'store_email', 'hello@example.com', 'string', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'store_phone', '+62 812-0000-0000', 'string', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 'currency', 'IDR', 'string', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 'payment_expiry_duration', '1440', 'integer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 'shipping_couriers', 'jne,jnt,sicepat,anteraja', 'string', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO `banners`
  (`id`, `title`, `subtitle`, `image_desktop_url`, `image_mobile_url`, `button_text`, `button_url`, `placement`, `sort_order`, `is_active`, `starts_at`, `ends_at`, `created_at`, `updated_at`)
VALUES
  (1, 'Step Into Your Next Move', 'Temukan sneakers dan performance shoes untuk setiap aktivitas.', '/storage/banners/hero-desktop.webp', '/storage/banners/hero-mobile.webp', 'Belanja Sekarang', '/products', 'homepage', 1, 1, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'Running Essentials', 'Sepatu lari untuk latihan harian dan target baru.', '/storage/banners/running-desktop.webp', '/storage/banners/running-mobile.webp', 'Lihat Koleksi', '/collections/running-essentials', 'homepage', 2, 1, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
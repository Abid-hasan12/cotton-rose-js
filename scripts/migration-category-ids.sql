-- CottonRose safe schema/data migration
-- Run once in phpMyAdmin after restoring your backup.
-- This script only adds missing columns and upserts category/inquiry values.

SET @schema_name = DATABASE();

SET @sql = (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = @schema_name AND TABLE_NAME = 'products' AND COLUMN_NAME = 'category_id'
    ),
    'SELECT 1',
    'ALTER TABLE products ADD COLUMN category_id BIGINT UNSIGNED NULL AFTER category'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = @schema_name AND TABLE_NAME = 'products' AND COLUMN_NAME = 'offerings_json'
    ),
    'SELECT 1',
    'ALTER TABLE products ADD COLUMN offerings_json JSON NULL'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = @schema_name AND TABLE_NAME = 'products' AND COLUMN_NAME = 'materials_json'
    ),
    'SELECT 1',
    'ALTER TABLE products ADD COLUMN materials_json JSON NULL'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = @schema_name AND TABLE_NAME = 'products' AND COLUMN_NAME = 'options_json'
    ),
    'SELECT 1',
    'ALTER TABLE products ADD COLUMN options_json JSON NULL'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = @schema_name AND TABLE_NAME = 'products' AND COLUMN_NAME = 'sort_order'
    ),
    'SELECT 1',
    'ALTER TABLE products ADD COLUMN sort_order INT NOT NULL DEFAULT 0'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

INSERT INTO product_categories (slug, name, navigation_group, sort_order)
VALUES
  ('core-knitwear', 'Knitwear', 'core', 1),
  ('core-woven-wear', 'Woven Wear', 'core', 2),
  ('core-sweaters', 'Sweaters', 'core', 3),
  ('core-activewear', 'Activewear', 'core', 4),
  ('diversified-woven', 'Woven', 'diversified', 1),
  ('diversified-knit', 'Knit', 'diversified', 2),
  ('diversified-outerwear', 'Outerwear', 'diversified', 3),
  ('diversified-denim', 'Denim', 'diversified', 4)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  navigation_group = VALUES(navigation_group),
  sort_order = VALUES(sort_order);

UPDATE products p
INNER JOIN product_categories pc
  ON pc.name = p.category
SET p.category_id = pc.id;

SET @sql = (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = @schema_name AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'inquiry_type'
    ),
    'SELECT 1',
    'ALTER TABLE inquiries ADD COLUMN inquiry_type VARCHAR(30) NULL'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE inquiries
SET status = CASE
  WHEN LOWER(TRIM(COALESCE(status, ''))) IN ('new', 'pending') THEN 'new'
  WHEN LOWER(TRIM(status)) IN ('in_progress', 'in progress', 'contacted') THEN 'in_progress'
  WHEN LOWER(TRIM(status)) = 'replied' THEN 'replied'
  WHEN LOWER(TRIM(status)) = 'closed' THEN 'closed'
  ELSE 'new'
END;

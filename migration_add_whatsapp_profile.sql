-- Migration Script for NashaMukht Database
-- Add WhatsApp Profile Name Column to Existing Participants Table
-- Run this script if you already have a participants table without the whatsapp_profile_name column

-- Check if the column already exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'NashaMukht'
    AND TABLE_NAME = 'participants'
    AND COLUMN_NAME = 'whatsapp_profile_name'
);

-- Add the column if it doesn't exist
SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE participants ADD COLUMN whatsapp_profile_name VARCHAR(100) NULL AFTER full_name',
    'SELECT "Column whatsapp_profile_name already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify the column was added
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'NashaMukht'
AND TABLE_NAME = 'participants'
AND COLUMN_NAME = 'whatsapp_profile_name';

-- Show current table structure
DESCRIBE participants;

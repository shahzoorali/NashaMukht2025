-- Simple migration to add custom registration ID column
-- Database: NashaMukht

-- Add a new column for custom registration ID
ALTER TABLE participants ADD COLUMN registration_id VARCHAR(10) UNIQUE NULL AFTER id;

-- Update existing records to have custom registration IDs starting with 01001
UPDATE participants 
SET registration_id = CONCAT('0', LPAD(id + 1000, 4, '0'))
WHERE registration_id IS NULL;

-- Make registration_id NOT NULL after populating existing records
ALTER TABLE participants MODIFY COLUMN registration_id VARCHAR(10) UNIQUE NOT NULL;

-- Add index for better performance
CREATE INDEX idx_registration_id ON participants(registration_id);
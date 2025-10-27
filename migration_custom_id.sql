-- Migration to add custom registration ID starting with 01001
-- Database: NashaMukht

-- Add a new column for custom registration ID
ALTER TABLE participants ADD COLUMN registration_id VARCHAR(10) UNIQUE NULL AFTER id;

-- Create a function to generate custom registration IDs
DELIMITER $$

CREATE FUNCTION generate_registration_id() RETURNS VARCHAR(10)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE next_id INT DEFAULT 1001;
    DECLARE custom_id VARCHAR(10);
    
    -- Get the highest existing registration ID
    SELECT COALESCE(MAX(CAST(SUBSTRING(registration_id, 2) AS UNSIGNED)), 1000) + 1 
    INTO next_id 
    FROM participants 
    WHERE registration_id IS NOT NULL AND registration_id REGEXP '^0[0-9]+$';
    
    -- Format as 01001, 01002, etc.
    SET custom_id = CONCAT('0', LPAD(next_id, 4, '0'));
    
    RETURN custom_id;
END$$

DELIMITER ;

-- Create a trigger to automatically generate registration_id on insert
DELIMITER $$

CREATE TRIGGER generate_participant_registration_id
BEFORE INSERT ON participants
FOR EACH ROW
BEGIN
    IF NEW.registration_id IS NULL THEN
        SET NEW.registration_id = generate_registration_id();
    END IF;
END$$

DELIMITER ;

-- Update existing records to have custom registration IDs
UPDATE participants 
SET registration_id = CONCAT('0', LPAD(id + 1000, 4, '0'))
WHERE registration_id IS NULL;

-- Make registration_id NOT NULL after populating existing records
ALTER TABLE participants MODIFY COLUMN registration_id VARCHAR(10) UNIQUE NOT NULL;

-- Add index for better performance
CREATE INDEX idx_registration_id ON participants(registration_id);
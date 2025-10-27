-- Nasha Mukht Bharat RUN Database Schema
-- Database: NashaMukht

-- Main participants table
CREATE TABLE participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id VARCHAR(10) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    whatsapp_profile_name VARCHAR(100) NULL,
    email VARCHAR(100) NULL,
    age INT NULL,
    gender ENUM('Male', 'Female', 'Other') NULL,
    emergency_contact VARCHAR(20) NULL,
    emergency_contact_name VARCHAR(100) NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'awaiting_name_change', 'cancelled', 'completed') DEFAULT 'active',
    registration_source ENUM('whatsapp', 'website', 'manual') DEFAULT 'whatsapp',
    event_id INT DEFAULT 1,
    tshirt_size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL') NULL,
    medical_conditions TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone_number),
    INDEX idx_status (status),
    INDEX idx_registration_date (registration_date)
);

-- Events table (for future events)
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(200) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(300) NOT NULL,
    description TEXT NULL,
    max_participants INT NULL,
    registration_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert the Nasha Mukht Bharat RUN event
INSERT INTO events (event_name, event_date, event_time, location, description, max_participants) VALUES 
('Nasha Mukht Bharat RUN', '2025-11-14', '07:00:00', 'Sanjeevaiah Park, Necklace Road, Hyderabad', 
'Let\'s run together for a Drug-Free India! We\'re honoured to have Shri V.C. Sajjanar, IPS, Commissioner of Police, Hyderabad as our Chief Guest.', 
1000);

-- Messages log table (for tracking WhatsApp interactions)
CREATE TABLE message_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    message_type ENUM('incoming', 'outgoing') NOT NULL,
    message_content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    participant_id INT NULL,
    INDEX idx_phone (phone_number),
    INDEX idx_timestamp (timestamp),
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE SET NULL
);

-- Admin users table (for admin panel access)
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NULL,
    role ENUM('admin', 'moderator', 'viewer') DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Insert default admin user (password: admin123 - change this!)
INSERT INTO admin_users (username, password_hash, email, role) VALUES 
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@wakeuphumanity.org', 'admin');

-- Event statistics table (for analytics)
CREATE TABLE event_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    total_registrations INT DEFAULT 0,
    active_registrations INT DEFAULT 0,
    cancelled_registrations INT DEFAULT 0,
    male_participants INT DEFAULT 0,
    female_participants INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Insert initial stats for the event
INSERT INTO event_stats (event_id) VALUES (1);

-- Custom Registration ID Generation System
-- Function to generate custom registration IDs starting with 01001
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

-- Trigger to automatically generate registration_id on insert
DELIMITER $$

CREATE TRIGGER generate_participant_registration_id
BEFORE INSERT ON participants
FOR EACH ROW
BEGIN
    IF NEW.registration_id IS NULL OR NEW.registration_id = '' THEN
        SET NEW.registration_id = generate_registration_id();
    END IF;
END$$

DELIMITER ;

-- Migration script for existing databases (if participants table already exists)
-- Run this if you need to add whatsapp_profile_name column to existing table
-- ALTER TABLE participants ADD COLUMN whatsapp_profile_name VARCHAR(100) NULL AFTER full_name;

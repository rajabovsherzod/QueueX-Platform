-- E-Queue Multi-Tenant SaaS Database Schema
-- Created for queue management system

-- Companies table (Tenant isolation)
CREATE TABLE companies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    primary_color VARCHAR(7) DEFAULT '#1e3a8a',
    secondary_color VARCHAR(7) DEFAULT '#059669',
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_plan ENUM('basic', 'premium', 'enterprise') DEFAULT 'basic',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Branches/Filials table
CREATE TABLE branches (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    company_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    phone VARCHAR(20),
    working_hours JSON, -- {"monday": {"start": "09:00", "end": "18:00"}, ...}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_company_branches (company_id)
);

-- Users table (Multi-role)
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('SUPER_ADMIN', 'COMPANY_ADMIN', 'OPERATOR', 'CUSTOMER') NOT NULL,
    company_id BIGINT NULL, -- NULL for SUPER_ADMIN and CUSTOMER
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_company_users (company_id, role)
);

-- Services table
CREATE TABLE services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    company_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_duration INT DEFAULT 15, -- minutes
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_company_services (company_id)
);

-- Operators table (Junction table for users and their assignments)
CREATE TABLE operators (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    branch_id BIGINT NOT NULL,
    window_number VARCHAR(10), -- "1", "A1", "Kassa-1"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_branch (user_id, branch_id),
    INDEX idx_branch_operators (branch_id)
);

-- Operator Services (Many-to-many relationship)
CREATE TABLE operator_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    operator_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (operator_id) REFERENCES operators(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE KEY unique_operator_service (operator_id, service_id)
);

-- Queues table (Individual queue tickets)
CREATE TABLE queues (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_number VARCHAR(20) NOT NULL, -- "A001", "B015"
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    customer_id BIGINT NULL, -- NULL for walk-in customers
    branch_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    operator_id BIGINT NULL, -- Assigned operator
    
    -- Customer info (for walk-ins or backup)
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    
    -- Queue status and timing
    status ENUM('WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'WAITING',
    priority INT DEFAULT 0, -- Higher number = higher priority
    estimated_service_time TIMESTAMP NULL,
    called_at TIMESTAMP NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    -- Booking info
    is_online_booking BOOLEAN DEFAULT FALSE,
    booking_date DATE,
    booking_time TIME,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (operator_id) REFERENCES operators(id) ON DELETE SET NULL,
    
    INDEX idx_branch_service_status (branch_id, service_id, status),
    INDEX idx_customer_queues (customer_id),
    INDEX idx_operator_queues (operator_id),
    INDEX idx_booking_date (booking_date, booking_time),
    INDEX idx_qr_code (qr_code)
);

-- Queue History (for analytics and reporting)
CREATE TABLE queue_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    queue_id BIGINT NOT NULL,
    status_from ENUM('WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'),
    status_to ENUM('WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'),
    operator_id BIGINT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (queue_id) REFERENCES queues(id) ON DELETE CASCADE,
    FOREIGN KEY (operator_id) REFERENCES operators(id) ON DELETE SET NULL,
    INDEX idx_queue_history (queue_id)
);

-- Notifications table
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NULL,
    queue_id BIGINT NULL,
    type ENUM('SMS', 'EMAIL', 'PUSH', 'SYSTEM') NOT NULL,
    title VARCHAR(255),
    message TEXT NOT NULL,
    recipient_phone VARCHAR(20),
    recipient_email VARCHAR(255),
    status ENUM('PENDING', 'SENT', 'FAILED') DEFAULT 'PENDING',
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (queue_id) REFERENCES queues(id) ON DELETE SET NULL,
    INDEX idx_user_notifications (user_id),
    INDEX idx_status_type (status, type)
);

-- System Settings (per company)
CREATE TABLE company_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    company_id BIGINT NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_setting (company_id, setting_key)
);

-- Insert default Super Admin
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES ('admin@e-queue.uz', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super', 'Admin', 'SUPER_ADMIN');

-- Sample data for testing
INSERT INTO companies (name, slug, contact_email, contact_phone, address) VALUES 
('Hamkorbank', 'hamkorbank', 'info@hamkorbank.uz', '+998712345678', 'Toshkent, Amir Temur ko\'chasi'),
('Kapital Bank', 'kapitalbank', 'info@kapitalbank.uz', '+998712345679', 'Toshkent, Mustaqillik ko\'chasi');

-- =====================================================================
-- V3: Free & Paid Internships, Eligibility Requirements, and Payment Gateway Integration
-- =====================================================================

-- 1. Extend internships table for Free & Paid internship configuration
ALTER TABLE internships 
    MODIFY COLUMN internship_type VARCHAR(50) NOT NULL DEFAULT 'FREE',
    ADD COLUMN IF NOT EXISTS internship_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER stipend_currency,
    ADD COLUMN IF NOT EXISTS currency VARCHAR(10) NOT NULL DEFAULT 'INR' AFTER internship_fee,
    ADD COLUMN IF NOT EXISTS refund_policy TEXT AFTER currency,
    ADD COLUMN IF NOT EXISTS payment_deadline DATE AFTER application_deadline;

-- 2. Create internship_eligibility table for structured academic criteria
CREATE TABLE IF NOT EXISTS internship_eligibility (
    id                             BIGINT AUTO_INCREMENT PRIMARY KEY,
    internship_id                  BIGINT NOT NULL UNIQUE,
    minimum_cgpa                   DECIMAL(4,2),
    minimum_percentage             DECIMAL(5,2),
    eligible_degrees               VARCHAR(500),
    eligible_departments           VARCHAR(500),
    eligible_semesters             VARCHAR(100),
    minimum_semester               INT,
    required_skills                VARCHAR(500),
    required_certifications        VARCHAR(500),
    resume_required                BOOLEAN NOT NULL DEFAULT TRUE,
    academic_document_requirements VARCHAR(500),
    additional_conditions          TEXT,
    created_at                     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_elig_internship FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    INDEX idx_elig_internship (internship_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Extend applications table for eligibility verification and payment tracking
ALTER TABLE applications
    MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
    ADD COLUMN IF NOT EXISTS eligibility_status VARCHAR(50) NOT NULL DEFAULT 'ELIGIBLE' AFTER status,
    ADD COLUMN IF NOT EXISTS selected_at DATETIME AFTER eligibility_status,
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) NOT NULL DEFAULT 'NOT_APPLICABLE' AFTER selected_at,
    ADD COLUMN IF NOT EXISTS enrolled_at DATETIME AFTER payment_status,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT AFTER enrolled_at;

-- 4. Create payments table for Razorpay gateway tracking & idempotency
CREATE TABLE IF NOT EXISTS payments (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id        BIGINT NOT NULL,
    student_id            BIGINT NOT NULL,
    company_id            BIGINT NOT NULL,
    internship_id         BIGINT NOT NULL,
    amount                DECIMAL(10,2) NOT NULL,
    currency              VARCHAR(10) NOT NULL DEFAULT 'INR',
    payment_gateway       VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY',
    gateway_order_id      VARCHAR(100),
    gateway_payment_id    VARCHAR(100),
    gateway_signature     VARCHAR(255),
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    payment_status        VARCHAR(50) NOT NULL DEFAULT 'INITIATED',
    paid_at               DATETIME,
    failure_reason        VARCHAR(255),
    receipt_url           VARCHAR(500),
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pay_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pay_student     FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pay_company     FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pay_internship  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE RESTRICT,
    INDEX idx_pay_app (application_id),
    INDEX idx_pay_student (student_id),
    INDEX idx_pay_company (company_id),
    INDEX idx_pay_order (gateway_order_id),
    INDEX idx_pay_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create refunds table for tracking refund requests and settlements
CREATE TABLE IF NOT EXISTS refunds (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id        BIGINT NOT NULL,
    requested_amount  DECIMAL(10,2) NOT NULL,
    refund_reason     TEXT,
    refund_status     VARCHAR(50) NOT NULL DEFAULT 'REQUESTED',
    gateway_refund_id VARCHAR(100),
    admin_notes       TEXT,
    processed_at      DATETIME,
    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ref_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE RESTRICT,
    INDEX idx_ref_payment (payment_id),
    INDEX idx_ref_status (refund_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

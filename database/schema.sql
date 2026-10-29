-- =====================================================================
-- Intern Desk Database Schema
-- V1 - Core Tables: users, student_profiles, companies, internships
-- =====================================================================

CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    role        ENUM('STUDENT', 'COMPANY', 'ADMIN') NOT NULL,
    account_status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION') NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at DATETIME,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_status (account_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Student Profiles
-- =====================================================================
CREATE TABLE IF NOT EXISTS student_profiles (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT NOT NULL UNIQUE,
    registration_number VARCHAR(50) UNIQUE,
    date_of_birth       DATE,
    gender              ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'),
    profile_photo_path  VARCHAR(500),
    college_name        VARCHAR(200),
    university_name     VARCHAR(200),
    department          VARCHAR(100),
    degree              VARCHAR(100),
    specialization      VARCHAR(100),
    current_semester    TINYINT,
    admission_year      YEAR,
    graduation_year     YEAR,
    cgpa                DECIMAL(4,2),
    backlogs_count      TINYINT DEFAULT 0,
    professional_summary TEXT,
    city                VARCHAR(100),
    state               VARCHAR(100),
    country             VARCHAR(100) DEFAULT 'India',
    postal_code         VARCHAR(20),
    linkedin_url        VARCHAR(500),
    github_url          VARCHAR(500),
    portfolio_url       VARCHAR(500),
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sp_user (user_id),
    INDEX idx_sp_reg (registration_number),
    INDEX idx_sp_grad_year (graduation_year),
    INDEX idx_sp_cgpa (cgpa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_education (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id    BIGINT NOT NULL,
    institution   VARCHAR(200) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    start_year    YEAR,
    end_year      YEAR,
    grade_type    ENUM('CGPA', 'PERCENTAGE', 'GRADE'),
    grade_value   VARCHAR(20),
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_edu_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    INDEX idx_edu_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_skills (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id        BIGINT NOT NULL,
    skill_name        VARCHAR(100) NOT NULL,
    proficiency_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'),
    years_of_experience TINYINT,
    CONSTRAINT fk_skill_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    INDEX idx_skill_student (student_id),
    INDEX idx_skill_name (skill_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_projects (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id   BIGINT NOT NULL,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    technologies VARCHAR(500),
    project_url  VARCHAR(500),
    github_url   VARCHAR(500),
    start_date   DATE,
    end_date     DATE,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_proj_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    INDEX idx_proj_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_experience (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id      BIGINT NOT NULL,
    organization    VARCHAR(200) NOT NULL,
    position        VARCHAR(150) NOT NULL,
    description     TEXT,
    experience_type ENUM('INTERNSHIP', 'PART_TIME', 'FULL_TIME', 'FREELANCE', 'VOLUNTEER'),
    start_date      DATE,
    end_date        DATE,
    is_current      BOOLEAN DEFAULT FALSE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_exp_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    INDEX idx_exp_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_certifications (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id            BIGINT NOT NULL,
    certificate_name      VARCHAR(200) NOT NULL,
    issuing_organization  VARCHAR(200) NOT NULL,
    issue_date            DATE,
    expiry_date           DATE,
    credential_id         VARCHAR(200),
    credential_url        VARCHAR(500),
    file_path             VARCHAR(500),
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cert_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    INDEX idx_cert_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_resumes (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id        BIGINT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename   VARCHAR(255) NOT NULL UNIQUE,
    storage_path      VARCHAR(500) NOT NULL,
    content_type      VARCHAR(100) NOT NULL,
    file_size         BIGINT NOT NULL,
    uploaded_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_primary        BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_resume_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    INDEX idx_resume_student (student_id),
    INDEX idx_resume_primary (student_id, is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Company Profiles
-- =====================================================================
CREATE TABLE IF NOT EXISTS companies (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id               BIGINT NOT NULL UNIQUE,
    company_name          VARCHAR(200) NOT NULL,
    registration_number   VARCHAR(100),
    industry              VARCHAR(100),
    company_size          ENUM('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE'),
    description           TEXT,
    website               VARCHAR(500),
    contact_email         VARCHAR(150),
    contact_phone         VARCHAR(30),
    headquarters_address  TEXT,
    city                  VARCHAR(100),
    state                 VARCHAR(100),
    country               VARCHAR(100) DEFAULT 'India',
    logo_path             VARCHAR(500),
    verification_status   ENUM('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    verified_by           BIGINT,
    verified_at           DATETIME,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_co_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_co_verifier FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_co_user (user_id),
    INDEX idx_co_status (verification_status),
    INDEX idx_co_industry (industry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Internships
-- =====================================================================
CREATE TABLE IF NOT EXISTS internships (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id          BIGINT NOT NULL,
    title               VARCHAR(200) NOT NULL,
    description         TEXT NOT NULL,
    responsibilities    TEXT,
    eligibility_criteria TEXT,
    category            VARCHAR(100),
    internship_type     ENUM('FULL_TIME', 'PART_TIME', 'REMOTE', 'HYBRID') NOT NULL DEFAULT 'FULL_TIME',
    work_mode           ENUM('REMOTE', 'HYBRID', 'ONSITE') NOT NULL DEFAULT 'ONSITE',
    location            VARCHAR(200),
    duration_months     TINYINT,
    stipend_min         DECIMAL(10,2) DEFAULT 0.00,
    stipend_max         DECIMAL(10,2) DEFAULT 0.00,
    stipend_currency    VARCHAR(10) DEFAULT 'INR',
    is_paid             BOOLEAN NOT NULL DEFAULT TRUE,
    openings            SMALLINT DEFAULT 1,
    application_deadline DATE,
    start_date          DATE,
    end_date            DATE,
    minimum_cgpa        DECIMAL(4,2),
    minimum_semester    TINYINT,
    status              ENUM('DRAFT', 'ACTIVE', 'CLOSED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    views_count         INT DEFAULT 0,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_int_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_int_company (company_id),
    INDEX idx_int_status (status),
    INDEX idx_int_category (category),
    INDEX idx_int_work_mode (work_mode),
    INDEX idx_int_deadline (application_deadline),
    FULLTEXT idx_int_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS internship_skills (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    internship_id  BIGINT NOT NULL,
    skill_name     VARCHAR(100) NOT NULL,
    is_required    BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_iskill_internship FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    INDEX idx_iskill_internship (internship_id),
    INDEX idx_iskill_name (skill_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Applications
-- =====================================================================
CREATE TABLE IF NOT EXISTS applications (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id     BIGINT NOT NULL,
    internship_id  BIGINT NOT NULL,
    resume_id      BIGINT,
    cover_letter   TEXT,
    status         ENUM('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN')
                   NOT NULL DEFAULT 'APPLIED',
    applied_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    withdrawn_at   DATETIME,
    CONSTRAINT fk_app_student    FOREIGN KEY (student_id)    REFERENCES student_profiles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_app_internship FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE RESTRICT,
    CONSTRAINT fk_app_resume     FOREIGN KEY (resume_id)     REFERENCES student_resumes(id) ON DELETE SET NULL,
    CONSTRAINT uq_application    UNIQUE (student_id, internship_id),
    INDEX idx_app_student (student_id),
    INDEX idx_app_internship (internship_id),
    INDEX idx_app_status (status),
    INDEX idx_app_applied_at (applied_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS application_status_history (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id   BIGINT NOT NULL,
    previous_status  ENUM('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN'),
    new_status       ENUM('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN') NOT NULL,
    changed_by       BIGINT NOT NULL,
    remarks          TEXT,
    changed_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ash_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_ash_user        FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_ash_application (application_id),
    INDEX idx_ash_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS interviews (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id     BIGINT NOT NULL,
    scheduled_at       DATETIME NOT NULL,
    interview_type     ENUM('ONLINE', 'PHONE', 'IN_PERSON', 'TECHNICAL', 'HR') NOT NULL DEFAULT 'ONLINE',
    meeting_link       VARCHAR(500),
    location           VARCHAR(300),
    interviewer_notes  TEXT,
    outcome            ENUM('PENDING', 'PASSED', 'FAILED', 'NO_SHOW', 'RESCHEDULED') DEFAULT 'PENDING',
    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_iv_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_iv_application (application_id),
    INDEX idx_iv_scheduled (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Notifications
-- =====================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id            BIGINT NOT NULL,
    title              VARCHAR(200) NOT NULL,
    message            TEXT NOT NULL,
    notification_type  ENUM('APPLICATION_STATUS', 'INTERVIEW_SCHEDULED', 'INTERNSHIP_CLOSED',
                            'COMPANY_VERIFIED', 'SYSTEM', 'NEW_APPLICATION') NOT NULL DEFAULT 'SYSTEM',
    related_entity_id  BIGINT,
    related_entity_type VARCHAR(50),
    is_read            BOOLEAN NOT NULL DEFAULT FALSE,
    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at            DATETIME,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id),
    INDEX idx_notif_unread (user_id, is_read),
    INDEX idx_notif_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Saved Internships
-- =====================================================================
CREATE TABLE IF NOT EXISTS saved_internships (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id     BIGINT NOT NULL,
    internship_id  BIGINT NOT NULL,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_student    FOREIGN KEY (student_id)   REFERENCES student_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_internship FOREIGN KEY (internship_id) REFERENCES internships(id)     ON DELETE CASCADE,
    CONSTRAINT uq_saved            UNIQUE (student_id, internship_id),
    INDEX idx_saved_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Company Verifications (Audit trail for admin actions)
-- =====================================================================
CREATE TABLE IF NOT EXISTS company_verifications (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id  BIGINT NOT NULL,
    admin_id    BIGINT NOT NULL,
    status      ENUM('APPROVED', 'REJECTED', 'SUSPENDED') NOT NULL,
    remarks     TEXT,
    reviewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cv_company FOREIGN KEY (company_id) REFERENCES companies(id)  ON DELETE CASCADE,
    CONSTRAINT fk_cv_admin   FOREIGN KEY (admin_id)   REFERENCES users(id)       ON DELETE RESTRICT,
    INDEX idx_cv_company (company_id),
    INDEX idx_cv_reviewed (reviewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Admin Actions / Audit Log
-- =====================================================================
CREATE TABLE IF NOT EXISTS admin_actions (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_user_id  BIGINT NOT NULL,
    action_type    VARCHAR(100) NOT NULL,
    entity_type    VARCHAR(100),
    entity_id      BIGINT,
    description    TEXT,
    ip_address     VARCHAR(45),
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aa_admin FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_aa_admin (admin_user_id),
    INDEX idx_aa_entity (entity_type, entity_id),
    INDEX idx_aa_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Refresh Tokens
-- =====================================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL UNIQUE,
    token      VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_rt_token (token),
    INDEX idx_rt_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

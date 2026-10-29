-- =====================================================================
-- V2 - Seed Data (Development Only)
-- Companies, Students, Internships, Applications, Notifications
-- Seed users have password: "Password@123" (BCrypt hashed)
-- BCrypt hash of "Password@123":
-- $2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e
-- =====================================================================

-- -------------------------------------------------------------------
-- Admin user
-- -------------------------------------------------------------------
INSERT INTO users (full_name, email, password_hash, phone, role, account_status, email_verified)
VALUES (
    'Intern Desk Admin',
    'admin@interndesk.com',
    '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e',
    '+91-9000000000',
    'ADMIN',
    'ACTIVE',
    TRUE
);

-- -------------------------------------------------------------------
-- Company users (5 companies)
-- -------------------------------------------------------------------
INSERT INTO users (full_name, email, password_hash, phone, role, account_status, email_verified)
VALUES
    ('TechNova Hiring', 'hr@technova.io', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9001000001', 'COMPANY', 'ACTIVE', TRUE),
    ('DataSphere Careers', 'careers@datasphere.ai', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9001000002', 'COMPANY', 'ACTIVE', TRUE),
    ('GreenBuild Solutions', 'recruit@greenbuild.in', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9001000003', 'COMPANY', 'ACTIVE', TRUE),
    ('FinLedger Corp', 'jobs@finledger.com', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9001000004', 'COMPANY', 'ACTIVE', TRUE),
    ('PixelForge Studio', 'talent@pixelforge.design', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9001000005', 'COMPANY', 'ACTIVE', TRUE);

-- -------------------------------------------------------------------
-- Student users (8 students)
-- -------------------------------------------------------------------
INSERT INTO users (full_name, email, password_hash, phone, role, account_status, email_verified)
VALUES
    ('Arjun Sharma', 'arjun.sharma@student.edu', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9100000001', 'STUDENT', 'ACTIVE', TRUE),
    ('Priya Nair', 'priya.nair@student.edu', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9100000002', 'STUDENT', 'ACTIVE', TRUE),
    ('Rahul Verma', 'rahul.verma@student.edu', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9100000003', 'STUDENT', 'ACTIVE', TRUE),
    ('Sneha Iyer', 'sneha.iyer@student.edu', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9100000004', 'STUDENT', 'ACTIVE', TRUE),
    ('Karan Mehta', 'karan.mehta@student.edu', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9100000005', 'STUDENT', 'ACTIVE', TRUE),
    ('Ananya Das', 'ananya.das@student.edu', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9100000006', 'STUDENT', 'ACTIVE', TRUE),
    ('Vikram Reddy', 'vikram.reddy@student.edu', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9100000007', 'STUDENT', 'ACTIVE', TRUE),
    ('Meera Patel', 'meera.patel@student.edu', '$2a$12$ckICtTh485kJ7AXbjnTmC.zteNtSndijaM/N66vEM8cPgb5J28L.e', '+91-9100000008', 'STUDENT', 'ACTIVE', TRUE);

-- -------------------------------------------------------------------
-- Company profiles
-- -------------------------------------------------------------------
INSERT INTO companies (user_id, company_name, registration_number, industry, company_size, description, website, contact_email, contact_phone, headquarters_address, city, state, country, verification_status, verified_by, verified_at)
SELECT u.id, 'TechNova Solutions', 'CIN2019TN0001', 'Information Technology', 'MEDIUM',
    'TechNova is a fast-growing SaaS company building developer tools and cloud-native platforms. We offer meaningful internships with real product impact.',
    'https://technova.io', 'hr@technova.io', '+91-9001000001',
    '14th Floor, Tech Tower, Whitefield', 'Bengaluru', 'Karnataka', 'India',
    'VERIFIED', (SELECT id FROM users WHERE email = 'admin@interndesk.com' LIMIT 1), NOW()
FROM users u WHERE u.email = 'hr@technova.io';

INSERT INTO companies (user_id, company_name, registration_number, industry, company_size, description, website, contact_email, contact_phone, headquarters_address, city, state, country, verification_status, verified_by, verified_at)
SELECT u.id, 'DataSphere AI', 'CIN2020DS0002', 'Artificial Intelligence', 'STARTUP',
    'DataSphere builds enterprise AI and machine learning platforms. Our interns work on real ML pipelines, data engineering, and model deployment.',
    'https://datasphere.ai', 'careers@datasphere.ai', '+91-9001000002',
    'Innovation Hub, Koramangala 5th Block', 'Bengaluru', 'Karnataka', 'India',
    'VERIFIED', (SELECT id FROM users WHERE email = 'admin@interndesk.com' LIMIT 1), NOW()
FROM users u WHERE u.email = 'careers@datasphere.ai';

INSERT INTO companies (user_id, company_name, registration_number, industry, company_size, description, website, contact_email, contact_phone, headquarters_address, city, state, country, verification_status, verified_by, verified_at)
SELECT u.id, 'GreenBuild Solutions', 'CIN2018GB0003', 'Sustainable Construction', 'LARGE',
    'GreenBuild is a leader in sustainable architecture and smart infrastructure. We welcome civil, environmental and software engineering interns.',
    'https://greenbuild.in', 'recruit@greenbuild.in', '+91-9001000003',
    'Green Tower, Bandra Kurla Complex', 'Mumbai', 'Maharashtra', 'India',
    'VERIFIED', (SELECT id FROM users WHERE email = 'admin@interndesk.com' LIMIT 1), NOW()
FROM users u WHERE u.email = 'recruit@greenbuild.in';

INSERT INTO companies (user_id, company_name, registration_number, industry, company_size, description, website, contact_email, contact_phone, headquarters_address, city, state, country, verification_status, verified_by, verified_at)
SELECT u.id, 'FinLedger Corp', 'CIN2017FL0004', 'FinTech', 'ENTERPRISE',
    'FinLedger powers payments and banking for 50M+ users. Our internship program spans backend, mobile, compliance, and product management.',
    'https://finledger.com', 'jobs@finledger.com', '+91-9001000004',
    'Level 21, One World Centre', 'Mumbai', 'Maharashtra', 'India',
    'VERIFIED', (SELECT id FROM users WHERE email = 'admin@interndesk.com' LIMIT 1), NOW()
FROM users u WHERE u.email = 'jobs@finledger.com';

INSERT INTO companies (user_id, company_name, registration_number, industry, company_size, description, website, contact_email, contact_phone, headquarters_address, city, state, country, verification_status, verified_by, verified_at)
SELECT u.id, 'PixelForge Studio', 'CIN2021PF0005', 'Design & Creative', 'SMALL',
    'PixelForge is a design studio creating world-class digital products, brand identities, and interactive experiences.',
    'https://pixelforge.design', 'talent@pixelforge.design', '+91-9001000005',
    'Studio 8, DLF Cyber City', 'Gurugram', 'Haryana', 'India',
    'VERIFIED', (SELECT id FROM users WHERE email = 'admin@interndesk.com' LIMIT 1), NOW()
FROM users u WHERE u.email = 'talent@pixelforge.design';

-- -------------------------------------------------------------------
-- Student profiles
-- -------------------------------------------------------------------
INSERT INTO student_profiles (user_id, registration_number, date_of_birth, gender, college_name, university_name, department, degree, specialization, current_semester, admission_year, graduation_year, cgpa, professional_summary, city, state, country, linkedin_url, github_url)
SELECT u.id, 'STU2024001', '2003-05-12', 'MALE', 'RV College of Engineering', 'VTU Belagavi', 'Computer Science', 'B.Tech', 'Software Engineering', 7, 2021, 2025, 8.7,
    'Passionate full-stack developer with strong fundamentals in Java, Spring Boot and React. Looking for challenging internship in product companies.',
    'Bengaluru', 'Karnataka', 'India', 'https://linkedin.com/in/arjunsharma', 'https://github.com/arjunsharma'
FROM users u WHERE u.email = 'arjun.sharma@student.edu';

INSERT INTO student_profiles (user_id, registration_number, date_of_birth, gender, college_name, university_name, department, degree, specialization, current_semester, admission_year, graduation_year, cgpa, professional_summary, city, state, country, linkedin_url, github_url)
SELECT u.id, 'STU2024002', '2003-08-25', 'FEMALE', 'PSG College of Technology', 'Anna University', 'Data Science', 'B.E.', 'Machine Learning', 7, 2021, 2025, 9.1,
    'ML enthusiast with hands-on experience in Python, TensorFlow and NLP. Published one paper on sentiment analysis.',
    'Coimbatore', 'Tamil Nadu', 'India', 'https://linkedin.com/in/priyanair', 'https://github.com/priyanair'
FROM users u WHERE u.email = 'priya.nair@student.edu';

INSERT INTO student_profiles (user_id, registration_number, date_of_birth, gender, college_name, university_name, department, degree, specialization, current_semester, admission_year, graduation_year, cgpa, professional_summary, city, state, country, github_url)
SELECT u.id, 'STU2024003', '2002-12-01', 'MALE', 'BITS Pilani', 'BITS Pilani', 'Electronics & CS', 'B.E.', 'Embedded Systems', 8, 2020, 2025, 7.9,
    'Embedded systems and IoT developer. Experience with STM32, RTOS and cloud connectivity.',
    'Pilani', 'Rajasthan', 'India', 'https://github.com/rahulverma'
FROM users u WHERE u.email = 'rahul.verma@student.edu';

INSERT INTO student_profiles (user_id, registration_number, date_of_birth, gender, college_name, university_name, department, degree, specialization, current_semester, admission_year, graduation_year, cgpa, professional_summary, city, state, country)
SELECT u.id, 'STU2024004', '2003-03-17', 'FEMALE', 'NIT Trichy', 'NIT Trichy', 'Information Technology', 'B.Tech', 'Cybersecurity', 7, 2021, 2025, 8.4,
    'Security researcher focused on web application security, penetration testing and CTF competitions. CEH certified.',
    'Trichy', 'Tamil Nadu', 'India'
FROM users u WHERE u.email = 'sneha.iyer@student.edu';

INSERT INTO student_profiles (user_id, registration_number, date_of_birth, gender, college_name, university_name, department, degree, specialization, current_semester, admission_year, graduation_year, cgpa, professional_summary, city, state, country)
SELECT u.id, 'STU2024005', '2004-01-30', 'MALE', 'IIT Bombay', 'IIT Bombay', 'Computer Science', 'B.Tech', 'Distributed Systems', 6, 2022, 2026, 8.9,
    'Systems programmer interested in distributed computing, databases and cloud infrastructure.',
    'Mumbai', 'Maharashtra', 'India'
FROM users u WHERE u.email = 'karan.mehta@student.edu';

INSERT INTO student_profiles (user_id, registration_number, date_of_birth, gender, college_name, university_name, department, degree, specialization, current_semester, admission_year, graduation_year, cgpa, professional_summary, city, state, country)
SELECT u.id, 'STU2024006', '2003-07-08', 'FEMALE', 'Jadavpur University', 'Jadavpur University', 'Computer Engineering', 'B.E.', 'AI & Robotics', 7, 2021, 2025, 8.2,
    'Robotics and AI developer. Experience with ROS, Python and computer vision.',
    'Kolkata', 'West Bengal', 'India'
FROM users u WHERE u.email = 'ananya.das@student.edu';

INSERT INTO student_profiles (user_id, registration_number, date_of_birth, gender, college_name, university_name, department, degree, specialization, current_semester, admission_year, graduation_year, cgpa, professional_summary, city, state, country)
SELECT u.id, 'STU2024007', '2002-11-15', 'MALE', 'IIIT Hyderabad', 'IIIT Hyderabad', 'Computer Science', 'B.Tech', 'NLP & LLMs', 8, 2020, 2025, 9.3,
    'NLP researcher with expertise in transformer models, RAG pipelines and LLM fine-tuning.',
    'Hyderabad', 'Telangana', 'India'
FROM users u WHERE u.email = 'vikram.reddy@student.edu';

INSERT INTO student_profiles (user_id, registration_number, date_of_birth, gender, college_name, university_name, department, degree, specialization, current_semester, admission_year, graduation_year, cgpa, professional_summary, city, state, country)
SELECT u.id, 'STU2024008', '2003-09-22', 'FEMALE', 'SCMHRD Pune', 'Symbiosis International', 'Business Analytics', 'MBA', 'Product Management', 3, 2022, 2024, 7.6,
    'Product management intern with experience in user research, roadmapping and agile methodologies.',
    'Pune', 'Maharashtra', 'India'
FROM users u WHERE u.email = 'meera.patel@student.edu';

-- -------------------------------------------------------------------
-- Student skills
-- -------------------------------------------------------------------
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_of_experience)
SELECT sp.id, skill, level, exp FROM student_profiles sp
JOIN users u ON u.id = sp.user_id,
(SELECT 'Java' AS skill, 'ADVANCED' AS level, 3 AS exp UNION ALL
 SELECT 'Spring Boot', 'INTERMEDIATE', 1 UNION ALL
 SELECT 'React', 'INTERMEDIATE', 2 UNION ALL
 SELECT 'MySQL', 'INTERMEDIATE', 2) skills
WHERE u.email = 'arjun.sharma@student.edu';

INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_of_experience)
SELECT sp.id, skill, level, exp FROM student_profiles sp
JOIN users u ON u.id = sp.user_id,
(SELECT 'Python' AS skill, 'ADVANCED' AS level, 3 AS exp UNION ALL
 SELECT 'TensorFlow', 'ADVANCED', 2 UNION ALL
 SELECT 'NLP', 'INTERMEDIATE', 2 UNION ALL
 SELECT 'SQL', 'INTERMEDIATE', 2) skills
WHERE u.email = 'priya.nair@student.edu';

-- -------------------------------------------------------------------
-- Internships (10 listings)
-- -------------------------------------------------------------------
INSERT INTO internships (company_id, title, description, responsibilities, eligibility_criteria, category, internship_type, work_mode, location, duration_months, stipend_min, stipend_max, is_paid, openings, application_deadline, start_date, minimum_cgpa, minimum_semester, status)
SELECT c.id,
    'Full Stack Developer Intern',
    'Join TechNova as a Full Stack Intern and build production features for our SaaS platform serving 100K+ developers. You will work in a cross-functional agile team.',
    'Develop React frontend components and Spring Boot REST APIs. Participate in code reviews, sprint planning, and product demos.',
    'Final year or pre-final year students from CS/IT disciplines. Strong fundamentals in Java or JavaScript.',
    'Software Development', 'FULL_TIME', 'HYBRID', 'Bengaluru, Karnataka', 3,
    15000.00, 25000.00, TRUE, 3,
    DATE_ADD(CURDATE(), INTERVAL 30 DAY), DATE_ADD(CURDATE(), INTERVAL 45 DAY),
    7.5, 5, 'ACTIVE'
FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'hr@technova.io';

INSERT INTO internships (company_id, title, description, responsibilities, eligibility_criteria, category, internship_type, work_mode, location, duration_months, stipend_min, stipend_max, is_paid, openings, application_deadline, start_date, minimum_cgpa, minimum_semester, status)
SELECT c.id,
    'Machine Learning Engineer Intern',
    'DataSphere is looking for passionate ML interns to work on cutting-edge NLP and computer vision projects that power enterprise AI products.',
    'Build and evaluate ML models. Work on data pipelines using Apache Spark and MLflow. Collaborate with senior ML engineers.',
    'Students from CS, Data Science or Statistics backgrounds with Python and ML frameworks knowledge.',
    'Artificial Intelligence', 'FULL_TIME', 'REMOTE', 'Remote', 6,
    20000.00, 35000.00, TRUE, 2,
    DATE_ADD(CURDATE(), INTERVAL 20 DAY), DATE_ADD(CURDATE(), INTERVAL 35 DAY),
    8.0, 6, 'ACTIVE'
FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'careers@datasphere.ai';

INSERT INTO internships (company_id, title, description, responsibilities, eligibility_criteria, category, internship_type, work_mode, location, duration_months, stipend_min, stipend_max, is_paid, openings, application_deadline, start_date, minimum_cgpa, minimum_semester, status)
SELECT c.id,
    'Data Engineering Intern',
    'Build and optimize data infrastructure at DataSphere. Work with petabyte-scale datasets, real-time streaming, and data warehouse solutions.',
    'Design ETL pipelines. Work with Kafka, Spark, and Databricks. Write efficient SQL and optimize query performance.',
    'CS or Data Engineering background. Familiarity with SQL and at least one distributed computing framework.',
    'Data Engineering', 'FULL_TIME', 'HYBRID', 'Bengaluru, Karnataka', 4,
    18000.00, 30000.00, TRUE, 2,
    DATE_ADD(CURDATE(), INTERVAL 25 DAY), DATE_ADD(CURDATE(), INTERVAL 40 DAY),
    7.5, 5, 'ACTIVE'
FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'careers@datasphere.ai';

INSERT INTO internships (company_id, title, description, responsibilities, eligibility_criteria, category, internship_type, work_mode, location, duration_months, stipend_min, stipend_max, is_paid, openings, application_deadline, start_date, minimum_cgpa, minimum_semester, status)
SELECT c.id,
    'Backend API Developer Intern',
    'Help build and scale TechNova''s microservices backend. Work with distributed systems, message queues, and cloud infrastructure.',
    'Design and implement REST APIs. Write unit and integration tests. Monitor API performance using Grafana.',
    'Strong Java knowledge required. Familiarity with Spring Boot and databases preferred.',
    'Software Development', 'FULL_TIME', 'ONSITE', 'Bengaluru, Karnataka', 3,
    12000.00, 20000.00, TRUE, 4,
    DATE_ADD(CURDATE(), INTERVAL 35 DAY), DATE_ADD(CURDATE(), INTERVAL 50 DAY),
    7.0, 5, 'ACTIVE'
FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'hr@technova.io';

INSERT INTO internships (company_id, title, description, responsibilities, eligibility_criteria, category, internship_type, work_mode, location, duration_months, stipend_min, stipend_max, is_paid, openings, application_deadline, start_date, minimum_cgpa, minimum_semester, status)
SELECT c.id,
    'UI/UX Design Intern',
    'PixelForge is seeking a creative design intern to join our studio and contribute to brand identity and digital product design projects.',
    'Design wireframes, prototypes and final UI in Figma. Conduct user research. Collaborate with developers for handoff.',
    'Design or HCI students. Strong portfolio required. Proficiency in Figma essential.',
    'Design', 'FULL_TIME', 'HYBRID', 'Gurugram, Haryana', 3,
    10000.00, 18000.00, TRUE, 2,
    DATE_ADD(CURDATE(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 30 DAY),
    NULL, 4, 'ACTIVE'
FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'talent@pixelforge.design';

INSERT INTO internships (company_id, title, description, responsibilities, eligibility_criteria, category, internship_type, work_mode, location, duration_months, stipend_min, stipend_max, is_paid, openings, application_deadline, start_date, minimum_cgpa, minimum_semester, status)
SELECT c.id,
    'FinTech Product Management Intern',
    'FinLedger is looking for a sharp PM intern to assist in roadmap planning, competitive analysis, and feature specification for our payments platform.',
    'Write PRDs, conduct user interviews, analyze metrics, coordinate with engineering and design teams.',
    'MBA or senior undergrad in CS/Business. Strong analytical thinking and communication skills.',
    'Product Management', 'FULL_TIME', 'HYBRID', 'Mumbai, Maharashtra', 2,
    25000.00, 40000.00, TRUE, 1,
    DATE_ADD(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 25 DAY),
    NULL, NULL, 'ACTIVE'
FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'jobs@finledger.com';

INSERT INTO internships (company_id, title, description, responsibilities, eligibility_criteria, category, internship_type, work_mode, location, duration_months, stipend_min, stipend_max, is_paid, openings, application_deadline, start_date, minimum_cgpa, minimum_semester, status)
SELECT c.id,
    'Cybersecurity Intern',
    'FinLedger''s security team is hiring interns to assist in vulnerability assessments, SIEM monitoring, and compliance automation for our payment infrastructure.',
    'Conduct penetration testing, review code for security issues, assist in SOC2 compliance documentation.',
    'CS/IT students with knowledge of OWASP Top 10, network security and scripting languages.',
    'Cybersecurity', 'FULL_TIME', 'ONSITE', 'Mumbai, Maharashtra', 3,
    20000.00, 30000.00, TRUE, 2,
    DATE_ADD(CURDATE(), INTERVAL 28 DAY), DATE_ADD(CURDATE(), INTERVAL 42 DAY),
    7.5, 6, 'ACTIVE'
FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'jobs@finledger.com';

INSERT INTO internships (company_id, title, description, responsibilities, eligibility_criteria, category, internship_type, work_mode, location, duration_months, stipend_min, stipend_max, is_paid, openings, application_deadline, start_date, minimum_cgpa, minimum_semester, status)
SELECT c.id,
    'Site Reliability Engineering Intern',
    'GreenBuild is modernizing its infrastructure and needs SRE interns to help migrate workloads to Kubernetes, implement monitoring, and improve CI/CD pipelines.',
    'Deploy and manage Kubernetes clusters. Write infrastructure-as-code using Terraform. Configure Prometheus and Grafana.',
    'DevOps or CS background. Linux, Docker and networking fundamentals required.',
    'DevOps & Cloud', 'FULL_TIME', 'HYBRID', 'Mumbai, Maharashtra', 4,
    15000.00, 22000.00, TRUE, 3,
    DATE_ADD(CURDATE(), INTERVAL 22 DAY), DATE_ADD(CURDATE(), INTERVAL 38 DAY),
    7.0, 5, 'ACTIVE'
FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'recruit@greenbuild.in';

INSERT INTO internships (company_id, title, description, responsibilities, eligibility_criteria, category, internship_type, work_mode, location, duration_months, stipend_min, stipend_max, is_paid, openings, application_deadline, start_date, minimum_cgpa, minimum_semester, status)
SELECT c.id,
    'React Native Mobile Developer Intern',
    'TechNova''s mobile team is expanding. Join as a React Native intern and help build features for our developer-facing mobile application.',
    'Build and maintain React Native components. Write Jest unit tests. Collaborate with design on pixel-perfect implementation.',
    'CS/IT students with JavaScript fundamentals. React or React Native experience is a plus.',
    'Mobile Development', 'FULL_TIME', 'REMOTE', 'Remote (India)', 3,
    12000.00, 20000.00, TRUE, 2,
    DATE_ADD(CURDATE(), INTERVAL 18 DAY), DATE_ADD(CURDATE(), INTERVAL 32 DAY),
    7.0, 4, 'ACTIVE'
FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'hr@technova.io';

INSERT INTO internships (company_id, title, description, responsibilities, eligibility_criteria, category, internship_type, work_mode, location, duration_months, stipend_min, stipend_max, is_paid, openings, application_deadline, start_date, minimum_cgpa, minimum_semester, status)
SELECT c.id,
    'Graphic Design & Motion Intern',
    'PixelForge is seeking a motion design intern to create stunning brand animations, explainer videos, and social content for global clients.',
    'Create motion graphics using After Effects. Animate Lottie files for web/app. Collaborate on visual brand projects.',
    'Design students with After Effects experience. Portfolio of animation work required.',
    'Design', 'PART_TIME', 'REMOTE', 'Remote', 3,
    0.00, 0.00, FALSE, 1,
    DATE_ADD(CURDATE(), INTERVAL 12 DAY), DATE_ADD(CURDATE(), INTERVAL 25 DAY),
    NULL, NULL, 'ACTIVE'
FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'talent@pixelforge.design';

-- -------------------------------------------------------------------
-- Internship skills
-- -------------------------------------------------------------------
INSERT INTO internship_skills (internship_id, skill_name, is_required)
SELECT i.id, skill, req FROM internships i,
(SELECT 'Java' AS skill, TRUE AS req UNION ALL SELECT 'Spring Boot', TRUE UNION ALL SELECT 'React', FALSE UNION ALL SELECT 'MySQL', TRUE) s
WHERE i.title = 'Full Stack Developer Intern';

INSERT INTO internship_skills (internship_id, skill_name, is_required)
SELECT i.id, skill, req FROM internships i,
(SELECT 'Python' AS skill, TRUE AS req UNION ALL SELECT 'TensorFlow' , TRUE UNION ALL SELECT 'NLP', FALSE UNION ALL SELECT 'PyTorch', FALSE) s
WHERE i.title = 'Machine Learning Engineer Intern';

INSERT INTO internship_skills (internship_id, skill_name, is_required)
SELECT i.id, skill, req FROM internships i,
(SELECT 'Figma' AS skill, TRUE AS req UNION ALL SELECT 'User Research', TRUE UNION ALL SELECT 'Prototyping', TRUE) s
WHERE i.title = 'UI/UX Design Intern';

-- -------------------------------------------------------------------
-- Sample Applications in various states
-- -------------------------------------------------------------------

-- Arjun applied to Full Stack role (SHORTLISTED)
INSERT INTO applications (student_id, internship_id, cover_letter, status, applied_at)
SELECT sp.id, i.id,
    'I am extremely passionate about full-stack development and have built several production-grade applications using Spring Boot and React. I would love to contribute to TechNova''s platform.',
    'SHORTLISTED', DATE_SUB(NOW(), INTERVAL 10 DAY)
FROM student_profiles sp JOIN users u ON u.id = sp.user_id, internships i
WHERE u.email = 'arjun.sharma@student.edu' AND i.title = 'Full Stack Developer Intern';

-- Arjun applied to Backend role (UNDER_REVIEW)
INSERT INTO applications (student_id, internship_id, cover_letter, status, applied_at)
SELECT sp.id, i.id,
    'My strong foundation in Java and experience with distributed systems makes me an ideal candidate for this backend role.',
    'UNDER_REVIEW', DATE_SUB(NOW(), INTERVAL 7 DAY)
FROM student_profiles sp JOIN users u ON u.id = sp.user_id, internships i
WHERE u.email = 'arjun.sharma@student.edu' AND i.title = 'Backend API Developer Intern';

-- Priya applied to ML role (INTERVIEW)
INSERT INTO applications (student_id, internship_id, cover_letter, status, applied_at)
SELECT sp.id, i.id,
    'As an ML researcher with published NLP work and hands-on TensorFlow experience, I am well-positioned to make immediate contributions to DataSphere''s AI projects.',
    'INTERVIEW', DATE_SUB(NOW(), INTERVAL 14 DAY)
FROM student_profiles sp JOIN users u ON u.id = sp.user_id, internships i
WHERE u.email = 'priya.nair@student.edu' AND i.title = 'Machine Learning Engineer Intern';

-- Sneha applied to Cybersecurity (APPLIED)
INSERT INTO applications (student_id, internship_id, cover_letter, status, applied_at)
SELECT sp.id, i.id,
    'My CEH certification and CTF experience make me an ideal cybersecurity intern candidate.',
    'APPLIED', DATE_SUB(NOW(), INTERVAL 3 DAY)
FROM student_profiles sp JOIN users u ON u.id = sp.user_id, internships i
WHERE u.email = 'sneha.iyer@student.edu' AND i.title = 'Cybersecurity Intern';

-- Vikram applied to ML (SELECTED)
INSERT INTO applications (student_id, internship_id, cover_letter, status, applied_at)
SELECT sp.id, i.id,
    'My research in NLP and LLM fine-tuning aligns perfectly with DataSphere''s AI mission.',
    'SELECTED', DATE_SUB(NOW(), INTERVAL 20 DAY)
FROM student_profiles sp JOIN users u ON u.id = sp.user_id, internships i
WHERE u.email = 'vikram.reddy@student.edu' AND i.title = 'Machine Learning Engineer Intern';

-- Meera applied to PM role (REJECTED)
INSERT INTO applications (student_id, internship_id, cover_letter, status, applied_at)
SELECT sp.id, i.id,
    'I believe my MBA background and product thinking skills align well with this PM internship.',
    'REJECTED', DATE_SUB(NOW(), INTERVAL 8 DAY)
FROM student_profiles sp JOIN users u ON u.id = sp.user_id, internships i
WHERE u.email = 'meera.patel@student.edu' AND i.title = 'FinTech Product Management Intern';

-- -------------------------------------------------------------------
-- Application status history
-- -------------------------------------------------------------------
INSERT INTO application_status_history (application_id, previous_status, new_status, changed_by, remarks, changed_at)
SELECT a.id, 'APPLIED', 'UNDER_REVIEW', u.id, 'Resume reviewed. Proceeding to shortlisting phase.', DATE_SUB(NOW(), INTERVAL 8 DAY)
FROM applications a
JOIN student_profiles sp ON a.student_id = sp.id
JOIN users su ON su.id = sp.user_id
JOIN companies c ON c.id = (SELECT company_id FROM internships WHERE id = a.internship_id)
JOIN users u ON u.id = c.user_id
WHERE su.email = 'arjun.sharma@student.edu' AND a.status = 'SHORTLISTED';

INSERT INTO application_status_history (application_id, previous_status, new_status, changed_by, remarks, changed_at)
SELECT a.id, 'UNDER_REVIEW', 'SHORTLISTED', u.id, 'Strong profile. Shortlisted for technical interview.', DATE_SUB(NOW(), INTERVAL 5 DAY)
FROM applications a
JOIN student_profiles sp ON a.student_id = sp.id
JOIN users su ON su.id = sp.user_id
JOIN companies c ON c.id = (SELECT company_id FROM internships WHERE id = a.internship_id)
JOIN users u ON u.id = c.user_id
WHERE su.email = 'arjun.sharma@student.edu' AND a.status = 'SHORTLISTED';

-- -------------------------------------------------------------------
-- Notifications
-- -------------------------------------------------------------------
INSERT INTO notifications (user_id, title, message, notification_type, related_entity_id, related_entity_type, is_read)
SELECT u.id, 'Application Shortlisted!',
    'Congratulations! Your application for "Full Stack Developer Intern" at TechNova Solutions has been shortlisted.',
    'APPLICATION_STATUS', a.id, 'APPLICATION', FALSE
FROM users u
JOIN student_profiles sp ON sp.user_id = u.id
JOIN applications a ON a.student_id = sp.id
JOIN internships i ON i.id = a.internship_id
WHERE u.email = 'arjun.sharma@student.edu' AND i.title = 'Full Stack Developer Intern';

INSERT INTO notifications (user_id, title, message, notification_type, related_entity_id, related_entity_type, is_read)
SELECT u.id, 'Interview Scheduled',
    'Your interview for "Machine Learning Engineer Intern" at DataSphere AI has been scheduled. Check your application for details.',
    'INTERVIEW_SCHEDULED', a.id, 'APPLICATION', FALSE
FROM users u
JOIN student_profiles sp ON sp.user_id = u.id
JOIN applications a ON a.student_id = sp.id
JOIN internships i ON i.id = a.internship_id
WHERE u.email = 'priya.nair@student.edu' AND i.title = 'Machine Learning Engineer Intern';

INSERT INTO notifications (user_id, title, message, notification_type, related_entity_id, related_entity_type, is_read)
SELECT u.id, 'New Application Received',
    'A new application has been received for "Full Stack Developer Intern" from Arjun Sharma.',
    'NEW_APPLICATION', a.id, 'APPLICATION', FALSE
FROM users u
JOIN companies c ON c.user_id = u.id
JOIN internships i ON i.company_id = c.id
JOIN applications a ON a.internship_id = i.id
JOIN student_profiles sp ON sp.id = a.student_id
JOIN users su ON su.id = sp.user_id
WHERE su.email = 'arjun.sharma@student.edu' AND i.title = 'Full Stack Developer Intern'
LIMIT 1;

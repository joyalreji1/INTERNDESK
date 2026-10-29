package com.interndesk.config;

import com.interndesk.entity.*;
import com.interndesk.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains users. Skipping programmatic seed.");
            return;
        }

        log.info("Database is empty. Initializing comprehensive seed data for Intern Desk...");
        String defaultHashedPassword = passwordEncoder.encode("Password@123");

        // 1. Admin
        User admin = User.builder()
                .fullName("Intern Desk Administrator")
                .email("admin@interndesk.com")
                .passwordHash(defaultHashedPassword)
                .phone("+91-9000000000")
                .role(User.Role.ADMIN)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        admin = userRepository.save(admin);

        // 2. Companies
        User techNovaUser = User.builder()
                .fullName("TechNova Hiring Team")
                .email("hr@technova.io")
                .passwordHash(defaultHashedPassword)
                .phone("+91-9001000001")
                .role(User.Role.COMPANY)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        techNovaUser = userRepository.save(techNovaUser);

        Company techNova = Company.builder()
                .user(techNovaUser)
                .companyName("TechNova Solutions")
                .registrationNumber("CIN2019TN0001")
                .industry("Information Technology")
                .companySize(Company.CompanySize.MEDIUM)
                .description("TechNova is a fast-growing developer tools and cloud-native software enterprise offering immersive internships.")
                .website("https://technova.io")
                .contactEmail("hr@technova.io")
                .contactPhone("+91-9001000001")
                .headquartersAddress("14th Floor, Tech Tower, Whitefield")
                .city("Bengaluru")
                .state("Karnataka")
                .country("India")
                .verificationStatus(Company.VerificationStatus.VERIFIED)
                .verifiedBy(admin)
                .verifiedAt(LocalDateTime.now())
                .build();
        techNova = companyRepository.save(techNova);

        User dataSphereUser = User.builder()
                .fullName("DataSphere AI Careers")
                .email("careers@datasphere.ai")
                .passwordHash(defaultHashedPassword)
                .phone("+91-9001000002")
                .role(User.Role.COMPANY)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        dataSphereUser = userRepository.save(dataSphereUser);

        Company dataSphere = Company.builder()
                .user(dataSphereUser)
                .companyName("DataSphere AI")
                .registrationNumber("CIN2020DS0002")
                .industry("Artificial Intelligence")
                .companySize(Company.CompanySize.STARTUP)
                .description("DataSphere builds generative AI pipelines and computer vision intelligence for enterprise customers.")
                .website("https://datasphere.ai")
                .contactEmail("careers@datasphere.ai")
                .contactPhone("+91-9001000002")
                .headquartersAddress("Innovation Hub, Koramangala")
                .city("Bengaluru")
                .state("Karnataka")
                .country("India")
                .verificationStatus(Company.VerificationStatus.VERIFIED)
                .verifiedBy(admin)
                .verifiedAt(LocalDateTime.now())
                .build();
        dataSphere = companyRepository.save(dataSphere);

        User finLedgerUser = User.builder()
                .fullName("FinLedger Corp HR")
                .email("jobs@finledger.com")
                .passwordHash(defaultHashedPassword)
                .phone("+91-9001000003")
                .role(User.Role.COMPANY)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        finLedgerUser = userRepository.save(finLedgerUser);

        Company finLedger = Company.builder()
                .user(finLedgerUser)
                .companyName("FinLedger Corp")
                .registrationNumber("CIN2017FL0003")
                .industry("FinTech")
                .companySize(Company.CompanySize.ENTERPRISE)
                .description("FinLedger powers secure transaction processing, payments, and modern distributed banking engines for 50M+ users.")
                .website("https://finledger.com")
                .contactEmail("jobs@finledger.com")
                .contactPhone("+91-9001000003")
                .headquartersAddress("Level 21, One World Centre")
                .city("Mumbai")
                .state("Maharashtra")
                .country("India")
                .verificationStatus(Company.VerificationStatus.VERIFIED)
                .verifiedBy(admin)
                .verifiedAt(LocalDateTime.now())
                .build();
        finLedger = companyRepository.save(finLedger);

        User pixelForgeUser = User.builder()
                .fullName("PixelForge Studio Talent")
                .email("talent@pixelforge.design")
                .passwordHash(defaultHashedPassword)
                .phone("+91-9001000004")
                .role(User.Role.COMPANY)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        pixelForgeUser = userRepository.save(pixelForgeUser);

        Company pixelForge = Company.builder()
                .user(pixelForgeUser)
                .companyName("PixelForge Studio")
                .registrationNumber("CIN2021PF0004")
                .industry("Design")
                .companySize(Company.CompanySize.SMALL)
                .description("PixelForge is an award-winning creative studio crafting digital brand design and SaaS interface systems.")
                .website("https://pixelforge.design")
                .contactEmail("talent@pixelforge.design")
                .contactPhone("+91-9001000004")
                .headquartersAddress("Studio 8, DLF Cyber City")
                .city("Gurugram")
                .state("Haryana")
                .country("India")
                .verificationStatus(Company.VerificationStatus.VERIFIED)
                .verifiedBy(admin)
                .verifiedAt(LocalDateTime.now())
                .build();
        pixelForge = companyRepository.save(pixelForge);

        // 3. Students
        User arjunUser = User.builder()
                .fullName("Arjun Sharma")
                .email("arjun.sharma@student.edu")
                .passwordHash(defaultHashedPassword)
                .phone("+91-9100000001")
                .role(User.Role.STUDENT)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        arjunUser = userRepository.save(arjunUser);

        StudentProfile arjunProfile = StudentProfile.builder()
                .user(arjunUser)
                .registrationNumber("STU2024001")
                .collegeName("RV College of Engineering")
                .universityName("VTU Belagavi")
                .department("Computer Science & Engineering")
                .degree("B.Tech")
                .specialization("Full Stack Software Engineering")
                .currentSemester(7)
                .admissionYear(2021)
                .graduationYear(2025)
                .cgpa(new BigDecimal("8.75"))
                .backlogsCount(0)
                .professionalSummary("Passionate full-stack developer with strong foundations in Java, Spring Boot, React, and MySQL database architecture.")
                .city("Bengaluru")
                .state("Karnataka")
                .country("India")
                .linkedinUrl("https://linkedin.com/in/arjunsharma")
                .githubUrl("https://github.com/arjunsharma")
                .build();
        arjunProfile = studentProfileRepository.save(arjunProfile);

        User priyaUser = User.builder()
                .fullName("Priya Nair")
                .email("priya.nair@student.edu")
                .passwordHash(defaultHashedPassword)
                .phone("+91-9100000002")
                .role(User.Role.STUDENT)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        priyaUser = userRepository.save(priyaUser);

        StudentProfile priyaProfile = StudentProfile.builder()
                .user(priyaUser)
                .registrationNumber("STU2024002")
                .collegeName("College of Engineering Trivandrum")
                .universityName("KTU Kerala")
                .department("Computer Science")
                .degree("B.Tech")
                .specialization("Artificial Intelligence & Data Science")
                .currentSemester(6)
                .admissionYear(2022)
                .graduationYear(2026)
                .cgpa(new BigDecimal("9.10"))
                .backlogsCount(0)
                .professionalSummary("AI and machine learning researcher with deep experience in Python, PyTorch, SQL, and data pipelines.")
                .city("Thiruvananthapuram")
                .state("Kerala")
                .country("India")
                .linkedinUrl("https://linkedin.com/in/priyanair")
                .githubUrl("https://github.com/priyanair")
                .build();
        priyaProfile = studentProfileRepository.save(priyaProfile);

        // 4. Internships (10 detailed listings across domains)
        Internship int1 = internshipRepository.save(Internship.builder()
                .company(techNova)
                .title("Full Stack Developer Intern")
                .description("Build production cloud features using Spring Boot microservices and React for our developer tools platform.")
                .responsibilities("Implement REST endpoints, create reusable React components, participate in code reviews and sprint planning.")
                .eligibilityCriteria("B.Tech CS/IT students in 6th or 7th semester with strong fundamentals in Java or TypeScript.")
                .category("Software Development")
                .internshipType(Internship.InternshipType.FULL_TIME)
                .workMode(Internship.WorkMode.HYBRID)
                .location("Bengaluru, Karnataka")
                .durationMonths(3)
                .stipendMin(new BigDecimal("18000.00"))
                .stipendMax(new BigDecimal("25000.00"))
                .isPaid(true)
                .openings(3)
                .minimumCgpa(new BigDecimal("7.50"))
                .minimumSemester(5)
                .applicationDeadline(LocalDate.now().plusDays(25))
                .status(Internship.InternshipStatus.ACTIVE)
                .build());

        Internship int2 = internshipRepository.save(Internship.builder()
                .company(dataSphere)
                .title("Machine Learning Research Intern")
                .description("Design, train, and benchmark NLP transformer models and embedding retrieval systems for enterprise semantic search.")
                .responsibilities("Build model evaluation pipelines, optimize inference latency, analyze precision-recall metrics on benchmark datasets.")
                .eligibilityCriteria("Pre-final or final year CS/Data Science students with solid mathematical and Python foundations.")
                .category("Artificial Intelligence")
                .internshipType(Internship.InternshipType.FULL_TIME)
                .workMode(Internship.WorkMode.REMOTE)
                .location("Remote (India)")
                .durationMonths(6)
                .stipendMin(new BigDecimal("22000.00"))
                .stipendMax(new BigDecimal("35000.00"))
                .isPaid(true)
                .openings(2)
                .minimumCgpa(new BigDecimal("8.00"))
                .minimumSemester(6)
                .applicationDeadline(LocalDate.now().plusDays(20))
                .status(Internship.InternshipStatus.ACTIVE)
                .build());

        Internship int3 = internshipRepository.save(Internship.builder()
                .company(finLedger)
                .title("Backend Systems Engineering Intern")
                .description("Develop high-throughput payment settlement pipelines, reconciliation engines, and secure microservices.")
                .responsibilities("Write high-concurrency Java services, tune MySQL query indexes, implement automated unit & integration tests.")
                .eligibilityCriteria("B.Tech students with passion for distributed systems, relational databases, and clean code principles.")
                .category("Software Development")
                .internshipType(Internship.InternshipType.FULL_TIME)
                .workMode(Internship.WorkMode.ONSITE)
                .location("Mumbai, Maharashtra")
                .durationMonths(3)
                .stipendMin(new BigDecimal("20000.00"))
                .stipendMax(new BigDecimal("30000.00"))
                .isPaid(true)
                .openings(4)
                .minimumCgpa(new BigDecimal("7.00"))
                .minimumSemester(5)
                .applicationDeadline(LocalDate.now().plusDays(30))
                .status(Internship.InternshipStatus.ACTIVE)
                .build());

        Internship int4 = internshipRepository.save(Internship.builder()
                .company(pixelForge)
                .title("UI/UX Design Systems Intern")
                .description("Help shape our design system tokens, responsive interface components, and design documentation in Figma.")
                .responsibilities("Conduct usability heuristics, build wireframes and interactive prototypes, document accessible design standards.")
                .eligibilityCriteria("Design, HCI, or CS students with an exceptional portfolio showing product design thinking.")
                .category("Design")
                .internshipType(Internship.InternshipType.FULL_TIME)
                .workMode(Internship.WorkMode.HYBRID)
                .location("Gurugram, Haryana")
                .durationMonths(3)
                .stipendMin(new BigDecimal("12000.00"))
                .stipendMax(new BigDecimal("18000.00"))
                .isPaid(true)
                .openings(2)
                .applicationDeadline(LocalDate.now().plusDays(15))
                .status(Internship.InternshipStatus.ACTIVE)
                .build());

        Internship int5 = internshipRepository.save(Internship.builder()
                .company(dataSphere)
                .title("Data Engineering Intern")
                .description("Work on petabyte-scale streaming pipelines, Spark transformations, and modern data warehouse architectures.")
                .responsibilities("Build robust ETL scripts, schema migration scripts, and monitor data pipeline health.")
                .eligibilityCriteria("Knowledge of SQL, Python, and relational database fundamentals.")
                .category("Data Engineering")
                .internshipType(Internship.InternshipType.FULL_TIME)
                .workMode(Internship.WorkMode.REMOTE)
                .location("Remote")
                .durationMonths(4)
                .stipendMin(new BigDecimal("18000.00"))
                .stipendMax(new BigDecimal("28000.00"))
                .isPaid(true)
                .openings(2)
                .applicationDeadline(LocalDate.now().plusDays(18))
                .status(Internship.InternshipStatus.ACTIVE)
                .build());

        Internship int6 = internshipRepository.save(Internship.builder()
                .company(finLedger)
                .title("Cybersecurity & Compliance Intern")
                .description("Assist our security engineering team in vulnerability scanning, penetration tests, and SOC2 compliance automation.")
                .responsibilities("Review API authentication mechanisms, monitor SIEM security dashboards, and assist in security audit prep.")
                .eligibilityCriteria("Familiarity with OWASP Top 10, network protocols, cryptography, and Linux administration.")
                .category("Cybersecurity")
                .internshipType(Internship.InternshipType.FULL_TIME)
                .workMode(Internship.WorkMode.HYBRID)
                .location("Mumbai, Maharashtra")
                .durationMonths(3)
                .stipendMin(new BigDecimal("20000.00"))
                .stipendMax(new BigDecimal("26000.00"))
                .isPaid(true)
                .openings(2)
                .applicationDeadline(LocalDate.now().plusDays(22))
                .status(Internship.InternshipStatus.ACTIVE)
                .build());

        // 5. Initial Applications with Varied States
        Application app1 = applicationRepository.save(Application.builder()
                .student(arjunProfile)
                .internship(int1)
                .coverLetter("Excited about full-stack cloud tooling at TechNova. Proficient in Java, Spring Boot, React, and MySQL.")
                .status(Application.ApplicationStatus.SHORTLISTED)
                .appliedAt(LocalDateTime.now().minusDays(5))
                .build());

        statusHistoryRepository.save(ApplicationStatusHistory.builder()
                .application(app1)
                .previousStatus(Application.ApplicationStatus.APPLIED)
                .newStatus(Application.ApplicationStatus.UNDER_REVIEW)
                .changedBy(techNovaUser)
                .remarks("Resume matches backend skills threshold.")
                .changedAt(LocalDateTime.now().minusDays(3))
                .build());

        statusHistoryRepository.save(ApplicationStatusHistory.builder()
                .application(app1)
                .previousStatus(Application.ApplicationStatus.UNDER_REVIEW)
                .newStatus(Application.ApplicationStatus.SHORTLISTED)
                .changedBy(techNovaUser)
                .remarks("Candidate shortlisted for technical round.")
                .changedAt(LocalDateTime.now().minusDays(1))
                .build());

        Application app2 = applicationRepository.save(Application.builder()
                .student(priyaProfile)
                .internship(int2)
                .coverLetter("Extensive research background in NLP transformers and PyTorch pipelines. Eager to contribute to DataSphere.")
                .status(Application.ApplicationStatus.INTERVIEW)
                .appliedAt(LocalDateTime.now().minusDays(8))
                .build());

        statusHistoryRepository.save(ApplicationStatusHistory.builder()
                .application(app2)
                .previousStatus(Application.ApplicationStatus.SHORTLISTED)
                .newStatus(Application.ApplicationStatus.INTERVIEW)
                .changedBy(dataSphereUser)
                .remarks("Technical interview scheduled for Friday 3:00 PM.")
                .changedAt(LocalDateTime.now().minusDays(2))
                .build());

        // 6. In-App Notifications
        notificationRepository.save(Notification.builder()
                .user(arjunUser)
                .title("Application Shortlisted")
                .message("Your application for \"Full Stack Developer Intern\" at TechNova Solutions has been moved to SHORTLISTED.")
                .notificationType(Notification.NotificationType.APPLICATION_STATUS)
                .relatedEntityId(app1.getId())
                .relatedEntityType("APPLICATION")
                .isRead(false)
                .build());

        notificationRepository.save(Notification.builder()
                .user(priyaUser)
                .title("Interview Invitation")
                .message("DataSphere AI has scheduled an interview for \"Machine Learning Research Intern\". Check your email for call credentials.")
                .notificationType(Notification.NotificationType.INTERVIEW_SCHEDULED)
                .relatedEntityId(app2.getId())
                .relatedEntityType("APPLICATION")
                .isRead(false)
                .build());

        log.info("Database successfully seeded with Admin, 4 Companies, 2 Students, 6 Internships, Applications, and Notifications.");
    }
}


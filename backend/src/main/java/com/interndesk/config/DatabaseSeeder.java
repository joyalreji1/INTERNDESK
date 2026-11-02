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
    private final InternshipEligibilityRepository eligibilityRepository;
    private final PaymentRepository paymentRepository;
    private final RefundRepository refundRepository;
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

        // 4. Internships (Free & Paid Listings with Eligibility Configuration)
        // int1: FREE Internship
        Internship int1 = internshipRepository.save(Internship.builder()
                .company(techNova)
                .title("Full Stack Developer Intern")
                .description("Build production cloud features using Spring Boot microservices and React for our developer tools platform.")
                .responsibilities("Implement REST endpoints, create reusable React components, participate in code reviews and sprint planning.")
                .eligibilityCriteria("B.Tech CS/IT students in 6th or 7th semester with strong fundamentals in Java or TypeScript.")
                .category("Software Development")
                .internshipType(Internship.InternshipType.FREE)
                .internshipFee(BigDecimal.ZERO)
                .currency("INR")
                .workMode(Internship.WorkMode.HYBRID)
                .location("Bengaluru, Karnataka")
                .durationMonths(3)
                .stipendMin(new BigDecimal("18000.00"))
                .stipendMax(new BigDecimal("25000.00"))
                .isPaid(false)
                .openings(3)
                .minimumCgpa(new BigDecimal("7.00"))
                .minimumSemester(5)
                .applicationDeadline(LocalDate.now().plusDays(25))
                .status(Internship.InternshipStatus.ACTIVE)
                .build());

        eligibilityRepository.save(InternshipEligibility.builder()
                .internship(int1)
                .minimumCgpa(new BigDecimal("7.00"))
                .eligibleDegrees("B.Tech, B.E, MCA")
                .eligibleDepartments("Computer Science & Engineering, Information Technology, Software Engineering")
                .eligibleSemesters("5, 6, 7, 8")
                .minimumSemester(5)
                .requiredSkills("Java, Spring Boot, React")
                .resumeRequired(true)
                .academicDocumentRequirements("College Identity Card, Current Semester Marksheet")
                .additionalConditions("Applicant must have cleared all preceding semester examinations with zero active backlogs.")
                .build());

        // int2: PAID Internship (Fee: INR 2,500)
        Internship int2 = internshipRepository.save(Internship.builder()
                .company(dataSphere)
                .title("Machine Learning Research Intern")
                .description("Design, train, and benchmark NLP transformer models and embedding retrieval systems for enterprise semantic search.")
                .responsibilities("Build model evaluation pipelines, optimize inference latency, analyze precision-recall metrics on benchmark datasets.")
                .eligibilityCriteria("Pre-final or final year CS/Data Science students with solid mathematical and Python foundations.")
                .category("Artificial Intelligence")
                .internshipType(Internship.InternshipType.PAID)
                .internshipFee(new BigDecimal("2500.00"))
                .currency("INR")
                .refundPolicy("Full 100% refund if cancelled within 7 calendar days of seat confirmation. No deductions applied.")
                .paymentDeadline(LocalDate.now().plusDays(10))
                .workMode(Internship.WorkMode.REMOTE)
                .location("Remote (India)")
                .durationMonths(6)
                .stipendMin(new BigDecimal("22000.00"))
                .stipendMax(new BigDecimal("35000.00"))
                .isPaid(true)
                .openings(2)
                .minimumCgpa(new BigDecimal("7.50"))
                .minimumSemester(6)
                .applicationDeadline(LocalDate.now().plusDays(20))
                .status(Internship.InternshipStatus.ACTIVE)
                .build());

        eligibilityRepository.save(InternshipEligibility.builder()
                .internship(int2)
                .minimumCgpa(new BigDecimal("7.50"))
                .eligibleDegrees("B.Tech, M.Tech, M.Sc")
                .eligibleDepartments("Computer Science, Artificial Intelligence, Data Science")
                .eligibleSemesters("6, 7, 8")
                .minimumSemester(6)
                .requiredSkills("Python, Machine Learning, PyTorch")
                .resumeRequired(true)
                .academicDocumentRequirements("Consolidated Grade Card, Government ID Proof")
                .additionalConditions("Candidates must have working knowledge of Git version control and linear algebra.")
                .build());

        // int3: PAID Internship (Fee: INR 3,500)
        Internship int3 = internshipRepository.save(Internship.builder()
                .company(finLedger)
                .title("Backend Systems Engineering Intern")
                .description("Develop high-throughput payment settlement pipelines, reconciliation engines, and secure microservices.")
                .responsibilities("Write high-concurrency Java services, tune MySQL query indexes, implement automated unit & integration tests.")
                .eligibilityCriteria("B.Tech students with passion for distributed systems, relational databases, and clean code principles.")
                .category("Software Development")
                .internshipType(Internship.InternshipType.PAID)
                .internshipFee(new BigDecimal("3500.00"))
                .currency("INR")
                .refundPolicy("Standard 5-day money-back guarantee if candidate is unable to join due to verified academic scheduling conflicts.")
                .paymentDeadline(LocalDate.now().plusDays(15))
                .workMode(Internship.WorkMode.ONSITE)
                .location("Mumbai, Maharashtra")
                .durationMonths(3)
                .stipendMin(new BigDecimal("20000.00"))
                .stipendMax(new BigDecimal("30000.00"))
                .isPaid(true)
                .openings(4)
                .minimumCgpa(new BigDecimal("6.50"))
                .minimumSemester(5)
                .applicationDeadline(LocalDate.now().plusDays(30))
                .status(Internship.InternshipStatus.ACTIVE)
                .build());

        eligibilityRepository.save(InternshipEligibility.builder()
                .internship(int3)
                .minimumCgpa(new BigDecimal("6.50"))
                .eligibleDegrees("B.Tech, B.E, MCA")
                .eligibleDepartments("Computer Science & Engineering, Information Technology, Electronics")
                .eligibleSemesters("5, 6, 7, 8")
                .minimumSemester(5)
                .requiredSkills("Java, SQL, Spring Boot")
                .resumeRequired(true)
                .academicDocumentRequirements("College NOC Letter, Resume")
                .build());

        // int4: FREE Internship
        Internship int4 = internshipRepository.save(Internship.builder()
                .company(pixelForge)
                .title("UI/UX Design Systems Intern")
                .description("Help shape our design system tokens, responsive interface components, and design documentation in Figma.")
                .responsibilities("Conduct usability heuristics, build wireframes and interactive prototypes, document accessible design standards.")
                .eligibilityCriteria("Design, HCI, or CS students with an exceptional portfolio showing product design thinking.")
                .category("Design")
                .internshipType(Internship.InternshipType.FREE)
                .internshipFee(BigDecimal.ZERO)
                .currency("INR")
                .workMode(Internship.WorkMode.HYBRID)
                .location("Gurugram, Haryana")
                .durationMonths(3)
                .stipendMin(new BigDecimal("12000.00"))
                .stipendMax(new BigDecimal("18000.00"))
                .isPaid(false)
                .openings(2)
                .minimumCgpa(new BigDecimal("6.00"))
                .minimumSemester(4)
                .applicationDeadline(LocalDate.now().plusDays(15))
                .status(Internship.InternshipStatus.ACTIVE)
                .build());

        eligibilityRepository.save(InternshipEligibility.builder()
                .internship(int4)
                .minimumCgpa(new BigDecimal("6.00"))
                .eligibleDegrees("B.Des, B.Tech, B.Sc")
                .eligibleDepartments("Computer Science, Design, Media Studies")
                .eligibleSemesters("4, 5, 6, 7, 8")
                .minimumSemester(4)
                .requiredSkills("Figma, UI/UX, Design Systems")
                .resumeRequired(true)
                .additionalConditions("Portfolio or Behance/Dribbble link is mandatory.")
                .build());

        // int5: FREE Internship
        Internship int5 = internshipRepository.save(Internship.builder()
                .company(dataSphere)
                .title("Data Engineering Intern")
                .description("Work on petabyte-scale streaming pipelines, Spark transformations, and modern data warehouse architectures.")
                .responsibilities("Build robust ETL scripts, schema migration scripts, and monitor data pipeline health.")
                .eligibilityCriteria("Knowledge of SQL, Python, and relational database fundamentals.")
                .category("Data Engineering")
                .internshipType(Internship.InternshipType.FREE)
                .internshipFee(BigDecimal.ZERO)
                .currency("INR")
                .workMode(Internship.WorkMode.REMOTE)
                .location("Remote")
                .durationMonths(4)
                .stipendMin(new BigDecimal("18000.00"))
                .stipendMax(new BigDecimal("28000.00"))
                .isPaid(false)
                .openings(2)
                .minimumCgpa(new BigDecimal("7.00"))
                .minimumSemester(5)
                .applicationDeadline(LocalDate.now().plusDays(18))
                .status(Internship.InternshipStatus.ACTIVE)
                .build());

        eligibilityRepository.save(InternshipEligibility.builder()
                .internship(int5)
                .minimumCgpa(new BigDecimal("7.00"))
                .eligibleDegrees("B.Tech, MCA")
                .eligibleDepartments("Computer Science, Information Technology")
                .eligibleSemesters("5, 6, 7, 8")
                .minimumSemester(5)
                .requiredSkills("SQL, Python, ETL")
                .resumeRequired(true)
                .build());

        // int6: PAID Internship (Fee: INR 1,800)
        Internship int6 = internshipRepository.save(Internship.builder()
                .company(finLedger)
                .title("Cybersecurity & Compliance Intern")
                .description("Assist our security engineering team in vulnerability scanning, penetration tests, and SOC2 compliance automation.")
                .responsibilities("Review API authentication mechanisms, monitor SIEM security dashboards, and assist in security audit prep.")
                .eligibilityCriteria("Familiarity with OWASP Top 10, network protocols, cryptography, and Linux administration.")
                .category("Cybersecurity")
                .internshipType(Internship.InternshipType.PAID)
                .internshipFee(new BigDecimal("1800.00"))
                .currency("INR")
                .refundPolicy("100% refund available up to 48 hours prior to onboarding date.")
                .paymentDeadline(LocalDate.now().plusDays(12))
                .workMode(Internship.WorkMode.HYBRID)
                .location("Mumbai, Maharashtra")
                .durationMonths(3)
                .stipendMin(new BigDecimal("20000.00"))
                .stipendMax(new BigDecimal("26000.00"))
                .isPaid(true)
                .openings(2)
                .minimumCgpa(new BigDecimal("6.50"))
                .minimumSemester(5)
                .applicationDeadline(LocalDate.now().plusDays(22))
                .status(Internship.InternshipStatus.ACTIVE)
                .build());

        eligibilityRepository.save(InternshipEligibility.builder()
                .internship(int6)
                .minimumCgpa(new BigDecimal("6.50"))
                .eligibleDegrees("B.Tech, B.Sc Cyber Security")
                .eligibleDepartments("Computer Science & Engineering, Information Technology, Cyber Security")
                .eligibleSemesters("5, 6, 7, 8")
                .minimumSemester(5)
                .requiredSkills("Linux, Cryptography, OWASP")
                .resumeRequired(true)
                .build());

        // 5. Applications across Free & Paid Workflows
        // app1: Student Arjun on int1 (Free) -> SHORTLISTED
        Application app1 = applicationRepository.save(Application.builder()
                .student(arjunProfile)
                .internship(int1)
                .coverLetter("Excited about full-stack cloud tooling at TechNova. Proficient in Java, Spring Boot, React, and MySQL.")
                .status(Application.ApplicationStatus.SHORTLISTED)
                .eligibilityStatus(Application.EligibilityStatus.ELIGIBLE)
                .paymentStatus(Application.PaymentStatus.NOT_APPLICABLE)
                .appliedAt(LocalDateTime.now().minusDays(5))
                .build());

        statusHistoryRepository.save(ApplicationStatusHistory.builder()
                .application(app1)
                .previousStatus(Application.ApplicationStatus.APPLIED)
                .newStatus(Application.ApplicationStatus.SHORTLISTED)
                .changedBy(techNovaUser)
                .remarks("Academic eligibility verified. Candidate shortlisted for evaluation.")
                .changedAt(LocalDateTime.now().minusDays(1))
                .build());

        // app2: Student Arjun on int2 (Paid) -> SELECTED, PAYMENT_PENDING
        Application app2 = applicationRepository.save(Application.builder()
                .student(arjunProfile)
                .internship(int2)
                .coverLetter("Extensive research background in NLP transformers and PyTorch pipelines. Eager to contribute to DataSphere.")
                .status(Application.ApplicationStatus.SELECTED)
                .eligibilityStatus(Application.EligibilityStatus.ELIGIBLE)
                .paymentStatus(Application.PaymentStatus.PENDING)
                .selectedAt(LocalDateTime.now().minusDays(1))
                .appliedAt(LocalDateTime.now().minusDays(8))
                .build());

        statusHistoryRepository.save(ApplicationStatusHistory.builder()
                .application(app2)
                .previousStatus(Application.ApplicationStatus.SHORTLISTED)
                .newStatus(Application.ApplicationStatus.SELECTED)
                .changedBy(dataSphereUser)
                .remarks("Selected following technical review. Enrollment fee payment pending.")
                .changedAt(LocalDateTime.now().minusDays(1))
                .build());

        // app3: Student Priya on int3 (Paid) -> ENROLLED, PAID
        Application app3 = applicationRepository.save(Application.builder()
                .student(priyaProfile)
                .internship(int3)
                .coverLetter("Solid foundation in distributed systems, Java concurrency, and database tuning.")
                .status(Application.ApplicationStatus.ENROLLED)
                .eligibilityStatus(Application.EligibilityStatus.ELIGIBLE)
                .paymentStatus(Application.PaymentStatus.PAID)
                .selectedAt(LocalDateTime.now().minusDays(4))
                .enrolledAt(LocalDateTime.now().minusDays(2))
                .appliedAt(LocalDateTime.now().minusDays(10))
                .build());

        Payment pay1 = paymentRepository.save(Payment.builder()
                .application(app3)
                .student(priyaProfile)
                .company(finLedger)
                .internship(int3)
                .amount(new BigDecimal("3500.00"))
                .currency("INR")
                .paymentGateway("RAZORPAY")
                .gatewayOrderId("order_seeded_demo_001")
                .gatewayPaymentId("pay_seeded_demo_001")
                .gatewaySignature("test_sig_seeded_001")
                .transactionReference("TXN-INTRN-2026-001")
                .paymentStatus(Payment.PaymentStatus.SUCCESS)
                .paidAt(LocalDateTime.now().minusDays(2))
                .build());

        statusHistoryRepository.save(ApplicationStatusHistory.builder()
                .application(app3)
                .previousStatus(Application.ApplicationStatus.SELECTED)
                .newStatus(Application.ApplicationStatus.ENROLLED)
                .changedBy(priyaUser)
                .remarks("Enrollment confirmed upon verified fee payment of INR 3500.00 (Ref: TXN-INTRN-2026-001).")
                .changedAt(LocalDateTime.now().minusDays(2))
                .build());

        // app4: Student Priya on int6 (Paid) -> SELECTED, REFUND REQUESTED
        Application app4 = applicationRepository.save(Application.builder()
                .student(priyaProfile)
                .internship(int6)
                .coverLetter("Interested in financial security audit prep and penetration testing.")
                .status(Application.ApplicationStatus.SELECTED)
                .eligibilityStatus(Application.EligibilityStatus.ELIGIBLE)
                .paymentStatus(Application.PaymentStatus.PAID)
                .selectedAt(LocalDateTime.now().minusDays(6))
                .appliedAt(LocalDateTime.now().minusDays(12))
                .build());

        Payment pay2 = paymentRepository.save(Payment.builder()
                .application(app4)
                .student(priyaProfile)
                .company(finLedger)
                .internship(int6)
                .amount(new BigDecimal("1800.00"))
                .currency("INR")
                .paymentGateway("RAZORPAY")
                .gatewayOrderId("order_seeded_demo_002")
                .gatewayPaymentId("pay_seeded_demo_002")
                .gatewaySignature("test_sig_seeded_002")
                .transactionReference("TXN-INTRN-2026-002")
                .paymentStatus(Payment.PaymentStatus.REFUND_PENDING)
                .paidAt(LocalDateTime.now().minusDays(3))
                .build());

        refundRepository.save(Refund.builder()
                .payment(pay2)
                .requestedAmount(new BigDecimal("1800.00"))
                .refundReason("Academic semester examination timetable conflicts with internship daily working hours.")
                .refundStatus(Refund.RefundStatus.REQUESTED)
                .createdAt(LocalDateTime.now().minusDays(1))
                .build());

        // 6. In-App Notifications
        notificationRepository.save(Notification.builder()
                .user(arjunUser)
                .title("Action Required: Payment Pending")
                .message("Congratulations! You have been selected for 'Machine Learning Research Intern' at DataSphere AI. Please complete the enrollment fee payment of INR 2500.00 to confirm your seat.")
                .notificationType(Notification.NotificationType.PAYMENT_REQUIRED)
                .relatedEntityId(app2.getId())
                .relatedEntityType("APPLICATION")
                .isRead(false)
                .build());

        notificationRepository.save(Notification.builder()
                .user(priyaUser)
                .title("Enrollment Confirmed!")
                .message("Payment of INR 3500.00 for 'Backend Systems Engineering Intern' at FinLedger Corp was successfully verified. You are officially enrolled!")
                .notificationType(Notification.NotificationType.ENROLLMENT_CONFIRMED)
                .relatedEntityId(app3.getId())
                .relatedEntityType("APPLICATION")
                .isRead(false)
                .build());

        log.info("Database successfully seeded with Free & Paid Internships, Eligibility Rules, and Payment Transactions.");
    }
}


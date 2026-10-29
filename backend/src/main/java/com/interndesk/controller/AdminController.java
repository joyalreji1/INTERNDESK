package com.interndesk.controller;

import com.interndesk.dto.ApiResponse;
import com.interndesk.dto.ApplicationDto;
import com.interndesk.entity.*;
import com.interndesk.exception.ResourceNotFoundException;
import com.interndesk.repository.*;
import com.interndesk.service.ApplicationService;
import com.interndesk.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administrator", description = "Admin controls, user moderation, audit logs, reports & exports")
public class AdminController {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final AdminActionRepository adminActionRepository;
    private final CompanyVerificationRepository companyVerificationRepository;
    private final NotificationService notificationService;
    private final ApplicationService applicationService;

    // -------------------------------------------------------------
    // Student Management
    // -------------------------------------------------------------
    @GetMapping("/students")
    @Operation(summary = "List students with search & pagination")
    public ResponseEntity<ApiResponse<Page<Map<String, Object>>>> listStudents(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Page<StudentProfile> profiles;
        if (query != null && !query.isBlank()) {
            profiles = studentProfileRepository.searchStudents(query.trim(),
                    PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        } else {
            profiles = studentProfileRepository.findAll(
                    PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        }

        Page<Map<String, Object>> mapped = profiles.map(sp -> {
            Map<String, Object> m = new LinkedHashMap<>();
            User u = sp.getUser();
            m.put("id", sp.getId());
            m.put("userId", u.getId());
            m.put("fullName", u.getFullName());
            m.put("email", u.getEmail());
            m.put("phone", u.getPhone());
            m.put("accountStatus", u.getAccountStatus().name());
            m.put("collegeName", sp.getCollegeName());
            m.put("degree", sp.getDegree());
            m.put("department", sp.getDepartment());
            m.put("graduationYear", sp.getGraduationYear());
            m.put("cgpa", sp.getCgpa());
            m.put("city", sp.getCity());
            m.put("applicationsCount", applicationRepository.countByStudentId(sp.getId()));
            m.put("createdAt", sp.getCreatedAt());
            return m;
        });

        return ResponseEntity.ok(ApiResponse.success(mapped)
                .withPagination(mapped.getNumber(), mapped.getSize(), mapped.getTotalElements(), mapped.getTotalPages()));
    }

    @PatchMapping("/students/{userId}/status")
    @Operation(summary = "Change student account status (ACTIVE, SUSPENDED)")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> updateStudentStatus(
            @PathVariable Long userId,
            @RequestBody StatusChangeRequest req,
            @AuthenticationPrincipal UserDetails principal) {

        User studentUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        User admin = userRepository.findByEmail(principal.getUsername()).orElseThrow();

        User.AccountStatus newStatus = User.AccountStatus.valueOf(req.getStatus().toUpperCase());
        studentUser.setAccountStatus(newStatus);
        userRepository.save(studentUser);

        recordAuditAction(admin, "UPDATE_USER_STATUS", "User", userId,
                "Changed user status to " + newStatus.name() + (req.getRemarks() != null ? ": " + req.getRemarks() : ""));

        return ResponseEntity.ok(ApiResponse.success("Student status updated to " + newStatus.name(), null));
    }

    // -------------------------------------------------------------
    // Company Verification & Management
    // -------------------------------------------------------------
    @GetMapping("/companies")
    @Operation(summary = "List all companies with verification status filter")
    public ResponseEntity<ApiResponse<Page<Map<String, Object>>>> listCompanies(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Company.VerificationStatus vStatus = null;
        if (status != null && !status.equalsIgnoreCase("ALL") && !status.isBlank()) {
            try {
                vStatus = Company.VerificationStatus.valueOf(status.toUpperCase());
            } catch (Exception ignored) {}
        }

        Page<Company> companies = companyRepository.searchCompanies(query, vStatus,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        Page<Map<String, Object>> mapped = companies.map(c -> {
            Map<String, Object> m = new LinkedHashMap<>();
            User u = c.getUser();
            m.put("id", c.getId());
            m.put("userId", u != null ? u.getId() : null);
            m.put("companyName", c.getCompanyName());
            m.put("industry", c.getIndustry());
            m.put("companySize", c.getCompanySize());
            m.put("contactEmail", c.getContactEmail());
            m.put("contactPhone", c.getContactPhone());
            m.put("city", c.getCity());
            m.put("state", c.getState());
            m.put("website", c.getWebsite());
            m.put("registrationNumber", c.getRegistrationNumber());
            m.put("verificationStatus", c.getVerificationStatus().name());
            m.put("verifiedAt", c.getVerifiedAt());
            m.put("activePostings", internshipRepository.countByCompanyIdAndStatus(c.getId(), Internship.InternshipStatus.ACTIVE));
            m.put("totalApplicants", applicationRepository.countByCompanyId(c.getId()));
            m.put("createdAt", c.getCreatedAt());
            return m;
        });

        return ResponseEntity.ok(ApiResponse.success(mapped)
                .withPagination(mapped.getNumber(), mapped.getSize(), mapped.getTotalElements(), mapped.getTotalPages()));
    }

    @PatchMapping("/companies/{id}/verify")
    @Operation(summary = "Approve, Reject, or Suspend a company")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> verifyCompany(
            @PathVariable Long id,
            @RequestBody CompanyVerificationRequest req,
            @AuthenticationPrincipal UserDetails principal) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", id));
        User admin = userRepository.findByEmail(principal.getUsername()).orElseThrow();

        Company.VerificationStatus newStatus = Company.VerificationStatus.valueOf(req.getStatus().toUpperCase());
        company.setVerificationStatus(newStatus);
        company.setVerifiedBy(admin);
        company.setVerifiedAt(LocalDateTime.now());
        companyRepository.save(company);

        // Record verification audit
        CompanyVerification cv = CompanyVerification.builder()
                .company(company)
                .admin(admin)
                .status(CompanyVerification.VerificationDecision.valueOf(newStatus.name()))
                .remarks(req.getRemarks())
                .build();
        companyVerificationRepository.save(cv);

        recordAuditAction(admin, "VERIFY_COMPANY", "Company", id,
                "Company " + company.getCompanyName() + " status set to " + newStatus.name() + ". Remarks: " + req.getRemarks());

        // Notify company
        if (company.getUser() != null) {
            String msg = "Your company profile verification status is now: " + newStatus.name() +
                    (req.getRemarks() != null ? ". Note: " + req.getRemarks() : "");
            notificationService.createNotification(
                    company.getUser(),
                    "Company Verification Update",
                    msg,
                    Notification.NotificationType.COMPANY_VERIFIED,
                    company.getId(), "COMPANY"
            );
        }

        return ResponseEntity.ok(ApiResponse.success("Company verification updated to " + newStatus.name(), null));
    }

    // -------------------------------------------------------------
    // Internship Management
    // -------------------------------------------------------------
    @GetMapping("/internships")
    @Operation(summary = "List all internships across all companies")
    public ResponseEntity<ApiResponse<Page<Map<String, Object>>>> listAllInternships(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Page<Internship> list = internshipRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        Page<Map<String, Object>> mapped = list.map(i -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", i.getId());
            m.put("title", i.getTitle());
            m.put("companyId", i.getCompany().getId());
            m.put("companyName", i.getCompany().getCompanyName());
            m.put("category", i.getCategory());
            m.put("workMode", i.getWorkMode().name());
            m.put("location", i.getLocation());
            m.put("durationMonths", i.getDurationMonths());
            m.put("stipendMin", i.getStipendMin());
            m.put("stipendMax", i.getStipendMax());
            m.put("isPaid", i.getIsPaid());
            m.put("openings", i.getOpenings());
            m.put("status", i.getStatus().name());
            m.put("applicationDeadline", i.getApplicationDeadline());
            m.put("viewsCount", i.getViewsCount());
            m.put("createdAt", i.getCreatedAt());
            return m;
        });

        return ResponseEntity.ok(ApiResponse.success(mapped)
                .withPagination(mapped.getNumber(), mapped.getSize(), mapped.getTotalElements(), mapped.getTotalPages()));
    }

    @PatchMapping("/internships/{id}/status")
    @Operation(summary = "Change internship status (ACTIVE, CLOSED, CANCELLED)")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> updateInternshipStatus(
            @PathVariable Long id,
            @RequestBody StatusChangeRequest req,
            @AuthenticationPrincipal UserDetails principal) {

        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship", id));
        User admin = userRepository.findByEmail(principal.getUsername()).orElseThrow();

        Internship.InternshipStatus newStatus = Internship.InternshipStatus.valueOf(req.getStatus().toUpperCase());
        internship.setStatus(newStatus);
        internshipRepository.save(internship);

        recordAuditAction(admin, "UPDATE_INTERNSHIP_STATUS", "Internship", id,
                "Updated internship \"" + internship.getTitle() + "\" to " + newStatus.name());

        return ResponseEntity.ok(ApiResponse.success("Internship status updated to " + newStatus.name(), null));
    }

    @DeleteMapping("/internships/{id}")
    @Operation(summary = "Delete an internship listing as admin")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteInternship(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {

        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship", id));
        User admin = userRepository.findByEmail(principal.getUsername()).orElseThrow();

        recordAuditAction(admin, "DELETE_INTERNSHIP", "Internship", id,
                "Deleted internship \"" + internship.getTitle() + "\" from " + internship.getCompany().getCompanyName());

        internshipRepository.delete(internship);
        return ResponseEntity.ok(ApiResponse.success("Internship deleted successfully.", null));
    }

    // -------------------------------------------------------------
    // Application Management (Platform-wide)
    // -------------------------------------------------------------
    @GetMapping("/applications")
    @Operation(summary = "Platform-wide applications with pagination and filters")
    public ResponseEntity<ApiResponse<Page<ApplicationDto.ApplicationResponse>>> listAllApplications(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Page<Application> apps = applicationRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt")));

        Page<ApplicationDto.ApplicationResponse> mapped = apps.map(applicationService::toResponse);
        return ResponseEntity.ok(ApiResponse.success(mapped)
                .withPagination(mapped.getNumber(), mapped.getSize(), mapped.getTotalElements(), mapped.getTotalPages()));
    }

    // -------------------------------------------------------------
    // Audit Logs
    // -------------------------------------------------------------
    @GetMapping("/audit-logs")
    @Operation(summary = "Get administrative audit logs")
    public ResponseEntity<ApiResponse<Page<Map<String, Object>>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<AdminAction> logs = adminActionRepository.findAllByOrderByCreatedAtDesc(
                PageRequest.of(page, size));

        Page<Map<String, Object>> mapped = logs.map(a -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", a.getId());
            m.put("adminEmail", a.getAdminUser() != null ? a.getAdminUser().getEmail() : "system");
            m.put("adminName", a.getAdminUser() != null ? a.getAdminUser().getFullName() : "System");
            m.put("actionType", a.getActionType());
            m.put("entityType", a.getEntityType());
            m.put("entityId", a.getEntityId());
            m.put("description", a.getDescription());
            m.put("ipAddress", a.getIpAddress());
            m.put("createdAt", a.getCreatedAt());
            return m;
        });

        return ResponseEntity.ok(ApiResponse.success(mapped)
                .withPagination(mapped.getNumber(), mapped.getSize(), mapped.getTotalElements(), mapped.getTotalPages()));
    }

    // -------------------------------------------------------------
    // Summary Reports & Analytics
    // -------------------------------------------------------------
    @GetMapping("/reports/summary")
    @Operation(summary = "Get high-level system analytics for reporting")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReportsSummary() {
        Map<String, Object> report = new LinkedHashMap<>();

        long totalStudents = userRepository.countByRole(User.Role.STUDENT);
        long totalCompanies = userRepository.countByRole(User.Role.COMPANY);
        long totalInternships = internshipRepository.count();
        long activeInternships = internshipRepository.countByStatus(Internship.InternshipStatus.ACTIVE);
        long totalApplications = applicationRepository.count();
        long selectedApplications = applicationRepository.countByStatus(Application.ApplicationStatus.SELECTED);
        long pendingVerifications = companyRepository.countByVerificationStatus(Company.VerificationStatus.PENDING);

        report.put("totalStudents", totalStudents);
        report.put("totalCompanies", totalCompanies);
        report.put("totalInternships", totalInternships);
        report.put("activeInternships", activeInternships);
        report.put("totalApplications", totalApplications);
        report.put("selectedApplications", selectedApplications);
        report.put("pendingVerifications", pendingVerifications);
        report.put("conversionRate", totalApplications > 0
                ? Math.round((selectedApplications * 100.0) / totalApplications * 10.0) / 10.0 : 0.0);

        Map<String, Long> categoryMap = new LinkedHashMap<>();
        internshipRepository.countByCategory().forEach(r -> {
            categoryMap.put(r[0] != null ? r[0].toString() : "Other", (Long) r[1]);
        });
        report.put("internshipsByCategory", categoryMap);

        return ResponseEntity.ok(ApiResponse.success(report));
    }

    // -------------------------------------------------------------
    // CSV Exports
    // -------------------------------------------------------------
    @GetMapping("/reports/export/{type}")
    @Operation(summary = "Export platform reports to CSV (students, companies, internships, applications)")
    public void exportCsv(
            @PathVariable String type,
            HttpServletResponse response) throws IOException {

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"intern_desk_" + type + "_" + timestamp + ".csv\"");

        PrintWriter writer = response.getWriter();

        switch (type.toLowerCase()) {
            case "students":
                writer.println("Student ID,Full Name,Email,Phone,College,Degree,Department,Graduation Year,CGPA,City,Status,Created At");
                studentProfileRepository.findAll().forEach(sp -> {
                    User u = sp.getUser();
                    writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%s,%s,\"%s\",\"%s\",\"%s\"%n",
                            sp.getId(),
                            escapeCsv(u.getFullName()),
                            escapeCsv(u.getEmail()),
                            escapeCsv(u.getPhone()),
                            escapeCsv(sp.getCollegeName()),
                            escapeCsv(sp.getDegree()),
                            escapeCsv(sp.getDepartment()),
                            sp.getGraduationYear() != null ? sp.getGraduationYear() : "",
                            sp.getCgpa() != null ? sp.getCgpa() : "",
                            escapeCsv(sp.getCity()),
                            u.getAccountStatus(),
                            sp.getCreatedAt());
                });
                break;

            case "companies":
                writer.println("Company ID,Company Name,Industry,Size,Contact Email,Phone,City,State,Verification Status,Created At");
                companyRepository.findAll().forEach(c -> {
                    writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                            c.getId(),
                            escapeCsv(c.getCompanyName()),
                            escapeCsv(c.getIndustry()),
                            c.getCompanySize() != null ? c.getCompanySize() : "",
                            escapeCsv(c.getContactEmail()),
                            escapeCsv(c.getContactPhone()),
                            escapeCsv(c.getCity()),
                            escapeCsv(c.getState()),
                            c.getVerificationStatus(),
                            c.getCreatedAt());
                });
                break;

            case "internships":
                writer.println("Internship ID,Title,Company,Category,Work Mode,Location,Duration Months,Min Stipend,Max Stipend,Openings,Status,Deadline,Views");
                internshipRepository.findAll().forEach(i -> {
                    writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%s,%s,%s,%d,\"%s\",\"%s\",%d%n",
                            i.getId(),
                            escapeCsv(i.getTitle()),
                            escapeCsv(i.getCompany().getCompanyName()),
                            escapeCsv(i.getCategory()),
                            i.getWorkMode(),
                            escapeCsv(i.getLocation()),
                            i.getDurationMonths() != null ? i.getDurationMonths() : 0,
                            i.getStipendMin(),
                            i.getStipendMax(),
                            i.getOpenings() != null ? i.getOpenings() : 1,
                            i.getStatus(),
                            i.getApplicationDeadline() != null ? i.getApplicationDeadline() : "",
                            i.getViewsCount());
                });
                break;

            case "applications":
                writer.println("Application ID,Student Name,Student Email,Internship Title,Company,Status,Applied At,Withdrawn At");
                applicationRepository.findAll().forEach(a -> {
                    writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                            a.getId(),
                            escapeCsv(a.getStudent().getUser().getFullName()),
                            escapeCsv(a.getStudent().getUser().getEmail()),
                            escapeCsv(a.getInternship().getTitle()),
                            escapeCsv(a.getInternship().getCompany().getCompanyName()),
                            a.getStatus(),
                            a.getAppliedAt(),
                            a.getWithdrawnAt() != null ? a.getWithdrawnAt() : "");
                });
                break;

            default:
                writer.println("Invalid export type requested.");
                break;
        }

        writer.flush();
    }

    private void recordAuditAction(User admin, String actionType, String entityType, Long entityId, String description) {
        AdminAction action = AdminAction.builder()
                .adminUser(admin)
                .actionType(actionType)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .build();
        adminActionRepository.save(action);
    }

    private String escapeCsv(String str) {
        if (str == null) return "";
        return str.replace("\"", "\"\"");
    }

    @Data
    public static class StatusChangeRequest {
        private String status;
        private String remarks;
    }

    @Data
    public static class CompanyVerificationRequest {
        private String status;
        private String remarks;
    }
}


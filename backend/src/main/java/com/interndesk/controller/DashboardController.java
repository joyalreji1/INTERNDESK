package com.interndesk.controller;

import com.interndesk.dto.ApiResponse;
import com.interndesk.dto.DashboardDto;
import com.interndesk.dto.ApplicationDto;
import com.interndesk.dto.InternshipDto;
import com.interndesk.entity.*;
import com.interndesk.exception.ResourceNotFoundException;
import com.interndesk.repository.*;
import com.interndesk.service.ApplicationService;
import com.interndesk.service.InternshipService;
import com.interndesk.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Role-specific dashboard analytics endpoints")
public class DashboardController {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;
    private final InternshipRepository internshipRepository;
    private final NotificationService notificationService;
    private final ApplicationService applicationService;
    private final InternshipService internshipService;

    @GetMapping("/student")
    @Operation(summary = "Get student dashboard analytics")
    public ResponseEntity<ApiResponse<DashboardDto.StudentDashboard>> studentDashboard(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile student = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        DashboardDto.StudentDashboard dash = new DashboardDto.StudentDashboard();
        dash.setWelcomeMessage("Welcome back, " + user.getFullName().split(" ")[0] + "!");

        // Application stats
        long total = applicationRepository.countByStudentId(student.getId());
        long pending = applicationRepository.countByStudentIdAndStatus(student.getId(), Application.ApplicationStatus.APPLIED)
            + applicationRepository.countByStudentIdAndStatus(student.getId(), Application.ApplicationStatus.UNDER_REVIEW);
        long shortlisted = applicationRepository.countByStudentIdAndStatus(student.getId(), Application.ApplicationStatus.SHORTLISTED)
            + applicationRepository.countByStudentIdAndStatus(student.getId(), Application.ApplicationStatus.INTERVIEW);
        long selected = applicationRepository.countByStudentIdAndStatus(student.getId(), Application.ApplicationStatus.SELECTED);
        long rejected = applicationRepository.countByStudentIdAndStatus(student.getId(), Application.ApplicationStatus.REJECTED);

        dash.setTotalApplications(total);
        dash.setPendingApplications(pending);
        dash.setShortlistedApplications(shortlisted);
        dash.setSelectedApplications(selected);
        dash.setRejectedApplications(rejected);

        // Status breakdown for chart
        Map<String, Long> byStatus = new LinkedHashMap<>();
        applicationRepository.countByStatusForStudent(student.getId())
            .forEach(row -> byStatus.put(row[0].toString(), (Long) row[1]));
        dash.setApplicationsByStatus(byStatus);

        // Recent applications (last 5)
        List<ApplicationDto.ApplicationSummary> recent = applicationRepository
            .findByStudentId(student.getId(), PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "appliedAt")))
            .getContent().stream().map(applicationService::toSummary).collect(Collectors.toList());
        dash.setRecentApplications(recent);

        // Recommended internships (latest 6 active)
        List<InternshipDto.InternshipSummary> recommended = internshipRepository
            .searchInternships(null, null, null, null, null, null, null,
                java.time.LocalDate.now(), PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "createdAt")))
            .getContent().stream().map(internshipService::toSummary).collect(Collectors.toList());
        dash.setRecommendedInternships(recommended);

        // Profile completion (basic calculation)
        int completion = calculateProfileCompletion(student, user);
        dash.setProfileCompletionPercent(completion);

        dash.setUnreadNotifications(notificationService.getUnreadCount(user.getId()));

        return ResponseEntity.ok(ApiResponse.success(dash));
    }

    @GetMapping("/company")
    @Operation(summary = "Get company dashboard analytics")
    public ResponseEntity<ApiResponse<DashboardDto.CompanyDashboard>> companyDashboard(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        Company company = companyRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        DashboardDto.CompanyDashboard dash = new DashboardDto.CompanyDashboard();
        dash.setTotalActiveInternships(internshipRepository.countByCompanyIdAndStatus(company.getId(), Internship.InternshipStatus.ACTIVE));
        dash.setTotalApplicants(applicationRepository.countByCompanyId(company.getId()));
        dash.setPendingReviewCount(applicationRepository.countByCompanyIdAndStatus(company.getId(), Application.ApplicationStatus.APPLIED)
            + applicationRepository.countByCompanyIdAndStatus(company.getId(), Application.ApplicationStatus.UNDER_REVIEW));
        dash.setShortlistedCount(applicationRepository.countByCompanyIdAndStatus(company.getId(), Application.ApplicationStatus.SHORTLISTED)
            + applicationRepository.countByCompanyIdAndStatus(company.getId(), Application.ApplicationStatus.INTERVIEW));
        dash.setSelectedCount(applicationRepository.countByCompanyIdAndStatus(company.getId(), Application.ApplicationStatus.SELECTED));

        Map<String, Long> byStatus = new LinkedHashMap<>();
        applicationRepository.countByStatusForCompany(company.getId())
            .forEach(row -> byStatus.put(row[0].toString(), (Long) row[1]));
        dash.setApplicantsByStatus(byStatus);

        List<ApplicationDto.ApplicationResponse> recent = applicationRepository
            .findRecentByCompanyId(company.getId(), PageRequest.of(0, 5))
            .stream().map(applicationService::toResponse).collect(Collectors.toList());
        dash.setRecentApplicants(recent);

        List<InternshipDto.InternshipSummary> myInternships = internshipRepository
            .findByCompanyId(company.getId(), PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "createdAt")))
            .getContent().stream().map(internshipService::toSummary).collect(Collectors.toList());
        dash.setMyInternships(myInternships);
        dash.setUnreadNotifications(notificationService.getUnreadCount(user.getId()));

        return ResponseEntity.ok(ApiResponse.success(dash));
    }

    @GetMapping("/admin")
    @Operation(summary = "Get admin dashboard analytics")
    public ResponseEntity<ApiResponse<DashboardDto.AdminDashboard>> adminDashboard(
            @AuthenticationPrincipal UserDetails principal) {
        DashboardDto.AdminDashboard dash = new DashboardDto.AdminDashboard();
        dash.setTotalStudents(userRepository.countByRole(User.Role.STUDENT));
        dash.setTotalCompanies(userRepository.countByRole(User.Role.COMPANY));
        dash.setTotalInternships(internshipRepository.count());
        dash.setTotalApplications(applicationRepository.count());
        dash.setPendingCompanyVerifications(companyRepository.countByVerificationStatus(Company.VerificationStatus.PENDING));
        dash.setActiveInternships(internshipRepository.countByStatus(Internship.InternshipStatus.ACTIVE));

        Map<String, Long> byCat = new LinkedHashMap<>();
        internshipRepository.countByCategory()
            .forEach(row -> byCat.put(row[0] != null ? row[0].toString() : "Uncategorized", (Long) row[1]));
        dash.setInternshipsByCategory(byCat);

        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        dash.setUnreadNotifications(notificationService.getUnreadCount(user.getId()));

        return ResponseEntity.ok(ApiResponse.success(dash));
    }

    private int calculateProfileCompletion(StudentProfile sp, User u) {
        int total = 0, filled = 0;
        String[][] fields = {
            {u.getFullName(), "1"}, {u.getEmail(), "1"}, {u.getPhone(), "1"},
            {sp.getCollegeName(), "1"}, {sp.getDegree(), "1"}, {sp.getDepartment(), "1"},
            {sp.getProfessionalSummary(), "1"}, {sp.getCity(), "1"},
            {sp.getLinkedinUrl(), "1"}, {sp.getGithubUrl(), "1"}
        };
        for (String[] f : fields) {
            total++;
            if (f[0] != null && !f[0].isBlank()) filled++;
        }
        return (int) Math.round((filled * 100.0) / total);
    }
}

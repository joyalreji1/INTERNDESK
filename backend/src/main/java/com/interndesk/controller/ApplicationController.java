package com.interndesk.controller;

import com.interndesk.dto.ApiResponse;
import com.interndesk.dto.ApplicationDto;
import com.interndesk.entity.Application;
import com.interndesk.entity.Company;
import com.interndesk.entity.Interview;
import com.interndesk.entity.Notification;
import com.interndesk.entity.User;
import com.interndesk.exception.ResourceNotFoundException;
import com.interndesk.exception.UnauthorizedException;
import com.interndesk.repository.ApplicationRepository;
import com.interndesk.repository.CompanyRepository;
import com.interndesk.repository.InterviewRepository;
import com.interndesk.repository.UserRepository;
import com.interndesk.service.ApplicationService;
import com.interndesk.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Submit and manage internship applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;
    private final InterviewRepository interviewRepository;
    private final NotificationService notificationService;

    // Apply for an internship
    @PostMapping("/api/internships/{internshipId}/applications")
    @Operation(summary = "Apply for an internship (student only)")
    public ResponseEntity<ApiResponse<ApplicationDto.ApplicationResponse>> apply(
            @PathVariable Long internshipId,
            @Valid @RequestBody ApplicationDto.ApplyRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        ApplicationDto.ApplicationResponse response = applicationService.apply(internshipId, req, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Application submitted successfully.", response));
    }

    // Student: view own applications
    @GetMapping("/api/applications/me")
    @Operation(summary = "Get current student's applications")
    public ResponseEntity<ApiResponse<Page<ApplicationDto.ApplicationSummary>>> myApplications(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        Page<ApplicationDto.ApplicationSummary> result = applicationService.getStudentApplications(user.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(result)
            .withPagination(result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages()));
    }

    // Company: view applications to own internships
    @GetMapping("/api/companies/me/applications")
    @Operation(summary = "Get applications for current company's internships")
    public ResponseEntity<ApiResponse<Page<ApplicationDto.ApplicationResponse>>> companyApplications(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(required = false) Long internshipId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        Page<ApplicationDto.ApplicationResponse> result = applicationService.getCompanyApplications(user.getId(), internshipId, page, size);
        return ResponseEntity.ok(ApiResponse.success(result)
            .withPagination(result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages()));
    }

    // Get application by ID
    @GetMapping("/api/applications/{id}")
    @Operation(summary = "Get application details")
    public ResponseEntity<ApiResponse<ApplicationDto.ApplicationResponse>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success(applicationService.getApplicationById(id, user.getId())));
    }

    // Update application status
    @PatchMapping("/api/applications/{id}/status")
    @Operation(summary = "Update application status (company: review/shortlist/interview/select/reject; student: withdraw)")
    public ResponseEntity<ApiResponse<ApplicationDto.ApplicationResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationDto.StatusUpdateRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success("Application status updated.",
            applicationService.updateStatus(id, req, user.getId())));
    }

    // Get status history for an application
    @GetMapping("/api/applications/{id}/history")
    @Operation(summary = "Get status change history for an application")
    public ResponseEntity<ApiResponse<List<ApplicationDto.StatusHistoryEntry>>> getHistory(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success(applicationService.getStatusHistory(id, user.getId())));
    }

    // Schedule interview for applicant
    @PostMapping("/api/applications/{id}/interviews")
    @Operation(summary = "Schedule interview for applicant (Company only)")
    public ResponseEntity<ApiResponse<Interview>> scheduleInterview(
            @PathVariable Long id,
            @RequestBody Interview interviewReq,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        Company company = companyRepository.findByUserId(user.getId())
            .orElseThrow(() -> new UnauthorizedException("Only company accounts can schedule interviews."));

        Application app = applicationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Application", id));

        if (!app.getInternship().getCompany().getId().equals(company.getId())) {
            throw new UnauthorizedException("You are not authorized to schedule interviews for this applicant.");
        }

        interviewReq.setApplication(app);
        Interview saved = interviewRepository.save(interviewReq);

        notificationService.createNotification(
            app.getStudent().getUser(),
            "Interview Scheduled",
            "An interview has been scheduled for your application to " + app.getInternship().getTitle(),
            Notification.NotificationType.INTERVIEW_SCHEDULED,
            saved.getId(), "INTERVIEW"
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Interview scheduled successfully.", saved));
    }

    // List interviews for an application
    @GetMapping("/api/applications/{id}/interviews")
    @Operation(summary = "List interviews for an application")
    public ResponseEntity<ApiResponse<List<Interview>>> getInterviews(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        Application app = applicationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Application", id));

        boolean isStudent = app.getStudent().getUser().getId().equals(user.getId());
        boolean isCompany = app.getInternship().getCompany().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isStudent && !isCompany && !isAdmin) {
            throw new UnauthorizedException("Not authorized to view interviews for this application.");
        }

        return ResponseEntity.ok(ApiResponse.success(interviewRepository.findByApplicationIdOrderByScheduledAtDesc(id)));
    }

    // Download candidate resume attached to application (Company or Candidate or Admin)
    @GetMapping("/api/applications/{id}/resume")
    @Operation(summary = "Download candidate resume attached to this application")
    public ResponseEntity<org.springframework.core.io.Resource> downloadApplicationResume(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) throws java.net.MalformedURLException {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        Application app = applicationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Application", id));

        boolean isStudent = app.getStudent().getUser().getId().equals(user.getId());
        boolean isCompany = app.getInternship().getCompany().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isStudent && !isCompany && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to download this candidate's resume.");
        }

        if (app.getResume() == null) {
            throw new ResourceNotFoundException("No resume file was attached to this application.");
        }

        com.interndesk.entity.StudentResume resume = app.getResume();
        org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(java.nio.file.Path.of(resume.getStoragePath()).toUri());
        return ResponseEntity.ok()
            .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resume.getOriginalFilename() + "\"")
            .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
            .body(resource);
    }
}

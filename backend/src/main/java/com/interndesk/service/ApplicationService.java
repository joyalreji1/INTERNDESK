package com.interndesk.service;

import com.interndesk.dto.ApplicationDto;
import com.interndesk.entity.*;
import com.interndesk.exception.*;
import com.interndesk.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final InternshipRepository internshipRepository;
    private final StudentResumeRepository resumeRepository;
    private final CompanyRepository companyRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Transactional
    public ApplicationDto.ApplicationResponse apply(Long internshipId, ApplicationDto.ApplyRequest req, Long userId) {
        StudentProfile student = studentProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found. Please complete your profile first."));

        Internship internship = internshipRepository.findById(internshipId)
            .orElseThrow(() -> new ResourceNotFoundException("Internship", internshipId));

        if (internship.getStatus() != Internship.InternshipStatus.ACTIVE) {
            throw new BusinessException("This internship is no longer accepting applications.");
        }

        if (internship.getApplicationDeadline() != null && internship.getApplicationDeadline().isBefore(java.time.LocalDate.now())) {
            throw new BusinessException("The application deadline for this internship has passed.");
        }

        if (applicationRepository.existsByStudentIdAndInternshipId(student.getId(), internshipId)) {
            throw new DuplicateResourceException("You have already applied for this internship.");
        }

        StudentResume resume = null;
        if (req.getResumeId() != null) {
            resume = resumeRepository.findById(req.getResumeId())
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found."));
            if (!resume.getStudent().getId().equals(student.getId())) {
                throw new UnauthorizedException("This resume does not belong to you.");
            }
        } else {
            // Use primary resume if available
            resume = resumeRepository.findByStudentIdAndIsPrimaryTrue(student.getId()).orElse(null);
        }

        Application application = Application.builder()
            .student(student)
            .internship(internship)
            .resume(resume)
            .coverLetter(req.getCoverLetter())
            .status(Application.ApplicationStatus.APPLIED)
            .build();

        application = applicationRepository.save(application);

        // Record initial status in history
        recordStatusChange(application, null, Application.ApplicationStatus.APPLIED, userId, "Application submitted.");

        // Notify company
        notificationService.createNotification(
            internship.getCompany().getUser(),
            "New Application Received",
            student.getUser().getFullName() + " applied for \"" + internship.getTitle() + "\".",
            Notification.NotificationType.NEW_APPLICATION,
            application.getId(), "APPLICATION"
        );

        log.info("Student {} applied for internship {}", student.getId(), internshipId);
        return toResponse(application);
    }

    @Transactional
    public ApplicationDto.ApplicationResponse updateStatus(Long applicationId, ApplicationDto.StatusUpdateRequest req, Long userId) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

        Application.ApplicationStatus current = application.getStatus();
        Application.ApplicationStatus next = req.getNewStatus();

        // Students can only WITHDRAW
        // Companies can do UNDER_REVIEW, SHORTLISTED, INTERVIEW, SELECTED, REJECTED
        User currentUser = application.getStudent().getUser();

        // Validate ownership: either the student (for WITHDRAWN) or company that owns the internship
        Company company = companyRepository.findByUserId(userId).orElse(null);
        boolean isStudent = application.getStudent().getUser().getId().equals(userId);
        boolean isCompanyOwner = company != null &&
            application.getInternship().getCompany().getId().equals(company.getId());

        if (!isStudent && !isCompanyOwner) {
            throw new UnauthorizedException("You are not authorized to update this application.");
        }

        if (isStudent && next != Application.ApplicationStatus.WITHDRAWN) {
            throw new BusinessException("Students can only withdraw their applications.");
        }

        if (!current.canTransitionTo(next)) {
            throw new InvalidStatusTransitionException(current, next);
        }

        Application.ApplicationStatus prevStatus = application.getStatus();
        application.setStatus(next);
        if (next == Application.ApplicationStatus.WITHDRAWN) {
            application.setWithdrawnAt(LocalDateTime.now());
        }

        application = applicationRepository.save(application);
        recordStatusChange(application, prevStatus, next, userId, req.getRemarks());

        // Notify student about status change
        if (isCompanyOwner) {
            String msg = "Your application for \"" + application.getInternship().getTitle() + "\" at " +
                application.getInternship().getCompany().getCompanyName() + " has been updated to: " + next.name();
            notificationService.createNotification(
                application.getStudent().getUser(),
                "Application Status Updated",
                msg,
                Notification.NotificationType.APPLICATION_STATUS,
                application.getId(), "APPLICATION"
            );
        }

        return toResponse(application);
    }

    @Transactional(readOnly = true)
    public Page<ApplicationDto.ApplicationSummary> getStudentApplications(Long userId, int page, int size) {
        StudentProfile student = studentProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Page<Application> apps = applicationRepository.findByStudentId(
            student.getId(), PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt")));
        return apps.map(this::toSummary);
    }

    @Transactional(readOnly = true)
    public Page<ApplicationDto.ApplicationResponse> getCompanyApplications(Long userId, Long internshipId, int page, int size) {
        Company company = companyRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        Page<Application> apps;
        if (internshipId != null) {
            apps = applicationRepository.findByCompanyIdAndInternshipId(company.getId(), internshipId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt")));
        } else {
            apps = applicationRepository.findByCompanyId(company.getId(), PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt")));
        }
        return apps.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ApplicationDto.ApplicationResponse getApplicationById(Long id, Long userId) {
        Application app = applicationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Application", id));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        // Authorize: student owner, company owner, or admin
        boolean isAdmin = user.getRole() == User.Role.ADMIN;
        boolean isStudent = app.getStudent().getUser().getId().equals(userId);
        Company company = companyRepository.findByUserId(userId).orElse(null);
        boolean isCompanyOwner = company != null &&
            app.getInternship().getCompany().getId().equals(company.getId());

        if (!isAdmin && !isStudent && !isCompanyOwner) {
            throw new UnauthorizedException("You are not authorized to view this application.");
        }

        return toResponse(app);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto.StatusHistoryEntry> getStatusHistory(Long applicationId, Long userId) {
        Application app = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

        boolean isStudent = app.getStudent().getUser().getId().equals(userId);
        Company company = companyRepository.findByUserId(userId).orElse(null);
        boolean isCompanyOwner = company != null &&
            app.getInternship().getCompany().getId().equals(company.getId());

        if (!isStudent && !isCompanyOwner) {
            throw new UnauthorizedException("Access denied.");
        }

        return statusHistoryRepository.findByApplicationIdOrderByChangedAtDesc(applicationId)
            .stream().map(h -> {
                ApplicationDto.StatusHistoryEntry e = new ApplicationDto.StatusHistoryEntry();
                e.setId(h.getId());
                e.setPreviousStatus(h.getPreviousStatus() != null ? h.getPreviousStatus().name() : null);
                e.setNewStatus(h.getNewStatus().name());
                e.setChangedBy(h.getChangedBy().getFullName());
                e.setRemarks(h.getRemarks());
                e.setChangedAt(h.getChangedAt());
                return e;
            }).collect(Collectors.toList());
    }

    private void recordStatusChange(Application app, Application.ApplicationStatus prev,
                                    Application.ApplicationStatus next, Long changedById, String remarks) {
        // Load the user reference lazily
        User changedBy = app.getStudent().getUser();
        // Try to find actual actor — use application student user as a fallback
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
            .application(app)
            .previousStatus(prev)
            .newStatus(next)
            .changedBy(changedBy)
            .remarks(remarks)
            .build();
        statusHistoryRepository.save(history);
    }

    public ApplicationDto.ApplicationResponse toResponse(Application a) {
        ApplicationDto.ApplicationResponse r = new ApplicationDto.ApplicationResponse();
        r.setId(a.getId());
        r.setInternshipId(a.getInternship().getId());
        r.setInternshipTitle(a.getInternship().getTitle());
        r.setCompanyId(a.getInternship().getCompany().getId());
        r.setCompanyName(a.getInternship().getCompany().getCompanyName());
        r.setCompanyLogo(a.getInternship().getCompany().getLogoPath());
        r.setStudentId(a.getStudent().getId());
        r.setStudentName(a.getStudent().getUser().getFullName());
        r.setStudentEmail(a.getStudent().getUser().getEmail());
        r.setStudentCollege(a.getStudent().getCollegeName());
        r.setStudentDegree(a.getStudent().getDegree());
        r.setStudentDepartment(a.getStudent().getDepartment());
        r.setStatus(a.getStatus().name());
        r.setCoverLetter(a.getCoverLetter());
        if (a.getResume() != null) {
            r.setResumeId(a.getResume().getId());
            r.setResumeFilename(a.getResume().getOriginalFilename());
        }
        r.setAppliedAt(a.getAppliedAt());
        r.setUpdatedAt(a.getUpdatedAt());
        r.setWithdrawnAt(a.getWithdrawnAt());
        return r;
    }

    public ApplicationDto.ApplicationSummary toSummary(Application a) {
        ApplicationDto.ApplicationSummary s = new ApplicationDto.ApplicationSummary();
        s.setId(a.getId());
        s.setStatus(a.getStatus().name());
        s.setAppliedAt(a.getAppliedAt());
        s.setInternshipId(a.getInternship().getId());
        s.setInternshipTitle(a.getInternship().getTitle());
        s.setCompanyName(a.getInternship().getCompany().getCompanyName());
        s.setCompanyLogo(a.getInternship().getCompany().getLogoPath());
        s.setWorkMode(a.getInternship().getWorkMode().name());
        s.setLocation(a.getInternship().getLocation());
        return s;
    }
}

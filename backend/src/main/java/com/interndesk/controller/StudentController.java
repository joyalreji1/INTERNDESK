package com.interndesk.controller;

import com.interndesk.dto.ApiResponse;
import com.interndesk.entity.*;
import com.interndesk.exception.*;
import com.interndesk.repository.*;
import com.interndesk.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Tag(name = "Student Profile", description = "Student profile and resume management")
public class StudentController {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final StudentResumeRepository studentResumeRepository;
    private final StudentEducationRepository studentEducationRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final StudentProjectRepository studentProjectRepository;
    private final StudentCertificationRepository studentCertificationRepository;
    private final SavedInternshipRepository savedInternshipRepository;
    private final InternshipRepository internshipRepository;
    private final com.interndesk.service.ApplicationService applicationService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @GetMapping("/me")
    @Operation(summary = "Get current student's full profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyProfile(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return ResponseEntity.ok(ApiResponse.success(buildProfileResponse(user, sp)));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current student's profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @RequestBody StudentProfileUpdateRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        // Update user-level fields
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        userRepository.save(user);

        // Update profile fields
        if (req.getCollegeName() != null) sp.setCollegeName(req.getCollegeName());
        if (req.getUniversityName() != null) sp.setUniversityName(req.getUniversityName());
        if (req.getDepartment() != null) sp.setDepartment(req.getDepartment());
        if (req.getDegree() != null) sp.setDegree(req.getDegree());
        if (req.getSpecialization() != null) sp.setSpecialization(req.getSpecialization());
        if (req.getCurrentSemester() != null) sp.setCurrentSemester(req.getCurrentSemester());
        if (req.getAdmissionYear() != null) sp.setAdmissionYear(req.getAdmissionYear());
        if (req.getGraduationYear() != null) sp.setGraduationYear(req.getGraduationYear());
        if (req.getCgpa() != null) sp.setCgpa(req.getCgpa());
        if (req.getProfessionalSummary() != null) sp.setProfessionalSummary(req.getProfessionalSummary());
        if (req.getCity() != null) sp.setCity(req.getCity());
        if (req.getState() != null) sp.setState(req.getState());
        if (req.getCountry() != null) sp.setCountry(req.getCountry());
        if (req.getLinkedinUrl() != null) sp.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getGithubUrl() != null) sp.setGithubUrl(req.getGithubUrl());
        if (req.getPortfolioUrl() != null) sp.setPortfolioUrl(req.getPortfolioUrl());
        if (req.getRegistrationNumber() != null) sp.setRegistrationNumber(req.getRegistrationNumber());

        studentProfileRepository.save(sp);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully.", buildProfileResponse(user, sp)));
    }

    @GetMapping("/me/applications")
    @Operation(summary = "Get current student's applications")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<com.interndesk.dto.ApplicationDto.ApplicationSummary>>> getMyApplications(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        var result = applicationService.getStudentApplications(user.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(result)
            .withPagination(result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages()));
    }

    // Resume management
    @PostMapping("/me/resumes")
    @Operation(summary = "Upload a resume (PDF only, max 5MB)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails principal) throws IOException {

        if (file.isEmpty()) throw new BusinessException("Please select a file to upload.");
        String contentType = file.getContentType();
        if (!"application/pdf".equals(contentType)) {
            throw new BusinessException("Only PDF files are accepted.");
        }
        long maxSize = 5L * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new BusinessException("Resume must be under 5MB.");
        }

        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile student = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        // Store outside public root
        Path uploadPath = Paths.get(uploadDir, "resumes", String.valueOf(student.getId()));
        Files.createDirectories(uploadPath);

        String storedFilename = UUID.randomUUID() + ".pdf";
        Path dest = uploadPath.resolve(storedFilename);
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

        StudentResume resume = StudentResume.builder()
            .student(student)
            .originalFilename(file.getOriginalFilename())
            .storedFilename(storedFilename)
            .storagePath(dest.toAbsolutePath().toString())
            .contentType("application/pdf")
            .fileSize(file.getSize())
            .isPrimary(studentResumeRepository.countByStudentId(student.getId()) == 0)
            .build();

        resume = studentResumeRepository.save(resume);

        Map<String, Object> r = new HashMap<>();
        r.put("id", resume.getId());
        r.put("originalFilename", resume.getOriginalFilename());
        r.put("fileSize", resume.getFileSize());
        r.put("isPrimary", resume.getIsPrimary());
        r.put("uploadedAt", resume.getUploadedAt());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Resume uploaded.", r));
    }

    @GetMapping("/me/resumes")
    @Operation(summary = "List all uploaded resumes")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listResumes(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile student = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        List<Map<String, Object>> resumes = studentResumeRepository
            .findByStudentIdOrderByUploadedAtDesc(student.getId()).stream()
            .map(r -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", r.getId());
                m.put("originalFilename", r.getOriginalFilename());
                m.put("fileSize", r.getFileSize());
                m.put("isPrimary", r.getIsPrimary());
                m.put("uploadedAt", r.getUploadedAt());
                return m;
            }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(resumes));
    }

    @PatchMapping("/me/resumes/{id}/primary")
    @Operation(summary = "Set a resume as primary")
    public ResponseEntity<ApiResponse<Void>> setPrimary(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile student = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        StudentResume resume = studentResumeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        if (!resume.getStudent().getId().equals(student.getId())) {
            throw new UnauthorizedException("This resume does not belong to you.");
        }

        studentResumeRepository.clearPrimaryForStudent(student.getId());
        resume.setIsPrimary(true);
        studentResumeRepository.save(resume);

        return ResponseEntity.ok(ApiResponse.success("Primary resume updated.", null));
    }

    @DeleteMapping("/me/resumes/{id}")
    @Operation(summary = "Delete a resume")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) throws IOException {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile student = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        StudentResume resume = studentResumeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        if (!resume.getStudent().getId().equals(student.getId())) {
            throw new UnauthorizedException("This resume does not belong to you.");
        }

        // Delete physical file
        try { Files.deleteIfExists(Path.of(resume.getStoragePath())); } catch (Exception ignored) {}
        studentResumeRepository.delete(resume);

        return ResponseEntity.ok(ApiResponse.success("Resume deleted.", null));
    }

    @GetMapping("/me/resumes/{id}/download")
    @Operation(summary = "Download a resume file")
    public ResponseEntity<Resource> downloadResume(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) throws MalformedURLException {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile student = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        StudentResume resume = studentResumeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        if (!resume.getStudent().getId().equals(student.getId())) {
            throw new UnauthorizedException("This resume does not belong to you.");
        }

        Resource resource = new UrlResource(Path.of(resume.getStoragePath()).toUri());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resume.getOriginalFilename() + "\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(resource);
    }

    // ==========================================
    // Education CRUD
    // ==========================================
    @GetMapping("/me/education")
    @Operation(summary = "Get student education records")
    public ResponseEntity<ApiResponse<List<StudentEducation>>> getEducation(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return ResponseEntity.ok(ApiResponse.success(studentEducationRepository.findByStudentIdOrderByStartYearDesc(sp.getId())));
    }

    @PostMapping("/me/education")
    @Operation(summary = "Add education record")
    public ResponseEntity<ApiResponse<StudentEducation>> addEducation(
            @RequestBody StudentEducation education,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        education.setStudent(sp);
        StudentEducation saved = studentEducationRepository.save(education);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Education record added.", saved));
    }

    @DeleteMapping("/me/education/{id}")
    @Operation(summary = "Delete education record")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        StudentEducation edu = studentEducationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Education record not found"));
        if (!edu.getStudent().getId().equals(sp.getId())) {
            throw new UnauthorizedException("This education record does not belong to you.");
        }
        studentEducationRepository.delete(edu);
        return ResponseEntity.ok(ApiResponse.success("Education record deleted.", null));
    }

    // ==========================================
    // Skills CRUD
    // ==========================================
    @GetMapping("/me/skills")
    @Operation(summary = "Get student skills")
    public ResponseEntity<ApiResponse<List<StudentSkill>>> getSkills(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return ResponseEntity.ok(ApiResponse.success(studentSkillRepository.findByStudentId(sp.getId())));
    }

    @PostMapping("/me/skills")
    @Operation(summary = "Add skill")
    public ResponseEntity<ApiResponse<StudentSkill>> addSkill(
            @RequestBody StudentSkill skill,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        skill.setStudent(sp);
        StudentSkill saved = studentSkillRepository.save(skill);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Skill added.", saved));
    }

    @DeleteMapping("/me/skills/{id}")
    @Operation(summary = "Delete skill")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        StudentSkill skill = studentSkillRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        if (!skill.getStudent().getId().equals(sp.getId())) {
            throw new UnauthorizedException("This skill does not belong to you.");
        }
        studentSkillRepository.delete(skill);
        return ResponseEntity.ok(ApiResponse.success("Skill deleted.", null));
    }

    // ==========================================
    // Projects CRUD
    // ==========================================
    @GetMapping("/me/projects")
    @Operation(summary = "Get student projects")
    public ResponseEntity<ApiResponse<List<StudentProject>>> getProjects(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return ResponseEntity.ok(ApiResponse.success(studentProjectRepository.findByStudentIdOrderByStartDateDesc(sp.getId())));
    }

    @PostMapping("/me/projects")
    @Operation(summary = "Add project")
    public ResponseEntity<ApiResponse<StudentProject>> addProject(
            @RequestBody StudentProject project,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        project.setStudent(sp);
        StudentProject saved = studentProjectRepository.save(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Project added.", saved));
    }

    @DeleteMapping("/me/projects/{id}")
    @Operation(summary = "Delete project")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        StudentProject project = studentProjectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        if (!project.getStudent().getId().equals(sp.getId())) {
            throw new UnauthorizedException("This project does not belong to you.");
        }
        studentProjectRepository.delete(project);
        return ResponseEntity.ok(ApiResponse.success("Project deleted.", null));
    }

    // ==========================================
    // Certifications CRUD
    // ==========================================
    @GetMapping("/me/certifications")
    @Operation(summary = "Get student certifications")
    public ResponseEntity<ApiResponse<List<StudentCertification>>> getCertifications(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return ResponseEntity.ok(ApiResponse.success(studentCertificationRepository.findByStudentIdOrderByIssueDateDesc(sp.getId())));
    }

    @PostMapping("/me/certifications")
    @Operation(summary = "Add certification")
    public ResponseEntity<ApiResponse<StudentCertification>> addCertification(
            @RequestBody StudentCertification cert,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        cert.setStudent(sp);
        StudentCertification saved = studentCertificationRepository.save(cert);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Certification added.", saved));
    }

    @DeleteMapping("/me/certifications/{id}")
    @Operation(summary = "Delete certification")
    public ResponseEntity<ApiResponse<Void>> deleteCertification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        StudentCertification cert = studentCertificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Certification not found"));
        if (!cert.getStudent().getId().equals(sp.getId())) {
            throw new UnauthorizedException("This certification does not belong to you.");
        }
        studentCertificationRepository.delete(cert);
        return ResponseEntity.ok(ApiResponse.success("Certification deleted.", null));
    }

    // ==========================================
    // Saved Internships
    // ==========================================
    @GetMapping("/me/saved")
    @Operation(summary = "Get saved internships for student")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSavedInternships(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        List<SavedInternship> saved = savedInternshipRepository.findByStudentIdOrderByCreatedAtDesc(sp.getId());
        List<Map<String, Object>> result = saved.stream().map(s -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", s.getId());
            m.put("internshipId", s.getInternship().getId());
            m.put("title", s.getInternship().getTitle());
            m.put("companyName", s.getInternship().getCompany().getCompanyName());
            m.put("location", s.getInternship().getLocation());
            m.put("workMode", s.getInternship().getWorkMode());
            m.put("stipendMin", s.getInternship().getStipendMin());
            m.put("stipendMax", s.getInternship().getStipendMax());
            m.put("savedAt", s.getCreatedAt());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/me/saved/{internshipId}")
    @Operation(summary = "Save an internship")
    public ResponseEntity<ApiResponse<Void>> saveInternship(
            @PathVariable Long internshipId,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        if (savedInternshipRepository.existsByStudentIdAndInternshipId(sp.getId(), internshipId)) {
            return ResponseEntity.ok(ApiResponse.success("Internship already saved.", null));
        }
        Internship internship = internshipRepository.findById(internshipId)
            .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));
        SavedInternship s = SavedInternship.builder()
            .student(sp)
            .internship(internship)
            .build();
        savedInternshipRepository.save(s);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Internship saved.", null));
    }

    @DeleteMapping("/me/saved/{internshipId}")
    @Operation(summary = "Remove saved internship")
    public ResponseEntity<ApiResponse<Void>> removeSavedInternship(
            @PathVariable Long internshipId,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        StudentProfile sp = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        savedInternshipRepository.findByStudentIdAndInternshipId(sp.getId(), internshipId)
            .ifPresent(savedInternshipRepository::delete);
        return ResponseEntity.ok(ApiResponse.success("Saved internship removed.", null));
    }

    private Map<String, Object> buildProfileResponse(User user, StudentProfile sp) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("userId", user.getId());
        m.put("profileId", sp.getId());
        m.put("fullName", user.getFullName());
        m.put("email", user.getEmail());
        m.put("phone", user.getPhone());
        m.put("role", user.getRole().name());
        m.put("registrationNumber", sp.getRegistrationNumber());
        m.put("dateOfBirth", sp.getDateOfBirth());
        m.put("gender", sp.getGender());
        m.put("profilePhotoPath", sp.getProfilePhotoPath());
        m.put("collegeName", sp.getCollegeName());
        m.put("universityName", sp.getUniversityName());
        m.put("department", sp.getDepartment());
        m.put("degree", sp.getDegree());
        m.put("specialization", sp.getSpecialization());
        m.put("currentSemester", sp.getCurrentSemester());
        m.put("admissionYear", sp.getAdmissionYear());
        m.put("graduationYear", sp.getGraduationYear());
        m.put("cgpa", sp.getCgpa());
        m.put("backlogsCount", sp.getBacklogsCount());
        m.put("professionalSummary", sp.getProfessionalSummary());
        m.put("city", sp.getCity());
        m.put("state", sp.getState());
        m.put("country", sp.getCountry());
        m.put("postalCode", sp.getPostalCode());
        m.put("linkedinUrl", sp.getLinkedinUrl());
        m.put("githubUrl", sp.getGithubUrl());
        m.put("portfolioUrl", sp.getPortfolioUrl());
        m.put("createdAt", sp.getCreatedAt());
        m.put("updatedAt", sp.getUpdatedAt());
        return m;
    }

    @Data
    public static class StudentProfileUpdateRequest {
        private String phone;
        private String registrationNumber;
        private String collegeName;
        private String universityName;
        private String department;
        private String degree;
        private String specialization;
        private Integer currentSemester;
        private Integer admissionYear;
        private Integer graduationYear;
        private BigDecimal cgpa;
        private String professionalSummary;
        private String city;
        private String state;
        private String country;
        private String postalCode;
        private String linkedinUrl;
        private String githubUrl;
        private String portfolioUrl;
    }
}

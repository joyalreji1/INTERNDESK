package com.interndesk.dto;

import com.interndesk.entity.Application;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

public class ApplicationDto {

    @Data
    public static class ApplyRequest {
        private Long resumeId;

        @Size(max = 5000, message = "Cover letter must be under 5000 characters")
        private String coverLetter;
    }

    @Data
    public static class StatusUpdateRequest {
        @NotNull(message = "New status is required")
        private Application.ApplicationStatus newStatus;

        @Size(max = 1000)
        private String remarks;

        @Size(max = 2000)
        private String rejectionReason;
    }

    @Data
    public static class ApplicationResponse {
        private Long id;
        private Long internshipId;
        private String internshipTitle;
        private String internshipType;
        private java.math.BigDecimal internshipFee;
        private String currency;
        private Long companyId;
        private String companyName;
        private String companyLogo;
        private Long studentId;
        private String studentName;
        private String studentEmail;
        private String studentCollege;
        private String studentDegree;
        private String studentDepartment;
        private String studentRegistrationNumber;
        private Integer studentCurrentSemester;
        private java.math.BigDecimal studentCgpa;
        private String studentSkills;
        private String status;
        private String eligibilityStatus;
        private LocalDateTime selectedAt;
        private String paymentStatus;
        private LocalDateTime enrolledAt;
        private String rejectionReason;
        private String coverLetter;
        private Long resumeId;
        private String resumeFilename;
        private LocalDateTime appliedAt;
        private LocalDateTime updatedAt;
        private LocalDateTime withdrawnAt;
    }

    @Data
    public static class ApplicationSummary {
        private Long id;
        private String status;
        private String eligibilityStatus;
        private String paymentStatus;
        private String internshipType;
        private java.math.BigDecimal internshipFee;
        private LocalDateTime appliedAt;
        private Long internshipId;
        private String internshipTitle;
        private String companyName;
        private String companyLogo;
        private String workMode;
        private String location;
    }

    @Data
    public static class StatusHistoryEntry {
        private Long id;
        private String previousStatus;
        private String newStatus;
        private String changedBy;
        private String remarks;
        private LocalDateTime changedAt;
    }
}

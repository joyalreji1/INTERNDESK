package com.interndesk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class InternshipEligibilityDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EligibilityRequest {
        private BigDecimal minimumCgpa;
        private BigDecimal minimumPercentage;
        private String eligibleDegrees;
        private String eligibleDepartments;
        private String eligibleSemesters;
        private Integer minimumSemester;
        private String requiredSkills;
        private String requiredCertifications;
        private Boolean resumeRequired;
        private String academicDocumentRequirements;
        private String additionalConditions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EligibilityResponse {
        private Long id;
        private Long internshipId;
        private BigDecimal minimumCgpa;
        private BigDecimal minimumPercentage;
        private String eligibleDegrees;
        private String eligibleDepartments;
        private String eligibleSemesters;
        private Integer minimumSemester;
        private String requiredSkills;
        private String requiredCertifications;
        private Boolean resumeRequired;
        private String academicDocumentRequirements;
        private String additionalConditions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CriterionCheck {
        private String criterion;
        private String requiredValue;
        private String actualValue;
        private boolean satisfied;
        private String explanation;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EligibilityEvaluationResult {
        private boolean eligible;
        private String status; // ELIGIBLE, NOT_ELIGIBLE, PROFILE_INCOMPLETE, PENDING_VERIFICATION
        private String summary;
        @Builder.Default
        private List<CriterionCheck> checks = new ArrayList<>();
        @Builder.Default
        private List<String> unmetCriteria = new ArrayList<>();
    }
}

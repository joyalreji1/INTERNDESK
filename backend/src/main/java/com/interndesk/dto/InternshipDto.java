package com.interndesk.dto;

import com.interndesk.entity.Internship;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class InternshipDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Title is required")
        @Size(max = 200)
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        private String responsibilities;
        private String eligibilityCriteria;
        private String category;

        @NotNull
        private Internship.InternshipType internshipType;

        @NotNull
        private Internship.WorkMode workMode;

        private String location;

        @Min(value = 1, message = "Duration must be at least 1 month")
        @Max(value = 24)
        private Integer durationMonths;

        @DecimalMin("0.00")
        private BigDecimal stipendMin;

        @DecimalMin("0.00")
        private BigDecimal stipendMax;

        private Boolean isPaid;

        @Min(1)
        @Max(500)
        private Integer openings;

        private LocalDate applicationDeadline;
        private LocalDate startDate;
        private LocalDate endDate;

        @DecimalMin("0.00")
        @DecimalMax("10.00")
        private BigDecimal minimumCgpa;

        private Integer minimumSemester;

        private List<SkillDto> skills;
    }

    @Data
    public static class SkillDto {
        @NotBlank
        private String skillName;
        private Boolean isRequired;
    }

    @Data
    public static class InternshipResponse {
        private Long id;
        private Long companyId;
        private String companyName;
        private String companyLogo;
        private String companyCity;
        private String companyIndustry;
        private String title;
        private String description;
        private String responsibilities;
        private String eligibilityCriteria;
        private String category;
        private String internshipType;
        private String workMode;
        private String location;
        private Integer durationMonths;
        private BigDecimal stipendMin;
        private BigDecimal stipendMax;
        private String stipendCurrency;
        private Boolean isPaid;
        private Integer openings;
        private LocalDate applicationDeadline;
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal minimumCgpa;
        private Integer minimumSemester;
        private String status;
        private Integer viewsCount;
        private List<SkillDto> skills;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Boolean hasApplied;
        private Boolean isSaved;
    }

    @Data
    public static class InternshipSummary {
        private Long id;
        private String title;
        private String companyName;
        private String companyLogo;
        private String workMode;
        private String location;
        private Integer durationMonths;
        private BigDecimal stipendMin;
        private BigDecimal stipendMax;
        private Boolean isPaid;
        private LocalDate applicationDeadline;
        private String status;
        private String category;
        private LocalDateTime createdAt;
    }
}

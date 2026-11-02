package com.interndesk.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "internship_eligibility")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class InternshipEligibility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false, unique = true)
    @JsonIgnore
    private Internship internship;

    @Column(name = "minimum_cgpa", precision = 4, scale = 2)
    private BigDecimal minimumCgpa;

    @Column(name = "minimum_percentage", precision = 5, scale = 2)
    private BigDecimal minimumPercentage;

    @Column(name = "eligible_degrees", length = 500)
    private String eligibleDegrees;

    @Column(name = "eligible_departments", length = 500)
    private String eligibleDepartments;

    @Column(name = "eligible_semesters", length = 100)
    private String eligibleSemesters;

    @Column(name = "minimum_semester")
    private Integer minimumSemester;

    @Column(name = "required_skills", length = 500)
    private String requiredSkills;

    @Column(name = "required_certifications", length = 500)
    private String requiredCertifications;

    @Column(name = "resume_required", nullable = false)
    @Builder.Default
    private Boolean resumeRequired = true;

    @Column(name = "academic_document_requirements", length = 500)
    private String academicDocumentRequirements;

    @Column(name = "additional_conditions", columnDefinition = "TEXT")
    private String additionalConditions;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

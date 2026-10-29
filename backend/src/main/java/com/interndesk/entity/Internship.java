package com.interndesk.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "internships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(name = "eligibility_criteria", columnDefinition = "TEXT")
    private String eligibilityCriteria;

    @Column(length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "internship_type", nullable = false)
    @Builder.Default
    private InternshipType internshipType = InternshipType.FULL_TIME;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_mode", nullable = false)
    @Builder.Default
    private WorkMode workMode = WorkMode.ONSITE;

    @Column(length = 200)
    private String location;

    @Column(name = "duration_months")
    private Integer durationMonths;

    @Column(name = "stipend_min", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal stipendMin = BigDecimal.ZERO;

    @Column(name = "stipend_max", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal stipendMax = BigDecimal.ZERO;

    @Column(name = "stipend_currency", length = 10)
    @Builder.Default
    private String stipendCurrency = "INR";

    @Column(name = "is_paid", nullable = false)
    @Builder.Default
    private Boolean isPaid = true;

    @Column
    @Builder.Default
    private Integer openings = 1;

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "minimum_cgpa", precision = 4, scale = 2)
    private BigDecimal minimumCgpa;

    @Column(name = "minimum_semester")
    private Integer minimumSemester;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private InternshipStatus status = InternshipStatus.DRAFT;

    @Column(name = "views_count")
    @Builder.Default
    private Integer viewsCount = 0;

    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InternshipSkill> skills = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum InternshipType {
        FULL_TIME, PART_TIME, REMOTE, HYBRID
    }

    public enum WorkMode {
        REMOTE, HYBRID, ONSITE
    }

    public enum InternshipStatus {
        DRAFT, ACTIVE, CLOSED, CANCELLED
    }
}

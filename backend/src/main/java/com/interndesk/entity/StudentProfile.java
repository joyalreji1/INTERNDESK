package com.interndesk.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "registration_number", unique = true, length = 50)
    private String registrationNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "profile_photo_path", length = 500)
    private String profilePhotoPath;

    @Column(name = "college_name", length = 200)
    private String collegeName;

    @Column(name = "university_name", length = 200)
    private String universityName;

    @Column(length = 100)
    private String department;

    @Column(length = 100)
    private String degree;

    @Column(length = 100)
    private String specialization;

    @Column(name = "current_semester")
    private Integer currentSemester;

    @Column(name = "admission_year")
    private Integer admissionYear;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(precision = 4, scale = 2)
    private BigDecimal cgpa;

    @Column(name = "backlogs_count")
    @Builder.Default
    private Integer backlogsCount = 0;

    @Column(name = "professional_summary", columnDefinition = "TEXT")
    private String professionalSummary;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    @Builder.Default
    private String country = "India";

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "portfolio_url", length = 500)
    private String portfolioUrl;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum Gender {
        MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    }
}

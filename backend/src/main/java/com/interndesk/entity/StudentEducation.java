package com.interndesk.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_education")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentEducation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @Column(nullable = false, length = 200)
    private String institution;

    @Column(nullable = false, length = 100)
    private String qualification;

    @Column(length = 100)
    private String specialization;

    @Column(name = "start_year")
    private Integer startYear;

    @Column(name = "end_year")
    private Integer endYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "grade_type")
    private GradeType gradeType;

    @Column(name = "grade_value", length = 20)
    private String gradeValue;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum GradeType {
        CGPA, PERCENTAGE, GRADE
    }
}


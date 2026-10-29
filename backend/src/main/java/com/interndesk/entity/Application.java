package com.interndesk.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications",
    uniqueConstraints = @UniqueConstraint(name = "uq_application", columnNames = {"student_id", "internship_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private StudentResume resume;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(name = "applied_at", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime appliedAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "withdrawn_at")
    private LocalDateTime withdrawnAt;

    public enum ApplicationStatus {
        APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW, SELECTED, REJECTED, WITHDRAWN;

        public boolean canTransitionTo(ApplicationStatus next) {
            return switch (this) {
                case APPLIED        -> next == UNDER_REVIEW || next == REJECTED || next == WITHDRAWN;
                case UNDER_REVIEW   -> next == SHORTLISTED  || next == REJECTED || next == WITHDRAWN;
                case SHORTLISTED    -> next == INTERVIEW     || next == REJECTED || next == WITHDRAWN;
                case INTERVIEW      -> next == SELECTED      || next == REJECTED || next == WITHDRAWN;
                case SELECTED, REJECTED, WITHDRAWN -> false;
            };
        }
    }
}

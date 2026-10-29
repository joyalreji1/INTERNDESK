package com.interndesk.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "interview_type", nullable = false)
    @Builder.Default
    private InterviewType interviewType = InterviewType.ONLINE;

    @Column(name = "meeting_link", length = 500)
    private String meetingLink;

    @Column(length = 300)
    private String location;

    @Column(name = "interviewer_notes", columnDefinition = "TEXT")
    private String interviewerNotes;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Outcome outcome = Outcome.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum InterviewType {
        ONLINE, PHONE, IN_PERSON, TECHNICAL, HR
    }

    public enum Outcome {
        PENDING, PASSED, FAILED, NO_SHOW, RESCHEDULED
    }
}


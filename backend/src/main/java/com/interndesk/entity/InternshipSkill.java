package com.interndesk.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "internship_skills")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternshipSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    @Column(name = "is_required", nullable = false)
    @Builder.Default
    private Boolean isRequired = true;
}

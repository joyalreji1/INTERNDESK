package com.interndesk.service;

import com.interndesk.dto.InternshipEligibilityDto.EligibilityEvaluationResult;
import com.interndesk.entity.*;
import com.interndesk.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EligibilityEvaluationServiceTest {

    @Mock
    private InternshipEligibilityRepository eligibilityRepository;
    @Mock
    private StudentSkillRepository studentSkillRepository;
    @Mock
    private StudentCertificationRepository studentCertificationRepository;
    @Mock
    private StudentResumeRepository studentResumeRepository;

    @InjectMocks
    private EligibilityEvaluationService eligibilityService;

    private StudentProfile student;
    private Internship internship;
    private InternshipEligibility eligibility;

    @BeforeEach
    void setUp() {
        student = StudentProfile.builder()
            .id(101L)
            .cgpa(new BigDecimal("8.50"))
            .degree("B.Tech")
            .department("Computer Science & Engineering")
            .currentSemester(6)
            .build();

        internship = Internship.builder()
            .id(201L)
            .title("Cloud Systems Engineering Intern")
            .internshipType(Internship.InternshipType.FREE)
            .minimumCgpa(new BigDecimal("7.00"))
            .minimumSemester(5)
            .build();

        eligibility = InternshipEligibility.builder()
            .id(301L)
            .internship(internship)
            .minimumCgpa(new BigDecimal("7.50"))
            .eligibleDegrees("B.Tech, B.E")
            .eligibleDepartments("Computer Science & Engineering, Information Technology")
            .eligibleSemesters("5, 6, 7, 8")
            .minimumSemester(5)
            .requiredSkills("Java, Spring Boot")
            .resumeRequired(true)
            .build();

        internship.setEligibility(eligibility);
    }

    @Test
    @DisplayName("Should evaluate as ELIGIBLE when student meets all academic criteria")
    void testEligibleStudent() {
        when(studentSkillRepository.findByStudentId(101L)).thenReturn(List.of(
            StudentSkill.builder().skillName("Java").build(),
            StudentSkill.builder().skillName("Spring Boot").build()
        ));
        when(studentResumeRepository.findByStudentId(101L)).thenReturn(List.of(
            StudentResume.builder().id(501L).originalFilename("resume.pdf").build()
        ));

        EligibilityEvaluationResult result = eligibilityService.evaluate(student, internship);

        assertThat(result.isEligible()).isTrue();
        assertThat(result.getStatus()).isEqualTo("ELIGIBLE");
        assertThat(result.getUnmetCriteria()).isEmpty();
    }

    @Test
    @DisplayName("Should evaluate as NOT_ELIGIBLE when student CGPA is below minimum requirement")
    void testLowCgpaStudent() {
        student.setCgpa(new BigDecimal("6.80"));
        when(studentSkillRepository.findByStudentId(101L)).thenReturn(List.of(
            StudentSkill.builder().skillName("Java").build(),
            StudentSkill.builder().skillName("Spring Boot").build()
        ));
        when(studentResumeRepository.findByStudentId(101L)).thenReturn(List.of(
            StudentResume.builder().id(501L).originalFilename("resume.pdf").build()
        ));

        EligibilityEvaluationResult result = eligibilityService.evaluate(student, internship);

        assertThat(result.isEligible()).isFalse();
        assertThat(result.getStatus()).isEqualTo("NOT_ELIGIBLE");
        assertThat(result.getUnmetCriteria()).anyMatch(c -> c.contains("Minimum CGPA"));
    }

    @Test
    @DisplayName("Should evaluate as PROFILE_INCOMPLETE when essential academic fields are missing")
    void testIncompleteProfile() {
        student.setCgpa(null);
        student.setDepartment(null);

        EligibilityEvaluationResult result = eligibilityService.evaluate(student, internship);

        assertThat(result.isEligible()).isFalse();
        assertThat(result.getStatus()).isEqualTo("PROFILE_INCOMPLETE");
        assertThat(result.getUnmetCriteria()).anyMatch(c -> c.contains("Incomplete academic profile"));
    }

    @Test
    @DisplayName("Should evaluate as NOT_ELIGIBLE when required skills are missing")
    void testMissingSkills() {
        when(studentSkillRepository.findByStudentId(101L)).thenReturn(List.of(
            StudentSkill.builder().skillName("Python").build()
        ));
        when(studentResumeRepository.findByStudentId(101L)).thenReturn(List.of(
            StudentResume.builder().id(501L).originalFilename("resume.pdf").build()
        ));

        EligibilityEvaluationResult result = eligibilityService.evaluate(student, internship);

        assertThat(result.isEligible()).isFalse();
        assertThat(result.getStatus()).isEqualTo("NOT_ELIGIBLE");
        assertThat(result.getUnmetCriteria()).anyMatch(c -> c.contains("Missing required skills"));
    }
}

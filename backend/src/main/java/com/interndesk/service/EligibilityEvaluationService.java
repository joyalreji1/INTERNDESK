package com.interndesk.service;

import com.interndesk.dto.InternshipEligibilityDto;
import com.interndesk.dto.InternshipEligibilityDto.CriterionCheck;
import com.interndesk.dto.InternshipEligibilityDto.EligibilityEvaluationResult;
import com.interndesk.entity.*;
import com.interndesk.repository.InternshipEligibilityRepository;
import com.interndesk.repository.StudentCertificationRepository;
import com.interndesk.repository.StudentResumeRepository;
import com.interndesk.repository.StudentSkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EligibilityEvaluationService {

    private final InternshipEligibilityRepository eligibilityRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final StudentCertificationRepository studentCertificationRepository;
    private final StudentResumeRepository studentResumeRepository;

    @Transactional(readOnly = true)
    public EligibilityEvaluationResult evaluate(StudentProfile student, Internship internship) {
        InternshipEligibility eligibility = internship.getEligibility();
        if (eligibility == null) {
            eligibility = eligibilityRepository.findByInternshipId(internship.getId()).orElse(null);
        }

        List<CriterionCheck> checks = new ArrayList<>();
        List<String> unmetCriteria = new ArrayList<>();

        // 1. Profile completeness check
        boolean profileIncomplete = false;
        List<String> missingProfileFields = new ArrayList<>();
        if (student.getCgpa() == null) missingProfileFields.add("CGPA");
        if (!StringUtils.hasText(student.getDegree())) missingProfileFields.add("Degree");
        if (!StringUtils.hasText(student.getDepartment())) missingProfileFields.add("Department");
        if (student.getCurrentSemester() == null) missingProfileFields.add("Current Semester");

        if (!missingProfileFields.isEmpty()) {
            profileIncomplete = true;
            String missingMsg = "Incomplete academic profile: missing " + String.join(", ", missingProfileFields);
            unmetCriteria.add(missingMsg);
            checks.add(CriterionCheck.builder()
                .criterion("Academic Profile Completeness")
                .requiredValue("Complete Profile")
                .actualValue("Missing: " + String.join(", ", missingProfileFields))
                .satisfied(false)
                .explanation("Please complete your degree, department, semester, and CGPA in your profile before applying.")
                .build());

            return EligibilityEvaluationResult.builder()
                .eligible(false)
                .status("PROFILE_INCOMPLETE")
                .summary("Your academic profile is incomplete. Please update your profile with missing academic details.")
                .checks(checks)
                .unmetCriteria(unmetCriteria)
                .build();
        }

        // 2. Minimum CGPA Check
        BigDecimal minCgpa = null;
        if (eligibility != null && eligibility.getMinimumCgpa() != null) {
            minCgpa = eligibility.getMinimumCgpa();
        } else if (internship.getMinimumCgpa() != null) {
            minCgpa = internship.getMinimumCgpa();
        }

        if (minCgpa != null) {
            boolean satisfied = student.getCgpa().compareTo(minCgpa) >= 0;
            checks.add(CriterionCheck.builder()
                .criterion("Minimum CGPA")
                .requiredValue(">= " + minCgpa.toPlainString())
                .actualValue(student.getCgpa().toPlainString())
                .satisfied(satisfied)
                .explanation(satisfied ? "CGPA criteria satisfied." :
                    "CGPA requirement not met. Minimum required is " + minCgpa.toPlainString() + ", but your CGPA is " + student.getCgpa().toPlainString() + ".")
                .build());
            if (!satisfied) {
                unmetCriteria.add("Minimum CGPA must be at least " + minCgpa.toPlainString() + " (your CGPA: " + student.getCgpa().toPlainString() + ")");
            }
        }

        // 3. Semester Requirement Check
        Integer minSem = null;
        if (eligibility != null && eligibility.getMinimumSemester() != null) {
            minSem = eligibility.getMinimumSemester();
        } else if (internship.getMinimumSemester() != null) {
            minSem = internship.getMinimumSemester();
        }

        if (minSem != null) {
            boolean satisfied = student.getCurrentSemester() >= minSem;
            checks.add(CriterionCheck.builder()
                .criterion("Minimum Semester")
                .requiredValue("Semester " + minSem + " or higher")
                .actualValue("Semester " + student.getCurrentSemester())
                .satisfied(satisfied)
                .explanation(satisfied ? "Semester criteria satisfied." :
                    "Minimum required semester is " + minSem + ", but you are currently in Semester " + student.getCurrentSemester() + ".")
                .build());
            if (!satisfied) {
                unmetCriteria.add("Minimum semester requirement of " + minSem + " not met (your semester: " + student.getCurrentSemester() + ")");
            }
        }

        // 4. Eligible Semesters list check
        if (eligibility != null && StringUtils.hasText(eligibility.getEligibleSemesters())) {
            List<String> allowedSemesters = Arrays.stream(eligibility.getEligibleSemesters().split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();

            if (!allowedSemesters.isEmpty()) {
                String studentSemStr = String.valueOf(student.getCurrentSemester());
                boolean satisfied = allowedSemesters.contains(studentSemStr);
                checks.add(CriterionCheck.builder()
                    .criterion("Eligible Semesters")
                    .requiredValue(String.join(", ", allowedSemesters))
                    .actualValue(studentSemStr)
                    .satisfied(satisfied)
                    .explanation(satisfied ? "Eligible semester match." :
                        "Your current semester (" + studentSemStr + ") is not among the eligible semesters: " + String.join(", ", allowedSemesters) + ".")
                    .build());
                if (!satisfied) {
                    unmetCriteria.add("Eligible semesters are " + String.join(", ", allowedSemesters) + " (your semester: " + studentSemStr + ")");
                }
            }
        }

        // 5. Eligible Degrees Check
        if (eligibility != null && StringUtils.hasText(eligibility.getEligibleDegrees())) {
            List<String> allowedDegrees = Arrays.stream(eligibility.getEligibleDegrees().split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();

            if (!allowedDegrees.isEmpty()) {
                String studentDegree = student.getDegree().trim().toLowerCase();
                boolean satisfied = allowedDegrees.stream()
                    .anyMatch(d -> studentDegree.contains(d.toLowerCase()) || d.toLowerCase().contains(studentDegree));

                checks.add(CriterionCheck.builder()
                    .criterion("Eligible Degree")
                    .requiredValue(String.join(", ", allowedDegrees))
                    .actualValue(student.getDegree())
                    .satisfied(satisfied)
                    .explanation(satisfied ? "Degree requirement satisfied." :
                        "Your degree (" + student.getDegree() + ") is not eligible. Required degrees: " + String.join(", ", allowedDegrees) + ".")
                    .build());
                if (!satisfied) {
                    unmetCriteria.add("Degree must be one of: " + String.join(", ", allowedDegrees) + " (your degree: " + student.getDegree() + ")");
                }
            }
        }

        // 6. Eligible Departments Check
        if (eligibility != null && StringUtils.hasText(eligibility.getEligibleDepartments())) {
            List<String> allowedDepts = Arrays.stream(eligibility.getEligibleDepartments().split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();

            if (!allowedDepts.isEmpty()) {
                String studentDept = student.getDepartment().trim().toLowerCase();
                boolean satisfied = allowedDepts.stream()
                    .anyMatch(dept -> studentDept.contains(dept.toLowerCase()) || dept.toLowerCase().contains(studentDept));

                checks.add(CriterionCheck.builder()
                    .criterion("Eligible Department")
                    .requiredValue(String.join(", ", allowedDepts))
                    .actualValue(student.getDepartment())
                    .satisfied(satisfied)
                    .explanation(satisfied ? "Department requirement satisfied." :
                        "Your department (" + student.getDepartment() + ") is not eligible. Required departments: " + String.join(", ", allowedDepts) + ".")
                    .build());
                if (!satisfied) {
                    unmetCriteria.add("Department must be one of: " + String.join(", ", allowedDepts) + " (your department: " + student.getDepartment() + ")");
                }
            }
        }

        // 7. Required Skills Check
        List<String> requiredSkills = new ArrayList<>();
        if (eligibility != null && StringUtils.hasText(eligibility.getRequiredSkills())) {
            requiredSkills.addAll(Arrays.stream(eligibility.getRequiredSkills().split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList());
        }

        if (!requiredSkills.isEmpty()) {
            List<StudentSkill> studentSkills = studentSkillRepository.findByStudentId(student.getId());
            Set<String> studentSkillSet = studentSkills.stream()
                .map(s -> s.getSkillName().trim().toLowerCase())
                .collect(Collectors.toSet());

            List<String> missingSkills = requiredSkills.stream()
                .filter(rs -> !studentSkillSet.contains(rs.toLowerCase()))
                .toList();

            boolean satisfied = missingSkills.isEmpty();
            checks.add(CriterionCheck.builder()
                .criterion("Required Technical Skills")
                .requiredValue(String.join(", ", requiredSkills))
                .actualValue(studentSkills.isEmpty() ? "No skills in profile" :
                    studentSkills.stream().map(StudentSkill::getSkillName).collect(Collectors.joining(", ")))
                .satisfied(satisfied)
                .explanation(satisfied ? "All required skills verified." :
                    "Missing required skills: " + String.join(", ", missingSkills) + ".")
                .build());
            if (!satisfied) {
                unmetCriteria.add("Missing required skills: " + String.join(", ", missingSkills));
            }
        }

        // 8. Required Certifications Check
        if (eligibility != null && StringUtils.hasText(eligibility.getRequiredCertifications())) {
            List<String> requiredCerts = Arrays.stream(eligibility.getRequiredCertifications().split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();

            if (!requiredCerts.isEmpty()) {
                List<StudentCertification> certs = studentCertificationRepository.findByStudentId(student.getId());
                Set<String> studentCertSet = certs.stream()
                    .map(c -> c.getCertificateName().trim().toLowerCase())
                    .collect(Collectors.toSet());

                List<String> missingCerts = requiredCerts.stream()
                    .filter(rc -> studentCertSet.stream().noneMatch(sc -> sc.contains(rc.toLowerCase()) || rc.toLowerCase().contains(sc)))
                    .toList();

                boolean satisfied = missingCerts.isEmpty();
                checks.add(CriterionCheck.builder()
                    .criterion("Required Certifications")
                    .requiredValue(String.join(", ", requiredCerts))
                    .actualValue(certs.isEmpty() ? "No certifications in profile" :
                        certs.stream().map(StudentCertification::getCertificateName).collect(Collectors.joining(", ")))
                    .satisfied(satisfied)
                    .explanation(satisfied ? "Certifications verified." :
                        "Missing required certifications: " + String.join(", ", missingCerts) + ".")
                    .build());
                if (!satisfied) {
                    unmetCriteria.add("Missing required certifications: " + String.join(", ", missingCerts));
                }
            }
        }

        // 9. Resume Requirement Check
        boolean resumeReq = eligibility != null ? eligibility.getResumeRequired() : true;
        if (resumeReq) {
            List<StudentResume> resumes = studentResumeRepository.findByStudentId(student.getId());
            boolean satisfied = !resumes.isEmpty();
            checks.add(CriterionCheck.builder()
                .criterion("Resume PDF")
                .requiredValue("Uploaded PDF Resume")
                .actualValue(satisfied ? resumes.get(0).getOriginalFilename() : "No resume uploaded")
                .satisfied(satisfied)
                .explanation(satisfied ? "Resume verified." : "You must upload a PDF resume to your profile before applying.")
                .build());
            if (!satisfied) {
                unmetCriteria.add("Resume upload required in student profile");
            }
        }

        boolean allSatisfied = unmetCriteria.isEmpty();
        String status = allSatisfied ? "ELIGIBLE" : "NOT_ELIGIBLE";
        String summary = allSatisfied ?
            "You meet all mandatory academic eligibility requirements for this internship." :
            "You do not meet one or more mandatory eligibility requirements (" + unmetCriteria.size() + " unmet).";

        return EligibilityEvaluationResult.builder()
            .eligible(allSatisfied)
            .status(status)
            .summary(summary)
            .checks(checks)
            .unmetCriteria(unmetCriteria)
            .build();
    }
}

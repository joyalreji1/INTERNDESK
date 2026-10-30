package com.interndesk.service;

import com.interndesk.dto.InternshipDto;
import com.interndesk.entity.*;
import com.interndesk.exception.ResourceNotFoundException;
import com.interndesk.exception.UnauthorizedException;
import com.interndesk.repository.CompanyRepository;
import com.interndesk.repository.InternshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final CompanyRepository companyRepository;

    @Transactional(readOnly = true)
    public Page<InternshipDto.InternshipSummary> searchInternships(
        String query, String category, String workModeStr, String location,
        BigDecimal minStipend, BigDecimal maxStipend, Boolean isPaid,
        int page, int size, String sortBy) {

        Internship.WorkMode workMode = null;
        if (workModeStr != null && !workModeStr.isBlank()) {
            try { workMode = Internship.WorkMode.valueOf(workModeStr.toUpperCase()); } catch (Exception ignored) {}
        }

        Sort sort = switch (sortBy != null ? sortBy : "newest") {
            case "stipend_high" -> Sort.by(Sort.Direction.DESC, "stipendMax");
            case "stipend_low"  -> Sort.by(Sort.Direction.ASC, "stipendMin");
            case "deadline"     -> Sort.by(Sort.Direction.ASC, "applicationDeadline");
            default             -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Internship> results = internshipRepository.searchInternships(
            query, category, workMode, location, minStipend, maxStipend, isPaid,
            LocalDate.now(), pageable
        );

        return results.map(this::toSummary);
    }

    @Transactional
    public InternshipDto.InternshipResponse getById(Long id) {
        Internship internship = internshipRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Internship", id));
        internshipRepository.incrementViews(id);
        return toResponse(internship, false, false);
    }

    @Transactional
    public InternshipDto.InternshipResponse create(InternshipDto.CreateRequest req, Long userId) {
        Company company = companyRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        if (company.getVerificationStatus() != Company.VerificationStatus.VERIFIED) {
            throw new com.interndesk.exception.BusinessException(
                "Your company account is currently " + company.getVerificationStatus() +
                ". Only administrators can accredit companies to publish active internship vacancies."
            );
        }

        Internship internship = Internship.builder()
            .company(company)
            .title(req.getTitle())
            .description(req.getDescription())
            .responsibilities(req.getResponsibilities())
            .eligibilityCriteria(req.getEligibilityCriteria())
            .category(req.getCategory())
            .internshipType(req.getInternshipType())
            .workMode(req.getWorkMode())
            .location(req.getLocation())
            .durationMonths(req.getDurationMonths())
            .stipendMin(req.getStipendMin() != null ? req.getStipendMin() : BigDecimal.ZERO)
            .stipendMax(req.getStipendMax() != null ? req.getStipendMax() : BigDecimal.ZERO)
            .isPaid(req.getIsPaid() != null ? req.getIsPaid() : true)
            .openings(req.getOpenings() != null ? req.getOpenings() : 1)
            .applicationDeadline(req.getApplicationDeadline())
            .startDate(req.getStartDate())
            .endDate(req.getEndDate())
            .minimumCgpa(req.getMinimumCgpa())
            .minimumSemester(req.getMinimumSemester())
            .status(Internship.InternshipStatus.ACTIVE)
            .build();

        if (req.getSkills() != null) {
            req.getSkills().forEach(s -> {
                InternshipSkill skill = InternshipSkill.builder()
                    .internship(internship)
                    .skillName(s.getSkillName())
                    .isRequired(s.getIsRequired() != null ? s.getIsRequired() : true)
                    .build();
                internship.getSkills().add(skill);
            });
        }

        Internship saved = internshipRepository.save(internship);
        return toResponse(saved, false, false);
    }

    @Transactional
    public InternshipDto.InternshipResponse update(Long id, InternshipDto.CreateRequest req, Long userId) {
        Internship internship = internshipRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Internship", id));

        Company company = companyRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        if (!internship.getCompany().getId().equals(company.getId())) {
            throw new UnauthorizedException("You can only edit your own internship postings.");
        }

        internship.setTitle(req.getTitle());
        internship.setDescription(req.getDescription());
        internship.setResponsibilities(req.getResponsibilities());
        internship.setEligibilityCriteria(req.getEligibilityCriteria());
        internship.setCategory(req.getCategory());
        internship.setInternshipType(req.getInternshipType());
        internship.setWorkMode(req.getWorkMode());
        internship.setLocation(req.getLocation());
        internship.setDurationMonths(req.getDurationMonths());
        if (req.getStipendMin() != null) internship.setStipendMin(req.getStipendMin());
        if (req.getStipendMax() != null) internship.setStipendMax(req.getStipendMax());
        if (req.getIsPaid() != null) internship.setIsPaid(req.getIsPaid());
        if (req.getOpenings() != null) internship.setOpenings(req.getOpenings());
        internship.setApplicationDeadline(req.getApplicationDeadline());
        internship.setStartDate(req.getStartDate());
        internship.setEndDate(req.getEndDate());
        internship.setMinimumCgpa(req.getMinimumCgpa());
        internship.setMinimumSemester(req.getMinimumSemester());

        // Update skills
        internship.getSkills().clear();
        if (req.getSkills() != null) {
            req.getSkills().forEach(s -> {
                InternshipSkill skill = InternshipSkill.builder()
                    .internship(internship)
                    .skillName(s.getSkillName())
                    .isRequired(s.getIsRequired() != null ? s.getIsRequired() : true)
                    .build();
                internship.getSkills().add(skill);
            });
        }

        return toResponse(internshipRepository.save(internship), false, false);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Internship internship = internshipRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Internship", id));

        Company company = companyRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        if (!internship.getCompany().getId().equals(company.getId())) {
            throw new UnauthorizedException("You can only delete your own internship postings.");
        }

        internship.setStatus(Internship.InternshipStatus.CANCELLED);
        internshipRepository.save(internship);
    }

    @Transactional(readOnly = true)
    public Page<InternshipDto.InternshipSummary> getCompanyInternships(Long userId, int page, int size) {
        Company company = companyRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        Page<Internship> internships = internshipRepository.findByCompanyId(company.getId(), PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return internships.map(this::toSummary);
    }

    public InternshipDto.InternshipSummary toSummary(Internship i) {
        InternshipDto.InternshipSummary s = new InternshipDto.InternshipSummary();
        s.setId(i.getId());
        s.setTitle(i.getTitle());
        s.setCompanyName(i.getCompany().getCompanyName());
        s.setCompanyLogo(i.getCompany().getLogoPath());
        s.setWorkMode(i.getWorkMode().name());
        s.setLocation(i.getLocation());
        s.setDurationMonths(i.getDurationMonths());
        s.setStipendMin(i.getStipendMin());
        s.setStipendMax(i.getStipendMax());
        s.setIsPaid(i.getIsPaid());
        s.setApplicationDeadline(i.getApplicationDeadline());
        s.setStatus(i.getStatus().name());
        s.setCategory(i.getCategory());
        s.setCreatedAt(i.getCreatedAt());
        return s;
    }

    public InternshipDto.InternshipResponse toResponse(Internship i, boolean hasApplied, boolean isSaved) {
        InternshipDto.InternshipResponse r = new InternshipDto.InternshipResponse();
        r.setId(i.getId());
        r.setCompanyId(i.getCompany().getId());
        r.setCompanyName(i.getCompany().getCompanyName());
        r.setCompanyLogo(i.getCompany().getLogoPath());
        r.setCompanyCity(i.getCompany().getCity());
        r.setCompanyIndustry(i.getCompany().getIndustry());
        r.setTitle(i.getTitle());
        r.setDescription(i.getDescription());
        r.setResponsibilities(i.getResponsibilities());
        r.setEligibilityCriteria(i.getEligibilityCriteria());
        r.setCategory(i.getCategory());
        r.setInternshipType(i.getInternshipType().name());
        r.setWorkMode(i.getWorkMode().name());
        r.setLocation(i.getLocation());
        r.setDurationMonths(i.getDurationMonths());
        r.setStipendMin(i.getStipendMin());
        r.setStipendMax(i.getStipendMax());
        r.setStipendCurrency(i.getStipendCurrency());
        r.setIsPaid(i.getIsPaid());
        r.setOpenings(i.getOpenings());
        r.setApplicationDeadline(i.getApplicationDeadline());
        r.setStartDate(i.getStartDate());
        r.setEndDate(i.getEndDate());
        r.setMinimumCgpa(i.getMinimumCgpa());
        r.setMinimumSemester(i.getMinimumSemester());
        r.setStatus(i.getStatus().name());
        r.setViewsCount(i.getViewsCount());
        r.setCreatedAt(i.getCreatedAt());
        r.setUpdatedAt(i.getUpdatedAt());
        r.setHasApplied(hasApplied);
        r.setIsSaved(isSaved);
        r.setSkills(i.getSkills().stream().map(s -> {
            InternshipDto.SkillDto sd = new InternshipDto.SkillDto();
            sd.setSkillName(s.getSkillName());
            sd.setIsRequired(s.getIsRequired());
            return sd;
        }).collect(Collectors.toList()));
        return r;
    }
}

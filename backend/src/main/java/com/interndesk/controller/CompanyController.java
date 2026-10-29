package com.interndesk.controller;

import com.interndesk.dto.ApiResponse;
import com.interndesk.dto.InternshipDto;
import com.interndesk.entity.*;
import com.interndesk.exception.*;
import com.interndesk.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Tag(name = "Companies", description = "Company profile and internship management")
public class CompanyController {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final InternshipRepository internshipRepository;

    @GetMapping
    @Operation(summary = "List all verified companies (public)")
    public ResponseEntity<ApiResponse<Page<Map<String, Object>>>> listCompanies(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<Company> companies = companyRepository.searchCompanies(
            query, Company.VerificationStatus.VERIFIED, PageRequest.of(page, size, Sort.by("companyName")));
        Page<Map<String, Object>> result = companies.map(this::toPublicResponse);
        return ResponseEntity.ok(ApiResponse.success(result)
            .withPagination(result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get company public profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCompany(@PathVariable Long id) {
        Company company = companyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Company", id));
        Map<String, Object> resp = toPublicResponse(company);

        // Add active internships for this company
        List<Map<String, Object>> internships = internshipRepository
            .findByCompanyId(company.getId(), PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt")))
            .getContent().stream()
            .filter(i -> i.getStatus() == Internship.InternshipStatus.ACTIVE)
            .map(i -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", i.getId());
                m.put("title", i.getTitle());
                m.put("workMode", i.getWorkMode().name());
                m.put("location", i.getLocation());
                m.put("durationMonths", i.getDurationMonths());
                m.put("stipendMin", i.getStipendMin());
                m.put("stipendMax", i.getStipendMax());
                m.put("isPaid", i.getIsPaid());
                m.put("applicationDeadline", i.getApplicationDeadline());
                return m;
            }).collect(Collectors.toList());
        resp.put("internships", internships);
        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current company's profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyProfile(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        Company company = companyRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        return ResponseEntity.ok(ApiResponse.success(toFullResponse(user, company)));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current company's profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @RequestBody CompanyUpdateRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        Company company = companyRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        if (req.getCompanyName() != null) company.setCompanyName(req.getCompanyName());
        if (req.getIndustry() != null) company.setIndustry(req.getIndustry());
        if (req.getDescription() != null) company.setDescription(req.getDescription());
        if (req.getWebsite() != null) company.setWebsite(req.getWebsite());
        if (req.getContactEmail() != null) company.setContactEmail(req.getContactEmail());
        if (req.getContactPhone() != null) company.setContactPhone(req.getContactPhone());
        if (req.getHeadquartersAddress() != null) company.setHeadquartersAddress(req.getHeadquartersAddress());
        if (req.getCity() != null) company.setCity(req.getCity());
        if (req.getState() != null) company.setState(req.getState());
        if (req.getCountry() != null) company.setCountry(req.getCountry());
        if (req.getRegistrationNumber() != null) company.setRegistrationNumber(req.getRegistrationNumber());
        if (req.getCompanySize() != null) {
            try { company.setCompanySize(Company.CompanySize.valueOf(req.getCompanySize())); } catch (Exception ignored) {}
        }

        companyRepository.save(company);
        return ResponseEntity.ok(ApiResponse.success("Company profile updated.", toFullResponse(user, company)));
    }

    @GetMapping("/me/internships")
    @Operation(summary = "Get current company's internship listings")
    public ResponseEntity<ApiResponse<Page<Map<String, Object>>>> myInternships(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        Company company = companyRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        Page<Internship> internships = internshipRepository.findByCompanyId(company.getId(),
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        Page<Map<String, Object>> result = internships.map(i -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", i.getId());
            m.put("title", i.getTitle());
            m.put("status", i.getStatus().name());
            m.put("workMode", i.getWorkMode().name());
            m.put("location", i.getLocation());
            m.put("durationMonths", i.getDurationMonths());
            m.put("openings", i.getOpenings());
            m.put("vacancies", i.getOpenings());
            m.put("stipendMin", i.getStipendMin());
            m.put("stipendMax", i.getStipendMax());
            m.put("stipendAmount", i.getStipendMin());
            m.put("isPaid", i.getIsPaid());
            m.put("applicationDeadline", i.getApplicationDeadline());
            m.put("createdAt", i.getCreatedAt());
            return m;
        });
        return ResponseEntity.ok(ApiResponse.success(result)
            .withPagination(result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages()));
    }

    private Map<String, Object> toPublicResponse(Company c) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", c.getId());
        m.put("companyName", c.getCompanyName());
        m.put("industry", c.getIndustry());
        m.put("companySize", c.getCompanySize());
        m.put("description", c.getDescription());
        m.put("website", c.getWebsite());
        m.put("city", c.getCity());
        m.put("state", c.getState());
        m.put("country", c.getCountry());
        m.put("logoPath", c.getLogoPath());
        m.put("verificationStatus", c.getVerificationStatus().name());
        m.put("createdAt", c.getCreatedAt());
        return m;
    }

    private Map<String, Object> toFullResponse(User user, Company c) {
        Map<String, Object> m = toPublicResponse(c);
        m.put("contactEmail", c.getContactEmail());
        m.put("contactPhone", c.getContactPhone());
        m.put("headquartersAddress", c.getHeadquartersAddress());
        m.put("registrationNumber", c.getRegistrationNumber());
        m.put("userEmail", user.getEmail());
        m.put("userFullName", user.getFullName());
        m.put("userPhone", user.getPhone());
        m.put("updatedAt", c.getUpdatedAt());
        return m;
    }

    @Data
    public static class CompanyUpdateRequest {
        private String companyName;
        private String industry;
        private String description;
        private String website;
        private String contactEmail;
        private String contactPhone;
        private String headquartersAddress;
        private String city;
        private String state;
        private String country;
        private String companySize;
        private String registrationNumber;
    }
}

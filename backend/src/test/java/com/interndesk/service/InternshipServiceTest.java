package com.interndesk.service;

import com.interndesk.dto.InternshipDto;
import com.interndesk.entity.Company;
import com.interndesk.entity.Internship;
import com.interndesk.entity.User;
import com.interndesk.exception.ResourceNotFoundException;
import com.interndesk.exception.UnauthorizedException;
import com.interndesk.repository.CompanyRepository;
import com.interndesk.repository.InternshipRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InternshipServiceTest {

    @Mock
    private InternshipRepository internshipRepository;

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private InternshipService internshipService;

    private Company company;
    private User companyUser;

    @BeforeEach
    void setUp() {
        companyUser = User.builder()
                .id(50L)
                .email("recruiter@acme.com")
                .role(User.Role.COMPANY)
                .build();

        company = Company.builder()
                .id(20L)
                .user(companyUser)
                .companyName("Acme Corp")
                .verificationStatus(Company.VerificationStatus.VERIFIED)
                .build();
    }

    @Test
    @DisplayName("Should successfully create an internship opportunity for verified company")
    void testCreateInternshipSuccess() {
        InternshipDto.CreateRequest req = new InternshipDto.CreateRequest();
        req.setTitle("Java Backend Intern");
        req.setDescription("Work on high-scale microservices.");
        req.setWorkMode(Internship.WorkMode.REMOTE);
        req.setStipendMin(BigDecimal.valueOf(25000));
        req.setStipendMax(BigDecimal.valueOf(35000));
        req.setOpenings(3);
        req.setApplicationDeadline(LocalDate.now().plusMonths(1));

        when(companyRepository.findByUserId(50L)).thenReturn(Optional.of(company));

        Internship savedInternship = Internship.builder()
                .id(101L)
                .company(company)
                .title("Java Backend Intern")
                .description("Work on high-scale microservices.")
                .workMode(Internship.WorkMode.REMOTE)
                .stipendMin(BigDecimal.valueOf(25000))
                .stipendMax(BigDecimal.valueOf(35000))
                .openings(3)
                .status(Internship.InternshipStatus.ACTIVE)
                .build();

        when(internshipRepository.save(any(Internship.class))).thenReturn(savedInternship);

        InternshipDto.InternshipResponse resp = internshipService.create(req, 50L);

        assertThat(resp).isNotNull();
        assertThat(resp.getTitle()).isEqualTo("Java Backend Intern");
        assertThat(resp.getCompanyName()).isEqualTo("Acme Corp");
        verify(internshipRepository).save(any(Internship.class));
    }

    @Test
    @DisplayName("Should reject internship update when non-owner company attempts modification")
    void testUnauthorizedEditInternship() {
        Internship internship = Internship.builder()
                .id(101L)
                .company(company)
                .title("Original Title")
                .status(Internship.InternshipStatus.ACTIVE)
                .build();

        when(internshipRepository.findById(101L)).thenReturn(Optional.of(internship));

        // Company 99 attempts to update Company 20's internship
        Company otherCompany = Company.builder().id(99L).build();
        when(companyRepository.findByUserId(999L)).thenReturn(Optional.of(otherCompany));

        InternshipDto.CreateRequest updateReq = new InternshipDto.CreateRequest();
        updateReq.setTitle("Malicious Title Update");

        assertThatThrownBy(() -> internshipService.update(101L, updateReq, 999L))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("You can only edit your own internship postings");

        verify(internshipRepository, never()).save(any(Internship.class));
    }
}

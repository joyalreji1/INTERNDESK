package com.interndesk.workflow;

import com.interndesk.dto.ApplicationDto;
import com.interndesk.entity.*;
import com.interndesk.exception.BusinessException;
import com.interndesk.exception.DuplicateResourceException;
import com.interndesk.exception.InvalidStatusTransitionException;
import com.interndesk.exception.UnauthorizedException;
import com.interndesk.repository.*;
import com.interndesk.service.ApplicationService;
import com.interndesk.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApplicationWorkflowTest {

    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private ApplicationStatusHistoryRepository statusHistoryRepository;
    @Mock
    private StudentProfileRepository studentProfileRepository;
    @Mock
    private InternshipRepository internshipRepository;
    @Mock
    private StudentResumeRepository resumeRepository;
    @Mock
    private CompanyRepository companyRepository;
    @Mock
    private NotificationService notificationService;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ApplicationService applicationService;

    private User studentUser;
    private User companyUser;
    private StudentProfile studentProfile;
    private Company company;
    private Internship internship;

    @BeforeEach
    void setUp() {
        studentUser = User.builder().id(1L).fullName("Arjun Sharma").email("arjun@student.edu").role(User.Role.STUDENT).build();
        companyUser = User.builder().id(2L).fullName("TechCorp HR").email("hr@techcorp.com").role(User.Role.COMPANY).build();

        studentProfile = StudentProfile.builder().id(10L).user(studentUser).build();
        company = Company.builder().id(20L).companyName("TechCorp").user(companyUser).build();

        internship = Internship.builder()
                .id(30L)
                .company(company)
                .title("Software Engineering Intern")
                .status(Internship.InternshipStatus.ACTIVE)
                .applicationDeadline(LocalDate.now().plusDays(15))
                .build();
    }

    @Test
    @DisplayName("Should submit application when eligible and not duplicate")
    void testApplySuccess() {
        when(studentProfileRepository.findByUserId(1L)).thenReturn(Optional.of(studentProfile));
        when(internshipRepository.findById(30L)).thenReturn(Optional.of(internship));
        when(applicationRepository.existsByStudentIdAndInternshipId(10L, 30L)).thenReturn(false);

        Application savedApp = Application.builder()
                .id(100L)
                .student(studentProfile)
                .internship(internship)
                .status(Application.ApplicationStatus.APPLIED)
                .build();

        when(applicationRepository.save(any(Application.class))).thenReturn(savedApp);

        ApplicationDto.ApplyRequest req = new ApplicationDto.ApplyRequest();
        req.setCoverLetter("Interested in full stack development");

        ApplicationDto.ApplicationResponse response = applicationService.apply(30L, req, 1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(100L);
        assertThat(response.getStatus()).isEqualTo(Application.ApplicationStatus.APPLIED.name());
        verify(applicationRepository).save(any(Application.class));
        verify(statusHistoryRepository).save(any(ApplicationStatusHistory.class));
    }

    @Test
    @DisplayName("Should prevent duplicate applications to the same internship")
    void testPreventDuplicateApplication() {
        when(studentProfileRepository.findByUserId(1L)).thenReturn(Optional.of(studentProfile));
        when(internshipRepository.findById(30L)).thenReturn(Optional.of(internship));
        when(applicationRepository.existsByStudentIdAndInternshipId(10L, 30L)).thenReturn(true);

        ApplicationDto.ApplyRequest req = new ApplicationDto.ApplyRequest();
        assertThatThrownBy(() -> applicationService.apply(30L, req, 1L))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("already applied");

        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("Company should transition application APPLIED -> UNDER_REVIEW -> SHORTLISTED")
    void testCompanyValidStatusTransition() {
        Application app = Application.builder()
                .id(100L)
                .student(studentProfile)
                .internship(internship)
                .status(Application.ApplicationStatus.APPLIED)
                .build();

        when(applicationRepository.findById(100L)).thenReturn(Optional.of(app));
        when(companyRepository.findByUserId(2L)).thenReturn(Optional.of(company));
        when(applicationRepository.save(any(Application.class))).thenAnswer(i -> i.getArgument(0));

        ApplicationDto.StatusUpdateRequest req = new ApplicationDto.StatusUpdateRequest();
        req.setNewStatus(Application.ApplicationStatus.UNDER_REVIEW);
        req.setRemarks("Reviewing resume");

        ApplicationDto.ApplicationResponse response = applicationService.updateStatus(100L, req, 2L);

        assertThat(response.getStatus()).isEqualTo(Application.ApplicationStatus.UNDER_REVIEW.name());
        verify(notificationService).createNotification(eq(studentUser), anyString(), anyString(), any(), anyLong(), anyString());
    }

    @Test
    @DisplayName("Should reject invalid state transition e.g. APPLIED -> SELECTED directly")
    void testRejectInvalidTransition() {
        Application app = Application.builder()
                .id(100L)
                .student(studentProfile)
                .internship(internship)
                .status(Application.ApplicationStatus.APPLIED)
                .build();

        when(applicationRepository.findById(100L)).thenReturn(Optional.of(app));
        when(companyRepository.findByUserId(2L)).thenReturn(Optional.of(company));

        ApplicationDto.StatusUpdateRequest req = new ApplicationDto.StatusUpdateRequest();
        req.setNewStatus(Application.ApplicationStatus.SELECTED); // Invalid jump

        assertThatThrownBy(() -> applicationService.updateStatus(100L, req, 2L))
                .isInstanceOf(InvalidStatusTransitionException.class);
    }

    @Test
    @DisplayName("Student can withdraw their own application")
    void testStudentWithdrawApplication() {
        Application app = Application.builder()
                .id(100L)
                .student(studentProfile)
                .internship(internship)
                .status(Application.ApplicationStatus.APPLIED)
                .build();

        when(applicationRepository.findById(100L)).thenReturn(Optional.of(app));
        when(companyRepository.findByUserId(1L)).thenReturn(Optional.empty()); // User 1 is student, not company
        when(applicationRepository.save(any(Application.class))).thenAnswer(i -> i.getArgument(0));

        ApplicationDto.StatusUpdateRequest req = new ApplicationDto.StatusUpdateRequest();
        req.setNewStatus(Application.ApplicationStatus.WITHDRAWN);
        req.setRemarks("Accepted another offer");

        ApplicationDto.ApplicationResponse response = applicationService.updateStatus(100L, req, 1L);

        assertThat(response.getStatus()).isEqualTo(Application.ApplicationStatus.WITHDRAWN.name());
    }

    @Test
    @DisplayName("Unauthorized user cannot modify an application")
    void testUnauthorizedUserStatusUpdate() {
        Application app = Application.builder()
                .id(100L)
                .student(studentProfile)
                .internship(internship)
                .status(Application.ApplicationStatus.APPLIED)
                .build();

        when(applicationRepository.findById(100L)).thenReturn(Optional.of(app));
        when(companyRepository.findByUserId(999L)).thenReturn(Optional.empty());

        ApplicationDto.StatusUpdateRequest req = new ApplicationDto.StatusUpdateRequest();
        req.setNewStatus(Application.ApplicationStatus.WITHDRAWN);

        assertThatThrownBy(() -> applicationService.updateStatus(100L, req, 999L))
                .isInstanceOf(UnauthorizedException.class);
    }
}

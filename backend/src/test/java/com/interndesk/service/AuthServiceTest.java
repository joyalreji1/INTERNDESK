package com.interndesk.service;

import com.interndesk.dto.AuthDto;
import com.interndesk.entity.StudentProfile;
import com.interndesk.entity.User;
import com.interndesk.exception.DuplicateResourceException;
import com.interndesk.repository.CompanyRepository;
import com.interndesk.repository.StudentProfileRepository;
import com.interndesk.repository.UserRepository;
import com.interndesk.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private AuthDto.RegisterStudentRequest studentReq;

    @BeforeEach
    void setUp() {
        studentReq = new AuthDto.RegisterStudentRequest();
        studentReq.setFullName("John Doe");
        studentReq.setEmail("john.doe@college.edu");
        studentReq.setPassword("SecurePass@123");
        studentReq.setPhone("+91-9876543210");
    }

    @Test
    @DisplayName("Should successfully register a student user with hashed password and profile")
    void testRegisterStudentSuccess() {
        when(userRepository.existsByEmail("john.doe@college.edu")).thenReturn(false);
        when(passwordEncoder.encode("SecurePass@123")).thenReturn("$2a$12$hashedPassword");

        User savedUser = User.builder()
                .id(100L)
                .fullName("John Doe")
                .email("john.doe@college.edu")
                .passwordHash("$2a$12$hashedPassword")
                .role(User.Role.STUDENT)
                .accountStatus(User.AccountStatus.ACTIVE)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(studentProfileRepository.save(any(StudentProfile.class))).thenReturn(new StudentProfile());
        when(tokenProvider.generateToken(any(UserDetails.class), eq(100L), eq("STUDENT"))).thenReturn("mock-jwt-token");

        AuthDto.AuthResponse resp = authService.registerStudent(studentReq);

        assertThat(resp).isNotNull();
        assertThat(resp.getAccessToken()).isEqualTo("mock-jwt-token");
        assertThat(resp.getEmail()).isEqualTo("john.doe@college.edu");
        assertThat(resp.getRole()).isEqualTo("STUDENT");

        verify(passwordEncoder).encode("SecurePass@123");
        verify(userRepository).save(any(User.class));
        verify(studentProfileRepository).save(any(StudentProfile.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException if student email already registered")
    void testRegisterStudentDuplicateEmail() {
        when(userRepository.existsByEmail("john.doe@college.edu")).thenReturn(true);

        assertThatThrownBy(() -> authService.registerStudent(studentReq))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("already registered");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully authenticate user and return token on login")
    void testLoginSuccess() {
        AuthDto.LoginRequest loginReq = new AuthDto.LoginRequest();
        loginReq.setEmail("john.doe@college.edu");
        loginReq.setPassword("SecurePass@123");

        User user = User.builder()
                .id(100L)
                .fullName("John Doe")
                .email("john.doe@college.edu")
                .role(User.Role.STUDENT)
                .accountStatus(User.AccountStatus.ACTIVE)
                .build();

        Authentication auth = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("john.doe@college.edu");
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByEmail("john.doe@college.edu")).thenReturn(Optional.of(user));
        when(tokenProvider.generateToken(any(UserDetails.class), eq(100L), eq("STUDENT"))).thenReturn("valid-jwt-token");

        AuthDto.AuthResponse resp = authService.login(loginReq);

        assertThat(resp.getAccessToken()).isEqualTo("valid-jwt-token");
        assertThat(resp.getRole()).isEqualTo("STUDENT");
        verify(userRepository).updateLastLogin(eq(100L), any());
    }

    @Test
    @DisplayName("Should successfully register a company user with profile and pending verification")
    void testRegisterCompanySuccess() {
        AuthDto.RegisterCompanyRequest compReq = new AuthDto.RegisterCompanyRequest();
        compReq.setFullName("Jane HR");
        compReq.setEmail("recruiter@acme.com");
        compReq.setPassword("CompPass@123");
        compReq.setCompanyName("Acme Technologies");
        compReq.setIndustry("Technology");

        when(userRepository.existsByEmail("recruiter@acme.com")).thenReturn(false);
        when(passwordEncoder.encode("CompPass@123")).thenReturn("$2a$12$hashedCompPassword");

        User savedUser = User.builder()
                .id(200L)
                .fullName("Jane HR")
                .email("recruiter@acme.com")
                .passwordHash("$2a$12$hashedCompPassword")
                .role(User.Role.COMPANY)
                .accountStatus(User.AccountStatus.ACTIVE)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(companyRepository.save(any())).thenReturn(new com.interndesk.entity.Company());
        when(tokenProvider.generateToken(any(UserDetails.class), eq(200L), eq("COMPANY"))).thenReturn("company-jwt-token");

        AuthDto.AuthResponse resp = authService.registerCompany(compReq);

        assertThat(resp).isNotNull();
        assertThat(resp.getAccessToken()).isEqualTo("company-jwt-token");
        assertThat(resp.getEmail()).isEqualTo("recruiter@acme.com");
        assertThat(resp.getRole()).isEqualTo("COMPANY");

        verify(userRepository).save(any(User.class));
        verify(companyRepository).save(any());
    }
}

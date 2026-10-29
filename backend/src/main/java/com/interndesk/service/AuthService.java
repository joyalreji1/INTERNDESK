package com.interndesk.service;

import com.interndesk.dto.AuthDto;
import com.interndesk.entity.Company;
import com.interndesk.entity.StudentProfile;
import com.interndesk.entity.User;
import com.interndesk.exception.DuplicateResourceException;
import com.interndesk.repository.CompanyRepository;
import com.interndesk.repository.StudentProfileRepository;
import com.interndesk.repository.UserRepository;
import com.interndesk.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthDto.AuthResponse registerStudent(AuthDto.RegisterStudentRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("Email '" + req.getEmail() + "' is already registered.");
        }

        User user = User.builder()
            .fullName(req.getFullName())
            .email(req.getEmail().toLowerCase().trim())
            .passwordHash(passwordEncoder.encode(req.getPassword()))
            .phone(req.getPhone())
            .role(User.Role.STUDENT)
            .accountStatus(User.AccountStatus.ACTIVE)
            .emailVerified(false)
            .build();
        user = userRepository.save(user);

        // Create empty student profile
        StudentProfile profile = StudentProfile.builder()
            .user(user)
            .country("India")
            .backlogsCount(0)
            .build();
        studentProfileRepository.save(profile);

        log.info("Student registered: {}", user.getEmail());

        UserDetails details = buildUserDetails(user);
        String token = jwtTokenProvider.generateToken(details, user.getId(), user.getRole().name());
        return new AuthDto.AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    @Transactional
    public AuthDto.AuthResponse registerCompany(AuthDto.RegisterCompanyRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("Email '" + req.getEmail() + "' is already registered.");
        }

        User user = User.builder()
            .fullName(req.getFullName())
            .email(req.getEmail().toLowerCase().trim())
            .passwordHash(passwordEncoder.encode(req.getPassword()))
            .phone(req.getPhone())
            .role(User.Role.COMPANY)
            .accountStatus(User.AccountStatus.ACTIVE)
            .emailVerified(false)
            .build();
        user = userRepository.save(user);

        // Create company profile
        Company company = Company.builder()
            .user(user)
            .companyName(req.getCompanyName())
            .industry(req.getIndustry())
            .verificationStatus(Company.VerificationStatus.PENDING)
            .country("India")
            .build();
        companyRepository.save(company);

        log.info("Company registered: {} ({})", req.getCompanyName(), user.getEmail());

        UserDetails details = buildUserDetails(user);
        String token = jwtTokenProvider.generateToken(details, user.getId(), user.getRole().name());
        return new AuthDto.AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    @Transactional
    public AuthDto.AuthResponse login(AuthDto.LoginRequest req) {
        String input = req.getEmail() != null ? req.getEmail().trim().toLowerCase() : "";
        if ("admin".equals(input)) {
            input = "admin@interndesk.com";
        } else if ("student".equals(input) || "arjun".equals(input)) {
            input = "arjun.sharma@student.edu";
        } else if ("company".equals(input) || "technova".equals(input)) {
            input = "hr@technova.io";
        }

        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(input, req.getPassword())
        );

        UserDetails details = (UserDetails) auth.getPrincipal();
        User user = userRepository.findByEmail(details.getUsername())
            .orElseThrow();

        // Update last login
        userRepository.updateLastLogin(user.getId(), LocalDateTime.now());

        String token = jwtTokenProvider.generateToken(details, user.getId(), user.getRole().name());
        return new AuthDto.AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserDetails buildUserDetails(User user) {
        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getEmail())
            .password(user.getPasswordHash())
            .roles(user.getRole().name())
            .build();
    }
}

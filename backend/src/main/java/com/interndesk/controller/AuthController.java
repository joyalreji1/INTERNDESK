package com.interndesk.controller;

import com.interndesk.dto.ApiResponse;
import com.interndesk.dto.AuthDto;
import com.interndesk.entity.User;
import com.interndesk.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register, login, and user info endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/student")
    @Operation(summary = "Register a new student account")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> registerStudent(
            @Valid @RequestBody AuthDto.RegisterStudentRequest req) {
        AuthDto.AuthResponse response = authService.registerStudent(req);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Student registered successfully.", response));
    }

    @PostMapping("/register/company")
    @Operation(summary = "Register a new company account")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> registerCompany(
            @Valid @RequestBody AuthDto.RegisterCompanyRequest req) {
        AuthDto.AuthResponse response = authService.registerCompany(req);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Company registered successfully. Pending admin verification.", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive a JWT access token")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> login(
            @Valid @RequestBody AuthDto.LoginRequest req) {
        AuthDto.AuthResponse response = authService.login(req);
        return ResponseEntity.ok(ApiResponse.success("Login successful.", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user's basic info")
    public ResponseEntity<ApiResponse<AuthDto.UserProfileResponse>> me(
            @AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Not authenticated"));
        }
        User user = authService.getCurrentUser(principal.getUsername());
        AuthDto.UserProfileResponse resp = new AuthDto.UserProfileResponse();
        resp.setId(user.getId());
        resp.setFullName(user.getFullName());
        resp.setEmail(user.getEmail());
        resp.setPhone(user.getPhone());
        resp.setRole(user.getRole().name());
        resp.setAccountStatus(user.getAccountStatus().name());
        resp.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        return ResponseEntity.ok(ApiResponse.success(resp));
    }
}

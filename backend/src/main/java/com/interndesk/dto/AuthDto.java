package com.interndesk.dto;

import com.interndesk.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;

public class AuthDto {

    @Data
    public static class RegisterStudentRequest {
        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email address")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100, message = "Password must be at least 8 characters")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).*$",
                 message = "Password must contain at least one letter and one number")
        private String password;

        @Size(max = 20)
        private String phone;
    }

    @Data
    public static class RegisterCompanyRequest {
        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 100)
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email address")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100)
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).*$",
                 message = "Password must contain at least one letter and one number")
        private String password;

        @NotBlank(message = "Company name is required")
        @Size(min = 2, max = 200)
        private String companyName;

        @Size(max = 100)
        private String industry;

        @Size(max = 20)
        private String phone;
    }

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email or username is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String accessToken;
        private String tokenType = "Bearer";
        private Long userId;
        private String fullName;
        private String email;
        private String role;

        public AuthResponse(String token, Long userId, String fullName, String email, User.Role role) {
            this.accessToken = token;
            this.userId = userId;
            this.fullName = fullName;
            this.email = email;
            this.role = role.name();
        }
    }

    @Data
    public static class UserProfileResponse {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String role;
        private String accountStatus;
        private String createdAt;
    }
}

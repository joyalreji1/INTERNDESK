package com.interndesk.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateOrderRequest {
        @NotNull(message = "Application ID is required")
        private Long applicationId;
        private String notes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateOrderResponse {
        private String orderId;
        private String transactionReference;
        private BigDecimal amount;
        private String currency;
        private String keyId;
        private String companyName;
        private String internshipTitle;
        private String studentName;
        private String studentEmail;
        private String studentPhone;
        private Long applicationId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyPaymentRequest {
        @NotNull(message = "Application ID is required")
        private Long applicationId;
        @NotNull(message = "Gateway order ID is required")
        private String gatewayOrderId;
        @NotNull(message = "Gateway payment ID is required")
        private String gatewayPaymentId;
        @NotNull(message = "Gateway signature is required")
        private String gatewaySignature;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentResponse {
        private Long id;
        private Long applicationId;
        private Long studentId;
        private String studentName;
        private String studentEmail;
        private Long companyId;
        private String companyName;
        private Long internshipId;
        private String internshipTitle;
        private BigDecimal amount;
        private String currency;
        private String paymentGateway;
        private String gatewayOrderId;
        private String gatewayPaymentId;
        private String transactionReference;
        private String paymentStatus;
        private LocalDateTime paidAt;
        private String receiptUrl;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentReceiptResponse {
        private String receiptNumber;
        private String transactionReference;
        private String gatewayOrderId;
        private String gatewayPaymentId;
        private LocalDateTime paidAt;
        private String studentName;
        private String studentRegistrationNumber;
        private String studentEmail;
        private String studentCollege;
        private String studentDepartment;
        private String companyName;
        private String internshipTitle;
        private BigDecimal amount;
        private String currency;
        private String paymentStatus;
        private String refundPolicy;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyPaymentMetrics {
        private BigDecimal totalCollectedFees;
        private long totalTransactions;
        private long pendingPaymentCount;
        private long enrolledStudentsCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminPaymentSummary {
        private BigDecimal totalVolume;
        private BigDecimal totalRefunded;
        private long totalTransactions;
        private long successCount;
        private long pendingCount;
        private long failedCount;
        private long refundCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RefundRequest {
        @NotNull(message = "Payment ID is required")
        private Long paymentId;
        private BigDecimal requestedAmount;
        private String refundReason;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RefundResponse {
        private Long id;
        private Long paymentId;
        private String transactionReference;
        private String studentName;
        private String companyName;
        private String internshipTitle;
        private BigDecimal requestedAmount;
        private String refundReason;
        private String refundStatus;
        private String adminNotes;
        private LocalDateTime processedAt;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminRefundActionRequest {
        @NotNull(message = "Action is required (APPROVE or REJECT)")
        private String action; // APPROVE or REJECT
        private String adminNotes;
    }
}

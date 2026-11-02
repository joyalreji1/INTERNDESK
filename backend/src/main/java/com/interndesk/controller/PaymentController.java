package com.interndesk.controller;

import com.interndesk.dto.ApiResponse;
import com.interndesk.dto.PaymentDto.*;
import com.interndesk.entity.Company;
import com.interndesk.entity.StudentProfile;
import com.interndesk.entity.User;
import com.interndesk.exception.ResourceNotFoundException;
import com.interndesk.repository.CompanyRepository;
import com.interndesk.repository.StudentProfileRepository;
import com.interndesk.repository.UserRepository;
import com.interndesk.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payments", description = "Endpoints for Razorpay order creation, payment verification, receipts, and refund requests")
public class PaymentController {

    private final PaymentService paymentService;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    @PostMapping("/create-order")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Create a payment order for selected application")
    public ResponseEntity<ApiResponse<CreateOrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        CreateOrderResponse response = paymentService.createOrder(req, principal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Payment order created successfully.", response));
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Verify Razorpay payment signature and confirm enrollment")
    public ResponseEntity<ApiResponse<PaymentReceiptResponse>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        PaymentReceiptResponse receipt = paymentService.verifyPayment(req, principal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully. Enrollment confirmed!", receipt));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Razorpay asynchronous payment confirmation webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        paymentService.processWebhook(payload, signature);
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/receipt/{paymentId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get official payment receipt by payment ID")
    public ResponseEntity<ApiResponse<PaymentReceiptResponse>> getReceipt(
            @PathVariable Long paymentId,
            @AuthenticationPrincipal UserDetails principal) {
        PaymentReceiptResponse receipt = paymentService.getReceipt(paymentId, principal.getUsername());
        return ResponseEntity.ok(ApiResponse.success(receipt));
    }

    @GetMapping("/receipt/application/{applicationId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get official payment receipt by application ID")
    public ResponseEntity<ApiResponse<PaymentReceiptResponse>> getReceiptByApplication(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserDetails principal) {
        PaymentReceiptResponse receipt = paymentService.getReceiptByApplicationId(applicationId, principal.getUsername());
        return ResponseEntity.ok(ApiResponse.success(receipt));
    }

    @GetMapping("/student/history")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get payment transaction history for authenticated student")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getStudentPaymentHistory(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        StudentProfile student = studentProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        List<PaymentResponse> history = paymentService.getStudentPaymentHistory(student.getId());
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/company/history")
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Get candidate payment transactions for authenticated company")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getCompanyPaymentHistory(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Company company = companyRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        List<PaymentResponse> history = paymentService.getCompanyPaymentHistory(company.getId());
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/company/metrics")
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Get fee collection metrics for authenticated company")
    public ResponseEntity<ApiResponse<CompanyPaymentMetrics>> getCompanyPaymentMetrics(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Company company = companyRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        CompanyPaymentMetrics metrics = paymentService.getCompanyPaymentMetrics(company.getId());
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    @PostMapping("/refunds/request")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Request a refund for a successful payment")
    public ResponseEntity<ApiResponse<RefundResponse>> requestRefund(
            @Valid @RequestBody RefundRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        RefundResponse response = paymentService.requestRefund(req, principal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Refund requested successfully. Awaiting administrative review.", response));
    }
}

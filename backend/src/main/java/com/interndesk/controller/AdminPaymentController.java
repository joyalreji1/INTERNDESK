package com.interndesk.controller;

import com.interndesk.dto.ApiResponse;
import com.interndesk.dto.PaymentDto.*;
import com.interndesk.entity.Payment;
import com.interndesk.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Payments", description = "Administrative endpoints for platform payments, settlements, and refund approvals")
public class AdminPaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @Operation(summary = "Get paginated list of all payment transactions")
    public ResponseEntity<ApiResponse<Page<PaymentResponse>>> getAllPayments(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Payment.PaymentStatus paymentStatus = null;
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            try {
                paymentStatus = Payment.PaymentStatus.valueOf(status.toUpperCase());
            } catch (Exception ignored) {}
        }
        Page<PaymentResponse> payments = paymentService.getAllPaymentsAdmin(
            paymentStatus, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get platform-wide payment financial summary")
    public ResponseEntity<ApiResponse<AdminPaymentSummary>> getPaymentSummary() {
        AdminPaymentSummary summary = paymentService.getAdminPaymentSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/refunds")
    @Operation(summary = "Get all refund requests")
    public ResponseEntity<ApiResponse<Page<RefundResponse>>> getAllRefunds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<RefundResponse> refunds = paymentService.getAllRefundsAdmin(
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return ResponseEntity.ok(ApiResponse.success(refunds));
    }

    @PostMapping("/refunds/{id}/action")
    @Operation(summary = "Approve or reject a refund request")
    public ResponseEntity<ApiResponse<RefundResponse>> actionRefund(
            @PathVariable Long id,
            @Valid @RequestBody AdminRefundActionRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        RefundResponse response = paymentService.adminActionRefund(id, req, principal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Refund status updated successfully.", response));
    }

    @GetMapping("/export-csv")
    @Operation(summary = "Export all payment transactions as CSV")
    public ResponseEntity<byte[]> exportPaymentCsv() {
        Page<PaymentResponse> page = paymentService.getAllPaymentsAdmin(null, PageRequest.of(0, 10000, Sort.by(Sort.Direction.DESC, "createdAt")));
        StringBuilder sb = new StringBuilder();
        sb.append("Transaction ID,Order ID,Payment ID,Student Name,Student Email,Company Name,Internship Title,Amount,Currency,Status,Paid At\n");
        for (PaymentResponse p : page.getContent()) {
            sb.append(escape(p.getTransactionReference())).append(",")
              .append(escape(p.getGatewayOrderId())).append(",")
              .append(escape(p.getGatewayPaymentId())).append(",")
              .append(escape(p.getStudentName())).append(",")
              .append(escape(p.getStudentEmail())).append(",")
              .append(escape(p.getCompanyName())).append(",")
              .append(escape(p.getInternshipTitle())).append(",")
              .append(p.getAmount()).append(",")
              .append(p.getCurrency()).append(",")
              .append(p.getPaymentStatus()).append(",")
              .append(p.getPaidAt() != null ? p.getPaidAt() : "").append("\n");
        }

        byte[] bytes = sb.toString().getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"intern_desk_payments.csv\"")
            .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
            .body(bytes);
    }

    private String escape(String val) {
        if (val == null) return "";
        if (val.contains(",") || val.contains("\"") || val.contains("\n")) {
            return "\"" + val.replace("\"", "\"\"") + "\"";
        }
        return val;
    }
}

package com.interndesk.service;

import com.interndesk.dto.PaymentDto.*;
import com.interndesk.entity.*;
import com.interndesk.exception.BusinessException;
import com.interndesk.exception.DuplicateResourceException;
import com.interndesk.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private RefundRepository refundRepository;
    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private ApplicationStatusHistoryRepository statusHistoryRepository;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PaymentService paymentService;

    private User studentUser;
    private User companyUser;
    private StudentProfile student;
    private Company company;
    private Internship paidInternship;
    private Internship freeInternship;
    private Application application;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(paymentService, "razorpayKeyId", "rzp_test_key");
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", "test_secret_key");
        ReflectionTestUtils.setField(paymentService, "webhookSecret", "test_webhook_secret");

        studentUser = User.builder().id(1L).fullName("Arjun Sharma").email("arjun@student.edu").role(User.Role.STUDENT).build();
        companyUser = User.builder().id(2L).fullName("TechCorp HR").email("hr@techcorp.com").role(User.Role.COMPANY).build();
        student = StudentProfile.builder().id(10L).user(studentUser).build();
        company = Company.builder().id(20L).companyName("TechCorp").user(companyUser).build();

        paidInternship = Internship.builder()
            .id(30L)
            .company(company)
            .title("Advanced AI Research Intern")
            .internshipType(Internship.InternshipType.PAID)
            .internshipFee(new BigDecimal("2500.00"))
            .currency("INR")
            .status(Internship.InternshipStatus.ACTIVE)
            .build();

        freeInternship = Internship.builder()
            .id(31L)
            .company(company)
            .title("Open Source Contributor Intern")
            .internshipType(Internship.InternshipType.FREE)
            .internshipFee(BigDecimal.ZERO)
            .currency("INR")
            .status(Internship.InternshipStatus.ACTIVE)
            .build();

        application = Application.builder()
            .id(100L)
            .student(student)
            .internship(paidInternship)
            .status(Application.ApplicationStatus.SELECTED)
            .paymentStatus(Application.PaymentStatus.PENDING)
            .build();
    }

    @Test
    @DisplayName("Should create payment order for selected application on paid internship")
    void testCreateOrderSuccess() {
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));
        when(paymentRepository.existsByApplicationIdAndPaymentStatus(100L, Payment.PaymentStatus.SUCCESS)).thenReturn(false);
        when(paymentRepository.findByApplicationId(100L)).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CreateOrderRequest req = new CreateOrderRequest(100L, "Payment for AI Research seat");
        CreateOrderResponse resp = paymentService.createOrder(req, "arjun@student.edu");

        assertThat(resp).isNotNull();
        assertThat(resp.getAmount()).isEqualByComparingTo(new BigDecimal("2500.00"));
        assertThat(resp.getCurrency()).isEqualTo("INR");
        assertThat(resp.getOrderId()).startsWith("order_");
        assertThat(resp.getTransactionReference()).startsWith("TXN-");
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    @DisplayName("Should reject order creation if internship is FREE")
    void testCreateOrderOnFreeInternshipRejected() {
        application.setInternship(freeInternship);
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));

        CreateOrderRequest req = new CreateOrderRequest(100L, null);
        assertThatThrownBy(() -> paymentService.createOrder(req, "arjun@student.edu"))
            .isInstanceOf(BusinessException.class)
            .hasMessageContaining("free internship");
    }

    @Test
    @DisplayName("Should reject order creation before application is officially SELECTED")
    void testCreateOrderBeforeSelectionRejected() {
        application.setStatus(Application.ApplicationStatus.SHORTLISTED);
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));

        CreateOrderRequest req = new CreateOrderRequest(100L, null);
        assertThatThrownBy(() -> paymentService.createOrder(req, "arjun@student.edu"))
            .isInstanceOf(BusinessException.class)
            .hasMessageContaining("Payment can only be initiated after your application has been officially selected");
    }

    @Test
    @DisplayName("Should reject order creation if application is already paid")
    void testCreateOrderDuplicatePaymentRejected() {
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));
        when(paymentRepository.existsByApplicationIdAndPaymentStatus(100L, Payment.PaymentStatus.SUCCESS)).thenReturn(true);

        CreateOrderRequest req = new CreateOrderRequest(100L, null);
        assertThatThrownBy(() -> paymentService.createOrder(req, "arjun@student.edu"))
            .isInstanceOf(DuplicateResourceException.class)
            .hasMessageContaining("already been paid");
    }

    @Test
    @DisplayName("Should verify payment and confirm student enrollment with receipt")
    void testVerifyPaymentSuccess() {
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));

        Payment initiatedPayment = Payment.builder()
            .id(200L)
            .application(application)
            .student(student)
            .company(company)
            .internship(paidInternship)
            .amount(new BigDecimal("2500.00"))
            .currency("INR")
            .gatewayOrderId("order_test_123")
            .transactionReference("TXN-TEST-123")
            .paymentStatus(Payment.PaymentStatus.INITIATED)
            .build();

        when(paymentRepository.findByGatewayOrderId("order_test_123")).thenReturn(Optional.of(initiatedPayment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        VerifyPaymentRequest req = new VerifyPaymentRequest(100L, "order_test_123", "pay_test_456", "test_sig_mock");
        PaymentReceiptResponse receipt = paymentService.verifyPayment(req, "arjun@student.edu");

        assertThat(receipt).isNotNull();
        assertThat(receipt.getTransactionReference()).isEqualTo("TXN-TEST-123");
        assertThat(receipt.getAmount()).isEqualByComparingTo(new BigDecimal("2500.00"));
        assertThat(application.getStatus()).isEqualTo(Application.ApplicationStatus.ENROLLED);
        assertThat(application.getPaymentStatus()).isEqualTo(Application.PaymentStatus.PAID);
        verify(applicationRepository).save(application);
        verify(statusHistoryRepository).save(any(ApplicationStatusHistory.class));
        verify(notificationRepository, times(2)).save(any(Notification.class));
    }
}

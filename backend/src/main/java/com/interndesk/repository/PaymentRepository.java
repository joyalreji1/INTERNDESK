package com.interndesk.repository;

import com.interndesk.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByApplicationId(Long applicationId);

    Optional<Payment> findByTransactionReference(String transactionReference);

    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);

    List<Payment> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    Page<Payment> findByStudentId(Long studentId, Pageable pageable);

    Page<Payment> findByCompanyId(Long companyId, Pageable pageable);

    List<Payment> findByCompanyIdOrderByCreatedAtDesc(Long companyId);

    Page<Payment> findByPaymentStatus(Payment.PaymentStatus paymentStatus, Pageable pageable);

    boolean existsByApplicationIdAndPaymentStatus(Long applicationId, Payment.PaymentStatus paymentStatus);

    long countByCompanyIdAndPaymentStatus(Long companyId, Payment.PaymentStatus paymentStatus);

    long countByPaymentStatus(Payment.PaymentStatus paymentStatus);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.company.id = :companyId AND p.paymentStatus = 'SUCCESS'")
    BigDecimal sumCollectedAmountByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'SUCCESS'")
    BigDecimal sumTotalSuccessfulAmount();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'REFUNDED'")
    BigDecimal sumTotalRefundedAmount();
}

package com.interndesk.repository;

import com.interndesk.entity.Refund;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    Optional<Refund> findByPaymentId(Long paymentId);
    List<Refund> findByRefundStatusOrderByCreatedAtDesc(Refund.RefundStatus status);
    Page<Refund> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Refund> findByRefundStatus(Refund.RefundStatus status, Pageable pageable);
}

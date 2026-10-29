package com.interndesk.repository;

import com.interndesk.entity.CompanyVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyVerificationRepository extends JpaRepository<CompanyVerification, Long> {

    List<CompanyVerification> findByCompanyIdOrderByReviewedAtDesc(Long companyId);
}


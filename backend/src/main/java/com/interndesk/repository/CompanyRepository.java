package com.interndesk.repository;

import com.interndesk.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    Page<Company> findByVerificationStatus(Company.VerificationStatus status, Pageable pageable);

    @Query("SELECT c FROM Company c WHERE " +
           "(:query IS NULL OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.industry) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.city) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:status IS NULL OR c.verificationStatus = :status)")
    Page<Company> searchCompanies(@Param("query") String query, @Param("status") Company.VerificationStatus status, Pageable pageable);

    long countByVerificationStatus(Company.VerificationStatus status);
}

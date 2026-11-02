package com.interndesk.repository;

import com.interndesk.entity.InternshipEligibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InternshipEligibilityRepository extends JpaRepository<InternshipEligibility, Long> {
    Optional<InternshipEligibility> findByInternshipId(Long internshipId);
    void deleteByInternshipId(Long internshipId);
}

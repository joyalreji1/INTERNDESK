package com.interndesk.repository;

import com.interndesk.entity.SavedInternship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedInternshipRepository extends JpaRepository<SavedInternship, Long> {
    List<SavedInternship> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    Optional<SavedInternship> findByStudentIdAndInternshipId(Long studentId, Long internshipId);
    boolean existsByStudentIdAndInternshipId(Long studentId, Long internshipId);
    void deleteByStudentIdAndInternshipId(Long studentId, Long internshipId);
}


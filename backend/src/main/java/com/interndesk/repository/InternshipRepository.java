package com.interndesk.repository;

import com.interndesk.entity.Internship;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {

    List<Internship> findByCompanyId(Long companyId);

    Page<Internship> findByCompanyId(Long companyId, Pageable pageable);

    @Query("""
        SELECT i FROM Internship i JOIN i.company c
        WHERE i.status = 'ACTIVE'
        AND (:query IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :query, '%'))
             OR LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%'))
             OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :query, '%')))
        AND (:category IS NULL OR LOWER(i.category) = LOWER(:category))
        AND (:workMode IS NULL OR i.workMode = :workMode)
        AND (:location IS NULL OR LOWER(i.location) LIKE LOWER(CONCAT('%', :location, '%')))
        AND (:minStipend IS NULL OR i.stipendMin >= :minStipend)
        AND (:maxStipend IS NULL OR i.stipendMax <= :maxStipend)
        AND (:isPaid IS NULL OR i.isPaid = :isPaid)
        AND (:deadlineAfter IS NULL OR i.applicationDeadline >= :deadlineAfter)
        """)
    Page<Internship> searchInternships(
        @Param("query") String query,
        @Param("category") String category,
        @Param("workMode") Internship.WorkMode workMode,
        @Param("location") String location,
        @Param("minStipend") BigDecimal minStipend,
        @Param("maxStipend") BigDecimal maxStipend,
        @Param("isPaid") Boolean isPaid,
        @Param("deadlineAfter") LocalDate deadlineAfter,
        Pageable pageable
    );

    @Modifying
    @Query("UPDATE Internship i SET i.viewsCount = i.viewsCount + 1 WHERE i.id = :id")
    void incrementViews(@Param("id") Long id);

    long countByStatus(Internship.InternshipStatus status);

    long countByCompanyId(Long companyId);

    long countByCompanyIdAndStatus(Long companyId, Internship.InternshipStatus status);

    @Query("SELECT i.category, COUNT(i) FROM Internship i WHERE i.status = 'ACTIVE' GROUP BY i.category")
    List<Object[]> countByCategory();
}

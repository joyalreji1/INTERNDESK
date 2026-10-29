
package com.interndesk.repository;

import com.interndesk.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

       boolean existsByStudentIdAndInternshipId(Long studentId, Long internshipId);

       Optional<Application> findByStudentIdAndInternshipId(Long studentId, Long internshipId);

       Page<Application> findByStudentId(Long studentId, Pageable pageable);

       @Query("SELECT a FROM Application a JOIN a.internship i JOIN i.company c WHERE c.id = :companyId")
       Page<Application> findByCompanyId(@Param("companyId") Long companyId, Pageable pageable);

       @Query("SELECT a FROM Application a JOIN a.internship i JOIN i.company c " +
                     "WHERE c.id = :companyId AND a.internship.id = :internshipId")
       Page<Application> findByCompanyIdAndInternshipId(@Param("companyId") Long companyId,
                     @Param("internshipId") Long internshipId, Pageable pageable);

       long countByStudentId(Long studentId);

       long countByStudentIdAndStatus(Long studentId, Application.ApplicationStatus status);

       @Query("SELECT COUNT(a) FROM Application a JOIN a.internship i JOIN i.company c WHERE c.id = :companyId")
       long countByCompanyId(@Param("companyId") Long companyId);

       @Query("SELECT COUNT(a) FROM Application a JOIN a.internship i JOIN i.company c " +
                     "WHERE c.id = :companyId AND a.status = :status")
       long countByCompanyIdAndStatus(@Param("companyId") Long companyId,
                     @Param("status") Application.ApplicationStatus status);

       long countByStatus(Application.ApplicationStatus status);

       @Query("SELECT a.status, COUNT(a) FROM Application a WHERE a.student.id = :studentId GROUP BY a.status")
       List<Object[]> countByStatusForStudent(@Param("studentId") Long studentId);

       @Query("SELECT a.status, COUNT(a) FROM Application a JOIN a.internship i JOIN i.company c " +
                     "WHERE c.id = :companyId GROUP BY a.status")
       List<Object[]> countByStatusForCompany(@Param("companyId") Long companyId);

       @Query("SELECT DATE(a.appliedAt), COUNT(a) FROM Application a " +
                     "WHERE a.appliedAt >= :after GROUP BY DATE(a.appliedAt) ORDER BY DATE(a.appliedAt)")
       List<Object[]> countDailyApplicationsSince(@Param("after") LocalDateTime after);

       @Query("SELECT a FROM Application a JOIN FETCH a.student sp JOIN FETCH sp.user " +
                     "JOIN FETCH a.internship i JOIN FETCH i.company c " +
                     "WHERE c.id = :companyId ORDER BY a.appliedAt DESC")
       List<Application> findRecentByCompanyId(@Param("companyId") Long companyId, Pageable pageable);
}

package com.interndesk.repository;

import com.interndesk.entity.StudentProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    @Query("SELECT sp FROM StudentProfile sp JOIN sp.user u " +
           "WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(sp.collegeName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(sp.department) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<StudentProfile> searchStudents(@Param("query") String query, Pageable pageable);
}

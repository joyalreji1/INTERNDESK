package com.interndesk.repository;

import com.interndesk.entity.StudentResume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentResumeRepository extends JpaRepository<StudentResume, Long> {

    List<StudentResume> findByStudentIdOrderByUploadedAtDesc(Long studentId);

    Optional<StudentResume> findByStudentIdAndIsPrimaryTrue(Long studentId);

    @Modifying
    @Query("UPDATE StudentResume r SET r.isPrimary = FALSE WHERE r.student.id = :studentId")
    void clearPrimaryForStudent(@Param("studentId") Long studentId);

    long countByStudentId(Long studentId);
}

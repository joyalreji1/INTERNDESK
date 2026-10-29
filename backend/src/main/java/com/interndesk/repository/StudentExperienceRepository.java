package com.interndesk.repository;

import com.interndesk.entity.StudentExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentExperienceRepository extends JpaRepository<StudentExperience, Long> {
    List<StudentExperience> findByStudentIdOrderByStartDateDesc(Long studentId);
}


package com.interndesk.repository;

import com.interndesk.entity.StudentProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentProjectRepository extends JpaRepository<StudentProject, Long> {
    List<StudentProject> findByStudentIdOrderByStartDateDesc(Long studentId);
}


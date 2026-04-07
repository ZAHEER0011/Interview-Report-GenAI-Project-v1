package com.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.model.InterviewReport;
import com.project.model.User;

public interface InterviewReportRepository extends JpaRepository<InterviewReport, Long> {
	List<InterviewReport> findByUser(User user);
}

package com.project.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.apache.tika.Tika;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.dto.GenerateReportRequest;
import com.project.model.InterviewReport;
import com.project.model.User;
import com.project.repository.InterviewReportRepository;
import com.project.repository.UserRepository;
import com.project.service.AIService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

	private final UserRepository userRepository; // ✅ ADD THIS
	private final AIService aiService;
	private final InterviewReportRepository interviewRepository;

	@PostMapping("/report")
	public ResponseEntity<?> generateReport(@RequestParam("resume") MultipartFile file,
			@RequestParam String jobDescription, @RequestParam String selfDescription, Authentication authentication)
			throws Exception {

		// ✅ STEP 1: Get logged-in user
		String email = (String) authentication.getPrincipal();

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		// ✅ STEP 2: Extract text from PDF using Tika
		Tika tika = new Tika();
		String resumeText = tika.parseToString(file.getInputStream());

		resumeText = resumeText.replaceAll("[^\\x00-\\x7F\\n]", "") // keep newline
				.replaceAll("[ \\t]+", " ") // normalize spaces ONLY
				.replaceAll("\\n+", "\n") // clean extra newlines
				.trim();

		// ✅ STEP 3: Call AI service
		String response = aiService.generateReport(jobDescription, resumeText, selfDescription, user);
		
		InterviewReport report = InterviewReport.builder()
		        .jobDescription(jobDescription)
		        .resume(resumeText)
		        .selfDescription(selfDescription)
		        .reportJson(response)
		        .user(user)
		        .build();

		InterviewReport savedReport = interviewRepository.save(report);
		
		

		return ResponseEntity.ok(savedReport);

	}

	@GetMapping("/my-reports")
	public ResponseEntity<?> getAllReports(Authentication authentication) {

	    String email = (String) authentication.getPrincipal();

	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    List<InterviewReport> reports = interviewRepository.findByUser(user);

	    return ResponseEntity.ok(
	        reports.stream().map(r -> {
	            try {
	                ObjectMapper mapper = new ObjectMapper();
	                var parsed = mapper.readTree(r.getReportJson());

	                return Map.of(
	                    "id", r.getId(),
	                    "title", parsed.path("title").asText(),
	                    "matchScore", parsed.path("matchScore").asInt(),
	                    "jobDescription", r.getJobDescription()
	                );
	            } catch (Exception e) {
	                throw new RuntimeException("Invalid JSON");
	            }
	        })
	    );
	}

	@GetMapping("/report/{id}")
	public ResponseEntity<?> getReportById(@PathVariable Long id, Authentication authentication) {
		String email = (String) authentication.getPrincipal();

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not foudn"));

		InterviewReport report = interviewRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Report not found"));

		if (!report.getUser().getUserId().equals(user.getUserId())) {
			return ResponseEntity.status(403).body("Unauthorized");
		}

		return ResponseEntity.ok(report);
	}
	
}

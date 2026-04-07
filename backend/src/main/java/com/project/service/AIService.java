package com.project.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.project.model.InterviewReport;
import com.project.model.User;
import com.project.repository.InterviewReportRepository;

import lombok.RequiredArgsConstructor;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class AIService {

	private final ObjectMapper objectMapper;

	private final InterviewReportRepository repo;

	@Value("${google.api.key}")
	private String apiKey;

	public String generateReport(String jobDescription, String resume, String selfDescription, User user) {

		Client client = Client.builder().apiKey(apiKey).build(); // API key auto from env

		String prompt = buildPrompt(jobDescription, resume, selfDescription);

		GenerateContentResponse response = client.models.generateContent("gemini-2.5-flash", prompt, null);

		String raw = response.text();

		String cleaned = raw.replaceAll("```json", "").replaceAll("```JSON", "").replaceAll("```", "").trim();

		JsonNode node;
		try {
			node = objectMapper.readTree(cleaned);
		} catch (Exception e) {
			throw new RuntimeException("AI returned invalid JSON" + cleaned);
		}

		int matchScore = node.path("matchScore").asInt(0);

		// ✅ STEP 5: SAVE TO DB
		InterviewReport report = InterviewReport.builder()
			    .jobDescription(jobDescription)
			    .resume(resume)
			    .selfDescription(selfDescription)
			    .matchScore(matchScore)
			    .reportJson(cleaned)
			    .user(user)   // 🔥 THIS IS THE KEY CHANGE
			    .build();

		repo.save(report);

		// ✅ STEP 6: RETURN CLEAN JSON
		return cleaned;

	}

	private String buildPrompt(String jobDescription, String resume, String selfDescription) {
		return """
				You are an AI interview assistant.

				Your task is to generate a structured interview report for a candidate based on the given inputs.

				INPUT:

				* Job Description: %s
				* Resume: %s
				* Self Description: %s

				You MUST return a STRICT JSON object with the following structure and detailed meaning of each field:

				{
				"title": "The title of the job role for which this interview report is generated. This should be derived from the job description.",

				"matchScore": "A number between 0 and 100 indicating how well the candidate's profile matches the job description. Higher means better alignment.",

				"technicalQuestions": [
				{
				"question": "A relevant technical interview question that can be asked to the candidate based on the job description and resume.",
				"intention": "The intention of the interviewer behind asking this question. Explain what skill, concept, or depth is being evaluated.",
				"answer": "A detailed guide on how the candidate should answer this question. Include key points, concepts, structure, and approach."
				}
				],

				"behavioralQuestions": [
				{
				"question": "A behavioral interview question based on the candidate's personality, experience, or growth.",
				"intention": "The reason why the interviewer is asking this question. What behavior, mindset, or trait is being evaluated.",
				"answer": "How the candidate should answer this using structured storytelling (like STAR method), including what points to cover."
				}
				],

				"skillGaps": [
				{
				"skill": "The specific skill that the candidate is lacking or weak in compared to the job requirements.",
				"severity": "The severity of the skill gap. Must be one of: low, medium, high. This represents how critical this skill is for the role and how much it impacts selection chances."
				}
				],

				"preparationPlan": [
				{
				"day": "The day number in the preparation plan, starting from 1.",
				"focus": "The main topic or focus area for that day (e.g., Data Structures, System Design, MongoDB, etc.).",
				"tasks": [
				"A specific actionable task such as reading, practicing, building, or revising a concept."
				]
				}
				]
				}

				IMPORTANT RULES:

				* Return ONLY valid JSON (no markdown, no explanation, no extra text)
				* Do NOT include `json or `
				* All fields are REQUIRED
				* matchScore must be a number between 0 and 100
				* severity must ONLY be one of: low, medium, high
				* You MUST generate MULTIPLE items for:

				  * technicalQuestions (at least 3)
				  * behavioralQuestions (at least 3)
				  * skillGaps (depends on profile)
				  * preparationPlan (at least 7 days)
				* Ensure output is realistic, professional, and tailored to the given inputs
				* Do NOT leave any field empty
				""".formatted(jobDescription, resume, selfDescription);
	}

}

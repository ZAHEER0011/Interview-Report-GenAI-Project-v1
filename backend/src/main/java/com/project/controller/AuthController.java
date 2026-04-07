package com.project.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.dto.GenerateReportRequest;
import com.project.dto.LoginRequest;
import com.project.dto.RegisterRequest;
import com.project.model.User;
import com.project.repository.UserRepository;
import com.project.service.AIService;
import com.project.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
	
	private final AuthService authService;
	private final UserRepository userRepository;
	
	
	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request){
		return ResponseEntity.ok(authService.register(request));
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody LoginRequest request){
		return ResponseEntity.ok(authService.login(request));
	}
	
	@PostMapping("/logout")
	public ResponseEntity<?> logoutUser(@RequestHeader("Authorization") String authHeader){
		String token = authHeader.substring(7);
		
		return ResponseEntity.ok(authService.logout(token));
	}
	
	@GetMapping("/user/get-me")
	public ResponseEntity<?> getMe(Authentication authentication){
	    
	    String email = (String) authentication.getPrincipal();

	    Optional<User> userOptional = userRepository.findByEmail(email);

	    if(userOptional.isEmpty()){
	        return ResponseEntity.status(404).body(Map.of("message", "User not found"));
	    }

	    User user = userOptional.get();

	    return ResponseEntity.ok(Map.of(
	        "user", Map.of(
	            "id", user.getUserId(),
	            "email", user.getEmail(),
	            "username", user.getUsername()
	        )
	    ));
	}
	
	
}

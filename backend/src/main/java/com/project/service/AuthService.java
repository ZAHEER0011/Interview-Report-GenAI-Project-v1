package com.project.service;

import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.dto.LoginRequest;
import com.project.dto.RegisterRequest;
import com.project.model.BlackListedToken;
import com.project.model.User;
import com.project.repository.BlackListedTokenRepository;
import com.project.repository.UserRepository;
import com.project.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	private final UserRepository userRepository;
	private final JwtUtil jwtUtil;
	private final BlackListedTokenRepository blacklistRepo;
	
	public Map<String, Object> register(RegisterRequest request) {
		if(request.getUsername() == null || request.getEmail() == null || request.getPassword() == null) {
			return Map.of("message", "Provide username, email and password!");
		}
		
		Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
		
		if(existingUser.isPresent()) {
			return Map.of("message", "Email already Exists!");
		}
		
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		
		String hashedPassword = encoder.encode(request.getPassword());
		
		User user = new User();
		
		user.setUsername(request.getUsername());
		user.setEmail(request.getEmail());
		user.setPassword(hashedPassword);
		
		userRepository.save(user);
		
		return Map.of(
				"message", "User Registered Successfully!",
				"user", Map.of(
				        "id", user.getUserId(),
				        "email", user.getEmail(),
				        "username", user.getUsername()
				    )
				);
	}
	
	public Map<String, Object> login(LoginRequest request) {
		if(request.getEmail() == null || request.getPassword() == null) {
			return Map.of("message", "Provide email and password");
		}
		
		Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
		
		if(existingUser.isEmpty()) {
			return Map.of("message", "User Data not Found!");
		}
		
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		
		User user = existingUser.get();
		
		boolean isPasswordMatch = encoder.matches(request.getPassword(), user.getPassword());
		
		if(!isPasswordMatch) {
			return Map.of("message", "Password Does not match!");
		}
		
		String token = jwtUtil.generateToken(user);
		
		return Map.of(
				"message","User Login Successful",
				"token", token,
				"user", Map.of(
				        "id", user.getUserId(),
				        "email", user.getEmail(),
				        "username", user.getUsername()
				    )
				);
	}
	
	public Map<String, String> logout(String token){
		BlackListedToken blackListed = new BlackListedToken();
		
		blackListed.setToken(token);
		
		blacklistRepo.save(blackListed);
		
		return Map.of("message","Logged Out Successfully");
	}
}

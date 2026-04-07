package com.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.project.security.JwtFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtFilter jwtFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable())

				// ✅ ADD THIS LINE
				.cors(cors -> {
				})

				.authorizeHttpRequests(
						auth -> auth.requestMatchers("/api/auth/**").permitAll().anyRequest().authenticated())

				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
	
	@Bean
	public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
	    org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();

	    config.setAllowedOrigins(java.util.List.of("http://localhost:5173", "https://interview-report-gen-ai-project-v1.vercel.app/"));
	    config.setAllowedMethods(java.util.List.of("*"));
	    config.setAllowedHeaders(java.util.List.of("*"));

	    org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
	            new org.springframework.web.cors.UrlBasedCorsConfigurationSource();

	    source.registerCorsConfiguration("/**", config);
	    return source;
	}

}

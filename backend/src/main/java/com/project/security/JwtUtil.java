package com.project.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.project.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	@Value("${jwt.secret}")
	private String secret;
	
	public String generateToken(User user) {
		
		Key key = Keys.hmacShaKeyFor(secret.getBytes());
		return Jwts.builder()
				.setSubject(user.getEmail())
				.claim("id", user.getUserId())
				.claim("username", user.getUsername())
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 86400000))
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();
	}
	
	public String extractEmail(String token) {
		Key key = Keys.hmacShaKeyFor(secret.getBytes());
		return Jwts.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
	}
}

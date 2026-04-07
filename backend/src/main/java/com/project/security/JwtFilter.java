package com.project.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.project.repository.BlackListedTokenRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
	
	private final JwtUtil jwtUtil;
	private final BlackListedTokenRepository blacklistRepo;
	

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		String path = request.getRequestURI();

		// ✅ Skip auth routes completely
		if(path.equals("/api/auth/login") || path.equals("/api/auth/register")){
		    filterChain.doFilter(request, response);
		    return;
		}
		
		String authHeader = request.getHeader("Authorization");
		
		if(authHeader == null || !authHeader.startsWith("Bearer ")){
		    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		    response.getWriter().write("Token missing");
		    return;
		}
		
		String token = authHeader.substring(7);
		
		try {
			boolean isTokenBlackList = blacklistRepo.existsByToken(token);
			if(isTokenBlackList) {
			    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			    response.getWriter().write("Token is Invalid or Blacklisted, Login again!!");
			    return; // 🚨 VERY IMPORTANT
			}
			
			String email = jwtUtil.extractEmail(token);
			
			UsernamePasswordAuthenticationToken auth =
			        new UsernamePasswordAuthenticationToken(email, null, null);

			SecurityContextHolder.getContext().setAuthentication(auth);
			
			
			// Set Authentication context later
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().write("Invalid Token");
			return;
		}
		filterChain.doFilter(request, response);
	}

}

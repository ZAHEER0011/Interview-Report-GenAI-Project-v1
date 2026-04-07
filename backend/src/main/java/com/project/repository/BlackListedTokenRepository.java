package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.model.BlackListedToken;

public interface BlackListedTokenRepository extends JpaRepository<BlackListedToken, Long> {
	boolean existsByToken(String token);
}

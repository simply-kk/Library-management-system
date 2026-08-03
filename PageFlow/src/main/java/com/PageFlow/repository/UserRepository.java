package com.PageFlow.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.PageFlow.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

	// Check if email already exists
	boolean existsByEmail(String email);

	// Find user by email (used for login & Spring Security)
	Optional<User> findByEmail(String email);

}
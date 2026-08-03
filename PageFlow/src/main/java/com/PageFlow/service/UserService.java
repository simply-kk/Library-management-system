package com.PageFlow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.PageFlow.dto.LoginRequest;
import com.PageFlow.dto.RegisterRequest;
import com.PageFlow.entity.User;
import com.PageFlow.exception.InvalidCredentialsException;
import com.PageFlow.exception.UserAlreadyExistsException;
import com.PageFlow.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	// for registration
	public User register(RegisterRequest request) {

		// Check if a user with the same email already exists
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new UserAlreadyExistsException("User with email " + request.getEmail() + " already exists.");
		}

		// Create a new User object
		User user = new User();

		// Copy data from request to entity
		user.setName(request.getName());
		user.setEmail(request.getEmail());

		// Encrypt the password before saving
		user.setPassword(passwordEncoder.encode(request.getPassword()));

		// Assign role
		user.setRole(request.getRole());

		// Save user in the database
		return userRepository.save(user);
	}

	// for login
	public User login(LoginRequest request) {

		// Find user by email
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

		// Compare entered password with encrypted password
		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new InvalidCredentialsException("Invalid email or password.");
		}

		// Login successful
		return user;
	}

}
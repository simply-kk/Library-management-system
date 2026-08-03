package com.PageFlow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.PageFlow.dto.LoginRequest;
import com.PageFlow.dto.RegisterRequest;
import com.PageFlow.dto.ResponseStructure;
import com.PageFlow.dto.UserResponse;
import com.PageFlow.entity.User;
import com.PageFlow.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private UserService userService;

	private UserResponse mapToUserResponse(User user) {

		UserResponse response = new UserResponse();

		response.setId(user.getId());
		response.setName(user.getName());
		response.setEmail(user.getEmail());
		response.setRole(user.getRole());

		return response;
	}

	// Register a new user
	@PostMapping("/register")
	public ResponseEntity<ResponseStructure<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {

		User user = userService.register(request);

		ResponseStructure<UserResponse> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.CREATED.value());
		response.setMessage("User registered successfully.");
		response.setData(mapToUserResponse(user));

		return new ResponseEntity<>(response, HttpStatus.CREATED);

	}

	// Login existing user
	@PostMapping("/login")
	public ResponseEntity<ResponseStructure<UserResponse>> login(@Valid @RequestBody LoginRequest request) {

		User user = userService.login(request);

		ResponseStructure<UserResponse> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Login successful.");
		response.setData(mapToUserResponse(user));

		return ResponseEntity.ok(response);
	}

}
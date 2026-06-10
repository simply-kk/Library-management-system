package com.PageFlow.exception;

public class IdNotFoundException extends RuntimeException {
	// Unique identifier for serialization
	private static final long serialVersionUID = 1L;

	public IdNotFoundException(String message) {
		super(message);
	}
}

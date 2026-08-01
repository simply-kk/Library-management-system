package com.PageFlow.exception;

public class StudentEmailAlreadyExistsException extends RuntimeException {
	public StudentEmailAlreadyExistsException(String message) {
		super(message);
	}

}

package com.PageFlow.exception;

public class NoRecordAvailableException extends RuntimeException {
	// Unique identifier for serialization
	private static final long serialVersionUID = 1L;

	public NoRecordAvailableException(String message) {
		super(message);
	}
}
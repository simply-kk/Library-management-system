package com.PageFlow.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.PageFlow.dto.ResponseStructure;

@RestControllerAdvice
public class GlobalExceptionHandler {

	// ===========================================================
	// VALIDATION EXCEPTIONS (400 Bad Request)
	// Handles @Valid annotation failures
	// ===========================================================

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ResponseStructure<Map<String, String>>> handleValidationException(
			MethodArgumentNotValidException ex) {

		Map<String, String> errors = new HashMap<>();

		ex.getBindingResult().getFieldErrors().forEach(error -> {
			errors.put(error.getField(), error.getDefaultMessage());
		});

		ResponseStructure<Map<String, String>> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.BAD_REQUEST.value());
		response.setMessage("Validation failed.");
		response.setData(errors);

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	// ===========================================================
	// BUSINESS EXCEPTIONS (400 Bad Request)
	// Thrown when a business rule is violated
	// ===========================================================

	@ExceptionHandler(BookAlreadyReturnedException.class)
	public ResponseEntity<ResponseStructure<String>> handleBookAlreadyReturnedException(
			BookAlreadyReturnedException ex) {

		ResponseStructure<String> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.BAD_REQUEST.value());
		response.setMessage("Book return operation failed.");
		response.setData(ex.getMessage());

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	// ===========================================================
	// RESOURCE NOT FOUND EXCEPTIONS (404 Not Found)
	// ===========================================================

	@ExceptionHandler(IdNotFoundException.class)
	public ResponseEntity<ResponseStructure<Void>> handleIdNotFoundException(
			IdNotFoundException ex) {

		ResponseStructure<Void> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.NOT_FOUND.value());
		response.setMessage(ex.getMessage());
		response.setData(null);

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	@ExceptionHandler(NoRecordAvailableException.class)
	public ResponseEntity<ResponseStructure<Void>> handleNoRecordAvailableException(
			NoRecordAvailableException ex) {

		ResponseStructure<Void> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.NOT_FOUND.value());
		response.setMessage(ex.getMessage());
		response.setData(null);

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	// ===========================================================
	// GLOBAL EXCEPTION HANDLER (500 Internal Server Error)
	// Handles any unexpected exception not caught above
	// ===========================================================

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ResponseStructure<Void>> handleGlobalException(
			Exception ex) {

		ResponseStructure<Void> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
		response.setMessage("An unexpected error occurred.");
		response.setData(null);

		return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(response);
	}

}
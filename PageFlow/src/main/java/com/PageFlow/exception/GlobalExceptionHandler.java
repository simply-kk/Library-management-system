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

	// ************** HANDLE ID NOT FOUND **************
	@ExceptionHandler(IdNotFoundException.class)
	public ResponseEntity<ResponseStructure<Void>> handleIdNotFoundException(IdNotFoundException exception) {
		ResponseStructure<Void> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.NOT_FOUND.value()); // 404
		res.setMessage(exception.getMessage());
		res.setData(null); // Clean and standardized for missing data

		return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
	}

	// ************** HANDLE NO RECORD AVAILABLE **************
	@ExceptionHandler(NoRecordAvailableException.class)
	public ResponseEntity<ResponseStructure<Void>> handleNoRecordAvailableException(
			NoRecordAvailableException exception) {
		ResponseStructure<Void> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.NOT_FOUND.value()); // 404
		res.setMessage(exception.getMessage());
		res.setData(null);

		return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
	}

	// ****************** VALIDATION EXCEPTION ************************
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ResponseStructure<Map<String, String>>> handleValidationException(
			MethodArgumentNotValidException ex) {

		Map<String, String> errors = new HashMap<>();

		ex.getBindingResult().getFieldErrors().forEach(error -> {
			errors.put(error.getField(), error.getDefaultMessage());
		});

		ResponseStructure<Map<String, String>> res = new ResponseStructure<>();
		res.setStatusCode(HttpStatus.BAD_REQUEST.value()); // 400
		res.setMessage("Validation failed");
		res.setData(errors);

		return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
	}

	// ************** CATCH-ALL SAFETY NET (500 Internal Server Error)
	// **************
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ResponseStructure<Void>> handleGlobalException(Exception exception) {
		ResponseStructure<Void> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()); // 500
		res.setMessage("An unexpected error occurred: " + exception.getMessage());
		res.setData(null);

		return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
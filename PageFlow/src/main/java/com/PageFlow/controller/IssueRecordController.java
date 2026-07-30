package com.PageFlow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.PageFlow.dto.IssueBookRequest;
import com.PageFlow.dto.ResponseStructure;
import com.PageFlow.entity.IssueRecord;
import com.PageFlow.service.IssueRecordService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/issues")
public class IssueRecordController {

	@Autowired
	private IssueRecordService issueRecordService;

	// Issue a book
	@PostMapping
	public ResponseEntity<ResponseStructure<IssueRecord>> issueBook(@Valid @RequestBody IssueBookRequest request) {

		ResponseStructure<IssueRecord> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.CREATED.value());
		res.setMessage("Book issued successfully.");
		res.setData(issueRecordService.issueBook(request));

		return ResponseEntity.status(HttpStatus.CREATED).body(res);
	}

	// Return an issued book
	@PutMapping("/{issueId}/return")
	public ResponseEntity<ResponseStructure<IssueRecord>> returnBook(@PathVariable Integer issueId) {

		ResponseStructure<IssueRecord> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("Book returned successfully.");
		res.setData(issueRecordService.returnBook(issueId));

		return ResponseEntity.ok(res);
	}

	// to fetch issue Record
	@GetMapping
	public ResponseEntity<ResponseStructure<List<IssueRecord>>> getAllIssueRecords() {
		List<IssueRecord> issueRecords = issueRecordService.getAllIssueRecords();
		ResponseStructure<List<IssueRecord>> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("All issue records fetched successfully");
		res.setData(issueRecords);

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Fetch issue record by ID
	@GetMapping("/{issueId}")
	public ResponseEntity<ResponseStructure<IssueRecord>> getIssueRecordById(@PathVariable Integer issueId) {
		ResponseStructure<IssueRecord> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("Issue record fetched successfully.");
		res.setData(issueRecordService.getIssueRecordById(issueId));

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Fetch all issue records of a specific student
	@GetMapping("/student/{studentId}")
	public ResponseEntity<ResponseStructure<List<IssueRecord>>> getIssueRecordsByStudentId(
			@PathVariable Integer studentId) {

		List<IssueRecord> issueRecords = issueRecordService.getIssueRecordsByStudentId(studentId);

		ResponseStructure<List<IssueRecord>> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("Student issue records fetched successfully.");
		res.setData(issueRecords);

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Fetch all issue records of a specific book
	@GetMapping("/book/{bookId}")
	public ResponseEntity<ResponseStructure<List<IssueRecord>>> getIssueRecordsByBookId(@PathVariable Integer bookId) {

		List<IssueRecord> issueRecords = issueRecordService.getIssueRecordsByBookId(bookId);

		ResponseStructure<List<IssueRecord>> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("Book issue records fetched successfully.");
		res.setData(issueRecords);

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

}
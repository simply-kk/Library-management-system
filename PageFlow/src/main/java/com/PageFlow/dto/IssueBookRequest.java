package com.PageFlow.dto;

import jakarta.validation.constraints.NotNull;

public class IssueBookRequest {

	
    @NotNull(message = "Student ID is required")
	private Integer studentId;

    @NotNull(message = "Book ID is required")
	private Integer bookId;

	public Integer getStudentId() {
		return studentId;
	}

	public void setStudentId(Integer studentId) {
		this.studentId = studentId;
	}

	public Integer getBookId() {
		return bookId;
	}

	public void setBookId(Integer bookId) {
		this.bookId = bookId;
	}
	

}

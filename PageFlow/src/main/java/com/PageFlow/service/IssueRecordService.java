package com.PageFlow.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.PageFlow.dto.IssueBookRequest;
import com.PageFlow.entity.Book;
import com.PageFlow.entity.IssueRecord;
import com.PageFlow.entity.Student;
import com.PageFlow.enums.IssueStatus;
import com.PageFlow.exception.BookAlreadyIssuedException;
import com.PageFlow.exception.BookAlreadyReturnedException;
import com.PageFlow.exception.BookNotAvailableException;
import com.PageFlow.exception.IdNotFoundException;
import com.PageFlow.exception.NoRecordAvailableException;
import com.PageFlow.repository.BookRepository;
import com.PageFlow.repository.IssueRecordRepository;
import com.PageFlow.repository.StudentRepository;

import jakarta.transaction.Transactional;

@Service
public class IssueRecordService {

	@Autowired
	private StudentRepository studentRepository;

	@Autowired
	private IssueRecordRepository issueRecordRepository;

	@Autowired
	private BookRepository bookRepository;

	@Transactional // Ensures all database operations succeed together or rollBack
	public IssueRecord issueBook(IssueBookRequest request) {

		// Fetch the student from the database.
		// If the given student ID does not exist, stop the operation.
		Student student = studentRepository.findById(request.getStudentId())
				.orElseThrow(() -> new IdNotFoundException("Student with ID " + request.getStudentId() + " not found"));

		// Fetch the book from the database.
		// If the given book ID does not exist, stop the operation.
		Book book = bookRepository.findById(request.getBookId())
				.orElseThrow(() -> new IdNotFoundException("Book with ID " + request.getBookId() + " not found"));

		// A book can only be issued if at least one copy is available.
		if (book.getAvailableCopies() <= 0) {
			throw new BookNotAvailableException("Book is currently not available for issue.");
		}

		// Prevent the same student from issuing the same book multiple times
		// until the previous copy has been returned.
		if (issueRecordRepository.existsByStudentIdAndBookIdAndStatus(student.getId(), book.getId(),
				IssueStatus.ISSUED)) {

			throw new BookAlreadyIssuedException("This student has already issued this book.");
		}

		// Create a new issue transaction record.
		IssueRecord issueRecord = new IssueRecord();

		// Associate the student and book with this transaction.
		issueRecord.setStudent(student);
		issueRecord.setBook(book);

		// Store issue details.
		issueRecord.setIssueDate(LocalDate.now());
		issueRecord.setDueDate(LocalDate.now().plusDays(7));
		issueRecord.setStatus(IssueStatus.ISSUED);

		// Update book inventory after successful issue.
		book.setAvailableCopies(book.getAvailableCopies() - 1);

		// Increase the student's current issued book count.
		student.setCurrentIssuedBooks(student.getCurrentIssuedBooks() + 1);

		// Save all changes.
		// Because of @Transactional, either all three records are saved
		// successfully or none of them are saved.
		issueRecordRepository.save(issueRecord);
		bookRepository.save(book);
		studentRepository.save(student);

		return issueRecord;
	}

	@Transactional
	public IssueRecord returnBook(Integer issueId) {

		IssueRecord issueRecord = issueRecordRepository.findById(issueId)
				.orElseThrow(() -> new IdNotFoundException("Issue record with ID " + issueId + " not found"));

		if (issueRecord.getStatus() == IssueStatus.RETURNED) {
			throw new BookAlreadyReturnedException("This book has already been returned.");
		}

		Book book = issueRecord.getBook();
		Student student = issueRecord.getStudent();

		// set return status and date
		issueRecord.setReturnDate(LocalDate.now());
		issueRecord.setStatus(IssueStatus.RETURNED);

		// Update book and student records
		book.setAvailableCopies(book.getAvailableCopies() + 1);
		if (student.getCurrentIssuedBooks() > 0) {
			student.setCurrentIssuedBooks(student.getCurrentIssuedBooks() - 1);
		}

		issueRecordRepository.save(issueRecord);
		bookRepository.save(book);
		studentRepository.save(student);

		return issueRecord;
	}

	// fetch logic
	public List<IssueRecord> getAllIssueRecords() {

		List<IssueRecord> issueRecords = issueRecordRepository.findAll();
		if (issueRecords.isEmpty()) {
			throw new NoRecordAvailableException("No issue records are available.");
		}

		return issueRecords;
	}

	// fetch by id
	public IssueRecord getIssueRecordById(Integer issueId) {
		return issueRecordRepository.findById(issueId)
				.orElseThrow(() -> new IdNotFoundException("Issue record with ID " + issueId + " not found."));

	}

	// Fetch all issue records of a specific student
	public List<IssueRecord> getIssueRecordsByStudentId(Integer studentId) {

		List<IssueRecord> issueRecords = issueRecordRepository.findByStudentId(studentId);

		if (issueRecords.isEmpty()) {
			throw new NoRecordAvailableException("No issue records found for student ID " + studentId + ".");
		}

		return issueRecords;
	}

	// Fetch all issue records of a specific book
	public List<IssueRecord> getIssueRecordsByBookId(Integer bookId) {

		List<IssueRecord> issueRecords = issueRecordRepository.findByBookId(bookId);

		if (issueRecords.isEmpty()) {
			throw new NoRecordAvailableException("No issue records found for book ID " + bookId + ".");
		}

		return issueRecords;
	}

}

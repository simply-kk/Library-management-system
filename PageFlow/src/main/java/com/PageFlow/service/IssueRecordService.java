package com.PageFlow.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.PageFlow.dto.IssueBookRequest;
import com.PageFlow.entity.Book;
import com.PageFlow.entity.IssueRecord;
import com.PageFlow.entity.Student;
import com.PageFlow.enums.IssueStatus;
import com.PageFlow.exception.BookAlreadyReturnedException;
import com.PageFlow.exception.IdNotFoundException;
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

	// for issuing book
	// abhi ismai ek problem hai jab mai ek book issue kar raha hun to student ka
	// current issue randomly badh raha hai

	@Transactional
	public IssueRecord issueBook(IssueBookRequest request) {

		// checking student is available or not
		Student student = studentRepository.findById(request.getStudentId())
				.orElseThrow(() -> new IdNotFoundException("Student with ID " + request.getStudentId() + " not found"));

		// checking book is available or not
		Book book = bookRepository.findById(request.getBookId())
				.orElseThrow(() -> new IdNotFoundException("Book with ID " + request.getBookId() + " not found"));

		// availability of books
		if (book.getAvailableCopies() <= 0) {
			throw new IllegalArgumentException("Book is currently not available for issue");
		}

		// check if already issue book to same student
		if (issueRecordRepository.existsByStudentIdAndBookIdAndStatus(student.getId(), book.getId(),
				IssueStatus.ISSUED)) {
			throw new IllegalArgumentException("This student has already issued this book.");
		} else {

			// issue book
			IssueRecord issueRecord = new IssueRecord();
			issueRecord.setStudent(student);
			issueRecord.setBook(book);

			book.setAvailableCopies(book.getAvailableCopies() - 1);
			student.setCurrentIssuedBooks(book.getAvailableCopies() + 1);

			// save and this is Following acid property save all or none
			issueRecordRepository.save(issueRecord);
			bookRepository.save(book);
			studentRepository.save(student);

			return issueRecord;
		}
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

}

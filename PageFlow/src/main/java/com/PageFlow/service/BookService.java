package com.PageFlow.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.PageFlow.entity.Book;
import com.PageFlow.exception.IdNotFoundException;
import com.PageFlow.exception.NoRecordAvailableException;
import com.PageFlow.repository.BookRepository;

@Service
public class BookService {

	@Autowired
	private BookRepository bookRepository;

	// validateBook
	private void validateBook(Book book) {
		if (book.getAvailableCopies() > book.getTotalCopies()) {
			throw new IllegalArgumentException("Available copies cannot be greater than total copies");
		}

		if (bookRepository.existsByIsbn(book.getIsbn())) {
			throw new IllegalArgumentException("Book with this ISBN already exists");
		}
	}

	// insert
	public Book saveBook(Book book) {
		validateBook(book);

		return bookRepository.save(book);
	}

	// insert in batch
	public List<Book> saveAllBooks(List<Book> books) {
		for (Book book : books) {
			validateBook(book);
		}

		// But one issue still remains: duplicate ISBN inside same batch.
		return bookRepository.saveAll(books);
	}

	// to fetch all books
	public List<Book> getAllBooks() {
		List<Book> books = bookRepository.findAll();

		if (books.isEmpty()) {
			throw new NoRecordAvailableException("No books available");
		}

		return books;
	}

	// Fetch by id
	public Book findBookById(int id) {
		return bookRepository.findById(id)
				.orElseThrow(() -> new IdNotFoundException("Book with ID " + id + " does not exist in the library."));
	}

	// update using put
	// TODO: Handle duplicate ISBN during later
	public Book updateBook(Integer id, Book book) {

		Book existingBook = bookRepository.findById(id)
				.orElseThrow(() -> new IdNotFoundException("Book with ID " + id + " does not exist"));

		existingBook.setTitle(book.getTitle());
		existingBook.setAuthor(book.getAuthor());
		existingBook.setIsbn(book.getIsbn());
		existingBook.setCategory(book.getCategory());
		existingBook.setTotalCopies(book.getTotalCopies());
		existingBook.setAvailableCopies(book.getAvailableCopies());

		if (existingBook.getAvailableCopies() > existingBook.getTotalCopies()) {
			throw new IllegalArgumentException("Available copies cannot be greater than total copies");
		}

		return bookRepository.save(existingBook);
	}

	// Delete by ID
	public String deleteBookById(int id) {
		Book book = bookRepository.findById(id)
				.orElseThrow(() -> new IdNotFoundException("Book with ID " + id + " does not exist in the library."));
		bookRepository.delete(book);

		return "Book with ID " + id + " has been successfully deleted from the library.";
	}

	// Multiple delete with partial feedback
	public String deleteMultipleBooks(List<Integer> ids) {
		if (ids == null || ids.isEmpty()) {
			throw new NoRecordAvailableException("No book IDs were provided for deletion.");
		}

		List<Integer> validIds = new ArrayList<>();
		List<Integer> missingIds = new ArrayList<>();

		// Categorize each ID
		for (Integer id : ids) {
			if (bookRepository.existsById(id)) {
				validIds.add(id);
			} else {
				missingIds.add(id);
			}
		}

		// Perform deletion only if there are valid IDs to process
		if (!validIds.isEmpty()) {
			bookRepository.deleteAllById(validIds);
		}

		// Build the smart response message based on what happened
		if (missingIds.isEmpty()) {
			return validIds.size() + " books were successfully deleted from the library.";
		} else if (validIds.isEmpty()) {
			throw new IdNotFoundException(
					"No books were deleted. None of the provided IDs " + missingIds + " exist in the library.");
		} else {
			return validIds.size()
					+ " books were successfully deleted. However, these specific IDs did not match any records in the library: "
					+ missingIds;
		}
	}

	// Delete All at once
	public String deleteAllBooks() {
		if (bookRepository.count() == 0) {
			throw new NoRecordAvailableException("The library is already empty. No records available to delete.");
		}

		bookRepository.deleteAll();
		return "All book records have been deleted cleanly from the library database.";
	}

	// search books by title
	public List<Book> searchBooksByTitle(String title) {

		List<Book> books = bookRepository.findByTitleContainingIgnoreCase(title);

		if (books.isEmpty()) {
			throw new NoRecordAvailableException("No books found with title: " + title);
		}

		return books;
	}

	// search books by category
	public List<Book> searchBooksByCategory(String category) {

		List<Book> books = bookRepository.findByCategoryContainingIgnoreCase(category);
		if (books.isEmpty()) {
			throw new NoRecordAvailableException("No books found with Category: " + category);
		}

		return books;
	}

	// search books by author
	public List<Book> searchBooksByAuthor(String author) {

		List<Book> books = bookRepository.findByAuthorContainingIgnoreCase(author);
		if (books.isEmpty()) {
			throw new NoRecordAvailableException("No books found with Author: " + author);
		}
		return books;
	}

	// pagination
	public Page<Book> getBookByPagination(int pageNumber, int pageSize) {

		if (pageNumber < 0) {
			throw new IllegalArgumentException("Page number cannot be negative");
		}
		if (pageSize <= 0) {
			throw new IllegalArgumentException("Page size must be greater than 0");
		}
		Page<Book> pages = bookRepository.findAll(PageRequest.of(pageNumber, pageSize));

		if (pages.isEmpty()) {
			throw new NoRecordAvailableException("No records found on page " + pageNumber);
		}
		return pages;
	}

	// sorting with pagination
	public Page<Book> getBooksByPaginationAndSorting(int pageNumber, int pageSize, String sortBy, String direction) {

		if (pageNumber < 0) {
			throw new IllegalArgumentException("Page number cannot be negative");
		}
		if (pageSize <= 0) {
			throw new IllegalArgumentException("Page size must be greater than 0");
		}

		if (!direction.equalsIgnoreCase("asc") && !direction.equalsIgnoreCase("desc")) {
			throw new IllegalArgumentException("Direction must be asc or desc");
		}

		List<String> validFields = List.of("id", "title", "author", "category", "totalCopies", "availableCopies",
				"createdAt", "updatedAt");

		if (!validFields.contains(sortBy)) {
			throw new IllegalArgumentException("Invalid sort field");
		}
		Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

		Page<Book> pages = bookRepository.findAll(PageRequest.of(pageNumber, pageSize, sort));

		if (pages.isEmpty()) {
			throw new NoRecordAvailableException("No records found on page " + pageNumber);
		}

		return pages;
	}

}

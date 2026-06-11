package com.PageFlow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.PageFlow.dto.ResponseStructure;
import com.PageFlow.entity.Book;
import com.PageFlow.service.BookService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
public class BookController {
	@Autowired
	private BookService bookService;

	// Insert
	@PostMapping
	public ResponseEntity<ResponseStructure<Book>> saveBook(@Valid @RequestBody Book book) {
		ResponseStructure<Book> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.CREATED.value());// 201
		res.setMessage("Book record saved");
		res.setData(bookService.saveBook(book));

		return new ResponseEntity<>(res, HttpStatus.CREATED);
	}

//	Insert multiple data/batch
	@PostMapping("/all")
	public ResponseEntity<ResponseStructure<List<Book>>> saveAllBooks(@Valid @RequestBody List<Book> books) {

		List<Book> savedBooks = bookService.saveAllBooks(books);

		ResponseStructure<List<Book>> res = new ResponseStructure<>();
		res.setStatusCode(HttpStatus.CREATED.value());
		res.setMessage("All book records saved");
		res.setData(savedBooks);

		return new ResponseEntity<>(res, HttpStatus.CREATED);
	}

	// Fetch all data
	@GetMapping
	public ResponseEntity<ResponseStructure<List<Book>>> getAllBooks() {
		List<Book> books = bookService.getAllBooks();
		ResponseStructure<List<Book>> res = new ResponseStructure<>();
		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("All books fetched");
		res.setData(books);
		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Fetch record by Id
	@GetMapping("/{id}")
	public ResponseEntity<ResponseStructure<Book>> getBookById(@PathVariable Integer id) {
		ResponseStructure<Book> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("Book found");
		res.setData(bookService.findBookById(id));

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// update using put (full update)
	@PutMapping("/{id}")
	public ResponseEntity<ResponseStructure<Book>> updateBook(@PathVariable Integer id, @Valid @RequestBody Book book) {

		ResponseStructure<Book> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("Book updated");
		res.setData(bookService.updateBook(id, book));

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Delete Single Book by ID
	@DeleteMapping("/{id}")
	public ResponseEntity<ResponseStructure<String>> deleteBook(@PathVariable int id) {
		ResponseStructure<String> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value()); // 200
		res.setMessage("Single deletion processing complete");
		res.setData(bookService.deleteBookById(id));

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Multiple Delete at Once (Using Query Parameters)
	// URL Target: http://localhost:8080/api/books/batch?ids=1,2,3
	// In this still need some improvement
	@DeleteMapping("/batch")
	public ResponseEntity<ResponseStructure<String>> deleteMultipleBooks(@RequestParam List<Integer> ids) {
		ResponseStructure<String> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value()); // 200
		res.setMessage("Batch deletion processing complete");
		res.setData(bookService.deleteMultipleBooks(ids));

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Delete All Records Completely
	@DeleteMapping
	public ResponseEntity<ResponseStructure<String>> deleteAllBooks() {
		ResponseStructure<String> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value()); // 200
		res.setMessage("Global deletion processing complete");
		res.setData(bookService.deleteAllBooks());

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Search books by title
	@GetMapping("/search/title")
	public ResponseEntity<ResponseStructure<List<Book>>> searchBooksByTitle(@RequestParam String title) {

		ResponseStructure<List<Book>> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("Books fetched by title");
		res.setData(bookService.searchBooksByTitle(title));

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Search books by Author
	@GetMapping("/search/author")
	public ResponseEntity<ResponseStructure<List<Book>>> searchBooksByAuthor(@RequestParam String author) {

		ResponseStructure<List<Book>> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("Books fetched by Author");
		res.setData(bookService.searchBooksByAuthor(author));

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Search books by category
	@GetMapping("/search/category")
	public ResponseEntity<ResponseStructure<List<Book>>> searchBooksByCategory(@RequestParam String category) {

		ResponseStructure<List<Book>> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("Books fetched by Category");
		res.setData(bookService.searchBooksByCategory(category));

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Pagination
	@GetMapping("/page")
	public ResponseEntity<ResponseStructure<Page<Book>>> getBooksByPagination(
			@RequestParam(defaultValue = "0") int pageNumber, @RequestParam(defaultValue = "5") int pageSize) {

		ResponseStructure<Page<Book>> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("Book records retrieved by pagination");
		res.setData(bookService.getBookByPagination(pageNumber, pageSize));

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

}

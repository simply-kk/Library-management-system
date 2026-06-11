package com.PageFlow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.PageFlow.entity.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
	boolean existsByIsbn(String isbn);

	List<Book> findByTitleContainingIgnoreCase(String title); // search by title

	List<Book> findByAuthorContainingIgnoreCase(String author); // search by author

	List<Book> findByCategoryContainingIgnoreCase(String author); // search by Category
}

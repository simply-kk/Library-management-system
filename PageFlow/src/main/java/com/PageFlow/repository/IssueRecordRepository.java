package com.PageFlow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.PageFlow.entity.IssueRecord;
import com.PageFlow.enums.IssueStatus;

public interface IssueRecordRepository extends JpaRepository<IssueRecord, Integer> {

	// to check if already issued to him
	boolean existsByStudentIdAndBookIdAndStatus(Integer studentId, Integer bookId, IssueStatus status);

	List<IssueRecord> findByStudentId(Integer studentId); // to get student id history

	List<IssueRecord> findByBookId(Integer bookId); // to get book history
}

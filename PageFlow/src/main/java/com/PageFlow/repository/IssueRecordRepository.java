package com.PageFlow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.PageFlow.entity.IssueRecord;
import com.PageFlow.enums.IssueStatus;


public interface IssueRecordRepository extends JpaRepository<IssueRecord, Integer> {
	
	
	// to check if already issued to him
	boolean existsByStudentIdAndBookIdAndStatus(
	        Integer studentId,
	        Integer bookId,
	        IssueStatus status);

}
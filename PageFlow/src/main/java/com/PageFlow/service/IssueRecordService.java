package com.PageFlow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.PageFlow.repository.BookRepository;
import com.PageFlow.repository.IssueRecordRepository;
import com.PageFlow.repository.StudentRepository;

@Service
public class IssueRecordService {

	@Autowired
	private StudentRepository studentRepository;

	@Autowired
	private IssueRecordRepository issuedRecordRepository;

	@Autowired
	private BookRepository bookRepository;
}

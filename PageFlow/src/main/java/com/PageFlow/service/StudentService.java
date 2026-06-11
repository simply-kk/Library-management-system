package com.PageFlow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.PageFlow.entity.Student;
import com.PageFlow.repository.StudentRepository;

@Service
public class StudentService {

	@Autowired
	private StudentRepository studentRepository;

	// insert
	public Student saveStudent(Student student) {
		if (studentRepository.existsByEmail(student.getEmail())) {
			throw new IllegalArgumentException("Student with this email already exists");
		}

		if (studentRepository.existsByRollNumber(student.getRollNumber())) {
			throw new IllegalArgumentException("Student with this roll number already exists");
		}

		return studentRepository.save(student);

	}

}

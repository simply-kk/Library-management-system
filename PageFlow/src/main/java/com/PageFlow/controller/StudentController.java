package com.PageFlow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.PageFlow.dto.ResponseStructure;
import com.PageFlow.entity.Student;
import com.PageFlow.service.StudentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/students")
public class StudentController {
	@Autowired
	private StudentService studentService;

	// insert
	@PostMapping
	public ResponseEntity<ResponseStructure<Student>> saveStudent(@Valid @RequestBody Student student) {
		ResponseStructure<Student> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.CREATED.value());// 201
		res.setMessage("Student record saved");
		res.setData(studentService.saveStudent(student));

		return ResponseEntity.status(HttpStatus.CREATED).body(res);
	}

}

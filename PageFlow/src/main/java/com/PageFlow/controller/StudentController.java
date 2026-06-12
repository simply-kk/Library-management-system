package com.PageFlow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

	// fetch all student
	@GetMapping
	public ResponseEntity<ResponseStructure<List<Student>>> getAllStudents() {
		List<Student> students = studentService.getAllStudents();
		ResponseStructure<List<Student>> res = new ResponseStructure<>();
		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("All students fetched");
		res.setData(students);

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// fetch by student id
	@GetMapping("/{id}")
	public ResponseEntity<ResponseStructure<Student>> getStudentById(@PathVariable Integer id) {
		ResponseStructure<Student> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("Student found");
		res.setData(studentService.findStudentById(id));

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// update using put (full update)
	@PutMapping("/{id}")
	public ResponseEntity<ResponseStructure<Student>> updateStudent(@PathVariable Integer id,
			@Valid @RequestBody Student student) {

		ResponseStructure<Student> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value());
		res.setMessage("Student updated");
		res.setData(studentService.updateStudent(id, student));

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Delete Single student by ID
	@DeleteMapping("/{id}")
	public ResponseEntity<ResponseStructure<String>> deleteStudent(@PathVariable int id) {
		ResponseStructure<String> res = new ResponseStructure<>();

		res.setStatusCode(HttpStatus.OK.value()); // 200
		res.setMessage("Single deletion processing complete");
		res.setData(studentService.deleteStudentById(id));

		return new ResponseEntity<>(res, HttpStatus.OK);
	}

}

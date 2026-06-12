package com.PageFlow.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.PageFlow.entity.Student;
import com.PageFlow.exception.IdNotFoundException;
import com.PageFlow.exception.NoRecordAvailableException;
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

	// fetch all student
	public List<Student> getAllStudents() {
		List<Student> students = studentRepository.findAll();

		if (students.isEmpty()) {
			throw new NoRecordAvailableException("No students available");
		}

		return students;
	}

	// Fetch by id
	public Student findStudentById(int id) {
		return studentRepository.findById(id).orElseThrow(
				() -> new IdNotFoundException("Student with ID " + id + " does not exist in the library."));
	}

	// update
	public Student updateStudent(Integer id, Student student) {

		Student existingStudent = studentRepository.findById(id)
				.orElseThrow(() -> new IdNotFoundException("Student with ID " + id + " does not exist"));

		existingStudent.setName(student.getName());
		existingStudent.setEmail(student.getEmail());
		existingStudent.setPhone(student.getPhone());
		existingStudent.setRollNumber(student.getRollNumber());
		existingStudent.setDepartment(student.getDepartment());
		existingStudent.setBatch(student.getBatch());

		return studentRepository.save(existingStudent);
	}

	// Delete by ID
	public String deleteStudentById(Integer id) {
		Student student = studentRepository.findById(id).orElseThrow(
				() -> new IdNotFoundException("Student with ID " + id + " does not exist in the library."));
		studentRepository.delete(student);

		return "Student with ID " + id + " deleted successfully.";
	}

}

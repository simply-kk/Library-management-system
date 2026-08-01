package com.PageFlow.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.PageFlow.dto.CsvImportResponse;
import com.PageFlow.entity.Student;
import com.PageFlow.exception.IdNotFoundException;
import com.PageFlow.exception.NoRecordAvailableException;
import com.PageFlow.exception.StudentEmailAlreadyExistsException;
import com.PageFlow.exception.StudentRollNumberAlreadyExistsException;
import com.PageFlow.repository.StudentRepository;

@Service
public class StudentService {

	@Autowired
	private StudentRepository studentRepository;
	
	
	
	// validateStudent
	private void validateStudent(Student student) {
		if (studentRepository.existsByEmail(student.getEmail())) {
		    throw new StudentEmailAlreadyExistsException(
		            "Student with email " + student.getEmail() + " already exists.");
		}

		if (studentRepository.existsByRollNumber(student.getRollNumber())) {
		    throw new StudentRollNumberAlreadyExistsException(
		            "Student with roll number " + student.getRollNumber() + " already exists.");
		}
	}

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
	
	// import csv student file
		public CsvImportResponse importStudents(MultipartFile file) {
			// response structure
			CsvImportResponse response = new CsvImportResponse();

			response.setImportedCount(0);
			response.setSkippedCount(0);
			response.setErrors(new ArrayList<>());

			// 1. Validate uploaded file
			String fileName = file.getOriginalFilename();

			if (fileName == null || !fileName.toLowerCase().endsWith(".csv")) {
			    throw new IllegalArgumentException("Only CSV files are allowed.");
			}

			try (

					// 2. Read CSV file
					BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));

					// 3. Create CSV parser
					CSVParser csvParser = CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build()
							.parse(reader);

			) {

				// 4. Read every row
				for (CSVRecord record : csvParser) {

					try {

						// 5. Read values from current CSV row
						String name = record.get("name");
						String email = record.get("email");
						String phone = record.get("phone");
						String rollNumber = record.get("rollNumber");
						String department = record.get("department");
						String batch = record.get("batch");
						

						// 6. Create student object
						Student student = new Student();

						student.setName(name);
						student.setEmail(email);
						student.setPhone(phone);
						student.setRollNumber(rollNumber);
						student.setDepartment(department);
						student.setBatch(batch);

						// 7. Validate
						validateStudent(student);

						// 8. Save
						studentRepository.save(student);

						// Record imported successfully
						response.setImportedCount(response.getImportedCount() + 1);

					} catch (Exception e) {
						// Record could not be imported
						response.setSkippedCount(response.getSkippedCount() + 1);

						// Store error message
						response.getErrors().add("Row " + record.getRecordNumber() + " failed: " + e.getMessage());
					}
				}

			} catch (IOException e) {
				throw new RuntimeException("Failed to read CSV file.", e);
			}

			// 10. Return success message
			return response;
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

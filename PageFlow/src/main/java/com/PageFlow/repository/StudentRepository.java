package com.PageFlow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.PageFlow.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Integer> {

	boolean existsByEmail(String email);

	boolean existsByRollNumber(String rollNumber);
}
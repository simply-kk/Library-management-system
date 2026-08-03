package com.PageFlow.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.PageFlow.entity.IssueRecord;
import com.PageFlow.enums.IssueStatus;

public interface IssueRecordRepository extends JpaRepository<IssueRecord, Integer> {

    // Check if the student has already issued the same book
    boolean existsByStudentIdAndBookIdAndStatus(
            Integer studentId,
            Integer bookId,
            IssueStatus status
    );

    // Student issue history
    List<IssueRecord> findByStudentId(Integer studentId);

    // Book issue history
    List<IssueRecord> findByBookId(Integer bookId);

    // Due tomorrow
    List<IssueRecord> findByDueDateAndStatus(
            LocalDate dueDate,
            IssueStatus status
    );

    // Overdue books
    List<IssueRecord> findByDueDateBeforeAndStatus(
            LocalDate dueDate,
            IssueStatus status
    );
}


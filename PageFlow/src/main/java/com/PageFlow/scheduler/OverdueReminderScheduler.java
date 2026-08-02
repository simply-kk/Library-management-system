package com.PageFlow.scheduler;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.PageFlow.entity.Book;
import com.PageFlow.entity.IssueRecord;
import com.PageFlow.entity.Student;
import com.PageFlow.enums.IssueStatus;
import com.PageFlow.repository.IssueRecordRepository;
import com.PageFlow.service.EmailService;

@Component
public class OverdueReminderScheduler {

	@Autowired
	private IssueRecordRepository issueRecordRepository;

	@Autowired
	private EmailService emailService;

	// ===========================================================
	// Build Overdue Reminder Email
	// Creates a professional email informing the student that
	// the borrowed book is overdue.
	// ===========================================================
	private String buildOverdueReminderEmail(Student student, Book book, IssueRecord issueRecord) {

		// Calculate how many days the book is overdue
		long overdueDays = ChronoUnit.DAYS.between(issueRecord.getDueDate(), LocalDate.now());

		return """
				Hello %s,

				Our records indicate that the following book is overdue.

				Book Details:
				Title      : %s
				Author     : %s
				Issue Date : %s
				Due Date   : %s

				Your book is overdue by %d day(s).

				Please return it as soon as possible to avoid additional fines.

				Thank you,
				PageFlow Library Management System
				""".formatted(
				student.getName(),
				book.getTitle(),
				book.getAuthor(),
				issueRecord.getIssueDate(),
				issueRecord.getDueDate(),
				overdueDays);
	}

	// ===========================================================
	// Overdue Reminder Scheduler
	// Runs every day at 9:00 AM.
	//
	// Workflow:
	// 1. Find all overdue books (Due Date < Today).
	// 2. Filter only books that are still ISSUED.
	// 3. Send an overdue reminder email to each student.
	// ===========================================================
	@Scheduled(cron = "0 0 9 * * ?")
	public void sendOverdueReminder() {

		// Get today's date
		LocalDate today = LocalDate.now();

		// Fetch all overdue books that have not yet been returned
		List<IssueRecord> records =
				issueRecordRepository.findByDueDateBeforeAndStatus(
						today,
						IssueStatus.ISSUED);

		System.out.println("Found " + records.size() + " overdue book(s).");

		// Send reminder email to each student
		for (IssueRecord issueRecord : records) {

			try {

				Student student = issueRecord.getStudent();
				Book book = issueRecord.getBook();

				// Build email content
				String body = buildOverdueReminderEmail(
						student,
						book,
						issueRecord);

				// Send reminder email
				emailService.sendEmail(
						student.getEmail(),
						"Overdue Notice: Please Return Your Library Book",
						body);

				System.out.println("Overdue reminder sent to: " + student.getEmail());

			} catch (Exception e) {

				// Continue sending emails even if one email fails
				System.out.println(
						"Failed to send overdue reminder for IssueRecord ID: "
								+ issueRecord.getId());

				e.printStackTrace();
			}
		}

		System.out.println("Overdue reminder scheduler completed.");
	}
}
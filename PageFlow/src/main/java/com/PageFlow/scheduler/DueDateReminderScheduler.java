package com.PageFlow.scheduler;

import java.time.LocalDate;
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
public class DueDateReminderScheduler {

	@Autowired
	private IssueRecordRepository issueRecordRepository;

	@Autowired
	private EmailService emailService;

	// Build due date reminder email
	private String buildDueDateReminderEmail(Student student, Book book, IssueRecord issueRecord) {

		return """
				Hello %s,

				This is a friendly reminder that the following book is due tomorrow.

				Book Details:
				Title      : %s
				Author     : %s
				Issue Date : %s
				Due Date   : %s

				Please return the book on or before the due date to avoid overdue fines.

				If you have already returned the book, please ignore this email.

				Thank you,
				PageFlow Library Management System
				""".formatted(student.getName(), book.getTitle(), book.getAuthor(), issueRecord.getIssueDate(),
				issueRecord.getDueDate());
	}

	
	@Scheduled(cron = "0 0 9 * * ?")
	public void sendDueDateReminder() {

		LocalDate tomorrow = LocalDate.now().plusDays(1);

		List<IssueRecord> records = issueRecordRepository.findByDueDateAndStatus(tomorrow, IssueStatus.ISSUED);

		for (IssueRecord issueRecord : records) {

			Student student = issueRecord.getStudent();
			Book book = issueRecord.getBook();

			String body = buildDueDateReminderEmail(student, book, issueRecord);

			emailService.sendEmail(student.getEmail(), "Book Due Tomorrow", body);
		}
	}
	
	

}
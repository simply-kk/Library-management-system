package com.PageFlow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender mailSender;

	// Send a simple text email
	public void sendEmail(String to, String subject, String body) {

		// Create email message
		SimpleMailMessage message = new SimpleMailMessage();

		// Receiver's email
		message.setTo(to);

		// Email subject
		message.setSubject(subject);

		// Email body
		message.setText(body);

		// Send email
		mailSender.send(message);
	}
}
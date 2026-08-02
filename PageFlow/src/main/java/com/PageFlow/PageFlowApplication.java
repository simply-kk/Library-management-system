package com.PageFlow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class PageFlowApplication {

	public static void main(String[] args) {
		SpringApplication.run(PageFlowApplication.class, args);
		System.out.println("Hello bhai mai agaya");
	}

}

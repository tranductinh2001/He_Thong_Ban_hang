package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class QuanLyTourDuLichApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuanLyTourDuLichApplication.class, args);
	}

}

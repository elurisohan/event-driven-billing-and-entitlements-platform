package com.tracknote;

import lombok.Data;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@Data
public class TracknoteApplication {



	public static void main(String[] args) {
		SpringApplication.run(TracknoteApplication.class, args);
	}

}

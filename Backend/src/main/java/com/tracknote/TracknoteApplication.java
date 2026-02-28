package com.tracknote;

import lombok.Data;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Data
public class TracknoteApplication {



	public static void main(String[] args) {
		SpringApplication.run(TracknoteApplication.class, args);
	}

}

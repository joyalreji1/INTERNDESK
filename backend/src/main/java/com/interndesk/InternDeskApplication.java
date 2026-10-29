package com.interndesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class InternDeskApplication {
    public static void main(String[] args) {
        SpringApplication.run(InternDeskApplication.class, args);
    }
}

package com.campusfix.config;

import com.campusfix.model.Role;
import com.campusfix.model.User;
import com.campusfix.repository.UserRepository;
import com.campusfix.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryService categoryService;

    @Override
    public void run(String... args) {
        // Seed default categories
        categoryService.initDefaultCategories();

        // Seed admin user
        if (!userRepository.existsByEmail("admin@campusfix.com")) {
            userRepository.save(User.builder()
                    .name("Admin")
                    .email("admin@campusfix.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build());
            log.info("Admin user created: admin@campusfix.com / admin123");
        }

        // Seed technician
        if (!userRepository.existsByEmail("arun@campusfix.com")) {
            userRepository.save(User.builder()
                    .name("Arun Kumar")
                    .email("arun@campusfix.com")
                    .password(passwordEncoder.encode("tech123"))
                    .role(Role.TECHNICIAN)
                    .department("Maintenance")
                    .active(true)
                    .build());
            log.info("Technician created: arun@campusfix.com / tech123");
        }

        // Seed student
        if (!userRepository.existsByEmail("student@campusfix.com")) {
            userRepository.save(User.builder()
                    .name("Priya Student")
                    .email("student@campusfix.com")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .department("Computer Science")
                    .active(true)
                    .build());
            log.info("Student created: student@campusfix.com / student123");
        }
    }
}

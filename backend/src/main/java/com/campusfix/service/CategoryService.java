package com.campusfix.service;

import com.campusfix.model.Category;
import com.campusfix.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllActive() {
        return categoryRepository.findByActive(true);
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category create(String name, String description) {
        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Category already exists: " + name);
        }
        Category category = Category.builder()
                .name(name)
                .description(description)
                .active(true)
                .build();
        return categoryRepository.save(category);
    }

    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));
    }

    public void initDefaultCategories() {
        String[][] defaults = {
            {"Electrical", "Electrical issues like fans, lights, sockets"},
            {"Plumbing", "Water leakage, pipe issues, blocked drains"},
            {"Furniture", "Broken chairs, tables, cupboards"},
            {"IT / Network", "Wi-Fi, projector, computer issues"},
            {"Civil", "Walls, ceiling, flooring, doors, windows"},
            {"Housekeeping", "Cleaning, sanitation issues"},
            {"Other", "Any other maintenance issues"}
        };
        for (String[] cat : defaults) {
            if (!categoryRepository.existsByName(cat[0])) {
                categoryRepository.save(Category.builder()
                        .name(cat[0])
                        .description(cat[1])
                        .active(true)
                        .build());
            }
        }
    }
}

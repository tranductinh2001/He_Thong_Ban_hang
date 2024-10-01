package com.example.demo.service;

import com.example.demo.entity.Category;
import java.util.List;
import java.util.Optional;

public interface CategoryService {

    List<Category> getAllCategories();

    Optional<Category> getCategoryById(Long id);

    Category createCategory(Category category);

    Category updateCategory(Category category, Long id);

    void deleteCategory(Long id);
}

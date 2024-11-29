package com.example.demo.repository;

import com.example.demo.entity.ModelTryOnHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModelTryOnHistoryRepository extends JpaRepository<ModelTryOnHistory, Long> {
    ModelTryOnHistory findTryOnHistoryById(Long id);  // Phương thức tùy chỉnh
}
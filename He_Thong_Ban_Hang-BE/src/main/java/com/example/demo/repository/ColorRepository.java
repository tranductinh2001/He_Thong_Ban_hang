package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.Color;

@Repository
public interface ColorRepository extends JpaRepository<Color, Long> {
}

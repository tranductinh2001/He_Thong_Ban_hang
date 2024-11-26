package com.example.demo.controller;

import com.example.demo.entity.Color;
import com.example.demo.service.ColorService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/color")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ColorController {

    @Autowired
    private ColorService colorService;

    @GetMapping("/")
    @Operation(summary = "Lấy tất cả các màu sắc")
    public ResponseEntity<List<Color>> getAllColors() {
        List<Color> colors = colorService.getAllColors();
        return ResponseEntity.ok(colors);
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo mới màu sắc")
    public ResponseEntity<Color> createColor(@RequestBody Color color) {
        Color createdColor = colorService.createColor(color);
        return ResponseEntity.ok(createdColor);
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Cập nhật màu sắc")
    public ResponseEntity<Color> updateColor(@PathVariable Long id, @RequestBody Color color) {
        Color updatedColor = colorService.updateColor(color, id);
        return ResponseEntity.ok(updatedColor);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa màu sắc")
    public ResponseEntity<String> deleteColor(@PathVariable Long id) {
        colorService.deleteColor(id);
        return ResponseEntity.ok("Màu sắc đã được xóa");
    }
}

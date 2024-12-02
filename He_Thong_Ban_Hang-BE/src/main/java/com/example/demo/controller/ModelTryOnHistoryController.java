package com.example.demo.controller;

import com.example.demo.entity.ModelTryOnHistory;
import com.example.demo.service.ModelTryOnHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/model-try-on-history")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ModelTryOnHistoryController {

    @Autowired
    private ModelTryOnHistoryService modelTryOnHistoryService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Lấy tất cả các lịch sử thử đồ của người dùng theo userId")
    public ResponseEntity<List<ModelTryOnHistory>> getAllModelTryOnHistoriesByUserId(@PathVariable Long userId) {
        List<ModelTryOnHistory> modelTryOnHistories = modelTryOnHistoryService.getAllModelTryOnHistoriesByUserId(userId);
        return ResponseEntity.ok(modelTryOnHistories);
    }


    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa lịch sử thử đồ")
    public ResponseEntity<String> deleteModelTryOnHistory(@PathVariable Long id) {
        modelTryOnHistoryService.deleteModelTryOnHistory(id);
        return ResponseEntity.ok("Lịch sử thử đồ đã được xóa");
    }
}

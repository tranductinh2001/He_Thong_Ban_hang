package com.example.demo.controller;
import com.example.demo.entity.Size;
import com.example.demo.response.MessageResponse;
import com.example.demo.service.SizeService;
import com.example.demo.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/size")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SizeController {

    @Autowired
    private SizeService sizeService;

    @GetMapping("/")
    @Operation(summary = "Lấy danh sách tất cả kích thước")
    public ResponseEntity<List<Size>> getAllSizes() {
        List<Size> sizes = sizeService.getAllSizes();
        return ResponseEntity.ok(sizes);
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo mới một kích thước")
    public ResponseEntity<Size> createSize(@RequestBody Size size) {
        Size newSize = sizeService.createSize(size);
        return ResponseEntity.ok(newSize);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa kích thước theo ID")
    public ResponseEntity<MessageResponse> deleteSize(@PathVariable Long id) {
        sizeService.deleteSize(id);
        return ResponseEntity.ok(new MessageResponse("Kích thước đã được xóa"));
    }
}


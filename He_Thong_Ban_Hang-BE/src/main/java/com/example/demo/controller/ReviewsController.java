package com.example.demo.controller;
import com.example.demo.entity.Reviews;
import com.example.demo.entity.ServiceEntity;
import com.example.demo.response.MessageResponse;
import com.example.demo.service.ReviewsService;
import com.example.demo.service.ServiceService;
import com.example.demo.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReviewsController {

    @Autowired
    private ReviewsService reviewsService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả đánh giá")
    public ResponseEntity<List<Reviews>> getAllReviews() {
        List<Reviews> reviews = reviewsService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo mới một đánh giá")
    public ResponseEntity<Reviews> createReview(@RequestBody Reviews review) {
        Reviews newReview = reviewsService.createReview(review);
        return ResponseEntity.ok(newReview);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa đánh giá theo ID")
    public ResponseEntity<MessageResponse> deleteReview(@PathVariable Long id) {
        reviewsService.deleteReview(id);
        return ResponseEntity.ok(new MessageResponse("Đánh giá đã được xóa"));
    }
}

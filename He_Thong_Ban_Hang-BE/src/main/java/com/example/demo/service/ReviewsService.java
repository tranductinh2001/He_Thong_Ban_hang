package com.example.demo.service;

import com.example.demo.DTO.ReviewDTO;
import com.example.demo.entity.Reviews;
import java.util.List;
import java.util.Optional;

public interface ReviewsService {
    List<ReviewDTO> getReviewsByProductId(Long productId);

    List<Reviews> getAllReviews();

    Optional<Reviews> getReviewById(Long id);

    Reviews createReview(ReviewDTO review);

    Reviews updateReview(Reviews review, Long id);

    void deleteReview(Long id);
}

package com.example.demo.service;

import com.example.demo.entity.Reviews;
import java.util.List;
import java.util.Optional;

public interface ReviewsService {

    List<Reviews> getAllReviews();

    Optional<Reviews> getReviewById(Long id);

    Reviews createReview(Reviews review);

    Reviews updateReview(Reviews review, Long id);

    void deleteReview(Long id);
}

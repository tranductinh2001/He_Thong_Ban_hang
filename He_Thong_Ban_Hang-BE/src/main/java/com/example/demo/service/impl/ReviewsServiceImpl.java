package com.example.demo.service.impl;

import com.example.demo.entity.Reviews;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.ReviewsRepository;
import com.example.demo.service.ReviewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewsServiceImpl implements ReviewsService {

    @Autowired
    private ReviewsRepository reviewsRepository;

    @Override
    public List<Reviews> getAllReviews() {
        return reviewsRepository.findAll();
    }

    @Override
    public Optional<Reviews> getReviewById(Long id) {
        return Optional.ofNullable(reviewsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Review not found with id: " + id)));
    }

    @Override
    public Reviews createReview(Reviews review) {
        return reviewsRepository.save(review);
    }

    @Override
    public Reviews updateReview(Reviews review, Long id) {
        Reviews existingReview = getReviewById(id)
                .orElseThrow(() -> new NotFoundException("Review not found with id: " + id));
        //existingReview.setComment(review.getComment());
        return reviewsRepository.save(existingReview);
    }

    @Override
    public void deleteReview(Long id) {
        reviewsRepository.deleteById(id);
    }
}

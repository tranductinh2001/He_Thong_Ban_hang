package com.example.demo.service.impl;

import com.example.demo.DTO.ReviewDTO;
import com.example.demo.entity.Product;
import com.example.demo.entity.Reviews;
import com.example.demo.entity.User;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ReviewsRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ReviewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewsServiceImpl implements ReviewsService {

    @Autowired
    private ReviewsRepository reviewsRepository;
    @Autowired
    private ProductRepository ProductRepository;
    @Autowired
    private UserRepository UserRepository;

    @Override
    public List<ReviewDTO> getReviewsByProductId(Long productId) {
        List<Reviews> reviews = reviewsRepository.findByProduct_Id(productId);
        return reviews.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    private ReviewDTO convertToDTO(Reviews review) {
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setName(review.getName());
        reviewDTO.setDescription(review.getDescription());
        reviewDTO.setRating(review.getRating());
        reviewDTO.setProductId(review.getProduct().getId());
        return reviewDTO;
    }
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
    public Reviews createReview(ReviewDTO reviewDTO) {
        User user = UserRepository.getReferenceById(reviewDTO.getUserId());
        Product product = ProductRepository.getReferenceById(reviewDTO.getProductId());
        Reviews review = new Reviews();
        review.setName(reviewDTO.getName());
        review.setDescription(reviewDTO.getDescription());
        review.setRating(reviewDTO.getRating());
        review.setUser(user);
        review.setProduct(product);
        reviewsRepository.save(review);
        return review;
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

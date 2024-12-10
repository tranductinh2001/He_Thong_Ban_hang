package com.example.demo.service.impl;

import com.example.demo.entity.*;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.*;
import com.example.demo.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private StatisticsRepository statisticsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ReviewsRepository reviewsRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<Statistics> getAllStatistics() {
        return statisticsRepository.findAll();
    }

    @Override
    public Optional<Statistics> getStatisticsById(Long id) {
        return Optional.ofNullable(statisticsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Statistics not found with id: " + id)));
    }

    @Override
    public Statistics createStatistics(Statistics statistics) {
        return statisticsRepository.save(statistics);
    }

    @Override
    public Statistics updateStatistics(Statistics statistics, Long id) {
        Statistics existingStatistics = getStatisticsById(id)
                .orElseThrow(() -> new NotFoundException("Statistics not found with id: " + id));
        //existingStatistics.setViews(statistics.getViews());
        return statisticsRepository.save(existingStatistics);
    }

    @Override
    public Map<String, Object> getAllEntities() {
        Map<String, Object> response = new HashMap<>();

        List<User> users = userRepository.findAll();
        List<Product> products = productRepository.findAll();
        List<Brand> brands = brandRepository.findAll();
        List<Contact> contacts = contactRepository.findAll();
        List<Reviews> reviews = reviewsRepository.findAll();
        List<Order> orders = orderRepository.findAll();

        response.put("users", users);
        response.put("products", products);
        response.put("brands", brands);
        response.put("contacts", contacts);
        response.put("reviews", reviews);
        response.put("orders", orders);

        return response;
    }
    @Override
    public void deleteStatistics(Long id) {
        statisticsRepository.deleteById(id);
    }
}

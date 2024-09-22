package com.example.demo.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.demo.entity.Product;
import org.springframework.scheduling.annotation.Scheduled;
public class ProductService {
    List<Product> getListProduct();

    List<Product> getListProductByName(String name);

    List<Product> getListProductByPrice(long price);

    Optional<Product> getProductById(long id);

    Product findListProductByIdAndUserUsername(int id, String name);

    List<Product> findProductByIdDestinations(Long id);

    Product createProduct(CreateProductRequest body);

    Product updateProduct(CreateProductRequest body, Long id);

    void deleteProduct(Long id);

    Long count();

    Long sumAllPrice();

    List<Map<String, Object>> sumPriceOfDay(Long month, Long year);

    List<Map<String, Object>> sumPriceOfMonth(Long year);

    @Scheduled(fixedRate = 86400000)
    void deleteExpiredTickets();
}

package com.example.demo.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.demo.entity.Product;
import com.example.demo.request.CreateProductRequest;
import org.springframework.scheduling.annotation.Scheduled;
public interface ProductService {

    List<Product> findProductByCategoryId(Long categoryId);
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

    Map<String, Object> getProductsWithPagination(int currentPage, int pageSize);

    Map<String, Object> searchProducts(String keyword, int currentPage, int pageSize);

    Map<String, Object> getSaleProducts(int currentPage, int pageSize);
    Map<String, Object> getProductDetail(Long productId);
    Map<String, Object> filterProducts(String filterBy, String filterValue, int currentPage, int pageSize);
    Map<String, Object> sortProducts(String sortField, String sortDirection, int currentPage, int pageSize);

}

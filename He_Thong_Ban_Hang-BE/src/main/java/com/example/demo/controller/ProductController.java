package com.example.demo.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Product;
import com.example.demo.request.CreateProductRequest;
import com.example.demo.response.MessageResponse;
import com.example.demo.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/")
    public ResponseEntity<List<Product>> getAllProduct() {
        List<Product> products = productService.getListProduct();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search/name")
    public ResponseEntity<List<Product>> findAllProductByName(@RequestParam("keyword") String keyword) {
        List<Product> products = productService.getListProductByName(keyword);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search/price")
    public ResponseEntity<List<Product>> findAllProductByPrice(@RequestParam("keyword") Long keyword) {
        List<Product> products = productService.getListProductByPrice(keyword);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/productdetail")
    public ResponseEntity<Product> findProductById(@RequestParam("id") long id) {
        Optional<Product> productOptional = productService.getProductById(id);
        return productOptional.map(product -> ResponseEntity.ok(product))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/category")
    public ResponseEntity<List<Product>> findProductByCategoryId(@RequestParam("id") long id) {
        List<Product> products = productService.findProductByCategoryId(id);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/create")
    public ResponseEntity<Product> createProduct(@RequestBody CreateProductRequest body) {
        Product product = productService.createProduct(body);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Product> updateProduct(@RequestBody CreateProductRequest body, @PathVariable long id) {
        Product product = productService.updateProduct(body, id);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteProduct(@RequestParam("id") Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new MessageResponse("Sản phẩm đã được xóa"));
    }

    @GetMapping("/count")
    @Operation(summary = "Thống kê sản phẩm")
    public ResponseEntity<Long> countProducts() {
        Long count = productService.count();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/statistics")
    @Operation(summary = "Thống kê tổng doanh thu")
    public ResponseEntity<Long> sumAllPrice() {
        Long count = productService.sumAllPrice();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/statistics-day")
    public ResponseEntity<List<Map<String, Object>>> getDailyIncomeByMonthAndYear(
            @RequestParam("month") Long month,
            @RequestParam("year") Long year
    ) {
        List<Map<String, Object>> dailyIncomeList = productService.sumPriceOfDay(month, year);
        return ResponseEntity.ok(dailyIncomeList);
    }

    @GetMapping("/statistics-year")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyIncomeByYear(
            @RequestParam("year") Long year
    ) {
        List<Map<String, Object>> monthlyIncomeList = productService.sumPriceOfMonth(year);
        return ResponseEntity.ok(monthlyIncomeList);
    }
}

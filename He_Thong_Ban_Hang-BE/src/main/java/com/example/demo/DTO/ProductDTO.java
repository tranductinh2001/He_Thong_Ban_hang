package com.example.demo.DTO;

import com.example.demo.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private double price;
    private String description;
    private boolean isHot;
    private boolean isSale;
    private boolean isDeleted;

    public ProductDTO(Product product) {
    }
}

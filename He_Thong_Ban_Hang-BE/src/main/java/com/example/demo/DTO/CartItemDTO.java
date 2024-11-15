package com.example.demo.DTO;

import com.example.demo.entity.CartItem;
import com.example.demo.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    private Long id;
    private String size;
    private ProductDTO product;
    private int count;
    private Date createdAt;
}

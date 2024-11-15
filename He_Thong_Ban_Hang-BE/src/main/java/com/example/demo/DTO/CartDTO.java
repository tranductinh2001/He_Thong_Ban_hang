package com.example.demo.DTO;

import com.example.demo.entity.Cart;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDTO {
    private Long id;
    private int totalOfProduct;
    private double totalOfPrice;
    private List<CartItemDTO> items;
}

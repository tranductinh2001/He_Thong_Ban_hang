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

    public CartDTO(Cart cart) {
        this.id = cart.getId();
        this.totalOfProduct = cart.getTotalOfProduct();
        this.totalOfPrice = cart.getTotalOfPrice();
        this.items = cart.getItems().stream()
                .map(CartItemDTO::new)
                .collect(Collectors.toList());
    }
}

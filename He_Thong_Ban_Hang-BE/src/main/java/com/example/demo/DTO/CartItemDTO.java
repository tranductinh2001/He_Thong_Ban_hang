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
    private String size;
    private int count;
    private ProductDTO product;
    private Date createdAt;

    public CartItemDTO(CartItem cartItem) {
        this.size = cartItem.getSize();
        this.count = cartItem.getCount();
        this.product = new ProductDTO(cartItem.getProduct());
        this.createdAt = cartItem.getCreatedAt();

    }
}

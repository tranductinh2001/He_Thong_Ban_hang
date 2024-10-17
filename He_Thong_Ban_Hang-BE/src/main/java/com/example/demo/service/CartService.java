package com.example.demo.service;

import com.example.demo.entity.Cart;
import java.util.List;
import java.util.Optional;

public interface CartService {

    List<Cart> getAllCarts();

    Optional<Cart> getCartById(Long id);

    Cart createCart(Cart cart);

    Cart updateCart(Cart cart, Long id);

    void deleteCart(Long id);

    Cart getCartByUserId(Long userId) throws Exception;
    Cart updateCart( Cart newCart) throws Exception;
    Cart clearCart(Long cartId) throws Exception;
    Cart getCartByUser();

}

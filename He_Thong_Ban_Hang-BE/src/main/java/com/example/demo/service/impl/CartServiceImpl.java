package com.example.demo.service.impl;

import com.example.demo.entity.Cart;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.CartRepository;
import com.example.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Override
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    @Override
    public Optional<Cart> getCartById(Long id) {
        return Optional.ofNullable(cartRepository.findById(id).orElseThrow(() -> new NotFoundException("Cart not found with id: " + id)));
    }

    @Override
    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    @Override
    public Cart updateCart(Cart cart, Long id) {
        Cart existingCart = getCartById(id).orElseThrow(() -> new NotFoundException("Cart not found with id: " + id));
        // Update fields here
        return cartRepository.save(existingCart);
    }

    @Override
    public void deleteCart(Long id) {
        cartRepository.deleteById(id);
    }
}

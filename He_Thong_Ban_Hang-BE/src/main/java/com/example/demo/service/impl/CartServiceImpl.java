package com.example.demo.service.impl;

import com.example.demo.entity.Cart;
import com.example.demo.entity.User;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Cart getCartByUserId(Long userId) throws Exception {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return userOpt.get().getCart();
        } else {
            throw new Exception("User not found!");
        }
    }

    @Override
    public Cart updateCart(Long userId, Cart newCart) throws Exception {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new Exception("User not found!");
        }

        User user = userOpt.get();
        Cart currentCart = user.getCart();
        if (currentCart == null) {
            throw new Exception("Cart not found!");
        }

        currentCart.setTotalOfProduct(newCart.getTotalOfProduct());
        currentCart.setTotalOfPrice(newCart.getTotalOfPrice());
        currentCart.setItems(newCart.getItems());

        return cartRepository.save(currentCart);
    }

    @Override
    public Cart clearCart(Long cartId) throws Exception {
        Optional<Cart> cartOpt = cartRepository.findById(cartId);
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            cart.setTotalOfProduct(0);
            cart.setTotalOfPrice(0.0);
            cart.getItems().clear();

            return cartRepository.save(cart);
        } else {
            throw new Exception("Cart not found!");
        }
    }

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

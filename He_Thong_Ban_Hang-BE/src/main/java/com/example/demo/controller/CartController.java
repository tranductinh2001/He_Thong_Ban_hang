package com.example.demo.controller;

import com.example.demo.entity.Cart;
import com.example.demo.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/")
    public ResponseEntity<Cart> getCartByUserId(@RequestParam("userId") Long userId) {
        try {
            Cart cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCart(@RequestParam("userId") Long userId, @RequestBody Cart cart) {
        try {
            Cart updatedCart = cartService.updateCart(userId, cart);
            return ResponseEntity.ok(updatedCart);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating cart: " + e.getMessage());
        }
    }

    @PostMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestParam("cartId") Long cartId) {
        try {
            Cart clearedCart = cartService.clearCart(cartId);
            return ResponseEntity.ok("Cart cleared successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error clearing cart: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    @Operation(summary = "Lấy tất cả giỏ hàng")
    public ResponseEntity<List<Cart>> getAllCarts() {
        List<Cart> carts = cartService.getAllCarts();
        return ResponseEntity.ok(carts);
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo mới giỏ hàng")
    public ResponseEntity<Cart> createCart(@RequestBody Cart cart) {
        Cart createdCart = cartService.createCart(cart);
        return ResponseEntity.ok(createdCart);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa giỏ hàng")
    public ResponseEntity<String> deleteCart(@PathVariable Long id) {
        cartService.deleteCart(id);
        return ResponseEntity.ok("Giỏ hàng đã được xóa");
    }
}

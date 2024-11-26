package com.example.demo.controller;

import com.example.demo.DTO.CartDTO;
import com.example.demo.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/my-cart")
    public ResponseEntity<?> getCartByUser() {
        try {
            CartDTO cartDTO = cartService.getCartDtoByUser(); // Chuyển sang DTO
            return ResponseEntity.ok(cartDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCart(@RequestBody CartDTO cartDTO) {
        try {
            CartDTO updatedCartDTO = cartService.updateCart(cartDTO); // Nhận DTO
            return ResponseEntity.ok(updatedCartDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating cart: " + e.getMessage());
        }
    }

    @PostMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestParam("cartId") Long cartId) {
        try {
            cartService.clearCart(cartId); // Không cần trả về DTO cho clear
            return ResponseEntity.ok("Cart cleared successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error clearing cart: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    @Operation(summary = "Lấy tất cả giỏ hàng")
    public ResponseEntity<List<CartDTO>> getAllCarts() {
        List<CartDTO> cartDTOs = cartService.getAllCartDtos(); // Chuyển sang DTO
        return ResponseEntity.ok(cartDTOs);
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo mới giỏ hàng")
    public ResponseEntity<CartDTO> createCart(@RequestBody CartDTO cartDTO) {
        CartDTO createdCartDTO = cartService.createCart(cartDTO); // Nhận DTO và trả về DTO
        return ResponseEntity.ok(createdCartDTO);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa giỏ hàng")
    public ResponseEntity<String> deleteCart(@PathVariable Long id) {
        cartService.deleteCart(id);
        return ResponseEntity.ok("Giỏ hàng đã được xóa");
    }
}

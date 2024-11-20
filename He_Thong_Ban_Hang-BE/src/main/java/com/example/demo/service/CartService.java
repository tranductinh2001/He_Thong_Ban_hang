package com.example.demo.service;

import com.example.demo.DTO.CartDTO;
import com.example.demo.entity.Cart;

import java.util.List;
import java.util.Optional;

public interface CartService {
    Cart getCartByUser(Long userId);

    List<CartDTO> getAllCartDtos();  // Trả về danh sách CartDTO

    Optional<CartDTO> getCartDtoById(Long id);  // Lấy CartDTO theo id

    CartDTO createCart(CartDTO cartDTO);  // Tạo CartDTO mới

    void deleteCart(Long id);  // Xóa Cart theo id

    CartDTO getCartDtoByUserId(Long userId) throws Exception;  // Lấy CartDTO theo userId

    CartDTO updateCart(CartDTO cartDTO) throws Exception;  // Cập nhật Cart theo DTO

    CartDTO clearCart(Long cartId) throws Exception;  // Xóa toàn bộ sản phẩm trong giỏ hàng

    CartDTO getCartDtoByUser();  // Lấy giỏ hàng của user hiện tại

}

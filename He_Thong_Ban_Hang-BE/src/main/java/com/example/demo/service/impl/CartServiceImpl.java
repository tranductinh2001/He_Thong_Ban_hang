package com.example.demo.service.impl;

import com.example.demo.DTO.CartDTO;
import com.example.demo.DTO.CartItemDTO;
import com.example.demo.entity.Cart;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.User;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CartService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;


    public Cart getCartByUser(Long userId) {
        // Tìm người dùng theo userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy Cart từ User
        Cart cart = user.getCart();

        if (cart == null) {
            throw new RuntimeException("Cart not found for user with id " + userId);
        }

        return cart;
    }

    @Override
    public Optional<CartDTO> getCartDtoById(Long id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cart not found with id: " + id));

        return Optional.ofNullable(modelMapper.map(cart, CartDTO.class));
    }


    @Override
    public CartDTO getCartDtoByUser() {
        String username = getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = user.getCart();
        if (cart == null) {
//            cart = new Cart();
//            user.setCart(cart);
//            userRepository.save(user);
//            cartRepository.save(cart);
            return null;
        }

        return modelMapper.map(cart, CartDTO.class);
    }


    @Override
    public CartDTO updateCart(CartDTO cartDTO) {
        // Lấy username của người dùng
        String username = getCurrentUsername();

        // Lấy user từ database và kiểm tra sự tồn tại
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy cart hiện tại của user
        Cart currentCart = user.getCart();
        if (currentCart == null) {
            currentCart = new Cart();
        }

        // Cập nhật các trường cơ bản của cart từ DTO
        currentCart.setTotalOfPrice(cartDTO.getTotalOfPrice());
        currentCart.setTotalOfProduct(cartDTO.getTotalOfProduct());
        user.setCart(currentCart);  // Liên kết cart với user

        // Ghi đè toàn bộ danh sách items bằng danh sách mới từ DTO
        currentCart.getItems().clear();  // Xóa các items hiện tại
        for (CartItemDTO newItemDTO : cartDTO.getItems()) {
            CartItem newItem = modelMapper.map(newItemDTO, CartItem.class);
            newItem.setCart(currentCart); // Liên kết lại với Cart hiện tại
            newItem.setCreatedAt(new Date());
            currentCart.getItems().add(newItem);
        }

        // Lưu lại cart đã cập nhật
        cartRepository.save(currentCart);

        return modelMapper.map(currentCart, CartDTO.class);
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("User not authenticated");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userDetails.getUsername();
    }


    @Override
    public CartDTO createCart(CartDTO cartDTO) {
        Cart cart = modelMapper.map(cartDTO, Cart.class); // Chuyển từ DTO sang entity Cart
        Cart savedCart = cartRepository.save(cart);
        return modelMapper.map(savedCart, CartDTO.class); // Trả về DTO
    }

    @Override
    public List<CartDTO> getAllCartDtos() {
        return cartRepository.findAll().stream()
                .map(cart -> modelMapper.map(cart, CartDTO.class))
                .collect(Collectors.toList()); // Trả về danh sách DTO
    }

    @Override
    public void deleteCart(Long id) {
        cartRepository.deleteById(id);
    }

    @Override
    public CartDTO getCartDtoByUserId(Long userId) throws Exception {
        return null;
    }

    @Override
    public CartDTO clearCart(Long cartId) throws Exception {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new NotFoundException("Cart not found"));

        cart.setTotalOfProduct(0);
        cart.setTotalOfPrice(0.0);
        cart.getItems().clear();

        cartRepository.save(cart);
        return modelMapper.map(cart, CartDTO.class); // Trả về DTO
    }
}

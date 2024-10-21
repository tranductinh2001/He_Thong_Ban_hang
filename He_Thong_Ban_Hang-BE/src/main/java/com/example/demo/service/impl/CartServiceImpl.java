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

    @Override
    public Optional<CartDTO> getCartDtoById(Long id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cart not found with id: " + id));

        return Optional.ofNullable(modelMapper.map(cart, CartDTO.class));
    }


    @Override
    public CartDTO getCartDtoByUser() {
        // Lấy thông tin xác thực từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("User not authenticated");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = user.getCart();
        if (cart == null) {
            cart = new Cart();
            user.setCart(cart);
            userRepository.save(user);
            cartRepository.save(cart);
        }

        return modelMapper.map(cart, CartDTO.class);
    }

    @Override
    public CartDTO updateCart(CartDTO cartDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("User not authenticated");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart currentCart = user.getCart();
        if (currentCart == null) {
            throw new RuntimeException("Cart not found for the user");
        }

        // Lấy danh sách các CartItem hiện tại
        List<CartItem> currentItems = currentCart.getItems();

        // Cập nhật danh sách CartItem từ DTO
        List<CartItemDTO> newItemsDTO = cartDTO.getItems();

        // Xử lý thêm hoặc cập nhật CartItem
        for (CartItemDTO newItemDTO : newItemsDTO) {
            boolean found = false;

            // Kiểm tra xem CartItem đã tồn tại chưa, nếu có thì cập nhật
            for (CartItem currentItem : currentItems) {
                if (currentItem.getId() != null && currentItem.getId().equals(newItemDTO.getId())) {
                    modelMapper.map(newItemDTO, currentItem);
                    found = true;
                    break;
                }
            }

            // Nếu CartItem không tồn tại, tạo mới và thêm vào danh sách
            if (!found) {
                CartItem newItem = modelMapper.map(newItemDTO, CartItem.class);
                newItem.setCart(currentCart); // Thiết lập liên kết với Cart
                currentItems.add(newItem);
            }
        }

        // Xử lý xóa các CartItem không còn trong danh sách DTO
        currentItems.removeIf(item -> item.getId() != null && newItemsDTO.stream()
                .noneMatch(newItemDTO -> newItemDTO.getId().equals(item.getId())));

        // Lưu cart và user
        cartRepository.save(currentCart);
        userRepository.save(user);

        return modelMapper.map(currentCart, CartDTO.class);
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

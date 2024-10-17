package com.example.demo.service.impl;

import com.example.demo.entity.Cart;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Cart getCartByUser() {
        // Lấy thông tin xác thực từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra xem người dùng đã được xác thực hay chưa
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("User not authenticated");
        }

        // Lấy tên người dùng từ token
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        // Tìm người dùng theo tên trong cơ sở dữ liệu
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra xem người dùng đã có giỏ hàng hay chưa, nếu không có thì tạo mới
        Cart cart = user.getCart();
        if (cart == null) {
            cart = new Cart(); // Tạo đối tượng Cart mới
            user.setCart(cart); // Liên kết Cart với User
            userRepository.save(user); // Lưu thông tin user với giỏ hàng mới
            cartRepository.save(cart); // Lưu giỏ hàng mới vào cơ sở dữ liệu
        }
System.out.println("cart của user nè "+ cart);
        // Trả về giỏ hàng của người dùng
        return cart;
    }
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
    public Cart updateCart(Cart newCart) throws Exception {
        // Lấy thông tin xác thực từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra xem người dùng đã được xác thực hay chưa
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("User not authenticated");
        }

        // Lấy tên người dùng từ token
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        // Tìm người dùng theo tên trong cơ sở dữ liệu
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy giỏ hàng của người dùng hoặc tạo giỏ hàng mới nếu không tồn tại
        Cart currentCart = user.getCart();
        if (currentCart == null) {
            // Nếu giỏ hàng chưa tồn tại, tạo giỏ hàng mới
            currentCart = new Cart();
            user.setCart(currentCart); // Liên kết giỏ hàng với người dùng
        }

        // Cập nhật giỏ hàng với thông tin mới
        currentCart.setTotalOfProduct(newCart.getTotalOfProduct());
        currentCart.setTotalOfPrice(newCart.getTotalOfPrice());

        // Cập nhật từng phần tử trong danh sách items thay vì thay thế toàn bộ danh sách
        List<CartItem> currentItems = currentCart.getItems();
        currentItems.clear(); // Xóa các items hiện có, nhưng giữ lại tham chiếu danh sách

        for (CartItem item : newCart.getItems()) {
            // Nếu sản phẩm chưa được lưu, hãy kiểm tra hoặc lưu nó
            Product product = item.getProduct();
            if (product.getId() == null) {
                throw new RuntimeException("Product must be saved before adding to cart");
            }
            // Liên kết lại CartItem với giỏ hàng hiện tại
            item.setCart(currentCart);
            currentItems.add(item); // Thêm item vào danh sách hiện có
        }

        // Lưu giỏ hàng và cập nhật người dùng
        cartRepository.save(currentCart);
        userRepository.save(user);

        return currentCart;
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

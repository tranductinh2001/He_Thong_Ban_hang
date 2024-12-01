package com.example.demo.service.impl;

import java.util.*;
import java.text.DecimalFormat;

import com.example.demo.repository.SizeRepository;
import com.example.demo.service.*;
import jakarta.mail.MessagingException;

import com.example.demo.DTO.*;
import com.example.demo.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.demo.controller.WebhookController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ClientServiceImpl implements ClientService {

    @Autowired
    private MailService mailService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private SizeService sizeService;

    @Autowired
    private SizeRepository SizeRepository;

    @Autowired
    private WebhookController webhookController;

    private String codeCurrency;

    // Lấy thời gian hiện tại
    LocalDateTime currentTime = LocalDateTime.now();

    // Định dạng thời gian nếu cần
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    String formattedTime = currentTime.format(formatter);

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("User not authenticated");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userDetails.getUsername();
    }

    // Phương thức định dạng dữ liệu giỏ hàng
    public List<Map<String, Object>> formatCartData(List<CartItemDTO> cartItems) {
        DecimalFormat decimalFormat = new DecimalFormat("#,###");

        List<Map<String, Object>> formattedCartItems = new ArrayList<>();

        // Duyệt qua từng CartItemDTO trong danh sách giỏ hàng
        for (CartItemDTO item : cartItems) {
            ProductDTO product = item.getProduct();

            // Tạo một Map chứa thông tin đã format cho mỗi item trong giỏ hàng
            Map<String, Object> formattedItem = new HashMap<>();
            formattedItem.put("id", item.getId());
            formattedItem.put("size", item.getSize());
            formattedItem.put("count", item.getCount());
            formattedItem.put("createdAt", item.getCreatedAt());

            //duệt qua product lay sizeListdde cap nhat
            List<SizeDTO> sizes = product.getSizeList();
            for (SizeDTO itemSizeDTO : sizes) {
                if (item.getSize().equals(itemSizeDTO.getSizeName())) {
                    // Tìm Size entity từ database theo ID của Size
                    Size sizeEntity = SizeRepository.findById(itemSizeDTO.getId())
                            .orElseThrow(() -> new RuntimeException("Size not found for product: " + product.getName()));

//                    System.out.println("sizeEntity.getQuantity() id: " + itemSizeDTO.getId() + " số lượng trong DB: " + sizeEntity.getQuantity() + " itemSizeDTO.getQuantity() cần trừ: " + item.getCount());

                    // Trừ số lượng tương ứng
                    int newQuantity = sizeEntity.getQuantity() - item.getCount();
                    if (newQuantity < 0) {
                        throw new RuntimeException("Not enough stock for size: " + sizeEntity.getSizeName());
                    }

                    // Cập nhật số lượng mới
                    sizeEntity.setQuantity(newQuantity);

                    // Lưu lại cập nhật
                    SizeRepository.save(sizeEntity);

                    // Sau khi đã cập nhật cho size của giỏ hàng thì có thể break ra khỏi vòng lặp sizeList
                    break;
                }
            }

            // Định dạng thông tin sản phẩm
            Map<String, Object> formattedProduct = new HashMap<>();
            formattedProduct.put("name", product.getName());
            formattedProduct.put("price", decimalFormat.format(product.getPrice()));

            // Định dạng tổng tiền cho item
            String formattedTotal = decimalFormat.format(product.getPrice() * item.getCount());

            // Thêm thông tin sản phẩm vào item
            formattedItem.put("product", formattedProduct);
            formattedItem.put("formattedTotal", formattedTotal);

            // Thêm item đã được định dạng vào danh sách
            formattedCartItems.add(formattedItem);
        }

        return formattedCartItems;
    }

    @Override
    public Boolean create(ClientSendMailRequest sdi) {
        System.out.println("Dữ liệu nhận được ClientSendMailRequest: " + sdi);

        if (sdi == null) {
            log.error("Request data (ClientSendMailRequest) is null.");
            return false;
        }

        try {
            // Định dạng tổng giá trị
            double total = sdi.getTotalOfPrice();
            DecimalFormat decimalFormat = new DecimalFormat("#,###");
            String formattedTotal = decimalFormat.format(total);

            // Định dạng dữ liệu giỏ hàng
            List<Map<String, Object>> formattedCartItems = formatCartData(sdi.getCart());
            System.out.println("Định dạng giỏ hàng: " + formattedCartItems);


            // Tạo đối tượng Mail
            Mail dataMail = new Mail();
            // Lưu mã xác thực cho người dùng
            userService.saveAuthenticationCodeForUser();
            codeCurrency = userService.getAuthenticationCodeForUser(getCurrentUsername());

            dataMail.setTo(sdi.getEmail());
            dataMail.setSubject("XÁC NHẬN ĐƠN HÀNG CỦA BẠN");

            Map<String, Object> props = new HashMap<>();
            props.put("name", sdi.getName());
            props.put("username", getCurrentUsername());
            props.put("time", new Date());
            props.put("specialRequest", sdi.getNotes());
            props.put("listCart", formattedCartItems);
            props.put("total", formattedTotal);
            props.put("code", codeCurrency);
            props.put("Notes", sdi.getNotes());
            props.put("OrderAddress", sdi.getOrderAddress());
            props.put("NumberPhone", sdi.getNumberPhone());

            dataMail.setProps(props);

            // Tạo đơn hàng
            User currentUser = userService.findByUsername(getCurrentUsername());
            if (currentUser == null || currentUser.getCart() == null) {
                log.error("Không tìm thấy user hoặc cart.");
                return false;
            }

            Cart cart = currentUser.getCart();
            Order order = new Order();
            order.setTotalOfPrice(total);
            order.setNumberPhone(sdi.getNumberPhone());
            order.setEmail(sdi.getEmail());
            order.setStatus(OrderStatus.PENDING); // Trạng thái mặc định
            order.setDeleted(false);
            order.setNotes(sdi.getNotes());
            order.setOrderAddress(sdi.getOrderAddress());
            order.setNotes(sdi.getNotes());
            order.setCreatedAt(new Date());
            order.setExpiresAt(new Date()); // Có thể thay đổi thời gian hết hạn nếu cần
            order.setCart(cart);
            order.setVerificationCode(userService.getAuthenticationCodeForUser(getCurrentUsername()));
            // Xử lý sản phẩm từ giỏ hàng
            List<CartItem> cartItems = cart.getItems();
            if (cartItems != null && !cartItems.isEmpty()) {
                List<Product> products = new ArrayList<>();
                for (CartItem cartItem : cartItems) {
                    products.add(cartItem.getProduct());
                }
                order.setProducts(products);
            } else {
                log.warn("Giỏ hàng trống.");
            }

            order.setUser(currentUser);

            // Lưu đơn hàng
            orderService.createOrder(order);

            // Gửi email
            mailService.sendHtmlMail(dataMail, "client");
            log.info("Đã gửi email xác nhận đơn hàng cho: {}", sdi.getEmail());
            return true;

        } catch (MessagingException exp) {
            log.error("Lỗi trong quá trình gửi email: {}", exp.getMessage(), exp);
        } catch (Exception e) {
            log.error("Lỗi bất ngờ: {}", e.getMessage(), e);
        }
        return false;
    }

//    public Boolean create(ClientSendMailRequest sdi) {
//        System.out.println("data   ClientSendMailRequest : " + sdi);
//
//        // Đưa giá trị đã định dạng vào props
//        if (sdi == null) {
//            log.error("Request data (ClientSendMailRequest) is null.");
//            return false;
//        }
//        // Định dạng tổng giá trị
//        double total = sdi.getTotalOfPrice();
//        DecimalFormat decimalFormat = new DecimalFormat("#,###"); // Định dạng với dấu phân cách hàng nghìn
//        String formattedTotal = decimalFormat.format(total);
//
//        // Định dạng dữ liệu giỏ hàng
//        List<Map<String, Object>> formattedCartItems = formatCartData(sdi.getCart());
//
//        System.out.println("formattedCartItems: " + formattedCartItems);
//
//        try {
//            // Gửi dữ liệu qua Webhook
//            webhookController.PigdtaMail(sdi);
//
//            // Lưu mã xác thực cho người dùng
//            userService.saveAuthenticationCodeForUser();
//            codeCurrency = userService.getAuthenticationCodeForUser(getCurrentUsername());
//
//            // Cấu hình nội dung email
//            Mail dataMail = new Mail();
//            dataMail.setTo(sdi.getEmail());
//            dataMail.setSubject("XÁC NHẬN TẠO MỚI THÔNG TIN NGƯỜI DÙNG");
//
//            Map<String, Object> props = new HashMap<>();
//            props.put("name", sdi.getName());
//            props.put("username", getCurrentUsername());
//            props.put("time", formattedTime);
//            props.put("specialRequest", sdi.getNotes());
//            props.put("listCart", formattedCartItems);
//            props.put("total", formattedTotal);
//            props.put("code", codeCurrency);
//            props.put("Notes", sdi.getNotes());
//            props.put("OrderAddress", sdi.getOrderAddress());
//            props.put("NumberPhone", sdi.getNumberPhone());
//
//            dataMail.setProps(props);
//
//            //tạo order
//            Order order = new Order();
//            order.setTotalOfPrice(amount);
//            order.setNumberPhone(phone);
//            order.setEmail(firstUser.getEmail());
//            order.setStatus(OrderStatus.PAID); // Trạng thái thanh toán thành công
//            order.setDeleted(false);
//            order.setOrderAddress(orderAddress);
//            order.setNotes("Thanh toán thành công");
//            order.setCreatedAt(new Date());
//            order.setExpiresAt(new Date());
//
//            Cart cart = firstUser.getCart();
//            order.setCart(cart);
//
//            List<CartItem> cartItems = cart.getItems();
//            if (cartItems != null && !cartItems.isEmpty()) {
//                List<Product> products = new ArrayList<>();
//                for (CartItem cartItem : cartItems) {
//                    products.add(cartItem.getProduct());
//                }
//                order.setProduct(products);
//            } else {
//                System.out.println("Giỏ hàng không có sản phẩm!");
//            }
//
//            order.setUser(firstUser);
//            orderService.createOrder(order)
//
//            // Gửi email
//            mailService.sendHtmlMail(dataMail, "client");
//            return true;
//        } catch (MessagingException exp) {
//            log.error("Error while sending email: {}", exp.getMessage(), exp);
//        } catch (Exception e) {
//            log.error("Unexpected error: {}", e.getMessage(), e);
//        }
//        return false;
//    }
}

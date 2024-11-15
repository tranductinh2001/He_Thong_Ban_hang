package com.example.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {

    private Long id;
    private double totalOfPrice;
    private String numberPhone;
    private String email;
    private String status;  // Trả về dạng chuỗi để dễ dàng hiển thị
    private boolean isDeleted;
    private String orderAddress;
    private String notes;
    private String paymentUrl;
    private Date createdAt;
    private Date expiresAt;

    // Lấy thông tin cần thiết của Cart và User
    private Long cartId;
    private Long userId;
    private String username;

    // Danh sách sản phẩm
    private List<ProductDTO> products;
}

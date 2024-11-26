package com.example.demo.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientSendMailRequest {
    private String email;           // Email người dùng
    private String notes;           // Ghi chú đặc biệt
    private String numberPhone;     // Số điện thoại
    private String orderAddress;    // Địa chỉ đặt hàng
    private List<CartItemDTO> cart; // Danh sách sản phẩm trong giỏ hàng
    private long totalOfPrice;
private  String name;

}

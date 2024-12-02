package com.example.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientSendMailContactAuto {
    private String email;           // Email người dùng
    private String notes;           // Ghi chú đặc biệt
    private String numberPhone;     // Số điện thoại
    private  String fullname;
}

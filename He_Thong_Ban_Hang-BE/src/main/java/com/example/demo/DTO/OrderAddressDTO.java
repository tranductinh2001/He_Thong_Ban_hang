package com.example.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderAddressDTO {

    private Long id;
    private String name;
    private String address;
    private Boolean isDefault;
    private Boolean isDeleted;
    private Date createdAt;
    private Date updatedAt;

    // Chỉ lấy thông tin cần thiết của User, ví dụ: id và username
    private Long userId;
    private String username;
}

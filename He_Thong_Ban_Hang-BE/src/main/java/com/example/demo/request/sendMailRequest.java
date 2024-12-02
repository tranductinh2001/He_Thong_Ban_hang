package com.example.demo.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class sendMailRequest {
    private String email;         // Email người nhận
    private String fullName;      // Tên đầy đủ của người nhận
    private String notes;         // Ghi chú hoặc nội dung
    private String numberPhone;
}

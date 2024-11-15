package com.example.demo.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SizeRequest {

    private String sizeName; // Tên size (S, M, L, XL,...)

    private int quantity; // Số lượng sản phẩm của size này
}

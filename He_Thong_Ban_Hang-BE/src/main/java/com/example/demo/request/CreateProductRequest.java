package com.example.demo.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateProductRequest {
    private String name;

    private double price;

    private Double salePrice;

    private String description;

    private boolean isHot;

    private boolean isSale;

    private boolean isDeleted;

    private boolean status;

    private Date createdAt;

    private Date updatedAt;

    private Long brandId;

    private Long categoryId;

    private List<Long> images; // Danh sách ID của hình ảnh

    private List<Long> colors; // Danh sách ID của màu sắc

    private List<SizeRequest> sizes; // Danh sách size và số lượng của sản phẩm
}

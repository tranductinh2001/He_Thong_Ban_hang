package com.example.demo.DTO;

import com.example.demo.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private boolean status;
    private String name;
    private double price;
    private String description;
    private Double salePrice;
    private boolean isHot;
    private boolean isSale;
    private boolean isDeleted;
    private List<ImageDTO> images;
    private List<SizeDTO> sizeList;
    private List<ColorDTO> colors;
}

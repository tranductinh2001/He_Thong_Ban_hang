package com.example.demo.DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SizeDTO {
    private Long id;
    private String sizeName;
    private int quantity;
}

package com.example.demo.entity;

import com.example.demo.DTO.CartItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_of_product", nullable = false)
    private int totalOfProduct;

    @Column(name = "total_of_price", nullable = false)
    private double totalOfPrice;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id") // Liên kết với bảng CartItems
    private List<CartItem> items = new ArrayList<>();
}

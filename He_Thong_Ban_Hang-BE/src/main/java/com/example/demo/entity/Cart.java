package com.example.demo.entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cart")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_of_product", nullable = false)
    private int totalOfProduct = 0;

    @Column(name = "total_of_price", nullable = false)
    private double totalOfPrice = 0;

    // Thay đổi kiểu từ CartItem thành List<CartItem>
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "cart_id")
    private List<CartItem> items;
}

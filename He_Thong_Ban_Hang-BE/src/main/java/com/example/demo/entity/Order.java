package com.example.demo.entity;

import java.util.Date;
import java.util.List;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor


@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_of_price", nullable = false)
    private double totalOfPrice;

    @Column(name = "number_phone", nullable = false)
    private String numberPhone;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @Column(name = "order_address")
    private String orderAddress;

    @Column(name = "notes")
    private String notes = "";

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

    @Column(name = "expires_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiresAt;

    @ManyToMany
    @JoinColumn(name = "Product_id")
    private List<Product> product;

    @Column(name = "verification_code", length = 64)
    private String verificationCode;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

package com.example.demo.entity;

import javax.persistence.*;

@Entity
@Table(name = "sizes")
public class Size {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "size_name", nullable = false)
    private String sizeName;

    @Column(name = "quantity", nullable = false)
    private int quantity;
}

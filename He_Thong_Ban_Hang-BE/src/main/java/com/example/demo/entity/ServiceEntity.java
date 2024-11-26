package com.example.demo.entity;

import jakarta.persistence.*;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "service")
public class ServiceEntity {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @Column(name = "description",columnDefinition = "TEXT")
    private String description;

    private long price;
    
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}

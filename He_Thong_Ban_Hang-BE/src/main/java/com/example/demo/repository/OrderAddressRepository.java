package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.OrderAddress;

@Repository
public interface OrderAddressRepository extends JpaRepository<OrderAddress, Long> {
}

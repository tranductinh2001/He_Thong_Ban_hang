package com.example.demo.service;

import com.example.demo.DTO.OrderAddressDTO;
import com.example.demo.entity.OrderAddress;

import java.util.List;

public interface OrderAddressService {
    OrderAddress createOrderAddress(OrderAddressDTO orderAddress);
    List<OrderAddress> getAllOrderAddressByUserId(Long userId);

    List<OrderAddress> setDefaultOrderAddress(Long id);
}

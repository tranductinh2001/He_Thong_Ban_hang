package com.example.demo.service;

import com.example.demo.entity.Order;
import java.util.List;
import java.util.Optional;

public interface OrderService {

    List<Order> getAllOrders();

    Optional<Order> getOrderById(Long id);

    Order createOrder(Order order);

    Order updateOrder(Order order, Long id);

    void deleteOrder(Long id);
}

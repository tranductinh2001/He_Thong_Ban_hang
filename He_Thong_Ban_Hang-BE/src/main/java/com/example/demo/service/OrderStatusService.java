package com.example.demo.service;

import com.example.demo.entity.OrderStatus;
import java.util.List;
import java.util.Optional;

public interface OrderStatusService {

    List<OrderStatus> getAllOrderStatuses();

    Optional<OrderStatus> getOrderStatusById(Long id);

    OrderStatus createOrderStatus(OrderStatus orderStatus);

    OrderStatus updateOrderStatus(OrderStatus orderStatus, Long id);

    void deleteOrderStatus(Long id);
}

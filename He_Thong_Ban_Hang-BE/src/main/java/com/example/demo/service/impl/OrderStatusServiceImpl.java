package com.example.demo.service.impl;

import com.example.demo.entity.OrderStatus;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.OrderStatusRepository;
import com.example.demo.service.OrderStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderStatusServiceImpl implements OrderStatusService {

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @Override
    public List<OrderStatus> getAllOrderStatuses() {
        return orderStatusRepository.findAll();
    }

    @Override
    public Optional<OrderStatus> getOrderStatusById(Long id) {
        return Optional.ofNullable(orderStatusRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("OrderStatus not found with id: " + id)));
    }

    @Override
    public OrderStatus createOrderStatus(OrderStatus orderStatus) {
        return orderStatusRepository.save(orderStatus);
    }

    @Override
    public OrderStatus updateOrderStatus(OrderStatus orderStatus, Long id) {
        OrderStatus existingOrderStatus = getOrderStatusById(id)
                .orElseThrow(() -> new NotFoundException("OrderStatus not found with id: " + id));
        existingOrderStatus.setStatus(orderStatus.getStatus());
        return orderStatusRepository.save(existingOrderStatus);
    }

    @Override
    public void deleteOrderStatus(Long id) {
        orderStatusRepository.deleteById(id);
    }
}

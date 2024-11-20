package com.example.demo.service.impl;

import com.example.demo.entity.Order;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        return Optional.ofNullable(orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found with id: " + id)));
    }

    @Override
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Order order, Long id) {
        Order existingOrder = getOrderById(id)
                .orElseThrow(() -> new NotFoundException("Order not found with id: " + id));
        existingOrder.setStatus(order.getStatus());
        return orderRepository.save(existingOrder);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}

package com.example.demo.service.impl;

import com.example.demo.entity.Order;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        return Optional.ofNullable(orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found with id: " + id)));
    }

    @Override
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Order order, Long id) {
        Order existingOrder = getOrderById(id)
                .orElseThrow(() -> new NotFoundException("Order not found with id: " + id));
        existingOrder.setStatus(order.getStatus());
        return orderRepository.save(existingOrder);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}

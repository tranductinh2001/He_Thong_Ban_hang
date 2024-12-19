package com.example.demo.service.impl;

import com.example.demo.DTO.OrderAddressDTO;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderAddress;
import com.example.demo.entity.OrderStatus;
import com.example.demo.entity.User;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.OrderAddressRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderAddressRepository orderAddressRepository;

    @Override
    public List<Object[]> getTotalPriceByYear(int startYear, int endYear) {
        return orderRepository.getTotalPriceByYear(startYear, endYear);
    }
    public List<Object[]> getTotalOrdersByMonthRange(String startMonth, String endMonth) {
        // In ra giá trị của startMonth và endMonth
        System.out.println("getTotalOrdersByMonthRange  startMonth: " + startMonth);
        System.out.println("endMonth: " + endMonth);
        return orderRepository.findOrderTotalByMonthRange(startMonth, endMonth);
    }
    @Override
    public List<Object[]> getTotalPriceByDateRange(String startDate, String endDate) {
        return orderRepository.getTotalPriceByDateRange(startDate, endDate);
    }
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
    public Order getOrderByVerificationCode(String code) {
        // TODO Auto-generated method stub
        return orderRepository.getOrderByVerificationCode(code);
    }

    @Override
    public Order updateOrder(String status, Long id) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Order not found with id: {}", id);
                    return new NotFoundException("Order not found with id: " + id);
                });

        try {
            OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
            existingOrder.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid status value: {}", status);
            throw new NotFoundException("Invalid status value: " + status);
        }

        Order updatedOrder = orderRepository.save(existingOrder);
        return updatedOrder;
    }
    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}

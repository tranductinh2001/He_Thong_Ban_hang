package com.example.demo.service.impl;

import com.example.demo.entity.Order;
import com.example.demo.entity.OrderAddress;
import com.example.demo.entity.User;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.OrderAddressRepository;
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
    public OrderAddress createOrderAddress(OrderAddress orderAddress) {
        System.out.println("orderAddress uid nef "+ orderAddress.getUser());
        return orderAddressRepository.save(orderAddress);
    }


    @Override
    public Order getOrderByVerificationCode(String code) {
        // TODO Auto-generated method stub
        return orderRepository.getOrderByVerificationCode(code);
    }

    @Override
    public Order updateOrder(Order order, Long id) {
        Order existingOrder = getOrderById(id)
                .orElseThrow(() -> new NotFoundException("Order not found with id: " + id));
        existingOrder.setStatus(order.getStatus());
        return orderRepository.save(existingOrder);
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<OrderAddress> getAllOrderAddressByUserId(Long userId) {
        return orderAddressRepository.findByUserId(userId);
    }
    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}

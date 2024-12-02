package com.example.demo.service;

import com.example.demo.entity.Order;
import com.example.demo.entity.OrderAddress;
import com.example.demo.entity.User;

import java.util.List;
import java.util.Optional;

public interface OrderService {

    Order getOrderByVerificationCode(String code);

    List<Order> getAllOrders();

    Optional<Order> getOrderById(Long id);

    Order createOrder(Order order);

    OrderAddress createOrderAddress(OrderAddress orderAddress);

    Order updateOrder(Order order, Long id);

    List<Order> getOrdersByUserId(Long userId);

    List<OrderAddress> getAllOrderAddressByUserId(Long userId);

    void deleteOrder(Long id);

    List<Object[]> getTotalPriceByYear(int startYear, int endYear);

    List<Object[]> getTotalPriceByDateRange(String startDate, String endDate);

    List<Object[]> getTotalOrdersByMonthRange(String startMonth, String endMonth);

}

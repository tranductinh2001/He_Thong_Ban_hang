package com.example.demo.controller;

import com.example.demo.DTO.OrderAddressDTO;
import com.example.demo.entity.OrderAddress;
import com.example.demo.service.OrderAddressService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/orderAddress")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderAddressController {

    @Autowired
    private OrderAddressService orderAddressService;

    @PostMapping(value = "/create/order-address", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Tạo địa chỉ đơn hàng")
    public ResponseEntity<OrderAddress> createOrderAddress(@RequestBody OrderAddressDTO orderAddress) {
        OrderAddress newOrderAddress = orderAddressService.createOrderAddress(orderAddress);
        return ResponseEntity.ok(newOrderAddress);
    }

    @GetMapping("/order-address/user/{userId}")
    @Operation(summary = "Lấy danh sách tất cả địa chỉ đơn hàng của user")
    public ResponseEntity<List<OrderAddress>> getAllOrderAddressByUserId(@PathVariable Long userId) {
        List<OrderAddress> orderAddress = orderAddressService.getAllOrderAddressByUserId(userId);
        return ResponseEntity.ok(orderAddress);
    }

    @PutMapping(value = "/set-default/{order_address_id}")
    @Operation(summary = "Tạo địa chỉ đơn hàng")
    public ResponseEntity<List<OrderAddress>> setDefaultOrderAddress(@PathVariable Long order_address_id) {
        List<OrderAddress> newOrderAddress = orderAddressService.setDefaultOrderAddress(order_address_id);
        return ResponseEntity.ok(newOrderAddress);
    }
}

package com.example.demo.controller;
import com.example.demo.entity.Order;
import com.example.demo.entity.ServiceEntity;
import com.example.demo.response.MessageResponse;
import com.example.demo.service.OrderService;
import com.example.demo.service.ServiceService;
import com.example.demo.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả đơn hàng")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết đơn hàng theo ID")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo mới một đơn hàng")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order newOrder = orderService.createOrder(order);
        return ResponseEntity.ok(newOrder);
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Cập nhật trạng thái đơn hàng")
    public ResponseEntity<Order> updateOrder(@RequestBody Order order, @PathVariable Long id) {
        Order updatedOrder = orderService.updateOrder(order, id);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa đơn hàng theo ID")
    public ResponseEntity<MessageResponse> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(new MessageResponse("Đơn hàng đã được xóa"));
    }
}

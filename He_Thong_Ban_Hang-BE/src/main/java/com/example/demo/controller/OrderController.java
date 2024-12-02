package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.entity.OrderAddress;
import com.example.demo.entity.ServiceEntity;
import com.example.demo.response.MessageResponse;
import com.example.demo.service.OrderService;
import com.example.demo.service.ServiceService;
import com.example.demo.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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

    @GetMapping("/total-price-by-year")
    public List<Object[]> getTotalPriceByYear(
            @RequestParam int startYear,
            @RequestParam int endYear
    ) {
        System.out.println("Nhận request thống kê doanh thu theo năm: từ {} đến {}" + startYear + endYear);
        return orderService.getTotalPriceByYear(startYear, endYear);
    }

    @GetMapping("/total-price-by-date")
    public ResponseEntity<List<Object[]>> getTotalPriceByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        System.out.println("Nhận request thống kê doanh thu theo ngày: từ {} đến {}" + startDate + endDate);
        List<Object[]> result = orderService.getTotalPriceByDateRange(startDate, endDate);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/total-price-by-month")
    public ResponseEntity<List<Object[]>> getTotalOrdersByMonthRange(
            @RequestParam String startMonth,
            @RequestParam String endMonth) {
        // In ra giá trị của startMonth và endMonth
        System.out.println("startMonth: " + startMonth);
        System.out.println("endMonth: " + endMonth);
        List<Object[]> result = orderService.getTotalOrdersByMonthRange(startMonth, endMonth);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả đơn hàng")
    public ResponseEntity<?> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        if (orders == null || orders.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu không có đơn hàng
        }
        return ResponseEntity.ok(orders); // Trả về 200 OK với danh sách đơn hàng
    }

    @GetMapping("/oderAll")
    @Operation(summary = "Lấy danh sách tất cả đơn hàng")
    public ResponseEntity<List<Order>> getAllOrdersUrl() {
        List<Order> orders = orderService.getAllOrders();
        if (orders == null || orders.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu không có đơn hàng
        }
        return ResponseEntity.ok(orders); // Trả về 200 OK với danh sách đơn hàng
    }


    @GetMapping("/user/{userId}")
    @Operation(summary = "Lấy danh sách đơn hàng theo userId")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
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

    @GetMapping("/order-address/user/{userId}")
    @Operation(summary = "Lấy danh sách tất cả địa chỉ đơn hàng của user")
    public ResponseEntity<List<OrderAddress>> getAllOrderAddressByUserId(@PathVariable Long userId) {
        List<OrderAddress> orderAddress = orderService.getAllOrderAddressByUserId(userId);
        return ResponseEntity.ok(orderAddress);
    }

    @PostMapping(value = "/create/order-address", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Tạo địa chỉ đơn hàng")
    public ResponseEntity<OrderAddress> createOrderAddress(@RequestBody OrderAddress orderAddress) {
        OrderAddress newOrderAddress = orderService.createOrderAddress(orderAddress);
        return ResponseEntity.ok(newOrderAddress);
    }

    @PutMapping(value = "/update/{id}", consumes = {"application/json"})
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

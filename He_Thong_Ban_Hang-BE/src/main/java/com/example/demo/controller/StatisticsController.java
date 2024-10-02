package com.example.demo.controller;

import com.example.demo.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

//    @GetMapping("/total-revenue")
//    @Operation(summary = "Thống kê tổng doanh thu")
//    public ResponseEntity<Long> getTotalRevenue() {
//        Long totalRevenue = statisticsService.sumAllPrice();
//        return ResponseEntity.ok(totalRevenue);
//    }
//
//    @GetMapping("/daily-revenue")
//    @Operation(summary = "Thống kê doanh thu theo ngày")
//    public ResponseEntity<List<Map<String, Object>>> getDailyRevenue(
//            @RequestParam("month") Long month, @RequestParam("year") Long year) {
//        List<Map<String, Object>> dailyIncomeList = statisticsService.sumPriceOfDay(month, year);
//        return ResponseEntity.ok(dailyIncomeList);
//    }
//
//    @GetMapping("/monthly-revenue")
//    @Operation(summary = "Thống kê doanh thu theo tháng")
//    public ResponseEntity<List<Map<String, Object>>> getMonthlyRevenue(@RequestParam("year") Long year) {
//        List<Map<String, Object>> monthlyIncomeList = statisticsService.sumPriceOfMonth(year);
//        return ResponseEntity.ok(monthlyIncomeList);
//    }
}

package com.example.demo.controller;
import com.example.demo.entity.ServiceEntity;
import com.example.demo.request.CreateServiceRequest;
import com.example.demo.response.MessageResponse;
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
@RequestMapping("/api/service")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @GetMapping("/")
    @Operation(summary = "Lấy danh sách tất cả dịch vụ")
    public ResponseEntity<List<ServiceEntity>> getAllServices() {
        List<ServiceEntity> services = serviceService.getListService();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết dịch vụ theo ID")
    public ResponseEntity<List<ServiceEntity>> getServiceById(@PathVariable Long id) {
        List<ServiceEntity> services = serviceService.getAllServiceById(id); 
        if (services.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(services);
        }
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo mới một dịch vụ")
    public ResponseEntity<ServiceEntity> createService(@RequestBody CreateServiceRequest service) {
        ServiceEntity newService = (ServiceEntity) serviceService.createService(service);
        return ResponseEntity.ok(newService);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa dịch vụ theo ID")
    public ResponseEntity<MessageResponse> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.ok(new MessageResponse("Dịch vụ đã được xóa"));
    }
}

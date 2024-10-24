package com.example.demo.controller;

import com.example.demo.DTO.UserDTO;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    //    @DeleteMapping("/delete/{id}")
//    @Operation(summary = "Xóa người dùng")
//    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
//        userService.deleteUser(id);
//        return ResponseEntity.ok("Người dùng đã được xóa");
//    }
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            // Gọi UserService để lấy thông tin người dùng
            UserDTO user = userService.getUserProfile();

            return ResponseEntity.ok(user);  // Trả về thông tin người dùng
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}

package com.example.demo.controller;

import com.example.demo.DTO.UserDTO;
import com.example.demo.entity.Color;
import com.example.demo.entity.User;
import com.example.demo.request.ChangePasswordRequest;
import com.example.demo.request.UpdateProfileRequest;
import com.example.demo.request.UpdateUserRequest;
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

    @GetMapping
    @Operation(summary = "Lấy tất cả các người dùng")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> user = userService.getAllUser();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Cập nhật thông tin người dùng theo ID")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        try {
            User updatedUser = userService.updateUser(id, request);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/change-password")
    @Operation(summary = "Thay đổi mật khẩu người dùng")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request) {

        try {
            // Kiểm tra mật khẩu hiện tại và mật khẩu mới có khớp với confirmNewPassword không
            if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mật khẩu mới và xác nhận mật khẩu không khớp");
            }

            // Gọi dịch vụ để thay đổi mật khẩu
            boolean isChanged = userService.changePassword(request);

            if (isChanged) {
                return ResponseEntity.ok("Mật khẩu đã được thay đổi thành công");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mật khẩu hiện tại không đúng");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra trong quá trình thay đổi mật khẩu");
        }
    }

    @PutMapping("/updateProfile/{id}")
    @Operation(summary = "Cập nhật thông tin người dùng theo ID")
    public ResponseEntity<User> updateUserProfile(@PathVariable Long id, @RequestBody UpdateProfileRequest request) {
        try {
            User updatedUser = userService.updateUserProfile(id, request);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa người dùng")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Người dùng đã được xóa");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Người dùng không tồn tại");
        }
    }

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

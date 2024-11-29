package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/webhook")
public class LeonardoWebhookController {

    @PostMapping("/leonardo")
    public ResponseEntity<String> receiveWebhook(@RequestBody Map<String, Object> payload,
                                                 @RequestHeader("Authorization") String authorizationHeader) {
        // Ghi log để kiểm tra payload nhận được
        System.out.println("Webhook payload: " + payload);

        // Kiểm tra loại sự kiện
        String eventType = (String) payload.get("type");
        if ("image_generation.complete".equals(eventType)) {
            // Lấy thông tin ảnh từ payload
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            Map<String, Object> object = (Map<String, Object>) data.get("object");
            List<Map<String, Object>> images = (List<Map<String, Object>>) object.get("images");

            // Lưu thông tin ảnh vào cơ sở dữ liệu (giả định bạn có service để xử lý)
            for (Map<String, Object> image : images) {
                String imageUrl = (String) image.get("url");
                System.out.println("Generated image URL: " + imageUrl);
                // Lưu imageUrl vào database
                // imageService.saveImage(new ImageEntity(imageUrl, ...));
            }
        } else {
            System.out.println("Unhandled event type: " + eventType);
        }

        // Trả về phản hồi thành công
        return ResponseEntity.ok("Webhook received successfully");
    }
}

package com.example.demo.controller;

import com.example.demo.DTO.FileListClothesDTO;
import com.example.demo.request.CreateModelInRoomRequest;
import com.example.demo.request.ImageProcessingRequest;
import com.example.demo.response.MessageResponse;
import com.example.demo.service.LeonardoService;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;  // Thư viện Jackson
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Paths;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/room")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RoomController {

    @Autowired
    private LeonardoService LeonardoAIService;

    @PostMapping("/create-model")
    public ResponseEntity<MessageResponse> CreateModelInRoomRequest(
            @RequestParam("weight") String weight,
            @RequestParam("height") String height,
            @RequestParam(value = "skin_tone", required = false) String skinTone,
            @RequestParam(value = "nationality", required = false) String nationality,
            @RequestParam(value = "hair_color", required = false) String hairColor,
            @RequestParam(value = "body_shape", required = false) String bodyShape,
            @RequestParam(value = "hair_style", required = false) String hairStyle,
            @RequestParam("gender") String gender,
            @RequestParam(value = "age", required = false) String age,
            @RequestParam(value = "chest", required = false) String chest,
            @RequestParam(value = "wc", required = false) String wc,
            @RequestParam(value = "hip", required = false) String hip,
            @RequestParam("image_face") MultipartFile imageFace,  // Đảm bảo hình ảnh khuôn mặt
            @RequestParam("fileListClothes") String fileListClothesJson) {
        try {
            // Xử lý dữ liệu
            ObjectMapper objectMapper = new ObjectMapper();
            List<FileListClothesDTO> fileListClothes = objectMapper.readValue(fileListClothesJson, new TypeReference<List<FileListClothesDTO>>() {});

            // Log dữ liệu
            System.out.println("Weight: " + weight);
            System.out.println("Height: " + height);
            System.out.println("Skin Tone: " + skinTone);
            System.out.println("Nationality: " + nationality);
            System.out.println("Hair Color: " + hairColor);
            System.out.println("Body Shape: " + bodyShape);
            System.out.println("Hair Style: " + hairStyle);
            System.out.println("Gender: " + gender);
            System.out.println("Age: " + age);
            System.out.println("Chest: " + chest);
            System.out.println("WC: " + wc);
            System.out.println("Hip: " + hip);
            System.out.println("Face Image: " + imageFace.getOriginalFilename());
            System.out.println("File List Clothes: " + fileListClothes);

            // Trả về phản hồi thành công
            return ResponseEntity.ok(new MessageResponse("Mô hình đã được tạo thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponse("Đã xảy ra lỗi: " + e.getMessage()));
        }
    }
    @PostMapping("/process")
    public ResponseEntity<?> processImage(@RequestBody ImageProcessingRequest request) {
        try {
            String imagePath = request.getImagePath();
            String prompt = request.getPrompt();
            String modelId = request.getModelId();

            // Kiểm tra tệp tồn tại
            if (!Files.exists(Paths.get(imagePath))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File does not exist at path: " + imagePath);
            }

            JSONObject response = LeonardoAIService.processImageGeneration(imagePath, prompt, modelId);
            return ResponseEntity.ok(response.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}

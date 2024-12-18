package com.example.demo.controller;

import com.example.demo.DTO.FileListClothesDTO;
import com.example.demo.entity.ModelTryOnHistory;
import com.example.demo.request.CreateModelInRoomRequest;
import com.example.demo.request.ImageProcessingRequest;
import com.example.demo.response.MessageResponse;
import com.example.demo.service.LeonardoService;
import com.example.demo.service.ModelTryOnHistoryService;
import com.example.demo.service.TexelModaService;
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

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/room")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RoomController {

    @Autowired
    private LeonardoService LeonardoAIService;

    @Autowired
    private ModelTryOnHistoryService ModelTryOnHistoryService;

    @Autowired
    private TexelModaService TexelModaService;

    @PostMapping("/create-model")
    public ResponseEntity<MessageResponse> createModelInRoomRequest(
            @RequestParam(value = "weight", required = false) String weight,
            @RequestParam(value = "height", required = false) String height,
            @RequestParam(value = "skin_tone", required = false) String skinTone,
            @RequestParam(value = "nationality", required = false) String nationality,
            @RequestParam(value = "hair_color", required = false) String hairColor,
            @RequestParam(value = "body_shape", required = false) String bodyShape,
            @RequestParam(value = "hair_style", required = false) String hairStyle,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "age", required = false) String age,
            @RequestParam(value = "chest", required = false) String chest,
            @RequestParam(value = "wc", required = false) String wc,
            @RequestParam(value = "hip", required = false) String hip,
            @RequestParam(value = "product_id", required = false) Long ProductId,
            @RequestParam("image_face") MultipartFile imageFace,  // Đảm bảo hình ảnh khuôn mặt
            @RequestParam("fileListClothes") String fileListClothesJson) {
        // Log ra các tham số nhận được
        System.out.println("Received parameters:");
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
        System.out.println("Image Face: " + (imageFace != null ? imageFace.getOriginalFilename() : "No image"));
        System.out.println("File List Clothes JSON: " + fileListClothesJson);
        System.out.println("ProductId: " + ProductId);

        try {
            // Chuyển đổi danh sách quần áo từ JSON
            ObjectMapper objectMapper = new ObjectMapper();
            List<FileListClothesDTO> fileListClothes = objectMapper.readValue(fileListClothesJson, new TypeReference<List<FileListClothesDTO>>() {
            });

            // Lưu thông tin lịch sử thử đồ
            ModelTryOnHistory tryOnHistory = ModelTryOnHistoryService.saveTryOnHistory(
                    weight,
                    height,
                    skinTone,
                    nationality,
                    hairColor,
                    bodyShape,
                    hairStyle,
                    gender,
                    age,
                    chest,
                    wc,
                    hip,
                    imageFace,
                    ProductId,
                    fileListClothes
            );

            // Log dữ liệu (thông báo khi thử đồ đã được lưu)
            System.out.println("ModelTryOnHistory Saved:");
            System.out.println("ID: " + tryOnHistory.getId());
            System.out.println("Weight: " + tryOnHistory.getWeight());
            System.out.println("Height: " + tryOnHistory.getHeight());
            System.out.println("Skin Tone: " + tryOnHistory.getSkinTone());
            System.out.println("Nationality: " + tryOnHistory.getNationality());
            System.out.println("Hair Color: " + tryOnHistory.getHairColor());
            System.out.println("Body Shape: " + tryOnHistory.getBodyShape());
            System.out.println("Hair Style: " + tryOnHistory.getHairStyle());
            System.out.println("Gender: " + tryOnHistory.getGender());
            System.out.println("Age: " + tryOnHistory.getAge());
            System.out.println("Chest: " + tryOnHistory.getChest());
            System.out.println("WC: " + tryOnHistory.getWc());
            System.out.println("Hip: " + tryOnHistory.getHip());
            System.out.println("Face Image URL: " + tryOnHistory.getFaceImage().getUrl());

            tryOnHistory.getClothesImages().forEach(image -> {
                System.out.println("Clothes Image URL: " + image.getUrl());
            });
            System.out.println("Tried At: " + tryOnHistory.getTriedAt());

            // Chuyển đổi URL cho ảnh nếu cần thiết
            // Chuyển đổi URL cho ảnh nếu cần thiết
            // Chuyển đổi URL cho ảnh nếu cần thiết
            String faceImageUrl = tryOnHistory.getFaceImage().getUrl().replace("http://localhost:8080/photos", "C:/Users/Admin/Desktop/quanlybanhang_teamLead/He_Thong_Ban_Hang-BE/src/main/resources/static/photos");
            List<String> updatedClothesImageUrls = tryOnHistory.getClothesImages().stream()
                    .map(image -> image.getUrl().replace("http://localhost:8080/photos", "C:/Users/Admin/Desktop/quanlybanhang_teamLead/He_Thong_Ban_Hang-BE/src/main/resources/static/photos"))
                    .collect(Collectors.toList());

            // Lấy phần tử đầu tiên trong danh sách quần áo (nếu có)
            String updatedClothesImageUrl = updatedClothesImageUrls.isEmpty() ? "" : updatedClothesImageUrls.get(0);


            System.out.println("faceImageUrl url   : " + faceImageUrl);
            System.out.println("updatedClothesImageUrl url   : " + updatedClothesImageUrl);


            // Tạo prompt cho AI
            String clothingPrompt = "This is a clothing item for virtual try-on.";  // Ví dụ prompt cho quần áo
            // 1. Chuẩn bị thông tin cho avatar
            String avatarPrompt = "A " + gender + " character with " + (skinTone != null ? skinTone : "default") +
                    " skin, " + (hairColor != null ? hairColor : "default") + " hair, aged " + (age != null ? age : "25") +
                    " years, body shape: " + (bodyShape != null ? bodyShape : "slim") + ". " +
                    "Height: " + height + " cm, Weight: " + weight + " kg. Nationality: " + (nationality != null ? nationality : "unspecified") +
                    ", Hair style: " + (hairStyle != null ? hairStyle : "short") + ", Chest: " + (chest != null ? chest : "90") +
                    " cm, Waist: " + (wc != null ? wc : "70") + " cm, Hips: " + (hip != null ? hip : "95") + " cm.";

            System.out.println("updatedClothesImageUrl url   : " + avatarPrompt);

            String generatedImage = Arrays.toString(TexelModaService.tryOnClothes(
                    updatedClothesImageUrl, // Truyền đường dẫn ảnh mặt
                    faceImageUrl, // Truyền một URL duy nhất từ danh sách
                    clothingPrompt,
                    gender, // avatarSex có thể là gender hoặc tham số tương tự
                    avatarPrompt,
                    tryOnHistory.getId() // Truyền ID lịch sử thử đồ
            ));
//            System.out.println("generatedImage url   : " + generatedImage);


            // Trả về phản hồi thành công
            return ResponseEntity.ok(new MessageResponse("Mô hình đã được tạo thành công"));
        } catch (Exception e) {
            // Log lỗi và trả về phản hồi thất bại
            e.printStackTrace();
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

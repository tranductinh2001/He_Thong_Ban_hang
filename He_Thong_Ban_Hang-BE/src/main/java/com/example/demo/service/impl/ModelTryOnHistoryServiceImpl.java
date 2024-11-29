package com.example.demo.service.impl;

import com.example.demo.DTO.FileListClothesDTO;
import com.example.demo.entity.Image;
import com.example.demo.entity.ModelTryOnHistory;
import com.example.demo.entity.User;
import com.example.demo.repository.ImageRepository;
import com.example.demo.repository.ModelTryOnHistoryRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ModelTryOnHistoryService;
import lombok.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ModelTryOnHistoryServiceImpl implements ModelTryOnHistoryService {

    private static String uploadDirectory  = System.getProperty("user.dir") + "/src/main/resources/static/photos/";


    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private  ModelTryOnHistoryRepository modelTryOnHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("User not authenticated");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userDetails.getUsername();
    }

    @Override
    public ModelTryOnHistory saveTryOnHistory(
            String weight,
            String height,
            String skinTone,
            String nationality,
            String hairColor,
            String bodyShape,
            String hairStyle,
            String gender,
            String age,
            String chest,
            String wc,
            String hip,
            MultipartFile imageFace,
            List<FileListClothesDTO> fileListClothes
    ) {
        // Lưu hình ảnh khuôn mặt
        Image faceImage = saveImage(imageFace);

        // Lưu danh sách ảnh quần áo từ fileListClothes
        List<Image> clothesImages = saveClothesImages(fileListClothes);

        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo đối tượng ModelTryOnHistory
        ModelTryOnHistory tryOnHistory = new ModelTryOnHistory();
        tryOnHistory.setWeight(weight);
        tryOnHistory.setHeight(height);
        tryOnHistory.setSkinTone(skinTone);
        tryOnHistory.setHairStyle(hairStyle);
        tryOnHistory.setGender(gender);
        tryOnHistory.setFaceImage(faceImage);
        tryOnHistory.setClothesImages(clothesImages);
        tryOnHistory.setTriedAt(LocalDateTime.now());
        tryOnHistory.setAge(age);
        tryOnHistory.setBodyShape(bodyShape);
        tryOnHistory.setChest(chest);
        tryOnHistory.setHip(hip);
        tryOnHistory.setWc(wc);
        tryOnHistory.setNationality(nationality);
        tryOnHistory.setUser(user);

        // Nếu cần, có thể thêm nationality, hairColor, bodyShape, hoặc các trường khác

        // Lưu lịch sử thử đồ vào cơ sở dữ liệu
        return modelTryOnHistoryRepository.save(tryOnHistory);
    }

    @Override
    public Image saveImage(MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1);
            String uid = UUID.randomUUID().toString();
            String filePath = uploadDirectory + "/" + uid + "." + extension;

            // Lưu file vào ổ đĩa
            File serverFile = new File(filePath);
            try (FileOutputStream fos = new FileOutputStream(serverFile)) {
                fos.write(file.getBytes());
            }

            // Lưu thông tin file vào cơ sở dữ liệu
            Image image = new Image();
            image.setName(originalFilename);
            image.setSize(file.getSize());
            image.setType(extension);
            image.setUrl("http://localhost:8080/photos/" + uid + "." + extension);

            return imageRepository.save(image);

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu ảnh: " + e.getMessage());
        }
    }

    @Override
    public List<Image> saveClothesImages(List<FileListClothesDTO> fileListClothes) {
        List<Image> images = new ArrayList<>();
        for (FileListClothesDTO clothesDTO : fileListClothes) {
            Image image = new Image();
            image.setName(clothesDTO.getName());
            image.setType(clothesDTO.getType());
            image.setSize(Long.valueOf(clothesDTO.getSize()));
            image.setUrl(clothesDTO.getUrl());
            images.add(imageRepository.save(image));
        }
        return images;
    }

    @Override
    public ModelTryOnHistory saveGeneratedImagesToHistory(Long tryOnHistoryId, MultipartFile generatedImage) {
        // Tìm ModelTryOnHistory theo ID
        Optional<ModelTryOnHistory> tryOnHistoryOptional = modelTryOnHistoryRepository.findById(tryOnHistoryId);
        if (tryOnHistoryOptional.isEmpty()) {
            throw new RuntimeException("ModelTryOnHistory not found with ID: " + tryOnHistoryId);
        }

        ModelTryOnHistory tryOnHistory = tryOnHistoryOptional.get();

        // Lưu ảnh duy nhất vào cơ sở dữ liệu
        String imageUrl = String.valueOf(saveImage(generatedImage));  // Lưu ảnh và lấy đường dẫn
        Image image = new Image();
        image.setUrl(imageUrl);

        // Lưu Image vào cơ sở dữ liệu
        imageRepository.save(image);

        // Cập nhật trường createdImageGenerateAI của ModelTryOnHistory với ảnh đã lưu
        tryOnHistory.setCreatedImageGenerateAI(Collections.singletonList(image)); // Đặt ảnh duy nhất vào danh sách

        // Lưu ModelTryOnHistory đã cập nhật
        return modelTryOnHistoryRepository.save(tryOnHistory);
    }

}

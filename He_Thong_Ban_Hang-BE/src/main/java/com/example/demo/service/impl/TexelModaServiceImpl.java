package com.example.demo.service.impl;

import com.example.demo.entity.Image;
import com.example.demo.entity.ModelTryOnHistory;
import com.example.demo.repository.ImageRepository;
import com.example.demo.repository.ModelTryOnHistoryRepository;
import com.example.demo.service.TexelModaService;
import lombok.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TexelModaServiceImpl implements TexelModaService {

    private final SimpMessagingTemplate messagingTemplate;

    public TexelModaServiceImpl(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    private static String UPLOAD_DIR  = System.getProperty("user.dir") + "/src/main/resources/static/photos/";

    private static String apiKey = "3d0be417acmsh0966b664a86e14dp1278b4jsn5ef298ce2e0d";

    private static final String API_URL = "https://try-on-diffusion.p.rapidapi.com/try-on-file";

    @Autowired
    private ModelTryOnHistoryRepository modelTryOnHistoryRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public byte[] tryOnClothes(String clothingImageUrl, String avatarImageUrl, String clothingPrompt,
                               String avatarSex, String avatarPrompt, String seed, Long tryOnHistoryId) throws IOException {

        // Tạo RestTemplate để gửi yêu cầu
        RestTemplate restTemplate = new RestTemplate();

        // Thiết lập headers
        HttpHeaders headers = new HttpHeaders();
        headers.add("x-rapidapi-host", "try-on-diffusion.p.rapidapi.com");
        headers.add("x-rapidapi-key", apiKey);

        // Tạo một MultiValueMap để chứa tham số và URL
        MultiValueMap<String, Object> multipartRequest = new LinkedMultiValueMap<>();

        // Thêm các tham số văn bản vào multipart request
        multipartRequest.add("clothing_prompt", clothingPrompt);
        multipartRequest.add("avatar_sex", avatarSex);
        multipartRequest.add("avatar_prompt", avatarPrompt);

        // Thêm đường dẫn hình ảnh vào multipart request
        Path clothingImagePath = Paths.get(clothingImageUrl);
        Path avatarImagePath = Paths.get(avatarImageUrl);

        multipartRequest.add("clothing_image", new FileSystemResource(clothingImagePath));
        multipartRequest.add("avatar_image", new FileSystemResource(avatarImagePath));

        // Thiết lập HttpEntity với các headers và dữ liệu form
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(multipartRequest, headers);

        // Gửi yêu cầu API dưới dạng multipart/form-data và nhận phản hồi
        ResponseEntity<byte[]> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, byte[].class);

        // Kiểm tra nếu phản hồi thành công
        if (response.getStatusCode().is2xxSuccessful()) {
            byte[] imageBytes = response.getBody();

            // Lấy đối tượng ModelTryOnHistory từ repository bằng ID
            Optional<ModelTryOnHistory> optionalHistory = modelTryOnHistoryRepository.findById(tryOnHistoryId);

            if (optionalHistory.isPresent()) {
                ModelTryOnHistory history = optionalHistory.get();

                // Kiểm tra và khởi tạo danh sách nếu nó là null
                if (history.getCreatedImageGenerateAI() == null) {
                    history.setCreatedImageGenerateAI(new ArrayList<>());
                }
                modelTryOnHistoryRepository.save(history);  // Lưu lại đối tượng đã thay đổi
            }

            saveGeneratedImageToHistory(tryOnHistoryId, imageBytes);  // Lưu ảnh vào lịch sử

            // Trả về ảnh đã được tạo
            return imageBytes;
        } else {
            throw new RuntimeException("Error while trying on clothes: " + response.getStatusCode());
        }
    }



    private void saveGeneratedImageToHistory(Long tryOnHistoryId, byte[] imageBytes) {
        // Tìm kiếm `ModelTryOnHistory` theo ID
        Optional<ModelTryOnHistory> tryOnHistoryOptional = modelTryOnHistoryRepository.findById(tryOnHistoryId);
        if (tryOnHistoryOptional.isEmpty()) {
            throw new RuntimeException("ModelTryOnHistory not found with ID: " + tryOnHistoryId);
        }

        ModelTryOnHistory tryOnHistory = tryOnHistoryOptional.get();

        try {
            // Tạo tên file duy nhất để lưu ảnh
            String uid = UUID.randomUUID().toString();
            String extension = "png"; // Giả định ảnh được tạo là PNG
            String filePath = UPLOAD_DIR + uid + "." + extension;

            // Lưu file ảnh dưới dạng byte[] vào server
            File serverFile = new File(filePath);
            try (BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile))) {
                stream.write(imageBytes);
            }

            // Lưu thông tin ảnh vào database
            Image img = new Image();
            img.setName(uid + "." + extension); // Lưu tên file duy nhất
            img.setSize((long) imageBytes.length); // Kích thước file
            img.setType(extension); // Định dạng file
            img.setUrl("http://localhost:8080/photos/" + uid + "." + extension); // URL truy cập ảnh

            Image savedImg = imageRepository.save(img);

            String messageSK = savedImg.getUrl();
            messagingTemplate.convertAndSend("/topic/room/createImage", messageSK);

            // Kiểm tra và khởi tạo danh sách nếu null
            if (tryOnHistory.getCreatedImageGenerateAI() == null) {
                tryOnHistory.setCreatedImageGenerateAI(new ArrayList<>());
            }

            // Liên kết ảnh với `ModelTryOnHistory`
            tryOnHistory.getCreatedImageGenerateAI().add(savedImg);
            modelTryOnHistoryRepository.save(tryOnHistory); // Lưu cập nhật

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi lưu ảnh vào lịch sử", e);
        }
    }





}

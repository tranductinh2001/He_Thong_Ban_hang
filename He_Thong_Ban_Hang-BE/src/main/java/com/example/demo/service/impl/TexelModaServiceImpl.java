package com.example.demo.service.impl;

import com.example.demo.entity.Image;
import com.example.demo.entity.ModelTryOnHistory;
import com.example.demo.repository.ImageRepository;
import com.example.demo.repository.ModelTryOnHistoryRepository;
import com.example.demo.service.CloudinaryService;
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
import org.springframework.mock.web.MockMultipartFile;
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

    private static final String UPLOAD_DIR = "C:\\Users\\Admin\\OneDrive\\Desktop\\Luu_tru_project\\quanlybanhang_teamLead\\He_Thong_Ban_Hang-BE\\src\\main\\resources\\static\\photos\\";

    private static String apiKey = "fb9fa360e2msh6b549691a822cbap1728e1jsn721dd35c422c";

    private static final String API_URL = "https://try-on-diffusion.p.rapidapi.com/try-on-file";

    @Autowired
    private ModelTryOnHistoryRepository modelTryOnHistoryRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public byte[] tryOnClothes(String clothingImageUrl, String avatarImageUrl, String clothingPrompt,
                               String avatarSex, String avatarPrompt, Long tryOnHistoryId) throws IOException {

        // Tạo RestTemplate để gửi yêu cầu
        RestTemplate restTemplate = new RestTemplate();

        // Thiết lập headers
        HttpHeaders headers = new HttpHeaders();
        headers.add("x-rapidapi-host", "try-on-diffusion.p.rapidapi.com");
        headers.add("x-rapidapi-key", apiKey);

        // Tạo một MultiValueMap để chứa tham số và URL
        MultiValueMap<String, Object> multipartRequest = new LinkedMultiValueMap<>();


        // Thêm thông tin về trang phục
        String clothingDescription = "A " + clothingPrompt;  // Description for clothing (e.g., "red sleeveless mini dress")

        // Truyền thông tin vào multipartRequest
        multipartRequest.add("clothing_prompt", clothingDescription);
        multipartRequest.add("avatar_sex", avatarSex);
        multipartRequest.add("avatar_prompt", avatarPrompt);
        multipartRequest.add("background_prompt", "Remove background, only the avatar character visible.");


        // Thêm đường dẫn hình ảnh vào multipart request
        Path clothingImagePath = Paths.get(clothingImageUrl);
        Path avatarImagePath = Paths.get(avatarImageUrl);

        multipartRequest.add("clothing_image", new FileSystemResource(clothingImagePath));
        multipartRequest.add("avatar_image", new FileSystemResource(avatarImagePath));
        //multipartRequest.add("background_image", new FileSystemResource("C:/Users/Admin/Desktop/quanlybanhang_teamLead/He_Thong_Ban_Hang-BE/src/main/resources/static/photos/room.jpg"));

        // Thiết lập HttpEntity với các headers và dữ liệu form
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(multipartRequest, headers);

        System.out.println("dữ liệu trước khi học:");
        for (String key : Objects.requireNonNull(entity.getBody()).keySet()) {
            System.out.println("Key: " + key + ", Values: " + entity.getBody().get(key));
        }

        // Gửi yêu cầu API dưới dạng multipart/form-data và nhận phản hồi
        ResponseEntity<byte[]> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, byte[].class);

        // Kiểm tra nếu phản hồi thành công
        if (response.getStatusCode().is2xxSuccessful()) {
            byte[] imageBytes = response.getBody();

            saveGeneratedImageToHistory(tryOnHistoryId, imageBytes);

            return imageBytes;
        } else {
            throw new RuntimeException("Error while trying on clothes: " + response.getStatusCode());
        }
    }


    public void saveGeneratedImageToHistory(Long tryOnHistoryId, byte[] imageBytes) {
        try {
            Optional<ModelTryOnHistory> tryOnHistoryOptional = modelTryOnHistoryRepository.findById(tryOnHistoryId);
            if (tryOnHistoryOptional.isEmpty()) {
                throw new RuntimeException("ModelTryOnHistory not found with ID: " + tryOnHistoryId);
            }

            ModelTryOnHistory tryOnHistory = tryOnHistoryOptional.get();

            // Tạo tên file duy nhất để lưu ảnh
            String uid = UUID.randomUUID().toString();
            String extension = "png"; // Định dạng ảnh giả sử là PNG
            String filePath = UPLOAD_DIR + uid + "." + extension;

            // Lưu ảnh vào server dưới dạng byte[]
            File serverFile = new File(filePath);
            try (BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile))) {
                stream.write(imageBytes);
            }

            // Lưu thông tin ảnh vào cơ sở dữ liệu
            Image img = new Image();
            img.setName(uid + "." + extension);
            img.setSize((long) imageBytes.length);
            img.setType(extension);
            img.setUrl("http://localhost:8080/photos/" + uid + "." + extension);
            Image savedImg = imageRepository.save(img);

            // Tải ảnh lên Cloudinary
            MultipartFile multipartFile = new MockMultipartFile("file", img.getName(), "image/png", imageBytes);
            String cloudinaryResult = cloudinaryService.uploadFile(multipartFile);

//             Cập nhật URL Cloudinary vào ảnh trong cơ sở dữ liệu
            savedImg.setUrl(cloudinaryResult);
            imageRepository.save(savedImg);


            messagingTemplate.convertAndSend("/topic/room/createImage", cloudinaryResult);

            // Liên kết ảnh với `ModelTryOnHistory`
            tryOnHistory.setCreatedImageGenerateAI(savedImg);
            modelTryOnHistoryRepository.save(tryOnHistory);

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi lưu ảnh vào lịch sử", e);
        }
    }

//    private void saveGeneratedImageToHistory(Long tryOnHistoryId, byte[] imageBytes) {
//        // Tìm kiếm `ModelTryOnHistory` theo ID
//        Optional<ModelTryOnHistory> tryOnHistoryOptional = modelTryOnHistoryRepository.findById(tryOnHistoryId);
//        if (tryOnHistoryOptional.isEmpty()) {
//            throw new RuntimeException("ModelTryOnHistory not found with ID: " + tryOnHistoryId);
//        }
//
//        ModelTryOnHistory tryOnHistory = tryOnHistoryOptional.get();
//
//        try {
//            // Tạo tên file duy nhất để lưu ảnh
//            String uid = UUID.randomUUID().toString();
//            String extension = "png"; // Giả định ảnh được tạo là PNG
//            String filePath = UPLOAD_DIR + uid + "." + extension;
//
//            // Lưu file ảnh dưới dạng byte[] vào server
//            File serverFile = new File(filePath);
//            String extension = "png"; // Giả định ảnh là PNG
//            File tempFile = File.createTempFile("generated-image-", "." + extension);
//            try (BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile))) {
//                stream.write(imageBytes);
//            }
//
//            // Upload ảnh lên Cloudinary
//            Map<String, String> cloudinaryResult = cloudinaryService.uploadImage(new MockMultipartFile(
//                    tempFile.getName(),
//                    tempFile.getName(),
//                    "image/png",
//                    imageBytes
//            ));
//
//            // Lưu thông tin ảnh vào database
//            Image img = new Image();
//            img.setName(uid + "." + extension); // Lưu tên file duy nhất
//            img.setSize((long) imageBytes.length); // Kích thước file
//            img.setType(extension); // Định dạng file
//            img.setUrl("http://localhost:8080/photos/" + uid + "." + extension); // URL truy cập ảnh
//            img.setData(imageBytes);
//            Image savedImg = imageRepository.save(img);
//
//            String messageSKURL = savedImg.getUrl();
//            String messageSKBase64 = Arrays.toString(savedImg.getData());
//            int retryCount = 0;
//            while (retryCount < 300) { // Tối đa 10 lần thử
//                if (isImagePublic(messageSKURL) && retryCount >= 10) {
//                    System.out.println("Ảnh đã được lưu vào server. " + "http://localhost:8080/photos/" + uid + "." + extension);
//
//                    Map<String, String> imageData = new HashMap<>();
//
//                    imageData.put("url", messageSKURL);
//                    imageData.put("base64", messageSKBase64);
//                    System.out.println("Ảnh base64 đã được lưu vào server. " + messageSKBase64);
//                    System.out.println("Ảnh cả 2 đã được lưu vào server. " + imageData);
//
//                    // Ảnh đã public, bắn WebSocket
//                    messagingTemplate.convertAndSend("/topic/room/createImage", imageData);
//                    break;
//                }
//                retryCount++;
//                Thread.sleep(1000); // Chờ 1 giây trước khi thử lại
//            }
//
//
//            // Kiểm tra và khởi tạo danh sách nếu null
//            if (tryOnHistory.getCreatedImageGenerateAI() == null) {
//                tryOnHistory.setCreatedImageGenerateAI(new ArrayList<>());
//            }
//
//            // Liên kết ảnh với `ModelTryOnHistory`
//            tryOnHistory.getCreatedImageGenerateAI().add(savedImg);
//            modelTryOnHistoryRepository.save(tryOnHistory); // Lưu cập nhật
//
//        } catch (IOException e) {
//            e.printStackTrace();
//            throw new RuntimeException("Lỗi khi lưu ảnh vào lịch sử", e);
//        } catch (InterruptedException e) {
//            throw new RuntimeException(e);
//        }
//    }

    public boolean isImagePublic(String imageUrl) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(imageUrl, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }


}

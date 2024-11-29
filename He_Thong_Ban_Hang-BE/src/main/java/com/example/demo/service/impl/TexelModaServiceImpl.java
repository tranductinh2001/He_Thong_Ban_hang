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
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class TexelModaServiceImpl implements TexelModaService {

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
        multipartRequest.add("clothing_image_url", clothingImageUrl);  // Sử dụng URL của quần áo
        multipartRequest.add("avatar_image_url", avatarImageUrl);      // Sử dụng URL của avatar

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

                // Tạo đối tượng Image từ mảng byte và thêm vào danh sách
//                Image image = new Image(imageBytes);
//                history.getCreatedImageGenerateAI().add(image);  // Thêm đối tượng Image vào danh sách

                modelTryOnHistoryRepository.save(history);  // Lưu lại đối tượng đã thay đổi
            }

            saveGeneratedImageToHistory(tryOnHistoryId, imageBytes);  // Lưu ảnh vào lịch sử

            // Trả về ảnh đã được tạo
            return imageBytes;
        } else {
            throw new RuntimeException("Error while trying on clothes: " + response.getStatusCode());
        }
    }



    // Hàm thêm các tham số văn bản vào multipart request
    private void addTextParamsToRequest(MultiValueMap<String, Object> multipartRequest, String clothingPrompt,
                                        String avatarSex, String avatarPrompt) {
        multipartRequest.add("clothing_prompt", clothingPrompt);
        multipartRequest.add("avatar_sex", avatarSex);
        multipartRequest.add("avatar_prompt", avatarPrompt);
        // Nếu có seed, có thể bổ sung vào đây
//        if (seed != null && !seed.isEmpty()) {
//            multipartRequest.add("seed", seed);
//        }
    }

    // Hàm thêm các tham số hình ảnh vào multipart request
    private void addImageParamsToRequest(MultiValueMap<String, Object> multipartRequest, String clothingImageUrl, String avatarImageUrl) {
        multipartRequest.add("clothing_image_url", clothingImageUrl);
        multipartRequest.add("avatar_image_url", avatarImageUrl);
    }


    private void saveGeneratedImageToHistory(Long tryOnHistoryId, byte[] imageBytes) {
        // Tìm ModelTryOnHistory theo ID
        Optional<ModelTryOnHistory> tryOnHistoryOptional = modelTryOnHistoryRepository.findById(tryOnHistoryId);
        if (tryOnHistoryOptional.isEmpty()) {
            throw new RuntimeException("ModelTryOnHistory not found with ID: " + tryOnHistoryId);
        }

        ModelTryOnHistory tryOnHistory = tryOnHistoryOptional.get();

        // Tạo một đối tượng Image và lưu ảnh vào cơ sở dữ liệu
        Image image = new Image();

        // Lưu Image vào cơ sở dữ liệu
        imageRepository.save(image);

        // Cập nhật ModelTryOnHistory với ảnh vừa tạo
        tryOnHistory.getCreatedImageGenerateAI().add(image); // Thêm ảnh vào danh sách ảnh đã tạo
        modelTryOnHistoryRepository.save(tryOnHistory);
    }



}

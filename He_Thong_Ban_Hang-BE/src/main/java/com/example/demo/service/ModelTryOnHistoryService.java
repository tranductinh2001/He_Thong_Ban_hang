package com.example.demo.service;

import com.example.demo.DTO.FileListClothesDTO;
import com.example.demo.entity.Image;
import com.example.demo.entity.ModelTryOnHistory;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ModelTryOnHistoryService {
    ModelTryOnHistory saveTryOnHistory(
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
    );

    ModelTryOnHistory saveGeneratedImagesToHistory(Long tryOnHistoryId, MultipartFile generatedImages);

    Image saveImage(MultipartFile file); // Lưu ảnh vào cơ sở dữ liệu

    List<Image> saveClothesImages(List<FileListClothesDTO> fileListClothes); // Lưu danh sách ảnh quần áo

    List<ModelTryOnHistory> getAllModelTryOnHistoriesByUserId(Long userId);

    void deleteModelTryOnHistory(Long id);

}

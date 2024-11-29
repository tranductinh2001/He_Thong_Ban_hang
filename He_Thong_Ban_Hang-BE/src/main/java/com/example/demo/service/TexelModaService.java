package com.example.demo.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface TexelModaService {
    byte[] tryOnClothes(String clothingImageUrl, String avatarImageUrl, String clothingPrompt,
                        String avatarSex, String avatarPrompt, String seed, Long tryOnHistoryId) throws IOException;

}

package com.example.demo.request;

import com.example.demo.DTO.FileListClothesDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateModelInRoomRequest {
    private String weight;
    private String height;
    private String skinTone;
    private String nationality;
    private String hairColor;
    private String bodyShape;
    private String hairStyle;
    private String gender;
    private String age;
    private String chest;
    private String wc;
    private String hip;
    private MultipartFile imageFace;
    private List<FileListClothesDTO> fileListClothes;
}

package com.example.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileListClothesDTO {
    private String id;    // Thêm trường id thay vì uid
    private String name;
    private String type;  // Thêm trường type từ JSON
    private Long size;    // Thêm trường size (kiểu dữ liệu Long để lưu kích thước file)
    private String uploadedBy;  // Thêm trường uploadedBy
    private String url;


    @Override
    public String toString() {
        return "FileListClothesDTO{id='" + id + "', name='" + name + "', type='" + type + "', size=" + size + ", uploadedBy='" + uploadedBy + "', url='" + url + "'}";
    }
}

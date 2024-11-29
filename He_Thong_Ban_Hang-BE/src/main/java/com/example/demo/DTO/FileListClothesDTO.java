package com.example.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileListClothesDTO {
    private String uid;
    private String name;
    private String status;
    private String url;

    // Getters và Setters

    @Override
    public String toString() {
        return "FileListClothesDTO{uid='" + uid + "', name='" + name + "', status='" + status + "', url='" + url + "'}";
    }
}

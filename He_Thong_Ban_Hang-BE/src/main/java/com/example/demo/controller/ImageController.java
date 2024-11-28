package com.example.demo.controller;

import com.example.demo.entity.Image;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.InternalServerException;
import com.example.demo.service.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.*;

@RestController
@RequestMapping("/api/image")
@CrossOrigin(origins = "*",maxAge = 3600)
public class ImageController {

	
	private static String UPLOAD_DIR  = System.getProperty("user.dir") + "/src/main/resources/static/photos/";

    @Autowired
    private ImageService imageService;


    @GetMapping("/")
    public ResponseEntity<?> getList(){
        List<Image> listImage = imageService.getListImage();
        return  ResponseEntity.ok(listImage);
    }

    @GetMapping("/user/{id}")
    @Operation(summary="Lấy ra danh sách hình ảnh của user bằng user_id")
    public ResponseEntity<?> getListByUser(@PathVariable long userId){
        List<Image> listImage = imageService.getListByUser(userId);

        return ResponseEntity.ok(listImage);
    }

    @PostMapping("/upload-file")
    @Operation(summary = "Upload nhiều file lên database")
    public ResponseEntity<?> uploadFiles(@RequestParam("file") MultipartFile[] files) {
        List<Map<String, Object>> uploadedFilesInfo = new ArrayList<>();

        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        for (MultipartFile file : files) {
            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null && originalFilename.length() > 0) {
                String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
                if (!extension.equals("png") && !extension.equals("jpg") &&
                        !extension.equals("gif") && !extension.equals("svg") && !extension.equals("jpeg")) {
                    throw new BadRequestException("Không hỗ trợ định dạng file này");
                }
                try {
                    // Tạo tên file duy nhất
                    String uid = UUID.randomUUID().toString();
                    String link = UPLOAD_DIR + uid + "." + extension;
                    File serverFile = new File(link);
                    BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
                    stream.write(file.getBytes());
                    stream.close();

                    // Lưu thông tin file vào database
                    Image img = new Image();
                    img.setName(originalFilename);
                    img.setSize(file.getSize());
                    img.setType(extension);
                    img.setUrl("http://localhost:8080/photos/" + uid + "." + extension);

                    Image savedImg = imageService.save(img);

                    // Lưu thông tin file đã upload vào danh sách
                    Map<String, Object> fileInfo = new HashMap<>();
                    fileInfo.put("id", savedImg.getId());
                    fileInfo.put("url", savedImg.getUrl());
                    uploadedFilesInfo.add(fileInfo);

                } catch (Exception e) {
                    e.printStackTrace();
                    throw new InternalServerException("Lỗi khi upload file");
                }
            } else {
                throw new BadRequestException("File không hợp lệ");
            }
        }

        // Trả về danh sách thông tin của tất cả các file đã upload
        return ResponseEntity.ok(uploadedFilesInfo);
    }
}

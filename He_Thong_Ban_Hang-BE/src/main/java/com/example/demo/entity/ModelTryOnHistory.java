package com.example.demo.entity;

import com.example.demo.entity.Image;
import com.example.demo.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "ModelTryOnHistory")
public class ModelTryOnHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user; // Khách hàng thực hiện thử đồ

    private String weight;
    private String height;
    private String skinTone;
    private String nationality; // Quốc tịch
    private String hairColor; // Màu tóc
    private String bodyShape; // Hình dáng cơ thể
    private String hairStyle;
    private String gender;
    private String age; // Tuổi
    private String chest; // Số đo vòng 1
    private String wc; // Số đo vòng eo
    private String hip; // Số đo vòng hông

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "tryon_history_id")  // Chỉ định khóa ngoại
    private List<Image> createdImageGenerateAI;

    @OneToOne
    private Image faceImage;

    @OneToMany
    private List<Image> clothesImages;

    private LocalDateTime triedAt; // Thời điểm thử
}

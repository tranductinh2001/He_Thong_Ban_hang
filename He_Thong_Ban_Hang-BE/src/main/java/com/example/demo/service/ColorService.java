package com.example.demo.service;

import com.example.demo.entity.Color;
import java.util.List;
import java.util.Optional;

public interface ColorService {

    List<Color> getAllColors();

    Optional<Color> getColorById(Long id);

    Color createColor(Color color);

    Color updateColor(Color color, Long id);

    void deleteColor(Long id);
}

package com.example.demo.service.impl;

import com.example.demo.entity.Color;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.ColorRepository;
import com.example.demo.service.ColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColorServiceImpl implements ColorService {

    @Autowired
    private ColorRepository colorRepository;

    @Override
    public List<Color> getAllColors() {
        return colorRepository.findAll();
    }

    @Override
    public Optional<Color> getColorById(Long id) {
        return Optional.ofNullable(colorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Color not found with id: " + id)));
    }

    @Override
    public Color createColor(Color color) {
        return colorRepository.save(color);
    }

    @Override
    public Color updateColor(Color color, Long id) {
        Color existingColor = getColorById(id)
                .orElseThrow(() -> new NotFoundException("Color not found with id: " + id));
        existingColor.setName(color.getName());
        return colorRepository.save(existingColor);
    }

    @Override
    public void deleteColor(Long id) {
        colorRepository.deleteById(id);
    }
}

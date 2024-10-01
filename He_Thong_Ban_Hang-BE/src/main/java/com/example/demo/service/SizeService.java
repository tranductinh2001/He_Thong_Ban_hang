package com.example.demo.service;

import com.example.demo.entity.Size;
import java.util.List;
import java.util.Optional;

public interface SizeService {

    List<Size> getAllSizes();

    Optional<Size> getSizeById(Long id);

    Size createSize(Size size);

    Size updateSize(Size size, Long id);

    void deleteSize(Long id);
}

package com.example.demo.service.impl;

import com.example.demo.entity.Size;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.SizeRepository;
import com.example.demo.service.SizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SizeServiceImpl implements SizeService {

    @Autowired
    private SizeRepository sizeRepository;

    @Override
    public List<Size> getAllSizes() {
        return sizeRepository.findAll();
    }

    @Override
    public Optional<Size> getSizeById(Long id) {
        return Optional.ofNullable(sizeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Size not found with id: " + id)));
    }

    @Override
    public Size createSize(Size size) {
        return sizeRepository.save(size);
    }

    @Override
    public Size updateSize(Size size, Long id) {
        Size existingSize = getSizeById(id)
                .orElseThrow(() -> new NotFoundException("Size not found with id: " + id));
        existingSize.setSizeName(size.getSizeName());
        return sizeRepository.save(existingSize);
    }

    @Override
    public void deleteSize(Long id) {
        sizeRepository.deleteById(id);
    }
}

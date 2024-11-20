package com.example.demo.service.impl;

import com.example.demo.entity.Brand;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.BrandRepository;
import com.example.demo.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Override
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @Override
    public Optional<Brand> getBrandById(Long id) {
        return Optional.ofNullable(brandRepository.findById(id).orElseThrow(() -> new NotFoundException("Brand not found with id: " + id)));
    }

    @Override
    public Brand createBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    @Override
    public Brand updateBrand(Brand brand, Long id) {
        Brand existingBrand = getBrandById(id).orElseThrow(() -> new NotFoundException("Brand not found with id: " + id));
        existingBrand.setName(brand.getName());
        return brandRepository.save(existingBrand);
    }

    @Override
    public void deleteBrand(Long id) {
        brandRepository.deleteById(id);
    }
}

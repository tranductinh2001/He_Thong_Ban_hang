package com.example.demo.service;

import com.example.demo.entity.Brand;
import java.util.List;
import java.util.Optional;

public interface BrandService {

    List<Brand> getAllBrands();

    Optional<Brand> getBrandById(Long id);

    Brand createBrand(Brand brand);

    Brand updateBrand(Brand brand, Long id);

    void deleteBrand(Long id);
}

package com.example.demo.controller;

import com.example.demo.entity.Brand;
import com.example.demo.service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brand")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping("/")
    @Operation(summary = "Lấy tất cả các thương hiệu")
    public ResponseEntity<List<Brand>> getAllBrands() {
        List<Brand> brands = brandService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo mới thương hiệu")
    public ResponseEntity<Brand> createBrand(@RequestBody Brand brand) {
        Brand createdBrand = brandService.createBrand(brand);
        return ResponseEntity.ok(createdBrand);
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Cập nhật thương hiệu")
    public ResponseEntity<Brand> updateBrand(@PathVariable Long id, @RequestBody Brand brand) {
        Brand updatedBrand = brandService.updateBrand(brand, id);
        return ResponseEntity.ok(updatedBrand);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa thương hiệu")
    public ResponseEntity<String> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok("Thương hiệu đã được xóa");
    }
}

package com.example.demo.controller;

import com.example.demo.entity.Brand;
import com.example.demo.service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brand")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping("/")
    @Operation(summary = "Lấy tất cả các thương hiệu")
    public ResponseEntity<List<Brand>> getAllBrands() {
        List<Brand> brands = brandService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo mới thương hiệu")
    public ResponseEntity<Brand> createBrand(@RequestBody Brand brand) {
        Brand createdBrand = brandService.createBrand(brand);
        return ResponseEntity.ok(createdBrand);
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Cập nhật thương hiệu")
    public ResponseEntity<Brand> updateBrand(@PathVariable Long id, @RequestBody Brand brand) {
        Brand updatedBrand = brandService.updateBrand(brand, id);
        return ResponseEntity.ok(updatedBrand);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa thương hiệu")
    public ResponseEntity<String> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok("Thương hiệu đã được xóa");
    }
}

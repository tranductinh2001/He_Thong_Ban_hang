package com.example.demo.service.impl;

import com.example.demo.entity.*;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.*;
import com.example.demo.request.CreateProductRequest;
import com.example.demo.request.SizeRequest;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Override
    public List<Product> findProductByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    public List<Product> getListProduct() {
        return productRepository.findAll(Sort.by("id").descending());
    }

    @Override
    public List<Product> getListProductByName(String name) {
        return productRepository.findByName(name);
    }

    @Override
    public List<Product> getListProductByPrice(long price) {
        return productRepository.findByPrice(price);
    }

    @Override
    public Optional<Product> getProductById(long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product findListProductByIdAndUserUsername(int id, String name) {
        return null;
    }

    @Override
    public List<Product> findProductByIdDestinations(Long id) {
        return null;
    }

    @Override
    public Map<String, Object> filterProducts(String filterBy, String filterValue, int currentPage, int pageSize) {
        Pageable paging = PageRequest.of(currentPage, pageSize);
        Page<Product> pagedResult;

        switch (filterBy) {
            case "hot":
                pagedResult = productRepository.findByIsHot(Boolean.parseBoolean(filterValue), paging);
                break;
            case "sale":
                pagedResult = productRepository.findByIsSale(Boolean.parseBoolean(filterValue), paging);
                break;
            default:
                pagedResult = Page.empty();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("products", pagedResult.getContent());
        response.put("currentPage", pagedResult.getNumber());
        response.put("totalItems", pagedResult.getTotalElements());
        response.put("totalPages", pagedResult.getTotalPages());

        return response;
    }

    @Override
    public Map<String, Object> sortProducts(String sortField, String sortDirection, int currentPage, int pageSize) {
        System.out.println("sortField, "+ sortField + "   ===== sortDirection,  " + sortDirection);
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);
        Pageable paging = PageRequest.of(currentPage, pageSize, sort);
        Page<Product> pagedResult = productRepository.findAll(paging);

        Map<String, Object> response = new HashMap<>();
        response.put("products", pagedResult.getContent());
        response.put("currentPage", pagedResult.getNumber());
        response.put("totalItems", pagedResult.getTotalElements());
        response.put("totalPages", pagedResult.getTotalPages());

        return response;
    }


    @Override
    public Product createProduct(CreateProductRequest body) {
        Product product = new Product();

        // Thiết lập thông tin cơ bản của sản phẩm
        product.setName(body.getName());
        product.setPrice(body.getPrice());
        product.setSalePrice(body.getSalePrice());
        product.setDescription(body.getDescription());
        product.setHot(body.isHot());
        product.setSale(body.isSale());
        product.setDeleted(body.isDeleted());
        product.setStatus(body.isStatus());
        product.setCreatedAt(new Date());
        product.setUpdatedAt(new Date());

        // Xử lý danh sách hình ảnh
        List<Image> images = new ArrayList<>();
        for (Long imageId : body.getImages()) {
            Image image = imageRepository.findById(imageId)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy hình ảnh với ID: " + imageId));
            images.add(image);
        }
        product.setImages(images);

        // Xử lý danh sách màu sắc
        List<Color> colors = new ArrayList<>();
        for (Long colorId : body.getColors()) {
            Color color = colorRepository.findById(colorId)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy màu với ID: " + colorId));
            colors.add(color);
        }
        product.setColors(colors);

        // Xử lý danh sách size và số lượng
        List<Size> sizes = new ArrayList<>();
        for (SizeRequest sizeRequest : body.getSizes()) {
            Size size = new Size();
            size.setSizeName(sizeRequest.getSizeName());
            size.setQuantity(sizeRequest.getQuantity());
            sizeRepository.save(size); // Lưu size mới vào cơ sở dữ liệu
            sizes.add(size);
        }
        product.setSizeList(sizes);

        // Thiết lập Category
        Category category = categoryRepository.findById(body.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục với ID: " + body.getCategoryId()));
        product.setCategory(category);

        // Thiết lập Brand
        Brand brand = brandRepository.findById(body.getBrandId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy thương hiệu với ID: " + body.getBrandId()));
        product.setBrand(brand);

        // Lưu sản phẩm vào cơ sở dữ liệu
        productRepository.save(product);
        return product;
    }

    @Override
    public Map<String, Object> getProductsWithPagination(int currentPage, int pageSize) {
        Pageable paging = PageRequest.of(currentPage, pageSize);
        Page<Product> pagedResult = productRepository.findAll(paging);

        Map<String, Object> response = new HashMap<>();
        response.put("products", pagedResult.getContent());
        response.put("currentPage", pagedResult.getNumber());
        response.put("totalItems", pagedResult.getTotalElements());
        response.put("totalPages", pagedResult.getTotalPages());

        return response;
    }

    @Override
    public Map<String, Object> getSaleProducts(int currentPage, int pageSize) {
        Pageable paging = PageRequest.of(currentPage, pageSize);
        Page<Product> pagedResult = productRepository.findByIsSaleTrue(paging);

        Map<String, Object> response = new HashMap<>();
        response.put("products", pagedResult.getContent());
        response.put("currentPage", pagedResult.getNumber());
        response.put("totalItems", pagedResult.getTotalElements());
        response.put("totalPages", pagedResult.getTotalPages());

        return response;
    }
    @Override
    public Map<String, Object> getProductDetail(Long productId) {
        Optional<Product> product = productRepository.findById(productId);
        Map<String, Object> response = new HashMap<>();

        if (product.isPresent()) {
            response.put("product", product.get());
        } else {
            response.put("message", "Product not found");
        }

        return response;
    }


    @Override
    public Map<String, Object> searchProducts(String keyword, int currentPage, int pageSize) {
        Pageable paging = PageRequest.of(currentPage, pageSize);
        Page<Product> pagedResult = productRepository.searchByKeyword(keyword, paging);

        Map<String, Object> response = new HashMap<>();
        response.put("products", pagedResult.getContent());
        response.put("currentPage", pagedResult.getNumber());
        response.put("totalItems", pagedResult.getTotalElements());
        response.put("totalPages", pagedResult.getTotalPages());

        return response;
    }



    @Override
    public Product updateProduct(CreateProductRequest body, Long id) {
        Product product = getProductById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        // Cập nhật thông tin cơ bản của sản phẩm
        product.setName(body.getName());
        product.setPrice(body.getPrice());
        product.setSalePrice(body.getSalePrice());
        product.setDescription(body.getDescription());
        product.setHot(body.isHot());
        product.setSale(body.isSale());
        product.setDeleted(body.isDeleted());
        product.setStatus(body.isStatus());
        product.setUpdatedAt(new Date());

        // Cập nhật danh sách hình ảnh
        List<Image> images = new ArrayList<>();
        for (Long imageId : body.getImages()) {
            Image image = imageRepository.findById(imageId)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy hình ảnh với ID: " + imageId));
            images.add(image);
        }
        product.setImages(images);

        // Cập nhật danh sách màu sắc
        List<Color> colors = new ArrayList<>();
        for (Long colorId : body.getColors()) {
            Color color = colorRepository.findById(colorId)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy màu với ID: " + colorId));
            colors.add(color);
        }
        product.setColors(colors);

        // Cập nhật danh sách size và số lượng
        List<Size> sizes = new ArrayList<>();
        for (SizeRequest sizeRequest : body.getSizes()) {
            Size size = new Size();
            size.setSizeName(sizeRequest.getSizeName());
            size.setQuantity(sizeRequest.getQuantity());
            sizeRepository.save(size); // Lưu size mới vào cơ sở dữ liệu
            sizes.add(size);
        }
        product.setSizeList(sizes);

        // Cập nhật Category
        Category category = categoryRepository.findById(body.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục với ID: " + body.getCategoryId()));
        product.setCategory(category);

        // Cập nhật Brand
        Brand brand = brandRepository.findById(body.getBrandId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy thương hiệu với ID: " + body.getBrandId()));
        product.setBrand(brand);

        // Lưu sản phẩm sau khi cập nhật
        productRepository.save(product);
        return product;
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = getProductById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        productRepository.delete(product);
    }

    @Override
    public Long count() {
        return productRepository.count();
    }

    @Override
    public Long sumAllPrice() {
        return productRepository.sumPriceAll();
    }

    @Override
    public List<Map<String, Object>> sumPriceOfDay(Long month, Long year) {
        return null;
    }

    @Override
    public List<Map<String, Object>> sumPriceOfMonth(Long year) {
        return null;
    }

    @Override
    public void deleteExpiredTickets() {

    }
}

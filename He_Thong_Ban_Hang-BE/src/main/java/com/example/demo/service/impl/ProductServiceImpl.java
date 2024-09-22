package com.example.demo.service.impl;

import com.example.demo.entity.Image;
import com.example.demo.entity.Product;
import com.example.demo.entity.ServiceEntity;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.ImageRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.request.CreateProductRequest;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ServiceRepository serviceRepository;

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
    public Product findListProductByIdAndUserUsername(int id, String username) {
        return productRepository.findListProductByIdAndUserUsername(id, username);
    }

    @Override
    public List<Product> findProductByIdDestinations(Long id) {
        return productRepository.findProductByIdDestinations(id);
    }

    @Override
    public Product createProduct(CreateProductRequest body) {
        Product product = new Product();

        // Tìm danh sách destinations
        if (body.getDestinations() != null) {
            List<Destinations> destinationsList = destinationsService.findDestinationsByName(body.getDestinations());

            if (destinationsList == null || destinationsList.isEmpty()) {
                CreateDestinationsRequest crDestinations = new CreateDestinationsRequest();
                crDestinations.setName(body.getDestinations());
                destinationsService.createDestination(crDestinations);

                destinationsList = destinationsService.findDestinationsByName(body.getDestinations());
            }

            if (destinationsList != null && !destinationsList.isEmpty()) {
                product.setDestinations(destinationsList.get(0));
            } else {
                throw new NotFoundException("Not Found Destinations");
            }
        }

        product.setName(body.getName());
        product.setPrice(body.getPrice());
        product.setStartDate(body.getStartDate());
        product.setEndDate(body.getEndDate());
        product.setStatus(body.getStatus());
        product.setParticipantsCount(body.getParticipantsCount());

        List<Image> images = new ArrayList<>();
        for (long imageId : body.getImages()) {
            Image image = imageRepository.findById(imageId)
                    .orElseThrow(() -> new NotFoundException("Not Found Image With Id: " + imageId));
            images.add(image);
        }
        product.setImages(images);
        productRepository.save(product);
        return product;
    }

    @Override
    public Product updateProduct(CreateProductRequest body, Long id) {
        Product product = getProductById(id).orElseThrow(() -> new NotFoundException("Not Found Product With Id: " + id));

        product.setName(body.getName());
        product.setPrice(body.getPrice());
        product.setStartDate(body.getStartDate());
        product.setEndDate(body.getEndDate());
        product.setStatus(body.getStatus());
        product.setParticipantsCount(body.getParticipantsCount());

        if (body.getDestinations() != null) {
            List<Destinations> destinationsList = destinationsService.findDestinationsByName(body.getDestinations());

            if (destinationsList == null || destinationsList.isEmpty()) {
                CreateDestinationsRequest crDestinations = new CreateDestinationsRequest();
                crDestinations.setName(body.getDestinations());
                destinationsService.createDestination(crDestinations);

                destinationsList = destinationsService.findDestinationsByName(body.getDestinations());
            }

            if (destinationsList != null && !destinationsList.isEmpty()) {
                product.setDestinations(destinationsList.get(0));
            } else {
                throw new NotFoundException("Not Found Destinations");

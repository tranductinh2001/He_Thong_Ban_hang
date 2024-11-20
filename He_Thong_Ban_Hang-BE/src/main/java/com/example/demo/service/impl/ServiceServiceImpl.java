package com.example.demo.service.impl;

import com.example.demo.entity.Product;
import com.example.demo.entity.ServiceEntity;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.request.CreateServiceRequest;
import com.example.demo.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceServiceImpl implements ServiceService {

	@Autowired
	private ServiceRepository serviceRepository;

	@Autowired
	private ProductRepository productRepository;

	@Override
	public List<ServiceEntity> getListService() {
		return serviceRepository.findAll(Sort.by("id").descending());
	}

	@Override
	public List<ServiceEntity> getAllServiceById(Long id) {
		// TODO Auto-generated method stub
		return serviceRepository.findAllById(id);
	}

	@Override
	public Optional<ServiceEntity> finById(long id) {
		Optional<ServiceEntity> OptionalServiceEntity = serviceRepository.findById(id);

		if (OptionalServiceEntity.isPresent()) {
			return OptionalServiceEntity;
		} else {
			return serviceRepository.findById(id);
		}
	}

	@Override
	public List<ServiceEntity> createService(CreateServiceRequest body) {
		List<ServiceEntity> serviceList = new ArrayList<>();

		if (body.getIdProduct() != null && !body.getIdProduct().isEmpty()) {
			for (Long IDProduct : body.getIdProduct()) {
				ServiceEntity service = new ServiceEntity();
				Product product = productRepository.findById(IDProduct)
						.orElseThrow(() -> new NotFoundException("Not Found product With Id: " + IDProduct));
				service.setDescription(body.getDescription());
				service.setName(body.getName());
				service.setPrice(body.getPrice());
				service.setProduct(product);
				serviceList.add(service);
			}
		} else {
			ServiceEntity service = new ServiceEntity();
			service.setDescription(body.getDescription());
			service.setName(body.getName());
			service.setPrice(body.getPrice());
			service.setProduct(null);
			serviceList.add(service);
		}
		// Lưu danh sách ServiceEntity vào cơ sở dữ liệu
		serviceRepository.saveAll(serviceList);
		return serviceList;
	}

	@Override
	public List<ServiceEntity> updateService(CreateServiceRequest body, Long id) {
		List<ServiceEntity> serviceList = new ArrayList<>();

		if (body.getIdProduct() != null && !body.getIdProduct().isEmpty()) { // Chỉnh sửa từ idTour thành idProduct
			for (Long IDProduct : body.getIdProduct()) { // Chỉnh sửa từ IDTour thành IDProduct
				ServiceEntity service = serviceRepository.findById(id)
						.orElseThrow(() -> new NotFoundException("Not Found product service Id: " + id));
				Product product = productRepository.findById(IDProduct)
						.orElseThrow(() -> new NotFoundException("Not Found product With Id: " + IDProduct));
				service.setDescription(body.getDescription());
				service.setName(body.getName());
				service.setPrice(body.getPrice());
				service.setProduct(product);
				serviceList.add(service);
			}
		} else {
			ServiceEntity service = serviceRepository.findById(id)
					.orElseThrow(() -> new NotFoundException("Not Found product service Id: " + id));
			service.setDescription(body.getDescription());
			service.setName(body.getName());
			service.setPrice(body.getPrice());
			service.setProduct(null);
			serviceList.add(service);
		}
		// Lưu danh sách ServiceEntity vào cơ sở dữ liệu
		serviceRepository.saveAll(serviceList);
		return serviceList;
	}

	@Override
	public void deleteService(Long id) {
		ServiceEntity service = finById(id)
				.orElseThrow(() -> new NotFoundException("Not Found service With Id: " + id));
		serviceRepository.delete(service);
	}
}

package com.example.demo.service.impl;

import com.example.demo.entity.Product;
import com.example.demo.entity.ServiceEntity;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.request.CreateServiceRequest;
import com.example.demo.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceServiceImpl implements ServiceService {

	@Autowired
	private ServiceRepository serviceRepository;

	@Autowired
	private ProductRepository productRepository;

	@Override
	public List<ServiceEntity> getListService() {
		return serviceRepository.findAll(Sort.by("id").descending());
	}

	@Override
	public List<ServiceEntity> getAllServiceById(Long id) {
		// TODO Auto-generated method stub
		return serviceRepository.findAllById(id);
	}

	@Override
	public Optional<ServiceEntity> finById(long id) {
		Optional<ServiceEntity> OptionalServiceEntity = serviceRepository.findById(id);

		if (OptionalServiceEntity.isPresent()) {
			return OptionalServiceEntity;
		} else {
			return serviceRepository.findById(id);
		}
	}

	@Override
	public List<ServiceEntity> createService(CreateServiceRequest body) {
		List<ServiceEntity> serviceList = new ArrayList<>();

		if (body.getIdProduct() != null && !body.getIdProduct().isEmpty()) {
			for (Long IDProduct : body.getIdProduct()) {
				ServiceEntity service = new ServiceEntity();
				Product product = productRepository.findById(IDProduct)
						.orElseThrow(() -> new NotFoundException("Not Found product With Id: " + IDProduct));
				service.setDescription(body.getDescription());
				service.setName(body.getName());
				service.setPrice(body.getPrice());
				service.setProduct(product);
				serviceList.add(service);
			}
		} else {
			ServiceEntity service = new ServiceEntity();
			service.setDescription(body.getDescription());
			service.setName(body.getName());
			service.setPrice(body.getPrice());
			service.setProduct(null);
			serviceList.add(service);
		}
		// Lưu danh sách ServiceEntity vào cơ sở dữ liệu
		serviceRepository.saveAll(serviceList);
		return serviceList;
	}

	@Override
	public List<ServiceEntity> updateService(CreateServiceRequest body, Long id) {
		List<ServiceEntity> serviceList = new ArrayList<>();

		if (body.getIdProduct() != null && !body.getIdProduct().isEmpty()) { // Chỉnh sửa từ idTour thành idProduct
			for (Long IDProduct : body.getIdProduct()) { // Chỉnh sửa từ IDTour thành IDProduct
				ServiceEntity service = serviceRepository.findById(id)
						.orElseThrow(() -> new NotFoundException("Not Found product service Id: " + id));
				Product product = productRepository.findById(IDProduct)
						.orElseThrow(() -> new NotFoundException("Not Found product With Id: " + IDProduct));
				service.setDescription(body.getDescription());
				service.setName(body.getName());
				service.setPrice(body.getPrice());
				service.setProduct(product);
				serviceList.add(service);
			}
		} else {
			ServiceEntity service = serviceRepository.findById(id)
					.orElseThrow(() -> new NotFoundException("Not Found product service Id: " + id));
			service.setDescription(body.getDescription());
			service.setName(body.getName());
			service.setPrice(body.getPrice());
			service.setProduct(null);
			serviceList.add(service);
		}
		// Lưu danh sách ServiceEntity vào cơ sở dữ liệu
		serviceRepository.saveAll(serviceList);
		return serviceList;
	}

	@Override
	public void deleteService(Long id) {
		ServiceEntity service = finById(id)
				.orElseThrow(() -> new NotFoundException("Not Found service With Id: " + id));
		serviceRepository.delete(service);
	}
}

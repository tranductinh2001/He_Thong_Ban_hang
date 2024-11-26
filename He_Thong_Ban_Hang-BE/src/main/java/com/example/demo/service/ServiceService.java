package com.example.demo.service;

import com.example.demo.entity.ServiceEntity;
import com.example.demo.request.CreateServiceRequest;

import java.util.List;
import java.util.Optional;


public interface ServiceService {

	List<ServiceEntity> getListService();
	
	List<ServiceEntity> getAllServiceById(Long id);
	
	Optional<ServiceEntity> finById(long id);
	
	List<ServiceEntity> createService(CreateServiceRequest body);
	
	List<ServiceEntity> updateService(CreateServiceRequest body , Long id);
	
	void deleteService(Long id);
}

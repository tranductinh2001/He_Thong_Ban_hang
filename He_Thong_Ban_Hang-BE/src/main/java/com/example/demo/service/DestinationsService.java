package com.example.demo.service;

import java.util.List;

import com.example.demo.request.CreateDestinationsRequest;

public interface DestinationsService {

	List<Destinations> getListDestinations();
	
	List<Destinations> getListDestinationsHot();
	
	List<Destinations> findDestinationsByKeyword(String keyword);
	
	List<Destinations> findDestinationsByName(String name);
	
	Destinations createDestination(CreateDestinationsRequest body);
	
	Destinations updateDestination(CreateDestinationsRequest body, Long id);
	
	void deleteDestination(Long id);
	
	Long count();
}

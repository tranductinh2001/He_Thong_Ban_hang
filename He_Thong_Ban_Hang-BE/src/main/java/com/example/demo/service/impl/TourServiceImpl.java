package com.example.demo.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Image;
import com.example.demo.entity.ServiceEntity;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.ImageRepository;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.repository.TourRepository;
import com.example.demo.request.CreateDestinationsRequest;
import com.example.demo.request.CreateTourRequest;
import com.example.demo.service.DestinationsService;
import com.example.demo.service.TourService;

@Service
public class TourServiceImpl implements TourService {

	@Autowired
	private TourRepository tourrepository;

	@Autowired
	private DestinationsService destinationsService;

	@Autowired
	private ImageRepository imageRepository;
	
	@Autowired
	private ServiceRepository ServiceRepository;

	@Override
	public List<Tour> getListTour() {
		// TODO Auto-generated method stub
		return tourrepository.findAll(Sort.by("id").descending());
	}

	@Override
	public List<Tour> getListTourByName(String name) {
		// TODO Auto-generated method stub
		return tourrepository.findByName(name);
	}

	@Override
	public List<Tour> getListTourByPrice(long price) {
		// TODO Auto-generated method stub
		return tourrepository.findByPrice(price);
	}

	@Override
	public Optional<Tour> getTourById(long id) {
		Optional<Tour> optionalTour = tourrepository.findById(id);

		if (optionalTour.isPresent()) {
			return optionalTour;
		} else {
			return tourrepository.findById(id);
		}
	}

	@Override
	public Tour findListTourByIdAndUserUsername(int id, String name) {
		return tourrepository.findListTourByIdAndUserUsername(id, name);
	}

	@Override
	public List<Tour> findTourByIdDestinations(Long id) {
		// TODO Auto-generated method stub
		return tourrepository.findTourByIdDestinations(id);
	}

	@Override
	public Tour createTour(CreateTourRequest body) {
		Tour tour = new Tour();
		// Tìm danh sách destinations
		if (body.getDestinations() != null) {
			List<Destinations> destinationsList = destinationsService.findDestinationsByName(body.getDestinations());

			if (destinationsList == null || destinationsList.isEmpty()) {
				System.out.println("Destinations not found or empty for: " + body.getDestinations());

				CreateDestinationsRequest crdestinations = new CreateDestinationsRequest();
				crdestinations.setName(body.getDestinations());
				destinationsService.createDestination(crdestinations);

				destinationsList = destinationsService.findDestinationsByName(body.getDestinations());
			}

			if (destinationsList != null && !destinationsList.isEmpty()) {
				tour.setDestinations(destinationsList.get(0));
			} else {
				throw new NotFoundException("Not Found Destinations");
			}
		}
		tour.setName(body.getName());
		tour.setPrice(body.getPrice());
		tour.setStartDate(body.getStartDate());
		tour.setEndDate(body.getEndDate());
		tour.setStatus(body.getStatus());
		tour.setParticipantsCount(body.getParticipantsCount());

		List<Image> images = new ArrayList<>();
		for (long imageId : body.getImages()) {
			Image image = imageRepository.findById(imageId)
					.orElseThrow(() -> new NotFoundException("Not Found Image With Id: " + imageId));
			images.add(image);
		}

		tour.setImages(images);
		tourrepository.save(tour);
		return tour;
	}

	@Override
	public Tour updateTour(CreateTourRequest body, Long id) {
		Tour tour = new Tour();
		tour = getTourById(id).orElseThrow(() -> new NotFoundException("Not Found Image With Id: " + id));
		tour.setName(body.getName());
		tour.setPrice(body.getPrice());
		tour.setStartDate(body.getStartDate());
		tour.setEndDate(body.getEndDate());
		tour.setStatus(body.getStatus());
		tour.setParticipantsCount(body.getParticipantsCount());

		if (body.getDestinations() != null) {
			List<Destinations> destinationsList = destinationsService.findDestinationsByName(body.getDestinations());

			if (destinationsList == null || destinationsList.isEmpty()) {
				System.out.println("Destinations not found or empty for: " + body.getDestinations());

				CreateDestinationsRequest crdestinations = new CreateDestinationsRequest();
				crdestinations.setName(body.getDestinations());
				destinationsService.createDestination(crdestinations);

				destinationsList = destinationsService.findDestinationsByName(body.getDestinations());
			}

			if (destinationsList != null && !destinationsList.isEmpty()) {
				tour.setDestinations(destinationsList.get(0));
			} else {
				throw new NotFoundException("Not Found Destinations");
			}
		}
		
		List<Image> images = new ArrayList<>();
		for (long imageId : body.getImages()) {
			Image image = imageRepository.findById(imageId)
					.orElseThrow(() -> new NotFoundException("Not Found Image With Id: " + imageId));
			images.add(image);
		}

		tour.setImages(images);

		tourrepository.save(tour);
		return tour;
	}

	@Override
	public void deleteTour(Long id) {
		Tour tour = new Tour();
		tour = getTourById(id).orElseThrow(() -> new NotFoundException("Not Found Image With Id: " + id));
		List<ServiceEntity> services = ServiceRepository.findByTour(tour);
		if(services != null && !services.isEmpty()) {
			for (ServiceEntity service : services) {
				service.setTour(null);
			}
			ServiceRepository.saveAll(services);
		}
		tour.getImages().remove(this);
		tourrepository.delete(tour);
	}

	@Override
	public Long count() {
		// TODO Auto-generated method stub
		return tourrepository.count();
	}

	@Override
	public Long sumAllPrice() {
		// TODO Auto-generated method stub
		return tourrepository.sumPriceAll();
	}

	@Override
	public List<Map<String, Object>> sumPriceOfDay(Long thang, Long nam) {
		// TODO Auto-generated method stub
		return tourrepository.sumPriceOfDay(thang, nam);
	}

	@Override
	public List<Map<String, Object>> sumPriceOfMonth(Long nam) {
		// TODO Auto-generated method stub
		return tourrepository.sumPriceOfMonth(nam);
	}

	@Override
	@Scheduled(fixedRate = 86400000)
	public void deleteExpiredTickets() {
		tourrepository.deleteExpiredTour(); // Phương thức này xóa các ticket hết hạn trong repository của bạn
	}
}

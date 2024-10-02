package com.example.demo.repository;

import com.example.demo.entity.Product;
import com.example.demo.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity,Long>{
	
    @Query(value = "Select * from service order by id desc limit :number",nativeQuery = true)
    List<ServiceEntity> getListNewest(int number); //lấy số tour mới  
    
    @Query(value = "SELECT * FROM service s WHERE s.tour_id = :id",nativeQuery = true)
    List<ServiceEntity> findAllById(Long id);
    
    Optional<ServiceEntity> findById(Long id);

    List<ServiceEntity> findByProduct(Product product);
}

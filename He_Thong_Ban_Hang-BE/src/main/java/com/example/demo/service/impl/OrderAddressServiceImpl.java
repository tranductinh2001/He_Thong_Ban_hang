package com.example.demo.service.impl;

import com.example.demo.DTO.OrderAddressDTO;
import com.example.demo.entity.OrderAddress;
import com.example.demo.entity.User;
import com.example.demo.repository.OrderAddressRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.OrderAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class OrderAddressServiceImpl implements OrderAddressService {

    @Autowired
    private OrderAddressRepository orderAddressRepository;


    @Autowired
    private UserRepository userRepository;

    @Override
    public List<OrderAddress> getAllOrderAddressByUserId(Long userId) {
        System.out.println("id  ấy địa chi ne  "+ userId);
        return orderAddressRepository.findByUserId(userId);
    }

    @Override
    public List<OrderAddress> setDefaultOrderAddress(Long id) {
        Optional<OrderAddress> optionalOrderAddress = orderAddressRepository.findById(id);
        if (!optionalOrderAddress.isPresent()) {
            throw new NoSuchElementException("OrderAddress not found with id: " + id);
        }

        OrderAddress orderAddressToSetDefault = optionalOrderAddress.get();
        Long userId = orderAddressToSetDefault.getUser().getId();

        // Lấy tất cả địa chỉ của người dùng
        List<OrderAddress> listOrderAddress = orderAddressRepository.findByUserId(userId);

        // Gỡ bỏ trạng thái mặc định cho tất cả địa chỉ
        listOrderAddress.forEach(orderAddress -> {
            orderAddress.setIsDefault(false);
        });

        // Đặt trạng thái mặc định cho địa chỉ được chọn
        orderAddressToSetDefault.setIsDefault(true);
        orderAddressRepository.save(orderAddressToSetDefault);

        // Cập nhật tất cả các địa chỉ
        orderAddressRepository.saveAll(listOrderAddress);

        return listOrderAddress;
    }

    @Override
    public OrderAddress createOrderAddress(OrderAddressDTO orderAddressDTO) {
        System.out.println("oder tao ne "+ orderAddressDTO);
        // Map DTO thành Entity
        OrderAddress orderAddress = new OrderAddress();
        orderAddress.setName(orderAddressDTO.getName());
        orderAddress.setAddress(orderAddressDTO.getAddress());
        orderAddress.setIsDefault(orderAddressDTO.getIsDefault() != null ? orderAddressDTO.getIsDefault() : false);
        orderAddress.setIsDeleted(orderAddressDTO.getIsDeleted() != null ? orderAddressDTO.getIsDeleted() : false);

        // Gán thời gian tạo và cập nhật
        orderAddress.setCreatedAt(orderAddressDTO.getCreatedAt() != null ? orderAddressDTO.getCreatedAt() : new Date());
        orderAddress.setUpdatedAt(orderAddressDTO.getUpdatedAt() != null ? orderAddressDTO.getUpdatedAt() : new Date());

        // Gán User nếu có userId
        if (orderAddressDTO.getUserId() != null) {
            User user = userRepository.findById(orderAddressDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + orderAddressDTO.getUserId()));
            orderAddress.setUser(user);
        }

        // Debug thông tin đã mapping
//        System.out.println("Mapped OrderAddress: " + orderAddress);
        return orderAddressRepository.save(orderAddress);
    }
}

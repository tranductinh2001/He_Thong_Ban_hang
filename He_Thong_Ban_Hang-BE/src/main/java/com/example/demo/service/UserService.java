package com.example.demo.service;

import java.util.List;

import com.example.demo.DTO.UserDTO;
import com.example.demo.entity.User;
import com.example.demo.request.ChangePasswordRequest;
import com.example.demo.request.CreateUserRequest;
import com.example.demo.request.UpdateProfileRequest;
import com.example.demo.request.UpdateUserRequest;

public interface UserService {
	UserDTO getUserProfile();
	List<User> getListUserByVerificationCode(String code);
	User findByUsername(String username);
	String getAuthenticationCodeForUser(String username);
	
	void saveAuthenticationCodeForUser();
	
    void register(CreateUserRequest request);

    User getUserByUsername(String username);

    User updateUser(Long id, UpdateUserRequest request);
	User updateUserProfile(Long id, UpdateProfileRequest request);
    boolean changePassword(ChangePasswordRequest request);
    
    Long countUser();
    
	List<User> getAllUser();

	void deleteUser(Long id);

	Long count();
	
	void updateUserEnabledStatus(String username, Long status);
	
	Long countEnabled();
}

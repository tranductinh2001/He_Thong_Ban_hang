package com.example.demo.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import com.example.demo.DTO.UserDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.ERole;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.request.ChangePasswordRequest;
import com.example.demo.request.CreateUserRequest;
import com.example.demo.request.UpdateProfileRequest;
import com.example.demo.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	private static final int CODE_LENGTH = 8;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder encoder;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private ModelMapper modelMapper;

	public static String generateCode() {
		Random random = new Random();
		StringBuilder code = new StringBuilder(CODE_LENGTH);

		for (int i = 0; i < CODE_LENGTH; i++) {
			int randomIndex = random.nextInt(CHARACTERS.length());
			code.append(CHARACTERS.charAt(randomIndex));
		}

		return code.toString();
	}



	public String getAuthenticationCodeForUser(String username) {
		Optional<User> optionalUser = userRepository.findByUsername(username);
		return optionalUser.map(User::getVerificationCode).orElse(null);
	}

	public void saveAuthenticationCodeForUser(String username) {
		String code = generateCode();
		List<User> users = userRepository.getListUserByVerificationCode(code);
		for (int i = 0; i < users.size(); i++) {
			System.out.print("users     " + users.toString());
		}
		if (!((users.size()) >= 1)) {
			User user = getUserByUsername(username);
			if (user != null) {
				user.setVerificationCode(code);
				userRepository.save(user);
			} else {
				User newUser = new User();
				newUser.setEmail(username);
				newUser.setVerificationCode(code);
				userRepository.save(newUser);
			}
		} else {
			saveAuthenticationCodeForUser(username);
		}
	}
	@Override
	public UserDTO getUserProfile() {
		String username = getCurrentUsername();
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("User not found"));

		return modelMapper.map(user, UserDTO.class);
	}

	private String getCurrentUsername() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
			throw new RuntimeException("User not authenticated");
		}
		UserDetails userDetails = (UserDetails) authentication.getPrincipal();
		return userDetails.getUsername();
	}

	@Override
	public void register(CreateUserRequest request) {
		System.out.println(" register đã được thực thi "+request);
		// TODO Auto-generated method stub
		User user = new User();

		// Set các thuộc tính từ request\
		user.setUsername(request.getEmail());
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setEmail(request.getEmail());
		user.setNumberPhone(request.getNumberPhone());
		user.setAddress(request.getAddress());

		// Định dạng ngày tháng
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

		try {
			Date dob = formatter.parse(request.getDob());
			user.setDob(dob);
		} catch (ParseException e) {
			System.out.println("Lỗi: Định dạng ngày tháng không hợp lệ.");
			throw new RuntimeException("Ngày tháng không hợp lệ: " + e.getMessage());
		}

		// Mã hóa mật khẩu
		user.setPassword(encoder.encode(request.getPassword()));

		// Lấy danh sách quyền từ request
//		Set<String> strRoles = request.getRole();
//		Set<Role> roles = new HashSet<>();
//
//		if (strRoles == null || strRoles.isEmpty()) {
//			// Mặc định cấp quyền ROLE_USER nếu không có quyền nào trong request
//			Role userRole = roleRepository.findByName(ERole.ROLE_USER)
//					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//			roles.add(userRole);
//		} else {
//			// Gán các quyền từ request vào cho người dùng
//			strRoles.forEach(role -> {
//				switch (role) {
//					case "admin":
//						Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
//								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//						roles.add(adminRole);
//						break;
//					case "mod":
//						Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
//								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//						roles.add(modRole);
//						break;
//					default:
//						Role userRole = roleRepository.findByName(ERole.ROLE_USER)
//								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//						roles.add(userRole);
//				}
//			});
//		}
//
//		// Set các quyền cho người dùng
//		user.setRoles(roles);

		// Đánh dấu tài khoản là chưa kích hoạt (chờ xác thực qua email chẳng hạn)
		user.setEnabled(false);
		userRepository.save(user);
	}

	@Override
	public User getUserByUsername(String username) {
		// TODO Auto-generated method stub
		User user = userRepository.findByUsername(username).orElseThrow(() -> new NotFoundException("Not Found User"));
		return user;
	}

	@Override
	public User updateUser(UpdateProfileRequest request) {
		// TODO Auto-generated method stub
		User user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new NotFoundException("Not Found User"));
		user.setFirstName(request.getFirstname());
		user.setLastName(request.getLastname());
		user.setEmail(request.getEmail());
		user.setAddress(request.getCountry());
		//user.setState(request.getState());
		user.setAddress(request.getAddress());
		user.setNumberPhone(request.getPhone());
		userRepository.save(user);
		return user;
	}

	@Override
	public void changePassword(ChangePasswordRequest request) {
		// TODO Auto-generated method stub
		User user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new NotFoundException("Not Found User"));
		// if(encoder.encode(request.getOldPassword()) != user.getPassword())
		if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
			throw new BadRequestException(
					"nhập sai mật khẩu hiện tại" + request.getOldPassword() + "mk sv: " + user.getPassword());
		}
		System.out.print(request.getOldPassword() + "mk sv: " + user.getPassword());
		user.setPassword(encoder.encode(request.getNewPassword()));
		userRepository.save(user);
	}

	@Override
	public List<User> getListUserByVerificationCode(String code) {
		// TODO Auto-generated method stub
		return userRepository.getListUserByVerificationCode(code);
	}

	@Override
	public Long countUser() {
		// TODO Auto-generated method stub
		return userRepository.countUser();
	}

	@Override
	public List<User> getAllUsser() {
		// TODO Auto-generated method stub
		return userRepository.findAll();
	}

	@Override
	public Long count() {
		// TODO Auto-generated method stub
		return userRepository.count();
	}

	@Override
	public void updateUserEnabledStatus(String username, Long status) {
		// TODO Auto-generated method stub
		User user = userRepository.findByUsername(username).orElseThrow(() -> new NotFoundException("Not Found User"));
		if (status == 1) {
			user.setEnabled(true);
		} else if (status == 0) {
			user.setEnabled(false);
		}
		userRepository.save(user);
	}

	@Override
	public Long countEnabled() {
		// TODO Auto-generated method stub
		return userRepository.sumEnabledValues();
	}

}
